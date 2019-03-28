<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    /**
     * Contains all front routes.
     */

    /**
     * @Route("/", name="index")
     * @Route("/movie/{id}", name="movie")
     * @Route("/user/{id}", name="profile")
     * @Route("/account", name="account")
     */
    public function index()
    {
        return $this->render('base.html.twig');
    }
}
