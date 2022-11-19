export const swaggerConf = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Question Maker',
      version: '0.1.0',
      description: 'Welcome to the Question Maker official documentation'
    }
  },
  apis: ['./src/**/*.ts'],
  tags: [
    {
      name: 'User',
      description: 'users entity'
    },
    {
      name: 'Course',
      description: 'courses'
    },
    {
      name: 'Modules',
      description: 'modules'
    },
    {
      name: 'Lessons',
      description: 'lessons'
    },

    {
      name: 'Questions',
      description: 'questions'
    }
  ]
}
