# iso-router - 0.2.2
A Isomorphic Router for meteor

## Documentation
The docs are split into two documents. First the guide, It's located below this section. It's still a work in progress. Then the [API documentation](https://github.com/Kriegslustig/meteor-iso-router/blob/master/DOCS.md). It documents _every_ object and function available.

## Guide

I wrote this package because I didn't like the currently existing options. Iron-Router is to big and Flow-Router isn't isomorphic. I thought I'd build something even simpler than Flow-Router. It uses Page which is a npm package for client-side routing. The package isn't too big, but it does have some features which aren't strictly necessary. Those bloat Flow-Router. Iso-Router is isomorphic, so I didn't have to reimplement anything for the server-side and was able to scrape off a lot of complexity.

Iso-Router is event-driven and isomorphic. When using it you simply instantiate the `Route` object and add event-listener using the `addListener` function on it. `Route` objects emit two different events; `enter` and `exit`. They pretty much speak for them self. `enter` fires when a user enters a router and `exit` fires when a user exits one.

The events pass an event object to their callbacks. It's structured as follows:

```js
e = {
  // A node.js reuqest object. Only availible on the server-side
  request: http.clientRequest,
  // A node.js response object. Only availible on the server-side
  response: http.serverResponse,
  // A function calling the next middleware on the connect stack. Other event-listeners will be called all the same. This is mainly for internal use.
  next: connectHandle,
  // The parsed parameters defined in the route using the ':name' syntax
  parameters: { name: value },
  // The path that was requested
  path: '/something'
}
```

This guide is a work in progress.

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

