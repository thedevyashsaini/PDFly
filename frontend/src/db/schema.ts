import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  pfp: text("pfp").notNull(),
});

export const pdfsTable = sqliteTable("pdfs", {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull().references(() => usersTable.id),
    uploaded: text("uploaded").notNull(),
});

export const chatsTable = sqliteTable("chats", {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull().references(() => usersTable.id),
    pdfs: text("pdfs").notNull(),
});

export const messagesTable = sqliteTable("messages", {
    id: text("id").primaryKey(),
    chat_id: text("chat_id").notNull().references(() => chatsTable.id),
    is_generated: integer("is_generated").default(0),
    message_key: text("message_key").notNull(),
    timestamp: text("timestamp").notNull(),
});