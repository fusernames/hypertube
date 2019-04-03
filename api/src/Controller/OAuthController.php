<?php

namespace App\Controller;

use App\Services\Api42;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OAuthController extends AbstractController
{
    private $api42;

    public function __construct(Api42 $api42)
    {
        $this->api42 = $api42;
    }

    public function __invoke(Request $request)
    {

        $token = json_decode($request->getContent())->token;
        $api = json_decode($request->getContent())->api;
        return new JsonResponse(json_decode($request->getContent()), 200);die;

        switch ($api) {
            case "facebook":
                return $this->_facebook($token);
            case "42":
                return $this->api42->getToken($token);
            case "github":
                return $this->_github($token);
            case "twitter":
                return $this->_twitter($token);
            case "google":
                return $this->_google($token);
            default:
                return new JsonResponse(["error" => "Invalid or unknow OAuth api", "code" => 400], 400);
        }
        
    }

    private function _facebook(string $token = null)
    {
        return new JsonResponse(["api" => "facebook", "token" => $token, "code" => 200], 200);
    }

    private function _github(string $token = null)
    {
        return new JsonResponse(["api" => "github", "token" => $token, "code" => 200], 200);
    }

    private function _twitter(string $token = null)
    {
        return new JsonResponse(["api" => "twitter", "token" => $token, "code" => 200], 200);
    }

    private function _google(string $token = null)
    {
        return new JsonResponse(["api" => "google", "token" => $token, "code" => 200], 200);
    }
}
