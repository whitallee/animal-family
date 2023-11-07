-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_userEmail_fkey";

-- AlterTable
ALTER TABLE "Animal" ALTER COLUMN "userEmail" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
