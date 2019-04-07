<?php

namespace App\Controller;

use App\Services\Api42;
use App\Services\ApiGithub;
use App\Services\ApiGoogle;
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
     * @var ApiGoogle $apiGoogle
     */
    private $apiGoogle;

    /**
     * @param Api42 $api42
     * @param ApiGithub $apiGithub
     * @param ApiFacebook $apiFacebook
     * @param ApiGoogle $apiGoogle
     */
    public function __construct(Api42 $api42,
                                ApiGithub $apiGithub,
                                ApiFacebook $apiFacebook,
                                ApiGoogle $apiGoogle)
    {
        $this->api42 = $api42;
        $this->apiGithub = $apiGithub;
        $this->apiFacebook = $apiFacebook;
        $this->apiGoogle = $apiGoogle;
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
                return $this->apiGoogle->getToken($token, $jwtManager);
            default:
                return new JsonResponse(
                    [
                        "error" => "Invalid or unknow OAuth api",
                        "code" => 400
                    ],
                    400
                );
        }
    }

    /**
     * @param string $token
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    private function _twitter(string $token = null)
    {
        return new JsonResponse(
            [
                "api" => "twitter",
                "access_code" => $token,
                "error" => "An error occurred during the authentication process.",
                "message" => "The features related to the twitter API are not yet operational.",
                "code" => 403
            ],
            403
        );
    }
}
