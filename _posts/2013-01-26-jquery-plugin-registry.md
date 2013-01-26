---
layout: post
category: jquery
title: jQuery Plugin Registryにプラグインを登録する
date: 2013-01-26
summary: せっかくなんで登録してみたけど結構ハマったのでメモ。
---

2013年1月16日にjQuery Plugin Registryが公開された。

* [http://plugins.jquery.com/](http://plugins.jquery.com/ 'jQuery Plugin Registry')
* [https://github.com/jquery/plugins.jquery.com](https://github.com/jquery/plugins.jquery.com 'jquery/plugins.jquery.com')
* [http://blog.jquery.com/2013/01/16/announcing-the-jquery-plugin-registry/](http://blog.jquery.com/2013/01/16/announcing-the-jquery-plugin-registry/ 'Announcing the jQuery Plugin Registry | Official jQuery Blog')

現状ではいろんな場所に断片化されているプラグインをGithubで管理する事で一元化しましょうって感じらしい。これを機会にせこせこ上げておこうと[オフィシャルのドキュメント][publish]見ながら進めてたけど地味にハマったんでメモしとく。

[publish]: http://plugins.jquery.com/docs/publish/ 'Publishing Your Plugin | jQuery Plugin Registry'

# 1. Githubにプラグインを公開しておく

兎にも角にも特に構成を気にせずプラグインを公開しておく。gh-pagesブランチでプラグインのドキュメントとか用意しておくとなお良いかも。

# 2. GithubでPost-Receiveフックを設定

Post-Recieveフックとはレポジトリにpushが行われた際に設定したURLに通知してくれる機能。ここにjQuery Plugin Registryの通知先であるURL、**http://plugins.jquery.com/postreceive-hook**を設定しておく。

* [https://help.github.com/articles/post-receive-hooks](https://help.github.com/articles/post-receive-hooks 'Post-Receive Hooks &middot; github:help')

# 3. Post-Recieveフックが機能しているかテスト用のURLを追加

[このサイト][requestbin]で「Create a RequestBin」をクリックし、与えられたURL（48時間のみ有効）もWebHook URLsに追加しておく。するとpush後に与えられたURLをリロードするとPOSTが確認出来る。まあやんなくてもいいかもしれないけどこれをしておかないとpush後にjQuery Plugin Registryに正しく通知されているか知るすべがないので念のため。

[requestbin]: http://requestb.in/

* [https://help.github.com/articles/testing-webhooks](https://help.github.com/articles/testing-webhooks 'Testing webhooks &middot; github:help')

# 4. GithubレポジトリのルートにPackage Manifestを設置

これも[サンプル][sample]見ながら作ればほぼ問題ない。気をつけるのはファイル名が**pluginName.jquery.json**となるようにしておく事と[JSONLint][lint]で念のためvalidateしておくくらい。

[sample]: http://plugins.jquery.com/docs/package-manifest/#sample
[lint]: http://jsonlint.com/

# 5. tagでバージョンを付けてtagをpush

**ここでハマった。**基本的にはtagがそのままプラグインのバージョンとして使用されるので<code class="inline">git tag 1.0.0</code>みたいにタグ付けして<code class="inline">git push origin --tags</code>するだけだけど、この時重要なのが上記で設置した**Package Manifestで記述したバージョンとタグが同じでないとダメ**って事。ドキュメント見てればちゃんと書いてあった。

> The tag name must also match the version listed in the manifest file.

さらに下記引用にあるように、**jQuery Plugin Registryに反映されない等の問題にぶち当たった時はtagを上書きするのではなく、Package Manifestのバージョンを更新し、新しいtag（もちろんPackage Manifestのバージョンと同じ）を作ってpushするように**、とあるので注意。自分は上書きしまくってたのでバージョンが全然反映されなくてハマった。

> We highly suggest that you do not overwrite old tags, instead, update the version number tag in the manifest, commit, and create a new tag to fix any errors you've encountered.

ちなみにバージョンは[SemVer][semver]に基づいて付けなきゃらしいけど基本的に**x.x.x**の形式なら問題ないそう。

[semver]: http://semver.org/

# 6. masterとgh-pagesブランチもpush

自分の場合はプラグインのデモページとしてgh-pagesブランチも使用しているので<code class="inline">git push --all</code>でpush。

# 7. jQuery Plugin Registryに登録されたか確認

大体5分から10分でhttp://plugins.jquery.com/登録したプラグイン名/に反映されるけど、なかなか反映されない場合は何かしらミスってる可能性があるので下記ページで自分のプラグインに関するログを探してみて対処する。

* [http://plugins.jquery.com/error.log](http://plugins.jquery.com/error.log 'http://plugins.jquery.com/error.log')

無事登録されればこんな風になる。バージョンのところはミスりまくって訳が分からんことになってるのでいずれ直そう。。。

* [http://plugins.jquery.com/imgpreloader/](http://plugins.jquery.com/imgpreloader/ 'jquery imgpreloader | jQuery Plugin Registry')

手順としてはシンプルだけどハマると情報が乏しいので苦労した。ただこれからもっと活発になってくると思うし日本語のドキュメントも出てくると思うのでドンドン登録していきたい。
