<?php

namespace App\Services;

use App\Entity\User;
use App\Services\Curl;
use App\Services\ApiCore;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;

class Api42 extends ApiCore
{
    /**
     * @param Curl $curl
     * @param UserManagerInterface $userManager
     * @param ObjectManager $objectManager
     */
    public function __construct(Curl $curl, UserManagerInterface $userManager, ObjectManager $objectManager)
    {
        parent::__construct($curl, $userManager, $objectManager);
        $this->setUrl("https://api.intra.42.fr/oauth/token");
        $this->setUser_url("https://api.intra.42.fr/v2/me");
        $this->setClient_id("410d148df61a4dc6e462bba98b4beda91b3bb56582a44a2a29775a9e0e3cb2d9");
        $this->setClient_secret("0e156668ef0c973c8fa8526fc683f26ce42801788756de614a307eee406ce1b8");
        $this->setRedirect_uri("https://hypertube.barthonet.ovh/oauth/42");
        $this->setName("42");
    }

    /**
     * Make a 42 API request to get a token
     *
     * @param string $code
     * @param JWTManager $jwtManager
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function getToken(string $code, $jwtManager)
    {
        $this->jwtManager = $jwtManager;
        $data = [
            "grant_type" => "authorization_code",
            "client_id" => $this->getClient_Id(),
            "client_secret" => $this->getClient_secret(),
            "redirect_uri" => $this->getRedirect_uri(),
            "code" => $code
        ];
        $resp = $this->curl->postJson($this->getUrl(), json_encode($data));
        
        if ($resp["code"] === 200) {
            $resp = json_decode($resp["resp"]);
            if (isset($resp->error)) {
                return $this->displayError(401, $resp->error_description, $resp->error);
            }
            return $this->getUserData($resp->access_token);
        }
        return $this->displayError($resp["code"], $resp["resp"]);
    }

    /**
     * Search the user in database then return a token if exists or JsonResponse
     *
     * @param string $token
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function getUserData(string $token)
    {
        $userData = $this->curl->getData($this->getUser_url(), $token);

        if ($userData["code"] === 200) {
            $userData = json_decode($userData["resp"]);
            $userData = [
                "id" => $userData->id,
                "plainpassword" => $userData->id . $userData->login . "42hypertube",
                "username" => $userData->login,
                "email" => $userData->email,
                "firstname" => $userData->first_name,
                "lastname" => $userData->last_name,
                "avatarUrl" => $userData->image_url
            ];
            return $this->findUser($userData);
        }
        return $this->displayError($userData["code"], $userData["resp"]);
    }
}