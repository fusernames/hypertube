<?php

namespace App\Controller\Torrent;

use App\Entity\Movie;
use Vohof\Transmission;
use App\Controller\Torrent\TorrentController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class StatusTorrentController extends TorrentController
{
    public function __invoke(Request $request)
    {
        $transmission = new Transmission($this->transmissionConfig);
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        // Decodes post json
        $data = $request->getContent();
        $data = json_decode($data, true);
        if (!isset($data['torrent_link'])) return new JsonResponse(['error' => 'WRONG_DATA'], 404);
        $torrentLink = $data['torrent_link'];
        // Loads the asked movie
        $movie = $repository->findOneBy(['torrentLink' => $torrentLink]);
        // If unknown id, returns
        if (!$movie) return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 403);
        $infos = $transmission->get($movie->getTorrentId())['torrents'];
        if (sizeof($infos) === 1) {
            $infos = $infos[0];
            $percentDone = $infos['percentDone'];
            // If download is finished, put movie as finished.
            if (($percentDone === 1 || $infos['isFinished'] === true || $infos['leftUntilDone'] === 0) && $infos['status'] !== 4) {
                $transmission->remove($movie->getTorrentId());
                $movie->setFinished(true);
                $entityManager->presist($movie);
                $entityManager->flush();
                $this->forward('App\Controller\Torrent\RemoveOldMoviesController::check');
                return new JsonResponse(['success' => 'DOWNLOAD_ENDED'], 201);
            }
            // Download percentage
            return new JsonResponse(['success' => $percentDone], 200);
        } else {
            // Film might be download then
            return new JsonResponse(['success' => 'DOWNLOAD_ENDED'], 201);
        }
    }
}
