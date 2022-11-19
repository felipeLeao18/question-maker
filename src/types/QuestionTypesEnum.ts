/**
 * @openapi
 * definitions:
 *  QuestionTypesEnum:
 *    type: string
 *    enum: &TYPES
 *      - MULTIPLE_CHOICE
 *      - ESSAY
 *      - TRUE_OR_FALSE
 */

export enum QuestionTypesEnum {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY',
  TRUE_OR_FALSE = 'TRUE_OR_FALSE',
}
