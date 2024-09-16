-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_responsibleId_fkey`;

-- AlterTable
ALTER TABLE `task` MODIFY `responsibleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_responsibleId_fkey` FOREIGN KEY (`responsibleId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
