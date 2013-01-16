---
layout: post
category: javascript
title: 自身や親要素を非表示にするとtransitionEndは発火しない
date: 2013-01-16
summary: ちなみにここで言う非表示はdisplay:noneの事でvisibility:hiddenではない。
---

CSS3でアニメさせた後にはtransitionEndイベントが発火するので、ハンドラの中で初期化をしたり次の処理を書く機会が多いけど、自身や親要素を非表示にするとtransitionEndが発火しない。
