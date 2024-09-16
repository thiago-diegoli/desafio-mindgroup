/*
  Warnings:

  - Made the column `responsibleId` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_responsibleId_fkey`;

-- AlterTable
ALTER TABLE `task` MODIFY `responsibleId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_responsibleId_fkey` FOREIGN KEY (`responsibleId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
