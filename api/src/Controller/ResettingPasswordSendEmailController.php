<?php

namespace App\Controller;

use FOS\UserBundle\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Request;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResettingPasswordSendEmailController extends AbstractController
{
    public function __invoke(TokenStorageInterface $tokenStorage, Request $request, UserManagerInterface $userManager, MailerInterface $mailer)
    {
        $email = json_decode($request->getContent())->email;
        $user = $userManager->findUserByUsernameOrEmail($email);

        if ($user && !$user->isPasswordRequestNonExpired(7200)) {
            if (!$user->getConfirmationToken()) {
                $user->setConfirmationToken($this->tokenGenerator->generateToken());
            }
            $mailer->sendResettingEmailMessage($user);
            $user->setPasswordRequestedAt(new \DateTime());
            $this->userManager->updateUser($user);
        }
    }
}