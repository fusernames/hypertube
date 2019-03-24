<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

// Temp
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

// Use the FFMpeg tool
use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;

// Transmission tests
use Transmission\Client;
use Transmission\Transmission;

class IndexController extends AbstractController
{
    public $transmission;

    /**
     * @Route("/", name="index")
     */
    public function index()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/test", name="test")
     */
    public function test(Request $request) {
        $encode = function (string $filename) {
            try {
                $ffmpeg =  FFMpeg::create([
                    'timeout' => 0
                ]);
                $videosDirectory = $this->getParameter('kernel.project_dir');
                $video = $ffmpeg->open($videosDirectory . '/' . $filename);
                $mp4Format = new X264();
                $mp4Format->setAudioCodec("libmp3lame");
                // CHANGER LE NOM DE SAVE WOLA.
                $video->save($mp4Format, $videosDirectory . '/Video.mp4');
                return "file encoded successfoullie";
            } catch (\Exception $e) {
                throw $e;
            }
        };
        return new Response($encode("Video.avi"));
    }

    /**
     * @Route("/torrent", name="test2")
     */
    public function dlTorrent() {
        $client = new Client();
        $client->authenticate('username', 'password');
        $this->transmission = new Transmission();
        $this->transmission->setClient($client);
    }

    /**
     * @Route("/status", name="test3")
     */
    public function status() {
        return new Response($this->transmission->getStats());
    }
}
