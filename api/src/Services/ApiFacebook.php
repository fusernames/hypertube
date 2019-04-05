<?php

namespace App\Services;

use App\Services\Curl;
use App\Services\ApiCore;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;

class ApiFacebook extends ApiCore
{
    /**
     * @param Curl $curl
     * @param UserManagerInterface $userManager
     * @param ObjectManager $objectManager
     */
    public function __construct(Curl $curl, UserManagerInterface $userManager, ObjectManager $objectManager)
    {
        parent::__construct($curl, $userManager, $objectManager);
        $this->setUrl("https://graph.facebook.com/v3.2/oauth/access_token");
        $this->setUser_url("https://api.github.com/user");
        $this->setClient_id("915807418753565");
        $this->setClient_secret("bd4d7dc40ecbabdb08f7d5df4557acdb");
        $this->setRedirect_uri("https://hypertube.barthonet.ovh/oauth/facebook/");
    }

    /**
     * Make a Github API request to get a token
     *
     * @param string $code
     * @param JWTManager $jwtManager
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function getToken(string $code, $jwtManager)
    {
        return new JsonResponse(["api"=> "facebook", "code" => $code], 200);
        $this->jwtManager = $jwtManager;
        $data = [
            "client_id" => $this->getClient_Id(),
            "client_secret" => $this->getClient_secret(),
            "redirect_uri" => $this->getRedirect_uri(),
            "code" => $code
        ];
        $resp = $this->curl->postJson($this->getUrl(), json_encode($data));

        if ($resp["code"] === 200) {
            $resp = explode("&", $resp["resp"]);
            foreach($resp as $key => $value) {
                $resp[$key] = explode("=", $value);
                switch ($resp[$key][0]) {
                    case "error_description":
                        return $this->displayError(401, str_replace("+", " ", $resp[$key][1]));
                    case "access_token":
                        return $this->getUserData($resp[$key][1]);
                }
            }
        }
        return $this->displayError(401, "The code passed is incorrect or expired.");
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
                "plainpassword" => $userData->login . $userData->id,
                "username" => $userData->login,
                "email" => $userData->email ?? $userData->id . $userData->login . "@hypertube.com",
                "firstname" => isset($userData->first_name) ? $userData->first_name : $userData->login,
                "lastname" => isset($userData->last_name) ? $userData->last_name : $userData->login,
                "avatarUrl" => $userData->avatar_url
            ];
            $this->user = $this->userManager->findUserByEmail($userData["email"]);
            !$this->user ? $this->createUser($userData) : 0;
            $jwt = $this->jwtManager->create($this->user);
            !$this->user->getAvatarUrl() ? $this->setUserAvatar($userData["avatarUrl"]) : 0;
            return new JWTAuthenticationSuccessResponse($jwt);
        }
        return $this->displayError(userData["code"], $userData["resp"]);
    }
}