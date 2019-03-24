<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

// Temp
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

// Use the FFMpeg tool
use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;

// Transmission tests
use Vohof\Transmission;

class IndexController extends AbstractController
{
    public $transmissionConfig = [
        'host'     => 'http://127.0.0.1:9091',
        'endpoint' => '/transmission/rpc',
        'username' => 'transmission',
        'password' => '12345678'
    ];

    /**
     * @Route("/", name="index")
     */
    public function index()
    {
        return $this->render('base.html.twig');
    }

    public function encode(string $filename) {
        try {
            $ffmpeg =  FFMpeg::create([
                'timeout' => 0
            ]);
            $videosDirectory = '/var/lib/transmission-daemon/complete/';
            $video = $ffmpeg->open($videosDirectory . $filename);
            $mp4Format = new X264();
            $mp4Format->setAudioCodec("libmp3lame");
            // CHANGER LE NOM DE SAVE WOLA.
            $video->save($mp4Format, $videosDirectory . '/Video.mp4');
            return "File successfully encoded.";
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @Route("/torrent", name="test2")
     */
    public function dlTorrent() {
        $transmission = new Transmission($this->transmissionConfig);
	$transmission->add(base64_encode(file_get_contents("https://yts.am/torrent/download/DCAED080216E8495EADFA2D72EB16E2E9B9A7172")), true);
	// return new JsonResponse($transmission->getStats());
        // $transmission->add(base64_encode(file_get_contents("file.torrent")), true);
        $transmission->add('magnet:?xt=urn:btih:11A2AC68A11634E980F265CB1433C599D017A759&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337');
        return new JsonResponse($transmission->getStats());
    }
}
