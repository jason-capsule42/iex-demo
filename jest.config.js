module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['<rootDir>/tests/setupJest.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(vuetify))'],
};
