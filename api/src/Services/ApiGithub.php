<?php

namespace App\Services;

use App\Services\Curl;
use App\Services\ApiCore;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;

class ApiGithub extends ApiCore
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
        return new JsonResponse(["http-code" => 200, "code" => $code], 200);
    }
}