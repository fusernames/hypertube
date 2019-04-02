<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190329091327 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');
        $this->addSql('CREATE TABLE movie_status (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, movie_id INT NOT NULL, time INT NOT NULL, INDEX IDX_82C7F869A76ED395 (user_id), INDEX IDX_82C7F8698F93B6FC (movie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE movie_status ADD CONSTRAINT FK_82C7F869A76ED395 FOREIGN KEY (user_id) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE movie_status ADD CONSTRAINT FK_82C7F8698F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id)');
        $this->addSql('ALTER TABLE media_object DROP FOREIGN KEY FK_14D431327E3C61F9');
        $this->addSql('DROP INDEX IDX_14D431327E3C61F9 ON media_object');
        $this->addSql('ALTER TABLE media_object DROP owner_id, DROP created_at');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');
        $this->addSql('DROP TABLE movie_status');
        $this->addSql('ALTER TABLE media_object ADD owner_id INT DEFAULT NULL, ADD created_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D431327E3C61F9 FOREIGN KEY (owner_id) REFERENCES fos_user (id)');
        $this->addSql('CREATE INDEX IDX_14D431327E3C61F9 ON media_object (owner_id)');
    }
}