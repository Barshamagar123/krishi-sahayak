-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `nameNe` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `municipality` VARCHAR(191) NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'ne',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_phone_idx`(`phone`),
    INDEX `User_district_idx`(`district`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Session_token_key`(`token`),
    INDEX `Session_token_idx`(`token`),
    INDEX `Session_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
