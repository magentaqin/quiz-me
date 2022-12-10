/*
  Warnings:

  - You are about to alter the column `title` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(30)`.
  - You are about to alter the column `description` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5000)` to `VarChar(500)`.
  - You are about to alter the column `name` on the `QuestionTag` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(20)`.
  - A unique constraint covering the columns `[questionId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tagId]` on the table `QuestionTag` will be added. If there are existing duplicate values, this will fail.
  - The required column `questionId` was added to the `Question` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `tagId` was added to the `QuestionTag` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionTag` DROP FOREIGN KEY `QuestionTag_questionId_fkey`;

-- AlterTable
ALTER TABLE `Answer` MODIFY `questionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `questionId` VARCHAR(191) NOT NULL,
    MODIFY `title` VARCHAR(30) NOT NULL,
    MODIFY `description` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `QuestionTag` ADD COLUMN `tagId` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(20) NOT NULL,
    MODIFY `questionId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Question_questionId_key` ON `Question`(`questionId`);

-- CreateIndex
CREATE UNIQUE INDEX `QuestionTag_tagId_key` ON `QuestionTag`(`tagId`);

-- AddForeignKey
ALTER TABLE `QuestionTag` ADD CONSTRAINT `QuestionTag_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`questionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`questionId`) ON DELETE RESTRICT ON UPDATE CASCADE;
