<?php

namespace App\Services;

use App\Services\Curl;
use Facebook\Facebook;
use App\Services\ApiCore;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;

class ApiFacebook extends ApiCore
{
    private $fb;

    /**
     * @param Curl $curl
     * @param UserManagerInterface $userManager
     * @param ObjectManager $objectManager
     */
    public function __construct(Curl $curl, UserManagerInterface $userManager, ObjectManager $objectManager)
    {
        parent::__construct($curl, $userManager, $objectManager);
        $this->setUser_url('/me?fields=id,first_name,last_name,gender,email,picture.type(large),name');
        
        $this->fb = new Facebook([
            'app_id' => '915807418753565',
            'app_secret' => 'bd4d7dc40ecbabdb08f7d5df4557acdb',
            'default_graph_version' => 'v3.2'
        ]);
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
        // $oauth2client = $this->fb->getOAuth2Client();
        // dump($oauth2client);
        // $access_token = $oauth2client->getLongLivedAccessToken($code);

        try {
            // Get the \Facebook\GraphNodes\GraphUser object for the current user.
            // If you provided a 'default_access_token', the '{access-token}' is optional.
            $response = $this->fb->get($this->getUser_url(), $code);
        } catch(\Facebook\Exceptions\FacebookResponseException $e) {
        // When Graph returns an error
            return $this->displayError(403, 'Graph returned an error: ' . $e->getMessage());
        } catch(\Facebook\Exceptions\FacebookSDKException $e) {
        // When validation fails or other local issues
            return $this->displayError(403, 'Facebook SDK returned an error: ' . $e->getMessage());
        }
        $me = $response->getGraphUser();
        $userData = [
            "plainpassword" => $me->getId() . $me->getFirstname() . "facebookhypertube",
            "username" => $me->getName(),
            "email" => $me->getId() . "-" . $me->getFirstname() . "-facebook@hypertube.com",
            "firstname" => $me->getFirstname(),
            "lastname" => $me->getLastname(),
            "avatarUrl" => $me["picture"]["url"]
        ];
        return $this->findUser($userData);
    }
}