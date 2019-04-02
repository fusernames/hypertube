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
        $token = json_decode($request->getContent())->omniAuthToken;
        $method = json_decode($request->getContent())->omniAuthMethod;

        switch ($method) {
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
                return new JsonResponse(["error" => "Invalid or unknow OAuth method", "code" => 400], 400);
        }
        
    }

    private function _facebook(string $token = null)
    {
        return new JsonResponse(["method" => "facebook", "token" => $token, "code" => 200], 200);
    }

    private function _42(string $token = null)
    {
        return new JsonResponse(["method" => "42", "token" => $token, "code" => 200], 200);
    }

    private function _github(string $token = null)
    {
        return new JsonResponse(["method" => "github", "token" => $token, "code" => 200], 200);
    }

    private function _twitter(string $token = null)
    {
        return new JsonResponse(["method" => "twitter", "token" => $token, "code" => 200], 200);
    }

    private function _google(string $token = null)
    {
        return new JsonResponse(["method" => "google", "token" => $token, "code" => 200], 200);
    }
}
