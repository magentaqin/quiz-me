-- AlterTable
ALTER TABLE `Answer` MODIFY `authorId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `author` ON `Answer`(`authorId`);

-- CreateIndex
CREATE INDEX `author` ON `Question`(`authorId`);

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Answer` RENAME INDEX `Answer_questionId_fkey` TO `question`;

-- RenameIndex
ALTER TABLE `QuestionTag` RENAME INDEX `QuestionTag_questionId_fkey` TO `question`;
