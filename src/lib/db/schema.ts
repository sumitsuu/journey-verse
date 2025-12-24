import { integer, numeric, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const localesEnum = pgEnum("locales", ["en", "ru"]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  avatarPath: varchar("avatar_path", { length: 255 }),
  favouredTypeId: integer("favoured_type_id"),
});

export const types = pgTable("types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
});

export const typeTranslations = pgTable("type_translations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  locale: localesEnum("locale").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  catalogName: varchar("catalog_name", { length: 255 }).notNull(),
  typeId: integer("type_id").notNull(),
});

export const genres = pgTable("genres", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
});

export const genreTranslations = pgTable("genre_translations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  locale: localesEnum("locale").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  genreId: integer("genre_id").notNull(),
});

export const statuses = pgTable("statuses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
});

export const statusTranslations = pgTable("status_translations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  statusId: integer("status_id").notNull(),
  locale: localesEnum("locale").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const countries = pgTable("countries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
});

export const countryTranslations = pgTable("country_translations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  countryId: integer("country_id").notNull(),
  locale: localesEnum("locale").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const arts = pgTable("arts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  releaseDate: timestamp("release_date", { withTimezone: false }).notNull(),
  previewPath: varchar("preview_path", { length: 255 }),
  episodes: integer("episodes").notNull(),
  countryId: integer("country_id").notNull(),
  typeId: integer("type_id").notNull(),
  statusId: integer("status_id").notNull(),
  rating: numeric("rating", { precision: 10, scale: 2 }),
});

export const artTranslations = pgTable("art_translations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  artId: integer("art_id").notNull(),
  locale: localesEnum("locale").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
});

export const artGenres = pgTable("art_genres", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  artId: integer("art_id").notNull(),
  genreId: integer("genre_id").notNull(),
});

export const genreTypes = pgTable("genre_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  typeId: integer("type_id").notNull(),
  genreId: integer("genre_id").notNull(),
});
