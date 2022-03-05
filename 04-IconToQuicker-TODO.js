// ==UserScript==
// @name         IconToQuicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  iconfont和icon8网站图标传递到Quicker动作
// @author       You
// @author       Cesaryuan
// @match        *://icons8.com/*
// @match        *://igoutu.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // check is mobile
    var ACTION_ID = 'c4cc8d9d-8775-42e4-af08-08d867262e28';

    function initialize() {
        // right click event
        document.addEventListener('contextmenu', async function(e) {
            console.log('@Cesaryuan: contextmenu event');
            var target = e.target;
            if (target.tagName.toLowerCase() === 'img') {
                e.preventDefault();
                var url = target.src || target.srcset.split(' ')[0];
                url = url.replace('/2x/', '/4x/');
                await navigator.clipboard.writeText(url);
                window.open('quicker:runaction:' + ACTION_ID + '?type=png&name=' + getName(target), '_self');
            }
            else if(SVGElement.prototype.isPrototypeOf(target)) {
                e.preventDefault();
                await navigator.clipboard.writeText(target.ownerSVGElement.outerHTML);
                window.open('quicker:runaction:' + ACTION_ID + '?type=svg&name=' + getName(target.ownerSVGElement), '_self');
            }
        });
    }
    
    function isIcons8(){
        return window.location.hostname.indexOf('icons8') > -1;
    }

    function getName(element){
        return element.parentElement.parentElement.parentElement.querySelector("div.grid-icon__title")?.textContent.trim() || 
        element.parentElement.parentElement.parentElement.parentElement.querySelector("a.link-title")?.textContent.trim().replace('→ ', '') ||
        'icon';
    }

    if(isIcons8())
    {
        
    }
    initialize();

})();