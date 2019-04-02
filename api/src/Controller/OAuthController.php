<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OAuthController extends AbstractController
{
    public function __construct()
    {
    }

    public function __invoke(Request $request)
    {
        $token = json_decode($request->getContent())->token;
        $api = json_decode($request->getContent())->api;

        switch ($api) {
            case "facebook":
                return $this->_facebook($token);
            case "42":
                return $this->_42($token);
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

    private function _42(string $token = null)
    {
        return new JsonResponse(["api" => "42", "token" => $token, "code" => 200], 200);
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
