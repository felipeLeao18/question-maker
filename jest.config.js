const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest')

module.exports = {
  clearMocks: true,
  passWithNoTests: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testMatch: ['**/**/*.test.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' })
}
