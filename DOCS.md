## Objects
<dl>
<dt><a href="#IsoRouter">IsoRouter</a> : <code>object</code></dt>
<dd><p>This is the only object exported by this package. It contains all it&#39;s the API.</p>
</dd>
<dt><a href="#Route">Route</a> : <code>object</code></dt>
<dd></dd>
</dl>
## Events
<dl>
<dt><a href="#event_isoRouter-enter">"isoRouter-enter"</a></dt>
<dd><p>Triggers when the client enters a route</p>
</dd>
<dt><a href="#event_isoRouter-navigate">"isoRouter-navigate"</a></dt>
<dd><p>Triggers when the client has entered a route</p>
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
<dt><a href="#action">action</a> : <code>function</code></dt>
<dd><p>A function that is called when the client navigates to a route.</p>
</dd>
<dt><a href="#enterHook">enterHook</a> : <code>function</code></dt>
<dd><p>The <code>enterHooks</code> of a route are called before the action is called. When you set global <code>enterHooks</code> they will be triggered on each route. Even if the route has it&#39;s own. These hooks are executed asynchronously. For that purpose a parameter <code>next</code> is passed. It must be called in order to trigger the next enter hook. It must also be called on the last enter hook for the <code>action</code> to be called.</p>
</dd>
<dt><a href="#exitHook">exitHook</a> : <code>function</code></dt>
<dd><p>On the client <code>exitHook</code>s are called when a client navigates to an other route. When you set a global <code>exitHook</code> it will be triggered on each route. Even if the route has it&#39;s own.</p>
</dd>
</dl>
<a name="IsoRouter"></a>
## IsoRouter : <code>object</code>
This is the only object exported by this package. It contains all it's the API.

**Kind**: global namespace  
**Locus**: anywhere  

* [IsoRouter](#IsoRouter) : <code>object</code>
  * [.routes](#IsoRouter.routes) : <code>[array.&lt;Route&gt;](#Route)</code>
  * [.currentRoute](#IsoRouter.currentRoute) : <code>[ReactiveVar.&lt;Route&gt;](#Route)</code>
  * [.Route](#IsoRouter.Route) : <code>object</code>
  * [.navigate(url, [statusCode])](#IsoRouter.navigate)
  * [.route(path)](#IsoRouter.route) ⇒ <code>[Route](#Route)</code>
  * [.getRouteForUrl(url)](#IsoRouter.getRouteForUrl) ⇒ <code>[Route](#Route)</code>
  * [.serve()](#IsoRouter.serve) ⇒ <code>Object</code>

<a name="IsoRouter.routes"></a>
### IsoRouter.routes : <code>[array.&lt;Route&gt;](#Route)</code>
All routes are saved inside this object

**Kind**: static property of <code>[IsoRouter](#IsoRouter)</code>  
**Locus**: anywhere  
<a name="IsoRouter.currentRoute"></a>
### IsoRouter.currentRoute : <code>[ReactiveVar.&lt;Route&gt;](#Route)</code>
The route the client is currently on. This is a reac

**Kind**: static property of <code>[IsoRouter](#IsoRouter)</code>  
**Locus**: anywhere  
<a name="IsoRouter.Route"></a>
### IsoRouter.Route : <code>object</code>
The prototype of all routes. You can access it to set global defaults. See [enter](#Route.enter), [action](#Route.action) and [exit](#Route.exit).

**Kind**: static property of <code>[IsoRouter](#IsoRouter)</code>  
**Locus**: anywhere  
<a name="IsoRouter.navigate"></a>
### IsoRouter.navigate(url, [statusCode])
With this function you can navigate to a cerain URL. You can't simply do a `location.href = '/internal/url'`. This will initiate a new HTTP request to that location. You have to go through this function. Server-side, this function does a [302](https://tools.ietf.org/html/rfc7231#section-6.4.3) _redirect_. So you could use it for a moved page. When you URL schema changes you can simply use this to dynamically redirect the client. The URL is passed to the client by setting the `Location`-header. The function is called asynchronously using `_.defer`.

**Kind**: static method of <code>[IsoRouter](#IsoRouter)</code>  
**Locus**: anywhere  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The url to navigate to |
| [statusCode] | <code>301</code> &#124; <code>302</code> &#124; <code>307</code> | <code>302</code> | HTTP status code to respond with. |

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

<a name="IsoRouter.serve"></a>
### IsoRouter.serve() ⇒ <code>Object</code>
Serves a route. It first sets all connectHandle properties (req, res, next). Then it get's the current location and a matching route. If there's not route for the url `next` is called.

**Kind**: static method of <code>[IsoRouter](#IsoRouter)</code>  
**Returns**: <code>Object</code> - IsoRouter  
**Locus**: anywhere  
<a name="Route"></a>
## Route : <code>object</code>
**Kind**: global namespace  

* [Route](#Route) : <code>object</code>
  * [.path](#Route.path) : <code>string</code>
  * [.pathRegex](#Route.pathRegex) : <code>regexp</code>
  * [.parameters](#Route.parameters) : <code>array</code>
  * [.key](#Route.key) : <code>array</code>
  * [.req](#Route.req) : <code>connectHandle.req</code>
  * [.res](#Route.res) : <code>connectHandle.res</code>
  * [.next](#Route.next) : <code>connectHandle.next</code>
  * [.action(action)](#Route.action) ⇒ <code>[Route](#Route)</code>
  * [.enter(enter)](#Route.enter) ⇒ <code>[Route](#Route)</code>
  * [.exit(exit)](#Route.exit) ⇒ <code>[Route](#Route)</code>
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
<a name="Route.parameters"></a>
### Route.parameters : <code>array</code>
The array returned by pathRegex.exec

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: <code>anywhere</code>  
<a name="Route.key"></a>
### Route.key : <code>array</code>
The array generated by pathToRegex (largely for internal use)

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: <code>anywhere</code>  
<a name="Route.req"></a>
### Route.req : <code>connectHandle.req</code>
The incomming request object

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: server  
<a name="Route.res"></a>
### Route.res : <code>connectHandle.res</code>
The connection's response object

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: server  
<a name="Route.next"></a>
### Route.next : <code>connectHandle.next</code>
The next middleware on the connection stack

**Kind**: static property of <code>[Route](#Route)</code>  
**Locus**: server  
<a name="Route.action"></a>
### Route.action(action) ⇒ <code>[Route](#Route)</code>
Define an action that should be triggered when the route is called. This can also called on the global `IsoRouter.Route` This will set a default action.

**Kind**: static method of <code>[Route](#Route)</code>  
**Locus**: anywhere  

| Param | Type |
| --- | --- |
| action | <code>[action](#action)</code> | 

<a name="Route.enter"></a>
### Route.enter(enter) ⇒ <code>[Route](#Route)</code>
Add enter hooks to the route. This can also called on the global `IsoRouter.Route`. It will add default hooks which will always be called.

**Kind**: static method of <code>[Route](#Route)</code>  
**Locus**: anywhere  

| Param | Type | Description |
| --- | --- | --- |
| enter | <code>[enterHook](#enterHook)</code> | An enter hook to be added to the route |

<a name="Route.exit"></a>
### Route.exit(exit) ⇒ <code>[Route](#Route)</code>
Adds an exit hook. This can also called on the global `IsoRouter.Route`. It will add a default hook which will always be called.

**Kind**: static method of <code>[Route](#Route)</code>  
**Locus**: anywhere  

| Param | Type | Description |
| --- | --- | --- |
| exit | <code>[exitHook](#exitHook)</code> | The exit hook to add |

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

<a name="event_isoRouter-enter"></a>
## "isoRouter-enter"
Triggers when the client enters a route

**Kind**: event emitted  
<a name="event_isoRouter-navigate"></a>
## "isoRouter-navigate"
Triggers when the client has entered a route

**Kind**: event emitted  
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
<a name="action"></a>
## action : <code>function</code>
A function that is called when the client navigates to a route.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>[pathToRegexMatch](#pathToRegexMatch)</code> | The array returned by pathRegex.exec |

<a name="enterHook"></a>
## enterHook : <code>function</code>
The `enterHooks` of a route are called before the action is called. When you set global `enterHooks` they will be triggered on each route. Even if the route has it's own. These hooks are executed asynchronously. For that purpose a parameter `next` is passed. It must be called in order to trigger the next enter hook. It must also be called on the last enter hook for the `action` to be called.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>[pathToRegexMatch](#pathToRegexMatch)</code> | The array returned by pathRegex.exec |
| params | <code>next</code> | The next `enter` hook to be called |

<a name="exitHook"></a>
## exitHook : <code>function</code>
On the client `exitHook`s are called when a client navigates to an other route. When you set a global `exitHook` it will be triggered on each route. Even if the route has it's own.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>next</code> | The next `exit` hook to be called |

