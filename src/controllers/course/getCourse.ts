
import { Request, Response } from 'express'
import { courseService } from '@services/courseService'

/**
*  @swagger
*  /courses/courseId:
*  get:
*    summary: get course
*    tags: [Course]
*    consumes:
*      - application/json
*    parameters:
*      - in: params
*        name: courseId
*        description: course id to be found
*    responses:
*      401:
*        description: 'Unauthorized'
*      200:
*        description: 'Course found'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Course'
*/

export const getCourse = async (req: Request & { user: string }, res: Response) => {
  const { courseId } = req.params

  const response = await courseService.findById(courseId ? courseId.toString() : '', req.user)
  return res.status(200).json(response)
}
