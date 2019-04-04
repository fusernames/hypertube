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

    public function addMovie($torrent, $torrentLink) {
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
            ;
            $entityManager->persist($movie);
            $entityManager->flush();
        }
    }
}
