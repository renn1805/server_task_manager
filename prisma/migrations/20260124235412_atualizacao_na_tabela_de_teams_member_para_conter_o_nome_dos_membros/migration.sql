-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeamsMembers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "nameMember" TEXT NOT NULL DEFAULT 'unknown',
    "teamId" TEXT NOT NULL,
    CONSTRAINT "TeamsMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamsMembers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TeamsMembers" ("id", "memberId", "teamId") SELECT "id", "memberId", "teamId" FROM "TeamsMembers";
DROP TABLE "TeamsMembers";
ALTER TABLE "new_TeamsMembers" RENAME TO "TeamsMembers";
CREATE UNIQUE INDEX "TeamsMembers_memberId_teamId_key" ON "TeamsMembers"("memberId", "teamId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
