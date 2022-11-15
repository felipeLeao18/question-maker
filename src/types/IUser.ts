
/**
 * @swagger
 * definitions:
 *     User:
 *       properties:
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - password
 *       type: object
 */
export interface IUser {
  email: string
  name: string
  password: string
}
