<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\Stream;

class GetMovieController extends AbstractController
{
    public function __invoke(Request $request) {
        // Parsing request's json
        $data = $request->getContent();
        $data = json_decode($data, true);
        if (!isset($data['torrent_link'])) return new Response(null, 404);
    }
}
