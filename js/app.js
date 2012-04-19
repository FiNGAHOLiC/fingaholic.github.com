/*!
 * app.js
 *
 * @modified 2012/04/19
 * @requires Modernizr 2.5.3 or later &&
 *           Respond 1.1.0 &&
 *           jQuery 1.7.x or later &&
 *           jQuery UI 1.8.x or later &&
 *           jQuery easing 1.3 or later
 *
 */

;(function(window, document, undefined){

	// usage: log('inside coolFunc', this, arguments);
	// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

	// make it safe to use console.log always
	(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
	(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

	// overwrite yepnope errorTimeout (default:10000).
	yepnope.errorTimeout = 2000;

	var onComplete = function(){

		(function($){
			// under development
		}(jQuery));

	};

	Modernizr.load([
		// http://stackoverflow.com/questions/7460670/how-to-detect-if-media-queries-are-present-using-modernizr
		{
			test : Modernizr.mq('only all'),
			nope : '/js/libs/respond.min.js'
		},
		// load jquery from a 3rd party CDN
		{
			load : 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
			callback : function (){
				if(!window.jQuery){
					Modernizr.load('/js/libs/jquery-1.7.1.min.js');
				};
			}
		},
		// load libs
		{
			load : [
				'/js/libs/jquery-ui-1.8.18.custom.min.js',
				'/js/libs/jquery.easing.1.3.js'
			]
		},
		// load mylibs
		{
			load : [
				'/js/mylibs/jquery.ui.plugin.js'
			],
			complete : onComplete
		}
	]);

}(window, this.document));
