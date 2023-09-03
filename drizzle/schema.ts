import { mysqlTable, serial, datetime, varchar, boolean, } from "drizzle-orm/mysql-core";
import { type InferModel, relations, sql } from "drizzle-orm";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  firstName: varchar("firstName", { length: 256 }),
  lastName: varchar("lastName", { length: 256 }),
  username: varchar("username", { length: 256 }),
  createdAt: datetime("createdAt", { mode: "string" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  profileImageUrl: varchar("profileImageUrl", { length: 256 }),
  deletedAt: datetime("deletedAt", { mode: "string" }),
});

export type User = InferModel<typeof user, "select">;
export type NewUser = InferModel<typeof user, "insert">;

export const usersRelations = relations(user, ({ many }) => ({
  posts: many(message),
}));

export const message = mysqlTable("message", {
  id: serial("id").primaryKey().notNull(),
  createdAt: datetime("createdAt", { mode: "string" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  updatedAt: datetime("updatedAt", { mode: "string" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  text: varchar("text", { length: 280 }),
  userId: varchar("userId", { length: 256 }),
});

export type Message = InferModel<typeof message, "select">;
export type NewMessage = InferModel<typeof message, "insert">;

export const messageRelations = relations(message, ({ one }) => ({
  author: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
}));

export const teams = mysqlTable("teams", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }),
});
export type Team = InferModel<typeof teams, "select">;
export type NewTeam = InferModel<typeof teams, "insert">;
export const teamRelations = relations(teams, ({ many }) => ({
  matchupsHomeTeam: many(matchups, {relationName: "homeTeam"}),
  matchupsAwayTeam: many(matchups, {relationName: "awayTeam"}),
  matchupsWinningTeam: many(matchups, {relationName: "winningTeam"}),
  picks: many(picks),
}));

export const matchups = mysqlTable("matchups", {
  id: serial("id").primaryKey().notNull(),
  startDate: datetime("startDate", { mode: "date" }).notNull(),
  homeTeamId: varchar("homeTeamId", { length: 256 }).notNull(),
  awayTeamId: varchar("awayTeamId", { length: 256 }).notNull(),
  winningTeamId: varchar("winningTeamId", { length: 256 }),
  isTie: boolean("isTie").notNull().default(false),
});
export type Matchup = InferModel<typeof matchups, "select">;
export type NewMatchup = InferModel<typeof matchups, "insert">;
export const matchupRelations = relations(matchups, ({ one }) => ({
  homeTeam: one(teams, {
    relationName: "homeTeam",
    fields: [matchups.homeTeamId],
    references: [teams.id],
  }),
  awayTeam: one(teams, {
    relationName: "awayTeam",
    fields: [matchups.awayTeamId],
    references: [teams.id],
  }),
  winningTeam: one(teams, {
    relationName: "winningTeam",
    fields: [matchups.winningTeamId],
    references: [teams.id],
  }),
}));

export const picks = mysqlTable("picks", {
  id: serial("id").primaryKey().notNull(),
  userId: varchar("userId", { length: 256 }).notNull(),
  matchupId: varchar("matchupId", { length: 256 }).notNull(),
  teamId: varchar("teamId", { length: 256 }).notNull(),
});
export type Pick = InferModel<typeof picks, "select">;
export type NewPick = InferModel<typeof picks, "insert">;
export const pickRelations = relations(picks, ({ one }) => ({
  user: one(user, {
    fields: [picks.userId],
    references: [user.id],
  }),
  matchup: one(matchups, {
    fields: [picks.matchupId],
    references: [matchups.id],
  }),
  team: one(teams, {
    fields: [picks.teamId],
    references: [teams.id],
  }),
}));
// export const picksView = mysqlView("picksView").as((qb) => {
//   return qb.select()
//     .from(picks)
//     .innerJoin(matchups, eq(matchups.id, picks.matchupId))
//     .innerJoin(teams, eq(teams.id, picks.teamId))
//     .innerJoin(user, eq(user.id, picks.userId))
// });

