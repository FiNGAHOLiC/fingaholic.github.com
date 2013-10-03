---
layout: post
category: javascript
title: ステートフルJavaScript 11章 その1
date: 2012-08-01
summary: ステートフルJavaScript11章の備考録、っていうか写経。MVCライブラリSpineの解説。
---

まずはSpineの概要と使用方法。

**Githubのサンプルコードは1年以上前のもので、2012年8月7日時点で[最新版のSpine.js](http://spinjs.com/ '最新版のSpine.js')の記法と違ってるので注意。あくまでもモデルやコントローラの連携部分を確認する程度に留めておいたほうがよさげ。**

> Spine（[http://spinjs.com/](http://spinjs.com/ 'http://spinjs.com/')）はJavaScriptアプリケーション開発のための軽量なライブラリであり、本書で紹介した概念の多く（MVC、イベント、クラス）を実際に活用しています。本当に軽量であり、最小化と圧縮を経た500行程度のライブラリはわずか2キロバイトほどです。しかし軽量だからといって機能が乏しいわけではなく、クリーンで疎結合なコードによって高機能なJavaScriptアプリケーションを作成できます。

著者であるmaccman（Alex MacCaw）氏が開発したMVCフレームワーク。IE6、IE7のようなネイティブでJSONをサポートしていない古いブラウザでも動作させる場合にはクロックフォード御大謹製の[JSON2ライブラリ](https://github.com/douglascrockford/JSON-js/ 'JSON2ライブラリ')が必要。

> Spineはデータをユーザー向けに表示するための方法については何も規定していません。Spineでの力点は柔軟さとシンプルさの実現にあります。Spineは骨組みの部分だけを提供し、アプリケーションロジックの実現という開発者にとっての楽しみには干渉しません。

骨組みの部分、まさにBackboneを担うライブラリ。

> Spineには継承をサポートしたクラスライブラリ（Spine.Class）、イベントモジュール（Spine.Events）、ORM（Spine.Model）、そしてコントローラ（Spine.Controller）が含まれています。その他必要なライブラリ（テンプレートやDOM操作など）については使い慣れたものを利用できます。ただし、jQueryとZepto.jsについてはこれらを保管する機能を用意しています。

Zepto.jsはjQueryライクに使用出来るわずか軽量のJavaScriptライブラリ。その軽さからモバイル向けに力を発揮するみたいだけどもちろんPC向けにも使用出来る。モダンブラウザ向けのライブラリなのでIE全般には対応しておらず、使用する際には注意する必要がある。

* [Zepto.js: the aerogel-weight jQuery-compatible JavaScript library](http://zeptojs.com/ 'Zepto.js: the aerogel-weight jQuery-compatible JavaScript library')

# 11.1 セットアップ

> Spineの機能はすべてSpineという名前空間の中に存在するため、他の変数と競合することはありません。したがって、jQueryやZepto.jsあるいはPrototypeなどのライブラリがインクルードされていても問題は発生しないはずです。

[3章](/posts/2012-07-17-stateful-javascript.html '3章')で述べられてたやつも当然盛り込んでますよと。

# 11.2 クラス

> 新しいクラスを定義するには、Spine.Class.create(instanceProperties, classProperties)を呼び出します。各プロパティは省略可能です。呼び出し例を示します。

まずは親クラスUserを作成。ちなみに初期化時にnameプロパティを設定。

```javascript
var User = Spine.Class.create({
	name: 'Caroline'
});
```

子クラスFriendを作成するには再度create関数で。

```javascript
var Friend = User.create();
```

親クラスのプロパティも継承されてる。

```javascript
assertEqual(Friend.prototype.name, 'Caroline');
```

## 11.2.1 インスタンス化

> コンストラクタ関数の代わりに純粋なプロトタイプオブジェクトと継承が使われているため、Spineではインスタンスの生成にnew演算子は利用できません。代わりに以下のようなinit()関数が用意されています。

```javascript
var user = User.init();
assertEqual(user.name, 'Caroline');

user.name = 'Trish';
assertEqual(user.name, 'Trish');
```

> inti()で指定した引数はすべて、クラスが持つ初期化のための関数init()に渡されます。コードは以下のようになります。

```javascript
var User = Spine.Class.create({
	init: function(name){
		this.name = name;
	}
});

var user = User.init('Martina');
assertEqual(user.name, 'Martina');
```

## 11.2.2 クラスの拡張

> クラスプロパティとインスタンスプロパティを追加できるのはクラスの定義時だけではなく、それぞれinclude()とextend()を使ってもプロパティの追加が可能です。これらの関数にはプロパティをオブジェクトリテラルとして渡します。

```javascript
User.include({
	// インスタンスプロパティ
});

User.extend({
	// クラスプロパティ
});
```

この辺りも[1章](/posts/2012-06-27-stateful-javascript.html '1章')、[3章](/posts/2012-07-17-stateful-javascript.html '3章')あたりを読んでいると実装方法に違いがないのが分かる。

> include()とextend()によって、複数箇所で最利用可能なモジュールを実現できるようになります。利用例は以下のようになります。

```javascript
var ORM = {
	extended: function(){
		// extend()が実行された際に呼び出されます
		// this === User
	},
	find: function(){ /* ... */ }
	first: function(){ /* ... */ }
};

User.extend(ORM);
```

> include()やextend()が呼び出された際のコールバックを定義することもできます。このコードでは、User.extend()が呼び出された際にUserというコンテキストのもとでextended()コールバックが呼び出されます。同様に、モジュールにincludedという定義がされていれば、include()が呼び出された際にこのプロパティがコールバック関数として呼び出されます。
> 継承はプロトタイプに基づいているため、クラスに対して追加されたプロパティは子クラスへも動的に反映されます。

```javascript
var Friend = User.create();

User.include({
	email: 'info@eribium.org'
});

assertEqual(Friend.init().email, 'info@eribium.org');
```

> 子クラスで上書きされたプロパティは、親クラスに影響を及ぼしません。しかし、子クラスが持つオブジェクト（配列など）を変更すると、その変更は継承関係を持つクラス全体に影響します。特定のクラスあるいはインスタンスに固有のオブジェクトを定義するには、クラスあるいはインスタンスが最初に初期化される際に定義を行う必要があります。このために用意された関数がcreated()であり、下記のように利用します。

```javascript
// records配列はクラス固有にします
var User = Spine.Class.create({
	// インスタンス化時に呼ばれます
	init: function(){
		this.attributes = {};
	}
}, {
	// クラスの生成時に呼ばれます
	created: function(){
		this.records = [];
	}
});
```

## 11.2.3 コンテキスト

> コンテキストの変更はjavaScriptのプログラムの中で頻繁に行われており、Spine.Classでもコンテキストすなわち有効範囲の制御のためのユーティリティ関数をいくつか用意しています。まずは例として、正しく機能しないコードを紹介します。

```javascript
var Controller = Spine.Class.create({
	init: function(){
		// イベントリスナを追加します
		$('#destory').click(this.destroy);
	},
	destroy: function(){
		// この関数は誤ったコンテキストのもとで呼ばれるため、
		// thisへの参照は問題を引き起こします。
		// このアサーションは失敗します
		assertEqual(this, Controller.fn);
	}
});
```

> このコードでは、イベントが発生すると（Controllerではなく）#destroyという要素をコンテキストとしてdestroy()関数が呼び出されてしまいます。この問題に対処するには、コンテキストの中継を行い期待するコンテキストへと置き換える必要があります。Spineではこのためにproxy()関数が用意されています。利用例は以下のとおりです。

```javascript
var Controller = Spine.Class.create({
	init: function(){
		$('#destroy').click(this.proxy(this.destroy));
	},
	destroy: function(){}
});
```

これまた[1章](/posts/2012-06-27-stateful-javascript.html '1章')、[4章](2012-07-20-stateful-javascript.html '4章')と同様の実装。

> コンテキストの中継を何度も記述するのは面倒に思われるかも知れません。このような場合は、以下のようにproxyAll()関数を利用できます。

```javascript
var Controller = Spine.Class.create({
	init: function(){
		this.proxyAll('destroy', 'render');
		$('#destroy').click(this.destroy);
	},

	// これらの関数は正しいコンテキストのもとで呼ばれます
	destroy: function(){},
	render: function(){},
});
```

> proxyAll()には複数の関数の名前を配列として指定します。proxyAll()が実行されると、指定されている関数が書き換えられ、適切なコンテキストのもとで処理が行われるようになります。この例では、destroy()とrender()がローカルなコンテキストのもとで実行されるようになります。

この辺りの処理は後々解説するMVCフレームワーク、Backbone.jsとほぼほぼ違いはない。

# 11.3 イベント

> イベントはSpineにとって非常に重要であり、内部的にも多用されています。Spineでのイベント関連機能はSpine.Eventsモジュールに含まれています。このモジュールはどこでも利用でき、例えば以下のようにSpineのクラスにもイベントの機能を追加できます。

```javascript
var User = User.Class.create();
User.extend(Spine.Events);
```

> Spine.Eventsにはイベント処理のための関数が3つ用意されています。

* bind(eventName, callback)
* trigger(eventName, \[\*data\])
* unbind(eventName, \[callback\])

> jQueryのイベントAPIを使ったことがあるなら、これらの関数に違和感を覚えることはないはずです。Userクラスに対してイベントの関連付けを行い、そしてイベントを発生させてみましょう。

```javascript
User.bind('create', function(){ /* ... */ });
User.trigger('create');
```

> 複数のイベントを1つのコールバックで処理したい場合は、以下のようにイベント名を空白で区切って指定します。

```javascript
User.bind('create update', function(){ /* ... */ });
```

> trigger()には、イベント名とコールバックに渡される引数（省略可能）を指定します。

```javascript
User.bind('countChange', function(count){
	// countの値はtrigger()から渡されます
	assertEqual(count, 5);
});

User.trigger('countChnage', 5);
```

> Spineのイベントが最も使われるのはデータバインディング関連の処理です。ここではアプリケーションのモデルとビューが協調して動作します。これについては「11.6 連絡先管理アプリケーションの作成」で詳しく開設します。

# 11.4 モデル

> Spineのソースコードを見ると、その大部分がモデル関連の記述に費やされていることがわかります。モデルはMVCアプリケーションで中心的な役割を果たし、データの操作や保管を受け持ちます。Spineには完全な機能を持ったORMが用意されており、これらの作業を簡素化してくれます。
> create()という関数はすでに使われているため、新しいモデルの作成にはSpine.Model.setup(name, attrs)という関数を使います。ここにはモデルの名前と、属性名の配列を引数として渡します。

```javascript
// Taskモデルを作成します
var Task = Spine.Model.setup('Task', ['name', 'done']);
```

> インスタンスプロパティやクラスプロパティを追加するには、それぞれ以下のようにinclude()とextend()を利用します。

```javascript
Task.extend({
	// 終了したタスクを返します
	done: function(){ /* ... */ }
});

Task.include({
	// デフォルトの名前
	name: '空のタスク...',
	done: false,
	toggle: function(){
		this.done = !this.done;
	}
});
```

> レコードをインスタンス化するには、プロパティの初期値を表すオブジェクトを指定してinit()関数を呼び出します。

```javascript
var task = Task.init({ name: '犬の散歩' });
assertEqual(task.name, '犬の散歩');
```

> 属性値の読み書きは通常のオブジェクトのプロパティと同様に行えます。また、attributes()関数はレコードが持つ属性をすべてオブジェクトリテラルとして返します。

```javascript
var task = Task.init();
task.name = '新聞を読む';
assertEqual(task.attributes(), {name: '新聞を読む'});
```

> レコードの保管には、それが新規であっても既存のものであってもsave()関数を利用します。レコードを新規保管する際にはID値が生成されます。保管されたレコードはローカルのメモリ上に保持されます。

```javascript
var task = Task.init({ name: '本を完成させる' });
task.save();
task.id //=> '44E1DB33-2455-4728-AEA2-ECBD724B5E7B'
```

> レコードを取得するにはモデルのfind()関数を利用します。以下のように、引数としてレコードのIDを指定します。

```javascript
var task = Taks.find('44E1DB33-2455-4728-AEA2-ECBD724B5E7B');
assertEqual(task.name, '本を完成させる');
```

> 指定されたIDに対応するレコードが存在しない場合、例外が発生します。exists()関数を使えば、レコードが存在するかどうかを調べることができます。

```javascript
var tastExists = Task.exists('44E1DB33-2455-4728-AEA2-ECBD724B5E7B');
assert(taskExists);
```

> destroy()関数はローカルに存在するレコードを削除します。コードは以下のとおりです。

```javascript
var task = Task.create({ name: '魚をありがとう' });

assert(task.exists());
task.destroy();
assertEqual(task.exists(), false);
```

## 11.4.1 レコードの検索

> ID以外にもレコードの検索を行う手段が用意されています。一般的に、すべてのレコードを取り出したり、指定された条件に適合するレコードだけを取り出したりするという操作がよく行われます。Spineではこれらのためにall()、select()、each()という関数が用意されています。

```javascript
// すべてのタスクを返します。
Task.all(); //=> [Object]

// done属性がfalseのタスクを返します
var pending = Task.select(function(task){
	return !task.done;
});

// それぞれのタスクについてコールバックを呼びます
Task.each(function(task){
	/* ... */
});
```

> また、属性の値に基づいてレコードを取得するためのヘルパ関数もいくつか存在します。

```javascript
// 指定された属性の値を持つ最初のタスクを返します
Task.findByAttribute(name, value); //=> Object

// 指定された属性の値を持つタスクをすべて返します
Task.findAllByAttribute(name, value); //=> [Object]
```

## 11.4.2 モデルのイベント

> モデルのイベントに対してコールバックを関連づけ、レコードが変更された際に呼び出されるようにできます。コードは以下のようになります。

```javascript
Task.bind('save', function(record){
	console.log(record.name, 'は保存されました！');
});
```

> レコードに変化が生じると、そのレコードがコールバックに渡されます。モデルに対してイベントリスナを設定すると、どのレコードへの変更についてもリスナが呼び出されます。以下のように、特定のレコードに対してのみリスナを設定することもできます。

```javascript
Task.first().bind('save', function(){
	console.log(this.name + 'は保存されました！');
});

Task.first().updateAttributes({ name: '女王様とのお茶会' });
```

> イベントには以下のような種類があります。trigger()を使えば独自のイベントを定義することもできます。

<dl>
	<dt>save</dt>
	<dd>レコードが保管（新規作成または更新）されると発生</dd>
	<dt>update</dt>
	<dd>レコードが更新されると発生</dd>
	<dt>create</dt>
	<dd>レコードが新規作成されると発生</dd>
	<dt>destroy</dt>
	<dd>レコードが破棄されると発生</dd>
	<dt>change</dt>
	<dd>以上のいずれかの操作で発生</dd>
	<dt>refresh</dt>
	<dd>すべてのレコードが無効化され置き換えられると発生</dd>
	<dt>error</dt>
	<dd>データの検証に失敗すると発生</dd>
</dl>

> モデルのイベントはアプリケーションに不可欠です。モデルとビューを組み合わせる際には特に重要です。

## 11.4.3 データの検証

> データの検証（バリデーション）は、モデルインスタンスのvalidate()関数を上書きするという極めてシンプルな形で実現されています。レコードが保管される際には必ずvalidate()が呼び出されます。この関数から何か値が返されたら、検証は失敗したということを意味します。何も返されなかった場合は処理が続行され、レコードは正しく保管されます。validate()の例を紹介します。

```javascript
Task.include({
	validate: function(){
		if(!this.name) return '名前は必須です';
	}
});
```

> 検証に失敗した場合、失敗の理由を表す文字列が返されます。この文字列を使い、エラーの内容や修正方法についてユーザーに知らせることができます。

```javascript
Task.bind('error', function(record, msg){
	// 簡単なエラー通知
	alert('タスクは保存されませんでした: ' + msg);
});
```

> 検証に失敗するとモデルのerrorイベントも発生します。コールバックにはレコードとエラーメッセージが渡されます。

## 11.4.4 永続化

> Spineでのレコードは常にメモリ上に保持されますが、HTML5のローカルストレージやAjaxリクエストなどをバックエンドとして選択することもできます。
> ローカルストレージは非常に簡単に利用できます。spine.model.local.jsというJavaScriptファイルをインクルードし、以下のようにしてSpine.Model.Localモジュールをモデルに追加します。

```javascript
// ローカルストレージに保存します
Task.extend(Spine.Model.Local);
Task.fetch();
```

> ブラウザのローカルストレージからレコードを自動的に取り出すことはできず、fetch()関数を使って既存のデータを一括して取り出すことになります。この処理はアプリケーションの初期化処理がモデル以外についてすべて完了してから呼ばれることが多いでしょう。モデルに新しいデータがセットされるとrefetchが発生します。

```javascript
Task.bind('refresh', function(){
	// タスクがすべて更新されました
	renderTemplate(Task.all());
});
```

> Ajaxを使った永続化も同様に行えます。spine.mode.ajax.jsをインクルードし、Spine.Model.Ajaxモジュールをモデルに追加します。

```javascript
// サーバー側に保存します
Task.extend(Spine.Model.Ajax);
```

> デフォルトでは、モデル名を複数形にしたものを元にしてURLが決定されます。したがって、この例ではTaskモデルのURLは/tasksになります。このデフォルトの設定を変更するには、クラスのURLプロパティを以下のように上書きします。

```javascript
// カスタムURLを追加します
Task.extend({
	url: '/tasks'
});

// サーバから新しいタスクを取得します
Task.fetch();
```

> Task.fetch()が呼び出されると、SpineによってGET形式のAjaxリクエストが/tasksに対して送信されます。ここではすべてのTaskオブジェクトを配列として含むJSON形式のレスポンスが想定されています。サーバが正当なレスポンスを返すとレコードが読み込まれ、refreshイベントが発生します。
> レコードの生成や更新あるいは破棄のたびにAjaxリクエストがサーバーに送信され、サーバとクライアントの間でデータの同期が保たれるようにしています。この際、サーバ側ではRESTに従ったリクエストを受付可能でなければなりません。これによって他種のクライアントからもシームレスなアクセスが可能になりますが、もちろん独自のリクエストを受け付けるようなカスタマイズをすることもできます。デフォルトでは以下のようなエンドポイントが想定されています。

```console
新規作成 => POST   /collection
読み込み => GET    /collection
更新     => PUT    /collection/id
破棄     => DELETE /collection/id
```

> クライアント側でのレコードが作成されると、POST形式のリクエストが送信されます。このリクエストにはレコードのJSON表現が含まれます。「卵を買う」というTaskインスタンスが作成されたとすると、以下のようなリクエストが発生することになります。

```console
POST /tasks HTTP/1.0
Host: localhost:3000
Origin: http://localhost:3000
Content-Length: 66
Content-Type: application/json

{ 'id': '44E1DB33-2455-4728-AEA2-ECBD724B5E7B', 'name': '卵を買う' }
```

> 同様に、レコードを破棄するとDELETE形式のリクエストが送信され、レコードを更新するとPUT形式のリクエスト（以下のコードを参照）が送信されます。PUTとDELETEについては、レコードのIDがURLの中で指定されます。

```console
PUT /tasks/44E1DB33-2455-4728-AEA2-ECBD724B5E7B HTTP/1.0

Host: localhost:3000
Origin: http://localhost:3000
Content-Length: 71
Content-Type: application/json

{ 'id': '44E1DB33-2455-4728-AEA2-ECBD724B5E7B', 'name': 'Buy more eggs' }
```

> SpineではAjaxを使った同期について、他の多くのライブラリとは異なる方式で処理を行なっています。クライアント側にレコードが保管された後でリクエストが送信されるため、クライアントがレスポンスを待つことはありません。これによってクライアントとサーバを完全に疎結合の状態に保つことができ、たとえサーバーが利用できなくても処理を続行できます。
> サーバとの疎結合の関係には3つの大きなメリットがあります。まず、ユーザーにとってインターフェースが高速でしかも停止せず、処理の完了を待つ必要がなくなります。また、コードをシンプルなものにできます。例えばサーバからのレスポンスを待つ間レコードを編集不可の状態にするといった処理の必要はありません。さらに、必要ならオフライン状態での操作にも対応できるようになります。
> サーバ側でデータの検証を行うのかと疑問に思った読者がいるかもしれません。Spineでは、検証はすべてクライアント側で行うと想定しています。サーバからエラーが返されるのは、サーバー側のプログラム自体に何らかの問題があるという特殊な場合に限られます。
> サーバがエラーのレスポンスを返した場合、モデル上でajaxErrorイベントが発生します。イベントハンドラには、レコード、XMLHttpRequestオブジェクト、Ajaxの設定、エラーを表すオブジェクトが渡されます。

```javascript
Task.bind('ajaxError', function(record, xhr, setting, error){
	// 不正なレスポンスが返されました
});
```

# 11.5 コントローラ

> 最後に紹介するコンポーネントがコントローラです。コントローラはアプリケーション全体を結びつける役割を果たします。一般的に、コントローラはDOMにイベントハンドラを追加し、テンプレートの描画を行い、そしてビューとモデルの同期を保ってくれます。コントローラを作成するには、以下のようにcreate()を呼び出すことによってSpine.Controllerの子クラスを定義します。

```javascript
jQuery(function(){
	window.Tasks = Spine.Controller.create({
		// コントローラのプロパティ
	});
});
```

> ページの状態変化の影響を受けないようにするために、コントローラはページ上の他の部分よりも後で読み込むのがよいでしょう。Spineを使ったサンプルコードでは、jQuery()への呼び出しの内部でコントローラが定義されています。こうすることによって、ドキュメントの準備ができてからコントローラが作成されることになります。
> Spineでのコントローラの名前は、関連するモデルの名前を複数形にして先頭を大文字にしたものというルールを定めます。ほとんどのコントローラはインスタンスプロパティだけを持ちます。これらはもっぱらインスタンス化の後で使われるためです。他のクラスト同様に、コントローラも以下のようにinit()関数を呼び出すことによってインスタンス化できます。

```javascript
var tasks = Tasks.init();
```

> コントローラにはDOMの要素が関連づけられており、elプロパティを通じてアクセスできます。以下のようにしてインスタンス化時に要素を指定することもできますが、デフォルトではdiv要素が自動生成されます。

```javascript
var tasks = Task.init({ el: $('#tasks') });
assertEqual(tasks.el.attr('id'), 'tasks');
```

> この要素は、テンプレートの追加やビューの描画の際に内部的に使われます。以下に例用例を示します。

```javascript
window.Tasks = Spine.Controller.create({
	init: function(){
		this.el.html('表示テスト');
	}
});

var tasks = Tasks.init();
$('body').append(tasks.el);
```

> また、init()関数に渡された引数はすべてコントローラのプロパティとしてセットされます。

```javascript
var tasks = Tasks.init({ item: Task.first() });
assertEqual(Task.first(), tasks.item);
```

## 11.5.1 プロキシ

> 「11.2.3 コンテキスト」で、イベントのコールバックをthis.proxy()でラップすることによってコールバックを適切なコンテキストのもとで実行するというコード例を紹介しました。これは非常に多用されるパターンであり、Spineではproxiedというショートカットを用意しています。コントローラのコンテキストで実行したい関数の名前を配列として記述し、proxiedプロパティにセットします。

```javascript
var Tasks = Spine.Controller.create({
	proxied: ['render', 'addAll'],
	render: function(){ /* ... */ },
	addAll: function(){ /* ... */ }
});
```

> こうすると、指定された関数は常に適切なコンテキストで実行されるようになります。コンテキストについて心配することなしに、render()などのコールバックをイベントハンドラとして設定できます。

## 11.5.2 要素

> コントローラ配下の要素に、ローカルなプロパティとしてアクセスできると便利なことがあります。Spineではこのためのショートカットとしてelementsが用意されています。セレクタとプロパティ名との関係を指定したオブジェクトを、コントローラのelementsプロパティにセットします。以下の例では、セレクタform input[type=text]にマッチする要素がthis.inputという変数として扱えるようになります。セレクタの評価はコントローラの要素elを基準として行われ、ページ全体が対象になるわけではない点に注意が必要です。

```javascript
// inputはインスタンス変数です
var Tasks = Spine.Controller.create({
	elements: {
		'form input[type=text]': 'input'
	},
	init: function(){
		// inputはフォームのinput要素を指します
		console.log(this.input.val());
	}
});
```

> コントローラのelが持つHTMLを置き換えた場合、要素への参照を更新するためにrefreshElements()を呼び出す必要があります。

## 11.5.3 イベントの委譲

> eventsプロパティを使うと、イベントリスナを一括して追加でき便利です。Spineの内部ではイベントのバブリング（「2.2 イベントの発生順序」参照）が行われており、コントローラの要素elに1つだけイベントリスナが設定されています。eventsプロパティと同様に、すべてのイベントの委譲も有効範囲はel内です。
> eventsプロパティで指定するイベントハンドラは**\"eventName selector\": \"callback\"**の形式で記述します。selectorは省略可能であり、省略されている場合はelに直接登録されます。省略されていない場合はイベント処理が委譲（[http://api.jquery.com/delegate/](http://api.jquery.com/delegate/ 'http://api.jquery.com/delegate/')参照）され、セレクタにマッチする子要素でイベントが発生した場合にイベントハンドラが呼び出されるようになります。この処理は動的に行われるため、elのコンテンツが変更されても正しく処理されます。利用例を以下に示します。

```javascript
var Tasks = Spine.Controller.create({
	events: {
		'keydown form input[type=text]': 'keydown'
	},
	keydown: function(e){ /* ... */ }
});
```

> この例では、セレクタにマッチするinput要素でkeydownイベントが発生したときにコントローラのコールバックkeydown()が呼び出されます。コールバックは適切なコンテキストのもとで呼び出されることがSpineによって保証されているため、ここではプロキシ関数を利用する必要はありません。
> コールバックにはeventオブジェクトが渡されます。この例ではこのオブジェクトから、どのキーが押されたかなどの情報が取り出されることになります。イベントの発生元の要素はeventのtargetプロパティにセットされています。

## 11.5.4 コントローラのイベント

> イベントの委譲に加え、コントローラはカスタムイベントにも対応しています。デフォルトでコントローラはSpine.Eventsをextend()しているため、bind()やtrigger()といったイベント関連の関数も利用できます。この仕組によってコントローラ間の独立性を保ったり、コントローラの内部構造としてこの仕組みを活用したりできます。

```javascript
var Sidebar = Spine.Controller.create({
	events: {
		'click[data-name]': this.click
	},
	init: function(){
		this.bind('change', this.change);
	},
	change: function(name){ /* ... */ },
	click: function(e){
		this.trigger('change', $(e.target).attr('data-name'));
	}
	// ...
});

var sidebar = Sidebar.init({ el: $('#sidebar') });
sidebar.bind('change', function(name){
	console.log('サイドバーが更新されました:', name);
});
```

> この例では別のコントローラからSidebarのchangeイベントに関連付けを行なっており、イベントを発生させることも可能です。2章でも紹介しましたが、カスタムイベントはアプリケーションの内部構造を定義する際に非常に有用であり、たとえ外部でイベントがまったく使われないとしてもその有用性は変わりません。

## 11.5.5 グローバルなイベント

> Spineではグローバルにイベントへの関連づけを行ったり、イベントを発生させたりできます。これは一種のパブリッシュ／サブスクライブであり、複数のコントローラが互いについて知らない場合でもコミュニケーションを行えるようになります。同時にコントローラ間の疎結合の関係も保たれます。これはグローバルなオブジェクトSpine.Appを通じて実現されます。どんなオブジェクトもこのSpine.Appに対してイベントの関連付けや発生を行えます。以下のようにして使います。

```javascript
var Sidebar = Spine.Controller.create({
	proxied: ['change'],
	init: function(){
		this.App.bind('change', this.change);
	},
	change: function(name){ /* ... */ }
});
```

> SpineのコントローラによってSpine.Appにthis.Appという別名が与えられており、タイピングの量を少しだけ削減できます。このコードでは、Sidebarコントローラがchangeというグローバルなイベントに関連付けを行なっています。他のコントローラやスクリプトが以下のようにしてこのイベントを発生させ、必要なデータを渡すことが可能です。

```javascript
Spine.App.trigger('change', 'message');
```

## 11.5.6 Renderパターン

> コントローラで利用可能なオブションの主なものについてここまで紹介してきたので、ここでは一般的な利用例について見てみましょう。
> モデルとビューを関連づける上でRenderパターンはとても有効です。コントローラがインスタンス化される際に、関連するモデルに対してイベントリスナを設定します。このイベントリスナはモデルが再読み込みあるいは変更された場合にコールバックとして呼び出されます。そしてイベントリスナは要素elを更新します。多くの場合、テンプレートによって描画された内容を元にelのコンテンツが置き換えられます。以上の処理を記述したのが以下のコードです。

```javascript
var Tasks = Spine.Controller.create({
	init: function(){
		Task.bind('refresh change', this.proxy(this.render));
	},
	template: function(items){
		return($('#taskTemplate').tmpl(items));
	},
	render: function(){
		this.el.html(this.template(Task.all()));
	}
});
```

> この方法はシンプルですがやや乱暴であり、レコードが1つでも変更されると表示全体が更新されてしまいます。単純な短いリストについてはこの方法でも十分ですが、個々の要素に対してより詳細な制御を行いたい場合もあります。例えばそれぞれの項目にイベントハンドラを設定したい場合などですが、このようなときに活用できるのがElementパターンです。

## 11.5.7 Elementパターン

> Elementパターンの機能は基本的にはRenderパターンと同一ですが、より細かな処理が可能です。ここではコントローラが2つ使われます。1つは項目の集合を管理し、もう1つは個々の項目を扱います。以下のコードを見れば、このパターンの仕組みをより良く理解できるでしょう。

```javascript
var TaskItem = Spine.Controller.create({
	// クリックイベントの処理をローカルのハンドラに委譲します
	events: {
		'click': 'click'
	},

	// 関数が正しいコンテキストとともに呼び出されることを保証します
	proxied: ['render', 'remove'],

	// イベントをレコードに関連づけます
	init: function(){
		this.item.bind('update', this.render);
		this.item.bind('destroy', this.remove);
	},

	// 要素を描画します
	render: function(item){
		if(item) this.item = item;
		this.el.html(this.template(this.item));
		return this;
	},

	// テンプレート（ここではjQuery.tmpl.js）を利用します
	tempalte: function(items){
		return($('#tasksTemplate').tmpl(items));
	},

	// 要素が破棄された後に呼び出されます
	remove: function(){
		this.el.remove();
	},

	// イベントを細かく管理でき、レコードへのアクセスも容易です
	click: function(){ /* ... */ }
});

var Tasks = Spine.Controller.create({
	proxied: ['addAll', 'addOne'],

	init: function(){
		Task.bind('refresh', this.addAll);
		Task.bind('create', this.addOne);
	},

	addOne; function(item){
		var task = TasksItem.init({item: item});
		this.el.append(task.render().el);
	},

	addAll: function(){
		Task.each(this.addOne);
	}
});
```

> このコードで、Tasksはレコードが新規作成された際の追加に責任を持ち、TasksItemは個々のレコードに対する変更や破棄のイベントに対する処理（必要に応じてレコードの再描画を行います）に責任を持ちます。コードは複雑になりましたが、いくつかの点でRenderパターンよりも優れています。
> まず、ElementパターンはRenderパターンよりも効率的です。項目が1つ変更されただけでリスト全体が再描画されてしまうようなことはなくなりました。また、個々の項目に対してはるかに詳細な制御が可能になりました。イベントハンドラ（例ではclick()）を設定したり、個々の項目単位で描画を行ったりできます。
