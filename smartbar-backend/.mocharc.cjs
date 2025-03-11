module.exports = {
  spec: 'test/**/*.test.js',
  reporter: 'spec',
  timeout: 10000,
  exit: true,
  require: ['./test/config.js'],
  experimentalLoader: true,  // Para suportar ES modules
  extension: ['.js']
};