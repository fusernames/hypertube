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

// Using Icicle to do async stuff
use Icicle\Awaitable;
use Icicle\Coroutine\Coroutine;
use Icicle\Loop;

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
        $encode = function() {
            try {
                $ffmpeg =  FFMpeg::create([
                    'timeout' => 0
                ]);
                $videosDirectory = $this->getParameter('kernel.project_dir');
                $video = $ffmpeg->open($videosDirectory . '/Video.avi');
                $mp4Format = new X264();
                $mp4Format->setAudioCodec("libmp3lame");
                $video->save($mp4Format, $videosDirectory . '/Video.mp4');
                yield Awaitable\resolve("Encoding complete.");
            } catch (\Exception $e) {
                yield Awaitable\reject($e);
            }
        };
        $coroutine = new Coroutine($encode);
        $coroutine->done(function ($data) {
            echo $data, "\n";
        });
        Loop\run();
    }
}
