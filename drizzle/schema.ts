import {
  mysqlTable,
  index,
  serial,
  datetime,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const message = mysqlTable(
  "message",
  {
    id: serial("id").primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: "string" }).default(
      sql`(CURRENT_TIMESTAMP)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string" }).default(
      sql`(CURRENT_TIMESTAMP)`
    ),
    text: varchar("text", { length: 280 }),
    userId: varchar("userId", { length: 256 }).references(() => user.id),
  },
  (table) => {
    return {
      userIdUserIdFk: index("message_userId_user_id_fk").on(table.userId),
    };
  }
);

export const user = mysqlTable("user", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  firstName: varchar("firstName", { length: 256 }),
  lastName: varchar("lastName", { length: 256 }),
  username: varchar("username", { length: 256 }),
  createdAt: datetime("createdAt", { mode: "string" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  profileImageUrl: varchar("profileImageUrl", { length: 256 }),
});
