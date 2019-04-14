<?php

namespace App\Controller\Subtitles;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

use App\Entity\Movie;

class GetSubtitleController extends AbstractController
{
    private $langs = ["fre", "eng"];

    public function __invoke($id, $lang)
    {
        if (!in_array($lang, $this->langs)) {
            return new JsonResponse(['error' => 'UNKNOWN_LANG'], 400);
        }
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->find($id);
        
        if (!$movie) {
            return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 404);
        }
        
        $fileName = getcwd() . '/subtitles/' . $id . '/' . $lang . '.vtt';
        if (file_exists($fileName)) {
            $response = new BinaryFileResponse($fileName);
            $response->headers->set('Content-Type', "text/vtt; charset='utf-8'");
            return $response;
        } else {
            return new JsonResponse(['error' => 'SUBTITLE_NOT_FOUND'], 404);
        }
    }
}
