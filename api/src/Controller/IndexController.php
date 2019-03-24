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

// Async stuff
use Spatie\Async\Pool;

class IndexController extends AbstractController
{
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
        $pool = Pool::create();
        $pool->add($encode("Video.avi"))
        ->then(function (string $resp) {
            $response .= $resp;
        })
        ->catch(function (\Exception $e) {
            throw $e;
        });
        $response = "test sa mère<br/>";
        return new Response($response);
    }
}
