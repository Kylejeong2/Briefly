import { pgTable, text, timestamp, uuid, serial, bigint } from 'drizzle-orm/pg-core';

export const $users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  websites: text('websites').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const $websites = pgTable('websites', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserType = typeof $users.$inferInsert;
export type WebsiteType = typeof $websites.$inferInsert;