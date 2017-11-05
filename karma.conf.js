//
// Karma configuration
//
// Conditionally load local or CI configurations based on CI environment variable
//

module.exports = process.env.CI === 'true'
  ? require( './karma-ci.conf.js' )
  : require( './karma-local.conf.js' );
