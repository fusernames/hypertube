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

    /**
     * @return JsonResponse
     */
    public function __invoke()
    {
        $email = json_decode($this->request->getContent())->email;
        $user = $this->userManager->findUserByUsernameOrEmail($email);

        if ($user === null) {
            return new JsonResponse(['message'=>'User not found'], 403);
        }
        if ($user->isPasswordRequestNonExpired($this->retryTtl)) {
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
        $newLine = $this->getNewLine($user->getEmail());
        $boundary = $this->getBoundary();
        $url = $this->router->generate('reset_pw', array('token' => $user->getConfirmationToken()), UrlGeneratorInterface::ABSOLUTE_URL);
        $msgTextRendered = $this->templating->render('@FOSUser/Resetting/email.txt.twig', [
            'user' => $user,
            'confirmationUrl' => $url
        ]);
        $msgHTMLRenderer = $this->templating->render('email/resettingSendEmail.html.twig', [
            'user' => $user,
            'confirmationUrl' => $url
        ]);
        $to = $user->getEmail();
        $subject = "Password resetting";
        $headers = $this->getHeaders($newLine, $boundary);
        $message = $this->getMessage($msgTextRendered, $msgHTMLRenderer, $boundary, $newLine);

        mail($to, $subject, $message, $headers);
    }

    private function getMessage($msgTextRendered, $msgHTMLRenderer, $boundary, $newLine): string
    {
        return $newLine . "--" . $boundary . $newLine
            . "Content-Type: text/plain; charset=\"ISO-8859-1\"$newLine"
            . "Content-Transfer-Encoding: 8bit$newLine"
            . $newLine . $msgTextRendered . $newLine
            . "$newLine--$boundary" . $newLine
            . "Content-Type: text/html; charset=\"ISO-8859-1\"$newLine"
            . "Content-Transfer-Encoding: 8bit$newLine"
            . $newLine . $msgHTMLRenderer . $newLine
            . "$newLine--$boundary--$newLine"
            . "$newLine--$boundary--$newLine";
    }

    private function getHeaders(string $newLine, string $boundary): string
    {
        return "From: \"Hypertube-Security\"<security@hypertube.barthonet.ovh>$newLine"
            . "Reply-to: \"Hypertube-Security\"<security@hypertube.barthonet.ovh>$newLine"
            . "MIME-Version: 1.0$newLine"
            . "Content-Type: multipart/alternative;$newLine"
            . " boundary=\"$boundary\"$newLine";
    }

    private function getBoundary(): string
    {
        return "-----=" . md5(rand());
    }

    private function getNewLine(string $email): string
    {
        return preg_match("#^[a-z0-9._-]+@(hotmail|live|msn).[a-z]{2,4}$#", $email) ? "\n": "\r\n";
    }
}
