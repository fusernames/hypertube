<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190402100054 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE oauth2_access_tokens DROP FOREIGN KEY FK_D247A21B19EB6921');
        $this->addSql('ALTER TABLE oauth2_auth_codes DROP FOREIGN KEY FK_A018A10D19EB6921');
        $this->addSql('ALTER TABLE oauth2_refresh_tokens DROP FOREIGN KEY FK_D394478C19EB6921');
        $this->addSql('DROP TABLE oauth2_access_tokens');
        $this->addSql('DROP TABLE oauth2_auth_codes');
        $this->addSql('DROP TABLE oauth2_clients');
        $this->addSql('DROP TABLE oauth2_refresh_tokens');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE oauth2_access_tokens (id INT AUTO_INCREMENT NOT NULL, client_id INT NOT NULL, user_id INT DEFAULT NULL, token VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, expires_at INT DEFAULT NULL, scope VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, INDEX IDX_D247A21B19EB6921 (client_id), UNIQUE INDEX UNIQ_D247A21B5F37A13B (token), INDEX IDX_D247A21BA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE oauth2_auth_codes (id INT AUTO_INCREMENT NOT NULL, client_id INT NOT NULL, user_id INT DEFAULT NULL, token VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, redirect_uri LONGTEXT NOT NULL COLLATE utf8_unicode_ci, expires_at INT DEFAULT NULL, scope VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, INDEX IDX_A018A10D19EB6921 (client_id), UNIQUE INDEX UNIQ_A018A10D5F37A13B (token), INDEX IDX_A018A10DA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE oauth2_clients (id INT AUTO_INCREMENT NOT NULL, random_id VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, redirect_uris LONGTEXT NOT NULL COLLATE utf8_unicode_ci COMMENT \'(DC2Type:array)\', secret VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, allowed_grant_types LONGTEXT NOT NULL COLLATE utf8_unicode_ci COMMENT \'(DC2Type:array)\', type VARCHAR(150) DEFAULT NULL COLLATE utf8_unicode_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE oauth2_refresh_tokens (id INT AUTO_INCREMENT NOT NULL, client_id INT NOT NULL, user_id INT DEFAULT NULL, token VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, expires_at INT DEFAULT NULL, scope VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, INDEX IDX_D394478C19EB6921 (client_id), UNIQUE INDEX UNIQ_D394478C5F37A13B (token), INDEX IDX_D394478CA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE oauth2_access_tokens ADD CONSTRAINT FK_D247A21B19EB6921 FOREIGN KEY (client_id) REFERENCES oauth2_clients (id)');
        $this->addSql('ALTER TABLE oauth2_access_tokens ADD CONSTRAINT FK_D247A21BA76ED395 FOREIGN KEY (user_id) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE oauth2_auth_codes ADD CONSTRAINT FK_A018A10D19EB6921 FOREIGN KEY (client_id) REFERENCES oauth2_clients (id)');
        $this->addSql('ALTER TABLE oauth2_auth_codes ADD CONSTRAINT FK_A018A10DA76ED395 FOREIGN KEY (user_id) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE oauth2_refresh_tokens ADD CONSTRAINT FK_D394478C19EB6921 FOREIGN KEY (client_id) REFERENCES oauth2_clients (id)');
        $this->addSql('ALTER TABLE oauth2_refresh_tokens ADD CONSTRAINT FK_D394478CA76ED395 FOREIGN KEY (user_id) REFERENCES fos_user (id)');
    }
}
