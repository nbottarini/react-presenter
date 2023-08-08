module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(js|ts|jsx|tsx)$': 'babel-jest',
    },
    testRegex: '(/test/(.*)\\.(test|spec))\\.(ts|js|tsx|jsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}
