<?php

namespace App\Controller\Torrent;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

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
}
