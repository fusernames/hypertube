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
        $this->setName("trello");
    }

    /**
     * Make a Trello API request to get user data
     *
     * @param string $code
     * @param JWTManager $jwtManager
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function getUserData(string $token, $jwtManager)
    {
        $this->jwtManager = $jwtManager;

        $userData = $this->curl->getData($this->getUser_url() . $token, null);

        if ($userData["code"] === 200) {
            $userData = json_decode($userData["resp"]);
            $userData = [
                "id" => $userData->id,
                "plainpassword" => $userData->username . $userData->id . "trellohubhypertube",
                "username" => $userData->username,
                "email" => $userData->email,
                "firstname" => isset($userData->fullName) ? $userData->fullName : $userData->username,
                "lastname" => $userData->username,
                "avatarUrl" => $userData->avatarUrl
            ];
            return $this->findUser($userData);
        }
        return $this->displayError($userData["code"], $userData["resp"]);
    }
}