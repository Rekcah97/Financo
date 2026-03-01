/*
  Warnings:

  - You are about to drop the `savingGoals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "savingGoals" DROP CONSTRAINT "savingGoals_userId_fkey";

-- DropTable
DROP TABLE "savingGoals";

-- CreateTable
CREATE TABLE "SavingGoals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetAmount" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingAllocation" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "sId" INTEGER NOT NULL,

    CONSTRAINT "SavingAllocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingGoals" ADD CONSTRAINT "SavingGoals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingAllocation" ADD CONSTRAINT "SavingAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingAllocation" ADD CONSTRAINT "SavingAllocation_sId_fkey" FOREIGN KEY ("sId") REFERENCES "SavingGoals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
