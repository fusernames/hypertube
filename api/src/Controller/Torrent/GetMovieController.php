<?php

namespace App\Controller\Torrent;

use SplFileObject;
use App\Entity\Movie;
use App\Controller\Torrent\TorrentController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\Stream;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

use Vohof\Transmission;

class GetMovieController extends TorrentController
{

    /**
     * @param Request $request
     * @param [type] $id
     * @return void
     */
    public function __invoke(Request $request, $id) {
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->find($id);

        if (!$movie) {
            return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 401);
        }

        $totalPath = $this->_downloadPath . $movie->getFileName();

        if (!file_exists($totalPath)) {
            return new JsonResponse(['error' => 'MOVIE_FILE_NULL'], 404);
        }

        // Check file existence
        if (!($file->isFile())) {
            throw $this->createNotFoundException('Error getting movie at path ' . $totalPath);
        }

        if (!$movie->getFinished()) {
            $transmission = new Transmission($this->transmissionConfig);
            $infos = $transmission->get($movie->getTorrentId())['torrents'];
            if (sizeof($infos) !== 1) {
                return new JsonResponse(['error' => 'UNKNOWN_TORRENT'], 404);
            } else if ($infos[0]['isFinished'] === true) {
                $transmission->remove($movie->getTorrentId());
                $movie->setFinished(true);
                $entityManager->persist($movie);
                $entityManager->flush();
            }
        }

        return new BinaryFileResponse($totalPath);
    }
}
