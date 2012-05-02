# Githubでjekyll使ってブログ

 [jekylog](http://fingaholic.github.com/ 'jekylog')

## 構成ファイル群

	.
	├─ _includes // インクルードファイル
	│  ├─ footer.html // フッター用
	│  ├─ ga.html // Google Analytics用
	│  ├─ head.html // headタグ用
	│  ├─ header.html // ヘッダー用
	├─ _layouts // レイアウトファイル
	│  ├─ default.html // ページベース用
	│  ├─ post.html // 投稿詳細ページ用
	├─ _posts // 記事用マークダウンファイル
	│  ├─ $YEAR-$MONTH-$DATE-$TITLE.$FORMAT // markdownかtextile
	├─ css // CSS
	│  ├─ all.css
	│  ├─ all.min.css
	├─ fonts // Web font
	│  ├─ chunkfive // Chunkfive 
	│  ├─ droid // Droid 
	├─ img // 画像
	│  ├─ favicon.ico
	│  ├─ logo1.png
	│  ├─ logo2.png
	├─ js // JS
	│  ├─ all.js
	│  ├─ all.min.js
	│  ├─ app.js
	│  ├─ jquery-ui-1.8.18.custom.min.js
	│  ├─ jquery.easing.1.3.js
	│  ├─ jquery.ui.plugin.js
	│  ├─ modernizr-2.5.3.min.js
	│  ├─ respond.min.js
	├─ scss // SCSS
	│  ├─ _cssfonts.scss
	│  ├─ _highlight.scss
	│  ├─ _normalize.scss
	│  ├─ _webfont.scss
	│  ├─ all.scss
	├─ tasks // gruntのカスタムタスク用
	│  ├─ cssmin.js
	│  ├─ sass.js
	├─ .gitignore // .gitignore
	├─ 404.html // 404用HTML
	├─ README.md // README.md
	├─ Rakefile // Rakefile
	├─ _config.yml // 基本設定
	├─ about.html // アバウト用HTML
	├─ archive.html // アーカイブ用HTML
	├─ atom.xml // RSS用XML
	├─ grunt.js // grunt用js
	├─ index.html // トップページ用HTML

## 参考サイト
* [GitHub - mojombo/jekyll](https://github.com/mojombo/jekyll 'GitHub - mojombo/jekyll')
* [CSS RADAR - jekyll](http://css.studiomohawk.com/jekyll/2011/06/11/jekyll/ 'CSS RADAR - jekyll')
* [Big Sky - Jekyllで始める簡単ブログ](http://mattn.kaoriya.net/software/lang/ruby/20090409185248.htm 'Big Sky - Jekyllで始める簡単ブログ')
* [Markdown Cheat Sheet](http://support.mashery.com/docs/customizing_your_portal/Markdown_Cheat_Sheet 'Markdown Cheat Sheet')
* [Ginpen - Markdown](http://ginpen.com/2011/12/02/markdown-syntax/ 'Ginpen - Markdown')
