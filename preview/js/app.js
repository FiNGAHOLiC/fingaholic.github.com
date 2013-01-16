/*!
 * app.js
 *
 * @modified 2012/05/03
 *
 */

;(function($, window, document, undefined){

	// usage: log('inside coolFunc', this, arguments);
	// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

	// make it safe to use console.log always
	(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
	(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

	$(function(){

		// twitter
		(function(){
			$.getScript('//platform.twitter.com/widgets.js');
		}());

		// facebook
		(function(){
			var appId = 414280305262678;
			if(window.FB){
				FB.init({ cookie: true, xfbml: true, appId: appId });
			}else{
				$.getScript("http://connect.facebook.net/ja_JP/all.js", function(){
					FB.init({ cookie: true, xfbml: true, appId: appId });
				});
			};
		}());

	});

}(jQuery, window, this.document));
