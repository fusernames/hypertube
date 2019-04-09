<?php

namespace App\Services;

use App\Services\Curl;
use App\Services\ApiCore;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;

class ApiTrello extends ApiCore
{
    /**
     * @param Curl $curl
     * @param UserManagerInterface $userManager
     * @param ObjectManager $objectManager
     */
    public function __construct(Curl $curl, UserManagerInterface $userManager, ObjectManager $objectManager)
    {
        parent::__construct($curl, $userManager, $objectManager);
        $this->setUser_url("https://api.trello.com/1/members/me/?key=f6543a57156d53fff214955eb886d264&token=");
        $this->setClient_id("f6543a57156d53fff214955eb886d264");
        $this->setRedirect_uri("https://hypertube.barthonet.ovh/oauth/trello");
        $this->setName("trello");
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
        $this->jwtManager = $jwtManager;

        $this->getUserData($code);
    }

    /**
     * Search the user in database then return a token if exists or JsonResponse
     *
     * @param string $token
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function getUserData(string $token)
    {
        $userData = $this->curl->getData($this->getUser_url() . $token);

        if ($userData["code"] === 200) {
            $userData = json_decode($userData["resp"]);
            $userData = [
                "id" => $userData->id,
                "plainpassword" => $userData->username . $userData->id . "trellohubhypertube",
                "username" => $userData->username,
                "email" => $userData->email,
                "firstname" => isset($userData->fullName) ? $userData->fullName : $userData->username,
                "lastname" => isset($userData->last_name) ? $userData->last_name : $userData->username,
                "avatarUrl" => $userData->avatarUrl
            ];
            return $this->findUser($userData);
        }
        return $this->displayError($userData["code"], $userData["resp"]);
    }
}