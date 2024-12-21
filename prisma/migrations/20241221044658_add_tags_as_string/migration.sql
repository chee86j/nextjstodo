-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tags" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Todo" ("complete", "createdAt", "dueDate", "id", "priority", "title", "updatedAt") SELECT "complete", "createdAt", "dueDate", "id", "priority", "title", "updatedAt" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
