---
layout: post
category: sns
title: mixi、twitter、FacebookのLikeボタンを設置する
date: 2012-04-29
summary: Facebookだけじゃなく仕事でよく使うLikeボタンをまとめてみた。ちなみにjQuery使用前提だけどloadScript的な関数作っとけば代用は可能。
---

**下記コードはHTML5のコード内に埋め込む事が前提で、IE7以上での表示を想定しており、FacebookのLikeボタンはIE6だと「Permission denied」エラーが出るので、IE6にも対応させたい場合はiframeにする必要がある。**

[前回の記事][facebook]でHTMLからscript要素を分離したけど他のサービスのLikeボタン（といってもtwitterとmixiだけ）も分離してみた。ちなみに当ブログではmixiユーザーは恐らく見ないだろうから設置してない。

[facebook]: /posts/2012-04-26-facebook.html 'FacebookのLikeボタンを設置する'

```html
<!-- mixi -->
<div 
    data-plugins-type="mixi-favorite"
    data-service-key="15d1190b592fc08421499d8abc1f9e2d9e1a2858"
    data-size="medium"
    data-href=""
    data-show-faces="false"
    data-show-count="true"
    data-show-comment="false"
    data-width=""></div>

<!-- twitter -->
<a
    href="https://twitter.com/share"
    class="twitter-share-button"
    data-lang="ja">ツイート</a>

<!-- facebook -->
<div
    class="fb-like"
    data-send="false"
    data-layout="button_count"
    data-show-faces="false"
    data-font="verdana"></div>
```

ちなみにmixiに関しては下記ページにログインしてmixi Pluginから新規サービスを作成、対象となるページを登録してservice-keyを発行する必要がある。

* [mixi Developer Center](http://developer.mixi.co.jp/ 'mixi Developer Center')

```javascript
;(function($, window, document, undefined){

	$(function(){

		// mixi
		$.getScript('//static.mixi.jp/js/plugins.js#lang=ja');

		// twitter
		$.getScript('//platform.twitter.com/widgets.js');

		// facebook
		(function(){
			if(window.FB){
				FB.init({ cookie: true, xfbml: true });
			}else{
				$.getScript("//connect.facebook.net/ja_JP/all.js", function(){
					FB.init({ cookie: true, xfbml: true });
				});
			};
		}());

	});

}(jQuery, window, this.document));
```

Facebookに関してはロケールを明示的に示したかったので**パスをen_USからja_JP**に変更した。
また、appIdを発行している、する場合はinit時にappIdを渡す必要がある。

動作サンプルは下記。

<iframe style="width: 100%; height: 450px" src="http://jsfiddle.net/FiNGAHOLiC/jNNE7/embedded/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

ちなみに関係ないけどmarkdown記法の中にjsFiddleのiframe埋め込むとレンダリングがストップしたので調べてみると下記のようにiframeタグに適当な文字列を入れとくと解決した。

* [Issue #346: Inserting an iframe causes page rendering to be partial ・ mojombo/jekyll](https://github.com/mojombo/jekyll/issues/346 'Issue #346: Inserting an iframe causes page rendering to be partial ・ mojombo/jekyll')
