---
layout: post
category: javascript
title: ステートフルJavaScript 2章
date: 2012-07-02
summary: ステートフルJavaScript2章の備考録、っていうか写経。早くMVCへ行きたいけど復習も兼ねて。
---

# 2.1 イベントの監視

> イベントリスナを削除するにはremoveEventListener()を使います。ここには以下のように、addEventListenerで指定したのと同じ引数を指定します。リスナが匿名関数であるなどの理由でリスナへの参照が存在しない場合は、要素ごと破棄しない限りリスナを削除することはできません。

まあ当たり前の事ですね。
ちなみに非標準だけど第4引数はaWantsUntrustedで、信頼されないコンテンツによって引き起こされるイベントを許可する、なる項目もあるらしい。

* [element.addEventListener - MDN](https://developer.mozilla.org/ja/DOM/element.addEventListener, 'element.addEventListener - MDN')

# 2.2 イベントの発生順序

ある要素とその祖先に同じ種類のイベントを指定している場合、下記ブラウザによって挙動が違う。

> Netscape4はイベントキャプチャリング（event capturing）に対応しています。ここでは、最も上位（外側）の要素からイベントが発生した要素へと順にイベントリスナが呼び出されていきます。

これは分かりづらいと思う。

> 一方、Microsoftが取り入れたのはイベントバブリング（event bubbling）という考え方です。ここでは、イベントが発生した要素（内側）から祖先要素へと順にイベントリスナが呼ばれます。

バブリングの方がイメージしやすいのでaddEventListener（IEの場合はattachEvent）関数の第3引数にはfalse、または指定しないようにしておくのが一般的。

# 2.3 イベント処理のキャンセル

stopPropagation関数でバブリングを中止出来る。
preventDefault関数でデフォルトのアクションをキャンセル出来る。
※イベントハンドラが返り値としてfalseを返しても同様の効果がある。

# 2.4 イベントオブジェクト

下記参考リンク。

* [event - MDN](https://developer.mozilla.org/ja/DOM/event, 'event - MDN')

# 2.5 イベントライブラリ

解説ではbind関数だけどjQuery1.7からはon、またはoffの方が良いかも。

* [jQuery 1.7の更新内容をまとめたよ。 | Ginpen.com](http://ginpen.com/2011/11/04/jquery-1-7/, 'jQuery 1.7の更新内容をまとめたよ。 | Ginpen.com')

# 2.6 コンテキストの変化

まあ最初はよく分からんかった。

```javascript
new function(){
	this.appName = 'wem';
	document.body.addEventListener('click', function(e){
		// コンテキストが変化したため、appNameはundefinedです
		alert(this.appName);
	}, false);
};
```

上記を解決するには、

```javascript
new function(){
	this.appName = 'wem';
	document.body.addEventListener('click', $.proxy(function(e){
		alert(this.appName);
	}, this), false);
};
```

のように$.proxyでコンテキストとして利用したいオブジェクトを使用してやるといい。

# 2.7 イベントの委譲

**子孫の要素でそれぞれイベントを設定するより祖先要素にリスナを1つ登録**すればいいよねと。
これ割りと基本的な事だし実践的だから忘れないようにしないとなあ。余計なクラス付与しなくてもいいし。

```javascript
$(function(){
	var $elem = $('ul > li');
	$elem.on('click', function(e){
		console.log('clicked');
	});
});
```

上記だとli要素それぞれにリスナを登録してるけど、

```javascript
$(function(){
	var $elem = $('ul');
	// 1.7以前だとdelegate()
	$elem.on('click', 'li', function(e){
		console.log('clicked');
	});
});
```

# 2.8 カスタムイベント

これはよく使う。Pub/Subパターンにつながる。

# 2.9 カスタムイベントとjQueryプラグイン

本だとちょっと？ってなる箇所もあったので付け足して実例。
まずは悪い例。

HTML

```html
<ul id="tabs">
	<li data-tab="users">ユーザー</li>
	<li data-tab="groups">グループ</li>
</ul>
<div id="tabContent">
	<div data-tab="users"> ... </div>
	<div data-tab="groups"> ... </div>
</div>
```

JavaScript

```javascript
$.fn.tabs = function(control){
	var element = this,
	control = $(control);
	element.find('li').bind('click', function(){
		element.find('li').removeClass('active');
		$(this).addClass('active');
		var tabName = $(this).attr('data-tab');
		control.find('>[data-tab]').removeClass('active');
		control.find('>[data-tab="' + tabName + '"]').addClass('active');
	});
	element.find('li:first').addClass('active');
	control.find('div:first').addClass('active');
	return this;
};
```

上記だと、

1. すべてのli要素に対してクリックイベントのハンドラを設定している
2. イベントハンドラの処理が長い

という問題があるのでこれをリファクタリングしたのが下記。
※HTMLは変更しない

JavaScript

```javascript
$.fn.tabs = function(control){
	var element = this,
	control = $(control);
	element.delegate('li', 'click', function(){
		var tabName = $(this).attr('data-tab');
		element.trigger('change.tabs', tabName);
	});
	element.bind('change.tabs', function(e, tabName){
		element.find('li').removeClass('active');
		element.find('>[data-tab="' + tabName + '"]').addClass('active');
		control.find('>[data-tab]').removeClass('active');
		control.find('>[data-tab="' + tabName + '"]').addClass('active');
	});
	var firstName = element.find('li:first').attr('data-tab');
	element.trigger('change.tabs', firstName);
	return this;
};
```

大分見通しは良くなった。
これだと$('#tabs').trigger('change.tabs', 'groups')でプログラムの中からタブを切り替えたりも出来る。

# 2.10 非DOMイベント

きました。デザインパターン。

> パブリッシュ/サブスクライブはパブサブ（Pub/Sub）と呼ばれることもあり、パブリッシャーとサブスクライバーという2つの実体の間で行われるメッセージ交換をパターン化したものです。パブリッシャーは特定のチャンネルにメッセージをパブリッシュ（公開）し、そのチャンネルをサブスクライブ（購読）しているサブスクライバーは新規メッセージの公開時通知を受け取ります。ここでのポイントはパブリッシャーとサブスクライバーのプログラムが完全に分離しており、お互いの存在について関知する必要すらないという点です。

```javascript
var PubSub = {
	subscribe: function(ev, callback){
		// _callbacksオブジェクトが存在しない場合は生成します
		var calls = this._callbacks || (this._callbacks = {});

		// 指定されたイベントに対応する配列が存在しない場合は生成します
		// そしてコールバックを配列に追加します
		(this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
		return this;
	},
	publish: function(){
		// 引数のオブジェクトを実際の配列に変換します
		var args = Array.prototype.slice.call(arguments, 0);

		// 1つ目の引数からイベントの名前を取り出します
		var ev = args.shift();

		// _callbacksオブジェクトが存在しないか、イベントに対応する配列が
		// 存在しない場合は処理を終了します
		var list, calls, i, l;
		if(!(calls = this._callbacks)) return this;
		if(!(list = this._callbacks[ev])) return this;

		// コールバックを呼び出します
		for(i = 0, l = list.length; i < l; i++){
			list[i].apply(this, args);
			return this;
		};
	}
};

// 使用例
PubSub.subscribe('wem', function(){
	alert('Wem!');
});
PubSub.publish('wem');
```

上記コードをhashchangeでお馴染みのBen AlmanさんがjQueryライブラリとして公開してる。
※記事ではbind、unbindだけどon、offにアップデートされてた。

```javascript
/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */

(function($) {

	var o = $({});

	$.subscribe = function() {
		o.on.apply(o, arguments);
	};

	$.unsubscribe = function() {
		o.off.apply(o, arguments);
	};

	$.publish = function() {
		o.trigger.apply(o, arguments);
	};

}(jQuery));
```

* [jQuery Tiny Pub/Sub: A really, really, REALLY tiny pub/sub implementation for jQuery. &mdash; Gist](https://gist.github.com/661855 'jQuery Tiny Pub/Sub: A really, really, REALLY tiny pub/sub implementation for jQuery. &mdash; Gist')

使い方は下記。

```javascript
$.subscribe('/some/topic', function(event, a, b, c){
	console.log(event.type, a + b + c);
});
$.publish('/some/topic', ['a', 'b', 'c']);
```

という訳でいよいよ次からMVC。
