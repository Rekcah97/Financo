-- CreateTable
CREATE TABLE "savingGoals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetAmount" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savingGoals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savingGoals" ADD CONSTRAINT "savingGoals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
