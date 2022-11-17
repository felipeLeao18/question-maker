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
 *           type: objectid
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
