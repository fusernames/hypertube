<?php

namespace App\Controller\Subtitles;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\Movie;

use KickAssSubtitles\OpenSubtitles\Client;

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

    public function __invoke(Request $request) {
        $this->_initClient();

        $response = $this->_client->searchSubtitles([
            [
                'sublanguageid' => 'en',
                'moviehash' => '163ce22b6261f50a',
                'moviebytesize' => '2094235131'
            ]
        ]);

        return new JsonResponse(['response' => $response->toArray()]);
    }
}
