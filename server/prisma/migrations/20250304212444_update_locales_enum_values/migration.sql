UPDATE ArtTranslations SET locale = 'en' WHERE locale = 'EN';
UPDATE CountryTranslations SET locale = 'ru' WHERE locale = 'RU';
UPDATE GenreTranslations SET locale = 'ru' WHERE locale = 'RU';
UPDATE StatusTranslations SET locale = 'en' WHERE locale = 'EN';
UPDATE TypeTranslations SET locale = 'ru' WHERE locale = 'RU';

ALTER TABLE ArtTranslations MODIFY locale ENUM('en', 'ru');
ALTER TABLE CountryTranslations MODIFY locale ENUM('en', 'ru');
ALTER TABLE GenreTranslations MODIFY locale ENUM('en', 'ru');
ALTER TABLE StatusTranslations MODIFY locale ENUM('en', 'ru');
ALTER TABLE TypeTranslations MODIFY locale ENUM('en', 'ru');

