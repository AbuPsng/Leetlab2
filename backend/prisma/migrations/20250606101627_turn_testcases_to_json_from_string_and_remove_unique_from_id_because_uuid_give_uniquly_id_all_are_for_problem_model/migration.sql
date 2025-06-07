/*
  Warnings:

  - Added the required column `testcases` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Problem_id_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "testcases",
ADD COLUMN     "testcases" JSONB NOT NULL;
