<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190404193711 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE movie_status (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, movie_id INT NOT NULL, time INT NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_82C7F869A76ED395 (user_id), INDEX IDX_82C7F8698F93B6FC (movie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET UTF8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE media_object (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, content_url VARCHAR(255) DEFAULT NULL, created_at DATETIME DEFAULT NULL, INDEX IDX_14D431327E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET UTF8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE movie_status ADD CONSTRAINT FK_82C7F869A76ED395 FOREIGN KEY (user_id) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE movie_status ADD CONSTRAINT FK_82C7F8698F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id)');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D431327E3C61F9 FOREIGN KEY (owner_id) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE fos_user ADD avatar_id INT DEFAULT NULL, CHANGE fullname avatar_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE fos_user ADD CONSTRAINT FK_957A647986383B10 FOREIGN KEY (avatar_id) REFERENCES media_object (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_957A647986383B10 ON fos_user (avatar_id)');
        $this->addSql('ALTER TABLE movie ADD torrent_link LONGTEXT NOT NULL, ADD torrent_id INT NOT NULL, ADD file_name VARCHAR(255) DEFAULT NULL, ADD finished TINYINT(1) NOT NULL, DROP description');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE fos_user DROP FOREIGN KEY FK_957A647986383B10');
        $this->addSql('DROP TABLE movie_status');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP INDEX UNIQ_957A647986383B10 ON fos_user');
        $this->addSql('ALTER TABLE fos_user DROP avatar_id, CHANGE avatar_url fullname VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE movie ADD description LONGTEXT DEFAULT NULL COLLATE utf8mb4_unicode_ci, DROP torrent_link, DROP torrent_id, DROP file_name, DROP finished');
    }
}
