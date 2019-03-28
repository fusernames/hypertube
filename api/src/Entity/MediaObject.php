<?php

namespace App\Entity;

use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Vich\UploaderBundle\Mapping\Annotation\Uploadable;

use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;

use App\Controller\CreateMediaObjectAction;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MediaObjectRepository")
 * @ApiResource(
 *      collectionOperations={
 *          "get",
 *          "post"={
 *              "method"="POST",
 *              "path"="/media_objects",
 *              "controller"=CreateMediaObjectAction::class,
 *              "defaults"={"_api_receive"=false},
 *          },
 *      },
 *      itemOperations={
 *          "get",
 *          "delete"
 *      }
 * )
 * @Vich\Uploadable
 */
class MediaObject
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var File|null
     * @Assert\NotBlank(
     *      message="Please, upload the photo."
     * )
     * @Assert\File(
     *      maxSize="1024k",
     *      mimeTypes={
     *          "image/png",
     *          "image/jpeg",
     *          "image/jpg"
     *      },
     *      mimeTypesMessage="Please upload a valid format: png, jpeg, jpg",
     *      maxSizeMessage="The maximum size allowed is 1024KB"
     * )
     * @Vich\UploadableField(
     *      mapping="media_object",
     *      fileNameProperty="contentUrl"
     * )
     */
    public $file;

    /**
     * @var string|null
     * @ORM\Column(nullable=true)
     * @Groups({"user", "me"})
     */
    public $contentUrl;

    public function getId(): ?int
    {
        return $this->id;
    }
}
