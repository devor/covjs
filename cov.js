/**
 * @author Dave Devor <davedevor@gmail.com>
 */

/**
 * Checks if a variable is a function
 * @param  {Function} fn
 *
 * @returns {Boolean}
 */
function _isFn(fn) {
	return Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * One object to hold all of the apps covenants.
 * @type {Object}
 */
var Cov = {

	/**
	 * Store all of our covenants
	 * @type  {Array}
	 */
	covenants: [],

	/**
	 * Register an event, or add to an existing event
	 * @param   {String}  name    Name of the event like: 'loaded'
	 * @param   {Function}  fn    The closure to execute when signaled.
	 */
	on: function on() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
		var fn = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		// Make sure the fn is a function
		var isFn = _isFn(fn);

		if (name && fn && isFn) {
			var _exists = false;

			// check if this even exists
			this.covenants.forEach(function (cov) {
				// If it already exists, add the function to its functions.
				if (cov.name === name) {
					cov.callbacks.push(fn);
					_exists = true;
					return;
				}
			});

			// If it doesnt exist create it.
			if (!_exists) {
				var newCovenant = {
					name: name,
					callbacks: [fn]
				};

				this.covenants.push(newCovenant);
			}
		}
	},


	/**
	 * Signal an event and run all of its subscribed functions.
	 * @param {String}    name  Name of the event like: 'loaded';
	 * @param {object[]}  args  Any arguments that need to be sent to the  fn
	 */
	signal: function signal() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
		var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];


		if (name) {
			this.covenants.forEach(function (cov) {
				if (cov.name === name) {

					cov.callbacks.forEach(function (fn) {
						fn.apply(null, args);
					});

					return;
				}
			});
		}
	},


	/**
	 * Unregister (turn off) an event.
	 * @param  {String}  Name of the event like: 'loaded';
	 */
	off: function off() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

		if (name) {
			this.covenants.forEach(function (ev, index, arr) {
				if (ev.name === name) {

					arr.splice(index, 1);

					return;
				}
			});
		}
	},

};

module.exports = Cov;
