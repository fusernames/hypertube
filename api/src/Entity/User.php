<?php

namespace App\Entity;

use App\Entity\MediaObject;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\GetMeController;
use App\Controller\OAuthController;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\GroupInterface;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Controller\Lang\GetLangController;
use App\Controller\Lang\SetLangController;
use App\Controller\ResetPasswordController;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\ChangePasswordController;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Controller\ResettingPasswordSendEmailController;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 * @ApiResource(
 *      attributes={"pagination_items_per_page"=5},
 *      normalizationContext={
 *          "groups"={
 *              "user",
 *              "user:read"
 *          }
 *      },
 *      denormalizationContext={
 *          "groups"={
 *              "user",
 *              "user:write"
 *          }
 *      },
 *      itemOperations={
 *          "get",
 *          "put"={
 *              "method"="PUT",
 *              "path"="users/{id}",
 *              "access_control"="(is_granted('ROLE_USER') and object == user) or is_granted('ROLE_ADMIN')",
 *              "access_control_message"="Sorry, you are not authorized to update this user.",
 *              "denormalization_context"={
 *                  "groups"={"me"}
 *              },
 *              "normalization_context"={
 *                  "groups"={"me"}
 *              }
 *          },
 *          "delete"={
 *              "method"="DELETE",
 *              "path"="users/{id}",
 *              "access_control"="(is_granted('ROLE_USER') and object == user) or is_granted('ROLE_ADMIN')",
 *              "access_control_message"="Sorry, you are not authorized to delete this user."
 *          }
 *      },
 *      collectionOperations={
 *          "me"={
 *              "method"="GET",
 *              "path"="users/me",
 *              "access_control"="is_granted('ROLE_USER')",
 *              "denormalization_context"={
 *                  "groups"={"me"}
 *              },
 *              "normalization_context"={
 *                  "groups"={"me", "user:read"}
 *              },
 *              "controller"=GetMeController::class,
 *              "defaults"={"_api_receive"=false}
 *          },
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
 *          "rest-password"={
 *              "method"="POST",
 *              "path"="/users/reset-password/{token}",
 *              "controller"=ResetPasswordController::class,
 *              "denormalization_context"={
 *                  "groups"={"rest-password"}
 *              }
 *          },
 *          "set-lang"={
 *              "method"="POST",
 *              "path"="/lang/set",
 *              "controller"=SetLangController::class,
 *              "denormalization_context"={
 *                  "groups"={"set-lang"}
 *              },
 *              "access_control"="is_granted('ROLE_USER')",
 *          },
 *          "get-lang"={
 *              "method"="GET",
 *              "path"="/lang/get",
 *              "controller"=GetLangController::class,
 *              "denormalization_context"={
 *                  "groups"={"get-lang"}
 *              },
 *              "access_control"="is_granted('ROLE_USER')",
 *          },
 *          "oauth"={
 *              "method"="POST",
 *              "path"="/users/oauth",
 *              "controller"=OAuthController::class,
 *              "denormalization_context"={
 *                  "groups"={"oauth"}
 *              },
 *          },
 *          "post",
 *          "get"
 *      },
 *      subresourceOperations={
 *          "messages_get_subresource"={
 *              "method"="GET",
 *              "path"="/users/{id}/messages",
 *              "access_control"="(is_granted('ROLE_USER') and object == user) or is_granted('ROLE_ADMIN')",
 *              "access_control_message"="Sorry, you are not authorized to delete this user."
 *          },
 *      }
 * )
 * @ApiFilter(
 *      SearchFilter::class,
 *      properties={
 *          "id": "exact",
 *          "email": "ipartial",
 *          "fullname": "ipartial",
 *          "username": "ipartial",
 *          "firstname": "ipartial",
 *          "lastname": "ipartial"
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
 * @UniqueEntity("email")
 * @UniqueEntity("username")
 * @UniqueEntity("avatar")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"user:read", "me:read", "message"})
     */
    protected $id;

    /**
     * @Groups({"change-password"})
     * @Assert\Length(
     *      min = 5,
     *      max = 255,
     *      minMessage="The password must be at least {{ limit }} characters long",
     *      maxMessage="The password cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\Regex("/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/")
     */
    protected $current_password;

    /**
     * @Groups({"change-password"})
     * @Assert\Length(
     *      min = 5,
     *      max = 255,
     *      minMessage="The password must be at least {{ limit }} characters long",
     *      maxMessage="The password cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\Regex("/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/")
     */
    protected $new_password;

    /**
     * @Groups({"change-password"})
     * @Assert\Length(
     *      min = 5,
     *      max = 255,
     *      minMessage="The password must be at least {{ limit }} characters long",
     *      maxMessage="The password cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\Regex("/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/")
     */
    protected $confirm_new_password;

    /**
     * @Groups({"user:write", "me", "rest-password-send-email"})
     * @Assert\Email(message = "The email '{{ value }}' is not a valid email.")
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\NotNull(message="Email cannot be null")
     * @Assert\NotBlank(message="Email cannot be blank")
     */
    protected $email;

    /**
     * @Groups({"user:write"})
     * @Assert\Length(
     *      min = 5,
     *      max = 255,
     *      minMessage="The password must be at least {{ limit }} characters long",
     *      maxMessage="The password cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\Regex("/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/")
     */
    protected $plainPassword;

    /**
     * @Groups({"user", "me", "message"})
     * @Assert\NotNull(message="The username cannot be null")
     * @Assert\NotBlank(message="Your username cannot be blank")
     * @Assert\Length(
     *      min = 3,
     *      max = 20,
     *      minMessage="The username must be at least {{ limit }} characters long",
     *      maxMessage="The username cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     */
    protected $username;

    /**
     * @var bool
     * @Groups({"user", "me"})
     * @Assert\Type(
     *     type="bool",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
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
     * @Assert\NotNull(message="The firstname cannot be null")
     * @Assert\NotBlank(message="The firstname cannot be blank")
     * @Groups({"user", "me", "message"})
     * @Assert\Length(
     *      min = 2,
     *      max = 40,
     *      minMessage = "The firstname must be at least {{ limit }} characters long",
     *      maxMessage = "The firstname cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\Regex(
     *     pattern="/^([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+([-]([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+)*$/",
     *     match=true,
     *     message="Firstname cannot contain a number"
     * )
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user", "me", "message"})
     * @Assert\Length(
     *      min = 2,
     *      max = 40,
     *      minMessage = "The last name must be at least {{ limit }} characters long",
     *      maxMessage = "The last name cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\Regex(
     *     pattern="/^([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+([-]([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+)*$/",
     *     match=true,
     *     message="Lastname cannot contain a number"
     * )
     * @Assert\NotNull(message="The lastname cannot be null")
     * @Assert\NotBlank(message="Your lastname cannot be blank")
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"me", "get-lang", "set-lang"})
     * @Assert\Length(
     *      max = 255,
     *      maxMessage = "The lang cannot be longer than {{ limit }} characters"
     * )
     * @Assert\Type(
     *     type="string",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     */
    private $lang;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Message", mappedBy="owner", orphanRemoval=true)
     * @ApiSubresource(maxDepth=1)
     */
    private $messages;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\MediaObject", cascade={"persist", "remove"})
     * @Groups({"user:read", "me", "message"})
     * @ApiSubresource(maxDepth=1)
     */
    private $avatar;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\MovieStatus", mappedBy="user", orphanRemoval=true)
     * @ApiSubresource(maxDepth=1)
     */
    private $movieStatuses;

    /**
     * @Groups({"oauth"})
     */
    private $token;

    /**
     * @Groups({"oauth"})
     */
    private $api;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read", "me:read", "message"})
     */
    private $avatarUrl;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"me:read"})
     */
    private $oAuthAccess;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\OmniAuthInfos", mappedBy="user", cascade={"all"})
     */
    private $omniAuthInfos;

    public function __construct()
    {
        parent::__construct();
        $this->messages = new ArrayCollection();
        $this->movieStatuses = new ArrayCollection();
        $this->omniAuthInfos = new ArrayCollection();
    }

    /**
     * @ORM\PrePersist
     */
    public function onCreate() {
       !$this->getCreatedAt() ? $this->setCreatedAt(new \DateTime()) : 0;
       !$this->getUpdatedAt() ? $this->setUpdatedAt(new \DateTime()) : 0;
       $this->enabled = true;
       $this->getOAuthAccess() === null ? $this->setOAuthAccess(false) : 0;
       !$this->lang ? $this->lang = 'EN' : 0;
    }

    /**
     * @ORM\PreUpdate
     */
    public function onUpdate() {
       $this->setUpdatedAt(new \DateTime());
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

    public function getAvatar(): ?MediaObject
    {
        return $this->avatar;
    }

    public function setAvatar(?MediaObject $avatar): self
    {
        $this->avatar = $avatar;

        return $this;
    }

    /**
     * @return Collection|MovieStatus[]
     */
    public function getMovieStatuses(): Collection
    {
        return $this->movieStatuses;
    }

    public function addMovieStatus(MovieStatus $movieStatus): self
    {
        if (!$this->movieStatuses->contains($movieStatus)) {
            $this->movieStatuses[] = $movieStatus;
            $movieStatus->setUser($this);
        }

        return $this;
    }

    public function removeMovieStatus(MovieStatus $movieStatus): self
    {
        if ($this->movieStatuses->contains($movieStatus)) {
            $this->movieStatuses->removeElement($movieStatus);
            // set the owning side to null (unless already changed)
            if ($movieStatus->getUser() === $this) {
                $movieStatus->setUser(null);
            }
        }

        return $this;
    }

    public function getOmniAuthToken(): ?string
    {
        return $this->omniAuthToken;
    }

    public function setOmniAuthToken(?string $omniAuthToken): self
    {
        $this->omniAuthToken = $omniAuthToken;

        return $this;
    }

    public function getOmniAuthMethod(): ?string
    {
        return $this->omniAuthMethod;
    }

    public function setOmniAuthMethod(?string $omniAuthMethod): self
    {
        $this->omniAuthMethod = $omniAuthMethod;

        return $this;
    }

    public function getAvatarUrl(): ?string
    {
        return str_replace(' ', '%20', $this->avatarUrl);
    }

    public function setAvatarUrl(?string $avatarUrl): self
    {
        $this->avatarUrl = str_replace(' ', '%20', $avatarUrl);

        return $this;
    }

    public function getOAuthAccess(): ?bool
    {
        return $this->oAuthAccess;
    }

    public function setOAuthAccess(?bool $oAuthAccess): self
    {
        $this->oAuthAccess = $oAuthAccess;

        return $this;
    }

    /**
     * @return Collection|OmniAuthInfos[]
     */
    public function getOmniAuthInfos(): Collection
    {
        return $this->omniAuthInfos;
    }

    public function addOmniAuthInfo(OmniAuthInfos $omniAuthInfo): self
    {
        if (!$this->omniAuthInfos->contains($omniAuthInfo)) {
            $this->omniAuthInfos[] = $omniAuthInfo;
            $omniAuthInfo->setUser($this);
        }

        return $this;
    }

    public function removeOmniAuthInfo(OmniAuthInfos $omniAuthInfo): self
    {
        if ($this->omniAuthInfos->contains($omniAuthInfo)) {
            $this->omniAuthInfos->removeElement($omniAuthInfo);
            // set the owning side to null (unless already changed)
            if ($omniAuthInfo->getUser() === $this) {
                $omniAuthInfo->setUser(null);
            }
        }

        return $this;
    }
}
