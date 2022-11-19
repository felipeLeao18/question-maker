export const swaggerConf = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Question Maker',
      version: '0.1.0',
      description: 'Welcome to the Question Maker official documentation',
      contact: {
        name: 'Felipe Leao',
        url: 'https://www.linkedin.com/in/felipeleao18/',
        email: 'flpleao@discente.ufg.br'
      }
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
      name: 'Module',
      description: 'modules'
    },
    {
      name: 'Lesson',
      description: 'lessons'
    },
    {
      name: 'Auth',
      description: 'authentication'
    }
  ]
}
