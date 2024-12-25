import { boolean, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  pfp: text("pfp").notNull(),
});

export const pdfsTable = pgTable("pdfs", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull().references(() => usersTable.id),
    uploaded: timestamp("uploaded").notNull().defaultNow(),
});

export const chatsTable = pgTable("chats", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull().references(() => usersTable.id),
    pdfs: jsonb("pdfs").notNull(),
});

export const messagesTable = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    chat_id: uuid("chat_id").notNull().references(() => chatsTable.id),
    is_generated: boolean("is_generated").default(false),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
    references: jsonb("references"),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPdf = typeof pdfsTable.$inferInsert;
export type SelectPdf = typeof pdfsTable.$inferSelect;

export type InsertChat = typeof chatsTable.$inferInsert;
export type SelectChat = typeof chatsTable.$inferSelect;

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;