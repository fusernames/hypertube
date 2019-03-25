<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Controller\GetMeController;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\GroupInterface;
use ApiPlatform\Core\Annotation\ApiFilter;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\ChangePasswordController;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Controller\ResettingPasswordTokenController;
use App\Controller\ResettingPasswordSendEmailController;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 * @ApiResource(
 *      normalizationContext={"groups"={"user", "user:read"}},
 *      denormalizationContext={"groups"={"user", "user:write"}},
 *      itemOperations={
 *          "me"={
 *              "method"="GET",
 *              "path"="users/me",
 *              "access_control"="is_granted('ROLE_USER')",
 *              "access_control_message"="Sorry, you must be logged in to perform this action",
 *              "denormalization_context"={"groups"={"me"}},
 *              "normalization_context"={"groups"={"me"}},
 *              "controller"=GetMeController::class,
 *              "defaults"={"_api_receive"=false}
 *          },
 *          "update"={
 *              "method"="PUT",
 *              "path"="users/{id}",
 *              "access_control"="(is_granted('ROLE_USER') and object == user) or is_granted('ROLE_ADMIN')",
 *              "access_control_message"="Sorry, you are not authorized to update this user.",
 *              "denormalization_context"={"groups"={"me"}},
 *              "normalization_context"={"groups"={"me"}}
 *          },
 *          "delete"={
 *              "method"="DELETE",
 *              "path"="users/{id}",
 *              "access_control"="(is_granted('ROLE_USER') and object == user) or is_granted('ROLE_ADMIN')",
 *              "access_control_message"="Sorry, you are not authorized to delete this user."
 *          },
 *          "get"
 *      },
 *      collectionOperations={
 *          "change-password"={
 *              "method"="POST",
 *              "access_control"="is_granted('ROLE_USER') or is_granted('ROLE_ADMIN')",
 *              "access_control_message"="Sorry, you are not authorized to access this service.",
 *              "path"="/users/me/change-password",
 *              "denormalization_context"={
 *                  "groups"={"change-password"}
 *              },
 *              "normalization_context"={
 *                  "groups"={"change-password"}
 *              },
 *              "controller"=ChangePasswordController::class
 *          },
 *          "rest-password-send-email"={
 *              "method"="POST",
 *              "path"="/users/reset-password/send-email",
 *              "controller"=ResettingPasswordSendEmailController::class,
 *              "denormalization_context"={
 *                  "groups"={"rest-password-send-email"}
 *              }
 *          },
 *          "reset-password"={
 *              "path"="/users/me/reset-password/{token}",
 *              "method"="POST",
 *              "controller"=ResettingPasswordTokenController::class
 *          },
 *          "post",
 *          "get"
 *      }
 * )
 * @ApiFilter(
 *      SearchFilter::class,
 *      properties={
 *          "id": "exact",
 *          "email": "ipartial",
 *          "fullname": "ipartial",
 *          "username": "ipartial"
 *      }
 * )
 * @ApiFilter(
 *      DateFilter::class,
 *      properties={
 *          "lastLogin": DateFilter::INCLUDE_NULL_AFTER,
 *          "createdAt": DateFilter::INCLUDE_NULL_AFTER,
 *          "updatedAt": DateFilter::INCLUDE_NULL_AFTER
 *      }
 * )
 * @ApiFilter(
 *      OrderFilter::class,
 *      properties={
 *          "id": "ASC",
 *          "lastLogin": "ASC",
 *          "createdAt": "ASC",
 *          "updatedAt": "ASC"
 *      },
 *      arguments={"orderParameterName"="order"}
 * )
 * @ORM\HasLifecycleCallbacks()
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @Groups({"change-password"})
     */
    protected $current_password;

    /**
     * @Groups({"change-password"})
     */
    protected $new_password;

    /**
     * @Groups({"user:write", "me", "rest-password-send-email"})
     */
    protected $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user", "me"})
     */
    protected $fullname;

    /**
     * @Groups({"user:write"})
     */
    protected $plainPassword;

    /**
     * @Groups({"user", "me"})
     */
    protected $username;

    /**
     * @var bool
     * @Groups({"user", "me"})
     */
    protected $enabled;

    /**
     * @var \DateTime|null
     * @Groups({"me"})
     */
    protected $lastLogin;

    /**
     * @var GroupInterface[]|Collection
     * @Groups({"me"})
     */
    protected $groups;

    /**
     * @var array
     * @Groups({"me"})
     */
    protected $roles;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"me"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"me"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user", "me"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user", "me"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"me"})
     */
    private $lang;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Message", mappedBy="owner", orphanRemoval=true)
     */
    private $messages;

    public function __construct()
    {
        parent::__construct();
        $this->messages = new ArrayCollection();
    }

    /**
     * @ORM\PrePersist
     */
    public function onCreate() {
       !$this->getCreatedAt() ? $this->setCreatedAt(new \DateTime()) : 0;
       !$this->getUpdatedAt() ? $this->setUpdatedAt(new \DateTime()) : 0;
       $this->enabled = true;
    }

    /**
     * @ORM\PreUpdate
     */
    public function onUpdate() {
       $this->setUpdatedAt(new \DateTime());
    }

    public function setFullname(?string $fullname): void
    {
        $this->fullname = $fullname;
    }

    public function getFullname(): ?string
    {
        return $this->fullname;
    }

    public function isUser(?UserInterface $user = null): bool
    {
        return $user instanceof self && $user->id === $this->id;
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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getLang(): ?string
    {
        return $this->lang;
    }

    public function setLang(?string $lang): self
    {
        $this->lang = $lang;

        return $this;
    }

    /**
     * @return Collection|Message[]
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): self
    {
        if (!$this->messages->contains($message)) {
            $this->messages[] = $message;
            $message->setOwner($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): self
    {
        if ($this->messages->contains($message)) {
            $this->messages->removeElement($message);
            // set the owning side to null (unless already changed)
            if ($message->getOwner() === $this) {
                $message->setOwner(null);
            }
        }

        return $this;
    }
}