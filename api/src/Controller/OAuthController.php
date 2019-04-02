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
                return $this->facebook($token);
            case "42":
                return $this->_42($token);
            case "github":
                return $this->github($token);
            case "twitter":
                return $this->twitter($token);
            case "google":
                return $this->google($token);
            case "hypertube":
                return $this->hypertube($token);
            default:
                return new JsonResponse(["error" => "Invalid or unknow OAuth method", "code" => 400], 400);
        }
        
    }

    private function facebook(string $token = null)
    {
        return new JsonResponse(["method" => "facebook", "token" => $token, "code" => 200], 200);
    }

    private function _42(string $token = null)
    {
        return new JsonResponse(["method" => "42", "token" => $token, "code" => 200], 200);
    }

    private function github(string $token = null)
    {
        return new JsonResponse(["method" => "github", "token" => $token, "code" => 200], 200);
    }

    private function twitter(string $token = null)
    {
        return new JsonResponse(["method" => "twitter", "token" => $token, "code" => 200], 200);
    }

    private function google(string $token = null)
    {
        return new JsonResponse(["method" => "google", "token" => $token, "code" => 200], 200);
    }

    private function hypertube(string $token = null)
    {
        return new JsonResponse(["method" => "hypertube", "token" => $token, "code" => 200], 200);
    }
}
