---
layout: post
category: javascript
title: ステートフルJavaScript 3章
date: 2012-07-17
summary: ステートフルJavaScript3章の備考録、っていうか写経。まずはモデル。
---

# 3.1 MVCと名前空間

> MVCパターンでは、データ管理はモデル（MVCのM）の中で行われます。モデルはビューやコントローラから切り離されていなければなりません。データの操作やふるまいに関するすべてのロジックは、モデルの中に適切な名前空間とともに保持されるべきです。

これはなかなか実践出来てないところ。
プラグイン化して管理、連携してるとモデルもビューもコントローラも混ぜ混ぜで書いてた。

```javascript
var User = {
	records: [ /* ... */ ]
};
```

> ユーザーの配列にUser.recordsという名前空間を与えることができました。ユーザーについての処理を行う関数も、Userモデル配下の名前空間に関連づけることにします。例えば以下のように、ユーザーのデータをサーバから取得するためのfetchRemoteという関数を定義します。

```javascript
var User = {
	records: [],
	fetchRemote: function(){ /* ... */ }
};
```

> モデルが持つプロパティをすべて名前空間の中に置くと、プロパティ名の競合を避けることができ。同時にMVCへの準拠を確実なものにできます。また、複雑に絡まり合った関数やコールバックでコードが収拾のつかない状況に陥るのを防ぐこともできます。

ここまでは大丈夫。

> 名前空間の考え方をさらに一歩進めて、Userのインスタンスに特有の関数をすべてUserオブジェクトに持たせることも可能です。例えば、ユーザーを削除するための関数destroy()があるとします。この関数はユーザーのオブジェクトを参照しているため、以下のようにUserインスタンスに対して呼び出せるようにするべきです。

```javascript
var user = new User;
user.destroy();
```

> これを実現するには、Userを単なるオブジェクトでなくクラスとして定義します。コードは以下のようになります。

```javascript
var User = function(atts){
	this.attributes = atts || {};
};
User.prototype.destroy = function(){
	/* ... */
};
```

> 特定のユーザーとの関連を持たない関数や変数については、以下のようにUserオブジェクト直下のプロパティとして宣言します。

```javascript
User.fetchRemote = function(){
	/* ... */
};
```

いわゆるクラスメソッドでクラスから生成されたオブジェクト間で共通で使用出来るメソッドとして設定してやると。

名前空間については下記が参考リンク。

* [peter.michaux.ca - JavaScript Namespacing](http://michaux.ca/articles/javascript-namespacing 'peter.michaux.ca - JavaScript Namespacing')

# 3.2 ORMの作成

> ORM（Object-Relational Mapping: オブジェクト関係マッピング）は従来、JavaScript以外の言語で使われるのが一般的でした。しかし、ORMは単に便利なデータ管理の手法であるだけではなく、モデルの利用法としても優れており、JavaScriptアプリケーションでも活用できます。例えば、ORMを使うとサーバ側のデータをモデルとして扱えます。ここではモデルのデータを変更すると、バックグラウンドでサーバーに対してAjaxリクエストが送信されます。また、モデルのインスタンスをHTMLの要素と関連づけることもできます。こうすると、インスタンスへの変更がビューに反映されることになります。

？ サーバーサイドがあんまよく分からんから何となくしか理解できない。。。

> 本質的に、ORMとは何らかのデータをラップしたオブジェクトのレイヤにすぎません。ORMはSQLデータベースの抽象化に使われるのが一般的ですが、ここではJavaScriptのデータ型を抽象化するためにORMを利用します。ORMというレイヤが加わると、独自の関数やプロパティを通じて単なるデータ構造により多くの機能を追加できるようになります。例えばデータの検証、監視、永続化あるいはサーバからのコールバックなどが、コードの再利用性を保ったまま実現できます。

ORMはこの文章だけだとちょっと掴みづらい。
ただどっかで見たことあるなーって思ったら「みんなのPython」、通称「みんPy」に分かりやすい説明が書いてあった。まさかこんなところで役に立つとは。
ちなみにWebで閲覧できるので下記参考リンクよりどうぞ。
著者の柴田淳さんに感謝。

> 　既に解説してきたとおり、データベースでデータを扱う手法と、Pythonのようなオブジェクト指向的なデータの扱い方の間には大きなギャップがあります。データベースではデータとデータを操作するための手続きが完全に分離しています。対してオブジェクト指向言語では、データと手続きが一体になっています。データを扱う時の考え方がそもそも異なるので、プログラムの中でデータベースを扱うときには、非Pythonな方法でデータを扱う必要が出てきます。
> 　Webアプリケーションにかぎらず、データの操作を行う処理は、プログラムの基本部分といってよいくらい重要な部分です。そのような重要な部分に、非Python的な手法を使わなければならないとすると、プログラムは手軽に書けなくなってしまいます。インスタンスの生成、アトリビュートへの代入やメソッド呼び出しなど、Python的な手法を使ってデータベースを操作できれば、もっと手軽に、かつ簡潔にプログラムが書けるようになるはずです。
> 　**O/Rマッパー**は、データベースとオブジェクト指向言語の間にあるギャップを埋める役割でよく利用される仕組みです。「O」は「オブジェクト」、「R」は「リレーショナル」を意味します。オブジェクト指向言語で利用されるオブジェクトと、リレーショナルデータベースのデータをうまくマッピングし、間を取り持ってくれる仕組みのことを指します。
> O/Rマッパーにはたくさんの種類があり、マッピングの手法もいろいろとあります。O/Rマッパー全体に共通しているのは、**データベース上のデータをオブジェクトとして扱える**という特徴です。データを取り出したり、データを更新するために、SQL文字列を作る必要がほとんどありません。数値や文字列など、ごく普通のデータと同じように、データベース上のデータを扱えるのです。
> 　O/Rマッパーを使っても、データベースと通信するためにはどこかで誰かがSQL文字列を作る必要があります。データベースとの実際の通信はO/Rマッパーが裏側で密かに実行しています。O/Rマッパー自体に、便利なメソッドが定義してあったり、演算子のオーバーライドといった手法を活用して、SQL文字列を組み立てｍ適切にデータベースと更新を行うような作りになっているわけです。

PythonをJavaScriptに脳内補完すればなんとなくイメージはつかめると思う。

* [オブジェクト関係マッピング - Wikipedia](http://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E9%96%A2%E4%BF%82%E3%83%9E%E3%83%83%E3%83%94%E3%83%B3%E3%82%B0 'オブジェクト関係マッピング - Wikipedia')
* [みんなのPython Webアプリ編 | Lindoc](https://lindoc.jp/docs/1163 'みんなのPython Webアプリ編 | Lindoc')

## 3.2.1 プロトタイプによる継承

> ここでは、ORMの作成にObject.create()という関数を利用することにします。これは1章で紹介した例（クラスをベースにしています）とは少し異なります。コンストラクタ関数とキーワードnewを使う場合と比べて、Object.create()を使うとプロトタイプによる継承が可能になるというメリットがあります。

正直Object.create()ってあんま実務で使ってこなかった。

> Object.create()に引数としてプロトタイプオブジェクトを渡すと、そのプロトタイプに基づくオブジェクトが新たに生成されて返されます。言い換えると、渡したオブジェクトを継承した新しいオブジェクトが返されます。
ちなみにIEは対応してないため、下記を設定して追加してやる必要がある。

```javascript
if(typeof Objext.create !== 'function'){
	Object.create = function(o){
		var F = function(){};
		F.prototype = o;
		return new F();
	};
};
```

ちなみに上記はDouglas Crockfordの下記記事を元にしている。

* [Prototypal Inheritance](http://javascript.crockford.com/prototypal.html 'Prototypal Inheritance')

で、出来上がったのが下記コード。

```javascript
var Model = {
	inherited: function(){},
	created: function(){},
	prototype: {
		init: function(){}
	},
	create: function(){
		var object = Object.create(this);
		object.parent = this;
		object.fn = object.prototype;
		object.created();
		this.inherited(object);
		return object;
	},
	init: function(){
		var instance = Object.create(this.prototype);
		instance.parent = this;
		instance.init.apply(instance, arguments);
		return instance;
	}
};
```

> Object.create()を使い慣れていないと、このコードは奇妙なものに思えるかもしれません。細かく分割しながら見ていきましょう。この関数はModelオブジェクトを継承した新しいオブジェクトを返すので、これを新たなモデルを生成する際に使用することにします。したがって、init()関数はModel.prototypeから継承した新しいオブジェクトを返すことになります。例えば以下のように、Modelオブジェクトのインスタンスを取得できます。

もうちょっと細かく説明して欲しかったけど要するに、**Model.prototypeから継承した新しいオブジェクトを返す**っことね。
prototypeオブジェクトを内包してるのって確かにあまり馴染みがないから奇妙？に見えた。

## 3.2.2 ORMのプロパティを追加する

```javascript
// オブジェクトプロパティを追加します。
jQuery.extend(Model, {
	find: function(){}
});

// インスタンスプロパティを追加します。
jQuery.extend(Model.prototype, {
	init: function(atts){
		if(atts) this.load(atts);
	},
	load: function(attributes){
		for(var name in attributes){
			this[name] = attributes[name];
		};
	}
});
```

> jQuery.extend()というのは、forループを使ってすべてのプロパティを追加することを表す短縮記法であり、上記のload()関数とほぼ等価です。

これは1章でも出てきたやり方でプロパティを追加してるだけ。

> これから多数のプロパティを追加することになるので、以下のようにextend()とinclude()をModelオブジェクトの一部にしてしまいましょう。

```javascript
var Model = {

	/* ... */

	extend: function(o){
		var extended = o.extended;
		jQuery.extend(this, o);
		if(extended) extended(this);
	},
	include: function(){
		var included = o.included;
		jQuery.extend(this.prototype, o);
		if(included) included(this);
	}
};

// オブジェクトプロパティを追加します。
Model.extend({
	find: function(){}
});

// インスタンスプロパティを追加します。
Model.include({
	init: function(atts){ /* ... */ },
	load: function(attributes){ /* ... */ }
});

// オブジェクトを新規生成するのと同時に属性を追加
var asset = Asset.init({ name: 'foo.png' });
```

## 3.2.3 レコードの永続化

> レコードは何らかの手段で永続化しなければなりません。言い換えると、生成されたインスタンスへの参照を保存し、後でアクセスできるようにする必要があります。ここでは、Modelオブジェクトが持つrecordsというオブジェクトを通じて永続化を行います。ここにはインスタンスを保存する際に参照が追加され、インスタンスを削除する際に参照も合わせて削除されます。

```javascript
// 保存されたインスタンスへの参照
Model.records = {};

Model.include({
	newRecord: true,
	create: function(){
		this.newRecord = false;
		this.parent.records[this.id] = this;
	},
	destroy: function(){
		delete this.parent.records[this.id];
	}
});
```

> インスタンスが変更された場合は、以下のようにrecordsが保持している参照も更新されます。

```javascript
Model.include({
	update: function(){
		this.parent.records[this.id] = this;
	}
});
```

> ここで補助的な関数を用意し、インスタンスの保存状態や保存する必要の有無をチェックせずに済むようにします。コードは以下のようになります。

```javascript
// オブジェクトを連想配列recordsに格納し、参照を保持します
Model.include({
	save: function(){
		this.newRecord ? this.create() : this.update();
	}
});
```

> また、find()関数にID値を渡すと該当するオブジェクトが返されるようにします。

```javascript
Model.extend({
	find: function(id){
		return this.records[id] || throw('該当なし');
	}
});
```

ここまでのコードでちょっとまとめてみたのが下記。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/HWvJm/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

# 3.3 ID値の割り当て

> 現状のコードでは、レコードを保存する際には自分でIDの値を指定する必要があり非常に面倒です。これを自動化してみましょう。まず、GUID（Globally Unique Identifier）ジェネレータを使ってID値を生成します。技術的には、JavaScriptではAPIの制限もあり本来の意味でのGUIDを生成することはできず、擬似的な値しか生成できません。真にランダムなGUIDを生成するというのは非常に難しく、オペレーティングシステムではMACアドレスやマウスの位置、BIOSのチェックサム、電気的なノイズの量や放射線崩壊の測定値、ひいてはラバランプ（液体の中をかたまりが浮遊するインテリア用品）の状態などを元にしてGUIDを算出することもあります。しかし本書の目的に関する限り、JavaScriptにネイティブで用意されているMath.random()によって生成される擬似乱数でも十分です。

放射線崩壊の測定値とかそこまでやるんだ。
JavaScript関係ないけど勉強になります。

> Robert KiefferはMath.random()を利用した使いやすく簡潔なGUIDジェネレータを公開しています（[Broofa.com  &raquo; Blog Archive   &raquo; Javascript UUID Function](http://www.broofa.com/2008/09/javascript-uuid-function/ 'Broofa.com  &raquo; Blog Archive   &raquo; Javascript UUID Function')）。以下に示すとおり、コードはとてもシンプルです。

```javascript
Math.guid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	}).toUpperCase();
};
```

実際リンク先のコードを見るとtoUpperCase()関数がなかったり、基数や文字列を指定できたりするコードも追加されてるみたいだった。
また、ジェネレータには上記以外にも下記リンクもある。

* [generate random v4 UUIDs (107 bytes) &mdash; Gist](https://gist.github.com/1308368 'generate random v4 UUIDs (107 bytes) &mdash; Gist')

で、ORMにもGUIDジェネレータを組み込んでみる。

```javascript
Model.include({ // 本ではextendだけど
	create: function(){
		if(!this.id) this.id = Math.guid();
		this.newRecord = false;
		this.parent.records[this.id] = this;
	}
});
```

ちなみに本ではクラスメソッドにGUID生成の処理を入れてたけどこれをインスタンスメソッドで追加。
組み込んでみると正しく動作してるのを確認できた。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/sSGtW/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

# 3.4 参照の管理

> すでに気づかれている読者も多いと思われますが、ここまでのコードには参照の扱い方に関して明白な問題点が存在します。それは、インスタンスを保存するときやfind()が検索結果を返す際にインスタンスのクローンを作成していないという点です。そのため、プロパティを変更すると保存されているインスタンスも変更されてしまうことになります。これはupdate()関数が呼ばれた場合にのみ保存されているインスタンスを更新するという方針に反しています（以下のコードを参照）。

```javascript
var asset = new Asset({ name: 'foo' }); // Asset.init({ name: 'foo' });と同義？
asset.save();

// このアサーションは成功します
assertEqual(Asset.find(asset.id).name, 'foo');

// update()を呼び出さずにプロパティの値を変更します
asset.name = 'wem';

// おっと、nameの値はwemになっているのでアサーションは失敗します
assertEqual(Asset.find(asset.id).name, 'foo');
```

> そこでfind()関数が検索結果を返す際には新規生成されたオブジェクトを返すことにします。レコードが生成あるいは更新された場合にも、オブジェクトの複製を行います。

```javascript
Asset.extend({
	find: function(id){
		var record = this.records[id];
		if(!record) throw('該当なし');
		return record.dup();
	}
});

Asset.include({
	create: function(){
		this.newRecord = false;
		this.parent.records[this.id] = this.dup();
	},
	update: function(){
		this.parent.records[this.id] = this.dup();
	},
	dup: function(){
		return jQuery.extend(true, {}, this);
	}
});
```

> 問題点はもう1つあります。Model.recordsオブジェクトがすべてのモデルの間で共有されてしまっています。このことを示したのが以下のコードです。

```javascript
assertEqual(Asset.records, Person.records);
```

> 共有されることによって、以下のコードのようにすべてのレコードが混在してしまうという副作用が発生します。

```javascript
var asset = Asset.init();
asset.save();

assert(asset in Perosn.records);
```

> 新しいモデルを定義するたび、新しいrecordsオブジェクトを生成することによってこの問題は解消できます。生成時にコールバック関数Model.created()が呼び出されるので、この中でモデルに固有のオブジェクトをセットできます。具体的には以下のようにします。

```javascript
Model.extend({
	created: function(){
		this.records = {};
	}
});
```

# 3.5 データの読み込み

> 複数のページに区切られたリストを表示させるなら、ぜひ次のページを先読みするようにしましょう。よりよいやり方としては、ユーザーがリストをスクロールするのに合わせて自動的にデータを読み込んで表示させるというものがあります（Infinite Scrollパターンと呼ばれます）。いずれにせよ、ユーザーが感じる遅延をより少なくすることが望まれます。

大抵初期表示用のデータだけ取得して表示ってパターンが多いからこの次のページの先読みってのが目から鱗だった。
まあケースバイケースだとは思うけども。

> データを取得する際に、UIが停止しないようにしましょう。読み込み中であることを表すインジケータを表示させるとともに、その間もUIが引き続き利用可能なようにするべきです。UIの停止が必要とされるようなシナリオはほとんど考えられません。

ローダーの実装って実はすごく大事だっていう。ローダーの挙動って突き詰めると結構深かったりするし。
画像なし、CSS3（IE6はフォールバックでVML）を使用してローダーを実装できる[spin.js](http://fgnass.github.com/spin.js/ 'spin.js')とか効果的に使いたい。

> ページ上のデータは最初に読み込まれるページに含まれているか、AjaxあるいはJSONPを使ったHTTPリクエストによって事後的に読み込まれます。筆者としては後者のアプローチがお勧めです。多くのデータを初期表示のページに埋め込むことはページサイズの増大をもたらしますが、Ajax、JSONPによるリクエストは並列処理が可能であり高速です。またAjaxやJSONPを使って取得したページ自体とは別にキャッシュでき、リクエストのたびにページ全体を描画しなおす必要があります。

これスクリプト無効時の事を考えると必ずしも上記のようには出来ない（初期表示時のみサーバーサイドで初期表示用のデータを含んだHTML吐き出し）けど、そういうの考えなくていいならこうすべきなのかな。

## 3.5.1 初期表示のページヘの埋め込み

WEBアプリケーションじゃなければこれは全然いいと思う。

## 3.5.2 Ajaxによるデータの読み込み

まずはjQueryのAjaxのAPIの解説。
ただ内部で何をやってるか知っておく必要はあるのでMozilla Developerの記事にも目を通しておいたほうがよい。

* [Getting Started - MDN](https://developer.mozilla.org/ja/Ajax/Getting_Started 'Getting Started - MDN')
* [Ajax &#8211; jQuery API](http://api.jquery.com/category/ajax/ 'Ajax &#8211; jQuery API')

> Ajaxには同一生成元ポリシー（Same Origin Policy）という制約があります。これは、Ajaxリクエストの送信元はリクエスト元のページと同じドメインとサブドメインそしてポート番号の組み合わせを持っていなければならないというものです。このような制約の背景には、リクエストの際に対象ドメインのCookie情報が送信されてしまうという事情があります。つまり、リクエストを受け取ったサーバーはそれをログイン済みのユーザーからのものであると解釈してしまいます。同一生成元ポリシーがなかったとしたら、悪意を持ったアプリケーションはGmailのメールを盗み見したり、Facebookのステータスを勝手に変更したり、無断でTwitterのフォロワーにダイレクトメッセージを送ったりできてしまいます。このような事態を避けるために同一生成元ポリシーが適用されているのです。

ほうほう。

> Adobe FlashやJavaなどのテクノロジーではドメイン間アクセス向けのポリシーファイルを定義することによってこの問題を回避しています。近年ではAjaxの側でも、標準規格CORS（Cross-Origin Resource Sharing）によって他ドメインへのアクセスを認めようという動きがあります（[Cross-Origin Resource Sharing](http://www.w3.org/TR/access-control/ 'Cross-Origin Resource Sharing')）。

ただIE8未満は対応していない（IE8以降でも利用は出来るっぽいけどコンテンツタイプとしてtext/plainしかサポートしていない、認証、カスタムヘッダも利用できない等割りと酷いことになってるっぽい）。

## 3.5.3 JSONP

JSONPについての解説。実務レベルでクロスドメインリクエストを実装って考えると前項のCORSよりJSONPが一般的かと。

話は少しそれるけど、

```javascript
coolJsonpFunc({
	prop1: value1,
	prop2: value2,
	prop3: value3
})
```

叩くと上記のようなものが返って来るとすると、

```javascript
$.ajax({
	type: 'GET',
	url: url,
	dataType: 'jsonp',
	jsonpCallback: coolJsonpFunc
});
```

jsonpCallbackオプションでコールバック関数名を指定できる。

## 3.5.4 ドメイン間リクエストのセキュリティ

> CORSやJSONPで任意のドメインからのアクセスを許可している場合は、以下のような点が非常に重要です。

1. いかなるセンシティブな情報（メールアドレスなど）も公開してはなりません。
2. いかなるアクション（Twitterでのフォローなど）も許可してはなりません。

> これらの対策の代替として、接続を許可するドメインのリスト（ホワイトリスト）を定義したり、OAuthによる認証を必須にするといったものが考えられます。

この辺りの問題は古いのもあるけど下記参考リンク内の記事を読むと分かりやすかった。

* [なぜJSONPだとクロスドメイン制約を超えられるのか？ - 射撃しつつ前転](http://d.hatena.ne.jp/tkng/20100918/1284792040 'なぜJSONPだとクロスドメイン制約を超えられるのか？ - 射撃しつつ前転')
* [ここが危ない！Web2.0のセキュリティ：第2回　Same-Originポリシーと迂回技術｜gihyo.jp … 技術評論社](http://gihyo.jp/dev/serial/01/web20sec 'ここが危ない！Web2.0のセキュリティ：第2回　Same-Originポリシーと迂回技術｜gihyo.jp … 技術評論社')

# 3.6 データの配置

> ORMへのデータの配置は簡単に行えます。サーバーからデータを取得し、モデルのレコードを更新するだけです。Modelオブジェクトにpopulate()関数を追加し、取得したそれぞれのデータを元にインスタンスを生成し、recordsオブジェクトを更新するようにします。

```javascript
Model.extend({
	populate: function(values){
		// モデルとレコードをリセットします
		this.records = {};

		for(var i = 0, il = values.length; i < il; i++){
			var record = this.init(values[i]);
			record.newRecord = false;
			this.records[record.id] = record;
		};
	}
});
```

> このModel.populate()関数は、以下のようにしてサーバから受け取ったデータとともに呼び出します。

```javascript
jQuery.getJSON('/assets', function(result){
	Asset.populate(result);
});
```

# 3.7 データのローカル保存

HTML5のWebStorage（セッションストレージ、ローカルストレージ）APIについての解説。

これまではCookieをストレージとして使用してきたけどHTML5でWebStorageが登場してからはこちらが主流に。ただIE8以上でないと使用出来ないのでターゲットブラウザによるけどやっぱり実務的には厳しいところもある。polyfillとしてCookieは必須なのかも。

* [HTML5 × CSS3 × jQueryを真面目に勉強してみる ? #2 WebStorage ｜ Classmethod.dev()](http://dev.classmethod.jp/ria/html5/p19676/ 'HTML5 × CSS3 × jQueryを真面目に勉強してみる ? #2 WebStorage ｜ Classmethod.dev()')
* [Web Storage Sample](http://public-blog-dev.s3.amazonaws.com/wp-content/uploads/2012/02/storage_sample2.html 'Web Storage Sample')

## 3.7.1 ORMでのローカル保存

> これまでに作ってきたORMに、ローカルストレージを利用するための変更を行います。この変更によって、ページが再読み込みされてもレコードが保持されるようになります。localStorageオブジェクトを利用するには、レコードをJSON形式の文字列へとシリアライズする必要があります。しかし、単純にシリアライズすると以下の様な文字列が生成されてしまいます。

```javascript
var json = JSON.stringify(Asset.init({ name: 'foo' }));
json //=> '{'parent':{'parent':{'prototype':{}},'records':[]},'name':'foo'}'
```

> そこで、モデルがシリアライズされる際の処理内容を上書きする必要があります。まず、シリアライズするべきプロパティとそうでないものを区別します。Modelオブジェクトにattributesという配列を追加し、それぞれのモデルが属性すなわちプロパティを指定できるようにします。

```javascript
Model.extend({
	created: function(){
		this.records = {};
		this.attributes = [];
	}
});

Asset.attributes = ['name', 'ext'];
```

> 属性はモデルごとに異なり、複数のモデルが1つのattributes配列を共有することはできません。そのため、この配列はModelに直接追加するのではなく、モデルがインスタンス化されるたびに新しく生成するようにしています。これはrecordsオブジェクトの場合と同じアプローチです。
> 次にattributes()関数を定義します。この関数はそれぞれの属性とその値からなるオブジェクトを返します。コードは以下のようになります。

```javascript
Model.include({
	attributes: function(){
		var result = {};
		for(var i in this.parent.attributes){
			var attr = this.parent.attributes[i];
			resutl[attr] = this[attr];
		};
		result.id = this.id;
		return result;
	}
});
```

> モデルが持つattributes配列には以下のようにして値をセットします。

```javascript
Asset.attributes = ['name', 'ext'];
```

> このコードで指定された内容に基づき、attributes()関数はシリアライズの必要があるプロパティだけを正しく返します。

```javascript
var asset = Asset.init({ name: 'document', ext: '.txt' });
asset.attributes(); //=> { name: 'document', ext: '.txt' };
```

> シリアライズの処理を行うコード（JSON.stringify()）の側では、変更の必要があるのはモデルのインスタンスが持つtoJSON関数だけです。JSONのライブラリは、与えられたオブジェクトをそのままシリアライズするのではなく、この関数を通じてシリアライズ対象のオブジェクトを取得しているのです。変更は以下のようにして行います。

```javascript
Model.include({
	toJSON: function(){
		return (this.attributes());
	}
});
```

> ここまでのコードを使い、再びシリアライズを行なってみましょう。今度は必要なプロパティだけがシリアライズされているはずです。

```javascript
var json = JSON.stringify(Asset.records);
json //- '{'7B2A9E8D...':'{'name':'document','ext':'.txt','id':'7B2A9E8D...'}'}'
```

> 正しいJSON形式の文字列を生成できたので、後はローカルストレージを利用するためのコードを追加するだけです。ここではModelにsaveLocal()とloadLocal()という2つの関数を追加します。保存時にはModel.recordsオブジェクトを配列へと変換してからシリアライズし、生成された文字列をlocalStorageに格納します。

```javascript
var Model.localStorage = {
	saveLocal: function(){
		// レコードを配列に変換
		var result = [];
		for(var i in this.records){
			result.push(this.records[i]);
		};
		localStorage[name] = JSON.stringify(result);
	},
	loadLocal: function(name){
		var result = JSON.parse(localStorage[name]);
		this.populate(result);
	}
};

Asset.extend(Model.LocalStorage);
```

> レコードの取り出しはページの読み込み時に行い、ページが閉じられたらレコードを格納するのがよいでしょう。この部分のコードの作成については読者への宿題としておきます。

# 3.8 新規レコードのサーバへの送信

前節で作成したattributes()関数を使用して下記のようにしてレコードをサーバへ送信できる。

```javascript
jQuery.post('', asset.attributes(), function(result){
	/* AjaxによるPOSTリクエストが成功しました */
});
```

> REST（Representative State Transfer）のルールに従うなら、レコードを新規作成する際にはPOST形式のリクエストを行い、レコードを更新する際にはPUT形式を利用するべきです。以下のように、ModelのインスタンスにcreateRemote()とupdateRemote()という2つの関数を追加し、それぞれ適切な形式のリクエストを行うようにします。

```javascript
Model.include({
	createRemote: function(url, callback){
		$.post(url, this.attributes(), callback);
	},
	updateRemote: function(url, callback){
		$.ajax({
			url: url,
			data: this.attributes(),
			success: callback,
			type: 'PUT'
		});
	}
});
```

> Assetインスタンスに対してcreateRemote()を呼び出すだけで、レコードの内容がサーバへとPOST形式で送信されるようになりました。利用例を以下に示します。

```javascript
// 使い方
Asset.init({ name: 'json.txt' }).createRemote('/assets');
```

後半サンプルコードの全体像が分からなくなってちょっと疑問点残る箇所があるけど何となく掴めた。
この辺りは後々復習していこうかと。

次はMVCのC、コントローラ。
