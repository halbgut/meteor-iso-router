# iso-router - 0.1.0
A Isomorphic Router for meteor

## Documentation
The docs are split into two documents. First the guide, It's located below this section. It's still a work in progress. Then the [API documentation](https://github.com/Kriegslustig/meteor-iso-router/blob/master/DOCS.md). It documents _every_ object and function availible.

## Guide

Working on it.

## Usage

```js
if(Meteor.isClient) {
  IsoRouter.route('/start')
    .addListener('enter', function renderStart (e) {
      Blaze.renderWithData(
        Template.start,
        {header: 'hi!'},
        document.body
      )
    })
    .addListener('enter', function enterStart (e) {
      Meteor.subscribe('someSub', e.next)
    })
    .addListener('exit', function clearBody () {
      document.body = ''
    })
} else {
  IsoRouter.route('/somthing.txt')
    .addListener('enter', function serveSomething (e) {
      e.response.end('hi')
    })
  }
```

## TODO

