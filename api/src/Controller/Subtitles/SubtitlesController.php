<?php

namespace App\Controller\Subtitles;

use App\Entity\Movie;
use KickAssSubtitles\OpenSubtitles\Client;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SubtitlesController extends AbstractController
{
    private $_client;

    private function _initClient() {
        $this->_client = Client::create([
            'username'  => 'hypertube2019',
            'password'  => 'hypertube2019',
            'useragent' => 'TemporaryUserAgent',
        ]);
    }

    public function __invoke() {
        $this->_initClient();
    }
}
