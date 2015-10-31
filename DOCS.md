## Objects
<dl>
<dt><a href="#IsoRouter">IsoRouter</a> : <code>object</code></dt>
<dd><p>This is the only object exported by this package. It contains all it&#39;s the API.</p>
</dd>
<dt><a href="#Route">Route</a> : <code>object</code></dt>
<dd></dd>
</dl>
## Functions
<dl>
<dt><a href="#addListener">addListener(eventName, callback)</a></dt>
<dd><p>Adds a listener to an event to the beginning of an callback array. The callback array is executed front to back. That means, that the last event you add via this function will be the first to execute. This function should be the default to add event-listeners.</p>
</dd>
<dt><a href="#appendListener">appendListener(eventName, callback)</a></dt>
<dd><p>Adds a listener to the end of the callback array. It actually adds the listener to the position -1. That&#39;s because the last listener on the server-side needs to be the one added by IsoRouter itself wich calls <code>next</code> on the connect handler-stack. This should only be used if you want to make sure it is called after all other listeners. For example when you want to catch 404s.</p>
</dd>
<dt><a href="#createEvent">createEvent(eventName, callback)</a></dt>
<dd><p>Creates a new callback array for.</p>
</dd>
<dt><a href="#dispatchEvent">dispatchEvent(eventName, data)</a></dt>
<dd><p>Dispatches an event. Every function in the callback array will be called front (0) to back.</p>
</dd>
</dl>
## Events
<dl>
<dt><a href="#event_enter">"enter"</a></dt>
<dd><p>Triggers when the client enters a route</p>
</dd>
<dt><a href="#event_exit">"exit"</a></dt>
<dd><p>Triggers when the client exits a route</p>
</dd>
</dl>
## Typedefs
<dl>
<dt><a href="#connectHandle">connectHandle</a> : <code>object</code></dt>
<dd><p>An object defined by the <code>connect</code> npm package. Meteor uses this internally and I&#39;m just hooking into it.</p>
</dd>
<dt><a href="#pathToRegexMatch">pathToRegexMatch</a> : <code>array</code></dt>
<dd><p>An Array containing the result of <code>Route.pathRegex.exec</code>. Here&#39;s an example:</p>
<pre><code class="language-javascript">IsoRouter.route(&#39;/:some/:other&#39;)
  .action(console.log.bind(console))
IsoRouter.navigate(&#39;/something/else&#39;)
</code></pre>
<p>This will log the following:</p>
<pre><code class="lang-js">[ &#39;/something/else&#39;, &#39;something&#39;, &#39;else&#39; ]
</code></pre>
</dd>
</dl>
<a name="IsoRouter"></a>
## IsoRouter : <code>object</code>
This is the only object exported by this package. It contains all it's the API.

**Kind**: global namespace  
**Locus**: anywhere  

* [IsoRouter](#IsoRouter) : <code>object</code>
  * [.routes](#IsoRouter.routes) : <code>[array.&lt;Route&gt;](#Route)</code>
  * [.Route](#IsoRouter.Route) : <code>object</code>
  * [.navigate(url, navigateEvent)](#IsoRouter.navigate)
  * [.route(path)](#IsoRouter.route) ⇒ <code>[Route](#Route)</code>
  * [.getRouteForUrl(url)](#IsoRouter.getRouteForUrl) ⇒ <code>[Route](#Route)</code>

<a name="IsoRouter.routes"></a>
### IsoRouter.routes : <code>[array.&lt;Route&gt;](#Route)</code>
All routes are saved inside this object

**Kind**: static property of <code>[IsoRouter](#IsoRouter)</code>  
**Locus**: anywhere  
<a name="IsoRouter.Route"></a>
### IsoRouter.Route : <code>object</code>
The prototype of all routes. You can access it to set global defaults. See [Route.enter](Route.enter), [Route.action](Route.action) and [Route.exit](Route.exit).

**Kind**: static property of <code>[IsoRouter](#IsoRouter)</code>  
**Locus**: anywhere  
<a name="IsoRouter.navigate"></a>
### IsoRouter.navigate(url, navigateEvent)
With this function you can navigate to a cerain URL. You can't simply do a `location.href = '/internal/url'`. This will initiate a new HTTP request to that location. You have to go through this function. Server-side, this function does a [302](https://tools.ietf.org/html/rfc7231#section-6.4.3) _redirect_. So you could use it for a moved page. When you URL schema changes you can simply use this to dynamically redirect the client. The URL is passed to the client by setting the `Location`-header. The function is called asynchronously using `_.defer`.

**Kind**: static method of <code>[IsoRouter](#IsoRouter)</code>  
**Locus**: anywhere  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url to navigate to |
| navigateEvent | <code>navigateEvent</code> | Required on the server side |

<a name="IsoRouter.route"></a>
### IsoRouter.route(path) ⇒ <code>[Route](#Route)</code>
Creates a new iso-router route. It's created with [Route](#Route) as its prototype.

**Kind**: static method of <code>[IsoRouter](#IsoRouter)</code>  
**Returns**: <code>[Route](#Route)</code> - The newly created route  
**Locus**: client  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path-to-regex path the route is for |

<a name="IsoRouter.getRouteForUrl"></a>
### IsoRouter.getRouteForUrl(url) ⇒ <code>[Route](#Route)</code>
Returns the first route with a path matching the passed url.

**Kind**: static method of <code>[IsoRouter](#IsoRouter)</code>  
**Returns**: <code>[Route](#Route)</code> - The matching route  
**Locus**: anywhere  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | A relative url |

<a name="Route"></a>
## Route : <code>object</code>
**Kind**: global namespace  

* [Route](#Route) : <code>object</code>
  * [.path](#Route.path) : <code>string</code>
  * [.pathRegex](#Route.pathRegex) : <code>regexp</code>
  * [.key](#Route.key) : <code>array</code>
  * [.addListener(eventName, callback)](#Route.addListener)
  * [.match(url)](#Route.match) ⇒ <code>false</code> &#124; <code>array</code>
  * [.matchToObject(url)](#Route.matchToObject) ⇒ <code>object</code> &#124; <code>false</code>

<a name="Route.path"></a>
### Route.path : <code>string</code>
The path the route is for

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: anywhere  
<a name="Route.pathRegex"></a>
### Route.pathRegex : <code>regexp</code>
The paresed regex for the path

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: <code>anywhere</code>  
<a name="Route.key"></a>
### Route.key : <code>array</code>
The array generated by pathToRegex (largely for internal use)

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: <code>anywhere</code>  
<a name="Route.addListener"></a>
### Route.addListener(eventName, callback)
This adds a listener to an event which is only called when the route set in the event object.

**Kind**: static method of <code>[Route](#Route)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The name of the event to listen for |
| callback | <code>eventCallback</code> | A function to be called when the event is dispatched and the route matches |

<a name="Route.match"></a>
### Route.match(url) ⇒ <code>false</code> &#124; <code>array</code>
Calls pathRegex.exec

**Kind**: static method of <code>[Route](#Route)</code>  
**Returns**: <code>false</code> &#124; <code>array</code> - Returns false if the test fails and returns the exec's return on success  
**Locus**: anywhere  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url to execute the regex on |

<a name="Route.matchToObject"></a>
### Route.matchToObject(url) ⇒ <code>object</code> &#124; <code>false</code>
Calls route.match and maps the resulting array to the parameter names in the route's path.

**Kind**: static method of <code>[Route](#Route)</code>  
**Returns**: <code>object</code> &#124; <code>false</code> - Returns an object mapping params to their values  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="addListener"></a>
## addListener(eventName, callback)
Adds a listener to an event to the beginning of an callback array. The callback array is executed front to back. That means, that the last event you add via this function will be the first to execute. This function should be the default to add event-listeners.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The event to add the listener to |
| callback | <code>eventCallback</code> | A function to execute when the event dispatched |

<a name="appendListener"></a>
## appendListener(eventName, callback)
Adds a listener to the end of the callback array. It actually adds the listener to the position -1. That's because the last listener on the server-side needs to be the one added by IsoRouter itself wich calls `next` on the connect handler-stack. This should only be used if you want to make sure it is called after all other listeners. For example when you want to catch 404s.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The Event to Listen to |
| callback | <code>eventCallback</code> | A function to be called when the event dispatched |

<a name="createEvent"></a>
## createEvent(eventName, callback)
Creates a new callback array for.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The name of the event and the callback array |
| callback | <code>eventCallback</code> | A function to be called last when the event dispatched |

<a name="dispatchEvent"></a>
## dispatchEvent(eventName, data)
Dispatches an event. Every function in the callback array will be called front (0) to back.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The name of the event to be dispatched |
| data | <code>\*</code> | Anything you want to pass to the event listeners |

<a name="event_enter"></a>
## "enter"
Triggers when the client enters a route

**Kind**: event emitted  
**Locus**: anywhere  
<a name="event_exit"></a>
## "exit"
Triggers when the client exits a route

**Kind**: event emitted  
**Locus**: client  
<a name="connectHandle"></a>
## connectHandle : <code>object</code>
An object defined by the `connect` npm package. Meteor uses this internally and I'm just hooking into it.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | Documented in the nodejs HTTP package |
| res | <code>object</code> | Documented in the nodejs HTTP package |
| next | <code>object</code> | The next function on the connect stack. Documented inside the connect npm package. |

<a name="pathToRegexMatch"></a>
## pathToRegexMatch : <code>array</code>
An Array containing the result of `Route.pathRegex.exec`. Here's an example:

```js
IsoRouter.route('/:some/:other')
  .action(console.log.bind(console))
IsoRouter.navigate('/something/else')
```

This will log the following:

```js
[ '/something/else', 'something', 'else' ]
```

**Kind**: global typedef  
