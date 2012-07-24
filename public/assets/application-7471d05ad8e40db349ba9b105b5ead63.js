/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, crossDomain, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        crossDomain = element.data('cross-domain') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e)
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
      rails.enableElement($(this));
  });

  $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
    var link = $(this), method = link.data('method'), data = link.data('params');
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

    if (link.data('remote') !== undefined) {
      if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

      if (rails.handleRemote(link) === false) { rails.enableElement(link); }
      return false;

    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

  $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });

  $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;

    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data © 2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */

Cufon.registerFont({"w":200,"face":{"font-family":"Liberation Sans","font-weight":400,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 6 4 2 2 2 2 2 4","ascent":"288","descent":"-72","x-height":"4","bbox":"-9 -266 339 76.6956","underline-thickness":"26.3672","underline-position":"-24.9609","unicode-range":"U+0020-U+007E"},"glyphs":{" ":{"w":100,"k":{"Y":7,"T":7,"A":20}},"\u00a0":{"w":100},"!":{"d":"63,-70r-26,0r-4,-178r34,0xm33,0r0,-35r34,0r0,35r-34,0","w":100},"\"":{"d":"109,-170r-25,0r-4,-78r32,0xm44,-170r-25,0r-4,-78r33,0","w":127},"#":{"d":"158,-156r-14,65r45,0r0,19r-49,0r-16,72r-19,0r15,-72r-64,0r-15,72r-19,0r15,-72r-35,0r0,-19r39,0r14,-65r-44,0r0,-19r48,0r15,-71r20,0r-16,71r64,0r16,-71r19,0r-16,71r37,0r0,19r-40,0xm75,-156r-14,65r63,0r14,-65r-63,0"},"$":{"d":"194,-70v0,46,-34,64,-81,66r0,29r-22,0r0,-29v-49,-1,-79,-23,-87,-63r30,-6v5,28,25,41,57,43r0,-87v-38,-9,-76,-20,-76,-67v1,-42,33,-58,76,-59r0,-23r22,0r0,23v45,0,67,20,76,56r-31,6v-5,-23,-18,-35,-45,-37r0,78v41,10,81,20,81,70xm113,-29v51,7,71,-66,19,-77v-6,-2,-12,-4,-19,-6r0,83xm91,-219v-47,-6,-63,57,-18,69v6,2,12,3,18,5r0,-74"},"%":{"d":"252,-156v43,0,55,33,55,80v0,46,-13,78,-56,78v-42,0,-55,-33,-55,-78v0,-48,12,-80,56,-80xm93,0r-28,0r162,-248r28,0xm13,-171v-1,-47,13,-79,56,-79v43,0,55,33,55,79v0,46,-13,79,-55,79v-43,0,-56,-33,-56,-79xm251,-17v28,0,30,-29,30,-59v0,-31,-1,-60,-29,-60v-29,0,-31,29,-31,60v0,29,2,59,30,59xm69,-112v27,0,28,-30,29,-59v0,-31,-1,-60,-29,-60v-29,0,-30,30,-30,60v0,30,2,59,30,59","w":320},"&":{"d":"234,-2v-28,10,-62,0,-77,-18v-40,39,-149,32,-144,-45v3,-43,29,-61,60,-76v-25,-40,-17,-114,47,-108v35,3,59,15,59,50v0,44,-40,53,-71,69v14,26,32,50,51,72v14,-21,24,-43,30,-72r26,8v-9,33,-21,57,-38,82v13,13,33,22,57,15r0,23xm97,-151v25,-10,52,-18,56,-48v-1,-18,-13,-29,-33,-29v-42,0,-39,50,-23,77xm42,-66v-3,51,71,58,98,28v-20,-24,-41,-51,-56,-80v-23,10,-40,24,-42,52","w":240},"'":{"d":"47,-170r-25,0r-4,-78r33,0","w":68},"(":{"d":"87,75v-38,-42,-65,-92,-65,-169v0,-76,28,-126,65,-167r31,0v-38,41,-64,92,-64,168v0,76,26,127,64,168r-31,0","w":119},")":{"d":"33,-261v38,41,65,92,65,168v0,76,-27,127,-65,168r-31,0v37,-41,64,-92,64,-168v0,-76,-27,-127,-64,-168r31,0","w":119},"*":{"d":"80,-196r47,-18r7,23r-49,13r32,44r-20,13r-27,-46r-27,45r-21,-12r33,-44r-49,-13r8,-23r47,19r-2,-53r23,0","w":140},"+":{"d":"118,-107r0,75r-26,0r0,-75r-74,0r0,-26r74,0r0,-75r26,0r0,75r74,0r0,26r-74,0","w":210},",":{"d":"68,-38v1,34,0,65,-14,84r-22,0v9,-13,17,-26,17,-46r-16,0r0,-38r35,0","w":100},"-":{"d":"16,-82r0,-28r88,0r0,28r-88,0","w":119},"\u00ad":{"d":"16,-82r0,-28r88,0r0,28r-88,0","w":119},".":{"d":"33,0r0,-38r34,0r0,38r-34,0","w":100},"\/":{"d":"0,4r72,-265r28,0r-72,265r-28,0","w":100},"0":{"d":"101,-251v68,0,85,55,85,127v0,72,-20,128,-86,128v-67,0,-86,-56,-86,-128v0,-73,17,-127,87,-127xm100,-22v47,0,54,-49,54,-102v0,-53,-4,-102,-53,-102v-51,0,-55,48,-55,102v0,53,5,102,54,102"},"1":{"d":"27,0r0,-27r64,0r0,-190r-56,39r0,-29r58,-41r29,0r0,221r61,0r0,27r-156,0","k":{"1":27}},"2":{"d":"101,-251v82,-7,93,87,43,132r-62,55v-11,11,-23,22,-29,37r129,0r0,27r-164,0v2,-99,128,-94,128,-182v0,-28,-16,-43,-45,-43v-29,0,-46,15,-49,41r-32,-3v6,-41,34,-60,81,-64"},"3":{"d":"126,-127v33,6,58,20,58,59v0,88,-139,92,-164,29v-3,-8,-5,-16,-6,-25r32,-3v6,27,21,44,54,44v32,0,53,-15,52,-46v-1,-38,-36,-46,-79,-43r0,-28v39,1,72,-4,72,-42v0,-27,-17,-43,-46,-43v-28,0,-47,15,-49,41r-32,-3v6,-42,35,-63,81,-64v48,-1,79,21,79,65v0,36,-21,52,-52,59"},"4":{"d":"155,-56r0,56r-30,0r0,-56r-117,0r0,-25r114,-167r33,0r0,167r35,0r0,25r-35,0xm125,-212v-27,46,-58,90,-88,131r88,0r0,-131"},"5":{"d":"54,-142v48,-35,137,-8,131,61v11,99,-154,114,-171,26r32,-4v7,23,22,37,52,37v35,-1,51,-22,54,-58v4,-55,-73,-65,-99,-34r-31,0r8,-134r141,0r0,27r-112,0"},"6":{"d":"110,-160v48,1,74,30,74,79v0,53,-28,85,-80,85v-65,0,-83,-55,-86,-122v-5,-90,50,-162,133,-122v14,7,22,21,27,39r-31,6v-5,-40,-67,-38,-82,-6v-9,19,-15,44,-15,74v11,-20,30,-34,60,-33xm103,-22v34,0,49,-23,49,-58v0,-35,-16,-56,-50,-56v-29,0,-50,16,-49,49v1,36,15,65,50,65"},"7":{"d":"64,0v3,-98,48,-159,88,-221r-134,0r0,-27r164,0r0,26v-39,65,-84,121,-85,222r-33,0"},"8":{"d":"134,-131v28,9,52,24,51,62v-1,50,-34,73,-85,73v-51,0,-83,-23,-84,-73v0,-36,21,-54,49,-61v-75,-25,-45,-126,34,-121v46,3,78,18,79,63v0,33,-17,51,-44,57xm100,-142v31,1,46,-15,46,-44v0,-28,-17,-43,-47,-42v-29,0,-46,13,-45,42v1,28,16,44,46,44xm101,-20v35,0,51,-18,51,-52v0,-30,-18,-46,-53,-46v-33,0,-51,17,-51,47v0,34,19,51,53,51"},"9":{"d":"99,-251v64,0,84,50,84,122v0,92,-53,162,-136,121v-14,-7,-20,-23,-25,-40r30,-5v6,39,69,39,84,7v9,-19,16,-44,16,-74v-10,22,-31,35,-62,35v-49,0,-73,-33,-73,-83v0,-54,28,-83,82,-83xm98,-110v31,-1,51,-18,51,-49v0,-36,-14,-67,-51,-67v-34,0,-49,23,-49,58v0,34,15,58,49,58"},":":{"d":"33,-154r0,-36r34,0r0,36r-34,0xm33,0r0,-36r34,0r0,36r-34,0","w":100},";":{"d":"68,-36v1,33,-1,63,-14,82r-22,0v9,-13,17,-26,17,-46r-16,0r0,-36r35,0xm33,-154r0,-36r35,0r0,36r-35,0","w":100},"\u037e":{"d":"68,-36v1,33,-1,63,-14,82r-22,0v9,-13,17,-26,17,-46r-16,0r0,-36r35,0xm33,-154r0,-36r35,0r0,36r-35,0","w":100},"<":{"d":"18,-100r0,-36r175,-74r0,27r-151,65r151,64r0,27","w":210},"=":{"d":"18,-150r0,-26r174,0r0,26r-174,0xm18,-60r0,-26r174,0r0,26r-174,0","w":210},">":{"d":"18,-27r0,-27r151,-64r-151,-65r0,-27r175,74r0,36","w":210},"?":{"d":"103,-251v84,0,111,97,45,133v-19,10,-37,24,-39,52r-31,0v0,-63,77,-55,77,-114v0,-30,-21,-42,-52,-43v-32,0,-53,17,-56,46r-32,-2v7,-45,34,-72,88,-72xm77,0r0,-35r34,0r0,35r-34,0"},"@":{"d":"198,-261v85,0,136,45,136,128v0,61,-22,111,-78,115v-29,2,-39,-18,-37,-44v-12,23,-32,44,-66,44v-41,0,-58,-28,-58,-68v0,-60,30,-105,88,-108v29,-1,43,15,54,32r7,-28r28,0v-9,45,-23,84,-27,134v-1,11,6,17,14,16v39,-4,51,-48,51,-92v0,-69,-42,-107,-112,-107v-93,0,-145,59,-145,153v0,71,41,112,115,113v43,0,78,-13,106,-28r9,19v-30,18,-67,32,-115,32v-89,0,-140,-51,-140,-136v0,-107,62,-175,170,-175xm158,-41v46,0,70,-43,70,-90v0,-26,-17,-40,-43,-40v-44,0,-59,41,-61,85v-1,26,9,45,34,45","w":365},"A":{"d":"205,0r-28,-72r-113,0r-28,72r-35,0r101,-248r38,0r99,248r-34,0xm167,-99r-47,-123v-12,45,-31,82,-46,123r93,0","w":240,"k":{"y":7,"w":7,"v":7,"Y":27,"W":13,"V":27,"T":27," ":20}},"B":{"d":"160,-131v35,5,61,23,61,61v0,87,-106,68,-191,70r0,-248v76,3,177,-17,177,60v0,33,-19,50,-47,57xm63,-142v50,-1,110,9,110,-42v0,-47,-63,-36,-110,-37r0,79xm63,-27v55,-2,124,14,124,-45v0,-56,-70,-42,-124,-44r0,89","w":240},"C":{"d":"212,-179v-10,-28,-35,-45,-73,-45v-59,0,-87,40,-87,99v0,60,29,101,89,101v43,0,62,-24,78,-52r27,14v-18,38,-51,66,-107,66v-80,0,-117,-50,-121,-129v-6,-104,99,-153,187,-111v19,9,31,26,39,46","w":259},"D":{"d":"30,-248v118,-7,216,8,213,122v-3,78,-43,126,-121,126r-92,0r0,-248xm63,-27v89,8,146,-16,146,-99v0,-83,-60,-101,-146,-95r0,194","w":259},"E":{"d":"30,0r0,-248r187,0r0,28r-154,0r0,79r144,0r0,27r-144,0r0,87r162,0r0,27r-195,0","w":240},"F":{"d":"63,-220r0,92r138,0r0,28r-138,0r0,100r-33,0r0,-248r175,0r0,28r-142,0","w":219,"k":{"A":20,".":40,",":40}},"G":{"d":"143,4v-82,0,-121,-48,-125,-129v-5,-107,100,-154,193,-111v17,8,29,25,37,43r-32,9v-13,-25,-37,-40,-76,-40v-61,0,-88,39,-88,99v0,61,29,100,91,101v35,0,62,-11,79,-27r0,-45r-74,0r0,-28r105,0r0,86v-25,25,-61,42,-110,42","w":280},"H":{"d":"197,0r0,-115r-134,0r0,115r-33,0r0,-248r33,0r0,105r134,0r0,-105r34,0r0,248r-34,0","w":259},"I":{"d":"33,0r0,-248r34,0r0,248r-34,0","w":100},"J":{"d":"153,-248v-8,100,35,252,-73,252v-44,-1,-67,-25,-74,-66r32,-5v4,25,16,42,43,43v27,0,39,-20,39,-49r0,-147r-48,0r0,-28r81,0","w":180},"K":{"d":"194,0r-99,-120r-32,25r0,95r-33,0r0,-248r33,0r0,124r119,-124r40,0r-105,108r119,140r-42,0","w":240},"L":{"d":"30,0r0,-248r33,0r0,221r125,0r0,27r-158,0","k":{"y":13,"Y":27,"W":27,"V":27,"T":27," ":13}},"M":{"d":"240,0r2,-218v-23,76,-54,145,-80,218r-23,0r-81,-218r1,218r-29,0r0,-248r44,0r77,211v21,-75,51,-140,76,-211r43,0r0,248r-30,0","w":299},"N":{"d":"190,0r-132,-211r1,211r-29,0r0,-248r39,0r133,213r-2,-213r31,0r0,248r-41,0","w":259},"O":{"d":"140,-251v81,0,123,46,123,126v0,79,-44,129,-123,129v-81,0,-123,-49,-123,-129v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101","w":280},"P":{"d":"30,-248v87,1,191,-15,191,75v0,78,-77,80,-158,76r0,97r-33,0r0,-248xm63,-123v57,0,124,11,124,-50v0,-59,-68,-47,-124,-48r0,98","w":240,"k":{"A":27,".":46,",":46," ":7}},"Q":{"d":"140,-251v81,0,123,46,123,126v0,72,-35,117,-100,126v7,30,30,48,69,40r0,23v-55,16,-95,-15,-103,-61v-73,-6,-112,-51,-112,-128v0,-80,42,-126,123,-126xm140,-24v63,0,89,-41,89,-101v0,-60,-29,-99,-89,-99v-61,0,-89,39,-89,99v0,60,28,100,89,101","w":280},"R":{"d":"233,-177v-1,41,-23,64,-60,70r70,107r-38,0r-65,-103r-77,0r0,103r-33,0r0,-248v88,3,205,-21,203,71xm63,-129v60,-2,137,13,137,-47v0,-61,-80,-42,-137,-45r0,92","w":259,"k":{"Y":7,"W":7,"V":7,"T":7}},"S":{"d":"185,-189v-5,-48,-123,-54,-124,2v14,75,158,14,163,119v3,78,-121,87,-175,55v-17,-10,-28,-26,-33,-46r33,-7v5,56,141,63,141,-1v0,-78,-155,-14,-162,-118v-5,-82,145,-84,179,-34v5,7,8,16,11,25","w":240},"T":{"d":"127,-220r0,220r-34,0r0,-220r-85,0r0,-28r204,0r0,28r-85,0","w":219,"k":{"y":20,"w":20,"u":13,"s":40,"r":13,"o":40,"i":13,"e":40,"c":40,"a":40,"O":7,"A":27,";":40,":":40,".":40,"-":20,",":40," ":7}},"U":{"d":"232,-93v-1,65,-40,97,-104,97v-61,0,-100,-32,-100,-94r0,-158r33,0v8,89,-33,224,67,224v102,0,64,-133,71,-224r33,0r0,155","w":259},"V":{"d":"137,0r-34,0r-101,-248r35,0r83,218r83,-218r36,0","w":240,"k":{"y":13,"u":13,"r":13,"o":20,"i":7,"e":20,"a":27,"A":27,";":13,":":13,".":33,"-":20,",":33}},"W":{"d":"266,0r-40,0r-56,-210r-55,210r-40,0r-73,-248r35,0r59,218r15,-64r43,-154r32,0r59,218r59,-218r35,0","w":339,"k":{"y":3,"u":7,"r":7,"o":7,"e":7,"a":13,"A":13,";":7,":":7,".":20,"-":7,",":20}},"X":{"d":"195,0r-74,-108r-76,108r-37,0r94,-129r-87,-119r37,0r69,98r67,-98r37,0r-84,118r92,130r-38,0","w":240},"Y":{"d":"137,-103r0,103r-34,0r0,-103r-95,-145r37,0r75,118r75,-118r37,0","w":240,"k":{"v":20,"u":20,"q":33,"p":27,"o":33,"i":13,"e":33,"a":27,"A":27,";":23,":":20,".":46,"-":33,",":46," ":7}},"Z":{"d":"209,0r-198,0r0,-25r151,-195r-138,0r0,-28r176,0r0,25r-150,196r159,0r0,27","w":219},"[":{"d":"26,75r0,-336r71,0r0,23r-41,0r0,290r41,0r0,23r-71,0","w":100},"\\":{"d":"72,4r-72,-265r28,0r72,265r-28,0","w":100},"]":{"d":"3,75r0,-23r41,0r0,-290r-41,0r0,-23r71,0r0,336r-71,0","w":100},"^":{"d":"138,-118r-54,-112r-54,112r-28,0r64,-130r36,0r65,130r-29,0","w":168},"_":{"d":"-5,72r0,-23r209,0r0,23r-209,0"},"`":{"d":"77,-211r-58,-49r0,-5r36,0v12,19,30,32,38,54r-16,0","w":119},"a":{"d":"141,-36v-15,21,-31,41,-68,40v-36,-1,-58,-21,-58,-57v-1,-64,63,-63,125,-63v3,-35,-9,-54,-41,-54v-24,1,-41,7,-42,31r-33,-3v5,-37,33,-52,76,-52v45,0,72,20,72,64r0,82v-1,20,7,32,28,27r0,20v-31,9,-61,-2,-59,-35xm48,-53v0,20,12,33,32,33v41,-3,63,-29,60,-74v-43,2,-92,-5,-92,41"},"b":{"d":"115,-194v53,0,69,39,70,98v0,66,-23,100,-70,100v-31,-1,-49,-11,-59,-34r-2,30r-31,0r1,-261r32,0r0,101v10,-23,28,-34,59,-34xm107,-20v40,0,45,-34,45,-75v0,-40,-5,-75,-45,-74v-42,0,-51,32,-51,76v0,43,10,73,51,73"},"c":{"d":"96,-169v-40,0,-48,33,-48,73v0,40,9,75,48,75v24,0,41,-14,43,-38r32,2v-6,37,-31,61,-74,61v-59,0,-76,-41,-82,-99v-10,-93,101,-131,147,-64v4,7,5,14,7,22r-32,3v-4,-21,-16,-35,-41,-35","w":180},"d":{"d":"85,-194v31,0,48,13,60,33r-1,-100r32,0r1,261r-30,0v-2,-10,0,-23,-3,-31v-10,23,-28,35,-59,35v-53,0,-69,-39,-70,-98v0,-66,23,-100,70,-100xm94,-170v-40,0,-46,34,-46,75v0,40,6,74,45,74v42,0,51,-32,51,-76v0,-42,-9,-74,-50,-73"},"e":{"d":"100,-194v63,0,86,42,84,106r-135,0v0,40,14,67,53,68v26,1,43,-12,49,-29r28,8v-11,28,-37,45,-77,45v-58,0,-88,-37,-87,-100v1,-61,26,-98,85,-98xm152,-113v6,-60,-76,-77,-97,-28v-3,7,-6,17,-6,28r103,0"},"f":{"d":"101,-234v-31,-9,-42,10,-38,44r38,0r0,23r-38,0r0,167r-31,0r0,-167r-27,0r0,-23r27,0v-7,-52,17,-82,69,-68r0,24","w":100,"k":{"f":7}},"g":{"d":"177,-190v-10,125,41,293,-110,261v-23,-6,-38,-20,-44,-43r32,-5v15,47,100,32,89,-28r0,-30v-11,21,-29,36,-61,36v-54,0,-68,-41,-68,-96v0,-56,16,-97,71,-98v29,-1,48,16,59,35v1,-10,0,-23,2,-32r30,0xm94,-22v36,0,50,-32,50,-73v0,-42,-14,-75,-50,-75v-39,0,-46,34,-46,75v0,41,6,73,46,73"},"h":{"d":"106,-169v-72,0,-44,102,-49,169r-32,0r0,-261r32,0r-1,103v12,-21,28,-36,61,-36v89,0,53,116,60,194r-32,0r0,-121v2,-32,-8,-49,-39,-48"},"i":{"d":"24,-231r0,-30r32,0r0,30r-32,0xm24,0r0,-190r32,0r0,190r-32,0","w":79},"j":{"d":"24,-231r0,-30r32,0r0,30r-32,0xm-9,49v24,4,33,-6,33,-30r0,-209r32,0r0,214v2,40,-23,58,-65,49r0,-24","w":79},"k":{"d":"143,0r-64,-87r-23,19r0,68r-32,0r0,-261r32,0r0,163r83,-92r37,0r-77,82r82,108r-38,0","w":180},"l":{"d":"24,0r0,-261r32,0r0,261r-32,0","w":79},"m":{"d":"210,-169v-67,3,-38,105,-44,169r-31,0r0,-121v0,-29,-5,-50,-35,-48v-66,4,-38,104,-44,169r-31,0r-1,-190r30,0v1,10,-1,24,2,32v10,-44,99,-50,107,0v11,-21,27,-35,58,-36v85,-2,47,119,55,194r-31,0r0,-121v0,-29,-5,-49,-35,-48","w":299},"n":{"d":"117,-194v89,-4,53,116,60,194r-32,0r0,-121v0,-31,-8,-49,-39,-48v-72,2,-44,102,-49,169r-32,0r-1,-190r30,0v1,10,-1,24,2,32v11,-22,29,-35,61,-36"},"o":{"d":"100,-194v62,-1,85,37,85,99v1,63,-27,99,-86,99v-59,0,-83,-39,-84,-99v0,-66,28,-99,85,-99xm99,-20v44,1,53,-31,53,-75v0,-43,-8,-75,-51,-75v-43,0,-53,32,-53,75v0,43,10,74,51,75"},"p":{"d":"115,-194v55,1,70,41,70,98v0,57,-16,98,-70,100v-31,0,-49,-13,-60,-34r1,105r-32,0r-1,-265r31,0r2,30v10,-21,28,-34,59,-34xm107,-20v40,0,45,-34,45,-75v0,-41,-6,-73,-45,-74v-42,0,-51,32,-51,76v0,43,10,73,51,73"},"q":{"d":"145,-31v-11,22,-29,35,-60,35v-53,0,-69,-39,-70,-98v0,-59,17,-99,70,-100v32,-1,48,14,60,33v0,-11,-1,-24,2,-32r30,0r-1,268r-32,0xm93,-21v41,0,51,-33,51,-76v0,-43,-8,-73,-50,-73v-40,0,-46,35,-46,75v0,40,5,74,45,74"},"r":{"d":"114,-163v-78,-16,-53,91,-57,163r-32,0r-1,-190r30,0v1,12,-1,29,2,39v6,-27,23,-49,58,-41r0,29","w":119,"k":{".":20,",":20}},"s":{"d":"135,-143v-3,-34,-86,-38,-87,0v15,53,115,12,119,90v4,78,-150,74,-157,8r28,-5v4,36,97,45,98,0v-10,-56,-113,-15,-118,-90v-4,-57,82,-63,122,-42v12,7,21,19,24,35","w":180},"t":{"d":"59,-47v-2,24,18,29,38,22r0,24v-33,10,-70,5,-70,-39r0,-127r-22,0r0,-23r24,0r9,-43r21,0r0,43r35,0r0,23r-35,0r0,120","w":100},"u":{"d":"84,4v-89,4,-54,-116,-61,-194r32,0r0,120v0,31,7,50,39,49v72,-2,45,-101,50,-169r31,0r1,190r-30,0v-1,-10,1,-25,-2,-33v-11,22,-28,36,-60,37"},"v":{"d":"108,0r-38,0r-69,-190r34,0r54,165r56,-165r34,0","w":180,"k":{".":27,",":27}},"w":{"d":"206,0r-36,0r-40,-164r-41,164r-36,0r-54,-190r32,0r39,164r43,-164r34,0r41,164r42,-164r31,0","w":259,"k":{".":20,",":20}},"x":{"d":"141,0r-51,-78r-52,78r-34,0r68,-98r-65,-92r35,0r48,74r47,-74r35,0r-64,92r68,98r-35,0","w":180},"y":{"d":"179,-190r-86,221v-14,28,-37,51,-81,42r0,-24v39,6,53,-20,64,-50r-75,-189r34,0r57,156r54,-156r33,0","w":180,"k":{".":27,",":27}},"z":{"d":"9,0r0,-24r116,-142r-109,0r0,-24r144,0r0,24r-116,142r123,0r0,24r-158,0","w":180},"{":{"d":"39,-94v74,12,-11,154,75,146r0,23v-44,4,-70,-10,-70,-52v0,-46,11,-107,-38,-105r0,-22v81,4,-7,-162,84,-157r24,0r0,23v-82,-15,-2,131,-75,144","w":120},"|":{"d":"32,76r0,-337r29,0r0,337r-29,0","w":93},"}":{"d":"76,-40v2,64,8,128,-70,115r0,-23v80,12,3,-131,74,-146v-40,-6,-34,-59,-34,-106v1,-29,-11,-41,-40,-38r0,-23v44,-4,70,10,70,52v0,47,-12,108,38,105r0,22v-26,1,-39,14,-38,42","w":120},"~":{"d":"16,-127v37,-31,93,-2,135,6v18,-1,32,-8,43,-16r0,26v-50,42,-130,-35,-178,9r0,-25","w":210}}});
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data © 2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */
Cufon.registerFont({"w":200,"face":{"font-family":"Liberation Sans","font-weight":700,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 7 4 2 2 2 2 2 4","ascent":"288","descent":"-72","x-height":"4","bbox":"-6 -267 339 80","underline-thickness":"37.793","underline-position":"-19.3359","unicode-range":"U+0020-U+007E"},"glyphs":{" ":{"w":100,"k":{"Y":7,"A":13}},"\u00a0":{"w":100},"!":{"d":"80,-75r-40,0r-6,-173r52,0xm34,0r0,-47r51,0r0,47r-51,0","w":119},"\"":{"d":"142,-158r-39,0r-4,-90r48,0xm67,-158r-39,0r-4,-90r48,0","w":170},"#":{"d":"160,-152r-12,59r37,0r0,26r-43,0r-14,67r-28,0r14,-67r-54,0r-14,67r-26,0r13,-67r-27,0r0,-26r33,0r13,-59r-37,0r0,-26r42,0r15,-67r27,0r-15,67r54,0r15,-67r27,0r-14,67r28,0r0,26r-34,0xm79,-152r-13,59r55,0r12,-59r-54,0"},"$":{"d":"111,-147v44,9,85,22,84,75v-1,49,-35,65,-84,68r0,31r-20,0r0,-31v-51,-1,-79,-23,-86,-68r45,-8v4,24,15,38,41,40v-2,-22,4,-51,-2,-69v-39,-10,-76,-22,-76,-72v0,-47,35,-60,78,-63r0,-23r20,0r0,23v47,1,70,23,78,62r-46,7v-4,-18,-12,-32,-32,-34r0,62xm91,-210v-33,-4,-45,46,-13,54v4,1,8,2,13,4r0,-58xm111,-40v39,5,53,-51,15,-60v-7,-2,-7,-2,-15,-4r0,64"},"%":{"d":"249,-155v45,1,62,31,62,79v-1,48,-18,79,-63,79v-45,0,-61,-32,-62,-79v0,-48,16,-79,63,-79xm97,0r-36,0r162,-248r36,0xm9,-172v0,-48,16,-79,63,-78v46,0,62,31,62,78v0,48,-18,79,-63,79v-45,0,-62,-31,-62,-79xm249,-25v24,0,24,-26,24,-51v0,-26,-1,-52,-24,-52v-24,0,-25,26,-25,52v0,25,0,51,25,51xm71,-120v23,0,24,-25,24,-52v0,-26,0,-51,-23,-51v-25,0,-25,25,-25,51v0,27,1,52,24,52","w":320},"&":{"d":"168,-19v-44,38,-157,30,-152,-49v3,-43,29,-60,59,-75v-25,-44,-12,-111,53,-106v37,3,64,15,64,52v0,43,-40,52,-69,68v12,22,27,41,43,59v14,-19,21,-38,28,-64r37,13v-8,29,-19,52,-34,74v12,10,32,16,52,10r0,35v-28,11,-65,-2,-81,-17xm110,-158v19,-9,43,-14,43,-39v0,-14,-10,-22,-25,-22v-34,0,-33,41,-18,61xm60,-68v-3,40,55,47,79,25v-18,-20,-34,-42,-48,-67v-18,8,-30,20,-31,42","w":259},"'":{"d":"62,-158r-38,0r-5,-90r48,0","w":85},"(":{"d":"67,-93v0,74,22,123,53,168r-50,0v-30,-45,-52,-93,-52,-168v0,-75,22,-123,52,-168r50,0v-32,44,-53,94,-53,168","w":119},")":{"d":"102,-93v0,74,-22,123,-52,168r-50,0v30,-46,54,-93,53,-168v0,-74,-22,-123,-53,-168r50,0v30,45,52,94,52,168","w":119},"*":{"d":"86,-200r42,-18r12,35r-44,11r32,37r-32,21r-26,-44r-26,44r-32,-21r33,-37r-44,-11r12,-35r42,18r-3,-48r38,0","w":140},"+":{"d":"125,-100r0,72r-40,0r0,-72r-70,0r0,-39r70,0r0,-72r40,0r0,72r71,0r0,39r-71,0","w":210},",":{"d":"76,-54v-1,42,2,86,-19,110r-33,0v12,-14,22,-32,24,-56r-23,0r0,-54r51,0","w":100},"-":{"d":"14,-72r0,-43r91,0r0,43r-91,0","w":119},"\u00ad":{"d":"14,-72r0,-43r91,0r0,43r-91,0","w":119},".":{"d":"24,0r0,-54r51,0r0,54r-51,0","w":100},"\/":{"d":"4,7r51,-268r42,0r-51,268r-42,0","w":100},"0":{"d":"101,-251v68,0,84,54,84,127v0,74,-19,128,-86,128v-67,0,-84,-56,-85,-128v-1,-75,17,-127,87,-127xm100,-35v37,-5,36,-46,36,-89v0,-43,4,-89,-36,-89v-39,0,-36,45,-36,89v0,43,-3,85,36,89"},"1":{"d":"23,0r0,-37r61,0r0,-169r-59,37r0,-38r62,-41r46,0r0,211r57,0r0,37r-167,0","k":{"1":20}},"2":{"d":"182,-182v0,78,-84,86,-111,141r115,0r0,41r-174,0v-6,-101,99,-100,120,-180v1,-22,-12,-31,-33,-32v-23,0,-32,14,-35,34r-49,-3v5,-45,32,-70,84,-70v51,0,83,22,83,69"},"3":{"d":"128,-127v34,4,56,21,59,58v7,91,-148,94,-172,28v-4,-9,-6,-17,-7,-26r51,-5v1,24,16,35,40,36v23,0,39,-12,38,-36v-1,-31,-31,-36,-65,-34r0,-40v32,2,59,-3,59,-33v0,-20,-13,-33,-34,-33v-21,0,-33,13,-35,32r-50,-3v6,-44,37,-68,86,-68v50,0,83,20,83,66v0,35,-22,52,-53,58"},"4":{"d":"165,-50r0,50r-47,0r0,-50r-113,0r0,-38r105,-160r55,0r0,161r33,0r0,37r-33,0xm118,-87r2,-116r-74,116r72,0"},"5":{"d":"139,-81v0,-46,-55,-55,-73,-27r-48,0r9,-140r149,0r0,37r-104,0r-4,63v44,-38,133,-4,122,66v11,103,-169,117,-179,20r49,-4v5,18,15,30,39,30v26,0,40,-18,40,-45"},"6":{"d":"115,-159v48,0,72,30,72,78v0,54,-30,85,-83,85v-64,0,-91,-50,-91,-122v0,-98,58,-163,141,-120v15,8,21,24,27,44r-47,6v-5,-31,-48,-31,-61,-4v-7,14,-11,33,-11,60v9,-17,28,-27,53,-27xm102,-35v24,0,36,-20,36,-45v0,-25,-11,-43,-37,-43v-23,0,-36,14,-36,38v0,27,11,50,37,50"},"7":{"d":"52,0v1,-96,47,-148,87,-207r-124,0r0,-41r169,0r0,40v-36,62,-79,113,-81,208r-51,0"},"8":{"d":"138,-131v27,9,52,24,51,61v0,53,-36,74,-89,74v-53,0,-89,-23,-89,-73v0,-35,22,-54,51,-61v-78,-25,-46,-121,38,-121v51,0,83,19,83,66v0,30,-18,49,-45,54xm100,-147v24,0,32,-13,32,-36v1,-23,-11,-34,-32,-34v-22,0,-33,12,-32,34v0,22,9,36,32,36xm101,-31v27,0,37,-17,37,-43v0,-25,-13,-39,-39,-39v-24,0,-37,15,-37,40v0,27,11,42,39,42"},"9":{"d":"99,-251v69,0,84,53,88,123v5,99,-61,162,-144,118v-15,-8,-21,-25,-26,-45r46,-6v4,31,50,33,63,7v7,-15,12,-36,12,-60v-9,18,-29,28,-54,28v-48,0,-72,-32,-72,-82v0,-55,31,-83,87,-83xm98,-123v24,0,37,-16,37,-39v0,-27,-10,-51,-37,-51v-25,0,-35,19,-35,45v0,25,10,45,35,45"},":":{"d":"35,-132r0,-50r50,0r0,50r-50,0xm35,0r0,-49r50,0r0,49r-50,0","w":119},";":{"d":"35,-132r0,-50r51,0r0,50r-51,0xm86,-49v1,42,0,83,-19,105r-33,0v12,-14,22,-32,24,-56r-23,0r0,-49r51,0","w":119},"\u037e":{"d":"35,-132r0,-50r51,0r0,50r-51,0xm86,-49v1,42,0,83,-19,105r-33,0v12,-14,22,-32,24,-56r-23,0r0,-49r51,0","w":119},"<":{"d":"15,-91r0,-56r181,-69r0,40r-147,57r147,57r0,40","w":210},"=":{"d":"15,-148r0,-39r180,0r0,39r-180,0xm15,-51r0,-39r180,0r0,39r-180,0","w":210},">":{"d":"15,-22r0,-40r146,-57r-146,-57r0,-40r181,69r0,56","w":210},"?":{"d":"110,-251v83,-7,118,89,53,130v-17,10,-36,21,-38,46r-47,0v2,-56,65,-53,71,-103v2,-21,-15,-35,-38,-34v-25,1,-41,14,-44,38r-50,-2v6,-48,39,-70,93,-75xm77,0r0,-47r51,0r0,47r-51,0","w":219},"@":{"d":"192,-256v86,0,138,45,138,129v0,61,-26,109,-84,114v-27,2,-36,-18,-34,-42v-11,22,-31,42,-62,42v-41,0,-58,-28,-58,-68v0,-58,29,-104,88,-107v26,-1,39,14,48,30r7,-26r27,0r-27,131v-1,11,6,15,14,16v38,-7,54,-45,54,-90v0,-68,-42,-104,-111,-104v-92,0,-143,58,-143,150v0,72,40,113,113,113v43,0,75,-12,103,-28r11,22v-32,17,-67,31,-116,31v-89,0,-139,-50,-139,-138v0,-109,65,-175,171,-175xm156,-38v42,-5,58,-44,60,-89v1,-24,-14,-38,-37,-38v-41,0,-55,40,-57,84v-1,25,9,46,34,43","w":351},"A":{"d":"199,0r-22,-63r-94,0r-22,63r-52,0r90,-248r61,0r90,248r-51,0xm166,-102r-36,-108v-10,38,-24,72,-36,108r72,0","w":259,"k":{"y":13,"w":7,"v":13,"Y":33,"W":20,"V":27,"T":27," ":13}},"B":{"d":"182,-130v37,4,62,22,62,59v0,94,-128,67,-220,71r0,-248v84,5,203,-23,205,63v0,31,-19,50,-47,55xm76,-148v40,-3,101,13,101,-30v0,-44,-60,-28,-101,-31r0,61xm76,-38v48,-3,116,14,116,-37v0,-48,-69,-32,-116,-35r0,72","w":259},"C":{"d":"67,-125v0,53,21,87,73,88v37,1,54,-22,65,-47r45,17v-17,42,-51,71,-110,71v-82,0,-120,-46,-125,-129v-7,-110,109,-156,196,-107v18,10,29,29,36,50r-46,12v-8,-25,-30,-41,-62,-41v-52,0,-71,34,-72,86","w":259},"D":{"d":"24,-248v120,-7,223,5,221,122v-1,80,-44,126,-121,126r-100,0r0,-248xm76,-40v74,7,117,-18,117,-86v0,-67,-45,-88,-117,-82r0,168","w":259},"E":{"d":"24,0r0,-248r195,0r0,40r-143,0r0,63r132,0r0,40r-132,0r0,65r150,0r0,40r-202,0","w":240},"F":{"d":"76,-208r0,77r127,0r0,40r-127,0r0,91r-52,0r0,-248r183,0r0,40r-131,0","w":219,"k":{"A":20,".":40,",":40}},"G":{"d":"67,-125v0,54,23,88,75,88v28,0,53,-7,68,-21r0,-34r-60,0r0,-39r108,0r0,91v-26,26,-66,44,-118,44v-82,0,-120,-46,-125,-129v-7,-111,111,-155,200,-109v19,10,29,26,37,47r-47,15v-11,-23,-29,-39,-63,-39v-53,1,-75,33,-75,86","w":280},"H":{"d":"186,0r0,-106r-110,0r0,106r-52,0r0,-248r52,0r0,99r110,0r0,-99r50,0r0,248r-50,0","w":259},"I":{"d":"24,0r0,-248r52,0r0,248r-52,0","w":100},"J":{"d":"176,-78v10,88,-125,109,-160,43v-5,-9,-9,-19,-11,-32r52,-8v4,21,12,37,35,38v23,0,32,-16,32,-40r0,-130r-49,0r0,-41r101,0r0,170"},"K":{"d":"195,0r-88,-114r-31,24r0,90r-52,0r0,-248r52,0r0,113r112,-113r60,0r-106,105r115,143r-62,0","w":259},"L":{"d":"24,0r0,-248r52,0r0,208r133,0r0,40r-185,0","w":219,"k":{"y":13,"Y":33,"W":20,"V":27,"T":27," ":7}},"M":{"d":"230,0r2,-204r-64,204r-37,0r-63,-204r2,204r-46,0r0,-248r70,0r56,185r57,-185r69,0r0,248r-46,0","w":299},"N":{"d":"175,0r-108,-191v6,58,2,128,3,191r-46,0r0,-248r59,0r110,193v-6,-58,-2,-129,-3,-193r46,0r0,248r-61,0","w":259},"O":{"d":"140,-251v80,0,125,45,125,126v0,81,-46,129,-126,129v-81,0,-124,-48,-124,-129v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88","w":280},"P":{"d":"24,-248v93,1,206,-16,204,79v-1,75,-69,88,-152,82r0,87r-52,0r0,-248xm76,-127v47,0,100,7,100,-41v0,-47,-54,-39,-100,-39r0,80","w":240,"k":{"A":27,".":46,",":46," ":7}},"Q":{"d":"140,-251v80,0,125,45,125,126v0,70,-33,111,-92,124v6,28,34,38,68,31r-1,36v-63,17,-111,-11,-120,-64v-69,-8,-105,-52,-105,-127v0,-81,44,-126,125,-126xm139,-37v52,0,73,-35,73,-88v0,-50,-21,-86,-72,-86v-52,0,-73,35,-73,86v0,51,22,88,72,88","w":280},"R":{"d":"240,-174v0,40,-23,61,-54,70r67,104r-59,0r-57,-94r-61,0r0,94r-52,0r0,-248v93,4,217,-23,216,74xm76,-134v48,-2,112,12,112,-38v0,-48,-66,-32,-112,-35r0,73","w":259,"k":{"Y":13,"W":7,"V":7}},"S":{"d":"169,-182v-1,-43,-94,-46,-97,-3v18,66,151,10,154,114v3,95,-165,93,-204,36v-6,-8,-10,-19,-12,-30r50,-8v3,46,112,56,116,5v-17,-69,-150,-10,-154,-114v-4,-87,153,-88,188,-35v5,8,8,18,10,28","w":240},"T":{"d":"136,-208r0,208r-52,0r0,-208r-80,0r0,-40r212,0r0,40r-80,0","w":219,"k":{"y":27,"w":27,"u":27,"s":27,"r":20,"o":27,"i":7,"e":27,"c":27,"a":27,"O":7,"A":27,";":40,":":40,".":40,"-":20,",":40}},"U":{"d":"238,-95v0,69,-44,99,-111,99v-64,0,-105,-29,-105,-97r0,-155r51,0r0,151v-1,38,19,59,55,60v90,1,49,-130,58,-211r52,0r0,153","w":259},"V":{"d":"147,0r-53,0r-92,-248r55,0r64,206v17,-72,42,-137,63,-206r54,0","w":240,"k":{"y":13,"u":13,"r":20,"o":27,"i":7,"e":20,"a":20,"A":27,";":20,":":20,".":33,"-":20,",":33}},"W":{"d":"275,0r-61,0r-44,-196r-44,196r-62,0r-64,-248r53,0r44,199r45,-199r58,0r43,199r44,-199r52,0","w":339,"k":{"y":7,"u":7,"r":7,"o":7,"i":3,"e":7,"a":13,"A":20,";":7,":":7,".":20,"-":7,",":20}},"X":{"d":"182,0r-62,-99r-62,99r-55,0r86,-130r-79,-118r55,0r55,88r55,-88r55,0r-75,118r82,130r-55,0","w":240},"Y":{"d":"146,-102r0,102r-52,0r0,-102r-88,-146r54,0r60,105r60,-105r54,0","w":240,"k":{"v":20,"u":20,"q":27,"p":20,"o":27,"i":13,"e":20,"a":20,"A":33,";":27,":":27,".":40,"-":20,",":40," ":7}},"Z":{"d":"210,0r-199,0r0,-37r134,-170r-121,0r0,-41r178,0r0,36r-134,171r142,0r0,41","w":219},"[":{"d":"20,75r0,-336r95,0r0,34r-48,0r0,268r48,0r0,34r-95,0","w":119},"\\":{"d":"54,7r-50,-268r42,0r51,268r-43,0","w":100},"]":{"d":"4,75r0,-34r49,0r0,-268r-49,0r0,-34r96,0r0,336r-96,0","w":119},"^":{"d":"162,-90r-57,-133r-57,133r-40,0r69,-158r56,0r69,158r-40,0","w":210},"_":{"d":"-4,44r0,-14r207,0r0,14r-207,0"},"`":{"d":"71,-208r-59,-48r0,-8r45,0r44,51r0,5r-30,0","w":119},"a":{"d":"133,-34v-16,19,-30,39,-64,38v-37,-1,-58,-20,-58,-58v-1,-60,55,-63,116,-61v1,-26,-3,-47,-28,-47v-18,1,-26,9,-28,27r-52,-2v7,-38,36,-58,82,-57v46,1,74,22,75,68r1,82v-1,14,12,18,25,15r0,27v-30,8,-71,5,-69,-32xm85,-31v29,0,43,-24,42,-57v-32,0,-66,-3,-65,30v0,17,8,27,23,27"},"b":{"d":"135,-194v52,0,70,43,70,98v0,56,-19,99,-73,100v-30,1,-46,-15,-58,-35r-2,31r-48,0r1,-261r50,0r0,104v11,-23,29,-37,60,-37xm114,-30v31,0,40,-27,40,-66v0,-37,-7,-63,-39,-63v-32,0,-41,28,-41,65v0,36,8,64,40,64","w":219},"c":{"d":"190,-63v-7,42,-38,67,-86,67v-59,0,-84,-38,-90,-98v-12,-110,154,-137,174,-36r-49,2v-2,-19,-15,-32,-35,-32v-30,0,-35,28,-38,64v-6,74,65,87,74,30"},"d":{"d":"88,-194v31,-1,46,15,58,34r-1,-101r50,0r1,261r-48,0v-2,-10,0,-23,-3,-31v-11,23,-29,35,-61,35v-52,0,-68,-45,-69,-99v0,-56,19,-97,73,-99xm105,-30v33,0,40,-30,41,-66v1,-37,-9,-64,-41,-64v-32,0,-38,30,-39,65v0,43,13,65,39,65","w":219},"e":{"d":"185,-48v-13,30,-37,53,-82,52v-60,-2,-89,-37,-89,-100v0,-63,30,-98,90,-98v62,0,83,45,84,108r-122,0v0,31,8,55,39,56v18,0,30,-7,34,-22xm140,-117v5,-46,-57,-63,-70,-21v-2,6,-4,13,-4,21r74,0"},"f":{"d":"121,-226v-27,-7,-43,5,-38,36r38,0r0,33r-38,0r0,157r-49,0r0,-157r-28,0r0,-33r28,0v-9,-59,32,-81,87,-68r0,32","w":119},"g":{"d":"195,-6v11,88,-120,106,-164,52v-4,-6,-6,-13,-8,-21r49,-6v3,16,16,24,34,25v40,0,42,-37,40,-79v-11,22,-30,35,-61,35v-53,0,-70,-43,-70,-97v0,-56,18,-96,73,-97v30,0,46,14,59,34r2,-30r47,0xm105,-35v32,0,41,-27,41,-63v0,-35,-9,-62,-40,-62v-32,0,-39,29,-40,63v0,36,9,62,39,62","w":219},"h":{"d":"114,-157v-59,0,-34,97,-39,157r-50,0r0,-261r50,0r-1,109v12,-26,28,-41,61,-42v86,-1,58,113,63,194r-50,0v-7,-57,23,-157,-34,-157","w":219},"i":{"d":"25,-224r0,-37r50,0r0,37r-50,0xm25,0r0,-190r50,0r0,190r-50,0","w":100},"j":{"d":"25,-224r0,-37r50,0r0,37r-50,0xm75,22v2,45,-34,59,-81,51r0,-35v22,5,31,-5,31,-27r0,-201r50,0r0,212","w":100},"k":{"d":"147,0r-51,-86r-21,15r0,71r-50,0r0,-261r50,0r0,150r67,-79r53,0r-66,74r72,116r-54,0"},"l":{"d":"25,0r0,-261r50,0r0,261r-50,0","w":100},"m":{"d":"220,-157v-53,9,-28,100,-34,157r-49,0r0,-107v1,-27,-5,-49,-29,-50v-53,10,-27,100,-33,157r-50,0r-1,-190r47,0v2,12,-1,28,3,38v10,-53,101,-56,108,0v13,-22,24,-43,59,-42v82,1,51,116,57,194r-49,0r0,-107v-1,-25,-5,-48,-29,-50","w":320},"n":{"d":"135,-194v87,-1,58,113,63,194r-50,0v-7,-57,23,-157,-34,-157v-59,0,-34,97,-39,157r-50,0r-1,-190r47,0v2,12,-1,28,3,38v12,-26,28,-41,61,-42","w":219},"o":{"d":"110,-194v64,0,96,36,96,99v0,64,-35,99,-97,99v-61,0,-95,-36,-95,-99v0,-62,34,-99,96,-99xm109,-30v35,0,45,-28,45,-65v0,-40,-10,-65,-43,-65v-34,0,-45,26,-45,65v0,36,10,65,43,65","w":219},"p":{"d":"135,-194v53,0,70,44,70,98v0,56,-19,98,-73,100v-31,1,-45,-17,-59,-34v3,33,2,69,2,105r-50,0r-1,-265r48,0v2,10,0,23,3,31v11,-24,29,-35,60,-35xm114,-30v33,0,39,-31,40,-66v0,-38,-9,-64,-40,-64v-56,0,-55,130,0,130","w":219},"q":{"d":"84,4v-52,0,-69,-45,-69,-99v0,-55,18,-99,73,-99v29,0,47,12,58,34r2,-30r48,0r-1,265r-49,0r0,-107v-10,23,-32,36,-62,36xm105,-30v32,0,41,-29,41,-66v0,-36,-9,-64,-40,-64v-33,0,-39,30,-40,65v0,43,13,65,39,65","w":219},"r":{"d":"135,-150v-39,-12,-60,13,-60,57r0,93r-50,0r-1,-190r47,0v2,13,-1,29,3,40v6,-28,27,-53,61,-41r0,41","w":140,"k":{".":20,",":20}},"s":{"d":"137,-138v1,-29,-70,-34,-71,-4v15,46,118,7,119,86v1,83,-164,76,-172,9r43,-7v4,19,20,25,44,25v33,8,57,-30,24,-41v-43,-14,-102,-11,-104,-66v-2,-80,154,-74,161,-7"},"t":{"d":"115,-3v-36,14,-87,7,-87,-42r0,-112r-24,0r0,-33r27,0r15,-45r31,0r0,45r36,0r0,33r-36,0r0,99v-1,23,16,31,38,25r0,30","w":119},"u":{"d":"85,4v-87,1,-58,-113,-63,-194r50,0v7,57,-23,150,33,157v60,-5,35,-97,40,-157r50,0r1,190r-47,0v-2,-12,1,-28,-3,-38v-12,25,-28,42,-61,42","w":219},"v":{"d":"128,0r-59,0r-68,-190r53,0r45,150r48,-150r52,0","k":{".":27,",":27}},"w":{"d":"231,0r-52,0r-39,-155r-40,155r-52,0r-49,-190r46,0r32,145v9,-52,24,-97,36,-145r53,0r37,145r32,-145r46,0","w":280,"k":{".":13,",":13}},"x":{"d":"144,0r-44,-69r-45,69r-53,0r70,-98r-66,-92r53,0r41,62r40,-62r54,0r-67,91r71,99r-54,0"},"y":{"d":"123,10v-15,43,-43,76,-104,62r0,-35v35,8,53,-11,59,-39r-75,-188r52,0r48,148v12,-52,28,-100,44,-148r51,0","k":{".":27,",":27}},"z":{"d":"12,0r0,-35r95,-120r-88,0r0,-35r142,0r0,35r-94,119r103,0r0,36r-158,0","w":180},"{":{"d":"133,41r0,34v-50,4,-88,-6,-87,-53v0,-46,9,-101,-40,-98r0,-34v48,2,40,-52,40,-98v-1,-47,37,-57,87,-53r0,34v-79,-14,-6,124,-77,134v73,11,-4,147,77,134","w":140},"|":{"d":"27,80r0,-341r46,0r0,341r-46,0","w":100},"}":{"d":"94,-36v2,56,4,113,-52,111r-34,0r0,-34v77,13,5,-124,76,-135v-39,-5,-38,-51,-36,-97v1,-27,-12,-38,-40,-36r0,-34v49,-4,87,6,86,53v-1,47,-8,101,41,98r0,34v-26,1,-42,13,-41,40","w":140},"~":{"d":"197,-105v-54,44,-136,-36,-183,10r0,-38v53,-45,135,36,183,-10r0,38","w":210}}});
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data © 2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */
Cufon.registerFont({"w":200,"face":{"font-family":"Liberation Sans","font-weight":400,"font-style":"italic","font-stretch":"normal","units-per-em":"360","panose-1":"2 11 6 4 2 2 2 9 2 4","ascent":"288","descent":"-72","x-height":"4","bbox":"-40 -266 368 80","underline-thickness":"26.3672","underline-position":"-24.9609","slope":"-12","unicode-range":"U+0020-U+007E"},"glyphs":{" ":{"w":100,"k":{"Y":7,"A":13}},"\u00a0":{"w":100},"!":{"d":"58,-70r-26,0r30,-178r35,0xm14,0r7,-35r34,0r-7,35r-34,0","w":100},"\"":{"d":"123,-170r-25,0r11,-78r32,0xm58,-170r-25,0r11,-78r32,0","w":127},"#":{"d":"163,-156r-14,65r46,0r0,19r-50,0r-15,72r-20,0r15,-72r-63,0r-15,72r-20,0r15,-72r-35,0r0,-19r39,0r14,-65r-44,0r0,-19r48,0r16,-71r19,0r-16,71r64,0r16,-71r19,0r-15,71r37,0r0,19r-41,0xm80,-156r-14,65r64,0r13,-65r-63,0"},"$":{"d":"121,-140v32,11,67,22,67,65v0,52,-40,70,-93,71v-4,15,0,35,-26,29r6,-29v-46,-3,-70,-23,-77,-62r29,-7v4,27,23,41,53,43r17,-87v-33,-9,-65,-20,-65,-62v0,-47,42,-62,89,-64r5,-23r20,0r-5,24v35,4,58,20,65,51r-28,8v-6,-19,-19,-31,-42,-34xm100,-30v50,8,78,-55,32,-75v-5,-2,-10,-4,-16,-6xm117,-218v-44,-7,-75,49,-31,67v5,2,10,4,16,6"},"%":{"d":"75,0r-29,0r208,-248r30,0xm26,-148v1,-56,18,-102,70,-102v31,0,46,20,45,54v-2,54,-18,104,-70,104v-32,0,-46,-22,-45,-56xm117,-199v0,-19,-6,-32,-21,-32v-40,0,-44,48,-46,86v-1,19,6,33,22,33v38,0,45,-51,45,-87xm189,-54v2,-54,18,-102,70,-102v32,0,46,22,46,55v0,53,-18,103,-70,103v-32,0,-47,-21,-46,-56xm280,-105v1,-20,-5,-32,-21,-32v-39,0,-43,50,-46,86v-2,19,6,33,22,33v39,0,42,-49,45,-87","w":320},"&":{"d":"76,-182v-8,-73,125,-95,125,-21v0,51,-54,56,-87,74v9,28,22,52,38,74v18,-21,33,-48,44,-75r23,10v-14,30,-29,60,-51,83v10,12,32,18,53,12r-3,23v-25,10,-55,0,-69,-17v-42,35,-147,33,-143,-43v3,-51,38,-63,75,-80v-2,-12,-3,-27,-5,-40xm36,-62v0,51,68,50,96,25v-18,-23,-33,-52,-44,-82v-24,12,-52,20,-52,57xm145,-228v-39,-2,-46,38,-38,76v28,-11,67,-14,67,-50v0,-17,-12,-25,-29,-26","w":240},"'":{"d":"60,-170r-24,0r11,-78r32,0","w":68},"(":{"d":"17,-49v1,-102,45,-165,103,-212r30,0v-58,51,-101,116,-101,215v0,50,14,89,36,121r-31,0v-24,-32,-36,-73,-37,-124","w":119},")":{"d":"98,-137v-1,102,-44,166,-102,212r-31,0v58,-52,102,-116,102,-215v0,-50,-15,-89,-37,-121r31,0v24,32,36,73,37,124","w":119},"*":{"d":"95,-196r47,-18r8,23r-50,13r33,44r-21,13r-27,-46r-27,45r-21,-12r33,-44r-49,-13r8,-23r47,19r-2,-53r24,0","w":140},"+":{"d":"123,-107r0,75r-26,0r0,-75r-74,0r0,-26r74,0r0,-75r26,0r0,75r75,0r0,26r-75,0","w":210},",":{"d":"58,-38v-5,33,-12,64,-30,84r-21,0v12,-14,20,-28,25,-46r-15,0r7,-38r34,0","w":100},"-":{"d":"18,-82r6,-28r88,0r-6,28r-88,0","w":119},"\u00ad":{"d":"18,-82r6,-28r88,0r-6,28r-88,0","w":119},".":{"d":"14,0r8,-38r34,0r-8,38r-34,0","w":100},"\/":{"d":"-20,4r123,-265r28,0r-123,265r-28,0","w":100},"0":{"d":"16,-82v0,-90,25,-169,113,-169v48,0,68,33,68,82v0,90,-27,173,-113,173v-47,0,-68,-35,-68,-86xm46,-77v0,32,11,55,40,55v69,0,76,-79,80,-149v2,-32,-10,-55,-39,-55v-69,0,-81,81,-81,149"},"1":{"d":"9,0r6,-27r63,0r36,-188r-63,39r6,-31r66,-41r29,0r-42,221r60,0r-5,27r-156,0","k":{"1":27}},"2":{"d":"123,-251v66,0,92,69,53,113v-38,44,-103,63,-137,111r128,0r-5,27r-164,0v17,-92,123,-93,159,-163v14,-28,-1,-64,-36,-62v-29,2,-46,17,-54,41r-30,-6v13,-36,37,-61,86,-61"},"3":{"d":"148,-71v0,-36,-31,-44,-71,-41r5,-28v46,3,81,-6,81,-50v0,-23,-15,-35,-39,-35v-30,0,-49,17,-56,41r-32,-3v12,-39,42,-63,90,-64v43,0,69,19,71,60v1,43,-30,58,-65,66v27,5,49,22,49,53v0,85,-133,99,-164,35v-4,-7,-7,-15,-9,-22r29,-9v8,25,25,45,58,45v34,1,53,-17,53,-48"},"4":{"d":"149,-56r-11,56r-32,0r11,-56r-115,0r5,-25r144,-167r35,0r-32,167r33,0r-5,25r-33,0xm145,-203r-105,122r82,0"},"5":{"d":"151,-85v6,-55,-69,-56,-94,-29r-31,0r34,-134r141,0r-5,27r-112,0r-20,79v41,-34,127,-11,121,53v14,102,-155,127,-177,35r29,-8v15,62,122,49,114,-23"},"6":{"d":"184,-94v-4,58,-33,98,-90,98v-50,0,-74,-35,-74,-86v0,-94,36,-181,136,-167v24,3,39,21,44,47r-29,6v-8,-40,-68,-34,-87,-5v-13,20,-24,43,-30,73v28,-51,135,-39,130,34xm111,-136v-35,2,-61,22,-60,62v1,30,14,52,44,52v38,0,55,-31,56,-70v1,-26,-14,-46,-40,-44"},"7":{"d":"206,-222r-58,71v-33,43,-59,89,-72,151r-33,0v20,-96,77,-159,130,-221r-136,0r5,-27r169,0"},"8":{"d":"39,-185v1,-48,36,-66,85,-66v42,0,74,18,74,59v0,38,-25,57,-56,64v23,7,40,22,40,52v0,55,-39,80,-94,80v-48,0,-78,-21,-79,-67v-1,-44,31,-60,63,-71v-20,-7,-33,-25,-33,-51xm70,-182v0,26,17,39,46,39v34,0,48,-18,49,-48v0,-25,-18,-36,-45,-36v-32,0,-50,15,-50,45xm149,-77v0,-29,-19,-41,-50,-41v-37,0,-57,20,-57,55v0,29,19,42,49,42v36,0,58,-19,58,-56"},"9":{"d":"40,-53v7,41,73,38,88,5v14,-18,25,-43,30,-72v-13,20,-31,35,-60,35v-44,0,-69,-27,-69,-70v0,-57,32,-96,91,-96v58,0,76,44,72,106v-6,89,-67,182,-157,136v-12,-6,-19,-20,-23,-36xm102,-110v67,0,87,-116,17,-116v-39,0,-58,29,-58,71v1,27,12,45,41,45"},":":{"d":"44,-154r7,-36r35,0r-8,36r-34,0xm14,0r7,-36r35,0r-7,36r-35,0","w":100},";":{"d":"58,-36v-5,32,-11,63,-30,82r-21,0v12,-14,20,-28,25,-46r-15,0r7,-36r34,0xm47,-154r7,-36r34,0r-7,36r-34,0","w":100},"\u037e":{"d":"58,-36v-5,32,-11,63,-30,82r-21,0v12,-14,20,-28,25,-46r-15,0r7,-36r34,0xm47,-154r7,-36r34,0r-7,36r-34,0","w":100},"<":{"d":"23,-100r0,-36r175,-74r0,27r-151,65r151,64r0,27","w":210},"=":{"d":"23,-150r0,-26r175,0r0,26r-175,0xm23,-60r0,-26r175,0r0,26r-175,0","w":210},">":{"d":"23,-27r0,-27r151,-64r-151,-65r0,-27r175,74r0,36","w":210},"?":{"d":"28,-184v13,-41,42,-62,95,-67v81,-7,97,95,38,128v-25,14,-56,24,-63,57r-31,0v6,-67,99,-52,99,-119v0,-27,-20,-37,-46,-38v-33,0,-55,19,-63,46xm53,0r6,-35r35,0r-7,35r-34,0"},"@":{"d":"204,-261v85,0,136,45,136,128v0,61,-22,110,-78,115v-28,2,-39,-18,-37,-44v-13,22,-31,44,-66,44v-40,0,-58,-27,-58,-68v0,-60,30,-105,88,-108v29,-1,43,15,54,32r7,-28r27,0r-27,134v-1,11,6,16,15,16v39,0,51,-48,51,-92v0,-69,-42,-107,-112,-107v-94,0,-145,59,-145,153v0,72,41,113,114,113v43,0,78,-13,106,-28r10,19v-30,18,-68,32,-116,32v-88,0,-139,-50,-139,-136v0,-107,62,-175,170,-175xm164,-41v46,0,70,-44,70,-90v0,-26,-17,-40,-43,-40v-44,0,-59,41,-61,85v-1,26,9,45,34,45","w":365},"A":{"d":"187,0r-14,-72r-112,0r-42,72r-37,0r149,-248r38,0r52,248r-34,0xm168,-99r-22,-123r-70,123r92,0","w":240,"k":{"y":3,"w":7,"v":7,"Y":27,"W":7,"V":20,"T":27," ":13}},"B":{"d":"219,-77v0,94,-115,75,-208,77r48,-248v73,2,169,-15,169,57v0,38,-24,54,-60,60v29,5,51,21,51,54xm193,-188v0,-44,-62,-31,-105,-33r-16,79v55,0,121,9,121,-46xm186,-78v-1,-49,-69,-36,-119,-38r-17,89v61,-1,137,12,136,-51","w":240},"C":{"d":"125,-24v46,0,70,-25,89,-51r25,16v-25,35,-56,63,-116,63v-115,0,-128,-150,-63,-212v32,-50,158,-61,191,-5v5,7,9,14,11,22r-32,10v-9,-28,-33,-43,-69,-43v-74,0,-108,51,-108,125v0,46,24,75,72,75","w":259},"D":{"d":"248,-139v-1,125,-104,148,-237,139r48,-248v105,-6,190,8,189,109xm214,-139v1,-70,-52,-87,-126,-82r-38,194v98,7,163,-21,164,-112","w":259},"E":{"d":"11,0r48,-248r184,0r-5,28r-151,0r-15,79r140,0r-5,27r-140,0r-17,87r158,0r-5,27r-192,0","w":240},"F":{"d":"87,-220r-18,92r140,0r-5,28r-140,0r-19,100r-34,0r48,-248r178,0r-5,28r-145,0","w":219,"k":{"A":27,".":46,",":46," ":7}},"G":{"d":"52,-101v-6,87,114,94,164,50r9,-45r-74,0r6,-28r105,0r-18,87v-27,25,-63,41,-114,41v-70,0,-112,-35,-112,-105v0,-106,78,-167,188,-146v30,6,48,27,59,54r-34,9v-10,-26,-31,-41,-67,-40v-75,1,-107,50,-112,123","w":280},"H":{"d":"179,0r23,-115r-135,0r-22,115r-34,0r48,-248r34,0r-21,105r135,0r21,-105r32,0r-48,248r-33,0","w":259},"I":{"d":"14,0r48,-248r34,0r-48,248r-34,0","w":100},"J":{"d":"29,-66v0,49,71,55,82,11v13,-52,22,-111,33,-165r-51,0r5,-28r85,0r-34,174v2,85,-142,111,-150,14","w":180},"K":{"d":"180,0r-83,-118r-34,22r-18,96r-34,0r48,-248r34,0r-24,122v44,-43,94,-81,141,-122r43,0r-132,111r98,137r-39,0","w":240},"L":{"d":"11,0r48,-248r34,0r-43,221r125,0r-5,27r-159,0","k":{"y":7,"Y":33,"W":13,"V":20,"T":27," ":7}},"M":{"d":"222,0r43,-216v-8,16,-17,34,-26,49r-96,167r-22,0r-40,-216r-40,216r-30,0r48,-248r42,0r38,208r116,-208r45,0r-48,248r-30,0","w":299},"N":{"d":"173,0r-93,-213r-39,213r-30,0r48,-248r37,0r94,214r40,-214r30,0r-48,248r-39,0","w":259},"O":{"d":"20,-101v0,-91,52,-143,145,-150v126,-9,127,168,53,223v-23,17,-55,32,-93,32v-68,0,-105,-37,-105,-105xm236,-134v5,-57,-18,-91,-73,-90v-77,1,-110,51,-110,125v0,49,23,75,73,75v72,-1,104,-45,110,-110","w":280},"P":{"d":"238,-179v0,84,-86,86,-175,82r-18,97r-34,0r48,-248v82,0,179,-12,179,69xm204,-178v0,-53,-64,-42,-116,-43r-19,98v63,0,135,9,135,-55","w":240,"k":{"A":27,".":46,",":46," ":13}},"Q":{"d":"24,-61v-25,-104,35,-190,139,-190v67,1,105,36,105,101v0,88,-46,140,-124,152v2,33,24,47,60,39r-3,23v-50,15,-89,-11,-89,-61v-46,-3,-79,-26,-88,-64xm234,-134v6,-55,-18,-91,-72,-90v-77,1,-111,51,-111,125v0,49,24,75,73,75v72,0,103,-45,110,-110","w":280},"R":{"d":"249,-183v0,48,-29,72,-75,77r47,106r-36,0r-43,-103r-77,0r-20,103r-34,0r48,-248v83,2,190,-17,190,65xm215,-180v0,-55,-74,-39,-127,-41r-18,92v63,-1,145,13,145,-51","w":259,"k":{"Y":13,"W":7,"V":7,"T":7}},"S":{"d":"194,-120v59,52,2,134,-86,124v-53,-6,-90,-18,-98,-63r31,-7v8,30,29,43,70,43v46,0,84,-17,71,-62v-32,-43,-135,-20,-137,-98v-3,-89,178,-90,191,-16r-30,9v-8,-48,-127,-53,-127,5v0,53,81,35,115,65","w":240},"T":{"d":"151,-220r-43,220r-33,0r42,-220r-85,0r6,-28r203,0r-5,28r-85,0","w":219,"k":{"y":27,"w":27,"u":27,"s":33,"r":27,"o":33,"i":3,"e":33,"c":33,"a":33,"O":7,"A":27,";":27,":":27,".":33,"-":33,",":33}},"U":{"d":"62,-99v-23,68,61,99,108,59v47,-40,38,-139,58,-208r34,0v-28,104,-9,252,-147,252v-66,0,-97,-47,-84,-116r26,-136r34,0","w":259},"V":{"d":"119,0r-35,0r-53,-248r34,0r41,218r126,-218r36,0","w":240,"k":{"y":7,"u":7,"r":7,"o":13,"i":7,"e":13,"a":13,"A":20,";":7,":":7,".":27,"-":13,",":27}},"W":{"d":"247,0r-39,0r-15,-214r-24,57r-74,157r-39,0r-25,-248r35,0r16,218r101,-218r33,0r16,218r101,-218r35,0","w":339,"k":{"i":3,"e":7,"a":7,"A":7,".":13,"-":7,",":13}},"X":{"d":"176,0r-54,-107r-92,107r-37,0r115,-131r-60,-117r35,0r48,97r83,-97r37,0r-105,119r65,129r-35,0","w":240},"Y":{"d":"138,-103r-20,103r-33,0r20,-103r-68,-145r35,0r54,119r98,-119r38,0","w":240,"k":{"v":13,"u":13,"q":20,"p":20,"o":20,"i":7,"e":20,"a":27,"A":20,";":13,":":13,".":33,"-":27,",":33," ":7}},"Z":{"d":"190,0r-197,0r5,-25r185,-195r-134,0r5,-28r176,0r-5,25r-185,196r155,0","w":219},"[":{"d":"-7,75r65,-336r72,0r-5,23r-41,0r-56,290r41,0r-4,23r-72,0","w":100},"\\":{"d":"56,4r-30,-265r26,0r31,265r-27,0","w":100},"]":{"d":"-30,75r5,-23r40,0r57,-290r-41,0r4,-23r72,0r-65,336r-72,0","w":100},"^":{"d":"144,-118r-55,-112r-53,112r-29,0r65,-130r35,0r65,130r-28,0","w":168},"_":{"d":"-28,44r0,-13r207,0r0,13r-207,0"},"`":{"d":"72,-211r-49,-49r1,-5r36,0v9,19,22,33,28,54r-16,0","w":119},"a":{"d":"165,-48v-4,18,1,34,23,27r-3,20v-29,8,-62,0,-52,-35r-2,0v-15,22,-32,40,-68,40v-33,0,-55,-20,-55,-53v0,-68,71,-67,138,-67v10,-26,0,-56,-31,-54v-26,1,-42,9,-47,31r-32,-5v8,-67,160,-71,144,15v-5,28,-9,54,-15,81xm42,-50v3,52,80,24,89,-6v7,-12,7,-24,11,-38v-47,1,-103,-4,-100,44"},"b":{"d":"68,-162v25,-46,127,-43,121,31v-6,71,-20,132,-91,135v-29,1,-45,-15,-55,-35r-7,31r-31,0r52,-261r31,0xm156,-126v2,-27,-9,-43,-34,-43v-55,0,-70,51,-70,103v0,29,15,45,43,46v52,0,58,-58,61,-106"},"c":{"d":"44,-68v0,29,11,47,38,47v30,0,42,-19,51,-41r28,9v-13,32,-35,57,-79,57v-51,0,-72,-33,-70,-89v3,-77,74,-140,146,-93v12,8,15,23,18,40r-31,5v-1,-22,-13,-36,-36,-36v-52,0,-65,49,-65,101","w":180},"d":{"d":"133,-28v-30,54,-138,36,-120,-49v13,-62,24,-115,90,-117v29,-1,46,15,56,35r19,-102r32,0r-50,261r-30,0xm45,-64v-2,27,10,43,35,43v54,-1,69,-50,69,-103v0,-29,-15,-46,-42,-46v-53,-1,-58,58,-62,106"},"e":{"d":"111,-194v62,-3,86,47,72,106r-138,0v-7,38,6,69,45,68v27,-1,43,-14,53,-32r24,11v-15,26,-38,45,-80,45v-49,-1,-75,-27,-75,-75v0,-70,32,-119,99,-123xm155,-113v14,-66,-71,-72,-95,-28v-4,8,-8,17,-11,28r106,0"},"f":{"d":"76,-167r-32,167r-32,0r33,-167r-27,0r4,-23r27,0v3,-47,25,-81,82,-69r-4,24v-35,-8,-44,15,-46,45r37,0r-5,23r-37,0","w":100},"g":{"d":"103,-194v29,0,47,14,56,36v2,-11,5,-23,8,-32r30,0r-37,185v-3,66,-78,102,-139,67v-12,-7,-17,-17,-20,-32r28,-7v7,42,83,31,92,-3v4,-16,9,-38,13,-55v-13,20,-29,36,-62,36v-40,0,-60,-25,-60,-64v0,-71,23,-131,91,-131xm107,-170v-53,0,-58,54,-61,104v-2,27,10,44,36,44v49,0,65,-50,67,-102v1,-29,-15,-46,-42,-46"},"h":{"d":"67,-158v15,-20,31,-36,64,-36v94,0,33,127,27,194r-32,0r25,-140v3,-38,-53,-32,-70,-12v-29,35,-30,101,-44,152r-31,0r51,-261r31,0"},"i":{"d":"50,-231r6,-30r32,0r-6,30r-32,0xm6,0r37,-190r31,0r-37,190r-31,0","w":79},"j":{"d":"51,-231r6,-30r31,0r-6,30r-31,0xm33,24v-5,36,-31,60,-73,48v3,-12,-1,-29,18,-22v17,-1,21,-13,24,-31r41,-209r32,0","w":79},"k":{"d":"127,0r-47,-88r-30,22r-13,66r-31,0r51,-261r31,0r-31,161r99,-90r39,0r-93,82r59,108r-34,0","w":180},"l":{"d":"6,0r50,-261r32,0r-51,261r-31,0","w":79},"m":{"d":"248,-111v6,-24,9,-61,-24,-58v-72,9,-57,108,-77,169r-31,0r26,-142v3,-37,-50,-30,-64,-10v-26,37,-28,101,-41,152r-31,0r36,-190r30,0v-1,10,-6,24,-4,32v13,-43,101,-52,105,5v13,-22,29,-41,61,-41v90,0,28,129,23,194r-31,0","w":299},"n":{"d":"67,-158v22,-48,132,-52,116,29r-25,129r-32,0r25,-140v3,-38,-53,-32,-70,-12v-29,35,-30,100,-43,152r-32,0r36,-190r30,0"},"o":{"d":"30,-147v31,-64,166,-65,159,27v-6,71,-31,121,-103,124v-77,4,-85,-92,-56,-151xm88,-20v53,0,68,-48,68,-100v0,-31,-11,-51,-44,-50v-52,1,-68,46,-68,97v0,32,13,53,44,53"},"p":{"d":"67,-162v32,-53,139,-36,121,50v-13,61,-25,114,-91,116v-29,0,-45,-15,-55,-35v-4,37,-14,70,-20,106r-31,0r50,-265r29,0v-1,10,0,20,-3,28xm156,-126v0,-26,-10,-43,-35,-43v-54,0,-67,50,-69,103v-1,29,14,45,42,46v53,0,62,-58,62,-106"},"q":{"d":"133,-28v-30,54,-138,36,-120,-49v13,-62,24,-115,90,-117v29,-1,46,15,56,35v2,-12,6,-24,8,-34r31,0r-54,268r-31,0xm45,-64v-2,27,10,43,35,43v54,-1,69,-50,69,-103v0,-29,-15,-46,-42,-46v-53,-1,-58,58,-62,106"},"r":{"d":"66,-151v12,-25,30,-51,66,-40r-6,26v-81,-11,-68,100,-88,165r-32,0r36,-190r30,0","w":119,"k":{".":13,"-":7,",":20}},"s":{"d":"55,-144v13,50,104,24,104,88v0,77,-144,79,-158,17r26,-10v6,40,102,42,102,-4v-13,-50,-104,-23,-104,-87v0,-71,143,-71,148,-8r-29,4v-5,-35,-85,-37,-89,0","w":180},"t":{"d":"51,-54v-9,22,5,41,31,30r-3,23v-36,15,-69,-3,-60,-51r22,-115r-22,0r5,-23r22,0r19,-43r21,0r-9,43r35,0r-4,23r-35,0","w":100},"u":{"d":"67,3v-93,-2,-31,-127,-26,-193r32,0r-25,140v-3,39,53,32,70,12v30,-34,30,-101,43,-152r32,0r-36,190r-30,0v1,-10,6,-24,4,-33v-14,20,-29,37,-64,36"},"v":{"d":"89,0r-37,0r-32,-190r33,0r21,165r89,-165r34,0","w":180,"k":{".":27,",":27}},"w":{"d":"188,0r-37,0r-8,-164r-72,164r-37,0r-16,-190r31,0r8,164r75,-164r34,0r8,164r74,-164r31,0","w":259,"k":{".":20,",":20}},"x":{"d":"124,0r-37,-78r-66,78r-35,0r86,-98r-46,-92r33,0r34,74r61,-74r37,0r-83,92r50,98r-34,0","w":180},"y":{"d":"198,-190r-129,220v-16,28,-44,53,-89,42v4,-11,-1,-27,19,-22v33,-1,43,-29,59,-52r-38,-188r32,0r27,156r84,-156r35,0","w":180,"k":{".":27,",":27}},"z":{"d":"-8,0r5,-24r140,-142r-106,0r5,-24r145,0r-5,24r-140,142r119,0r-5,24r-158,0","w":180},"{":{"d":"54,8v-6,25,-1,50,32,44r-5,23v-77,11,-58,-72,-46,-129v0,-20,-11,-27,-31,-28r4,-22v93,-3,3,-173,138,-157r-4,23v-85,-8,-22,124,-103,145v41,9,23,65,15,101","w":120},"|":{"d":"37,80r0,-341r30,0r0,341r-30,0","w":93},"}":{"d":"65,-194v6,-26,0,-49,-32,-44r4,-23v79,-12,59,72,46,129v1,20,12,27,32,28r-5,22v-92,5,-4,173,-138,157r4,-23v86,9,21,-124,103,-145v-41,-8,-21,-66,-14,-101","w":120},"~":{"d":"199,-111v-49,42,-130,-35,-178,9r0,-25v53,-44,130,35,178,-10r0,26","w":210}}});
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Digitized data © 2007 Ascender Corporation. All rights reserved.
 * 
 * Trademark:
 * Liberation is a trademark of Red Hat, Inc. registered in U.S. Patent and
 * Trademark Office and certain other jurisdictions.
 * 
 * Manufacturer:
 * Ascender Corporation
 * 
 * Designer:
 * Steve Matteson
 * 
 * Vendor URL:
 * http://www.ascendercorp.com/
 * 
 * License information:
 * http://www.ascendercorp.com/liberation.html
 */
Cufon.registerFont({"w":200,"face":{"font-family":"Liberation Sans","font-weight":700,"font-style":"italic","font-stretch":"normal","units-per-em":"360","panose-1":"2 11 7 4 2 2 2 9 2 4","ascent":"288","descent":"-72","x-height":"4","bbox":"-39 -267 365 77.1055","underline-thickness":"37.793","underline-position":"-19.3359","slope":"-12","unicode-range":"U+0020-U+007E"},"glyphs":{" ":{"w":100,"k":{"Y":7,"A":13}},"\u00a0":{"w":100},"!":{"d":"74,-75r-40,0r28,-173r52,0xm14,0r9,-47r51,0r-9,47r-51,0","w":119},"\"":{"d":"152,-158r-39,0r13,-90r48,0xm77,-158r-39,0r13,-90r48,0","w":170},"#":{"d":"165,-152r-12,59r38,0r0,26r-44,0r-14,67r-27,0r14,-67r-54,0r-14,67r-27,0r14,-67r-28,0r0,-26r33,0r13,-59r-37,0r0,-26r42,0r15,-67r27,0r-15,67r54,0r15,-67r28,0r-15,67r29,0r0,26r-35,0xm84,-152r-12,59r54,0r12,-59r-54,0"},"$":{"d":"118,-147v83,-2,96,123,15,137v-12,3,-26,5,-42,6r-6,31r-20,0r6,-31v-41,-1,-69,-21,-73,-60r46,-8v2,20,12,32,34,31r13,-68v-33,-10,-66,-24,-66,-65v0,-52,42,-68,93,-71r4,-22r20,1r-5,22v38,0,63,18,66,53r-45,10v-4,-15,-10,-28,-28,-28xm97,-41v33,4,58,-26,38,-52v-5,-5,-14,-8,-25,-11xm111,-210v-32,-4,-55,40,-23,54v3,1,7,3,11,4"},"%":{"d":"20,-148v0,-55,21,-102,76,-102v34,0,55,18,54,54v-2,57,-24,104,-78,104v-35,0,-52,-21,-52,-56xm113,-199v0,-15,-4,-24,-17,-24v-35,0,-36,44,-39,78v-1,15,3,25,15,25v34,0,41,-48,41,-79xm179,-53v0,-54,21,-102,77,-102v34,0,56,18,54,54v-2,57,-24,104,-79,104v-33,0,-52,-22,-52,-56xm272,-104v0,-15,-3,-24,-16,-24v-35,1,-36,44,-39,77v-1,15,3,25,15,25v34,0,37,-46,40,-78xm85,0r-34,0r191,-248r35,0","w":320},"&":{"d":"152,-18v-39,36,-149,32,-143,-44v4,-49,39,-65,74,-81v-18,-56,8,-109,70,-106v34,2,59,13,59,45v0,48,-46,60,-83,76v9,21,16,43,31,59v17,-18,29,-41,41,-65r33,15v-12,28,-30,52,-49,73v11,11,33,14,52,9r-7,35v-28,9,-62,1,-78,-16xm92,-111v-44,5,-56,92,6,80v12,-2,21,-7,29,-13v-15,-19,-27,-43,-35,-67xm150,-219v-31,-2,-39,34,-29,61v22,-10,49,-14,51,-43v0,-12,-10,-18,-22,-18","w":259},"'":{"d":"73,-158r-38,0r13,-90r47,0","w":85},"(":{"d":"13,-52v0,-97,37,-163,91,-209r50,0v-53,52,-92,115,-92,212v0,48,8,90,25,124r-48,0v-17,-35,-26,-77,-26,-127","w":119},")":{"d":"109,-139v0,100,-38,166,-91,214r-50,0v54,-54,93,-119,93,-217v0,-46,-11,-87,-27,-119r47,0v17,31,28,75,28,122","w":119},"*":{"d":"101,-200r41,-18r12,35r-44,11r33,37r-32,21r-26,-44r-26,44r-33,-21r33,-37r-44,-11r12,-35r42,18r-3,-48r38,0","w":140},"+":{"d":"132,-100r0,72r-40,0r0,-72r-70,0r0,-39r70,0r0,-72r40,0r0,72r70,0r0,39r-70,0","w":210},",":{"d":"69,-54v-8,42,-15,86,-40,110r-33,0v15,-15,29,-33,35,-56r-23,0r10,-54r51,0","w":100},"-":{"d":"10,-72r8,-43r92,0r-9,43r-91,0","w":119},"\u00ad":{"d":"10,-72r8,-43r92,0r-9,43r-91,0","w":119},".":{"d":"8,0r10,-54r51,0r-10,54r-51,0","w":100},"\/":{"d":"-13,7r103,-268r42,0r-103,268r-42,0","w":100},"0":{"d":"15,-80v0,-86,24,-171,112,-171v50,0,70,31,70,82v0,85,-26,173,-113,173v-50,0,-69,-33,-69,-84xm149,-172v6,-42,-44,-55,-60,-23v-17,35,-34,101,-21,149v4,6,9,12,19,11v56,-6,53,-82,62,-137"},"1":{"d":"6,0r7,-41r62,0r31,-161r-67,37r8,-42r70,-41r48,0r-41,207r57,0r-8,41r-167,0","k":{"1":27}},"2":{"d":"121,-251v83,0,93,87,42,126v-35,27,-77,48,-103,84r115,0r-7,41r-174,0v12,-94,108,-103,147,-168v11,-20,3,-46,-24,-44v-23,2,-33,13,-39,32r-47,-10v12,-38,39,-61,90,-61"},"3":{"d":"131,-73v0,-31,-25,-35,-58,-33r8,-40v36,2,64,-5,65,-39v0,-17,-10,-28,-28,-27v-23,1,-35,12,-41,32r-47,-9v11,-39,39,-63,90,-62v44,1,76,17,76,60v0,42,-26,59,-63,64v28,5,48,20,48,54v0,95,-172,105,-178,13r49,-7v3,21,16,31,40,31v24,0,39,-13,39,-37"},"4":{"d":"154,-50r-10,50r-47,0r10,-50r-113,0r7,-37r126,-161r65,0r-31,161r33,0r-7,37r-33,0xm114,-87r27,-125v-29,45,-64,83,-95,125r68,0"},"5":{"d":"137,-85v4,-43,-51,-49,-69,-23r-48,0r36,-140r148,0r-7,41r-105,0r-15,59v40,-35,118,-7,110,57v10,93,-131,128,-176,58v-5,-8,-6,-16,-7,-25r49,-8v4,19,14,30,37,30v30,-1,44,-19,47,-49"},"6":{"d":"189,-94v-5,59,-36,98,-95,98v-53,0,-78,-35,-77,-90v1,-95,38,-177,138,-163v27,4,44,25,47,55r-47,7v-4,-34,-45,-30,-62,-5v-9,14,-17,34,-22,61v26,-45,125,-35,118,37xm108,-123v-49,-6,-61,88,-10,88v46,5,60,-88,10,-88"},"7":{"d":"33,-248r181,0r-7,40v-48,63,-107,114,-124,208r-52,0v18,-93,73,-148,126,-207r-132,0"},"8":{"d":"35,-185v2,-48,38,-66,89,-66v44,1,76,17,76,59v0,37,-25,55,-56,62v24,7,40,24,40,54v0,56,-41,80,-97,80v-50,0,-82,-20,-82,-67v0,-41,29,-59,63,-67v-20,-10,-33,-26,-33,-55xm84,-179v0,20,9,31,30,31v25,0,36,-17,36,-39v0,-19,-11,-31,-31,-30v-22,1,-36,13,-35,38xm134,-78v0,-21,-11,-34,-35,-34v-29,0,-42,18,-43,46v0,23,13,35,35,35v28,0,43,-19,43,-47"},"9":{"d":"57,-63v1,32,46,34,62,12v12,-16,20,-37,25,-64v-30,46,-125,30,-118,-42v6,-58,37,-94,96,-94v58,0,82,45,75,106v-10,86,-46,165,-141,145v-27,-6,-43,-26,-48,-55xm107,-125v29,0,44,-20,43,-52v0,-21,-11,-35,-31,-36v-46,-5,-63,88,-12,88"},":":{"d":"41,-132r10,-50r51,0r-10,50r-51,0xm16,0r9,-49r51,0r-10,49r-50,0","w":119},";":{"d":"41,-132r10,-50r51,0r-10,50r-51,0xm76,-49v-9,39,-14,83,-40,105r-32,0v15,-15,29,-32,34,-56r-22,0r9,-49r51,0","w":119},"\u037e":{"d":"41,-132r10,-50r51,0r-10,50r-51,0xm76,-49v-9,39,-14,83,-40,105r-32,0v15,-15,29,-32,34,-56r-22,0r9,-49r51,0","w":119},"<":{"d":"22,-91r0,-56r180,-69r0,40r-146,57r146,57r0,40","w":210},"=":{"d":"22,-148r0,-39r180,0r0,39r-180,0xm22,-51r0,-39r180,0r0,39r-180,0","w":210},">":{"d":"22,-22r0,-40r146,-57r-146,-57r0,-40r180,69r0,56","w":210},"?":{"d":"163,-185v-5,-40,-82,-31,-84,8r-47,-7v13,-42,43,-68,99,-67v46,1,82,17,82,62v0,69,-80,60,-96,114r-47,0v8,-55,68,-59,91,-98v1,-4,2,-7,2,-12xm54,0r9,-47r51,0r-9,47r-51,0","w":219},"@":{"d":"198,-261v86,0,138,44,138,128v0,63,-27,110,-85,115v-25,2,-35,-18,-33,-42v-12,21,-31,42,-62,42v-41,0,-58,-29,-58,-68v0,-60,30,-105,88,-108v25,-1,39,15,48,31r6,-27r28,0r-27,131v-1,11,5,16,14,17v38,-7,54,-45,54,-90v0,-68,-42,-104,-111,-104v-94,0,-143,58,-143,150v0,71,39,112,113,112v42,0,75,-12,103,-27r11,22v-32,17,-67,31,-116,31v-89,0,-140,-50,-140,-138v0,-107,63,-175,172,-175xm162,-43v43,-4,60,-45,60,-89v0,-23,-14,-38,-37,-38v-42,0,-58,41,-58,84v0,24,11,45,35,43","w":351},"A":{"d":"183,0r-10,-63r-94,0r-35,63r-51,0r138,-248r61,0r42,248r-51,0xm169,-102r-15,-108v-16,38,-36,73,-55,108r70,0","w":259,"k":{"Y":27,"W":20,"V":27,"T":27," ":13}},"B":{"d":"240,-76v-1,102,-136,71,-234,76r48,-248v79,4,193,-21,193,58v0,38,-25,53,-57,60v29,5,49,21,50,54xm195,-182v0,-40,-58,-24,-96,-27r-12,61v45,-3,108,12,108,-34xm188,-77v0,-44,-65,-31,-109,-33r-13,72v51,-3,122,14,122,-39","w":259},"C":{"d":"161,-211v-63,0,-91,46,-91,110v0,39,17,65,58,64v38,-1,60,-20,74,-45r40,20v-22,39,-58,62,-117,66v-116,9,-135,-148,-68,-212v33,-50,166,-62,196,-1v4,8,9,18,11,27r-48,12v-6,-24,-25,-41,-55,-41","w":259},"D":{"d":"250,-142v-3,89,-53,142,-142,142r-102,0r48,-248v105,-5,200,3,196,106xm201,-140v1,-57,-42,-72,-103,-68r-32,168v84,6,135,-22,135,-100","w":259},"E":{"d":"6,0r48,-248r195,0r-8,40r-143,0r-12,63r132,0r-7,40r-132,0r-13,65r150,0r-8,40r-202,0","w":240},"F":{"d":"98,-208r-15,77r118,0r-8,40r-117,0r-18,91r-52,0r48,-248r174,0r-8,40r-122,0","w":219,"k":{"A":20,".":40,",":40}},"G":{"d":"70,-104v-4,71,81,81,132,50r8,-40r-60,0r7,-37r108,0r-19,100v-30,21,-65,34,-116,34v-70,-1,-112,-35,-112,-105v-1,-106,79,-169,188,-144v33,8,53,31,63,63r-50,14v-6,-26,-25,-42,-56,-42v-62,0,-89,43,-93,107","w":280},"H":{"d":"168,0r21,-106r-110,0r-21,106r-52,0r48,-248r52,0r-19,99r110,0r19,-99r50,0r-48,248r-50,0","w":259},"I":{"d":"6,0r48,-248r52,0r-48,248r-52,0","w":100},"J":{"d":"51,-77v-1,38,59,57,67,15r29,-145r-49,0r7,-41r101,0r-34,174v3,81,-127,106,-159,37v-4,-9,-7,-19,-9,-30"},"K":{"d":"175,0r-63,-112r-37,21r-17,91r-52,0r48,-248r52,0r-23,113r134,-113r65,0r-132,109r82,139r-57,0","w":259},"L":{"d":"6,0r48,-248r52,0r-40,208r133,0r-8,40r-185,0","w":219,"k":{"Y":27,"W":20,"V":20,"T":27," ":7}},"M":{"d":"212,0r43,-212r-104,212r-37,0r-24,-212v-8,75,-25,142,-38,212r-46,0r48,-248r70,0r20,187r93,-187r69,0r-48,248r-46,0","w":299},"N":{"d":"155,0r-65,-199r-38,199r-46,0r48,-248r62,0r66,201r38,-201r46,0r-48,248r-63,0","w":259},"O":{"d":"18,-101v0,-91,52,-150,145,-150v68,0,111,34,111,101v0,96,-53,154,-146,154v-69,0,-110,-37,-110,-105xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96","w":280},"P":{"d":"241,-173v-1,82,-78,91,-166,86r-17,87r-52,0r48,-248v87,0,188,-12,187,75xm188,-171v0,-43,-48,-36,-90,-36r-15,80v50,0,105,7,105,-44","w":240,"k":{"A":27,".":46,",":46," ":13}},"Q":{"d":"23,-63v-24,-104,36,-188,140,-188v68,0,111,34,111,101v0,87,-44,137,-119,151v2,31,28,37,61,31r-8,34v-54,13,-105,-9,-105,-64v-40,-7,-72,-29,-80,-65xm220,-133v4,-46,-15,-77,-59,-77v-65,0,-88,46,-91,108v-2,41,22,65,60,65v60,0,84,-40,90,-96","w":280},"R":{"d":"258,-177v0,46,-32,67,-71,75r48,102r-57,0r-41,-94r-61,0r-18,94r-52,0r48,-248v89,2,204,-19,204,71xm205,-174v0,-46,-63,-30,-107,-33r-14,73v51,-2,120,13,121,-40","w":259,"k":{"Y":7,"W":7,"T":7}},"S":{"d":"178,-136v88,48,22,151,-73,140v-56,-7,-93,-19,-101,-68r51,-9v1,50,111,53,115,3v-16,-63,-132,-20,-133,-112v0,-93,190,-91,199,-10r-50,12v-4,-41,-93,-50,-97,-4v7,38,59,32,89,48","w":240},"T":{"d":"157,-208r-40,208r-52,0r40,-208r-80,0r8,-40r212,0r-8,40r-80,0","w":219,"k":{"y":13,"w":13,"u":7,"s":13,"r":7,"o":13,"i":7,"e":13,"c":13,"a":13,"O":7,"A":27,";":27,":":27,".":27,"-":20,",":27}},"U":{"d":"76,-105v-23,59,45,89,88,55v12,-10,18,-24,22,-45r30,-153r51,0v-29,105,-8,252,-149,252v-70,0,-107,-43,-93,-116r26,-136r52,0","w":259},"V":{"d":"130,0r-60,0r-40,-248r54,0r24,206v31,-72,69,-137,103,-206r54,0","w":240,"k":{"y":7,"u":7,"r":7,"o":13,"i":13,"e":13,"a":13,"A":27,";":13,":":13,".":33,"-":13,",":33}},"W":{"d":"253,0r-61,0r-6,-196v-25,68,-54,131,-82,196r-62,0r-16,-248r50,0r7,204r86,-204r55,0r8,204r82,-204r51,0","w":339,"k":{"y":7,"u":7,"r":7,"o":7,"i":3,"e":7,"a":7,"A":20,";":13,":":13,".":27,"-":13,",":27}},"X":{"d":"39,-248r54,0r39,83r71,-83r55,0r-105,119r64,129r-54,0r-44,-94r-80,94r-56,0r115,-129","w":240},"Y":{"d":"147,-102r-20,102r-51,0r19,-102r-65,-146r52,0r45,107r83,-107r57,0","w":240,"k":{"v":13,"u":13,"q":13,"p":13,"o":13,"i":13,"e":13,"a":13,"A":27,";":20,":":20,".":33,"-":27,",":33," ":7}},"Z":{"d":"190,0r-198,0r7,-37r163,-170r-117,0r8,-41r178,0r-7,36r-163,171r137,0","w":219},"[":{"d":"-9,75r65,-336r95,0r-7,34r-48,0r-52,268r48,0r-6,34r-95,0","w":119},"\\":{"d":"51,7r-31,-268r41,0r33,268r-43,0","w":100},"]":{"d":"-31,75r7,-34r49,0r52,-268r-49,0r6,-34r96,0r-65,336r-96,0","w":119},"^":{"d":"169,-90r-57,-133r-57,133r-40,0r69,-158r56,0r69,158r-40,0","w":210},"_":{"d":"-21,44r0,-14r207,0r0,14r-207,0"},"`":{"d":"105,-208r-54,-48r1,-8r46,0r34,51v-1,10,-18,3,-27,5","w":119},"a":{"d":"166,-52v-4,17,5,29,24,23r-3,27v-30,11,-74,1,-67,-34v-15,21,-29,40,-64,40v-33,0,-53,-19,-54,-53v0,-64,63,-67,128,-67v10,-22,3,-53,-29,-45v-13,3,-22,10,-25,24r-46,-5v5,-64,156,-77,153,0v-1,33,-11,60,-17,90xm97,-88v-44,-9,-64,57,-19,57v31,0,42,-28,47,-57r-28,0"},"b":{"d":"87,-160v15,-17,32,-34,63,-34v99,1,59,172,-1,192v-36,12,-78,0,-87,-29r-8,31r-48,0r52,-261r49,0xm158,-122v0,-24,-5,-37,-29,-37v-46,0,-55,46,-57,89v-1,25,12,40,35,40v44,0,51,-50,51,-92","w":219},"c":{"d":"67,-101v-8,29,-7,73,27,71v23,-2,32,-16,39,-37r48,9v-11,39,-40,62,-90,62v-55,0,-84,-32,-79,-90v6,-75,61,-124,140,-103v26,7,40,29,43,59r-50,4v-1,-20,-9,-34,-29,-34v-35,0,-41,29,-49,59"},"d":{"d":"132,-28v-14,19,-31,32,-63,32v-39,0,-59,-27,-59,-66v0,-70,24,-129,92,-132v31,-1,47,14,56,35r19,-102r49,0r-47,261r-49,0xm62,-69v0,22,7,39,29,39v45,-2,54,-45,57,-90v2,-27,-10,-40,-33,-40v-44,0,-53,48,-53,91","w":219},"e":{"d":"114,-194v63,-2,87,48,72,110r-123,0v-3,28,1,55,31,54v21,-1,32,-13,37,-29r44,13v-15,32,-38,50,-84,50v-50,0,-80,-26,-80,-77v0,-71,33,-119,103,-121xm144,-117v14,-47,-50,-61,-67,-22v-3,6,-6,13,-8,22r75,0"},"f":{"d":"93,-157r-31,157r-49,0r31,-157r-28,0r6,-33r28,0v2,-54,40,-81,100,-68r-6,32v-29,-8,-44,9,-45,36r38,0r-7,33r-37,0","w":119,"k":{"f":7}},"g":{"d":"45,-171v29,-32,103,-29,114,14v2,-11,5,-23,8,-33r47,0r-38,188v-3,70,-92,96,-155,64v-12,-6,-20,-20,-22,-37r50,-5v2,28,48,27,63,11v13,-13,20,-45,21,-66v-13,20,-30,35,-62,36v-87,3,-60,-134,-26,-172xm94,-35v41,-3,55,-43,55,-86v0,-24,-12,-39,-35,-39v-43,0,-51,48,-51,90v0,22,9,37,31,35","w":219},"h":{"d":"150,-105v8,-23,8,-54,-22,-51v-68,7,-54,98,-72,156r-50,0r50,-261r50,0r-21,103v15,-20,33,-36,66,-36v95,0,34,128,28,194r-49,0","w":219},"i":{"d":"50,-224r7,-37r49,0r-7,37r-49,0xm6,0r37,-190r49,0r-37,190r-49,0","w":100},"j":{"d":"50,-224r7,-37r49,0r-7,37r-49,0xm51,22v-6,42,-44,63,-90,49r7,-33v23,5,33,-8,36,-27r39,-201r49,0","w":100},"k":{"d":"128,0r-33,-87r-25,13r-15,74r-49,0r51,-261r49,0r-29,150r82,-79r56,0r-83,74r48,116r-52,0"},"l":{"d":"6,0r51,-261r49,0r-51,261r-49,0","w":100},"m":{"d":"255,-194v90,0,29,129,24,194r-49,0r25,-136v-7,-39,-53,-14,-60,9v-12,38,-18,85,-28,127r-49,0r25,-136v2,-29,-39,-23,-50,-7v-24,35,-25,96,-37,143r-50,0r36,-190r48,0v-1,10,-6,24,-4,32v12,-20,27,-36,57,-36v30,0,46,15,50,41v14,-21,29,-41,62,-41","w":320},"n":{"d":"151,-194v95,0,34,128,28,194r-49,0r25,-134v0,-29,-45,-25,-59,-9v-29,32,-27,95,-40,143r-50,0r36,-190r47,0r-4,32v15,-20,33,-36,66,-36","w":219},"o":{"d":"124,-194v51,0,84,22,84,74v-1,76,-41,124,-114,124v-51,0,-83,-27,-83,-78v0,-74,41,-120,113,-120xm99,-30v46,0,58,-42,58,-86v0,-27,-11,-44,-37,-44v-44,0,-55,40,-57,84v-1,27,10,45,36,46","w":219},"p":{"d":"156,-122v2,-23,-7,-37,-28,-37v-47,0,-58,44,-58,89v0,24,12,40,36,40v43,0,47,-49,50,-92xm-8,75r50,-265r48,0v0,10,-3,24,-3,30v22,-50,127,-45,121,29v-6,73,-21,135,-92,135v-29,0,-46,-14,-55,-35r-20,106r-49,0","w":219},"q":{"d":"102,-194v32,-2,46,14,56,35v2,-10,4,-23,8,-31r48,0r-53,265r-49,0r21,-104v-14,20,-32,33,-64,33v-38,0,-59,-26,-59,-65v0,-70,24,-129,92,-133xm63,-82v-3,28,2,52,28,52v46,-1,55,-45,57,-90v1,-24,-7,-40,-30,-40v-43,0,-50,40,-55,78","w":219},"r":{"d":"84,-151v13,-25,34,-51,72,-40r-8,41v-81,-20,-77,86,-92,150r-50,0r36,-190r47,0","w":140,"k":{".":20,",":20}},"s":{"d":"144,-137v-1,-29,-70,-35,-71,-2v16,41,103,10,103,80v0,68,-97,75,-144,50v-14,-8,-23,-22,-28,-39r44,-6v3,32,80,36,82,1v-15,-42,-103,-11,-103,-82v0,-77,157,-79,161,-8"},"t":{"d":"72,-63v-8,23,5,39,32,30r-6,32v-44,15,-86,-5,-75,-63r18,-93r-26,0r7,-33r28,0r24,-45r31,0r-8,45r35,0r-6,33r-36,0","w":119},"u":{"d":"69,3v-96,0,-34,-126,-28,-193r49,0r-25,133v6,42,62,18,71,-6v14,-38,17,-86,28,-127r50,0r-36,190r-47,0v0,-11,4,-26,3,-33v-14,20,-30,37,-65,36","w":219},"v":{"d":"109,0r-59,0r-31,-190r51,0r16,153r77,-153r54,0","k":{".":20,",":20}},"w":{"d":"212,0r-52,0r-8,-156r-70,156r-52,0r-13,-190r46,0r2,145r66,-145r53,0r8,145r60,-145r47,0","w":280,"k":{".":13,",":13}},"x":{"d":"127,0r-32,-67r-58,67r-53,0r89,-99r-49,-91r52,0r30,61r52,-61r54,0r-85,92r52,98r-52,0"},"y":{"d":"100,10v-23,37,-50,77,-115,62r7,-35v37,9,51,-18,65,-41r-37,-186r51,0r18,146r73,-146r53,0","k":{".":13,",":13}},"z":{"d":"-6,0r7,-35r114,-120r-84,0r7,-35r142,0r-7,35r-114,119r100,0r-7,36r-158,0","w":180},"{":{"d":"73,9v-6,25,6,36,34,32r-7,34v-48,4,-86,-7,-75,-57v7,-33,31,-97,-22,-94r7,-34v90,1,16,-151,121,-151r35,0r-7,34v-82,-9,-21,116,-102,134v42,8,25,65,16,102","w":140},"|":{"d":"34,75r0,-336r46,0r0,336r-46,0","w":100},"}":{"d":"65,-195v6,-24,-6,-36,-34,-32r7,-34v47,-5,85,7,75,57v-7,34,-31,95,22,94r-7,34v-97,1,-2,174,-155,151r6,-34v83,10,20,-118,103,-134v-43,-7,-26,-65,-17,-102","w":140},"~":{"d":"203,-105v-54,44,-135,-36,-182,10r0,-38v51,-45,135,36,182,-10r0,38","w":210}}});
/* ===================================================
 * bootstrap-transition.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $(target).collapse(option)
    })
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      clearTimeout(this.timeout)
      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(window.jQuery);/* ===========================================================
 * bootstrap-popover.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu'))  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/

!function(a){a(function(){"use strict",a.support.transition=function(){var a=function(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},c;for(c in b)if(a.style[c]!==undefined)return b[c]}();return a&&{end:a}}()})}(window.jQuery),!function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function f(){e.trigger("closed").remove()}var c=a(this),d=c.attr("data-target"),e;d||(d=c.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),e=a(d),b&&b.preventDefault(),e.length||(e=c.hasClass("alert")?c:c.parent()),e.trigger(b=a.Event("close"));if(b.isDefaultPrevented())return;e.removeClass("in"),a.support.transition&&e.hasClass("fade")?e.on(a.support.transition.end,f):f()},a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("alert");e||d.data("alert",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.alert.Constructor=c,a(function(){a("body").on("click.alert.data-api",b,c.prototype.close)})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.button.defaults,c)};b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.data(),e=c.is("input")?"val":"html";a+="Text",d.resetText||c.data("resetText",c[e]()),c[e](d[a]||this.options[a]),setTimeout(function(){a=="loadingText"?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.parent('[data-toggle="buttons-radio"]');a&&a.find(".active").removeClass("active"),this.$element.toggleClass("active")},a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("button"),f=typeof c=="object"&&c;e||d.data("button",e=new b(this,f)),c=="toggle"?e.toggle():c&&e.setState(c)})},a.fn.button.defaults={loadingText:"loading..."},a.fn.button.Constructor=b,a(function(){a("body").on("click.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle")})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=c,this.options.slide&&this.slide(this.options.slide),this.options.pause=="hover"&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.prototype={cycle:function(b){return b||(this.paused=!1),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},to:function(b){var c=this.$element.find(".active"),d=c.parent().children(),e=d.index(c),f=this;if(b>d.length-1||b<0)return;return this.sliding?this.$element.one("slid",function(){f.to(b)}):e==b?this.pause().cycle():this.slide(b>e?"next":"prev",a(d[b]))},pause:function(a){return a||(this.paused=!0),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(b,c){var d=this.$element.find(".active"),e=c||d[b](),f=this.interval,g=b=="next"?"left":"right",h=b=="next"?"first":"last",i=this,j=a.Event("slide");this.sliding=!0,f&&this.pause(),e=e.length?e:this.$element.find(".item")[h]();if(e.hasClass("active"))return;if(a.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(j);if(j.isDefaultPrevented())return;e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),this.$element.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid")},0)})}else{this.$element.trigger(j);if(j.isDefaultPrevented())return;d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return f&&this.cycle(),this}},a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("carousel"),f=a.extend({},a.fn.carousel.defaults,typeof c=="object"&&c);e||d.data("carousel",e=new b(this,f)),typeof c=="number"?e.to(c):typeof c=="string"||(c=f.slide)?e[c]():f.interval&&e.cycle()})},a.fn.carousel.defaults={interval:5e3,pause:"hover"},a.fn.carousel.Constructor=b,a(function(){a("body").on("click.carousel.data-api","[data-slide]",function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=!e.data("modal")&&a.extend({},e.data(),c.data());e.carousel(f),b.preventDefault()})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.collapse.defaults,c),this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.prototype={constructor:b,dimension:function(){var a=this.$element.hasClass("width");return a?"width":"height"},show:function(){var b,c,d,e;if(this.transitioning)return;b=this.dimension(),c=a.camelCase(["scroll",b].join("-")),d=this.$parent&&this.$parent.find("> .accordion-group > .in");if(d&&d.length){e=d.data("collapse");if(e&&e.transitioning)return;d.collapse("hide"),e||d.data("collapse",null)}this.$element[b](0),this.transition("addClass",a.Event("show"),"shown"),this.$element[b](this.$element[0][c])},hide:function(){var b;if(this.transitioning)return;b=this.dimension(),this.reset(this.$element[b]()),this.transition("removeClass",a.Event("hide"),"hidden"),this.$element[b](0)},reset:function(a){var b=this.dimension();return this.$element.removeClass("collapse")[b](a||"auto")[0].offsetWidth,this.$element[a!==null?"addClass":"removeClass"]("collapse"),this},transition:function(b,c,d){var e=this,f=function(){c.type=="show"&&e.reset(),e.transitioning=0,e.$element.trigger(d)};this.$element.trigger(c);if(c.isDefaultPrevented())return;this.transitioning=1,this.$element[b]("in"),a.support.transition&&this.$element.hasClass("collapse")?this.$element.one(a.support.transition.end,f):f()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("collapse"),f=typeof c=="object"&&c;e||d.data("collapse",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.collapse.defaults={toggle:!0},a.fn.collapse.Constructor=b,a(function(){a("body").on("click.collapse.data-api","[data-toggle=collapse]",function(b){var c=a(this),d,e=c.attr("data-target")||b.preventDefault()||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),f=a(e).data("collapse")?"toggle":c.data();a(e).collapse(f)})})}(window.jQuery),!function(a){function d(){a(b).parent().removeClass("open")}"use strict";var b='[data-toggle="dropdown"]',c=function(b){var c=a(b).on("click.dropdown.data-api",this.toggle);a("html").on("click.dropdown.data-api",function(){c.parent().removeClass("open")})};c.prototype={constructor:c,toggle:function(b){var c=a(this),e,f,g;if(c.is(".disabled, :disabled"))return;return f=c.attr("data-target"),f||(f=c.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,"")),e=a(f),e.length||(e=c.parent()),g=e.hasClass("open"),d(),g||e.toggleClass("open"),!1}},a.fn.dropdown=function(b){return this.each(function(){var d=a(this),e=d.data("dropdown");e||d.data("dropdown",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.dropdown.Constructor=c,a(function(){a("html").on("click.dropdown.data-api",d),a("body").on("click.dropdown",".dropdown form",function(a){a.stopPropagation()}).on("click.dropdown.data-api",b,c.prototype.toggle)})}(window.jQuery),!function(a){function c(){var b=this,c=setTimeout(function(){b.$element.off(a.support.transition.end),d.call(b)},500);this.$element.one(a.support.transition.end,function(){clearTimeout(c),d.call(b)})}function d(a){this.$element.hide().trigger("hidden"),e.call(this)}function e(b){var c=this,d=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var e=a.support.transition&&d;this.$backdrop=a('<div class="modal-backdrop '+d+'" />').appendTo(document.body),this.options.backdrop!="static"&&this.$backdrop.click(a.proxy(this.hide,this)),e&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),e?this.$backdrop.one(a.support.transition.end,b):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,a.proxy(f,this)):f.call(this)):b&&b()}function f(){this.$backdrop.remove(),this.$backdrop=null}function g(){var b=this;this.isShown&&this.options.keyboard?a(document).on("keyup.dismiss.modal",function(a){a.which==27&&b.hide()}):this.isShown||a(document).off("keyup.dismiss.modal")}"use strict";var b=function(b,c){this.options=c,this.$element=a(b).delegate('[data-dismiss="modal"]',"click.dismiss.modal",a.proxy(this.hide,this))};b.prototype={constructor:b,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var b=this,c=a.Event("show");this.$element.trigger(c);if(this.isShown||c.isDefaultPrevented())return;a("body").addClass("modal-open"),this.isShown=!0,g.call(this),e.call(this,function(){var c=a.support.transition&&b.$element.hasClass("fade");b.$element.parent().length||b.$element.appendTo(document.body),b.$element.show(),c&&b.$element[0].offsetWidth,b.$element.addClass("in"),c?b.$element.one(a.support.transition.end,function(){b.$element.trigger("shown")}):b.$element.trigger("shown")})},hide:function(b){b&&b.preventDefault();var e=this;b=a.Event("hide"),this.$element.trigger(b);if(!this.isShown||b.isDefaultPrevented())return;this.isShown=!1,a("body").removeClass("modal-open"),g.call(this),this.$element.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?c.call(this):d.call(this)}},a.fn.modal=function(c){return this.each(function(){var d=a(this),e=d.data("modal"),f=a.extend({},a.fn.modal.defaults,d.data(),typeof c=="object"&&c);e||d.data("modal",e=new b(this,f)),typeof c=="string"?e[c]():f.show&&e.show()})},a.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},a.fn.modal.Constructor=b,a(function(){a("body").on("click.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({},e.data(),c.data());b.preventDefault(),e.modal(f)})})}(window.jQuery),!function(a){"use strict";var b=function(a,b){this.init("tooltip",a,b)};b.prototype={constructor:b,init:function(b,c,d){var e,f;this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.enabled=!0,this.options.trigger!="manual"&&(e=this.options.trigger=="hover"?"mouseenter":"focus",f=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(e,this.options.selector,a.proxy(this.enter,this)),this.$element.on(f,this.options.selector,a.proxy(this.leave,this))),this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(b){return b=a.extend({},a.fn[this.type].defaults,b,this.$element.data()),b.delay&&typeof b.delay=="number"&&(b.delay={show:b.delay,hide:b.delay}),b},enter:function(b){var c=a(b.currentTarget)[this.type](this._options).data(this.type);if(!c.options.delay||!c.options.delay.show)return c.show();clearTimeout(this.timeout),c.hoverState="in",this.timeout=setTimeout(function(){c.hoverState=="in"&&c.show()},c.options.delay.show)},leave:function(b){var c=a(b.currentTarget)[this.type](this._options).data(this.type);if(!c.options.delay||!c.options.delay.hide)return c.hide();clearTimeout(this.timeout),c.hoverState="out",this.timeout=setTimeout(function(){c.hoverState=="out"&&c.hide()},c.options.delay.hide)},show:function(){var a,b,c,d,e,f,g;if(this.hasContent()&&this.enabled){a=this.tip(),this.setContent(),this.options.animation&&a.addClass("fade"),f=typeof this.options.placement=="function"?this.options.placement.call(this,a[0],this.$element[0]):this.options.placement,b=/in/.test(f),a.remove().css({top:0,left:0,display:"block"}).appendTo(b?this.$element:document.body),c=this.getPosition(b),d=a[0].offsetWidth,e=a[0].offsetHeight;switch(b?f.split(" ")[1]:f){case"bottom":g={top:c.top+c.height,left:c.left+c.width/2-d/2};break;case"top":g={top:c.top-e,left:c.left+c.width/2-d/2};break;case"left":g={top:c.top+c.height/2-e/2,left:c.left-d};break;case"right":g={top:c.top+c.height/2-e/2,left:c.left+c.width}}a.css(g).addClass(f).addClass("in")}},isHTML:function(a){return typeof a!="string"||a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3||/^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(a)},setContent:function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.isHTML(b)?"html":"text"](b),a.removeClass("fade in top bottom left right")},hide:function(){function d(){var b=setTimeout(function(){c.off(a.support.transition.end).remove()},500);c.one(a.support.transition.end,function(){clearTimeout(b),c.remove()})}var b=this,c=this.tip();c.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d():c.remove()},fixTitle:function(){var a=this.$element;(a.attr("title")||typeof a.attr("data-original-title")!="string")&&a.attr("data-original-title",a.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(b){return a.extend({},b?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||(typeof c.title=="function"?c.title.call(b[0]):c.title),a},tip:function(){return this.$tip=this.$tip||a(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}},a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("tooltip"),f=typeof c=="object"&&c;e||d.data("tooltip",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0}}(window.jQuery),!function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype,{constructor:b,setContent:function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.isHTML(b)?"html":"text"](b),a.find(".popover-content > *")[this.isHTML(c)?"html":"text"](c),a.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var a,b=this.$element,c=this.options;return a=b.attr("data-content")||(typeof c.content=="function"?c.content.call(b[0]):c.content),a},tip:function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip}}),a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("popover"),f=typeof c=="object"&&c;e||d.data("popover",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.defaults=a.extend({},a.fn.tooltip.defaults,{placement:"right",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery),!function(a){function b(b,c){var d=a.proxy(this.process,this),e=a(b).is("body")?a(window):a(b),f;this.options=a.extend({},a.fn.scrollspy.defaults,c),this.$scrollElement=e.on("scroll.scroll.data-api",d),this.selector=(this.options.target||(f=a(b).attr("href"))&&f.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=a("body"),this.refresh(),this.process()}"use strict",b.prototype={constructor:b,refresh:function(){var b=this,c;this.offsets=a([]),this.targets=a([]),c=this.$body.find(this.selector).map(function(){var b=a(this),c=b.data("target")||b.attr("href"),d=/^#\w/.test(c)&&a(c);return d&&c.length&&[[d.position().top,c]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},process:function(){var a=this.$scrollElement.scrollTop()+this.options.offset,b=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,c=b-this.$scrollElement.height(),d=this.offsets,e=this.targets,f=this.activeTarget,g;if(a>=c)return f!=(g=e.last()[0])&&this.activate(g);for(g=d.length;g--;)f!=e[g]&&a>=d[g]&&(!d[g+1]||a<=d[g+1])&&this.activate(e[g])},activate:function(b){var c,d;this.activeTarget=b,a(this.selector).parent(".active").removeClass("active"),d=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',c=a(d).parent("li").addClass("active"),c.parent(".dropdown-menu")&&(c=c.closest("li.dropdown").addClass("active")),c.trigger("activate")}},a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("scrollspy"),f=typeof c=="object"&&c;e||d.data("scrollspy",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.defaults={offset:10},a(function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(window.jQuery),!function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype={constructor:b,show:function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.attr("data-target"),e,f,g;d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,""));if(b.parent("li").hasClass("active"))return;e=c.find(".active a").last()[0],g=a.Event("show",{relatedTarget:e}),b.trigger(g);if(g.isDefaultPrevented())return;f=a(d),this.activate(b.parent("li"),c),this.activate(f,f.parent(),function(){b.trigger({type:"shown",relatedTarget:e})})},activate:function(b,c,d){function g(){e.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),f?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var e=c.find("> .active"),f=d&&a.support.transition&&e.hasClass("fade");f?e.one(a.support.transition.end,g):g(),e.removeClass("in")}},a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("tab");e||d.data("tab",e=new b(this)),typeof c=="string"&&e[c]()})},a.fn.tab.Constructor=b,a(function(){a("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.typeahead.defaults,c),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.$menu=a(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};b.prototype={constructor:b,select:function(){var a=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(a)).change(),this.hide()},updater:function(a){return a},show:function(){var b=a.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:b.top+b.height,left:b.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(b){var c=this,d,e;return this.query=this.$element.val(),this.query?(d=a.grep(this.source,function(a){return c.matcher(a)}),d=this.sorter(d),d.length?this.render(d.slice(0,this.options.items)).show():this.shown?this.hide():this):this.shown?this.hide():this},matcher:function(a){return~a.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(a){var b=[],c=[],d=[],e;while(e=a.shift())e.toLowerCase().indexOf(this.query.toLowerCase())?~e.indexOf(this.query)?c.push(e):d.push(e):b.push(e);return b.concat(c,d)},highlighter:function(a){var b=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return a.replace(new RegExp("("+b+")","ig"),function(a,b){return"<strong>"+b+"</strong>"})},render:function(b){var c=this;return b=a(b).map(function(b,d){return b=a(c.options.item).attr("data-value",d),b.find("a").html(c.highlighter(d)),b[0]}),b.first().addClass("active"),this.$menu.html(b),this},next:function(b){var c=this.$menu.find(".active").removeClass("active"),d=c.next();d.length||(d=a(this.$menu.find("li")[0])),d.addClass("active")},prev:function(a){var b=this.$menu.find(".active").removeClass("active"),c=b.prev();c.length||(c=this.$menu.find("li").last()),c.addClass("active")},listen:function(){this.$element.on("blur",a.proxy(this.blur,this)).on("keypress",a.proxy(this.keypress,this)).on("keyup",a.proxy(this.keyup,this)),(a.browser.webkit||a.browser.msie)&&this.$element.on("keydown",a.proxy(this.keypress,this)),this.$menu.on("click",a.proxy(this.click,this)).on("mouseenter","li",a.proxy(this.mouseenter,this))},keyup:function(a){switch(a.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}a.stopPropagation(),a.preventDefault()},keypress:function(a){if(!this.shown)return;switch(a.keyCode){case 9:case 13:case 27:a.preventDefault();break;case 38:if(a.type!="keydown")break;a.preventDefault(),this.prev();break;case 40:if(a.type!="keydown")break;a.preventDefault(),this.next()}a.stopPropagation()},blur:function(a){var b=this;setTimeout(function(){b.hide()},150)},click:function(a){a.stopPropagation(),a.preventDefault(),this.select()},mouseenter:function(b){this.$menu.find(".active").removeClass("active"),a(b.currentTarget).addClass("active")}},a.fn.typeahead=function(c){return this.each(function(){var d=a(this),e=d.data("typeahead"),f=typeof c=="object"&&c;e||d.data("typeahead",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>'},a.fn.typeahead.Constructor=b,a(function(){a("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(b){var c=a(this);if(c.data("typeahead"))return;b.preventDefault(),c.typeahead(c.data())})})}(window.jQuery);
/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09
 */

var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());
/*
 * --------------------------------------------------------------------
 * Simple Scroller
 * by Siddharth S, www.ssiddharth.com, hello@ssiddharth.com
 * Version: 1.0, 05.10.2009 	
 * --------------------------------------------------------------------
 */


$(document).ready(function() 
{	 
	var index = 0;
	var images = $("#gallery img");
	var thumbs = $("#thumbs img");
	var imgHeight = ($(thumbs).attr("height") != undefined) ? $(thumbs).attr("height") : 100;
	$(thumbs).slice(0,3).clone().appendTo("#thumbs");
	for (i=0; i<thumbs.length; i++)
	{
		$(thumbs[i]).addClass("thumb-"+i);
		$(images[i]).addClass("image-"+i);
	}
	
	$("#next").click(sift);
	show(index);
	setInterval(sift, 8000);
	
	function sift()
	{
		if (index<(thumbs.length-1)){index+=1 ; }
		else {index=0}
		show (index);
	}
	
	function show(num)
	{
		$(images).fadeOut(400);
		$(".image-"+num).stop().fadeIn(400);
		var scrollPos = (num+1)*imgHeight;
		$("#thumbs").stop().animate({scrollTop: scrollPos}, 400);		
		console.log(scrollPos, "img.image-"+num);
	}
});
$(function() {

	/**
	 * the menu
	 */
	var $menu = $('#ldd_menu');

	/**
	 * for each list element,
	 * we show the submenu when hovering and
	 * expand the span element (title) to 510px
	 */
	$menu.children('li').each(function(){
		var $this = $(this);
		var $span = $this.children('span');
		$span.data('width',$span.width());

		$this.bind('mouseenter',function(){
			$menu.find('.ldd_submenu').stop(true,true).hide();
			$this.find('.ldd_submenu').slideDown(300);
			/*
			$span.stop().animate({'width':'510px'},300,function(){
				$this.find('.ldd_submenu').slideDown(300);
			});
			*/
		}).bind('mouseleave',function(){
			$this.find('.ldd_submenu').stop(true,true).hide();
			/*$span.stop().animate({'width':$span.data('width')+'px'},300);*/
		});
	});


	/**
	* the Search box
	*/
	var $ui 		= $('#searchBox');

	/**
	* on focus and on click display the dropdown,
	* and change the arrow image
	*/
	$ui.find('.sb_input').bind('focus click',function(){
		$ui.find('.icon-arrow-down')
		   .addClass('icon-arrow-up')
		   .removeClass('icon-arrow-down')
		   .andSelf()
		   .find('.sb_dropdown')
		   .show();
	});

	/**
	* on mouse leave hide the dropdown,
	* and change the arrow image
	*/
	$ui.bind('mouseleave',function(){
		$ui.find('.icon-arrow-up')
		   .addClass('icon-arrow-down')
		   .removeClass('icon-arrow-up')
		   .andSelf()
		   .find('.sb_dropdown')
		   .hide();
	});

	/**
	* selecting all checkboxes
	*/
	$ui.find('.sb_dropdown').find('label[for="all"]').prev().bind('click',function(){
		$(this).parent().siblings().find(':checkbox').attr('checked',this.checked).attr('disabled',this.checked);
	});
});
$(function() {
//window width and height
var window_w 					= $(window).width();
var window_h 					= $(window).height();
//the main panel div
var $pc_panel = $('#pc_panel');
//the wrapper and the content divs
var $pc_wrapper					= $('#pc_wrapper');
var $pc_content					= $('#pc_content');
//the slider / slider div
var $pc_slider					= $('#pc_slider');
//the element reference - reaching this element
//activates the panel
var $pc_reference 				= $('#pc_reference');

var maxWidth,maxHeight,marginL;

buildPanel();

function buildPanel(){
	$pc_panel.css({'height': window_h + 'px'});
	hidePanel();
	//we want to display the items in a grid.
	//we need to calculate how much width and height
	//the wrapper should have.
	//we also want to display it centered, so we need to calculate
	//the margin left of the wrapper

	//First, lets see how much of height:
	//maxHeight = Math.floor((window_h-20)/135)*135;
	//20 => pc_titles height
	//135 => 125 of each items height plus its margin (10)
	maxHeight 		= Math.floor((window_h-20)/135)*135;
	//maxWidth = Math.floor((window_w-35)/220)*220;
	//220 = item width + margins (left and right)
	maxWidth 		= Math.floor((window_w-35)/220)*220;
	marginL  		= (window_w - maxWidth)/2;
	$pc_wrapper.css({
		'width' 		: maxWidth + 20 + 'px',
		'height'		: maxHeight +'px',
		'margin-left' 	: marginL + 'px'
	});

	//innitialize the slider
	try{
		$pc_slider.slider('destroy');
	}catch(e){}
	//total_scroll is the number of how much we can scroll
	var total_scroll = $pc_content.height()-maxHeight;
	//add a slider to scroll the content div
	//hidden until the panel is expanded
	if(total_scroll > 0){
		$pc_slider.slider({
			orientation	: 'vertical',
			max			: total_scroll,
			min			: 0,
			value		: total_scroll,
			slide		: function(event, ui) {
				$pc_wrapper.scrollTop(Math.abs(ui.value-total_scroll));
			}
		}).css({
			'height'	: maxHeight -40 + 'px',//40 extra
			'left'		: maxWidth + 20 + marginL + 'px',
			'top'		: 30 + 20 + 'px',
			//30 = 20 of title + 10 margin, 20 extra
			'display'	: 'none'
		});
	}
}

//the panel gets positioned out of the viewport,
//and ready to be slided out!
function hidePanel(){
	//165 => 20 pc_title + 120 item + margins
	$pc_panel.css({
		'right'	: -window_w + 'px',
		'top'	: window_h - 165 + 'px'
	}).show();
	try{
		//position the slider in the beginning
		slideTop();
	}catch(e){}
	$pc_slider.hide();
	$pc_panel.find('.collapse')
	.addClass('expand')
	.removeClass('collapse');
}

//resets the slider by sliding it to the top
function slideTop(){
	var total_scroll 	= $pc_content.height()-maxHeight;
	$pc_wrapper.scrollTop(0);
	$pc_slider.slider('option', 'value', total_scroll );
}

$(window).bind('scroll',function(){
	/*
	When we reach the element pc_reference, we want to show the panel.
	Let's get the distance from the top to the element
	 */
	var distanceTop = $pc_reference.offset().top - window_h;
	if($(window).scrollTop() > distanceTop){
		if(parseInt($pc_panel.css('right'),10) == -window_w)
			$pc_panel.stop().animate({'right':'0px'},300);
	}
	else{
		if(parseInt($pc_panel.css('right'),10) == 0)
			$pc_panel.stop().animate({'right': -window_w + 'px'},300,function(){
				hidePanel();
			});
	}
}).bind('resize',function(){
	//on resize calculate the windows dimentions again,
	//and build the panel accordingly
	window_w 			= $(window).width();
	window_h 			= $(window).height();
	buildPanel();
});

//when clicking on the expand button,
//we animate the panel to the size of the window,
//reset the slider and show it
$pc_panel.find('.expand').bind('click',function(){
	var $this = $(this);
	$pc_wrapper.hide();
	$pc_panel.stop().animate({'top':'0px'},500,function(){
		$pc_wrapper.show();
		slideTop();
		$pc_slider.show();
		$this.addClass('collapse').removeClass('expand');
	});
})

//clicking collapse will hide the slider,
//and minimize the panel
$pc_panel.find('.collapse').live('click',function(){
	var $this = $(this);
	$pc_wrapper.hide();
	$pc_slider.hide();
	$pc_panel.stop().animate({'top':window_h - 165 + 'px'},500,function(){
		$pc_wrapper.show();
		$this.addClass('expand').removeClass('collapse');
	});
});

//clicking close will make the panel disappear
$pc_panel.find('.close').bind('click',function(){
	$pc_panel.remove();
	$(window).unbind('scroll').unbind('resize');
});

//mouse over the items add class "selected"
$pc_wrapper.find('.pc_item').hover(
function(){
	$(this).addClass('selected');
},
function(){
	$(this).removeClass('selected');
}
).bind('click',function(){
	window.open($(this).find('.pc_more').html());
});
});
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery)
;
/**
 * SlideDeck 1.3.0 Lite - 2011-10-14
 * Copyright (c) 2011 digital-telepathy (http://www.dtelepathy.com)
 * 
 * Support the developers by purchasing the Pro version at http://www.slidedeck.com/download
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * 
 * More information on this project:
 * http://www.slidedeck.com/
 * 
 * Requires: jQuery v1.3+
 * 
 * Full Usage Documentation: http://www.slidedeck.com/usage-documentation 
 * Usage:
 *     $(el).slidedeck(opts);
 * 
 * @param {HTMLObject} el    The <DL> element to extend as a SlideDeck
 * @param {Object} opts      An object to pass custom override options to
 */


var SlideDeck;
var SlideDeckSkin = {};

(function($){
    window.SlideDeck = function(el,opts){
        var self = this,
            el = $(el);
        
        var VERSION = "1.3.0";
        
        this.options = {
            speed: 500,
            transition: 'swing',
            start: 1,
            activeCorner: true,
            index: true,
            scroll: true,
            keys: true,
            autoPlay: false,
            autoPlayInterval: 5000,
            hideSpines: false,
            cycle: false,
            slideTransition: 'slide'
        };
        
        this.classes = {
            slide: 'slide',
            spine: 'spine',
            label: 'label',
            index: 'index',
            active: 'active',
            indicator: 'indicator',
            activeCorner: 'activeCorner',
            disabled: 'disabled',
            vertical: 'slidesVertical',
            previous: 'previous',
            next: 'next'
        };
        
        this.current = 1;
        this.deck = el;
        this.former = -1;
        this.spines = el.children('dt');
        this.slides = el.children('dd');
        this.controlTo = 1;
        this.session = [];
        this.disabledSlides = [];
        this.pauseAutoPlay = false;
        this.isLoaded = false;
        
        var UA = navigator.userAgent.toLowerCase();
        this.browser = {
	        chrome: UA.match(/chrome/) ? true : false,
	        firefox: UA.match(/firefox/) ? true : false,
	        firefox2: UA.match(/firefox\/2/) ? true : false,
	        firefox30: UA.match(/firefox\/3\.0/) ? true : false,
	        msie: UA.match(/msie/) ? true : false,
	        msie6: (UA.match(/msie 6/) && !UA.match(/msie 7|8/)) ? true : false,
	        msie7: UA.match(/msie 7/) ? true : false,
	        msie8: UA.match(/msie 8/) ? true : false,
	        msie9: UA.match(/msie 9/) ? true : false,
	        chromeFrame: (UA.match(/msie/) && UA.match(/chrome/)) ? true : false,
	        opera: UA.match(/opera/) ? true : false,
	        safari: (UA.match(/safari/) && !UA.match(/chrome/)) ? true : false
        };
        for(var b in this.browser){
            if(this.browser[b] === true){
                this.browser._this = b;
            }
        }
        if(this.browser.chrome === true && !this.browser.chromeFrame) {
            this.browser.version = UA.match(/chrome\/([0-9\.]+)/)[1];
        }
        if(this.browser.firefox === true) {
            this.browser.version = UA.match(/firefox\/([0-9\.]+)/)[1];
        }
        if(this.browser.msie === true) {
            this.browser.version = UA.match(/msie ([0-9\.]+)/)[1];
        }
        if(this.browser.opera === true) {
            this.browser.version = UA.match(/version\/([0-9\.]+)/)[1];
        }
        if(this.browser.safari === true) {
            this.browser.version = UA.match(/version\/([0-9\.]+)/)[1];
        }
        
        var width;
        var height;

        var spine_inner_width,
            spine_outer_width,
            slide_width,
            spine_half_width;
        
        // Used by some slide transitions to lockout progress while the SlideDeck animates looping around
        this.looping = false;
        
        // Get the CSS3 browser prefix
        var prefix = "";
        switch(self.browser._this){
            case "firefox":
            case "firefox3":
                prefix = "-moz-";
            break;
            
            case "chrome":
            case "safari":
                prefix = "-webkit-";
            break;
            
            case "opera":
                prefix = "-o-";
            break;
        }
        
        var FixIEAA = function(spine){
            if(self.browser.msie && !self.browser.msie9){
                var bgColor = spine.css('background-color');
                var sBgColor = bgColor;
                if(sBgColor == "transparent"){
                    bgColor = "#ffffff";
                } else {
                    if(sBgColor.match('#')){
                        // Hex, convert to RGB
                        if(sBgColor.length < 7){
                            var t = "#" + sBgColor.substr(1,1) + sBgColor.substr(1,1) + sBgColor.substr(2,1) + sBgColor.substr(2,1) + sBgColor.substr(3,1) + sBgColor.substr(3,1);
                            bgColor = t;
                        }
                    }
                }
                bgColor = bgColor.replace("#","");
                var cParts = {
                    r: bgColor.substr(0,2),
                    g: bgColor.substr(2,2),
                    b: bgColor.substr(4,2)
                };
                var bgRGB = "#";
                var hexVal = "01234567890ABCDEF";
                for(var k in cParts){
                    cParts[k] = Math.max(0,(parseInt(cParts[k],16) - 1));
                    cParts[k] = hexVal.charAt((cParts[k] - cParts[k]%16)/16) + hexVal.charAt(cParts[k]%16);
                    
                    bgRGB += cParts[k];
                }
                
                spine.find('.' + self.classes.index).css({
                    'filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1) chroma(color=' + bgRGB + ')',
                    backgroundColor: bgRGB
                });
            }
        };
        
        
        /**
         * Visual Attribution "Bug"
         * 
         * This is a visual "bug" that is placed in the lower right of the SlideDeck to give
         * visual recognition to SlideDeck and for us to see where any implementations that might
         * be worth placing in our community examples page reside. To help keep this plugin free 
         * we ask (although we cannot force) you to keep this visual "bug" on the page since it 
         * helps support the author.
         * 
         * If you would like to remove the visual "bug", we recommend you comment out the 
         * updateBug(); function and remove any references to the updateBug(); command.
         */
        var BUG = {
            id: "SlideDeck_Bug"+(Math.round(Math.random()*100000000)),
            styles: "position:absolute !important;height:"+13+"px !important;width:"+130+"px !important;display:block !important;margin:0 !important;overflow:hidden !important;visibility:visible !important;opacity:1 !important;padding:0 !important;z-index:20000 !important",
            width: 130,
            height: 13
        };        
        var updateBug = function(){
			/*
            if(!document.getElementById(BUG.id)){
                var bugLink = document.createElement('A');
                    bugLink.id = BUG.id;
                    bugLink.href = "http://www.slidedeck.com/?utm_source=LiteUser&utm_medium=Link&utm_campaign=SDbug";
                    bugLink.target = "_blank";
                var bugImg = document.createElement('IMG');
                    bugImg.src = (document.location.protocol == "https:" ? "https:" : "http:") + "//www.slidedeck.com/6885858486f31043e5839c735d99457f045affd0/" + VERSION + "/lite";
                    bugImg.alt = "Powered by SlideDeck&trade;";
                    bugImg.width = BUG.width;
                    bugImg.height = BUG.height;
                    bugImg.border = "0";
                bugLink.appendChild(bugImg);
                
                BUG.top = (el.offset().top + el.height() + 5);
                BUG.left = el.offset().left + el.width() - BUG.width;

                var s = document.createElement('STYLE');
                    s.type = "text/css";
                var sText = '#' + BUG.id + '{top:' + BUG.top + 'px;left:' + BUG.left + 'px;' + BUG.styles + '}' + '#' + BUG.id + ' img{top:0 !important;left:0 !important;' + BUG.styles + '}';
                if(s.styleSheet){
                    s.styleSheet.cssText = sText;
                } else {
                    s.appendChild(document.createTextNode(sText));
                }
                $('head').append(s);
                
                if(Math.random() < 0.5){
                    $(document.body).prepend(bugLink);
                } else {
                    $(document.body).append(bugLink);
                }

                $(window).resize(function(){
                    updateBug();
                });
            }
            BUG.top = (el.offset().top + el.height() + 5);
            BUG.left = el.offset().left + el.width() - BUG.width;

            $('#' + BUG.id).css({
                top: BUG.top + "px",
                left: BUG.left + "px"
            });
			*/
        };
        
        
        var autoPlay = function(){
            gotoNext = function(){
                if(self.pauseAutoPlay === false){
                    if(self.options.cycle === false && self.current == self.slides.length){
                        self.pauseAutoPlay = true;
                    } else {
                        self.next();
                    }
                }
            };
            
            setInterval(gotoNext,self.options.autoPlayInterval);
        };
        
        
        /**
         * Modify the positioning and z-indexing for slides upon build
         * 
         * @param string transition The slideTransition being used to determine how to build the slides
         * @param integer i The index of the slide to be modified
         */
        var buildSlideTransition = function(transition, i){
            var slideCSS = {
                display: 'block'
            };
            slideCSS[prefix + 'transform-origin'] = "50% 50%";
            slideCSS[prefix + 'transform'] = "";
            
            if(i < self.current) {
                var offset = i * spine_outer_width;
                if(self.options.hideSpines === true){
                    if(i == self.current - 1){
                        offset = 0;
                    } else {
                        offset = 0 - (self.options.start - i - 1) * el.width();
                    }
                }
            } else {
                var offset = i * spine_outer_width + slide_width;
                if(self.options.hideSpines === true){
                    offset = (i + 1 - self.options.start) * el.width();
                }
            }

            switch(transition){
                case "slide":
                default:
                    slideCSS.left = offset;
                    slideCSS.zIndex = 1;
                    // Other things to modify the slideCSS specifically for default transitions
                break;
            }
            
            self.slides.eq(i).css(prefix + 'transition', "").css(slideCSS);
            
            return offset;
        };
        
        
        var buildDeck = function(){
            if($.inArray(el.css('position'),['position','absolute','fixed'])){
                el.css('position', 'relative');
            }
            el.css('overflow', 'hidden');
            for(var i=0; i<self.slides.length; i++){
                var slide = $(self.slides[i]);
                if(self.spines.length > i){
                    var spine = $(self.spines[i]);
                }
                var sPad = {
                    top: parseInt(slide.css('padding-top'),10),
                    right: parseInt(slide.css('padding-right'),10),
                    bottom: parseInt(slide.css('padding-bottom'),10),
                    left: parseInt(slide.css('padding-left'),10)
                };
                var sBorder = {
                    top: parseInt(slide.css('border-top-width'),10),
                    right: parseInt(slide.css('border-right-width'),10),
                    bottom: parseInt(slide.css('border-bottom-width'),10),
                    left: parseInt(slide.css('border-left-width'),10)
                };
                for(var k in sBorder){
                    sBorder[k] = isNaN(sBorder[k]) ? 0 : sBorder[k];
                }
                if(i < self.current) {
                    if(i == self.current - 1){
                        if(self.options.hideSpines !== true){
                            spine.addClass(self.classes.active);
                        }
                        slide.addClass(self.classes.active);
                    }
                }
                
                self.slide_width = (slide_width - sPad.left - sPad.right - sBorder.left - sBorder.right);
                
                var slideCSS = {
                    position: 'absolute',
                    zIndex: 1,
                    height: (height - sPad.top - sPad.bottom - sBorder.top - sBorder.bottom) + "px",
                    width: self.slide_width + "px",
                    margin: 0,
                    paddingLeft: sPad.left + spine_outer_width + "px"
                };
                
                var offset = buildSlideTransition(self.options.slideTransition, i);
                
                slide.css(slideCSS).addClass(self.classes.slide).addClass(self.classes.slide + "_" + (i + 1));
                
                if (self.options.hideSpines !== true) {
                    var spinePad = {
                        top: parseInt(spine.css('padding-top'),10),
                        right: parseInt(spine.css('padding-right'),10),
                        bottom: parseInt(spine.css('padding-bottom'),10),
                        left: parseInt(spine.css('padding-left'),10)
                    };
                    for(var k in spinePad) {
                        if(spinePad[k] < 10 && (k == "left" || k == "right")){
                            spinePad[k] = 10;
                        }
                    }
                    var spinePadString = spinePad.top + "px " + spinePad.right + "px " + spinePad.bottom + "px " + spinePad.left + "px";
                    var spineStyles = {
                        position: 'absolute',
                        zIndex: 3,
                        display: 'block',
                        left: offset,
                        width: (height - spinePad.left - spinePad.right) + "px",
                        height: spine_inner_width + "px",
                        padding: spinePadString,
                        rotation: '270deg',
                        '-webkit-transform': 'rotate(270deg)',
                        '-webkit-transform-origin': spine_half_width + 'px 0px',
                        '-moz-transform': 'rotate(270deg)',
                        '-moz-transform-origin': spine_half_width + 'px 0px',
                        '-o-transform': 'rotate(270deg)',
                        '-o-transform-origin': spine_half_width + 'px 0px',
                        textAlign: 'right'
                    };
                    
                    if( !self.browser.msie9 ){
                        spineStyles.top = (self.browser.msie) ? 0 : (height - spine_half_width) + "px";
                        spineStyles.marginLeft = ((self.browser.msie) ? 0 : (0 - spine_half_width)) + "px";
	                    spineStyles.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';
                    }

                    spine.css( spineStyles ).addClass(self.classes.spine).addClass(self.classes.spine + "_" + (i + 1));
                    
                    if(self.browser.msie9){
                        spine[0].style.msTransform = 'rotate(270deg)';
                        spine[0].style.msTransformOrigin = Math.round(parseInt(el[0].style.height, 10) / 2) + 'px ' + Math.round(parseInt(el[0].style.height, 10) / 2) + 'px';
                    }
                    
                } else {
                    if(typeof(spine) != "undefined"){
                        spine.hide();
                    }
                }
                if(i == self.slides.length-1){
                    slide.addClass('last');
                    if(self.options.hideSpines !== true){
                        spine.addClass('last');
                    }
                }
                
                // Add slide active corners
                if(self.options.activeCorner === true && self.options.hideSpines === false){
                    var corner = document.createElement('DIV');
                        corner.className = self.classes.activeCorner + ' ' + (self.classes.spine + '_' + (i + 1));
                    
                    spine.after(corner);
                    spine.next('.' + self.classes.activeCorner).css({
                        position: 'absolute',
                        top: '25px',
                        left: offset + spine_outer_width + "px",
                        overflow: "hidden",
                        zIndex: "20000"
                    }).hide();
                    if(spine.hasClass(self.classes.active)){
                        spine.next('.' + self.classes.activeCorner).show();
                    }
                }
                
                if (self.options.hideSpines !== true) {
                    // Add spine indexes, will always be numerical if unlicensed
                    var index = document.createElement('DIV');
                        index.className = self.classes.index;
                        
                    if(self.options.index !== false){
                        var textNode;
                        if(typeof(self.options.index) != 'boolean'){
                            textNode = self.options.index[i%self.options.index.length];
                        } else {
                            textNode = "" + (i + 1);
                        }
                        index.appendChild(document.createTextNode(textNode));
                    }
                            
                    spine.append(index);
                    spine.find('.' + self.classes.index).css({
                        position: 'absolute',
                        zIndex: 2,
                        display: 'block',
                        width: spine_inner_width + "px",
                        height: spine_inner_width + "px",
                        textAlign: 'center',
                        bottom: ((self.browser.msie) ? 0 : (0 - spine_half_width)) + "px",
                        left: ((self.browser.msie) ? 5 : 20) + "px",
                        rotation: "90deg",
                        '-webkit-transform': 'rotate(90deg)',
                        '-webkit-transform-origin': spine_half_width + 'px 0px',
                        '-moz-transform': 'rotate(90deg)',
                        '-moz-transform-origin': spine_half_width + 'px 0px',
                        '-o-transform': 'rotate(90deg)',
                        '-o-transform-origin': spine_half_width + 'px 0px'
                    });
                    
                    if(self.browser.msie9){
                        spine.find('.' + self.classes.index)[0].style.msTransform = 'rotate(90deg)';
                    }

                    FixIEAA(spine);
                }
            }
            
            updateBug();
            
            if(self.options.hideSpines !== true){
                // Setup Click Interaction
                self.spines.bind('click', function(event){
                    event.preventDefault();
                    self.goTo(self.spines.index(this)+1);
                });
              }
            
            // Setup Keyboard Interaction
            if(self.options.keys !== false){
                $(document).bind('keydown', function(event){
                    if($(event.target).parents().index(self.deck) == -1){
                        if(event.keyCode == 39) {
                            self.pauseAutoPlay = true;
                            self.next();
                        } else if(event.keyCode == 37) {
                            self.pauseAutoPlay = true;
                            self.prev();
                        }
                    }
                });
            }
            
            // Setup Mouse Wheel Interaction
            if(typeof($.event.special.mousewheel) != "undefined"){
                el.bind("mousewheel", function(event){
                    if(self.options.scroll !== false){
                        var delta = event.detail ? event.detail : event.wheelDelta;
                        if(self.browser.msie || self.browser.safari || self.browser.chrome){
                            delta = 0 - delta;
                        }

                        var internal = false;
                        if($(event.originalTarget).parents(self.deck).length){
                            if($.inArray(event.originalTarget.nodeName.toLowerCase(),['input','select','option','textarea']) != -1){
                                internal = true;
                            }
                        }

                        if (internal !== true) {
                            if (delta > 0) {
                                switch (self.options.scroll) {
                                    case "stop":
                                        event.preventDefault();
                                        break;
                                    case true:
                                    default:
                                        if (self.current < self.slides.length || self.options.cycle == true) {
                                            event.preventDefault();
                                        }
                                    break;
                                }
                                self.pauseAutoPlay = true;
                                self.next();
                            }
                            else {
                                switch (self.options.scroll) {
                                    case "stop":
                                        event.preventDefault();
                                        break;
                                    case true:
                                    default:
                                        if (self.current != 1 || self.options.cycle == true) {
                                            event.preventDefault();
                                        }
                                    break;
                                }
                                self.pauseAutoPlay = true;
                                self.prev();
                            }
                        }
                    }    
                });
            }
            
            $(self.spines[self.current - 2]).addClass(self.classes.previous);
            $(self.spines[self.current]).addClass(self.classes.next);

            if(self.options.autoPlay === true){
                autoPlay();
            }
            self.isLoaded = true;
        };
        
        
        var getValidSlide = function(ind){
            ind = Math.min(self.slides.length,Math.max(1,ind));
            return ind;
        };


        var completeCallback = function(params){
            var afterFunctions = [];
            if(typeof(self.options.complete) == "function"){
                afterFunctions.push(function(){ self.options.complete(self); });
            }
            switch(typeof(params)){
                case "function":    // Only function passed
                    afterFunctions.push(function(){ params(self); });
                break;
                case "object":        // One of a pair of functions passed
                    afterFunctions.push(function(){ params.complete(self); });
                break;
            }
            
            var callbackFunction = function(){
                self.looping = false;
                
                for(var z=0; z<afterFunctions.length; z++){
                    afterFunctions[z]();
                }
            };
            
            return callbackFunction;
        };
        
        
        var transitions = {
            /**
             * Classic SlideDeck transition: Slide
             * 
             * This transition will take a stack or line of slides and move them all to the left or
             * the right keeping their order.
             */
            slide: function(ind, params, forward){
                for (var i = 0; i < self.slides.length; i++) {
                    var pos = 0;
                    if(self.options.hideSpines !== true){
                        var spine = $(self.spines[i]);
                    }
                    var slide = $(self.slides[i]);
                    if (i < self.current) {
                        if (i == (self.current - 1)) {
                            slide.addClass(self.classes.active);
                            if(self.options.hideSpines !== true){
                                spine.addClass(self.classes.active);
                                spine.next('.' + self.classes.activeCorner).show();
                            }
                        }
                        pos = i * spine_outer_width;
                    }
                    else {
                        pos = i * spine_outer_width + slide_width;
                    }
                    
                    if(self.options.hideSpines === true){
                        pos = (i - self.current + 1) * el.width();
                    }

                    var animOpts = {
                        duration: self.options.speed,
                        easing: self.options.transition
                    };

                    // Detect a function to run after animating
                    if(i == (forward === true && self.current - 1) || i == (forward === false && self.current)){
                        if(i === 0) {
                            animOpts.complete = completeCallback(params);
                        }
                    }

                    slide.stop().animate({
                        left: pos + "px",
                        width: self.slide_width + "px"
                    }, animOpts);
                    
                    if(self.options.hideSpines !== true){
                        FixIEAA(spine);
                        if(spine.css('left') != pos+"px"){
                            spine.stop().animate({
                                left: pos + "px"
                            },{
                                duration: self.options.speed,
                                easing: self.options.transition
                            });

                            spine.next('.' + self.classes.activeCorner).stop().animate({
                                left: pos + spine_outer_width + "px"
                            },{
                                duration: self.options.speed,
                                easing: self.options.transition
                            });
                        }
                    }
                }
            }
        };
        
        
        var slide = function(ind, params){
            ind = getValidSlide(ind);
            
            if ((ind <= self.controlTo || self.options.controlProgress !== true) && self.looping === false) {
                // Determine if we are moving forward in the SlideDeck or backward, 
                // this is used to determine when the callback should be run
                var forward = true;
                if(ind < self.current){
                    forward = false;
                }
                
                var classReset = [self.classes.active, self.classes.next, self.classes.previous].join(' ');
                
                self.former = self.current;
                self.current = ind;
                
                // Detect a function to run before animating
                if (typeof(self.options.before) == "function") {
                    self.options.before(self);
                }
                if (typeof(params) != "undefined") {
                    if (typeof(params.before) == "function") {
                        params.before(self);
                    }
                }
                
                self.spines.removeClass(classReset);
                self.slides.removeClass(classReset);
                el.find('.' + self.classes.activeCorner).hide();
                
                self.spines.eq(self.current - 2).addClass(self.classes.previous);
                self.spines.eq(self.current).addClass(self.classes.next);
                
                if(self.current != self.former){
                    var slideTransition = 'slide';
                    if(typeof(transitions[self.options.slideTransition]) != 'undefined'){
                        slideTransition = self.options.slideTransition;
                    }
                    
                    transitions[slideTransition](ind, params, forward);
                }
                
                updateBug();
            }
        };
        
        var setOption = function(opts, val){
            var newOpts = opts;
            
            if(typeof(opts) === "string"){
                newOpts = {};
                newOpts[opts] = val;
            }
            
            for(var key in newOpts){
                val = newOpts[key];
                
                switch(key){
                    case "speed":
                    case "start":
                        val = parseFloat(val);
                        if(isNaN(val)){
                            val = self.options[key];
                        }
                    break;                    
                    case "scroll":
                    case "keys":
                    case "activeCorner":
                    case "hideSpines":
                    case "autoPlay":
                    case "cycle":
                        if(typeof(val) !== "boolean"){
                            val = self.options[key];
                        }
                    break;                    
                    case "transition":
                        if(typeof(val) !== "string"){
                            val = self.options[key];
                        }
                    break;
                    case "complete":
                    case "before":
                        if(typeof(val) !== "function"){
                            val = self.options[key];
                        }
                    break;
                    case "index":
                        if(typeof(val) !== "boolean"){
                            if(!$.isArray(val)){
                                val = self.options[key];
                            }
                        }
                    break;                    
                }
                
                self.options[key] = val;
            }
        };
        
        
        var setupDimensions = function(){
            height = el.height();
            width = el.width();

            el.css('height', height + "px");
    
            spine_inner_width = 0;
            spine_outer_width = 0;
            
            if(self.options.hideSpines !== true && self.spines.length > 0){
                spine_inner_width = $(self.spines[0]).height();
                spine_outer_width = $(self.spines[0]).outerHeight();
            }
            
            slide_width = width - spine_outer_width*self.spines.length;
            if(self.options.hideSpines === true){
                slide_width = width;
            }
            
            spine_half_width = Math.ceil(spine_inner_width/2);
        };
        
        
        var initialize = function(opts){
            // Halt all processing for unsupported browsers
            if((self.browser.opera && self.browser.version < "10.5") || self.browser.msie6 || self.browser.firefox2 || self.browser.firefox30){
                if(typeof(console) != "undefined"){
                    if(typeof(console.error) == "function"){
                        console.error("This web browser is not supported by SlideDeck. Please view this page in a modern, CSS3 capable browser or a current version of Inernet Explorer");
                    }
                }
                return false;
            }
            
            if(typeof(opts) != "undefined"){
                for(var key in opts){
                    self.options[key] = opts[key];
                }
            }
            // Override hideSpines option if no spines are present in the DOM
            if(self.spines.length < 1){
                self.options.hideSpines = true;
            }
            // Turn off activeCorner if hideSpines is on
            if(self.options.hideSpines === true){
                self.options.activeCorner = false;
            }
            
            // Force self.options.slideTransition to "slide" as it is the only option for Lite
            self.options.slideTransition = 'slide';
            
            self.current = Math.min(self.slides.length,Math.max(1,self.options.start));
            
            if(el.height() > 0){
                setupDimensions();
                buildDeck();
            } else {
                var startupTimer;
                startupTimer = setTimeout(function(){
                    setupDimensions();
                    if(el.height() > 0){
                        clearInterval(startupTimer);
                        setupDimensions();
                        buildDeck();
                    }
                }, 20);
            }
        };
        
        
        var loaded = function(func){
            var thisTimer;
            thisTimer = setInterval(function(){
                if(self.isLoaded === true){
                    clearInterval(thisTimer);
                    func(self);
                }
            }, 20);
        };
        
        
        this.loaded = function(func){
            loaded(func);
                        
            return self;
        };
        
        this.next = function(params){
            var nextSlide = Math.min(self.slides.length,(self.current + 1));
            if(self.options.cycle === true){
                if(self.current + 1 > self.slides.length){
                    nextSlide = 1;
                }
            }
            slide(nextSlide,params);
            return self;
        };
        
        this.prev = function(params){
            var prevSlide = Math.max(1,(self.current - 1));
            if(self.options.cycle === true){
                if(self.current - 1 < 1){
                    prevSlide = self.slides.length;
                }
            }
            slide(prevSlide,params);
            return self;
        };
        
        this.goTo = function(ind,params){
            self.pauseAutoPlay = true;
            slide(Math.min(self.slides.length,Math.max(1,ind)),params);
            return self;
        };
        
        this.setOption = function(opts,val){
            setOption(opts,val);
            return self;
        };
        
        // Fallback for vertical function calls to prevent trigger of JavaScript error when run even with Lite library
        this.vertical = function(){
            return false;
        };
        
        initialize(opts);
    };
    
    $.fn.slidedeck = function(opts){
        var returnArr = [];
        for(var i=0; i<this.length; i++){
            if(!this[i].slidedeck){
                this[i].slidedeck = new SlideDeck(this[i],opts);
            }
            returnArr.push(this[i].slidedeck);
        }
        return returnArr.length > 1 ? returnArr : returnArr[0];
    };
})(jQuery);
var SlideDeck;var SlideDeckSkin={};(function(a){window.SlideDeck=function(b,c){var d=this,b=a(b);var e="1.3.0";this.options={speed:500,transition:"swing",start:1,activeCorner:true,index:true,scroll:true,keys:true,autoPlay:false,autoPlayInterval:5e3,hideSpines:false,cycle:false,slideTransition:"slide"};this.classes={slide:"slide",spine:"spine",label:"label",index:"index",active:"active",indicator:"indicator",activeCorner:"activeCorner",disabled:"disabled",vertical:"slidesVertical",previous:"previous",next:"next"};this.current=1;this.deck=b;this.former=-1;this.spines=b.children("dt");this.slides=b.children("dd");this.controlTo=1;this.session=[];this.disabledSlides=[];this.pauseAutoPlay=false;this.isLoaded=false;var f=navigator.userAgent.toLowerCase();this.browser={chrome:f.match(/chrome/)?true:false,firefox:f.match(/firefox/)?true:false,firefox2:f.match(/firefox\/2/)?true:false,firefox30:f.match(/firefox\/3\.0/)?true:false,msie:f.match(/msie/)?true:false,msie6:f.match(/msie 6/)&&!f.match(/msie 7|8/)?true:false,msie7:f.match(/msie 7/)?true:false,msie8:f.match(/msie 8/)?true:false,msie9:f.match(/msie 9/)?true:false,chromeFrame:f.match(/msie/)&&f.match(/chrome/)?true:false,opera:f.match(/opera/)?true:false,safari:f.match(/safari/)&&!f.match(/chrome/)?true:false};for(var g in this.browser){if(this.browser[g]===true){this.browser._this=g}}if(this.browser.chrome===true&&!this.browser.chromeFrame){this.browser.version=f.match(/chrome\/([0-9\.]+)/)[1]}if(this.browser.firefox===true){this.browser.version=f.match(/firefox\/([0-9\.]+)/)[1]}if(this.browser.msie===true){this.browser.version=f.match(/msie ([0-9\.]+)/)[1]}if(this.browser.opera===true){this.browser.version=f.match(/version\/([0-9\.]+)/)[1]}if(this.browser.safari===true){this.browser.version=f.match(/version\/([0-9\.]+)/)[1]}var h;var i;var j,k,l,m;this.looping=false;var n="";switch(d.browser._this){case"firefox":case"firefox3":n="-moz-";break;case"chrome":case"safari":n="-webkit-";break;case"opera":n="-o-";break}var o=function(a){if(d.browser.msie&&!d.browser.msie9){var b=a.css("background-color");var c=b;if(c=="transparent"){b="#ffffff"}else{if(c.match("#")){if(c.length<7){var e="#"+c.substr(1,1)+c.substr(1,1)+c.substr(2,1)+c.substr(2,1)+c.substr(3,1)+c.substr(3,1);b=e}}}b=b.replace("#","");var f={r:b.substr(0,2),g:b.substr(2,2),b:b.substr(4,2)};var g="#";var h="01234567890ABCDEF";for(var i in f){f[i]=Math.max(0,parseInt(f[i],16)-1);f[i]=h.charAt((f[i]-f[i]%16)/16)+h.charAt(f[i]%16);g+=f[i]}a.find("."+d.classes.index).css({filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=1) chroma(color="+g+")",backgroundColor:g})}};var p={id:"SlideDeck_Bug"+Math.round(Math.random()*1e8),styles:"position:absolute !important;height:"+13+"px !important;width:"+130+"px !important;display:block !important;margin:0 !important;overflow:hidden !important;visibility:visible !important;opacity:1 !important;padding:0 !important;z-index:900 !important",width:130,height:13};var q=function(){};var r=function(){gotoNext=function(){if(d.pauseAutoPlay===false){if(d.options.cycle===false&&d.current==d.slides.length){d.pauseAutoPlay=true}else{d.next()}}};setInterval(gotoNext,d.options.autoPlayInterval)};var s=function(a,c){var e={display:"block"};e[n+"transform-origin"]="50% 50%";e[n+"transform"]="";if(c<d.current){var f=c*k;if(d.options.hideSpines===true){if(c==d.current-1){f=0}else{f=0-(d.options.start-c-1)*b.width()}}}else{var f=c*k+l;if(d.options.hideSpines===true){f=(c+1-d.options.start)*b.width()}}switch(a){case"slide":default:e.left=f;e.zIndex=1;break}d.slides.eq(c).css(n+"transition","").css(e);return f};var t=function(){if(a.inArray(b.css("position"),["position","absolute","fixed"])){b.css("position","relative")}b.css("overflow","hidden");for(var c=0;c<d.slides.length;c++){var e=a(d.slides[c]);if(d.spines.length>c){var f=a(d.spines[c])}var g={top:parseInt(e.css("padding-top"),10),right:parseInt(e.css("padding-right"),10),bottom:parseInt(e.css("padding-bottom"),10),left:parseInt(e.css("padding-left"),10)};var h={top:parseInt(e.css("border-top-width"),10),right:parseInt(e.css("border-right-width"),10),bottom:parseInt(e.css("border-bottom-width"),10),left:parseInt(e.css("border-left-width"),10)};for(var n in h){h[n]=isNaN(h[n])?0:h[n]}if(c<d.current){if(c==d.current-1){if(d.options.hideSpines!==true){f.addClass(d.classes.active)}e.addClass(d.classes.active)}}d.slide_width=l-g.left-g.right-h.left-h.right;var p={position:"absolute",zIndex:1,height:i-g.top-g.bottom-h.top-h.bottom+"px",width:d.slide_width+"px",margin:0,paddingLeft:g.left+k+"px"};var t=s(d.options.slideTransition,c);e.css(p).addClass(d.classes.slide).addClass(d.classes.slide+"_"+(c+1));if(d.options.hideSpines!==true){var u={top:parseInt(f.css("padding-top"),10),right:parseInt(f.css("padding-right"),10),bottom:parseInt(f.css("padding-bottom"),10),left:parseInt(f.css("padding-left"),10)};for(var n in u){if(u[n]<10&&(n=="left"||n=="right")){u[n]=10}}var v=u.top+"px "+u.right+"px "+u.bottom+"px "+u.left+"px";var w={position:"absolute",zIndex:3,display:"block",left:t,width:i-u.left-u.right+"px",height:j+"px",padding:v,rotation:"270deg","-webkit-transform":"rotate(270deg)","-webkit-transform-origin":m+"px 0px","-moz-transform":"rotate(270deg)","-moz-transform-origin":m+"px 0px","-o-transform":"rotate(270deg)","-o-transform-origin":m+"px 0px",textAlign:"right"};if(!d.browser.msie9){w.top=d.browser.msie?0:i-m+"px";w.marginLeft=(d.browser.msie?0:0-m)+"px";w.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"}f.css(w).addClass(d.classes.spine).addClass(d.classes.spine+"_"+(c+1));if(d.browser.msie9){f[0].style.msTransform="rotate(270deg)";f[0].style.msTransformOrigin=Math.round(parseInt(b[0].style.height,10)/2)+"px "+Math.round(parseInt(b[0].style.height,10)/2)+"px"}}else{if(typeof f!="undefined"){f.hide()}}if(c==d.slides.length-1){e.addClass("last");if(d.options.hideSpines!==true){f.addClass("last")}}if(d.options.activeCorner===true&&d.options.hideSpines===false){var x=document.createElement("DIV");x.className=d.classes.activeCorner+" "+(d.classes.spine+"_"+(c+1));f.after(x);f.next("."+d.classes.activeCorner).css({position:"absolute",top:"25px",left:t+k+"px",overflow:"hidden",zIndex:"900"}).hide();if(f.hasClass(d.classes.active)){f.next("."+d.classes.activeCorner).show()}}if(d.options.hideSpines!==true){var y=document.createElement("DIV");y.className=d.classes.index;if(d.options.index!==false){var z;if(typeof d.options.index!="boolean"){z=d.options.index[c%d.options.index.length]}else{z=""+(c+1)}y.appendChild(document.createTextNode(z))}f.append(y);f.find("."+d.classes.index).css({position:"absolute",zIndex:2,display:"block",width:j+"px",height:j+"px",textAlign:"center",bottom:(d.browser.msie?0:0-m)+"px",left:(d.browser.msie?5:20)+"px",rotation:"90deg","-webkit-transform":"rotate(90deg)","-webkit-transform-origin":m+"px 0px","-moz-transform":"rotate(90deg)","-moz-transform-origin":m+"px 0px","-o-transform":"rotate(90deg)","-o-transform-origin":m+"px 0px"});if(d.browser.msie9){f.find("."+d.classes.index)[0].style.msTransform="rotate(90deg)"}o(f)}}q();if(d.options.hideSpines!==true){d.spines.bind("click",function(a){a.preventDefault();d.goTo(d.spines.index(this)+1)})}if(d.options.keys!==false){a(document).bind("keydown",function(b){if(a(b.target).parents().index(d.deck)==-1){if(b.keyCode==39){d.pauseAutoPlay=true;d.next()}else if(b.keyCode==37){d.pauseAutoPlay=true;d.prev()}}})}if(typeof a.event.special.mousewheel!="undefined"){b.bind("mousewheel",function(b){if(d.options.scroll!==false){var c=b.detail?b.detail:b.wheelDelta;if(d.browser.msie||d.browser.safari||d.browser.chrome){c=0-c}var e=false;if(a(b.originalTarget).parents(d.deck).length){if(a.inArray(b.originalTarget.nodeName.toLowerCase(),["input","select","option","textarea"])!=-1){e=true}}if(e!==true){if(c>0){switch(d.options.scroll){case"stop":b.preventDefault();break;case true:default:if(d.current<d.slides.length||d.options.cycle==true){b.preventDefault()}break}d.pauseAutoPlay=true;d.next()}else{switch(d.options.scroll){case"stop":b.preventDefault();break;case true:default:if(d.current!=1||d.options.cycle==true){b.preventDefault()}break}d.pauseAutoPlay=true;d.prev()}}}})}a(d.spines[d.current-2]).addClass(d.classes.previous);a(d.spines[d.current]).addClass(d.classes.next);if(d.options.autoPlay===true){r()}d.isLoaded=true};var u=function(a){a=Math.min(d.slides.length,Math.max(1,a));return a};var v=function(a){var b=[];if(typeof d.options.complete=="function"){b.push(function(){d.options.complete(d)})}switch(typeof a){case"function":b.push(function(){a(d)});break;case"object":b.push(function(){a.complete(d)});break}var c=function(){d.looping=false;for(var a=0;a<b.length;a++){b[a]()}};return c};var w={slide:function(c,e,f){for(var g=0;g<d.slides.length;g++){var h=0;if(d.options.hideSpines!==true){var i=a(d.spines[g])}var j=a(d.slides[g]);if(g<d.current){if(g==d.current-1){j.addClass(d.classes.active);if(d.options.hideSpines!==true){i.addClass(d.classes.active);i.next("."+d.classes.activeCorner).show()}}h=g*k}else{h=g*k+l}if(d.options.hideSpines===true){h=(g-d.current+1)*b.width()}var m={duration:d.options.speed,easing:d.options.transition};if(g==(f===true&&d.current-1)||g==(f===false&&d.current)){if(g===0){m.complete=v(e)}}j.stop().animate({left:h+"px",width:d.slide_width+"px"},m);if(d.options.hideSpines!==true){o(i);if(i.css("left")!=h+"px"){i.stop().animate({left:h+"px"},{duration:d.options.speed,easing:d.options.transition});i.next("."+d.classes.activeCorner).stop().animate({left:h+k+"px"},{duration:d.options.speed,easing:d.options.transition})}}}}};var x=function(a,c){a=u(a);if((a<=d.controlTo||d.options.controlProgress!==true)&&d.looping===false){var e=true;if(a<d.current){e=false}var f=[d.classes.active,d.classes.next,d.classes.previous].join(" ");d.former=d.current;d.current=a;if(typeof d.options.before=="function"){d.options.before(d)}if(typeof c!="undefined"){if(typeof c.before=="function"){c.before(d)}}d.spines.removeClass(f);d.slides.removeClass(f);b.find("."+d.classes.activeCorner).hide();d.spines.eq(d.current-2).addClass(d.classes.previous);d.spines.eq(d.current).addClass(d.classes.next);if(d.current!=d.former){var g="slide";if(typeof w[d.options.slideTransition]!="undefined"){g=d.options.slideTransition}w[g](a,c,e)}q()}};var y=function(b,c){var e=b;if(typeof b==="string"){e={};e[b]=c}for(var f in e){c=e[f];switch(f){case"speed":case"start":c=parseFloat(c);if(isNaN(c)){c=d.options[f]}break;case"scroll":case"keys":case"activeCorner":case"hideSpines":case"autoPlay":case"cycle":if(typeof c!=="boolean"){c=d.options[f]}break;case"transition":if(typeof c!=="string"){c=d.options[f]}break;case"complete":case"before":if(typeof c!=="function"){c=d.options[f]}break;case"index":if(typeof c!=="boolean"){if(!a.isArray(c)){c=d.options[f]}}break}d.options[f]=c}};var z=function(){i=b.height();h=b.width();b.css("height",i+"px");j=0;k=0;if(d.options.hideSpines!==true&&d.spines.length>0){j=a(d.spines[0]).height();k=a(d.spines[0]).outerHeight()}l=h-k*d.spines.length;if(d.options.hideSpines===true){l=h}m=Math.ceil(j/2)};var A=function(a){if(d.browser.opera&&d.browser.version<"10.5"||d.browser.msie6||d.browser.firefox2||d.browser.firefox30){if(typeof console!="undefined"){if(typeof console.error=="function"){console.error("This web browser is not supported by SlideDeck. Please view this page in a modern, CSS3 capable browser or a current version of Inernet Explorer")}}return false}if(typeof a!="undefined"){for(var c in a){d.options[c]=a[c]}}if(d.spines.length<1){d.options.hideSpines=true}if(d.options.hideSpines===true){d.options.activeCorner=false}d.options.slideTransition="slide";d.current=Math.min(d.slides.length,Math.max(1,d.options.start));if(b.height()>0){z();t()}else{var e;e=setTimeout(function(){z();if(b.height()>0){clearInterval(e);z();t()}},20)}};var B=function(a){var b;b=setInterval(function(){if(d.isLoaded===true){clearInterval(b);a(d)}},20)};this.loaded=function(a){B(a);return d};this.next=function(a){var b=Math.min(d.slides.length,d.current+1);if(d.options.cycle===true){if(d.current+1>d.slides.length){b=1}}x(b,a);return d};this.prev=function(a){var b=Math.max(1,d.current-1);if(d.options.cycle===true){if(d.current-1<1){b=d.slides.length}}x(b,a);return d};this.goTo=function(a,b){d.pauseAutoPlay=true;x(Math.min(d.slides.length,Math.max(1,a)),b);return d};this.setOption=function(a,b){y(a,b);return d};this.vertical=function(){return false};A(c)};a.fn.slidedeck=function(a){var b=[];for(var c=0;c<this.length;c++){if(!this[c].slidedeck){this[c].slidedeck=new SlideDeck(this[c],a)}b.push(this[c].slidedeck)}return b.length>1?b:b[0]}})(jQuery)
;
/*!
 * slideViewerPro 1.5
 * Examples and documentation at: 
 * http://www.gcmingati.net/wordpress/wp-content/lab/jquery/svwt/
 * 2009-2011 Gian Carlo Mingati
 * Version: 1.5.0 (02-AUG-2011)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires:
 * jQuery v1.6 or later
 * Option:
 * jQuery Timers plugin | plugins.jquery.com/project/timers (for autoslide mode)
 * 
 */

jQuery.extend( jQuery.easing, // from the jquery.easing plugin
{
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
});
jQuery(function(){
   jQuery("div.svwp").prepend("<img src='images/svwloader.gif' class='ldrgif' alt='loading...'/ >"); //change with YOUR loader image path   
});
var j = 0;
jQuery.fn.slideViewerPro = function(settings) {
	  settings = jQuery.extend({
			galBorderWidth: 6,
			thumbsTopMargin: 3, 
			thumbsRightMargin: 3,
			thumbsBorderWidth: 3,
			buttonsWidth: 20,
			galBorderColor: "#ff0000",
			thumbsBorderColor: "#d8d8d8",
			thumbsActiveBorderColor: "#ff0000",
			buttonsTextColor: "#ff0000",
			thumbsBorderOpacity: 1.0, // could be 0, 0.1 up to 1.0
			thumbsActiveBorderOpacity: 1.0, // could be 0, 0.1 up to 1.0
			easeTime: 750,
			asTimer: 4000,
			thumbs: 5,
			thumbsPercentReduction: 12,
			thumbsVis: true,
			easeFunc: "easeInOutExpo",
			leftButtonInner: "-", //could be an image "<img src='images/larw.gif' />" or an escaped char as "&larr";
			rightButtonInner: "+", //could be an image or an escaped char as "&rarr";
			autoslide: false,
			typo: false,
			typoFullOpacity: 0.9,
			shuffle: false
		}, settings);
		
	return this.each(function(){
		function shuffle(a) {
	    var i = a.size();
	    while (--i) {
	        var j = Math.floor(Math.random() * (i));
	        var tmp = a.slice(i, i+1);
	        a.slice(j, j+1).insertAfter(tmp);
	    }
		} 
		var container = jQuery(this);
		(!settings.shuffle) ? null : shuffle(container.find("li"));
		container.find("img.ldrgif").remove();
		container.removeClass("svwp").addClass("slideViewer");	
		container.attr("id", "svwp"+j);
		/**
			var pictWidth = container.find("img").width(); 
			Reads the width of the first (and only) IMG height. 
			That's why all images in the gal must have the same width/height
		*/
		var pictWidth = container.find("img").width(); 
		var pictHeight = container.find("img").height();
		var pictEls = container.find("li").size();
		(pictEls >= settings.thumbs) ? null : settings.thumbs = pictEls;
		var slideViewerWidth = pictWidth*pictEls;
		var thumbsWidth = Math.round(pictWidth*settings.thumbsPercentReduction/100);
		var thumbsHeight =  Math.round(pictHeight*settings.thumbsPercentReduction/100);
		var pos = 0;
		var r_enabled = true;
		var l_enabled = true;
    container.find("ul").css("width" , slideViewerWidth)
    .wrap(jQuery("<div style='width:"+ pictWidth +"px; overflow: hidden; position: relative; top: 0; left: 0'>"));
		container.css("width" , pictWidth);
		container.css("height" , pictHeight);
		container.each(function(i) {
			if(settings.typo)
			{
			jQuery(this).find("img").each(function(z) {
				jQuery(this).after("<span class='typo' style='position: absolute; width:"+(pictWidth-12)+"px; margin: 0 0 0 -"+pictWidth+"px'>"+jQuery(this).attr("alt")+"<\/span>");
			});
			}
			jQuery(this).after("<div class='thumbSlider' id='thumbSlider" + j + "'><ul><\/ul><\/div>");
			jQuery(this).next().after("<a href='#' class='left' id='left" + j + "'><span>"+settings.leftButtonInner+"</span><\/a><a href='#' class='right' id='right" + j + "'><span>"+settings.rightButtonInner+"<\/span><\/a>");
			
			jQuery(this).find("li").each(function(n) { 
						jQuery("div#thumbSlider" + j + " ul").append("<li><a title='" + jQuery(this).find("img").attr("alt") + "' href='#'><img width='"+ thumbsWidth +"' height='"+ thumbsHeight +"' src='" + jQuery(this).find("img").attr("src") + "' /><p class='tmbrdr'>&nbsp;<\/p><\/a><\/li>");						
			});
    
			jQuery("div#thumbSlider" + j + " a").each(function(z) {			
				jQuery(this).bind("click", function(){
					jQuery(this).find("p.tmbrdr").css({borderColor: settings.thumbsActiveBorderColor, opacity: settings.thumbsActiveBorderOpacity});
					jQuery(this).parent().parent().find("p.tmbrdr").not(jQuery(this).find("p.tmbrdr")).css({borderColor: settings.thumbsBorderColor, opacity: settings.thumbsBorderOpacity});
					var cnt = -(pictWidth*z);
					(cnt != container.find("ul").css("left").replace(/px/, "")) ? container.find("span.typo").animate({"opacity": 0}, 250) : null ;
					container.find("ul").animate({ left: cnt}, settings.easeTime, settings.easeFunc, function(){container.find("span.typo").animate({"opacity": settings.typoFullOpacity}, 250)});					
					return false;
				});
			});
			// shortcuts to +/- buttons
			var jQuerybtl = jQuery("a#left" + j);	
			var jQuerybtr = jQuery("a#right" + j);	
			
			// right/left 			
			jQuerybtr.bind("click", function(){
					if (r_enabled) (pictEls-pos > settings.thumbs*2 || pictEls%settings.thumbs == 0)? pos += settings.thumbs : pos += pictEls % settings.thumbs;
					r_enabled = false;
					jQuery(this).prev().prev().find("ul:not(:animated)").animate({ left: -(thumbsWidth+settings.thumbsRightMargin)*pos}, 500, settings.easeFunc, function(){authorityMixing();});					
					return false;
			});
			jQuerybtl.bind("click", function(){	
					if (l_enabled && pos!=0) (pictEls-pos > settings.thumbs || pictEls%settings.thumbs == 0)? pos -= settings.thumbs : pos -= pictEls % settings.thumbs;
					l_enabled = false;
					jQuery(this).prev().find("ul:not(:animated)").animate({ left: -(thumbsWidth+settings.thumbsRightMargin)*pos}, 500, settings.easeFunc, function(){authorityMixing();});			
					return false;
			});						
			
			function authorityMixing()
			{				
				
				//right btt
				(pos == pictEls-settings.thumbs) ? jQuerybtr.addClass("r_dis") : jQuerybtr.removeClass("r_dis");
				(pos == pictEls-settings.thumbs) ? r_enabled = false : r_enabled = true;
				//left btt
				(pos == 0) ? jQuerybtl.addClass("l_dis") : jQuerybtl.removeClass("l_dis");
				(pos == 0) ? l_enabled = false : l_enabled = true;
			}
			
			//CSS	defs @ runtime
			var tBorder = settings.thumbsBorderWidth;
			var contBorder = settings.galBorderWidth
			
			jQuery(".slideViewer a img").css({border: "0"});
			if(settings.typo)
					{
						jQuery(this).find("span.typo").each(function(z) {
							jQuery(this).css({marginTop: (pictHeight-jQuery(this).innerHeight()), opacity: settings.typoFullOpacity});
						});
					}
			jQuery("div#svwp"+ j).css({border: settings.galBorderWidth +"px solid "+settings.galBorderColor});
			
			jQuery("div#thumbSlider" + j).css({position: "relative", left: contBorder, top: settings.thumbsTopMargin+"px", width: settings.thumbs*thumbsWidth+((settings.thumbsRightMargin*settings.thumbs)-settings.thumbsRightMargin), height: thumbsHeight, textAlign: "center", overflow: "hidden", margin: "0 auto"});
			jQuery("div#thumbSlider" + j + " ul").css({width: (thumbsWidth*pictEls)+settings.thumbsRightMargin*pictEls, position: "relative", left: "0", top: "0"});
			jQuery("div#thumbSlider" + j + " ul li").css({marginRight: settings.thumbsRightMargin});
					
			jQuery("div#thumbSlider" + j).find("p.tmbrdr").css({width: (thumbsWidth-tBorder*2)+"px", height: (thumbsHeight-tBorder*2) +"px", top: -(thumbsHeight) +"px", border: settings.thumbsBorderWidth +"px solid "+settings.thumbsBorderColor, opacity: settings.thumbsBorderOpacity});			
			jQuery("div#thumbSlider" + j + " a:first p.tmbrdr").css({borderColor: settings.thumbsActiveBorderColor, opacity: settings.thumbsActiveBorderOpacity});
			
			var rbttLeftMargin = (pictWidth/2) + (jQuery("div#thumbSlider" + j).width()/2) + settings.thumbsRightMargin + contBorder;
			var lbttLeftMargin = (pictWidth/2) - (jQuery("div#thumbSlider" + j).width()/2) - (settings.buttonsWidth + settings.thumbsRightMargin) + contBorder;			

			
			var innerLeftImg = jQuerybtl.find("img");
			var innerRightImg = jQuerybtr.find("img");
			if(innerLeftImg.length != 0 && innerRightImg.length != 0)
			{		
				jQuery(innerLeftImg).load(function() {
					jQuery(this).css({margin: Math.round((thumbsHeight/2)-(jQuery(this).height()/2))+"px 0 0 0"});
				});				
				jQuery(innerRightImg).load(function() {
					jQuery(this).css({margin: Math.round((thumbsHeight/2)-(jQuery(this).height()/2))+"px 0 0 0"});
				});			
			}

			
			jQuery("a#left" + j).css({display: "block", textAlign: "center", width: settings.buttonsWidth + "px" , height: thumbsHeight+"px",  margin: -(thumbsHeight-settings.thumbsTopMargin) +"px 0 0 "+lbttLeftMargin+"px", textDecoration: "none", lineHeight: thumbsHeight+"px", color: settings.buttonsTextColor});
			jQuery("a#right" + j).css({display: "block", textAlign: "center", width: settings.buttonsWidth + "px", height: thumbsHeight+"px" , margin: -(thumbsHeight) +"px 0 0 "+rbttLeftMargin+"px", textDecoration: "none", lineHeight: thumbsHeight+"px", color: settings.buttonsTextColor});			


			authorityMixing();
	
			if(settings.autoslide){					
					var i = 1;
					
					jQuery("div#thumbSlider" + j).everyTime(settings.asTimer, "asld", function() {			
		  			jQuery(this).find("a").eq(i).trigger("click");
		  			if(i == 0)
		  			{
						pos = 0;
						l_enabled = false;
						jQuery("div#thumbSlider" + j).find("ul:not(:animated)").animate({ left: -(thumbsWidth+settings.thumbsRightMargin)*pos}, 500, settings.easeFunc, function(){authorityMixing();});
		  			}
		  			else l_enabled = true;
		  			
						(i%settings.thumbs == 0)? jQuery(this).next().next().trigger("click") : null;
						(i < pictEls-1)?	i++ : i=0;		  			
					});		
					
					//stops autoslidemode	
					jQuery("a#right" + j).bind("mouseup", function(){
						jQuery(this).prev().prev().stopTime("asld");
		    	});
					jQuery("a#left" + j).bind("mouseup", function(){
						jQuery(this).prev().stopTime("asld");	
					});
					jQuery("div#thumbSlider" + j + " a").bind("mouseup", function(){
						jQuery(this).parent().parent().parent().stopTime("asld");
					});
			}
			var uiDisplay = (settings.thumbsVis)? "block":"none";
			jQuery("div#thumbSlider" + j + ", a#left" + j + ", a#right" + j).wrapAll("<div style='width:"+ pictWidth +"px; display: "+uiDisplay+"' id='ui"+j+"'><\/div>");			
			jQuery("div#svwp"+ j + ", div#ui" + j).wrapAll("<div style='width:"+ pictWidth +"px'><\/div>");
			});
			(jQuery("div#thumbSlider" + j).width()+(settings.buttonsWidth*2) >= pictWidth)? alert("ALERT: THE THUMBNAILS SLIDER IS TOO WIDE! \nthumbsPercentReduction and/or buttonsWidth needs to be scaled down!") : null;
		j++;
  });	
};
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//




;
