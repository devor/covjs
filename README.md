# covjs

A super lightweight pubsub module. 

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
})
```

### Signal a covenant (publish)
```javascript
// Signal this covenant with 2 arguments
cov.signal('Cov-Name', ['argument 1', 'argument 2']);
```

### Unsubscribe from a Covenant
```javascript
// unsubscribe from 'Cov-Name'
cov.off('Cov-Name');
```
