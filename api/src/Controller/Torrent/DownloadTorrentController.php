<?php

namespace App\Controller\Torrent;

use Vohof\Transmission;
use App\Controller\Torrent\TorrentController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DownloadTorrentController extends TorrentController
{
    public function __invoke(Request $request)
    {
        $transmission = new Transmission($this->transmissionConfig);
        // Decodes post json
        $data = $request->getContent();
        $data = json_decode($data, true);
        if (isset($data['torrent_magnet'])) {
            $torrent = $transmission->add($data['torrent_magnet']);
            $this->addMovie(
                isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'],
                $data['torrent_magnet']
            );
        } else if (isset($data['torrent_url'])) {
            $torrent = $transmission->add(base64_encode(file_get_contents($data['torrent_url'])), true);
            $this->addMovie(
                isset($torrent['torrent-added']) ? $torrent['torrent-added'] : $torrent['torrent-duplicate'],
                $data['torrent_url']
            );
        } else {
            // Torrent might be already downloaded
            return new JsonResponse(['error' => 'POST_ERROR'], 403);
        }
        // Id is temporary since idk how entity works
        return new JsonResponse(['success' => 'TORRENT_DL_SUCCESS'], 200);
    }
}