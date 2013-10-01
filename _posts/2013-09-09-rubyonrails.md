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

{% highlight bash %}
$ mkdir ~/Desktop/rubyonrails
$ cd ~/Desktop/rubyonrails
$ git clone https://github.com/mironal/rails-dev-on-centos6.git
$ cd rails-dev-on-centos6
{% endhighlight %}

* [mironal/rails-dev-on-centos6](https://github.com/mironal/rails-dev-on-centos6 'mironal/rails-dev-on-centos6')
* [Wokashi: VagrantでCentOS上にRailsの開発環境を構築するヤツ書いた](http://mironal-memo.blogspot.jp/2013/09/vagrant-rails-dev.html 'Wokashi: VagrantでCentOS上にRailsの開発環境を構築するヤツ書いた')

# 2. Vagrantを起動する

{% highlight bash %}
$ vagrant up
{% endhighlight %}

# 3. 仮想OSにログイン

{% highlight bash %}
$ vagrant ssh
{% endhighlight %}

# 4. Railsがインストールされているか確認

{% highlight bash %}
$ rails -v
Rails 4.0.0
{% endhighlight %}

たったこれだけでセットアップしてくれる＼(^o^)／


