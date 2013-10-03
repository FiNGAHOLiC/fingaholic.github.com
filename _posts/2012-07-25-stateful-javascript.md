---
layout: post
category: javascript
title: ステートフルJavaScript 6章
date: 2012-07-25
summary: ステートフルJavaScript6章の備考録、っていうか写経。MVCから一旦離れて管理方法について。
---

> 依存性管理の仕組みが求められる背景には、手動管理の困難さだけでなく処理速度の問題も存在します。ブラウザはscriptタグで指定されているJavaScriptファイルのそれぞれに対してHTTPリクエストを行います。リクエストは並列して行えますが、多数の接続を行うというのは非常にコストのかかる処理です。接続の1つ1つについて、CookieをはじめとするHTTPヘッダの送受信やTCPハンドシェイクなどの付加が強いられます。SSL経由でアプリケーションが提供されている場合、事態はさらに悪化します。

モバイル対応も考えるとリソースの削減は必須。

# 6.1 CommonJS

名前は聞いたことあるけどあまり意識したことなかった。お恥ずかしい。。。

そもそもCommonJSとは

> JavaScriptでいろんなアプリケーションを作るための標準仕様。（を策定するプロジェクト）

と下記スライドにあった。

> CommonJSというライブラリはこの世に存在しない。あくまで仕様を決めているだけ。

実はずっとライブラリだと思ってました。お恥ずかしい。。。

その他CommonJSについての概要や仕様は下記スライドが分かりやすかったのでぜひに。もともとはサーバーサイドJSのための仕様だったのね。

* [CommonJSの話](http://www.slideshare.net/terurou/common-js 'CommonJSの話')

## 6.1.1 モジュールの宣言

> CommonJSを使ってモジュールを宣言するのは簡単です。ここでは名前空間の仕組みが直接取り込まれています。モジュールは個別にファイルに記述し、共有したい変数はインタプリタによって定義されるexportsオブジェクトに対して公開します。コード例は以下のようになります。

```javascript
// math.js
exports.per = function(value, total){
	return ((value / total) * 100);
};

// application.js
var Maths = require('./maths');
assertEqual(Maths.per(50, 100), 50);
```

> モジュールの中で定義されている関数を呼び出したい場合に必要なコードはrequire()のみであり、ここにモジュールのファイルを指定します。読み込んだ内容はローカル変数に保存されます。この例では、math.jsで公開されている関数はすべてMaths関数を通じて利用可能です。ここでのポイントは、モジュールが名前空間の中に置かれることと、Narwhal（[https://github.com/tlrobinson/narwhal](https://github.com/tlrobinson/narwhal 'https://github.com/tlrobinson/narwhal')）やNode.jsといったCommonJS準拠のすべてのJavaScriptインタプリタ上で動作するという点です。

## 6.1.2 モジュールとブラウザ

> 以上のような仕組みがクライアント側でのJavaScript開発にとってどのような意味を持つのか考えてみましょう。クライアント側でモジュールを使うことの問題点すなわち、CommonJSのモジュールは同期形式で読み込まれる必要があるということについて多くの開発者がきづいています。サーバー側で実行されるJavaScriptではこのことは大きな問題になりませんが、クライアント側では読み込みの間UIを利用できず、しかも避けるべきeval()によるスクリプトの解釈が必要になってしまいます。この問題に対処するため、CommonJSの開発チームはModule Transport Format（[http://wiki.commonjs.ofg/wiki/Modules/Transport](http://wiki.commonjs.ofg/wiki/Modules/Transport 'http://wiki.commonjs.ofg/wiki/Modules/Transport')）という仕様を提案しています。この仕様で定義されている形式に基づいてCommonJSのモジュールはコールバックとともにラップされ、クライアント側での非同期形式の読み込みが可能になっています。
> 先ほどの例に戻り、Module Transport Formatを使ってモジュールをラップします。これによってモジュールは非同期形式で読み込まれ、ブラウザとの相性の良いモジュールが実現されます。

```javascript
// math.js
require.define('maths', function(require, exports){
	exports.per = function(){
		return ((value / total) * 100);
	};
});

// application.js
require.define('application', function(){
	var per = require('./maths').per;
	assertEqual(per(50, 100), 50);
}, ['./maths']); // 依存関係（maths.js）を列挙します
```

> このモジュールはモジュールローダーのライブラリによって取得され、ブラウザ上で実行されます。このことが持つ意味は小さくありません。優れたアプリケーションに欠かせないモジュール形式のコンポーネントを実現出来るだけでなく、依存性の管理や有効範囲の隔離、名前空間の指定なども可能になっています。実際に、このモジュールはブラウザだけでなくサーバーやデスクトップアプリケーションなどでも、CommonJSに準拠さえしていればどの様な環境でも動作が可能です。言い換えると、同じコードをサーバーとクライアントの両方で利用できるのです。

# 6.2 モジュールローダー

> CommonJSモジュールをクライアント側で利用するには、モジュールを読み込むためのモジュールローダーと呼ばれるライブラリが必要です。多数のモジュールローダーが知られており、それぞれに長所も短所もあります。ここでは主なものをいくつか取り上げるので、読者の判断材料にしてください。

## 6.2.1 Yabble

多分使わないので割愛。

* [jbrantly/yabble](https://github.com/jbrantly/yabble/ 'jbrantly/yabble')

## 6.2.2 RequireJS

> Yabbleに対抗する有力な選択肢がRequireJS（[RequireJS](http://requirejs.org/ 'RequireJS')）であり、最も広く利用されているモジュールローダーの1つです。RequireJSでのモジュールの読み込み方法は他と少し異なり、AMD（Asynchronous Module Definition。[http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition 'http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition')）という形式に従っています。利用の際に留意するべきなのは、依存性の評価が（必要になる前に）積極的に行われるという点です。しかし、実質的にはRequireJSとCommonJSのモジュールは完全に互換性があり、ラップするトランスポートが異なるだけです。

RequireJSはjQueryを内包してるバージョンがあって一時期使ってた。ただアプリというか通常のサイトで使用しようとするとページごとにJS読み込ませたい時とかにちょっとした問題があって結局使うのをやめた（URL dispatcherとかで分岐させればページごとも可能っちゃ可能？）。ちょっと古いけどtakazudoさんも記事にしていた。まあアプリなら選択肢として考えてもいいかと思う。

* [script loading solution? yepnope.js !? - Takazudo hamalog](http://hamalog.tumblr.com/post/4780725429/script-loading-solution-yepnope-js 'script loading solution? yepnope.js !? - Takazudo hamalog')

使用方法については割愛。

# 6.3 複数のモジュールとラッピング

> ここまで依存性の管理と名前空間について学んできましたが、多数のHTTPリクエストが発生してしまうよいう問題点はまだ解決されていません。依存先のモジュールのそれぞれについて、ネットワーク経由の読み込みが必要になります。たとえ非同期形式で行ったとしても、読み込みには無視できないオーバーヘッドが生じ、アプリケーションの起動にかかる時間が長くなってしまいます。

本ではサーバー側でminifyとありますが、ここはgrunt一択。

* [gruntをインストールする - Windows Vista](/posts/2012-05-02-grunt.html 'gruntをインストールする - Windows Vista')
* [gruntをインストールする - Mac OSX Lion](/posts/2012-05-01-grunt.html 'gruntをインストールする - Mac OSX Lion')

# 6.4 その他の依存性管理ツール

Sprocketsについては割愛。

## 6.4.1 LABjs

KAYACさんのサイトで使用されてる。ラッパー作ってそこで分岐してからページごとに読み込ませてる。

* [面白法人カヤック](http://www.kayac.com/ '面白法人カヤック')

# 6.5 FUBC

> どんなスクリプトローダーを利用する場合でも、ページの読込中にユーザーがFUBC（flash of unbehaviored content。ふるまいが設定されていないコンテンツの一時的な表示）を目にする可能性があるという点に注意が必要です。これは、JavaScriptが実行される前の状態のページが一瞬表示されてしまうという問題です。初期状態のページに対して、JavaScriptを使った操作やスタイル設定を行なっていない場合は問題ありません。もし行なっているなら、CSSを使ってスタイルの初期設定を行う、要素を非表示にする、読込中であることを表すスプラッシュスクリーンを用意する、などの対策が必要です。

FUBCっていうのか。知らんかった。
