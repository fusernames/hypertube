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
        // Parsing request's json
        $data = $request->getContent();
        $data = json_decode($data, true);
        if (!isset($data['torrent_link'])) {
            return new JsonResponse(['error' => 'WRONG_DATA'], 403);
        }
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->findOneBy(['torrentLink' => $data['torrent_link']]);
        if (file_exists($this->_downloadPath . $movie->getFileName())) {
            return new JsonResponse(['ggnegro' => 'gg']);
        }
        return new JsonResponse(['perdu' => 't nul']);
    }
}
