Package.describe({
  name: 'kriegslustig:iso-router',
  version: '0.0.12',
  summary: 'An isomorphic router for Meteor',
  git: 'https://github.com/Kriegslustig/meteor-iso-router',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.1')
  api.use(['webapp', 'underscore', 'reactive-var'])
  api.use('cosmos:browserify@0.3.0')
  Npm.depends({
    'path-to-regexp': '0.1.6'
  })
  api.addFiles(
    [
      'app.browserify.js',
      'lib/utils.js',
      'lib/events.js',
      'lib/route.js',
      'lib/navigate.js',
      'iso-router.js'
    ],
    ['server', 'client']
  )
  api.export('IsoRouter')
})

Package.onTest(function (api) {
  api.use(['kriegslustig:iso-router', 'tinytest', 'http', 'underscore', 'webapp', 'reactive-var'])
  api.use('cosmos:browserify@0.3.0')
  Npm.depends({
    'path-to-regexp': '0.1.6'
  })
  api.addFiles([
    'app.browserify.js',
    'lib/utils.js',
    'lib/events.js',
    'lib/route.js',
    'lib/navigate.js',
    'iso-router.js'
  ])
  api.addFiles([
    'tests/app.browserify.js',
    'tests/utils.js',
    'tests/events.js',
    'tests/route.js',
    'tests/navigate.js',
    'tests/iso-router.js'
  ])
})
