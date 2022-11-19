import { Request, Response } from 'express'
import { courseService } from '@services/courseService'

/**
*  @swagger
*  /courses:
*  delete:
*    summary: Delete course
*    tags: [Course]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: courseId
*        description: course id to be removed
*    responses:
*      422:
*        description: 'courseId not provided'
*      401:
*        description: 'Unauthorized'
*      200:
*        description: 'Course removed'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Course'
*/

export const removeCourse = async (req: Request & { user: string }, res: Response) => {
  const { courseId } = req.body

  const response = await courseService.remove(courseId, req.user)
  return res.status(200).json(response)
}
