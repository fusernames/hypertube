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
use Vohof\Transmission;

class IndexController extends AbstractController
{
    public $config = [
        'host'     => 'http://127.0.0.1',
        'endpoint' => '/transmission/rpc',
        'username' => 'foo', // Optional
        'password' => 'bar' // Optional
    ];

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
        $torrentDir = $this->getParameter('kernel.project_dir') . '/public/torrents';
        $this->transmission  = new Transmission($this->config);
        $torrent = $this->transmission->add(base64encode(file_get_contents($this->getParameter('kernel.project_dir') . '/torrent.torrent')), true);
        $this->transmission->start($torrent);
    }

    /**
     * @Route("/status", name="test3")
     */
    public function status() {
        return new Response($this->transmission->getStats());
    }
}
