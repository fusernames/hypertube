<?php

namespace App\Controller\Torrent;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Entity\Movie;

use Vohof\Transmission;

class TorrentController extends AbstractController
{
    /**
     * Transmission configuration.
     *
     * @var array
     */
    public $transmissionConfig = [
        'host'     => 'http://127.0.0.1:9091',
        'endpoint' => '/transmission/rpc',
        'username' => 'transmission',
        'password' => '12345678'
    ];

    /**
     * @var string
     */
    protected $_downloadPath = "/var/lib/transmission-daemon/complete/";

    /**
     * Adds a movie to the db
     */
    public function addMovie($torrent, $torrentLink, $apiid) {
        $transmission = new Transmission($this->transmissionConfig);
        $entityManager = $this->getDoctrine()->getManager();
        $searched = $entityManager->getRepository(Movie::class)->findOneBy(['torrentLink' => $torrentLink]);
        if (!$searched) {
            $data = $transmission->get($torrent['id']);
            $movie = new Movie();
            $movie
                ->setName($torrent['name'])
                ->setTorrentLink($torrentLink)
                ->setTorrentId($torrent['id'])
                ->setFinished(false)
                ->setAPIId($apiid)
            ;
            $entityManager->persist($movie);
            $entityManager->flush();
        }
    }

    /**
     * Parse all files downloaded by torrent to get the biggest -> the movie
     */
    public function getMovieFile($infos) {
        if (sizeof($infos['files']) === 0) return null;
        $movieFile = $infos['files'][0];
        foreach ($infos['files'] as $file) {
            if ($file['length'] > $movieFile['length']) {
                $movieFile = $file;
            }
        }
        return $movieFile;
    }
}
