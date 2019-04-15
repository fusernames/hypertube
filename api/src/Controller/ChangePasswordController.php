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
    /**
     * @var string
     */
    private $currentPassword;

    /**
     * @var string
     */
    private $passwordValid;

    /**
     * @var string
     */
    private $newPassword;

    /**
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @param ObjectManager $manager
     * @return JsonResponse
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
                return new JsonResponse(['message' => 'Invalid password', "code" => 401], 401);
            }
        } else {
            return new JsonResponse(['message' => 'Missing current password', "code" => 403], 403);
        }

        /**
         * Verification of the new password
         */
        if (isset($requestContent->new_password) && isset($requestContent->re_password)) {
            if ($requestContent->new_password !== $requestContent->re_password) {
                return new JsonResponse(["error" => "PASSWORDS_DIFFER", "code" => 404], 404);
            }
            if (!$this->setNewPassword($requestContent->new_password)) {
                return new JsonResponse(['message' => 'New password is invalid', "code" => 403], 403);
            }
        } else {
            return new JsonResponse(['message' => 'New password is missing', "code" => 403], 403);
        }
        $user->setPassword($encoder->encodePassword($user, $this->newPassword));
        $manager->flush();
        return new JsonResponse(['message' => 'Successfully changed password', "code" => 200], 200);
    }

    /**
     * Verification of the current password validity
     *
     * @param string $current
     * @param UserPasswordEncoderInterface $encoder
     * @param [type] $user
     * @return boolean
     */
    private function setCurrentPassword(string $current, UserPasswordEncoderInterface $encoder, $user): bool
    {
        $this->currentPassword = $current;
        $this->passwordValid = $encoder->isPasswordValid($user, $this->currentPassword);

        return $this->passwordValid;
    }

    /**
     * Verification of the new password validity
     *
     * @param string $newPassword
     * @return boolean
     */
    private function setNewPassword(string $newPassword): bool
    {
        if (preg_match('/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/', $newPassword)) {
            $this->newPassword = $newPassword;
            return true;
        }
        return false;
    }
}