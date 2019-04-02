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

    public function __invoke($id) {
        // Parsing request's json
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->find($id);
        if (!$movie) {
            return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 401);
        }
        $totalPath = $this->_downloadPath . $movie->getFileName();
        if (file_exists($totalPath)) {
            $stream = new Stream($totalPath);
            $response = new BinaryFileResponse($stream);
            $response->setAutoEtag(true);
            $response->headers->set('Content-Type', 'video/mp4');
            return $response;
        }
        return new JsonResponse(['error' => 'UNKNOWN_MOVIE']);
    }
}
