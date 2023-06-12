import { sql } from "drizzle-orm";
import { mysqlTable, varchar, datetime, serial } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 256 }).primaryKey(),
  firstName: varchar("firstName", { length: 256 }),
  lastName: varchar("lastName", { length: 256 }),
  username: varchar("username", { length: 256 }),
  profileImageUrl: varchar("profileImageUrl", { length: 256 }),
  createdAt: datetime("createdAt").default(sql`NOW()`),
});

export const example = mysqlTable("example", {
  id: serial("id").primaryKey().autoincrement(),
  message: varchar("message", { length: 280 }),
  userId: varchar("userId", { length: 256 }).references(() => user.id),
  createdAt: datetime("createdAt").default(sql`NOW()`),
  updatedAt: datetime("updatedAt").default(sql`NOW()`),
});
