<?php

namespace App\Controller\Torrent;

use SplFileObject;
use App\Entity\Movie;
use App\Controller\Torrent\TorrentController;
use App\Controller\Torrent\RemoveOldMoviesController;
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

        // Create the StreamedResponse object
        $response = new StreamedResponse();
    
        $file = new SplFileObject($totalPath);
    
        // Check file existence
        if (!($file->isFile())) {
            throw $this->createNotFoundException('Error getting movie at path ' . $totalPath);
        }
    
        // Retrieve file informations
        $fileName = $file->getBasename();
        $fileExt  = $file->getExtension();
        
        if ($movie->getFinished()) {
            $fileSize = $file->getSize();
        } else {
            $transmission = new Transmission($this->transmissionConfig);
            $infos = $transmission->get($movie->getTorrentId())['torrents'];
            if (sizeof($infos) !== 1) {
                return new JsonResponse(['error' => 'UNKNOWN_TORRENT'], 404);
            } else if ($infos[0]['isFinished'] === true) {
                $transmission->remove($movie->getTorrentId());
                $movie->setFinished(true);
                $entityManager->persist($movie);
                $entityManager->flush();
                $remover = new RemoveOldMoviesController();
                $remover->check($entityManager);
                $fileSize = $file->getSize();
            } else {
                $infos = $infos[0];
                $movieFile = $this->getMovieFile($infos);
                $fileSize = $movieFile['bytesCompleted'];
            }
        }

        if ($fileExt === "mkv" && !strpos($request->headers->get('User-Agent'), 'Chrome')) {
            return $this->redirect('http://hypertube.barthonet.ovh:8080/mkv?path=' . $totalPath);
        }
    
        $response->headers->set('Accept-Ranges', 'bytes');
        $response->headers->set('Content-Type', 'video/' . ($fileExt === "mkv" ? "x-matroska" : $fileExt));
    
        // Initialise range variables, default to the whole file size
        $rangeMin = 0;
        $rangeMax = $fileSize - 1;
        $rangeStart = $rangeMin;
        $rangeEnd = $rangeMax;
    
        $httpRange = $request->server->get('HTTP_RANGE');
    
        // If there's a range, deal with it
        if ($httpRange) {
            $isRangeSatisfiable = true;
    
            if (preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $httpRange, $matches)) {
                $rangeStart = intval($matches[1]);
    
                if (!empty($matches[2])) {
                    $rangeEnd = intval($matches[2]);
                }
            } else {
                // Requested HTTP-Range seems invalid.
                $isRangeSatisfiable = false;
            }
    
            if ($rangeStart <= $rangeEnd) {
                // If ranges are OK, setting total length
                $length = $rangeEnd - $rangeStart + 1;
            } else {
                // Range start greater than range end -> error somewhere
                $isRangeSatisfiable = false;
            }
    
            if ($file->fseek($rangeStart) !== 0) {
                // Error doing fseek, to start reading at the asked byte -> wrong range
                $isRangeSatisfiable = false;
            }
    
            if ($isRangeSatisfiable) {
                // Fseek worked -> preparing headers
                $response->setStatusCode(StreamedResponse::HTTP_PARTIAL_CONTENT);
    
                $response->headers->set('Content-Range', sprintf('bytes %d-%d/%d', $rangeStart, $rangeEnd, $fileSize));
                $response->headers->set('Content-Length', $length);
                $response->headers->set('Connection', 'Close');
            } else {
                // Fseek error -> wrong range -> error
                $response = new Response();
                $response->setStatusCode(StreamedResponse::HTTP_REQUESTED_RANGE_NOT_SATISFIABLE);
                $response->headers->set('Content-Range', sprintf('bytes */%d', $fileSize));
    
                return $response;
            }
        } else {
            // No range, sending whole length
            $response->headers->set('Content-Length', $fileSize);
        }
    
        // Send headers then
        $response->prepare($request);
        $response->sendHeaders();
    
        // Read the file and send it
        $response->setCallback(function () use ($file, $rangeEnd, $fileExt, $totalPath) {
            $buffer = 1024 * 8;

            while (!($file->eof()) && (($offset = $file->ftell()) < $rangeEnd)) {
                set_time_limit(0);
    
                if ($offset + $buffer > $rangeEnd) {
                    $buffer = $rangeEnd + 1 - $offset;
                }

                echo $file->fread($buffer);
            }
            
            $file = null;
        });
    
        // Then everything should be ready, we can send the Response content.
        // Don't return response because headers, etc. have already been sent.
        $response->sendContent();
    }
}
