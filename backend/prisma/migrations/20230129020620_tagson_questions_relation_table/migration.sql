/*
  Warnings:

  - You are about to drop the column `questionId` on the `QuestionTag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `QuestionTag` DROP FOREIGN KEY `QuestionTag_questionId_fkey`;

-- AlterTable
ALTER TABLE `QuestionTag` DROP COLUMN `questionId`;

-- CreateTable
CREATE TABLE `TagsOnQuestions` (
    `questionId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`questionId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `questionId` ON `Question`(`questionId`);

-- AddForeignKey
ALTER TABLE `TagsOnQuestions` ADD CONSTRAINT `TagsOnQuestions_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`questionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagsOnQuestions` ADD CONSTRAINT `TagsOnQuestions_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `QuestionTag`(`tagId`) ON DELETE RESTRICT ON UPDATE CASCADE;
