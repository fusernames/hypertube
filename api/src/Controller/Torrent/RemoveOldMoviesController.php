<?php

namespace App\Controller\Torrent;

use App\Entity\Movie;
use App\Controller\Torrent\TorrentController;

class RemoveOldMoviesController extends TorrentController
{
    public function check($entityManager)
    {
        $repository = $entityManager->getRepository(Movie::class);
        $now = new \DateTime();
        $movies = $repository->findAll();
        foreach ($movies as $movie) {
            $statuses = $movie->getMovieStatuses();
            $toRemove = true;
            foreach ($statuses as $status) {
                $interval = $status->getUpdatedAt()->diff($now);
                if ($interval->m === 0) {
                    $toRemove = false;
                    break;
                }
            }
            if ($toRemove) {
                // unlink($this->_downloadPath . $movie->getFileName());
                $entityManager->remove($movie);
                $entityManager->flush();
            }
        }
    }
}
