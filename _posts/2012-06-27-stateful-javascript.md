---
layout: post
category: javascript
title: ステートフルJavaScript 1章
date: 2012-06-27
summary: ステートフルJavaScript1章の備考録、っていうか写経。
---

# 1.1 初期のJavaScript

> JavaScriptが強力で動的なオブジェクト指向言語である

これって議論が分かれるところだけど書籍では**オブジェクト指向言語**と言い切っている。

# 1.2 アプリケーションの構造化

> 大規模なjavaScriptアプリケーションを作成する上で鍵になるのは、「javaScriptの」アプリケーションをつくろうとはしないことです。まず、独立性の高いコンポーネントへとアプリケーションを分割するべきです。

粒度が細かいほうが制作しやすいし管理もしやすいと。

# 1.3 MVCとは

> MVCはデザインパターンの1つであり、アプリケーションをデータ（Model）とプレゼンテーションレイヤ（View）そしてユーザーインタラクションレイヤ（Controller）の3つに分割するという概念です。

大抵のWEBアプリケーションはこう分割できるよねと。

> 1. ユーザーがアプリケーションを操作します。
> 2. コントローラが持つイベントハンドラが呼び出されます。
> 3. コントローラがモデルに対してデータを要求し、受け取ったデータをビューに渡します。
> 4. ビューがデータを表示します。

図にすると下記のリンク先の用な感じ？

* [f:id:kazuk_i:20110407073430p:image](http://f.hatena.ne.jp/kazuk_i/20110407073430 'f:id:kazuk_i:20110407073430p:image')

## 1.3.1 モデル

> モデルとは、アプリケーションのデータオブジェクトが格納される場所を意味します。

TwitterからTweet引っ張ってきてゴニョゴニョって場合だとTweetデータって感じか。

> モデルはビューやコントローラについて全く関知しません。

いわゆる疎結合ってやつですね。

```javascript
var user = users['foo'];
destroyUser(user);
```

上記はダメな例。
destroyUserが名前空間で保護されていない（グローバル関数になっている）ので、
同じ名前の関数があったら競合してしまう。

```javascript
var user = User.find('foo');
user.destroy();
```

上記は良い例。
destroy関数はUserインスタンスを通じて名前空間が限定されている。
また、継承できるので全てのモデルで関数を定義する必要もない。

## 1.3.2 ビュー

> ビューのレイヤはユーザーへの表示に相当し、ユーザーはこれに対してインタラクションを行います。
> JavaScriptアプリケーションでのビューは大部分がHTMLとCSSそしてJavaScriptテンプレートによって構成されます。

ビューもモデルと同様他の部分から切り離されているべきだと。

```html
<div>
	<script>
		function formatDate(date){
			/* ... */
		};
		${ formatDate(this.date) }
	</script>
</div>
```

上記はダメな例。
formatDate関数をビューの中に記述しているので保守が困難。

javascript

```javascript
var helper = {};
helper.formatDate = function(){ /* ... */ };
```

html

```html
<div>
	${ helper.formatDate(this.date) }
</div>
```

上記は良い例。
helperという名前空間で保護されているし、ロジックを外部に隔離出来ている。

## 1.3.3 コントローラ

> モデルとビューを結びつける役割を果たしているのがコントローラです。コントローラはビューからイベントや入力データを受け取り、これらを処理（モデルが呼び出されることもあります）し、その結果に基づいてビューを更新します。ページの読み込み時に、コントローラはビューに対してイベントハンドラを追加します。

仲介するだけでやっぱりコントローラも分離してる。

```javascript
var Controller = {};
(Controller.users = function($){
	var nameClick = function(){
		/* ... */
	};
	$(function(){
		$('#view .name').click(nameClick);
	});
})(jQuery);
```

これちょっと分からんかった。匿名関数いるのかな？jQuery用？nameClickって匿名関数無くてもプライベートになってる気がするけど。

# 1.4 モジュール性のためのクラス設計

JavaScriptのクラスやイベント等の基本的な概念をおさらい。

```javascript
var Person = function(name){
	this.name = name;
};

// Personオブジェクトをインスタンス化
var alice = new Person('alice');

// インスタンスをチェック
assert(alice instanceof Person);
```

慣習的にコンストラクタ関数の先頭は大文字に、必ずnew演算子と組み合わせて呼び出す。

```javascript
var Class = function(){
	var klass = function(){
		this.init.apply(this, arguments);
	};
	klass.prototype.init = function(){};
	return klass;
};

var Person = new Class();

Person.prototype.init = function(){
	// Personオブジェクトのインスタンス化時に呼び出されます。
};

// 使い方
var Person = new Person();
```

上記は新しいクラスをセットアップするための関数。
今後これをペースにクラスライブラリを作るみたい。

# 1.5 クラスへの関数の追加

## クラス関数

```javascript
Person.find = function(){ /* ... */ };
var person = Person.find(1);
```

## インスタンス関数

```javascript
Person.prototype.breath = function(){ /* ... */ };
var person = new Person;
person.breath();
```

## prototypeのエイリアスを使う

```javascript
Person.fn = Person.prototype;
Person.fn.run = function(){ /* ... */ };
```

# 1.6 クラスライブラリへのメソッドの追加

```javascript
var Class = function(){
	var klass = function(){
		this.init.apply(this, arguments);
	};
	klass.prototype.init = function(){};

	// プロトタイプにアクセスするためのショートカット
	klass.fn = klass.prototype;

	// クラスにアクセスするためのショートカット
	klass.fn.parent = klass;

	// クラスプロパティを追加します
	klass.extend = function(obj){
		var extended = obj.extended;
		for(var i in obj){
			klass[i] = obj[i];
		};
		if(extended) extended(klass);
	};

	// インスタンスプロパティを追加します
	klass.include = function(obj){
		var included = obj.included;
		for(var i in obj){
			klass.fn[i] = obj[i];
		};
		if(included) included(klass);
	};
	return klass;
};
```

クラスライブラリにクラスプロパティを追加するextend関数と、
インスタンスプロパティを追加するinclude関数を追加。

```javascript
var Person = new Class;

Person.extend({
	find: function(id){ /* ... */ },
	exists: function(id){ /* ... */ }
});

var person = Person.find(1);
```

上記がextend関数の使用例。

```javascript
var Person = new Class;

Person.include({
	save: function(id){ /* ... */ },
	destroy: function(id){ /* ... */ }
});

var person = new Person;
person.save();
```

上記がinclude関数の使用例。

```javascript
Person.extend({
	extended: function(klass){
		console.log(klass, "が拡張されました！");
	}
});
```

上記がコールバック（拡張が行われた時点で呼ばれる）の使用例。

# 1.7 プロトタイプを使ったクラスの継承

> JavaScriptはプロトタイプベースの言語であり、（クラスとインスタンスを区別するのではなく）プロトタイプすなわち原型というオブジェクトの概念を持ちます。プロトタイプオブジェクトとは、新しく生成されるオブジェクトに対して初期プロパティを与えるテンプレートのような役割を果たします。

```javascript
var Animal = function(){};

Animal.prototype.breath = function(){
	console.log('呼吸します');
};

var Dog = function(){};

// DogはAnimalを継承します
Dog.prototype = new Animal;

Dog.prototype.wag = function(){
	console.log('しっぽを振ります');
};

var dog = new Dog;
dog.wag();
dog.breath(); // 継承されたプロパティ
```

# 1.8 クラスライブラリに継承を追加する

```javascript
var Class = function(parent){
	var klass = function(){
		this.init.apply(this, arguments);
	};

	// klassのプロトタイプを変更します
	if(parent){
		var subclass = function(){};
		subclass.prototype.init = parent.prototype;
		klass.prototype = new subclass;
	};

	klass.prototype.init = function(){};

	// ショートカット
	klass.fn = klass.prototype;
	klass.fn.parent = klass;
	klass._super = klass.__proto__;

	/* include/extendのコード */

	return klass;
};
```

ちなみに__proto__にブラウザ間の互換性が無いので注意。

```javascript
var Animal = new Class;

Animal.include({
	breath: function(){
		console.log('呼吸します');
	}
});

var Cat = new Class(Animal);

// 使い方
var tommy = new Cat;
tommy.breath();
```

# 1.9 関数呼び出し

## apply関数

```javascript
function.apply(this, [1, 2, 3]);
```

## call関数

```javascript
function.call(this, 1, 2, 3);
```

## 元のコンテキストを保持する関数（jQueryなら$.proxy()）

```javascript
var porxy = function(func, thisObject){
	return (function(){
		return func.apply(thisObject, arguments);
	});
};

// 使用例
var clicky = {
	wasClicked: function(){
		/* ... */
	},
	addListeners: function(){
		$('.clicky').click(proxy(this.wasClicked, this));
	}
};
```

この辺りは下記参考リンクが分かりやすい。

* [Ginpen.com | 他人の能力を自分のものにできる .apply()で高度な成り済ましを](http://ginpen.com/2011/12/15/apply/ 'Ginpen.com | 他人の能力を自分のものにできる .apply()で高度な成り済ましを')

# 1.10 有効範囲を制限する

クラスライブラリにproxy関数を追加。

```javascript
var Class = function(parent){
	var klass = function(){
		this.init.apply(this, arguments);
	};
	klass.prototype.init = function(){};
	klass.fn = klass.prototype;

	// proxy関数を追加します
	klass.proxy = function(func){
		var self = this;
		return (function(){
			return func.apply(self, arguments);
		});
	};

	// インスタンスにも追加します
	klass.fn.proxy = klass.proxy;

	return klass;
};
```

下記使用例。

```javascript
var Button = new Class;
Button.include({
	init: function(element){
		this.element = jQuery(element);

		// click関数を中継します
		this.element.click(this.proxy(this.click));
	},
	click: function(){ /* ... */ }
});
```

ちなみにES5ならbindが使える。

```javascript
Button.include({
	init: function(element){
		this.element = jQuery(element);

		// click関数にバインドします
		this.element.click(this.click.bind(this));
	},
	click: function(){ /* ... */ }
});
```

古いブラウザ用のbindフォールバック

```javascript
if(!Function.prototype.bind){
	Function.prototype.bind = function(obj){
		var slice = [].slice;
		var args = slice.call(arguments, 1);
		var self = this;
		var nop = function(){};
		var bound = function(){
			return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
		};
		nop.prototype = self.prototype;
		bound.prototype = new nop();
		return bound;
	};
};
```

下記参考リンク。

* [bind - MDN](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind 'bind - MDN')
* [kriskowal/es5-shim ・ GitHub](https://github.com/kriskowal/es5-shim/ 'kriskowal/es5-shim ・ GitHub')

# 1.11 プライベート関数の追加

> 多くの開発者が、プライベートなプロパティには名前の先頭にアンダースコア（_）を付けるという対策だけで済ませてしまっています。今後状況は変わるかもしれませんが、アンダースコアによってそのプロパティがプライベートなAPIの一部であることが表明されてます。しかしこのアプローチは醜悪であり、筆者はこれを利用するつもりはありません。

ちょっとしたサイトなら工数の都合もあるからいいと思うけどWEBアプリではご法度。

```javascript
var Person = function(){};
(function(){
	var findById = function(){ /* ... */ };
	Person.find = function(id){
		if(typeof id == 'number'){
			return findById(id);
		};
	};
}());
```

上記ではfindById関数がプライベートになっている。

# 1.12 その他のクラスライブラリ

Spineってクラスライブラリもあるんすか。

# 1章で制作したクラスライブラリ

```javascript
var Class = function(parent){
	var klass = function(){
		this.init.apply(this, arguments);
	};
	if(parent){
		var subclass = function(){};
		subclass.prototype = parent.prototype;
		klass.prototype = new subclass;
	};
	klass.prototype.init = function(){};
	klass.fn = klass.prototype;
	klass.fn.parent = klass;
	klass._super = klass.__proto__;
	klass.extend = function(obj){
		var extended = obj.extended;
		for(var i in obj){
			klass[i] = obj[i];
		};
		if(extended) extended(klass);
	};
	klass.include = function(obj){
		var included = obj.included;
		for(var i in obj){
			klass.fn[i] = obj[i];
		};
		if(included) included(klass);
	};
	klass.proxy = function(func){
		var self = this;
		return (function(){
			return func.apply(self, arguments);
		});
	};
	klass.fn.proxy = klass.proxy;
	return klass;
};
```
