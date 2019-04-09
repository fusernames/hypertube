<?php

namespace App\Services;

use App\Entity\User;
use App\Entity\OmniAuthInfos;
use App\Services\Curl;
use App\Repository\OmniAuthInfosRepository;
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
     * @var string
     */
    protected $name;

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
     * @param array $userData
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function findUser(array $userData)
    {
        $withEmail = $this->userManager->findUserByEmail($userData["email"]);
        $withUsername = $this->userManager->findUserByUsername($userData["username"]);

        $oAuthInfosRepo = $this->objectManager->getRepository(OmniAuthInfos::class);
        $withOauthId = $oAuthInfosRepo->findOneBy(["oauthId" => $userData["id"], "name" => $this->getName()]);

        if ($withEmail === null && $withOauthId === null) {
            if ($withUsername) {
                return $this->displayError(
                    403,
                    "An error occurred during the registration process.",
                    "USERNAME_TAKEN"
                );
            }
            $this->createUser($userData);
            if ($this->user) {
                $this->addOauthInfo($userData);
                $this->objectManager->persist($this->user);
                $this->objectManager->flush();
                $jwt = $this->jwtManager->create($this->user);
                return new JWTAuthenticationSuccessResponse($jwt);
            } else {
                return $this->displayError(
                    403,
                    "An error occurred during the registration process.",
                    "MAIL_EMPTY"
                );
            }
        } else if ($withOauthId) {
            $jwt = $this->jwtManager->create($withOauthId->getUser());
            return new JWTAuthenticationSuccessResponse($jwt);
        } else if ($withEmail) {            
            $this->user = $withEmail;

            $withOauthName = $oAuthInfosRepo->findOneBy(["name" => $this->getName(), "user" => $this->user]);
            if ($withOauthName) {
                return $this->displayError(403, "Oauth already used.", "ALREADY_USED_FOR_EMAIL");
            }

            $this->addOauthInfo($userData);
            $this->objectManager->persist($this->user);
            $this->objectManager->flush();
            $jwt = $this->jwtManager->create($withEmail);
            return new JWTAuthenticationSuccessResponse($jwt);
        }
    }

    /**
     * Adds oauth info for current user.
     * 
     * @param array $userData
     * @return void
     */
    public function addOauthInfo(array $userData) {
        $oauthInfos = new OmniAuthInfos();
        $oauthInfos->setOauthId($userData["id"])
            ->setName($this->getName());
        $this->user->addOmniAuthInfo($oauthInfos);
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

        if ($userData['email'] === null) {
            $this->user = null;
            return;
        }
        $this->user->setPlainPassword($userData["plainpassword"])
            ->setUsername($userData["username"])
            ->setEmail($userData["email"])
            ->setFirstname($userData["firstname"])
            ->setLastname($userData["lastname"])
            ->setOAuthAccess(true)
        ;

        $this->addOauthInfo($userData);
        
        isset($userData["lang"]) ? $this->user->setLang($userData["lang"]) : 0;
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

    /**
     * @param string $name
     * @return self
     */
    public function setName(string $name = null): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}