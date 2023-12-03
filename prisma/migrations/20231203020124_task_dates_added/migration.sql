/*
  Warnings:

  - You are about to drop the `ToDoItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ToDoItem" DROP CONSTRAINT "ToDoItem_animalId_fkey";

-- DropForeignKey
ALTER TABLE "ToDoItem" DROP CONSTRAINT "ToDoItem_enclosureId_fkey";

-- DropForeignKey
ALTER TABLE "ToDoItem" DROP CONSTRAINT "ToDoItem_userEmail_fkey";

-- DropTable
DROP TABLE "ToDoItem";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "enclosureId" INTEGER,
    "animalId" INTEGER,
    "task" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "userEmail" TEXT NOT NULL,
    "lastCompleted" TIMESTAMP(3) NOT NULL,
    "repeatDayInterval" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_enclosureId_fkey" FOREIGN KEY ("enclosureId") REFERENCES "Enclosure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
