-- AlterTable
ALTER TABLE `Question` MODIFY `title` VARCHAR(1000) NOT NULL,
    MODIFY `description` VARCHAR(5000) NOT NULL;

-- AlterTable
ALTER TABLE `QuestionTag` MODIFY `name` VARCHAR(30) NOT NULL;
