<?php

namespace App\Controller\Subtitles;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\Movie;

use SplFileObject;

class SubtitlesController extends AbstractController
{
    private $_downloadPath = "/var/lib/transmission-daemon/complete/";
    private $_token = null;

    private function _xmlRequest($request, $args) {
        $request = xmlrpc_encode_request($request, $args);
        $context = stream_context_create(['http' =>
            [
                'method' => "POST",
                'header' => "Content-Type: text/xml",
                'content' => $request
            ]
        ]);
        $file = file_get_contents("https://api.opensubtitles.org/xml-rpc", false, $context);
        $response = xmlrpc_decode($file);
        if ($response && xmlrpc_is_fault($response)) {
            return null;
        } else {
            return $response;
        }
    }

    private function _setXmlToken() {
        $response = $this->_xmlRequest("LogIn", ['hypertube2019', 'hypertube2019', 'fr', 'TemporaryUserAgent']);
        if ($response) {
            $this->_token = $response['token'];
        }
    }

    public function __invoke($id) {
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->find($id);

        if (!$movie) {
            return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 401);
        }

        $this->_initClient();

        $filePath = $this->_downloadPath . $movie->getFileName();
        $file = new SplFileObject($filePath);

        // Check file existence
        if (!($file->isFile())) {
            throw $this->createNotFoundException('Error getting movie at path ' . $totalPath);
        }

        $size = $file->getSize();
        $file = null;

        $this->_setXmlToken();
        return new JsonResponse(['token' => $this->_token])
    }
}
