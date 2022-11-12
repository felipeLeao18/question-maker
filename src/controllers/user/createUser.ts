import { Request, Response } from 'express'
import { userService } from '../../services/userService'

/**
*  @swagger
*  /users:
*  post:
*    summary: Create user
*    tags: [User]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: user
*        description: Create user
*        schema:
*          type: object
*          required:
*            - name
*            - email
*            - password
*          properties:
*            name:
*              type: string
*            email:
*              type: string
*            password:
*              type: string
*              minLength: 5
*    responses:
*      422:
*        description: 'Invalid schema'
*      412:
*        description: 'Email already taken'
*      200:
*        description: User created
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                sucess:
*                  type: boolean
*                  description: the success status
*/

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const response = await userService.create({ name, email, password })
  return res.status(201).json(response)
}
