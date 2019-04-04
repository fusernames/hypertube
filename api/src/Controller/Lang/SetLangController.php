<?php

namespace App\Controller\Lang;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Controller\Lang\LangController;
use App\Entity\User;

class SetLangController extends LangController
{
    /**
     * @param Request $request
     * @param TokenStorageInterface $tokenStorage
     * @return JsonResponse
     */
    public function __invoke(Request $request, TokenStorageInterface $tokenStorage)
    {
        if ($tokenStorage->getToken() !== null) {
            $data = $request->getContent();
            $data = json_decode($data, true);
            $user = $tokenStorage->getToken()->getUser();
            if (!isset($data['lang'])) return new JsonResponse(['error' => 'WRONG_DATA'], 404);
            $user->setLang($data['lang']);
            return new JsonResponse(['success' => $data['lang']], 200);
        } else {
            return new JsonResponse(['error' => 'UNKNOWN_USER'], 400);
        }
    }
}
