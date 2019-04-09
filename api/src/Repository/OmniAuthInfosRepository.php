<?php

namespace App\Repository;

use App\Entity\OmniAuthInfos;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method OmniAuthInfos|null find($id, $lockMode = null, $lockVersion = null)
 * @method OmniAuthInfos|null findOneBy(array $criteria, array $orderBy = null)
 * @method OmniAuthInfos[]    findAll()
 * @method OmniAuthInfos[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OmniAuthInfosRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, OmniAuthInfos::class);
    }

    // /**
    //  * @return OmniAuthInfos[] Returns an array of OmniAuthInfos objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('o.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?OmniAuthInfos
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
