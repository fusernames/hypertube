<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ChangePasswordController extends AbstractController
{
    public function __invoke(Request $request, UserPasswordEncoderInterface $encoder, ObjectManager $manager) {
        $user = $this->getUser();
        $currentPassword = json_decode($request->getContent())->current_password;
        $new_password = json_decode($request->getContent())->new_password;
        $passwordValid = $encoder->isPasswordValid($user, $currentPassword);

        if($passwordValid && $new_password){
            $user->setPassword($encoder->encodePassword($user, $new_password));        
            $manager->persist($user);
            $manager->flush();
        }else{
            return new Response('Mismatch current password', 400);
        }
        return new Response('Successfully changed password', 200);
    }
}