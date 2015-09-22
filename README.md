# iso-router - 0.0.14
A Isomorphic Router for meteor

## Documentation
The docs are split into two documents. First the guide, It's located below this section. It's still a work in progress. Then the [API documentation](https://github.com/Kriegslustig/meteor-iso-router/blob/master/DOCS.md). It documents _every_ object and function availible.

## Guide

Working on it.

## Usage

```js
IsoRouter.route('/start')
  .action(function renderStart (parameters) {
    Blaze.renderWithData(
      Template.start,
      {header: 'hi!'},
      document.body
    )
  })
  .enter(function enterStart (parameters, next) {
    Meteor.subscribe('someSub', next)
  })
  .exit(function clearBody () {
    document.body = ''
  })

IsoRouter.route('/somthing.txt')
  .server(function serveSomething (req, res, next) {
    res.end('hi')
  })
```

## TODO
* Should I add a maximum recursion level for `shouldPrevent`
