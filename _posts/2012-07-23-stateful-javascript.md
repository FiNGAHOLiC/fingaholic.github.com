---
layout: post
category: javascript
title: ステートフルJavaScript 5章
date: 2012-07-23
summary: ステートフルJavaScript5章の備考録、っていうか写経。ビューとテンプレート。
---

> ビューはアプリケーションにとってのインターフェースであり、ユーザーはビューの表示を目にし、そしてビューに対して操作を行います。本書で作成しているコードでは、ビューはロジックを持たないHTMLの断片であり、アプリケーションのコントローラ（イベントハンドラやデータの操作を受け持ちます）によって管理されています。ビューの中にロジックを記述しようという強い誘惑にかられることがしばしばありますが、これはMVCによる抽象化に反しており、絶対に行ってはなりません。無意味なスパゲッティコードへとつながる行為は慎むべきです。

# 5.1 ビューの動的な描画

> ビューを生成する1つの方法として、JavaScriptのコードによって生成するというものがあります。DOMの要素を作成するにはdocument.createElement()関数を使用します。作成された要素にコンテンツをセットし、ページのDOMの中に追加します。ビューを再描画する場合は、要素コンテンツを空にしてから改めて描画を行います。一連の処理の例を以下に示します。

```javascript
var views = document.getElementById('#views');
views.innerHTML = ''; // 要素のコンテンツを空にします

var container = document.createElement('div');
container.id = 'user';
var name = document.createElement('span');
name.innerHTML = data.name;

container.appendChild(name);
view.appendChild(container);
```

> jQueryを使うとこのコードはよりシンプルにできます。

```javascript
$('#views').empty();

var container = $('<div />').attr({ id: 'user' });
var name = $('<span />').text(data.name);

$('#views').append(container.append(name));
```

> ただし、この手法が勧められるのはビューがきわめて小規模（要素が2個か3個程度）の場合に限られます。コントローラや状態機械にビューの要素をもたせると、アプリケーションのMVCアーキテクチャが損なわれます。
> 何もない状態から要素を生成するのではなく、静的HTMLをページ内に用意しておき、必要に応じて表示と非表示を切り替えるというのを筆者は推奨します。こうすることによって、ビューに固有のコードをコントローラの中から可能な限り排除でき、必要なら要素のコンテンツを更新することも可能です。

# 5.2 テンプレート

jQuery.tmpl（[http://api.jquery.com/category/plugins/templates/](http://api.jquery.com/category/plugins/templates/ 'http://api.jquery.com/category/plugins/templates/')）の概要、使用方法についての解説。Backbone.js使用時ならUnderscore.jsのtemplate()関数かjQuery.tmplの二択だろうか？

## 5.2.1 テンプレートヘルパ

> 日付や数字を出力するなどの目的で、汎用のヘルパ関数をビュー内に用意すると便利なことがあります。もちろん、MVCのアーキテクチャを常に意識していることは重要であり、ビューの中になんでも関数を追加すれば良いというわけではありません。例えば、プレインテキストの中にあるURLを&#60;a&#62;タグに置き換えたいとします。以下のようなコードは明らかに望ましくありません。

```javascript
<div>
	${
		this.data.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>');
	}
</div>
```

> 関数をビューに直接埋め込んでしまうのではなく、抽象化と名前空間の設定が必要です。こうすることによって、ロジックの詳細をビューから切り離せます。ここではhelpers.jsというファイルを用意し、補助的な関数を記述します。関数名はautoLink()とします。以下のように、ヘルパを使うとビューをシンプルに出来ます。

helper.js

```javascript
var helper = {};
helper.autoLink = function(data){
	var re = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
	return (data.replace(re, '<a href="$1" target="_blank">$1</a>'));
};
```

template.html

```html
<div>
	${ helper.autoLink(this.data) }
</div>
```

## 5.2.2 テンプレートの配置

下記のようにHTMLにカスタムのscriptタグを利用して埋め込む手法が推奨されている。

ちなみにここで言うカスタムのscriptタグとは、scriptタグでtype属性にtext/javascript以外を指定するとjavascriptとしてパースされずに無視されるので、ブラウザ上では認識されない文字列として使用出来る特性を利用したものを指す。

```html

<script type="text/x-jquery-tmpl" id="someTemplate">
	<span>${getName()}</span>
</script>

<script>
var data = {
	getName: function(){ return 'Bob'; }
};
var element = $('#someTemplate').tmpl(data);
element.appendTo($('body'));
</script>

```

> jQuery.tmplの内部では、1回利用されたテンプレートはコンパイルされキャッシュされています。そのため、2回目以降の処理では再コンパイルが不要になり高速です。なお、ここではテンプレートの処理を経た要素をページに追加しています。この方法はページ上にすでに存在する要素を操作する場合よりも高速であり、常にこの順番で処理を行うべきです。

# 5.3 バインディング

> バインディングを利用すると、クライアント側でビューを描画することの本当のメリットを実感できるはずです。本質的には、バインディングはビューの要素とJavaScriptのオブジェクト（通常はモデルを表します）を結びつけるための仕組みです。オブジェクトが変更されると、自動的にビューにも変更が反映されます。言い換えると、アプリケーションのモデルを更新するとビューが自動で再描画されます。
> バインディングは非常に重要です。ビューの更新はバックグラウンドで自動的に行われるため、コントローラのコードがビューを更新しなくても済むようになります。また、バインディングに基づいてアプリケーションを構成すると、8章で紹介するリアルタイムアプリケーションの実現も用意になります。
> JavaScriptのオブジェクトとビューの間にバインディングを設定するには、ビューに更新を指示するためのコールバックを用意します。オブジェクトのプロパティが変化した際にこのコールバックが呼び出されるようにしたいのですが、ネイティブなJavaScriptにはこのような仕組みが存在しません。RubyやPythonでのmethod_missingに相当するものはなく、JavaScriptのgetterとsetter（http://ejohn.org/blog/javascript-getters-and-setters/）を使ったエミュレーションも不可能です。しかしJavaScriptは高度に動的な言語であり、以下のようにしてコールバックを実現できます。

```javascript
var addChange = function(ob){
	ob.change = function(callback){
		if(callback){
			if(!this._change) this._change = [];
			this._change.push(callback);
		}else{
			if(!this._change) return;
			for(var i = 0; i < this._change.length; i++){
				this._change[i].apply(this);
			};
		};
	};
};
```

> このaddChange()関数は、引数として渡された任意のオブジェクトにchange()関数を追加します。change()はjQueryのchangeイベントとまったく同じようにふるまいます。change()を呼び出す際に引数として関数を渡すと、この関数がコールバックとして機能します。また、引数なしでchange()を呼び出しイベントを発生させることもできます。コードを見てみましょう。

```javascript
var object = {};
object.name = 'Foo';

addChange(object);

object.change(function(){
	console.log('変更されました！', this);
	// ビューの変更などを行います
});

object.change();

object.name = 'Bar';
object.change();
```

上記実行結果が下記。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/qm4rg/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

## 5.3.1 モジュールへのバインディング

下記モデルに対してのバインディングの実例。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/xg9VS/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>
