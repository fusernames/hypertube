<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Controller\AddAvatarController;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Controller\CreateMediaObjectAction;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation\Uploadable;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MediaObjectRepository")
 * @ApiResource(
 *      attributes={
 *          "pagination_client_enabled"=true,
 *          "pagination_client_items_per_page"=true,
 *          "maximum_items_per_page"=50
 *      },
 *      collectionOperations={
 *          "get",
 *          "post"={
 *              "method"="POST",
 *              "path"="/media_objects",
 *              "controller"=CreateMediaObjectAction::class,
 *              "defaults"={"_api_receive"=false},
 *              "access_control"="is_granted('ROLE_USER')"
 *          },
 *          "add-avatar"={
 *              "method"="POST",
 *              "path"="/media_objects/avatar/create",
 *              "controller"=AddAvatarController::class,
 *              "defaults"={"_api_receive"=false},
 *              "access_control"="is_granted('ROLE_USER')"
 *          }
 *      },
 *      itemOperations={
 *          "get",
 *          "delete"={
 *              "access_control"="is_granted('ROLE_USER')"
 *          }
 *      }
 * )
 * @ApiFilter(
 *      SearchFilter::class,
 *      properties={
 *          "owner.id": "exact"
 *      }
 * )
 * @ApiFilter(
 *      OrderFilter::class,
 *      properties={
 *          "id": "ASC",
 *          "createdAt": "ASC",
 *          "owner.id": "ASC",
 *      },
 *      arguments={"orderParameterName"="order"}
 * )
 * @Vich\Uploadable
 * @ORM\HasLifecycleCallbacks()
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
     *      mimeTypesMessage="Accepted formats are: png, jpeg, jpg",
     *      maxSizeMessage="The maximum size allowed is 1024KB",
     *      uploadIniSizeErrorMessage="File is to big"
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
     * @Groups({"user", "me", "message"})
     */
    public $contentUrl;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", cascade={"persist", "remove"})
     */
    private $owner;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $createdAt;

    /**
     * @ORM\PrePersist
     */
    public function onCreate() {
       !$this->getCreatedAt() ? $this->setCreatedAt(new \DateTime()) : 0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getContentUrl(): ?string
    {
        return $this->contentUrl;
    }

    public function setContentUrl(?string $contentUrl): self
    {
        $this->contentUrl = $contentUrl;

        return $this;
    }
}
