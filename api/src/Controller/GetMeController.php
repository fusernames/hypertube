<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class GetMeController
{
    /**
     * @param TokenStorageInterface $tokenStorage
     * @return User
     */
    public function __invoke(TokenStorageInterface $tokenStorage): User
    {
        $user = $tokenStorage->getToken()->getUser();

        if (!$user || 'anon.' === $user) {
            throw new AccessDeniedException();
        }
        return $user;
    }
}