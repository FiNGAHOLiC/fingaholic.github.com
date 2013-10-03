---
layout: post
category: rubyonrails
title: VagrantでCentOS上にRailsをインストールする
date: 2013-09-09
summary: Ruby On Railsを勉強するためにVagrantでCentOS上にインストールするまでのメモ。
---

Ruby On Railsを勉強するためにせっかくなんでVagrantでCentOS上にRailsをインストールしようと思い立ったところ便利なシェルスクリプトがあったので導入するまでの手順をメモ。

# 1. Githubからシェルスクリプトをダウンロード

VagrantにProvisioningでRailsをインストールしてくれる便利なシェルスクリプトが公開されているので、READMEの通りやってみる。
※仮想OSは下記リポジトリの説明にある通りCentOSの6.4を使用している前提

```bash
$ mkdir ~/Desktop/rubyonrails
$ cd ~/Desktop/rubyonrails
$ git clone https://github.com/mironal/rails-dev-on-centos6.git
$ cd rails-dev-on-centos6
```

* [mironal/rails-dev-on-centos6](https://github.com/mironal/rails-dev-on-centos6 'mironal/rails-dev-on-centos6')
* [Wokashi: VagrantでCentOS上にRailsの開発環境を構築するヤツ書いた](http://mironal-memo.blogspot.jp/2013/09/vagrant-rails-dev.html 'Wokashi: VagrantでCentOS上にRailsの開発環境を構築するヤツ書いた')

# 2. Vagrantを起動する

```bash
$ vagrant up
```

# 3. 仮想OSにログイン

```bash
$ vagrant ssh
```

# 4. Railsがインストールされているか確認

```bash
$ rails -v
Rails 4.0.0
```

たったこれだけでセットアップしてくれる＼(^o^)／
ちなみに下記のように手動でインストールする方法もある。

* [#12 Ruby on Railsを導入してみよう | ローカル開発環境の構築 - プログラミングならドットインストール](http://dotinstall.com/lessons/basic_local_development_v2/24812 '#12 Ruby on Railsを導入してみよう | ローカル開発環境の構築 - プログラミングならドットインストール')
