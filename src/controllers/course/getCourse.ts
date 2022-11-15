
import { Request, Response } from 'express'
import { courseService } from '../../services/courseService'

/**
*  @swagger
*  /courses:
*  get:
*    summary: get course
*    tags: [Course]
*    consumes:
*      - application/json
*    parameters:
*      - in: query
*        name: courseId
*        description: course id to be found
*    responses:
*      422:
*        description: 'courseId not provided'
*      401:
*        description: 'Unauthorized'
*      200:
*        description: 'Course found'
*        schema:
*          $ref: '#/definitions/Course'
*/

export const getCourse = async (req: Request & { user: string }, res: Response) => {
  const { courseId } = req.params

  const response = await courseService.findById(courseId ? courseId.toString() : '', req.user)
  return res.status(200).json(response)
}
