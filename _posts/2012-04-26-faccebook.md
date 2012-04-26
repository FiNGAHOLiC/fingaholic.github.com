---
layout: post
category: facebook
title: FacebookのLikeボタンを設置する
date: 2012-04-26
summary: 'このブログに設置するために久々に弄ってみたら相変わらずIEでエラー出まくるし一苦労したんでメモ。'
---

# まずは公式サイトへ

下記よりお好みのボタンを生成出来る。

* [Like Button - Facebook Developers](https://developers.facebook.com/docs/reference/plugins/like/ 'Like Button - Facebook Developers')

1. 「URL to Like」は設置されたページのURLを取って欲しいから空にした。
2. 「Send Button (XFBML Only)」不要なのでチェックを外した
3. 「Layout Style」は「standard」を選択。
4. 「Width」はとりあえずデフォルト値の「450」のまま。
5. 「Show Faces」は不要なのでチェックを外した。
6. 「Verb to display」は「like」を選択。
7. 「Color Scheme」は「light」。
8. 「Font」は「lucida grande」。

するとプラグインコード、HTML5、XFBML、IFRAMEの3種類からプラグインコードを選択できるので今回はHTML5を選択した。  

# 実際に設置する

## JavaScript SDKの読み込み

一度だけjavaScript SDK（Facebook APIを利用するためのJavaScript）をbodyタグの直後に挿入して読み込む。

{% highlight javascript %}
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=248454418530104";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
{% endhighlight %}

## ボタンのコードを設置

次のコードをボタンを設置したい場所に設置する。

{% highlight html %}
<div class="fb-like" data-send="false" data-width="450" data-show-faces="false" data-font="lucida grande"></div>
{% endhighlight %}

とまあこれだけで設置自体は簡単に出来る。  
ただHTMLの中にscriptタグがあるのも気持ち悪いんでこれをまずはどうにかしたい。

# scriptタグを外部jsに移動する

どうやらid付きのscriptタグを吐き出しているだけなのでDOMContentLoaded（onload後でもまあ可）後に実行すれば問題なさげ。外部jsには下記の様に設置した。それなりの設定をしてたら即時関数にする必要もないけど見やすいからこのまま。**ちなみにdiv#fb-rootはSDKで使用するのでbodyタグ直下に残しておくこと。**

{% highlight javascript %}
$(function(){
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=248454418530104";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
});
{% endhighlight %}

# OGPの設定をする

忘れがち。基本的には下記を参考にしながら設定しておくとスムーズ。

* [facebook いいねボタンの仕様変更?OGPの設定についてまとめました](http://www.html5-memo.com/facebook/iine111216/ 'facebook いいねボタンの仕様変更?OGPの設定についてまとめました')
* [サイトにFacebookのいいねボタンとOGPを導入してみる](http://www.misclog.com/socialmedia/98/ 'サイトにFacebookのいいねボタンとOGPを導入してみる')

# クリック時のポップアップを消したい。

こいつが邪魔なので消したい。特にレイアウトによっては不要なケースも多々あると思う。  
単純にポップアップのセレクタにdisplay:none;してやれば消える（!importantは必須）。

{% highlight css %}
/* http://facebook.stackoverflow.com/questions/3247855/facebook-like-button-how-to-disable-comment-pop-up */
.fb_edge_widget_with_comment span.fb_edge_comment_widget iframe.fb_ltr { display: none !important; }
{% endhighlight %}

# レスポンシブとかの場合に幅を変えたい

デフォルトの幅は450pxなのでブラウザの幅を縮めたりiPhoneで見ると横スクロールバーが出てうざい。ライクボタン自体の最小の幅っていうのはブラウザ間でまちまちなところもあったりボタンレイアウトによっても変わってくるのでこれは確認しながらちょこちょこ設定しなければならないのかも。とりあえずレスポンシブ時の最小幅は260pxくらいとこのブログでは設定してるので下記を設定しておいた。

{% highlight css %}
@media screen and (max-width:490px){
	.fb-like span, .fb-like span iframe{ width:260px !important; }
}
{% endhighlight %}

# IEでブラウザを縮小すると横スクロールバーが出る

980pxのサイトとかならいいけどレスポンシブ対応とかしてると謎のスクロールバーが出る。  
調べてみるとどうやら先述したdiv#rootが原因っぽいのでこいつを非表示にした。

{% highlight css %}
#fb-root{ display:none; }
{% endhighlight %}

ただ公式には下記のように推奨はされてないのでこの辺は自己責任でやったほうが良い。  
ってかそもそもIEでエラー出まくってるのに何を言ってるんだという感じだけども。

> The fb-root element must not be hidden using display: none or visibility: hidden, or some parts of the SDK will not work properly in Internet Explorer.

* [JavaScript SDK - Facebook](https://developers.facebook.com/docs/reference/javascript/ 'JavaScript SDK - Facebook')

# IEでエラーが出まくる

今のとこちょっと原因は不明。調べてるとGoogle Analyticsとバッティングしてるとか色々出てきたのでもうちょっと調査してみる。

**iframeかXFBMLならIEでエラーが出ないっぽい。HTML5の埋め込みだとダメなのか？ちなみにうちのブログはIE7以下はLikeボタン読み込まないようにした。**
