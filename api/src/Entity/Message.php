<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Controller\CommentMovieController;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *      attributes={"pagination_items_per_page"=15},
 *      normalizationContext={
 *          "groups"={"message"}
 *      },
 *      denormalizationContext={
 *          "groups"={"message"}
 *      },
 *      itemOperations={
 *          "get",
 *          "put"={
 *              "access_control"="is_granted('ROLE_USER') and object.owner == user",
 *              "access_control_message"="Sorry, you are not authorized to update this message."
 *          },
 *          "delete"={
 *              "access_control"="(is_granted('ROLE_USER') and object.owner == user) or is_granted('ROLE_ADMIN')",
 *              "access_control_message"="Sorry, you are not authorized to delete this message."
 *          }
 *      },
 *      collectionOperations={
 *          "post"={
 *              "access_control"="is_granted('ROLE_USER') and object.owner == user",
 *              "access_control_message"="You are not allowed to post a message with this identity."
 *          },
 *          "get"
 *      }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\MessageRepository")
 * @ORM\HasLifecycleCallbacks()
 * @ApiFilter(
 *      SearchFilter::class,
 *      properties={
 *          "id": "exact",
 *          "owner.id": "exact",
 *          "movie.id": "exact",
 *          "movie": "exact"
 *      }
 * )
 * @ApiFilter(
 *      DateFilter::class,
 *      properties={
 *          "createdAt": DateFilter::INCLUDE_NULL_AFTER,
 *          "updatedAt": DateFilter::INCLUDE_NULL_AFTER
 *      }
 * )
 * @ApiFilter(
 *      OrderFilter::class,
 *      properties={
 *          "id": "ASC",
 *          "createdAt": "ASC",
 *          "updatedAt": "ASC"
 *      },
 *      arguments={"orderParameterName"="order"}
 * )
 */
class Message
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"message"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="messages")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull(message="Owner cannot be null")
     * @Groups({"message"})
     */
    public $owner;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"message"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"message"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="text")
     * @Assert\NotNull(message="Message cannot be null")
     * @Assert\NotBlank(message="Message cannot be blank")
     * @Assert\Regex(
     *     pattern="/^\s+$/",
     *     match=false,
     *     message="This message {{ value }} is not readable"
     * )
     * @Groups({"message"})
     */
    private $message;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Movie", inversedBy="messages")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull(message="Movie cannot be null")
     * @Groups({"message"})
     */
    private $movie;

    /**
     * @ORM\PrePersist
     */
    public function onCreate() {
       !$this->getCreatedAt() ? $this->setCreatedAt(new \DateTime()) : 0;
       !$this->getUpdatedAt() ? $this->setUpdatedAt(new \DateTime()) : 0;
    }

    /**
     * @ORM\PreUpdate
     */
    public function onUpdate() {
       $this->setUpdatedAt(new \DateTime());
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

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getMovie(): ?Movie
    {
        return $this->movie;
    }

    public function setMovie(?Movie $movie): self
    {
        $this->movie = $movie;

        return $this;
    }
}
