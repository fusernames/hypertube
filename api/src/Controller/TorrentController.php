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
                ->setFinished(false)
            ;
            $entityManager->persist($movie);
            $entityManager->flush();
        }
    }

    // /**
    //  * @Route("/torrent/download", name="download_torrent", methods={"POST"})
    //  */
    // public function dlTorrent(Request $request) {
    //     $transmission = new Transmission($this->transmissionConfig);
    //     // Decodes post json
    //     $data = $request->getContent();
    //     $data = json_decode($data, true);
    //     if (isset($data['torrent_magnet'])) {
    //         $torrent = $transmission->add($data['torrent_magnet']);
    //         $this->addMovie(
    //             isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'],
    //             $data['torrent_magnet']
    //         );
    //     } else if (isset($data['torrent_url'])) {
    //         $torrent = $transmission->add(base64_encode(file_get_contents($data['torrent_url'])), true);
    //         $this->addMovie(
    //             isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'],
    //             $data['torrent_url']
    //         );
    //     } else {
    //         // Torrent might be already downloaded
    //         return new JsonResponse(['error' => 'POST_ERROR']);
    //     }
    //     // Id is temporary since idk how entity works
    //     return new JsonResponse(['success' => 'TORRENT_DL_SUCCESS']);
    // }

    // /**
    //  * @Route("/torrent/status", name="status_torrent", methods={"POST"})
    //  */
    // public function statusTorrent(Request $request) {
    //     $transmission = new Transmission($this->transmissionConfig);
    //     $entityManager = $this->getDoctrine()->getManager();
    //     $repository = $entityManager->getRepository(Movie::class);
    //     // Decodes post json
    //     $data = $request->getContent();
    //     $data = json_decode($data, true);
    //     if (!isset($data['torrent_link'])) return new JsonResponse(['error' => 'NOT_DOWNLOADED_TORRENT']);
    //     $torrentLink = $data['torrent_link'];
    //     // Loads the asked movie
    //     $movie = $repository->findOneBy(['torrentLink' => $torrentLink]);
    //     // If unknown id, returns
    //     if (!$movie) return new JsonResponse(['error' => 'UNKNOWN_MOVIE']);
    //     $infos = $transmission->get($movie->getTorrentId())['torrents'];
    //     if (sizeof($infos) === 1) {
    //         $infos = $infos[0];
    //         $percentDone = $infos['percentDone'];
    //         // If download is finished, put movie as finished.
    //         if (($percentDone === 1 || $infos['isFinished'] === true || $infos['leftUntilDone'] === 0) && $infos['status'] !== 4) {
    //             $transmission->remove($movie->getTorrentId());
    //             $movie->setFinished(true);
    //             $entityManager->flush();
    //             return new JsonResponse(['success' => 'DOWNLOAD_ENDED']);
    //         }
    //         // Download percentage
    //         return new JsonResponse(['success' => $percentDone]);
    //     } else {
    //         // Film might be download then
    //         return new JsonResponse(['error' => 'UNKNOWN_TORRENT']);
    //     }
    // }
}
