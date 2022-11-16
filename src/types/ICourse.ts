/**
 * @swagger
 * definitions:
 *     Course:
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         users:
 *           type: array of string
 *       required:
 *         - name
 *       type: object
 */
export interface ICourse {
  name: string
  description: string
  users: string[]
}
