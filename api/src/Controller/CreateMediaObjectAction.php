<?php

namespace App\Controller;

use App\Entity\MediaObject;
use App\Form\MediaObjectType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;

final class CreateMediaObjectAction extends AbstractController
{
    /**
     * @var RegistryInterface
     */
    private $doctrine;

    /**
     * @var FormFactoryInterface
     */
    private $factory;

    /**
     * @var ValidatorInterface
     */
    private $validator;

    /**
     * @param RegistryInterface $doctrine
     * @param FormFactoryInterface $factory
     * @param ValidatorInterface $validator
     */
    public function __construct(RegistryInterface $doctrine, FormFactoryInterface $factory, ValidatorInterface $validator)
    {
        $this->validator = $validator;
        $this->doctrine = $doctrine;
        $this->factory = $factory;
    }

    /**
     * @param Request $request
     * @return MediaObject
     * 
     * @IsGranted("ROLE_USER")
     */
    public function __invoke(Request $request): MediaObject
    {
        $mediaObject = new MediaObject();

        $form = $this->factory->create(MediaObjectType::class, $mediaObject);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->doctrine->getManager();
            $mediaObject->setOwner($this->getUser());
            $em->persist($mediaObject);
            $em->flush();

            // Prevent the serialization of the file property
            $mediaObject->file = null;

            return $mediaObject;
        }

        // This will be handled by API Platform and returns a validation error.
        throw new ValidationException($this->validator->validate($mediaObject));
    }
}