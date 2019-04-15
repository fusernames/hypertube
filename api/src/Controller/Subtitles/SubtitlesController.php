<?php

namespace App\Controller\Subtitles;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\Movie;

use SplFileObject;

class SubtitlesController extends AbstractController
{
    private $_downloadPath = "/var/lib/transmission-daemon/complete/";
    private $_token = null;

    private function _xmlRequest($request, $args)
    {
        $request = xmlrpc_encode_request($request, $args);
        $context = stream_context_create(['http' =>
            [
                'method' => "POST",
                'header' => "Content-Type: text/xml",
                'content' => $request
            ]
        ]);
        $file = file_get_contents("https://api.opensubtitles.org/xml-rpc", false, $context);
        $response = xmlrpc_decode($file);
        if ($response && xmlrpc_is_fault($response)) {
            return null;
        } else {
            return $response;
        }
    }

    private function _setXmlToken()
    {
        $response = $this->_xmlRequest("LogIn", ['hypertube2019', 'hypertube2019', 'fr', 'Hypertube2019']);
        if ($response) {
            $this->_token = $response['token'];
        }
    }

    private function _utf8_convert($dat)
    {
        if (is_string($dat)) {
            return utf8_encode($dat);
        } else if (is_array($dat)) {
            $ret = [];
            foreach ($dat as $i => $d) {
                $ret[ $i ] = $this->_utf8_convert($d);
            }
            return $ret;
        } else if (is_object($dat)) {
            foreach ($dat as $i => $d) {
                $dat->$i = $this->_utf8_convert($d);
            }
            return $dat;
        }
        return $dat;
    }

    private function _unzip($fileName)
    {
        $buffSize = 4096;
        $outputName = str_replace('.gz', '', $fileName);
        // Opening files
        $file = gzopen($fileName, 'rb');
        $outputFile = fopen($outputName, 'wb');
        while (!gzeof($file)) {
            fwrite($outputFile, gzread($file, $buffSize));
        }
        fclose($outputFile);
        gzclose($file);
    }

    private function _vttConvert($fileName)
    {
        $output = explode('.srt', $fileName)[0] . '.vtt';
        // Opening file
        $fileHandle = fopen($fileName, 'r');
        if ($fileHandle) {
            // Assume that every line has maximum 8192 length
            // If you don't care about line length then you can omit the 8192 param
            $lines = [];
            while (($line = fgets($fileHandle, 8192)) !== false) {
                $lines[] = $line;
            }
            if (!feof($fileHandle)) return;
            else ($fileHandle);
        }
        // Convert all timestamp lines
        // The first timestamp line is 1
        $length = count($lines);
        for ($index = 1; $index < $length; $index++) {
            // A line is a timestamp line if the second line above it is an empty line
            if ($index === 1 || trim($lines[$index - 2]) === '') {
                $lines[$index] = str_replace(',', '.', $lines[$index]);
            } else if (!mb_detect_encoding($lines[$index], 'UTF-8', true)) {
                $lines[$index] = utf8_encode($lines[$index]);
            }
        }
        // Insert VTT header and concatenate all lines in the new vtt file
        file_put_contents($output, "WEBVTT\n\n" . implode('', $lines));
    }

    public function __invoke($id)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->find($id);

        if (!$movie) {
            return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 401);
        }

        if (file_exists('./subtitles/' . $movie->getId() . '/fre.vtt') && file_exists('./subtitles/' . $movie->getId() . '/eng.vtt')) {
            return new JsonResponse(['success' => 'SUBTITLES_PRESENT']);
        }

        $filePath = $this->_downloadPath . $movie->getFileName();
        if (!file_exists($filePath)) {
            return new JsonResponse(["code" => 404, "error" => "This movie does not exist"], 404);
        }
        $file = new SplFileObject($filePath);

        // Check file existence
        if (!($file->isFile())) {
            throw $this->createNotFoundException('Error getting movie at path ' . $totalPath);
        }


        $size = $file->getSize();
        $file = null;

        $this->_setXmlToken();

        if ($this->_token === null) {
            return new JsonResponse(['error' => 'SUBTITLES_ERROR'], 404);
        }

        if (!$movie->getName()) {
            return new JsonResponse(["code" => 404, "message" => "Invalid file"], 404);
        }
        $subtitles = $this->_utf8_convert(
            $this->_xmlRequest("SearchSubtitles", [$this->_token,
                [
                    [
                        'query' => $movie->getName(),
                        'moviebytesize' => $size,
                        'sublanguageid' => 'fre,eng'
                    ]
                ],
                [
                    'limit' => 50
                ]
            ])
        );

        $eng = null;
        $fre = null;

        for ($i = 0; $i < sizeof($subtitles['data']); $i++) {
            if ($eng && $fre) break;
            if ($subtitles['data'][$i]['MovieFPS'] != 23.976) continue;
            if (!$fre && $subtitles['data'][$i]['SubLanguageID'] === 'fre') {
                $fre = $subtitles['data'][$i]['SubDownloadLink'];
            } else if (!$eng && $subtitles['data'][$i]['SubLanguageID'] === 'eng') {
                $eng = $subtitles['data'][$i]['SubDownloadLink'];
            }
        }

        $folder = getcwd() . '/subtitles/' . $movie->getId();
        if (!file_exists($folder)) mkdir($folder, 0777, true);
        if ($fre) {
            $freFile = $folder . '/fre.srt.gz';
            file_put_contents($freFile, file_get_contents($fre));
            $this->_unzip($freFile);
            $this->_vttConvert($folder . '/fre.srt');
        }
        if ($eng) {
            $engFile = $folder . '/eng.srt.gz';
            file_put_contents($engFile, file_get_contents($eng));
            $this->_unzip($engFile);
            $this->_vttConvert($folder . '/eng.srt');
        }

        return new JsonResponse(['success' => 'SUBTITLES_PRESENT']);
    }
}
