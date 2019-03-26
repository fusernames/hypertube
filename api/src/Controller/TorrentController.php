<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\Movie;

use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;
use Vohof\Transmission;

class TorrentController extends AbstractController
{
    /**
     * Transmission configuration.
     */
    public $transmissionConfig = [
        'host'     => 'http://127.0.0.1:9091',
        'endpoint' => '/transmission/rpc',
        'username' => 'transmission',
        'password' => '12345678'
    ];

    public function encode(string $filename) {
        try {
            // Videos are fat, no timeout
            $ffmpeg =  FFMpeg::create([
                'timeout' => 0
            ]);
            $videosDirectory = '/var/lib/transmission-daemon/complete/';
            // Opening video and setting formats.
            $video = $ffmpeg->open($videosDirectory . $filename);
            $mp4Format = new X264();
            $mp4Format->setAudioCodec("libmp3lame");
            // Getting video name and changing it to .mp4
            $exploded = explode('.', $filename);
            $exploded[sizeof($exploded) - 1] = 'mp4';
            $savename = implode('.', $exploded);
            // Saving the video
            $video->save($mp4Format, $videosDirectory . $savename);
        } catch (\Exception $e) {
            throw $e;
        }
    }

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
            ;
            $entityManager->persist($movie);
            $entityManager->flush();
        }
    }

    /**
     * @Route("/torrent/download", name="download_torrent", methods={"POST"})
     */
    public function dlTorrent(Request $request) {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $transmission = new Transmission($this->transmissionConfig);
        if (isset($data['torrent_magnet'])) {
            $torrent = $transmission->add($data['torrent_magnet']);
            $this->addMovie(
                isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'],
                $data['torrent_magnet']
            );
        } else if (isset($data['torrent_url'])) {
            $torrent = $transmission->add(base64_encode(file_get_contents($data['torrent_url'])), true);
            $this->addMovie(
                isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'],
                $data['torrent_url']
            );
        } else {
            // Torrent might be already downloaded
            return new JsonResponse(['error' => 'POST_ERROR']);
        }
        // Id is temporary since idk how entity works
        return new JsonResponse(['success' => 'TORRENT_DL_SUCCESS']);
    }

    /**
     * @Route("/torrent/status/{id}", name="status_torrent", requirements={"id"="\d+"})
     */
    public function statusTorrent($id) {
        $transmission = new Transmission($this->transmissionConfig);
        $repository = $this->getDoctrine()->getRepository(Movie::class);
        $searched = $repository->find($id);
        if (!$searched) return new JsonResponse(['error' => 'UNKNOWN_MOVIE']);
        $infos = $transmission->get($searched->getTorrentId())['torrents'];
        if (sizeof($infos) === 1) {
            $infos = $infos[0];
            return new JsonResponse(['success' => ($infos['downloadedEver'] / $infos['totalSize'])]);            
        } else {
            return new JsonResponse(['error' => 'UNKNOWN_TORRENT']);
        }
    }
}
