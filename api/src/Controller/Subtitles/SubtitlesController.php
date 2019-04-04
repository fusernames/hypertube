<?php

namespace App\Controller\Subtitles;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\Movie;

use PharData;
use SplFileObject;

class SubtitlesController extends AbstractController
{
    private $_downloadPath = "/var/lib/transmission-daemon/complete/";
    private $_token = null;

    private function _xmlRequest($request, $args) {
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

    private function _setXmlToken() {
        $response = $this->_xmlRequest("LogIn", ['hypertube2019', 'hypertube2019', 'fr', 'TemporaryUserAgent']);
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

    public function __invoke($id) {
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->find($id);

        if (!$movie) {
            return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 401);
        }

        if (file_exists('./subtitles/' . $movie->getId() . '/fre.srt') && file_exists('./subtitles/' . $movie->getId() . '/eng.srt')) {
            return new JsonResponse(['success' => 'SUBTITLES_PRESENT']);
        }

        $filePath = $this->_downloadPath . $movie->getFileName();
        $file = new SplFileObject($filePath);

        // Check file existence
        if (!($file->isFile())) {
            throw $this->createNotFoundException('Error getting movie at path ' . $totalPath);
        }

        $size = $file->getSize();
        $file = null;

        $this->_setXmlToken();

        if ($this->_token === null) {
            return new JsonResponse(['error' => 'SUBTITLES_ERROR']);
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

        for ($i = 0; $i < sizeof($subtitles); $i++) {
            if ($eng && $fre) break;
            if ($subtitles['data'][$i]['SubLanguageID'] === 'fre') {
                $fre = $subtitles['data'][$i]['SubDownloadLink'];
            } else if ($subtitles['data'][$i]['SubLanguageID'] === 'eng') {
                $eng = $subtitles['data'][$i]['SubDownloadLink'];
            }
        }

        $folder = getcwd() . '/subtitles/' . $movie->getId();
        if (!file_exists($folder)) mkdir($folder, 0777, true);
        if ($fre) {
            $freFile = $folder . '/fre.srt.gz';
            file_put_contents($freFile, file_get_contents($fre));
            $frePhar = new PharData($freFile);
            $frePhar->decompress();
        }
        if ($eng) {
            $engFile = $folder . '/eng.srt.gz';
            file_put_contents($engFile, file_get_contents($eng));
            $engPhar = new PharData($engFile);
            $engPhar->decompress();
        }

        return new JsonResponse(['success' => 'SUBTITLES_PRESENT']);
    }
}
