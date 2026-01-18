module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '\\.spec\\.(js|ts)$',
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(ts|js)'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
};
