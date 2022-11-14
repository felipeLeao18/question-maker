-- DropForeignKey
ALTER TABLE "UserOnCourse" DROP CONSTRAINT "UserOnCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnCourse" DROP CONSTRAINT "UserOnCourse_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserOnCourse" ADD CONSTRAINT "UserOnCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCourse" ADD CONSTRAINT "UserOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
