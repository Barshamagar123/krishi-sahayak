-- AlterTable
ALTER TABLE `Crop` ADD COLUMN `rainfallMax` INTEGER NULL,
    ADD COLUMN `rainfallMin` INTEGER NULL,
    ADD COLUMN `soilType` VARCHAR(191) NULL,
    ADD COLUMN `temperatureMax` DOUBLE NULL,
    ADD COLUMN `temperatureMin` DOUBLE NULL;
