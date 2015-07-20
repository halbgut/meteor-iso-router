Package.describe({
  name: 'kriegslustig:iso-router',
  version: '0.0.0',
  description: 'An isomorphic router for Meteor',
  git: 'https://github.com/Kriegslustig/meteor-iso-router',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  Npm.depends({
    'path-to-regexp': '0.1.6'
  })
  api.use(['webapp', 'underscore'])
  api.use('cosmos:browserify@0.3.0', 'client')
  api.addFiles(
    [
      'lib/client.browserify.js',
      'lib/events.js',
      'lib/route.js',
      'lib/navigate.js',
      'iso-router.js'
    ],
    ['server', 'client']
  )
  api.export('IsoRouter')
})