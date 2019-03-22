<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ResettingPasswordTokenController extends AbstractController
{
    /**
     * @Route("/resetting/password/token", name="resetting_password_token")
     */
    public function index()
    {
        return $this->render('resetting_password_token/index.html.twig', [
            'controller_name' => 'ResettingPasswordTokenController',
        ]);
    }
}
