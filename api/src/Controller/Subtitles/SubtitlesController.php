<?php

namespace App\Controller\Subtitles;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\Movie;

use SplFileObject;
use KickAssSubtitles\OpenSubtitles\Client;

class SubtitlesController extends AbstractController
{
    private $_downloadPath = "/var/lib/transmission-daemon/complete/";
    private $_client;

    private function _initClient() {
        $this->_client = Client::create([
            'username'  => 'hypertube2019',
            'password'  => 'hypertube2019',
            'useragent' => 'TemporaryUserAgent',
        ]);
    }

    public function __invoke($id) {
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Movie::class);
        $movie = $repository->find($id);

        if (!$movie) {
            return new JsonResponse(['error' => 'UNKNOWN_MOVIE'], 401);
        }

        $this->_initClient();

        $filePath = $this->_downloadPath . $movie->getFileName();
        $file = new SplFileObject($filePath);

        // Check file existence
        if (!($file->isFile())) {
            throw $this->createNotFoundException('Error getting movie at path ' . $totalPath);
        }

        $size = $file->getSize();
        $file = null;

        $hash = $this->OpenSubtitlesHash($filePath);

        $response = $this->_client->searchSubtitles([
            [
                'sublanguageid' => 'en',
                'moviehash' => '163ce22b6261f50a',
                'moviebytesize' => $size
            ]
        ]);

        return new JsonResponse(['response' => $response->toArray()]);
    }

    function OpenSubtitlesHash($file)
    {
        $handle = fopen($file, "rb");
        $fsize = filesize($file);
        
        $hash = array(3 => 0, 
                    2 => 0, 
                    1 => ($fsize >> 16) & 0xFFFF, 
                    0 => $fsize & 0xFFFF);
            
        for ($i = 0; $i < 8192; $i++)
        {
            $tmp = $this->ReadUINT64($handle);
            $hash = $this->AddUINT64($hash, $tmp);
        }
        
        $offset = $fsize - 65536;
        fseek($handle, $offset > 0 ? $offset : 0, SEEK_SET);
        
        for ($i = 0; $i < 8192; $i++)
        {
            $tmp = $this->ReadUINT64($handle);
            $hash = $this->AddUINT64($hash, $tmp);         
        }
        
        fclose($handle);
        return $this->UINT64FormatHex($hash);
    }

    function ReadUINT64($handle)
    {
        $u = unpack("va/vb/vc/vd", fread($handle, 8));
        return array(0 => $u["a"], 1 => $u["b"], 2 => $u["c"], 3 => $u["d"]);
    }

    function AddUINT64($a, $b)
    {
        $o = array(0 => 0, 1 => 0, 2 => 0, 3 => 0);

        $carry = 0;
        for ($i = 0; $i < 4; $i++) 
        {
            if (($a[$i] + $b[$i] + $carry) > 0xffff ) 
            {
                $o[$i] += ($a[$i] + $b[$i] + $carry) & 0xffff;
                $carry = 1;
            }
            else 
            {
                $o[$i] += ($a[$i] + $b[$i] + $carry);
                $carry = 0;
            }
        }
        
        return $o;   
    }

    function UINT64FormatHex($n)
    {   
        return sprintf("%04x%04x%04x%04x", $n[3], $n[2], $n[1], $n[0]);
    }
}
