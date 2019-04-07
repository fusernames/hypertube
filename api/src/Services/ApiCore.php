<?php

namespace App\Services;

use App\Entity\User;
use App\Services\Curl;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;

class ApiCore
{
    /**
     * @var string
     */
    protected $url;
    /**
     * @var Curl
     */
    protected $curl;
    /**
     * @var User
     */
    protected $user;
    /**
     * @var string
     */
    protected $user_url;
    /**
     * @var string
     */
    protected $client_id;
    /**
     * @var UserManagerInterface
     */
    protected $userManager;
    /**
     * @var string
     */
    protected $redirect_uri;
    /**
     * @var string
     */
    protected $client_secret;
    /**
     * @var ObjectManager
     */
    protected $objectManager;
    /**
     * @var JWTManager
     */
    protected $jwtManager;

    /**
     * @param Curl $curl
     * @param UserManagerInterface $userManager
     * @param ObjectManager $objectManager
     */
    public function __construct(Curl $curl, UserManagerInterface $userManager, ObjectManager $objectManager)
    {
        $this->user = null;
        $this->curl = $curl;
        $this->jwtManager = null;
        $this->userManager = $userManager;
        $this->objectManager = $objectManager;
        $this->jwtManager = $this->container->get('lexik_jwt_authentication.jwt_manager');
    }

    /**
     * @param integer $code
     * @param string $message
     * @return JsonResponse
     */
    public function displayError(int $code, string $message, $err = null): JsonResponse
    {
        return new JsonResponse(
            [
                "message" => $message,
                "code" => $code,
                "error" => $err
            ],
            $code
        );
    }

    /**
     * @param array $email
     * @param string $username
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function findUser(array $userData, $jwtManager)
    {
        $withEmail = $this->userManager->findUserByEmail($userData["email"]);
        $withUsername = $this->userManager->findUserByUsername($userData["username"]);

        if (!$withEmail && !$withUsername) {
            $this->createUser($userData);
            $jwt = $jwtManager->create($this->user);
            return new JWTAuthenticationSuccessResponse($jwt);
        } else if ($withEmail && $withUsername && $withEmail->getId() === $withUsername->getId()) {
            $jwt = $jwtManager->create($withEmail);
            return new JWTAuthenticationSuccessResponse($jwt);
        } else {
            return $this->displayError(403, "An error occurred during the registration process.", "Registration process failed.");
        }

        return new JsonResponse(
            [
                "email" => $withEmail,
                "emailId" => $withEmail ? $withEmail->getId() : null,
                "username" =>$withUsername,
                "usernameId" => $withUsername ? $withUsername->getId() : null
            ],
            200
        );
    }

    /**
     * Creates a new user if the search returns null with the API data
     *
     * @param array $userData
     * @return void
     */
    public function createUser(array $userData)
    {
        $this->user = new User();

        $this->user->setPlainPassword($userData["plainpassword"])
            ->setUsername($userData["username"])
            ->setEmail($userData["email"])
            ->setFirstname($userData["firstname"])
            ->setLastname($userData["lastname"])
            ;
        $this->setUserAvatar($userData["avatarUrl"]);
    }

    /**
     * @param string $url
     * @return self
     */
    public function setUserAvatar(string $url): self
    {
        $this->user->setAvatarUrl($url);
        $this->objectManager->persist($this->user);
        $this->objectManager->flush();

        return $this;
    }

    /**
     * @param string $user_url
     * @return void
     */
    public function setUser_url(string $user_url)
    {
        $this->user_url = $user_url;

        return $this;
    }

    /**
     * @return string
     */
    public function getUser_url(): string
    {
        return $this->user_url;
    }

    /**
     * @param string $redirect_uri
     * @return void
     */
    public function setRedirect_uri(string $redirect_uri)
    {
        $this->redirect_uri = $redirect_uri;

        return $this;
    }

    /**
     * @return string
     */
    public function getRedirect_uri(): string
    {
        return $this->redirect_uri;
    }

    /**
     * @param string $client_secret
     * @return self
     */
    public function setClient_secret(string $client_secret): self
    {
        $this->client_secret = $client_secret;

        return $this;
    }

    /**
     * @return string
     */
    public function getClient_secret(): string
    {
        return $this->client_secret;
    }

    /**
     * @param string $client_id
     * @return self
     */
    public function setClient_id(string $client_id): self
    {
        $this->client_id = $client_id;

        return $this;
    }

    /**
     * @return string
     */
    public function getClient_Id(): string
    {
        return $this->client_id;
    }

    /**
     * @param string $url
     * @return self
     */
    public function setUrl(string $url = null): self
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }
}