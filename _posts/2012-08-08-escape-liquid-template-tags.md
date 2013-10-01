---
layout: post
category: javascript
title: Jekyllでliquidテンプレートタグをエスケープする
date: 2012-08-08
summary: コードハイライト内でjQuery.tmpl()のテンプレートタグ書いてたらliquidテンプレートタグと解釈されたっぽくて表示されなかったけど解決したからメモ。
---

どうもマークダウン内でif文書くとliquidテンプレートタグと解釈されるっぽい。

下記は何も表示されないけど、

```html
{{if fullName()}}
{{else}}
{{/if}}
```

こっちだと表示される。

```html
{{"{{if fullName()"}}}}
{{"{{else"}}}}
{{"{{/if"}}}}
```

解決法はググると載ってた。

[How to escape liquid template tags? - Stack Overflow](http://stackoverflow.com/questions/3426182/how-to-escape-liquid-template-tags 'How to escape liquid template tags? - Stack Overflow')

**\{の前に\{\{\"を加え、ステートメントである単語の後ろに\"\}\}を加える**って感じらしい。

なんというややこしさ。多分すぐ忘れる。

これが煩わしい場合はプラグインもあるみたい。

[Raw tag for jekyll. &mdash; Gist](https://gist.github.com/1020852 'Raw tag for jekyll. &mdash; Gist')
