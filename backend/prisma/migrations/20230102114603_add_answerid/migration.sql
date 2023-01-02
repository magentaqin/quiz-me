/*
  Warnings:

  - A unique constraint covering the columns `[answerId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `answerId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Answer` ADD COLUMN `answerId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Answer_answerId_key` ON `Answer`(`answerId`);
