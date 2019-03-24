<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

// Use the FFMpeg tool
use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;

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

        $ffmpeg =  FFMpeg::create();
        $videosDirectory = $this->get('kernel')->getRootDir() . '/';
        $video = $ffmpeg->open($videosDirectory . '/Video.avi');
        $mp4Format = new X264();
        $mp4Format->setAudioCodec("libmp3lame");
        $video->save($mp4Format, $videosDirectory . '/Video.mp4');

        return new Response("webm video succesfully converted to mp4");
    }
}
