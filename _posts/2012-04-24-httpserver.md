---
layout: post
category: ruby
title: ローカルで簡易HTTPサーバー
date: 2012-04-24
summary: MAMPとかXAMPPとかでもいいんだけどローカル用の管理下にないファイルとかをサッと確認したい時に使うアレをメモ。
---

# Pythonの場合

SimpleHTTPServerが便利そうだけどWindowで使ってみるとなぜか外部ファイル（CSS）読み込まれなかったりでうまくいかなかった。
ちなみにコマンドラインからPython使うには環境変数にPythonのパス（例：C:\Python25）を追加しとく必要がある。

```bash
$ cd /path/to/directory
$ python -m SimpleHTTPServer
```

若しくは下記ファイルをwebserver.pyとかの名前で設置しといて実行するのもあり。

```python
#! /usr/bin/env python
# coding: utf-8

import SimpleHTTPServer

SimpleHTTPServer.test()
```

いずれも[http://localhost:8000/](http://localhost:8000/ 'http://localhost:8000/')にアクセスすると確認できる。

# Rubyの場合

こっちはスムーズにいった。
まずはコマンドラインから叩く場合。

```bash
$ cd /path/to/directory
$ ruby -rwebrick -e "WEBrick::HTTPServer.new({:DocumentRoot => './', :Port => 8000}).start"
```

コマンドラインから叩く場合は下記ファイルをwebserver.rbとして保存しておく。
<del>ちなみにDocumentRootはその都度設定しておく。</del>
カレントディレクトリで起動の場合は不要だった。

```ruby
require 'webrick'

server = WEBrick::HTTPServer.new({
	:DocumentRoot => './',
	:BindAddress => '0.0.0.0',
	:Port => 8000
})

['INT', 'TERM'].each {|signal|
	Signal.trap(signal){ server.shutdown }
}

server.start
```

んで、

```bash
$ cd /path/to/directory
$ ruby webserver.rb
```

いずれも[http://localhost:8000/](http://localhost:8000/ 'http://localhost:8000/')にアクセスすると確認できる。

下記参考サイト。

* [Rubyで簡易HTTPサーバ | 山本隆の開発日誌](http://www.gesource.jp/weblog/?p=72 'Rubyで簡易HTTPサーバ | 山本隆の開発日誌')
* [RubyのワンライナーでWebサーバを起動する - Fight the Future じゅくのblog](http://d.hatena.ne.jp/jyukutyo/20110530/1306844993 'RubyのワンライナーでWebサーバを起動する - Fight the Future じゅくのblog')
