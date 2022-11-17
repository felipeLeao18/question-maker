/**
 * @swagger
 * definitions:
 *     Lesson:
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         module:
 *           type: string
 *         order:
 *           type: number
 *       required:
 *         - name
 *       type: object
 */
export interface ILesson {
  name: string
  description: string
  order: number
  module: string
}
