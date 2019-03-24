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
        $config = array(
            'host'     => 'http://127.0.0.1',
            'endpoint' => '\/transmission\/',
            'username' => 'transmission',
            'password' => '12345678'
        );
        $this->transmission = new Transmission($config);
        $this->transmission->add('magnet:?xt=urn:btih:11A2AC68A11634E980F265CB1433C599D017A759&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337');
    }

    /**
     * @Route("/status", name="test3")
     */
    public function status() {
        return new Response($this->transmission->getStats());
    }
}
