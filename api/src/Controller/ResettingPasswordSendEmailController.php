<?php

namespace App\Controller;

use FOS\UserBundle\Mailer\Mailer;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\HttpFoundation\Request;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ResettingPasswordSendEmailController extends AbstractController
{
    private $userManager;
    private $tokenGenerator;
    private $request;
    private $router;
    private $templating;

    /**
     * @var int
     */
    private $retryTtl;

    /**
     * @param UserManagerInterface      $userManager
     * @param TokenGeneratorInterface   $tokenGenerator
     * @param UrlGeneratorInterface     $router
     * @param EngineInterface           $templating
     */
    public function __construct(UserManagerInterface $userManager, TokenGeneratorInterface $tokenGenerator, UrlGeneratorInterface  $router, EngineInterface $templating)
    {
        $this->userManager = $userManager;
        $this->router = $router;
        $this->templating = $templating;
        $this->tokenGenerator = $tokenGenerator;
        $this->request = Request::createFromGlobals();
        $this->retryTtl = 7200;
    }

    public function __invoke()
    {
        $email = json_decode($this->request->getContent())->email;
        $user = $this->userManager->findUserByUsernameOrEmail($email);

        if ($user === null) {
            return new JsonResponse(['message'=>'User not found'], 403);
        }
        if ($user->isPasswordRequestNonExpired(7200)) {
            return new JsonResponse(['message' => 'A request already in progress is less than 2 hours old'], 200);
        }
        if (null === $user->getConfirmationToken()) {
            $user->setConfirmationToken($this->tokenGenerator->generateToken());
        }
        $this->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->userManager->updateUser($user);
        return new JsonResponse(['message'=>'Password reset email was sent correctly'], 200);
    }

    private function sendResettingEmailMessage($user)
    {
        $template = '@FOSUser/Resetting/email.txt.twig';
        $url = $this->router->generate('fos_user_resetting_reset', array('token' => $user->getConfirmationToken()), UrlGeneratorInterface::ABSOLUTE_URL);
        $rendered = $this->templating->render($template, array(
            'user' => $user,
            'confirmationUrl' => $url,
        ));
        $to = $user->getEmail();
        $subject = "Password resetting";
        $message = $rendered;
        $headers[] = 'To: ' . $user->getUsername() . ' <' . $user->getEmail() . '>';
        $headers[] = 'From: Hypertube-Security <security@hypertube.com>';
        // dump($to, $subject, $message);
        mail($to, $subject, $message,  implode("\r\n", $headers));
    }
}