-- AlterTable
ALTER TABLE `QuestionTag` ADD COLUMN `description` VARCHAR(200) NOT NULL DEFAULT '',
    ADD COLUMN `status` ENUM('NORMAL', 'DELETED') NOT NULL DEFAULT 'NORMAL';
