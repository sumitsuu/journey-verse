/*
  Warnings:

  - Made the column `locale` on table `ArtTranslations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locale` on table `CountryTranslations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locale` on table `GenreTranslations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locale` on table `StatusTranslations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locale` on table `TypeTranslations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ArtTranslations` MODIFY `locale` ENUM('en', 'ru') NOT NULL;

-- AlterTable
ALTER TABLE `CountryTranslations` MODIFY `locale` ENUM('en', 'ru') NOT NULL;

-- AlterTable
ALTER TABLE `GenreTranslations` MODIFY `locale` ENUM('en', 'ru') NOT NULL;

-- AlterTable
ALTER TABLE `StatusTranslations` MODIFY `locale` ENUM('en', 'ru') NOT NULL;

-- AlterTable
ALTER TABLE `TypeTranslations` MODIFY `locale` ENUM('en', 'ru') NOT NULL;
