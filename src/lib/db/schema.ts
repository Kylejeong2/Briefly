import { pgTable, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const $users = pgTable('users', {
  id: varchar('id').primaryKey(),
  clerkId: varchar('clerk_id').notNull().unique(),
  email: varchar('email').notNull().unique(),
  websites: varchar('websites').array().notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserType = typeof $users.$inferInsert;