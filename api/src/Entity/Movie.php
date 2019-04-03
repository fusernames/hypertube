<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Controller\GetMovieController;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Doctrine\Common\Collections\ArrayCollection;
use App\Controller\Torrent\StatusTorrentController;
use App\Controller\Torrent\DownloadTorrentController;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *      attributes={"pagination_items_per_page"=5},
 *      itemOperations={
 *          "get"={
 *              "access_control"="is_granted('ROLE_USER')"
 *          },
 *          "put"={
 *              "access_control"="is_granted('ROLE_USER')"
 *          },
 *          "delete"={
 *              "access_control"="is_granted('ROLE_USER')"
 *          }
 *      },
 *      collectionOperations={
 *          "download-torrent"={
 *              "access_control"="is_granted('ROLE_USER')",
 *              "method"="POST",
 *              "path"="/movies/torrent/download",
 *              "controller"=DownloadTorrentController::class
 *          },
 *          "torrent-status"={
 *              "access_control"="is_granted('ROLE_USER')",
 *              "method"="POST",
 *              "path"="/movies/torrent/status",
 *              "controller"=StatusTorrentController::class
 *          },
 *          "post",
 *          "get",
 *          "get_movie_file"={
 *              "method"="GET",
 *              "path"="/movies/file/{id}",
 *              "controller"=GetMovieController::class
 *          }
 *      }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\MovieRepository")
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
 *          "createdAt": "ASC"
 *      },
 *      arguments={"orderParameterName"="order"}
 * )
 * @ApiFilter(
 *      SearchFilter::class,
 *      properties={
 *          "id": "exact",
 *          "name": "ipartial",
 *          "finished": "exact",
 *          "torrentLink": "ipartial"
 *      }
 * )
 * @ORM\HasLifecycleCallbacks()
 */
class Movie
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull(message="Name cannot be null")
     * @Assert\NotBlank(message="Name cannot be blank")
     * @Assert\Length(
     *      min = 1,
     *      max = 255,
     *      minMessage = "Name must be at least {{ limit }} characters long",
     *      maxMessage = "Name cannot be longer than {{ limit }} characters"
     * )
     */
    private $name;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="text")
     */
    private $torrentLink;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Message", mappedBy="movie", orphanRemoval=true)
     * @ApiSubresource
     */
    private $messages;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Type(
     *     type="integer",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     */
    private $torrentId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $fileName;

    /**
     * @ORM\Column(type="boolean")
     * @Assert\Type(
     *     type="bool",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     */
    private $finished = false;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\MovieStatus", mappedBy="movie", orphanRemoval=true)
     */
    private $movieStatuses;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
        $this->movieStatuses = new ArrayCollection();
    }

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

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

    public function getTorrentLink(): ?string
    {
        return $this->torrentLink;
    }

    public function setTorrentLink(string $torrentLink): self
    {
        $this->torrentLink = $torrentLink;

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
            $message->setMovie($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): self
    {
        if ($this->messages->contains($message)) {
            $this->messages->removeElement($message);
            // set the owning side to null (unless already changed)
            if ($message->getMovie() === $this) {
                $message->setMovie(null);
            }
        }

        return $this;
    }

    public function getTorrentId(): ?int
    {
        return $this->torrentId;
    }

    public function setTorrentId(int $torrentId): self
    {
        $this->torrentId = $torrentId;

        return $this;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileName(string $fileName): self
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getFinished(): ?bool
    {
        return $this->finished;
    }

    public function setFinished(bool $finished): self
    {
        $this->finished = $finished;

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
            $movieStatus->setMovie($this);
        }

        return $this;
    }

    public function removeMovieStatus(MovieStatus $movieStatus): self
    {
        if ($this->movieStatuses->contains($movieStatus)) {
            $this->movieStatuses->removeElement($movieStatus);
            // set the owning side to null (unless already changed)
            if ($movieStatus->getMovie() === $this) {
                $movieStatus->setMovie(null);
            }
        }

        return $this;
    }
}
