import { IQuestion } from '@/types/IQuestion'
import { invalidOrderError } from '@lib/error'
import { Lesson } from '@models/LessonModel'
import { Module } from '@models/ModuleModel'
import { Question } from '@models/questionModel'
import { validateUserOnCourse } from './courseService'
import { QuestionTypesEnum } from '@/types/QuestionTypesEnum'
import zod from 'zod'

const createQuestion = zod.object({
  body: zod.string().min(1, 'question body is required'),
  type: zod.nativeEnum(QuestionTypesEnum),
  module: zod.string().optional(),
  lesson: zod.string().optional()
})
  .superRefine((data, ctx) => {
    if (data.module && data.lesson) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'question must be linked only to lesson or module'
      })
    }

    if (!data.module || !data.lesson) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'lesson or module must be provided'
      })
    }
  })

const create = async (data: IQuestion, userId: string) => {
  createQuestion.parse(data)

  const validator: { lesson: () => Promise<void>, module: () => Promise<void> } = {
    lesson: async () => {
      const lesson: { _id?: string, module: { course: string } } | null = await Lesson.findById(data.lesson, { module: 1 })
        .populate({ path: 'module', select: 'course' })

      await validateUserOnCourse(userId, lesson?.module.course as string)
    },
    module: async () => {
      const module = await Module.findById(data.module, { _id: 1, course: 1 })
      await validateUserOnCourse(userId, module?.course as string)
    }
  }

  const validatorKey: 'lesson' | 'module' = data.lesson ? 'lesson' : 'module'
  await validator[validatorKey]()

  const higherOrder = (await Question.findOne({ [validatorKey]: data.lesson ?? data.module }, { order: 1 }))?.order

  if (data.order !== null && (data.order <= 0 || (data.order > (higherOrder ?? 0) + 1))) {
    throw invalidOrderError((higherOrder ?? 0) + 1)
  }

  const question = await Question.create({ ...data, order: data.order ?? (higherOrder ?? 0) + 1 })

  await Question.updateMany({
    order: { $gte: question.order },
    _id: { $ne: question.order },
    [validatorKey]: data.lesson ?? data.module
  }, { $inc: { order: 1 } })

  return question
}

export const questionService = { create }
