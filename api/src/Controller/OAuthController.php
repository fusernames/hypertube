<?php

namespace App\Controller;

use App\Services\Api42;
use App\Services\ApiGithub;
use App\Services\ApiFacebook;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OAuthController extends Controller
{
    /**
     * @var Api42
     */
    private $api42;

    /**
     * @var ApiGithub
     */
    private $apiGithub;

    /**
     * @var ApiFacebook
     */
    private $apiFacebook;

    /**
     * @param Api42 $api42
     * @param ApiGithub $apiGithub
     * @param ApiFacebook $apiFacebook
     */
    public function __construct(Api42 $api42, ApiGithub $apiGithub, ApiFacebook $apiFacebook)
    {
        $this->api42 = $api42;
        $this->apiGithub = $apiGithub;
        $this->apiFacebook = $apiFacebook;
    }

    /**
     * @param Request $request
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function __invoke(Request $request)
    {
        $jwtManager = $this->container->get('lexik_jwt_authentication.jwt_manager');
        $token = json_decode($request->getContent())->token;
        $api = json_decode($request->getContent())->api;

        switch ($api) {
            case "facebook":
                return $this->apiFacebook->getToken($token, $jwtManager);
            case "42":
                return $this->api42->getToken($token, $jwtManager);
            case "github":
                return $this->apiGithub->getToken($token, $jwtManager);
            case "twitter":
                return $this->_twitter($token);
            case "gmail":
                return $this->_google($token);
            default:
                return new JsonResponse(["error" => "Invalid or unknow OAuth api", "code" => 400], 400);
        }
    }

    /**
     * @param string $token
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    private function _twitter(string $token = null)
    {
        return new JsonResponse(["api" => "twitter", "token" => $token, "code" => 200], 200);
    }

    /**
     * @param string $token
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    private function _google(string $token = null)
    {
        return new JsonResponse(["api" => "google", "token" => $token, "code" => 200], 200);
    }
}
