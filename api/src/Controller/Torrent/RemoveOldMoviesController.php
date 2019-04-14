<?php

namespace App\Controller\Torrent;

use App\Entity\Movie;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RemoveOldMoviesController extends AbstractController
{
    public function check()
    {
        $entityManager = $this->getDoctrine()->getManager();
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
                $entityManager->remove($movie);
                $entityManager->flush();
            }
        }
    }
}
