/*
  Warnings:

  - You are about to alter the column `language` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `language` ENUM('ne', 'en') NOT NULL DEFAULT 'ne';
