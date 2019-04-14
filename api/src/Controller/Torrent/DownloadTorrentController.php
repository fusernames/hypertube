<?php

namespace App\Controller\Torrent;

use Vohof\Transmission;
use App\Entity\Movie;
use App\Controller\Torrent\TorrentController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DownloadTorrentController extends TorrentController
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
        if (!isset($data['apiid'])) return new JsonResponse(['error' => 'NULL_APIID']);
        if (isset($data['torrent_magnet'])) {
            $movie = $repository->findOneBy(['torrentLink' => $data['torrent_magnet']]);
            if ($movie) return new JsonResponse(['success' => 'ALREADY_DOWNLOADED']);
            $torrent = $transmission->add($data['torrent_magnet']);
            $torrent = isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'];
            $this->addMovie(
                $torrent,
                $data['torrent_magnet'],
                $data['apiid']
            );
            exec("transmission-remote --auth " . $this->transmissionConfig['username'] . ":" . $this->transmissionConfig['password'] . " -t " . $torrent['id'] . " -seq");
        } else if (isset($data['torrent_url'])) {
            $movie = $repository->findOneBy(['torrentLink' => $data['torrent_url']]);
            if ($movie) return new JsonResponse(['success' => 'ALREADY_DOWNLOADED']);
            $torrent = $transmission->add(base64_encode(file_get_contents($data['torrent_url'])), true);
            $torrent = isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'];
            $this->addMovie(
                $torrent,
                $data['torrent_url'],
                $data['apiid']
            );
            exec("transmission-remote --auth " . $this->transmissionConfig['username'] . ":" . $this->transmissionConfig['password'] . " -t " . $torrent['id'] . " -seq");
        } else {
            // Torrent might be already downloaded
            return new JsonResponse(['error' => 'WRONG_DATA'], 403);
        }
        // Id is temporary since idk how entity works
        return new JsonResponse(['success' => 'TORRENT_DL_SUCCESS'], 200);
    }
}
