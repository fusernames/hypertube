<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

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

    /**
     * @Route("/torrent/download", name="download_torrent", methods={"POST"})
     */
    public function dlTorrent(Request $request) {
        $data = $request->getContent();
        $data = json_decode($data);
        $transmission = new Transmission($this->transmissionConfig);
        if ($data['torrent_magnet'] !== null) {
            $torrent = $transmission->add($data['torrent_magnet']);
        } else if ($data['torrent_magnet'] !== null) {
            $torrent = $transmission->add(base64_encode(file_get_contents($data['torrent_magnet'])), true);
        } else {
            return new JsonResponse(['error' => 'POST_ERROR']);
        }
    }
}
