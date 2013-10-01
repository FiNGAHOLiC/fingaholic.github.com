---
layout: post
category: javascript
title: SafariでSWFの関数を$.isFunctionで判定できない
date: 2012-09-19
summary: SWFの関数を$.isFunctionで判定しようとしたらダメだったのでメモ。
---

下記のようにスクロールするごとにSWFの関数を叩くコードを作ってた（わかりやすくするために色々省いた）。

```javascript
var swf = null,
    onEmbedSWFHandler = function(){
    	swf = $('#flashcontents')[0];
    	onScroll();
    },
    onScroll = function(){
	var fn = onScrollHandler();
    	$(window).on('scroll', fn);
    },
    onScrollHandler = function(){
    	var isFunc = $.isFunction(swf['onBrowserScroll']);
    	return function(){
    		if(isFunc) swf['onBrowserScroll']();
    	};
    };
swfobject.embedSWF('.main.swf', 'flashcontents', 100, 100, '10', '', {}, {}, {}, onEmbedSWFHandler);
```

流れとしては、

1. swfを指定のID（#flashcontents）に書き出す。

2. 書き出し完了後、swf（object要素）を変数に代入し、スクロールイベントを登録。

3. swf（object要素）にonBrowserScrollが登録されており、**尚且つ関数**ならばスクロールごとに実行。

という感じで$.isFunctionで関数かどうか判定してたけどどうも**SafariだとWin、Mac問わずfalseが返ってくる**。typeofで調べるとswf['onScroll']はfunctionで返ってくるのに。

とりあえず下記のように$.isFunction使わず素直にtypeofで判定だといける。

```javascript
var swf = null,
    onEmbedSWFHandler = function(){
    	swf = $('#flashcontents')[0];
    	onScroll();
    },
    onScroll = function(){
    	var fn = onScrollHandler();
    	$(window).on('scroll', fn);
    },
    onScrollHandler = function(){
    	var isFunc = (typeof swf['onBrowserScroll'] === 'function');
    	return function(){
    		if(isFunc) swf['onBrowserScroll']();
    	};
    };
swfobject.embedSWF('.main.swf', 'flashcontents', 100, 100, '10', '', {}, {}, {}, onEmbedSWFHandler);
```

原因を突き止めるべくjQueryの$.isFunction()関数を見てみるとreturn $.type(obj) === 'function'しているだけだったので$.type()関数の処理を見てみた。

```javascript
type: function( obj ) {
	return obj == null ?
		String( obj ) :
		class2type[ core_toString.call(obj) ] || "object";
},
```

どうやらcore_toString.call(obj)部分、Object.prototype.toString(obj)で[object Fucntion]が返り値として期待される箇所で[object NPMethod]が返ってきているのが原因っぽい。class2typeにはNPMethod型は登録されてないので'object'が代入され、'object' === 'function'で結果的にfalseが返ってくると。

ってかNPMethodって調べてもあんまり載ってないので引き続き調べてみるけどなんなんだよ一体。。。
