# covjs

A super lightweight pubsub module. Around 1Kb minified, _under 500B minified and gzipped_.

_Cov is short for covenants._

## How to use
### Install
* NPM: `npm install covjs`

### Import the module
```javascript
var cov = require('covjs');
```

### Subscribe to a covenant
```javascript
// Subscribe to the 'Cov-Name' covenant, execute function when signaled
cov.on('Cov-Name', function(arg1, arg2) {
    var data = {
        foo: arg1,
        bar: arg2
    };

    doSomething(data)
});
```

#### Subscribe to a covenant only once

```javascript
// Function will only fire for first signal of 'Cov-Name'.
cov.once('Cov-Name', function(arg1, arg2) {
    var data = {
        foo: arg1,
        bar: arg2
    };

    doSomethingOnce(data)
});
```

### Signal a covenant (publish)
```javascript
// Signal this covenant with 2 arguments
cov.signal('Cov-Name', ['argument 1', 'argument 2']);
```

### Unsubscribe all from a Covenant

#### To unsubscribe all listeners from a Covenant:
```javascript
// unsubscribe from 'Cov-Name'
cov.off('Cov-Name');
```

#### To unsubscribe one specific listener from a Covenant:

You'll need to save the token returned by your call to `cov.on()`

```javascript
var firstListener = cov.on('Cov-Name', function() {
	console.log('First Listener has fired!');
});

var secondListener = cov.on('Cov-Name', function() {
	console.log('Second listener has fired!');
});

// Both First and Second Listeners will fire
cov.signal('Cov-Name');

// Unsubscribe just the first Listener
cov.off('Cov-Name', firstListener);

// Only Second Listener will fire
cov.signal('Cov-Name');
```
