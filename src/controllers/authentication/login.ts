
import { Request, Response } from 'express'
import { authService } from '@services/authService'

/**
*  @swagger
*  /auth:
*  post:
*    summary: login
*    tags: [Auth]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: credentials
*        description: credentials to be validated
*        schema:
*          type: object
*          required:
*            - email
*            - password
*          properties:
*            email:
*              type: string
*            password:
*              type: string
*    responses:
*      422:
*        description: 'Invalid schema'
*      401:
*        description: 'Incorrect email or password'
*      200:
*        description: User authenticated
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                sucess:
*                  type: boolean
*                  description: the success status
*                token:
*                  type: string
*                  description: the user token
*/

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const response = await authService.login({ email, password })
  return res.status(201).json(response)
}
