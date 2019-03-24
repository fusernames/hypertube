<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class ChangePasswordController extends AbstractController
{
    private $currentPassword;
    private $passwordValid;
    private $newPassword;

    /**
     * @param Request                       $request
     * @param UserPasswordEncoderInterface  $encoder
     * @param ObjectManager                 $manager
     */
    public function __invoke(Request $request, UserPasswordEncoderInterface $encoder, ObjectManager $manager)
    {
        $user = $this->getUser();

        $requestContent = json_decode($request->getContent());

        /**
         * Verification of the current password
         */
        if (isset($requestContent->current_password)) {
            if (!$this->setCurrentPassword($requestContent->current_password, $encoder, $user)) {
                return new JsonResponse(['message' => 'Invalid password'], 401);
            }
        } else {
            return new JsonResponse(['message' => 'Missing current password'], 403);
        }

        /**
         * Verification of the new password
         */
        if (isset($requestContent->new_password)) {
            if (!$this->setNewPassword($requestContent->new_password)) {
                return new JsonResponse(['message' => 'New password is invalid'], 403);
            }
        } else {
            return new JsonResponse(['message' => 'New password is missing'], 403);
        }
        $user->setPassword($encoder->encodePassword($user, $this->newPassword));
        $manager->flush();
        return new JsonResponse(['message'=>'Successfully changed password'], 200);
    }

    /**
     * Verification of the current password validity
     */
    private function setCurrentPassword(string $current, UserPasswordEncoderInterface $encoder, $user): bool
    {
        $this->currentPassword = $current;
        $this->passwordValid = $encoder->isPasswordValid($user, $this->currentPassword);

        return $this->passwordValid;
    }

    /**
     * Verification of the new password validity
     */
    private function setNewPassword(string $newPassword): bool
    {
        $this->newPassword = $newPassword;

        /**
         * here we can check the new password with regex by example
         */
        return true;
    }
}