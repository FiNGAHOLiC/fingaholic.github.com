---
layout: post
category: javascript
title: 自身や親要素を非表示にするとtransitionEndは発火しない
date: 2013-01-16
summary: ちなみにここで言う非表示はdisplay:none;の事でvisibility:hidden;ではない。
---

CSS3でアニメさせた後にはtransitionEndイベントが発火するので、ハンドラの中で初期化をしたり次の処理を書く機会が多いけど、自身や親要素を非表示にするとtransitionEndが発火しない。

下記のようなサンプルを用意すると確認できる。

1. 「animation start」を押下。
2. 右移動するアニメーションが終わる（5秒後に）と通常はtransitionEndが発火してコンソールで「animation done!」が表示され、初期座標に戻る。
3. 再度「animation start」を押下し、アニメ中に「hide」ボタンを押下すると5秒経ってもtransitionEndは発火することはない。
4. 「show」を押下して表示させるとアニメーションはスキップされて最終座標まで移動している。

<iframe style="width: 100%; height: 400px" src="http://jsfiddle.net/FiNGAHOLiC/3Yq9D/embedded/result,html/" allowfullscreen="allowfullscreen" frameborder="0">sample</iframe>

まあ非表示の要素にtransitionEndが発火しないのはなんとなく分かるけどアニメーションがスキップされるのはなんだろう。この辺りMDN見ても載ってなかったんでドキュメント探し中（教えてエロイ人）。

調べてみると、他にも気になってる人がいた。どうやらバグとして報告してるっぽい。

* [transitionend doesn\'t fire if parent element gets display: none before transition completes](http://labs.silverorange.com/files/webkit-bug/ 'transitionend doesn\'t fire if parent element gets display: none before transition completes')

兎にも角にもサイトの仕様にもよるけど**transitionEnd後のみに初期化処理なり次の処理を書くだけじゃなく、アニメ途中に自身または親要素を非表示する処理がある場合はそっちにも処理を書きましょうね**、という備忘録。


ちなみにサンプルではtranslate3dしかアニメさせていないので1回しかtransitionEndが呼ばれないけど、複数プロパティをアニメさせてるとその分だけtransitionEndが発火するので、一回だけ処理したい場合は、$.fn.one（jQueryを使用している場合）や戻り値のpropertyNameを見て処理する。
