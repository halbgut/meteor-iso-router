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
  api.addFiles('client.browserify.js', ['server', 'client'])
  api.addFiles(
    [
      'iso-router.js',
      'navigate.js'
    ],
    ['server', 'client']
  )
  api.export('IsoRouter')
})