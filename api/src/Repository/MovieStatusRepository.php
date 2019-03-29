<?php

namespace App\Repository;

use App\Entity\MovieStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method MovieStatus|null find($id, $lockMode = null, $lockVersion = null)
 * @method MovieStatus|null findOneBy(array $criteria, array $orderBy = null)
 * @method MovieStatus[]    findAll()
 * @method MovieStatus[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MovieStatusRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, MovieStatus::class);
    }

    // /**
    //  * @return MovieStatus[] Returns an array of MovieStatus objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MovieStatus
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
