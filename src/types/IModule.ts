/**
 * @swagger
 * definitions:
 *     Module:
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         course:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - course
 *       type: object
 */
export interface IModule {
  name: string
  description: string
  course: string
  order: number
}
