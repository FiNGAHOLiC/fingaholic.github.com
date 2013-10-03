---
layout: post
category: javascript
title: ステートフルJavaScript 4章
date: 2012-07-20
summary: ステートフルJavaScript4章の備考録、っていうか写経。コントローラ。
---

> そもそも、コントローラとは一体何でしょうか。簡単に言うなら、コントローラはアプリケーションの中でビューとモデルとをつなぐ接着剤の役割を果すものです。ビューとモデルの双方に関与しているコンポーネントはコントローラだけです。ページが読み込まれると、コントローラはビューにイベントハンドラを関連付け、コールバックを適切に処理し、必要に応じてモデルとのやり取りも行います。
> 便利なライブラリも存在しますが、コントローラの作成にライブラリは必須ではありません。コントローラにとって必要なのは、モジュール性を持ち独立した存在であるということだけです。疎結合度の高いコンポーネントとしてふるまうべきであり、グローバル変数を定義したりすることは可能な限り避けなければなりません。これを実現するための優れた手法がModuleパターンです。

# 4.1 Moduleパターン

> ロジックをカプセル化してグローバル変数の衝突による汚染を避ける上で、Moduleパターンは非常に効果的です。これを可能にするのが、おそらくjavaScriptが持つ最も優れた機能であろう匿名関数です。以下のコードのように、作成した匿名関数は直後に実行してしまいます。匿名関数によって、その内部のコードをクロージャとして実行でき、変数をローカルでプライベートな環境内に置くことができます。

```javascript
(function(){
	/* ... */
}());
```

この辺りは「[JavaScriptパターン](http://www.oreilly.co.jp/books/9784873114880/ 'JavaScriptパターン')」見るといいかも。
古い記事だけど下記リンクも参考になる。

* [JavaScriptの巧い書き方 - Archiva](http://archiva.jp/web/javascript/writing_style.html 'JavaScriptの巧い書き方 - Archiva')

## 4.1.1 グローバル変数のインポート

```javascript
(function($){
	/* ... */
}(jQuery));
```

グローバル変数よりローカル変数なので高速で効率的なので、匿名関数への引数としてグローバル変数を渡して、ローカル変数で使いましょうねと。ちなみにjQueryでもやってる。

```javascript
(function($, window, document, undefined){
	/* ... */
})(jQuery, this, this.document);
```

undefinedに関しては下記リンク先に書いてあるとおり、JavaScriptのundefinedは上書きが可能な値なので、ローカルスコープ内でundefinedはundefinedと保証させるために設定している。

で、windowとdocumentに関してはJSのminifierのためらしい。JSのminifierはローカルスコープで一文字の変数に置き換えるのでちょっと軽くなるとの事。まあ体感で感じることはないんだろうけども。

* [JSでローカルスコープ作るときのアレの意味 - Takazudo hamalog](http://hamalog.tumblr.com/post/4047986427/jsscope 'JSでローカルスコープ作るときのアレの意味 - Takazudo hamalog')

## 4.1.2 グローバル変数のエクスポート

```javascript
(function($, exports){
	exports.Foo = 'wem';
}(jQuery, window));

console.log(Foo); // => 'wem'
```

インポートの逆。windowオブジェクトをモジュール内にインポートしてプロパティをセット。

# 4.2 コンテキストの定義

そもそもコンテキストってなんなのか？[コンテキストとは (context)： - IT用語辞典バイナリ](http://www.sophia-it.com/content/%E3%82%B3%E3%83%B3%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88 'コンテキストとは (context)： - IT用語辞典バイナリ')で調べてみると、

> コンテキストとは、プログラムの実行に必要な各種情報のことである。
> 「context」（コンテキスト）は、「文脈」、「前後関係」などと訳されるが、IT用語としては意味がイメージしづらく、単にコンテキストとある場合は、何らかの制御情報と考える方がわかりやすいことが多い。

とある。どうもイメージしづらい。[ECMAScript 実行コンテキスト - Web Application Programming Wiki](http://wikiwiki.jp/webapp/?cmd=read&page=ECMAScript%2F%BC%C2%B9%D4%A5%B3%A5%F3%A5%C6%A5%AD%A5%B9%A5%C8 'ECMAScript 実行コンテキスト - Web Application Programming Wiki')を読むと、実行コンテキストは、

> thisの値
> スコープチェイン
> 変数オブジェクト

の情報を持つとある。まだ完全に把握は出来ないけど上記をイメージして読むと何となく意味は掴めた。要はざっくりとthisとその有効範囲ってニュアンスでいいのかな？

```javascript
(function(){
	var mod = {};
	mod.contextFunction = function(){
		assertEqual(this, mod);
	};
	mod.contextFunction();
}());
```

> このコードでは、contextFunction()関数の中でのコンテキストはmodオブジェクトというローカルなものになります。ここでは、誤ってグローバル変数を作成してしまうことはないので、安心してthisを利用できます。実際の使われ方を明確に示すために、このコードを具体化してみます。

```javascript
(function($){
	var mod = {};
	mod.load = function(func){
		$($.proxy(func, this));
	};
	mod.load(function(){
		this.view = $('#view');
	});
	mod.assetsClick = function(e){
		// クリック時の処理
	};
	mod.load(function(){
		this.view.find('.assets').click(
			$.proxy(this.assetsClick, this)
		);
	});
}(jQuery));
```

本に記載されているサンプルコードだとload()関数内のコールバックを$関数で実行してるけどなんか気持ち悪いのは自分だけだろうか？$.proxy(func, this)();でもよかったような気がする。

## 4.2.1 ライブラリへの抽象化

> ここまでのコードをライブラリとして抽象化し、他のモジュールやコントローラでも利用できるようにしましょう。先ほどのload()関数を追加するとともに、proxy()やinclude()といった新しい関数も加えます。コードは以下のようになります。

```javascript
(function($, exports){
	var mod = function(includes){
		if(includes) this.includes(includes);
	};
	mod.fn = mod.prototype;
	mod.fn.proxy = function(func){
		return $.proxy(func, this);
	};
	mod.fn.load = function(){
		$(this.proxy(func));
	};
	mod.fn.include = function(ob){
		$.extend(this, ob);
	};
	exports.Controller = mod;
}(jQuery, window));
```

本のコードだと動作しないので[Github上のサンプルコード](https://github.com/maccman/book-assets/blob/master/ch04/modules.html 'Github上のサンプルコード')を実行したのが下記。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/DXpc9/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

> ローカル変数の代わりにコンテキストを利用する場合、thisというキーワードを毎回記述しなければならずコードは若干増大します。しかし、コンテキストによってコードの再利用の可能性が大幅に高まります。例えば、以下のようにコントローラのプロトタイプにプロパティをセットすることによって、すべてのControllerインスタンスに関数を追加できます。

```javascript
Controller.fn.unload = function(func){
	jQuery(window).bind('unload', this.proxy(func));
};
```

## 4.2.2 ドキュメントの後にコントーラを読み込む

> 現状のコードでは、本書のコントローラの一部はDOMよりも先に読み込まれる一方、ページのドキュメントが読み込まれた後で呼び出されるコールバックも存在します。このことは、コントローラのロジックが異なる内部状態のもとで実行されるという意味であり、ドキュメントの読み込み時のコールバックが複雑化することになります。

これを修正したのが下記コード。

```javascript
// windowオブジェクトではなくグローバルなコンテキストを
// 使用してグローバル変数を生成します
var exports = this;

(function($){
	var mod = {};
	mod.create = function(includes){
		var result = function(){
			this.init.apply(this, arguments);
		};
		result.fn = result.prototype;
		result.fn.init = function(){};
		result.proxy = function(func){
			return $.proxy(func, this);
		};
		result.fn.proxy = result.proxy;
		result.include = function(ob){
			$.extend(this.fn, ob);
		};
		result.extend = function(ob){
			$.extend(this, ob);
		};
		if(includes) result.include(includes);
		return result;
	};
	exports.Controller = mod;
}(jQuery));
```

> 新しいコードでは、Controller.create()関数を使ってコントローラを生成します。この際にインスタンスプロパティをオブジェクトとして渡すこともできます。

下記が実行例。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/PnLNV/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

> 大きな変更点はもう一つあり、コントローラのインスタンス化時にview要素を渡しています。以前のコードではコントローラ内で要素を取得していました。コントローラを異なる要素に対しても利用でき、コードの重複を最小限にできるという点で、この変更には大きな意味があります。

## 4.2.3 ビューへのアクセス

> ビュー毎にコントローラを1つずつ用意するというのが、よく使われているパターンです。ビューはID値を持っており、用意に取り出してコントローラに渡せます。一方ビューの中では、他のビューの要素との競合を防ぐためにID値ではなくクラスが使われます。一般的にはこのパターンがアプリケーションに良い構造をもたらしてくれるのですが、固執する必要はありません。
> ここまでのコードではjQuery()あるいは$()のセレクタを使ってビューにアクセスし、コントローラ内のローカルにビューへの参照を保持していました。ビュー内の要素を取り出す（以下のコードを参照）際にビュー外を探索せずに済むのが効率的です。

```javascript
// ...
init: function(view){
	this.view = $(view);
	this.form = this.view.find('form');
}
```

> 一方このアプローチでは、コントローラにセレクタが多数記述され、DOM内の探索が頻繁に行われることになります。そこで、セレクタと変数名の対応を表す表をコントローラの中に設けることにします。コードは下記のとおりです。

```javascript
elements: {
	'form.searchForm': 'searchForm',
	'form input[type=text]': 'searchInput'
}
```

> コントローラがインスタンス化される際に、それぞれのセレクタに対応する要素が取り出され、変数this.searchFormとthis.searchInputへと確実にセットされます。これらは通常のjQueryのオブジェクトなので、イベントハンドラの設定や属性値の取り出しなども通常どおり行えます。
> この機能をコントローラにも追加し、すべてのセレクタからローカル変数を生成することにします。この処理は、コントローラの初期化時に呼び出されるinit()関数の中で以下のようにして行います。

```javascript
var exports = this;

jQuery(function($){
	exports.SearchView = Controller.create({
		// セレクタとローカル変数名との関連を表すマップ
		elements: {
			'input[type=search]': 'searchInput',
			'form': 'searchForm'
		},
		// インスタンス化時に呼び出されます
		init: function(element){
			this.el = $(element);
			this.refreshElement();
			this.searchForm.submit(this.proxy(this.search));
		},
		search: function(){
			console.log('Searching:', this.searchinput.val());
		},
		// プライベート関数
		$: function(selector){
			// 問い合わせはelプロパティ（必須）の有効範囲で行われます
			return $(selector, this.el);
		},
		// ローカル変数をセットアップします
		refreshElemetns: function(){
			for(var key in this.elements){
				this[this.elements[key]] = this.$(key);
			};
		}
	});
	new SearchView('#users');
});
```

> refreshElements()はコントローラから現在の要素を表すプロパティelを受け取り、セレクタによる探索をこの要素の中で行います。refreshElements()が呼び出されると、this.searchFormとthis.searchInputの書くプロパティに対応する要素がコントローラ内にセットされ、イベントの関連づけやDOMの操作などに利用できるようになります。

下記が実行例。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/yN292/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

大分分離できて汎用的に使いまわせそうになってきたけどthis.searchForm.submit(this.proxy(this.search));が気になるよねと。

## 4.2.4 イベント処理の委託

> イベントの関連づけをすべて解除したり中継したりするといったことも可能です。このためにはeventsというオブジェクトを用意し、イベントの種類とセレクタそしてコールバックとの対応を記述します。eventsのデータ構造はelementsオブジェクトによく似ており、以下のようになります。

```javascript
events: {
	'submit form': 'submit'
}
```

> この仕組みをSearchViewコントローラにも適用します。refreshElements()と同様に、delegateEvents()という関数を用意してコントローラの初期化時に呼び出されるようにします。この関数はコントローラのeventsオブジェクトの内容を調べ、イベントのコールバックを設定します。具体的には、ビュー内のフォームが送信された際にsearch()関数を呼び出します。コードは以下のようになります。

```javascript
var exports = this;

jQuery(function($){
	exports.SearchView = Controller.create({
		// イベント名とセレクタそしてコールバックの対応を表します
		events: {
			'submit form': 'search'
		},
		init: function(){
			// ...
			this.delegateEvents();
		},
		search: function(e){ /* ... */ },
		// 最初の空白文字で区切ります
		eventSplitter: /^(\w+)\s*(.*)$/,
		delegateEvents: function(){
			for(var key in this.events){
				var methodName = this.events[key];
				var method = this.proxy(this[methodName]);

				var match = key.match(this.eventSplitter);
				var eventName = match[1], selector = match[2];

				if(selector === ''){
					this.el.bind(eventName, method);
				}else{
					this.el.elegate(selector, eventName, method);
				};
			};
		}
	});
});
```

> delegateEvents()の中で、delegate()とbind()の各関数を利用しています。セレクタが指定されていない場合、イベントハンドラはelの指す要素に直接セットされます。その他の場合は、イベント委譲（[.delegate() &#8211; jQuery API](http://api.jquery.com/delegate '.delegate() &#8211; jQuery API')）され、セレクタで指定された要素で該当のイベントが発生するとハンドラが呼び出されます。委譲を利用することによって、記述しなければならないイベントリスナの数を削減できることがしばしばあります。イベントにはバブリングの性質があるため、親要素でもイベントを補足でき、個々の子要素でイベントリスナを設定する必要はありません。

下記が実行例。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/vbJSc/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

# 4.3 状態機械

> 状態機械（state machine）はより正確には有限状態機械（finite state machineあるいはFSM）と言い、UIをプログラムする際に役立ちます。状態機械を使うと複数のコントローラを管理したり、ビューの表示あるいは非表示の切り替えを容易に行えます。状態機械とは、状態（state）と遷移（transition）の2つから構成されます。複数の状態の中で1つだけがアクティブであり、その他はパッシブです。状態が切り替わる際に、2つの状態の間の遷移が遷移が呼び出されます。
> この概念を実際のプログラムに当てはめてみましょう。それぞれ独立して表示されるビュー（連絡先の内容表示とその編集など）があるとします。これらのビューは排他表示であり、片方が表示されたらもう片方は非表示になる必要があります。このように、常にどれか1つのビューだけがアクティブであるというシナリオは状態機械にぴったりです。状態機械を取り入れていれば、他のビュー（設定画面など）を追加するのも簡単です。
> 状態機械の実装方法を把握するために、例を1つ紹介します。この例はとてもシンプルであり複数の種類の遷移には対応していないのですが、実装の概要を理解するためには十分でしょう。まず、jQueryのイベントAPI（2章参照）を使ったEventsオブジェクトを定義し、状態機械上でのイベントに対して関連付けを行ったりイベントを発生させたりできるようにします。

```javascript
var Events = {
	bind: function(){
		if(!this.o) this.o = $({});
		this.o.bind.apply(this.o, arguments);
	},
	trigger: function(){
		if(!this.o) this.o = $({});
		this.o.trigger.apply(this.o, arguments);
	}
};
```

> Eventsオブジェクトは本質的に、DOM外でのイベントというjQueryの機能を拡張し、ライブラリの中で利用できるようにしただけのものです。続いて、状態機械を表すStateMachineクラスを定義します。ここには以下のように、add()というメインとなる関数が用意されます。

```javascript
var StateMachine = function(){};
StateMachine.fn = StateMachine.prototype;

// イベントの関連付けを追加します
$.extend(StateMachine.fn, Events);

StateMachine.fn.add = function(controller){
	this.bind('change', function(e, current){
		if(controller == current)
			controller.activate();
		else
			controller.deactivate();
	});

	controller.active = $.proxy(function(){
		this.trigger('change', controller);
	}, this);
};
```

> add()関数は、受け取ったコントローラを内部状態のリストに追加し、active()関数を定義します。このactive()が呼び出されると、対象のコントローラへとアクティブな状態が遷移します。そしてアクティブなコントローラに対してactivate()を呼び出し、その他すべてのコントローラに対してdeactivate()を呼び出します。以下のコードでは、実際のふるまいを確認するために、コントローラを2つ作成して状態機械に追加しています。そして1つ目のコントローラをアクティブ化しています。

```javascript
var con1 = {
	activate: function(){},
	deactivate: function(){}
};

var con2 = {
	activate: function(){},
	deactivate: function(){}
};

// StateMachineオブジェクトを作成して状態を追加します
var sm = new StateMachine;
sm.add(con1);
sm.add(con2);

// 最初の状態をアクティブ化します
con1.active();
```

> 状態機械のadd()関数は、changeイベントのコールバックを作成し、その中でactivate()とdeactivate()のうち適切なほうを呼び出します。active()関数を呼び出す他に、以下のように、自分でchangeイベントを発生させても状態遷移を行えます。

```javascript
sm.trigger('change', con2);
```

> コントローラのactivate()関数の中で、ビューのセットアップや表示、要素の追加などを行えます。同様に、deactivate()関数の中ではビューの非表示化に関連する処理を行えます。ビューの表示と非表示の操作にはCSSクラスを利用するのが便利です。次のように、ビューがアクティブになったら何らかのクラス（例えば.activeなど）を追加し、アクティブでなくなったらそのクラスを削除します。

```javascript
var con1 = {
	activate: function(){
		$('#con1').addClass('active');
	},
	deactivate: function(){
		$('#con1').removeClass('active');
	}
};

var con2 = {
	activate: function(){
		$('#con2').addClass('active');
	},
	deactivate: function(){
		$('#con2').removeClass('active');
	}
};
```

> そしてスタイルシートでは、このクラスが指定されている要素を表示し、指定されていない要素は非表示にします。

```css
#con1, #con2 { display: none; }
#con1.active, #con2.active { display: block; }
```

下記が実行例。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/sY79V/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

# 4.4 ルーティング

> 内部状態が変化したらURLも変化し、URLが変更されたらそれに合わせて内部状態も更新します。初回のページ読み込み時にURLをチェックし、それに対応する内部状態をセットアップします。

## 4.4.1 URLのハッシュ

> ページの基底URLはページを再読み込みしなければ変化しませんが、再読み込みが発生するのは望ましくありません。これを回避する方法はいくつか考えられていますが、中でも長く使われてきているのがURLのハッシュ（#以降の文字列）を変更するというものです。ハッシュの値はサーバに送信されないため、ページの再読み込みを発生させることなしに変更できます。例えば筆者のTwitterページを表す以下のURLで、#!/maccmanの部分がハッシュです。

```bash
http://twitter.com/#!/maccman
```

> location.hashオブジェクトを使うと、以下のようにしてページのハッシュを取得し変更することができます。

```javascript
// ハッシュをセットします
window.location.hash = 'foo';
assertEqual(window.location.hash, '#foo');

// '#'を取り除きます
var hashValue = window.location.hash.slice(1);
assertEqual(hashValue, 'foo');
```

> URLにハッシュが含まれていない場合、location.hashの値は空文字列になります。それ以外の場合は、location.hashの値はURLのうちハッシュを表す部分（#も含みます）の文字列になります。
> ハッシュの値を頻繁に変更すると、（特にモバイルブラウザでは）大幅な処理速度の低下を招くことがあります。したがって、（例えばリスト表示のスクロールに合わせて内部状態を変更するなどのように）何度もハッシュを変更する必要が有る場合は、代替えとしてスロットリング（帯域制限）などの手法を検討するべきです。

スロットリングがちょっとよく分からんかった。。。

## 4.4.2 ハッシュの変化の検知

IE8以上、Firefox3.6以上、Chrome全バージョン、Safariバージョン8以上、Operaバージョン10.6以上なら、

```javascript
window.addEventListener('hashchange', function(){ /* ... */ }, false);
```

で検知可能。IE8以下ならjQueryプラグイン（[http://benalman.com/projects/jquery-hashchange-plugin/](http://benalman.com/projects/jquery-hashchange-plugin/ 'http://benalman.com/projects/jquery-hashchange-plugin/')）が用意されているので、下記のようにして使用する。

```javascript
$(window).hashchange(function(){ /* ... */ });
```

> なお、このイベントはハッシュが変更された場合のみ発生し、ページの読み込み時には発生しません。したがって、ハッシュに基づくルーティングを行うなら、以下のようにしてページの読み込み時にhashchangeイベントを自分で発生させるとよいでしょう。

```javascript
$(function(){
	var hashValue = location.hash.slice(1);
	if(hashValue)
		$(window).trigger('hashchange');
});
```

## 4.4.3 Ajax Crawling

ハッシュを監視してガリガリ動くWebアプリケーションはGoogle等の検索エンジンに対してどの様にインデックスされるかを解説している。この辺りは5509さんの記事が非常にわかり易かったので下記3記事に目を通しておけば良さげ。

* [SEOにも強いクローラブルなAJAXコンテンツを作成するために  ::  5509](http://5509.me/log/making-crawrable-contents-with-ajax 'SEOにも強いクローラブルなAJAXコンテンツを作成するために  ::  5509')
* [SEOやJSオフ環境にも配慮したAjaxコンテンツを制作するためにできること  ::  5509](http://5509.me/log/to-make-ajax-contents 'SEOやJSオフ環境にも配慮したAjaxコンテンツを制作するためにできること  ::  5509')
* [AjaxコンテンツとGooglebot、インデックスの話  ::  5509](http://5509.me/log/ikenkudasai 'AjaxコンテンツとGooglebot、インデックスの話  ::  5509')

ポイントは何でもかんでもハッシュをシバン（hash=#、bang=!、合わせてshebang=シバンらしい）にする必要はなくて、**GoogleのAjax Crawlingという仕様に準拠している場合にのみ使用**するものだということ。結局サーバーサイドでUgly URL（_escaped_fragment_に置換されたURL）対応でHTML Snapshotを返す等の作業が出来ない場合は意味がない。

ちなみに現在のTwitterは一部を除いてシバンによる管理じゃなくなってた。

## 4.4.4 HTML5のHistory API

前節を解決？する方法として最近実装も増えてきたHistory APIについての解説。この辺りはググればいっぱい出てくる。「pjax」（pushState + ajax）プラグインもありブラウザ間の挙動の差異を許容してくれるクライアントや案件ならぜひ実装したいところ。ただ問題点もあるのでその辺りはtakazudoさんの記事が参考になる。

* [Davis.jsでHistory APIを比較的お手軽に使う - Takazudo hamalog](http://hamalog.tumblr.com/post/8177396934/davis-js-history-api 'Davis.jsでHistory APIを比較的お手軽に使う - Takazudo hamalog')

その他pjaxに関する参考リンクは下記から。

* [defunkt/jquery-pjax](https://github.com/defunkt/jquery-pjax/ 'defunkt/jquery-pjax')
* [pjax こそが pushState + Ajax の本命 - punitan (a.k.a. punytan) のメモ](http://d.hatena.ne.jp/punitan/20110404/1301895279 'pjax こそが pushState + Ajax の本命 - punitan (a.k.a. punytan) のメモ')
* [pjaxで実現する超高速Web | monoの開発ブログ](http://blog.monoweb.info/article/2011050321.html 'pjaxで実現する超高速Web | monoの開発ブログ')
* [第19回html5とか勉強会 pjax](http://www.slideshare.net/KensakuKOMATSU/19html5 '第19回html5とか勉強会 pjax')
* [githubのURLをうまく扱うオシャレなアレ = pjax  @  val it: α → α = fun](http://www.jmuk.org/diary/index.php/2011/06/03/pjax/ 'githubのURLをうまく扱うオシャレなアレ = pjax  @  val it: α → α = fun')

お次はMVCのV、ビューとテンプレートについて。
