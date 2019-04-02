<?php

namespace App\Controller;

use App\Entity\Movie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\Stream;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class GetMovieController extends AbstractController
{
    private $_downloadPath = "/var/lib/transmission-daemon/complete/";

    public function __invoke(Request $request) {
        return new JsonResponse(['request' => $request]);
        // Parsing request's json
        $data = $request->getContent();
        $data = json_decode($data, true);
        if (!isset($data['torrent_link'])) {
            return new JsonResponse(['error' => 'WRONG_DATA'], 403);
        }
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->findOneBy(['torrentLink' => $data['torrent_link']]);
        $totalPath = $this->_downloadPath . $movie->getFileName();
        if (file_exists($totalPath)) {
            $stream = new Stream($totalPath);
            $response = new BinaryFileResponse($stream);
            $response->setAutoEtag(true);
            $response->headers->set('Content-Type', 'video/mp4');
            return $response;
        }
        return new JsonResponse(['perdu' => 't nul']);
    }
}
