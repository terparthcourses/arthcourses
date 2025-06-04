// Drizzle ORM
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
  varchar
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", [
  "STUDENT",
  "TEACHER",
  "ADMINISTRATOR"
]);

export const imageMimeTypeEnum = pgEnum("image_mime_type", [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",
  "image/heic",
  "image/heif",
  "image/avif"
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: varchar("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  phone: varchar("phone").notNull(),
  role: userRoleEnum("role").notNull().default("STUDENT"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  artworkIds: text("artwork_ids").notNull().array().default(sql`ARRAY[]::text[]`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const artworks = pgTable("artworks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  images: text("images").notNull().array().default(sql`ARRAY[]::text[]`),
  periodTags: text("period_tags").notNull().array().default(sql`ARRAY[]::text[]`),
  typeTags: text("type_tags").notNull().array().default(sql`ARRAY[]::text[]`),
  collocation: text("collocation"),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const images = pgTable("images", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  size: integer("size"),
  mimeType: imageMimeTypeEnum("mime_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const completions = pgTable("completions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  artworkId: text("artwork_id").notNull().references(() => artworks.id, { onDelete: "cascade" }),
  enrollmentId: text("enrollment_id").notNull().references(() => enrollments.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const schema = {
  users: users,
  sessions: sessions,
  accounts: accounts,
  verifications: verifications,
  courses: courses,
  artworks: artworks,
  images: images,
  enrollments: enrollments,
  completions: completions,
};