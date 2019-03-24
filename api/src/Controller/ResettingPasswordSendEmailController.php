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
    // private $formFactory;
    private $userManager;
    private $tokenGenerator;
    private $request;
    private $mailer;
    private $parameters;
    private $router;
    private $templating;

    /**
     * @var int
     */
    private $retryTtl;

    /**
     * @param UserManagerInterface      $userManager
     * @param TokenGeneratorInterface   $tokenGenerator
     * @param \Swift_Mailer             $mailer
     * @param UrlGeneratorInterface     $router
     * @param EngineInterface           $templating
     */
    public function __construct(UserManagerInterface $userManager, TokenGeneratorInterface $tokenGenerator, \Swift_Mailer $mailer, UrlGeneratorInterface  $router, EngineInterface $templating)
    {
        // $this->formFactory = new FormFactory();
        $this->parameters = [
            'resetting.template' => '@FOSUser/Resetting/email.txt.twig',
            'from_email' => [
                "confirmation" => [
                    "example@example.com" => "security@hypertube.com"
                ],
                "resetting" => [
                    "example@example.com" => "security@hypertube.com"
                ]
            ]
        ];
        $this->userManager = $userManager;
        $this->router = $router;
        $this->templating = $templating;
        $this->tokenGenerator = $tokenGenerator;
        $this->request = Request::createFromGlobals();
        $this->mailer = new Mailer($mailer, $router, $templating, $this->parameters);
        $this->retryTtl = 7200;
    }

    public function __invoke()
    {
        $email = json_decode($this->request->getContent())->email;
        $user = $this->userManager->findUserByUsernameOrEmail($email);

        if ($user === null) {
            return new JsonResponse(['message'=>'User not found'], 403);
        }
        // if ($user->isPasswordRequestNonExpired(7200)) {
        //     return new JsonResponse(['message' => 'A request already in progress is less than 2 hours old'], 403);
        // }
        if (null === $user->getConfirmationToken()) {
            $user->setConfirmationToken($this->tokenGenerator->generateToken());
        }
        // $this->mailer->sendResettingEmailMessage($user);
        $this->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->userManager->updateUser($user);
        return new JsonResponse(['message'=>'Password reset email was sent correctly'], 200);
    }

    private function sendResettingEmailMessage($user)
    {
        $template = $this->parameters['resetting.template'];
        $url = $this->router->generate('fos_user_resetting_reset', array('token' => $user->getConfirmationToken()), UrlGeneratorInterface::ABSOLUTE_URL);
        $rendered = $this->templating->render($template, array(
            'user' => $user,
            'confirmationUrl' => $url,
        ));
        $to = $user->getEmail();
        $subject = "Password resetting";
        $message = $rendered;
        $headers[] = 'To: ' . $user->getUsername() . ' <' . $user->getEmail() . '>';
        $headers[] = 'From: Hypertube-Security <' . $this->parameters['from_email']['resetting']['example@example.com'] . '>';

        dump($to, $subject, $rendered,  implode("\r\n", $headers));
        mail($to, $subject, $message,  implode("\r\n", $headers));
        // $this->sendEmailMessage($rendered, $this->parameters['from_email']['resetting'], (string) $user->getEmail());
    }
}