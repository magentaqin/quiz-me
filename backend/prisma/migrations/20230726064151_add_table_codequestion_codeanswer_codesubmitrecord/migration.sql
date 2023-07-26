-- CreateTable
CREATE TABLE `CodeQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(300) NOT NULL,
    `lang` ENUM('JAVASCRIPT', 'JAVA', 'CPLUSPLUS', 'GO', 'RUST', 'PYTHON') NOT NULL DEFAULT 'JAVASCRIPT',
    `description` VARCHAR(5000) NOT NULL,
    `codeBlock` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `questionId` VARCHAR(191) NOT NULL,
    `level` ENUM('ENTRY', 'MID', 'HIGH') NOT NULL DEFAULT 'ENTRY',
    `status` ENUM('NORMAL', 'DELETED') NOT NULL DEFAULT 'NORMAL',

    UNIQUE INDEX `CodeQuestion_title_key`(`title`),
    UNIQUE INDEX `CodeQuestion_questionId_key`(`questionId`),
    INDEX `questionId`(`questionId`),
    FULLTEXT INDEX `CodeQuestion_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `answerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CodeAnswer_answerId_key`(`answerId`),
    INDEX `author`(`authorId`),
    INDEX `question`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeSubmitRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `result` ENUM('UNKNOWN', 'PASS', 'FAIL') NOT NULL DEFAULT 'UNKNOWN',
    `resultDescription` VARCHAR(5000) NOT NULL,

    UNIQUE INDEX `CodeSubmitRecord_recordId_key`(`recordId`),
    INDEX `author`(`authorId`),
    INDEX `question`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CodeAnswer` ADD CONSTRAINT `CodeAnswer_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeAnswer` ADD CONSTRAINT `CodeAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `CodeQuestion`(`questionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeSubmitRecord` ADD CONSTRAINT `CodeSubmitRecord_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeSubmitRecord` ADD CONSTRAINT `CodeSubmitRecord_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `CodeQuestion`(`questionId`) ON DELETE RESTRICT ON UPDATE CASCADE;
