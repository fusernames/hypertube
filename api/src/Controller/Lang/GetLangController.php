<?php

namespace App\Controller\Lang;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Controller\Lang\LangController;
use App\Entity\User;

class GetLangController extends LangController
{
    /**
     * @param TokenStorageInterface $tokenStorage
     * @return JsonResponse
     */
    public function __invoke(TokenStorageInterface $tokenStorage)
    {
        if ($tokenStorage->getToken() !== null) {
            $user = $tokenStorage->getToken()->getUser();
            $lang = $user->getLang();
            // Maybe edit DEFAULT_LANG idk
            return new JsonResponse(['success' => $lang === null ? 'DEFAULT_LANG' : $lang], 200);
        } else {
            return new JsonResponse(['error' => 'UNKNOWN_USER'], 400);
        }
    }
}
