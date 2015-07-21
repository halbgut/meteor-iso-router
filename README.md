# iso-router - 0.0.1 - alpha
A Isomorphic Router for meteor

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
