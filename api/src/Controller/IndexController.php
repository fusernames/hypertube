<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Contains all front routes.
 */
class IndexController extends AbstractController
{
    /**
     * @Route("/", name="index")
     * @Route("/reset_pw/{token}", name="reset_pw")
     * @Route("/movie/{id}", name="movie")
     * @Route("/movies", name="movies")
     * @Route("/stream/{id}", name="stream")
     * @Route("/user/{id}", name="profile")
     * @Route("/account", name="account")
     * @Route("/oauth/{name}", name="oauth")
     */
    public function index()
    {
        return $this->render('base.html.twig');
    }
}
