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

class IndexController extends AbstractController
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
    public function dlTorrent() {
        $transmission = new Transmission($this->transmissionConfig);
        $torrent = $transmission->add(base64_encode(file_get_contents("https://yts.am/torrent/download/DCAED080216E8495EADFA2D72EB16E2E9B9A7172")), true);
        // $torrent = $transmission->add('magnet:?xt=urn:btih:11A2AC68A11634E980F265CB1433C599D017A759&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337');
        return new JsonResponse($transmission->getStats());
    }
}
