<?php

namespace App\Controller;

use App\Services\Curl;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OAuthController extends AbstractController
{
    private $curl;

    public function __construct(Curl $curl)
    {
        $this->curl = $curl;
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
        $data = [
            "grant_type" => "authorization_code",
            "client_id" => "410d148df61a4dc6e462bba98b4beda91b3bb56582a44a2a29775a9e0e3cb2d9",
            "client_secret" => "0e156668ef0c973c8fa8526fc683f26ce42801788756de614a307eee406ce1b8",
            "redirect_uri" => "https://hypertube.barthonet.ovh/oauth/42",
            "code" => $token
        ];

        $resp = $this->curl->postJson("https://api.intra.42.fr/oauth/token", json_encode($data));
        $resp = json_decode($resp);
        dump($resp);die;
        
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
