<?php

namespace App\Controller\Torrent;

use App\Entity\Movie;
use Vohof\Transmission;
use App\Controller\Torrent\TorrentController;
use App\Controller\Torrent\RemoveOldMoviesController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class StatusTorrentController extends TorrentController
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function __invoke(Request $request)
    {
        $transmission = new Transmission($this->transmissionConfig);
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        // Decodes post json
        $data = $request->getContent();
        $data = json_decode($data, true);
        if (!isset($data['torrent_link'])) return new JsonResponse(['error' => 'WRONG_DATA'], 403);
        $torrentLink = $data['torrent_link'];
        // Loads the asked movie
        $movie = $repository->findOneBy(['torrentLink' => $torrentLink]);
        // If unknown id, returns
        if (!$movie) return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 404);
        $infos = $transmission->get($movie->getTorrentId())['torrents'];
        if (sizeof($infos) === 1) {
            $infos = $infos[0];
            $percentDone = $infos['percentDone'];
            // If download is finished, put movie as finished.
            if (($percentDone === 1 || $infos['isFinished'] === true || $infos['leftUntilDone'] === 0) && $infos['status'] !== 4) {
                $transmission->remove($movie->getTorrentId());
                // Movie set as finished
                $movie->setFinished(true);
                $movieFile = $this->getMovieFile($infos);
                // Set file name if not set
                !$movie->getFileName() ? $movie->setFileName($movieFile['name']) : 0;
                $entityManager->persist($movie);
                $entityManager->flush();
                $remover = new RemoveOldMoviesController();
                $remover->check($entityManager);
                return new JsonResponse(['success' => 'DOWNLOAD_ENDED', 'movieId' => $movie->getId()], 201);
            }
            // Set movie file name
            if (!$movie->getFileName()) {
                $movieFile = $this->getMovieFile($infos);
                if ($movieFile !== null) {
                    $movie->setFileName($movieFile['name']);
                    $entityManager->persist($movie);
                    $entityManager->flush();
                }
            }
            // Download percentage
            return new JsonResponse(['success' => ($percentDone * 100 * 20), 'movieId' => $movie->getId()], 200);
        } else {
            // Film might be download then
            return new JsonResponse(['success' => 'DOWNLOAD_ENDED', 'movieId' => $movie->getId()], 201);
        }
    }
}
