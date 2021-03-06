/**
 * @author Dave Devor <davedevor@gmail.com>
 */

/**
 * Constuctor to create an object to hold all of the apps covenants.
 * @type {Function}
 */
function Covenant() {
	/**
	 * Checks if a variable is a function
	 * @param  {Function} fn
	 *
	 * @returns {Boolean}
	 */
	function isFn(fn) {
		return Object.prototype.toString.call(fn) === '[object Function]';
	}

	/**
	 * Store incrementing ID for each passed callback
	 * @type  {Int}
	 */
	var callbackId = 0;

	/**
	 * Store all of our covenants
	 * @type  {Array}
	 */
	var covenants = [];

	/**
	 * Register an event, or add to an existing event
	 * @param   {String}  name    Name of the event like: 'loaded'
	 * @param   {Function}  fn    The closure to execute when signaled.
	 * @return  {Mixed}           Unique ID for listener or false on incorrect parameters
	 */
	this.on = function on() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
		var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		// Make sure the fn is a function
		if (name && fn && isFn(fn)) {
			var _exists = false;
			var cbObj = {
				id: 'cov_' + (++callbackId),
				fn: fn
			}

			// check if this even exists
			covenants.forEach(function (cov) {
				// If it already exists, add the function to its functions.
				if (cov.name === name) {
					cov.callbacks.push(cbObj);
					_exists = true;
					return;
				}
			});

			// If it doesnt exist create it.
			if (!_exists) {
				var newCovenant = {
					name: name,
					callbacks: [cbObj]
				};

				covenants.push(newCovenant);
			}
			return cbObj.id;
		}
		return false;
	};

	/**
	 * Register an event to fire only once
	 * @param   {String}  name    Name of the event like: 'loaded'
	 * @param   {Function}  fn    The closure to execute when signaled.
	 * @return  {Mixed}           Unique ID for listener or false on incorrect parameters
	 */
	this.once = function once() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
		var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		if (name && fn && isFn(fn)) {
			var newId = 'cov_' + (callbackId + 1);
			var oneTimeFunc = function() {
				fn.apply(null, arguments);
				this.off(name, newId);
			}.bind(this);

			this.on(name, oneTimeFunc);

			return newId;
		}

		return false;
	};

	/**
	 * Signal an event and run all of its subscribed functions.
	 * @param  {String}    name  Name of the event like: 'loaded';
	 * @param  {object[]}  args  Any arguments that need to be sent to the  fn
	 * @return {object}          Current instance of Cov, to allow for chaining
	 */
	this.signal = function signal() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
		var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

		if (name) {
			covenants.forEach(function (cov) {
				if (cov.name === name) {

					cov.callbacks.forEach(function (cbObj) {
						cbObj.fn.apply(null, args);
					});

					return;
				}
			});
		}

		return this;
	};

	/**
	 * Unregister (turn off) an event.
	 * @param  {String}           Name of the event like: 'loaded';
	 * @param  {String|Function}  ID of listener as returned by `on` function, or the original function
	 * @return {object}           Current instance of Cov, to allow for chaining
	 */
	this.off = function off() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
		var id = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		if (name) {
			covenants.forEach(function (cov, index, arr) {
				if (cov.name === name) {
					// If no ID is passed, remove all listeners
					if (!id) {
						arr.splice(index, 1);
					}
					else {
					// Otherwise just remove specified callback
						cov.callbacks.forEach(function (cbObj, ix, callbacks) {
							// Remove based off ID or the reference of the function passed matches original
							if (cbObj.id === id || (isFn(id) && cbObj.fn === id)) {
								callbacks.splice(ix, 1);
							}
						});
					}
					return;
				}
			});
		}

		return this;
	};
}

var cov = new Covenant();

module.exports = {
	cov: cov,
	Covenant: Covenant
};
