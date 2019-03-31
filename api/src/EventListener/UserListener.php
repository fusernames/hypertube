<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\Common\EventSubscriber;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\Security\Core\Security;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UserListener implements EventSubscriber
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;
    /**
     * @var ObjectManager
     */
    private $manager;
    /**
     * @var ObjectManager
     */
    private $security;

    public function __construct(TokenStorageInterface $tokenStorage, ObjectManager $manager, Security $security)
    {
        $this->tokenStorage = $tokenStorage;
        $this->manager = $manager;
        $this->security = $security;
    }

    public function getSubscribedEvents()
    {
        return [
            'prePersist',
            'preUpdate'
        ];
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $this->onCreateUser($args);
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $this->onUpdateUser($args);
    }

    public function onCreateUser(LifecycleEventArgs $args)
    {
        $user = $args->getObject();

        if (!$user instanceof UserInterface) {
            return ;
        }
        $user->setEnabled(true);
        !$user->getCreatedAt() ? $user->setCreatedAt(new \DateTime()) : 0;
        !$user->getUpdatedAt() ? $user->setUpdatedAt(new \DateTime()) : 0;
        !$user->getLang() ? $user->setLang('EN') : 0;
        if (!$user->getplainPassword()) {
            throw new BadRequestHttpException('Plainpassword cannot be null or blank');
        }
    }

    public function onUpdateUser(LifecycleEventArgs $args)
    {
        $user = $args->getObject();

        if (!$user instanceof UserInterface) {
            return;
        }
        $user->setUpdatedAt(new \DateTime());
    }
}