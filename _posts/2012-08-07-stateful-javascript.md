---
layout: post
category: javascript
title: ステートフルJavaScript 11章 その2
date: 2012-08-07
summary: ステートフルJavaScript11章の備考録、MVCライブラリSpineを使ったWebアプリケーション制作実践編。
---

# 11.6 連絡先管理アプリケーションの作成

いよいよ実践編。ソースコードは下記からダウンロード可能。

* [book-assets/ch11/spine.contacts at master ・ maccman/book-assets](https://github.com/maccman/book-assets/tree/master/ch11/spine.contacts 'book-assets/ch11/spine.contacts at master ・ maccman/book-assets')

また、コードは違うけどデモは下記から確認出来る。

* [App](http://spine-contacts.herokuapp.com 'App')

**Githubのサンプルコードは1年以上前のもので、2012年8月7日時点で[最新版のSpine.js](http://spinjs.com/ '最新版のSpine.js')の記法と違ってるので注意。あくまでもモデルやコントローラの連携部分を確認する程度に留めておいたほうがよさげ。また、本の中の解説とサンプルコードだと機能に少し違いがあり、ユーティリティ関数も混在してて見通しが悪かったのでMVC部分を重点に確認できるようにサンプルコードから関数を削ったり機能を省いたりしたりしてる。**

関係なくなった機能部分については引用を省いてHTMLは下記のように変更した。

```html
<div id="sidebar">
	<ul class="items"></ul>
		<footer>
			<button>新規連絡先</button>
		</footer>
	</div>
	<div id="contacts">
		<div class="show">
			<ul class="options">
				<li class="optEdit">連絡先の編集</li>
			</ul>
			<div class="content"></div>
		</div>
		<div class="edit">
			<ul class="options">
				<li class="optSave default">連絡先の保存</li>
				<li class="optDestroy">連絡先の削除</li>
			</ul>
		<div class="content"></div>
	</div>
</div>
```

## 11.6.1 Contactモデル

> 連絡先を表すContactモデルは正味5、6行程度のコードで定義されており、とてもシンプルです。ここにはfirst_name、last_name、emailという3つの属性が用意されています。テンプレートからの呼び出しを想定し、連絡先のフルネームを返すヘルパ関数も定義します。コードは以下のようになります。

```javascript
// Spineの最新版だと設定方法は変更されているので注意
var Contact = Spine.Model.setup('Contact', ['first_name', 'last_name', 'email']);

// ローカルストレージを利用するのでLocalを継承（要local.js）
Contact.extend(Spine.Model.Local);

// テンプレート内で使用するためにインスタンスメソッドを追加
Contact.include({
	fullName: function(){
		// ファーストネーム、ラストネームが設定されていない場合はfalseを返す
		if(!this.first_name && !this.last_name) return;
		return (this.first_name + ' ' + this.last_name);
	}
});
```

> ここではSpine.Model.Localがモデルに追加されています。これによってレコードがブラウザのローカルストレージに保存され、後で再びこのアプリケーションにアクセスしたときにも同じ連絡先を利用できます。

**ちなみにspine.model.local.jsも古いので最新版のspine.model.local.jsで作業する場合は使用方法については特別変更ないが念のため注意すること。**

## 11.6.2 Sidebarコントローラ

> このコントローラは、連絡先の一覧表示と現在選択されている項目の管理に責任を持ちます。連絡先が変更されると、コントローラは表示を更新して変更内容を反映させます。また、サイドバーには\[新規連絡先\]ボタンが表示され、コントローラはそのclickイベントを監視します。イベントが発生すると、空の連絡先が新規に作成されます。

```javascript
var Sidebar = Spine.Controller.create({

	// インスタンス変数を追加
	elements: {
		'.items': 'items'
	},

	// buttonをclickするとcreateメソッドを叩く
	events: {
		'click button': 'create'
	},

	// イベントのコールバックとして関数が呼び出された際に、
	// 正しいコンテキストのもとで実行されることを保証
	// 最新版だと削除されてる？
	proxied: ['render'],

	// テンプレートを描画
	template: function(items){
		return ($('#contactsTemplate').tmpl(items));
	},

	// 初期化処理
	init: function(){

		// レコード一覧を作成するクラスからインスタンスを作成
		// .itemクラスが必須（選択された要素には.currentクラスが付与される）
		// https://raw.github.com/maccman/book-assets/master/ch11/spine.contacts/lib/spine.list.js
		this.list = Spine.List.init({
			el: this.items,
			template: this.template
		});

		// リスト上で異なる項目が選択された際に、該当する連絡先を表示
		this.list.bind('change', this.proxy(function(item){

			// グローバルなSpine.Appに対してshow:contactイベントを発火（選択された項目を渡す）
			this.App.trigger('show:contact', item);

		}));

		// 連絡先が変更（あるいは新規作成）された場合に、
		// リスト上で選択されている項目を切り替えます
		// グローバルなSpine.Appに対してイベントを登録
		this.App.bind('show:contact edit:contact', this.list.change);

		// リストが更新あるいは変更された場合に再描画
		Contact.bind('refresh change', this.render);

	},

	// リストを描画
	render: function(){

		// 全モデルインスタンス取得
		var items = Contact.all();

		// listのrenderメソッドを実行（全モデルインスタンスを渡す）
		this.list.render(items);

	},

	// 新規作成のボタンがクリックされた際に呼ばれる
	create: function(){

		// 新規連絡先を追加
		var item = Contact.create();

		// グローバルなSpine.Appに対してedit:contactイベントを発火（新規モデルインスタンスを渡す）
		this.App.trigger('edit:contact', item);

	}
});
```

> コントローラのinit()関数の中で、見慣れないSpine.Listというクラスが利用されています。これはユーティリティのコントローラであり、レコードの一覧を作成するのに適しています。しかもSpine.Listには現在選択されている項目を管理する機能も用意されています。ユーザーが別の項目を選択すると、changeイベントが発生してイベントリスナに通知されます。
> ここでは、連絡先が作成あるいは変更されるとリスト全体が再描画されます。これによってコードはシンプルになりますが、処理速度が遅いと感じられたら修正が必要になるでしょう。
> template()の中で参照されている#contactsTemplateは以下のようなscript要素です。ここには、リスト中の個々の連絡先のためのテンプレートが記述されています。

**ちなみにspine.list.jsも古いので最新版のspine.list.jsで作業する場合は注意すること。**

```html
<script type="text/x-jquery-tmpl" id="contactsTemplate">
	<li class="item">
		{{"{{if fullName()"}}}}
			<div>${fullName()}</div>
		{{"{{else"}}}}
			<div>名前なし</div>
		{{"{{/if"}}}}
	</li>
</script>
```

> Spine.Listはこのテンプレートを使ってそれぞれの連絡先を描画し、現在選択されている項目のli要素にはcurrentというクラスを追加しています。

## 11.6.3 Contactsコントローラ

> Sidebarコントローラが連絡先の一覧を表示しつつ選択対象の項目を管理する一方、Contactsコントローラは選択されている連絡先の内容を表示します。コードは以下のとおりです。

```javascript
var Contacts = Spine.Controller.create({

	// インスタンス変数を追加
	elements: {
		'.show': 'showEl',
		'.edit': 'editEl',
		'.show .content': 'showContent'
	},

	// イベントのコールバックとして関数が呼び出された際に、
	// 正しいコンテキストのもとで実行されることを保証
	proxied: ['render', 'show'],

	// 初期化処理
	init: function(){

		// 初期表示では連絡先が表示される
		this.show();

		// リストが変更された場合に再描画
		Contact.bind('change', this.render);

		// サイドバーで異なる項目が押下されると発火（連絡先画面を表示）
		// グローバルなSpine.Appに対してイベントを登録
		this.App.bind('show:contact', this.show);

	},

	// currentプロパティに選択されたモデルを代入
	change: function(item){
		this.current = item;
		this.render();
	},

	// 選択されている要素の連絡先画面、連絡先編集画面を選択されたモデルを元に描画
	render: function(){
		this.showContent.html($('#contactTemplate').tmpl(this.current));
	},

	// 連絡先画面を表示
	show: function(item){

		// モデルが渡されていればchangeイベントを叩く
		if (item && item.model) this.change(item);
		this.showEl.show();
		this.editEl.hide();

	}

});
```

> サイドバーでいずれかの連絡先が選択されると、グローバルなshow:contactイベントが発生します。Contactsコントローラはこのイベントを監視し、イベントの発生時には選択された連絡先のオブジェクトを渡してshow()関数を呼び出します。そしてshowContentが指すdiv要素を再描画し、選択された連絡先の情報で表示を置き換えます。
> このコードでは#contactTemplateというテンプレートが参照されています。これはContactsの中で選択されている連絡先の内容を表示するために使われます。テンプレートは以下のようになります。

```html
<script type="text/x-jquery-tmpl" id="contactTemplate">
	<dl>
		<dt>名前</dt>
		<dd>${first_name} ${last_name}</dd>
		<dt>メールアドレス</dt>
		{{"{{if email"}}}}
			<dd>${email}</dd>
		{{"{{else"}}}}
			<dd>なし</dd>
		{{"{{/if"}}}}
	</dl>
</script>
```

> これで連絡先の情報を表示できるようになりましたが、編集や破棄はまだできません。そこで、Contactsコントローラを少し手直しします。.optEditと.optSaveの各要素がクリックされたときに表示モードと編集モードとの間で切り替えを行うというのが主な変更点です。また、#editContactTemplateというテンプレートを追加します。レコードを保存する際に、編集モードのフォームのinput要素を調べてレコードの属性を更新します。新しいコードは以下のようになります。

```javascript
var Contacts = Spine.Controller.create({

	// インスタンス変数を追加
	elements: {
		'.show': 'showEl',
		'.edit': 'editEl',
		'.show .content': 'showContent',
		'.edit .content': 'editContent'
	},

	// イベントの委譲
	events: {
		'click .optEdit': 'edit',
		'click .optDestroy': 'destroy',
		'click .optSave': 'save'
	},

	// イベントのコールバックとして関数が呼び出された際に、
	// 正しいコンテキストのもとで実行されることを保証
	proxied: ['render', 'show', 'edit'],

	// 初期化処理
	init: function(){

		// 初期表示では連絡先が表示される
		this.show();

		// リストが変更された場合に再描画
		Contact.bind('change', this.render);

		// サイドバーで異なる項目が押下されると発火（連絡先画面を表示）
		// グローバルなSpine.Appに対してイベントを登録
		this.App.bind('show:contact', this.show);

		// サイドバーで新規作成ボタンが押下されると発火（連絡先編集画面を表示）
		// グローバルなSpine.Appに対してイベントを登録
		this.App.bind('edit:contact', this.edit);

	},

	// currentプロパティに選択されたモデルを代入
	change: function(item){
		this.current = item;
		this.render();
	},

	// 選択されている要素の連絡先画面、連絡先編集画面を選択されたモデルを元に描画
	render: function(){
		this.showContent.html($('#contactTemplate').tmpl(this.current));
		this.editContent.html($('#editContactTemplate').tmpl(this.current));
	},

	// 連絡先画面を表示
	show: function(item){

		// モデルが渡されていればchangeイベントを叩く
		if (item && item.model) this.change(item);
		this.showEl.show();
		this.editEl.hide();

	},

	// 連絡先編集画面を表示
	edit: function(item){

		// モデルが渡されていればchangeイベントを叩く
		if (item && item.model) this.change(item);
		this.showEl.hide();
		this.editEl.show();

	},

	// 連絡先を削除
	destroy: function(){

		// 選択されているモデルデータを削除
		this.current.destroy();

	},

	// 連絡先を保存
	save: function(){

		// 指定された要素をシリアライズし、配列を返す
		var atts = this.editEl.serializeForm();

		// 選択されているモデルデータを更新
		// http://spinejs.com/api/models内のupdateAttributesAPI参照
		this.current.updateAttributes(atts);

		// 連絡先画面を表示
		this.show();

	}

});
```

> ここで使われている#editContactTemplateのテンプレートは以下のようになります。このテンプレートもページ内に記述する必要があります。#editContactTemplateと#contactTemplateは本質的によく似ており、異なるのは#editContactTemplateがinput要素を使ってレコードを表示しているという点だけです。

```html
<script type="text/x-jquery-tmpl" id="editContactTemplate">
	<dl>
		<dt>ファーストネーム</dt>
		<dd><input type="text" name="first_name" value="${first_name}" autofocus></dd>
		<dt>ラストネーム</dt>
		<dd><input type="text" name="last_name" value="${last_name}"></dd>
		<dt>メールアドレス</dt>
		<dd><input type="text" name="email" value="${email}"></dd>
	</dl>
</script>
```

## 11.6.4 Appコントローラ

> SidebarとContactsの各コントローラによって、Contactレコードの表示や選択あるいは編集などが可能になりました。後は、これらのコントローラをインスタンス化するためのAppコントローラだけです。インスタンス化の際に、それぞれのコントローラが必要としている要素を渡します。コードは以下のとおりです。

```javascript
var App = Spine.Controller.create({

	// el要素を設定
	el: $('body'),

	// インスタンス変数を追加
	elements: {
		'#sidebar': 'sidebarEl',
		'#contacts': 'contactsEl'
	},

	// 初期化処理
	init: function(){

		// Sidebarコントローラを初期化
		this.sidebar = Sidebar.init({ el: this.sidebarEl });

		// Contactsコントローラを初期化
		this.contact = Contacts.init({ el: this.contactsEl });

		// モデルデータをローカルストレージから取得
		Contact.fetch();

	}

});

// DOMContentLoaded後にinit()関数を叩く
$(function(){
	App.init();
});
```

下記が実装例。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/qSrJg/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>
