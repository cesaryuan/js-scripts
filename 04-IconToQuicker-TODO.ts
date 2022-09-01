// ==UserScript==
// @name         IconToQuicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  iconfont和icon8网站图标传递到Quicker动作
// @author       You
// @author       Cesaryuan
// @match        *://icons8.com/*
// @match        *://igoutu.cn/*
// @match        *://www.iconfont.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var ACTION_ID = 'c4cc8d9d-8775-42e4-af08-08d867262e28';
    let isWebView2 = window.$quicker !== undefined;
    let isIcons8 = window.location.hostname.indexOf('icons8') > -1;
    let isIconFont = window.location.hostname.indexOf('iconfont') > -1;

    function initialize() {
        // right click event
        document.addEventListener('contextmenu', async function(e) {
            console.log('@Cesaryuan: contextmenu event');
            var target = e.target;
            if (target instanceof HTMLImageElement) {
                e.preventDefault();
                if(isIcons8){
                    var url = target.src || target.srcset.split(' ')[0];
                    url = url.replace('/2x/', '/4x/');    
                }
                if (isWebView2) {
                    window.$quickerSp('callback', {
                        type: 'png',
                        data: url,
                        name: getName(target),
                    })
                }
                else {
                    await navigator.clipboard.writeText(url);
                    window.open('quicker:runaction:' + ACTION_ID + '?type=png&name=' + getName(target), '_self');
                }
            }
            else if(target instanceof SVGElement) {
                e.preventDefault();
                if (isWebView2) {
                    window.$quickerSp('callback', {
                        type: 'svg',
                        data: target.tagName.toLowerCase() === 'svg' ? target.outerHTML : target.ownerSVGElement.outerHTML,
                        name: getName(target.ownerSVGElement),
                    })
                }
                else {
                    await navigator.clipboard.writeText(target.ownerSVGElement.outerHTML);
                    window.open('quicker:runaction:' + ACTION_ID + '?type=svg&name=' + getName(target.ownerSVGElement), '_self');
                }
            }
            else{
                console.log('@Cesaryuan: not image');
            }
        });
    }
    

    function getName(element){
        if(isIcons8){
            return element.parentElement.parentElement.parentElement.querySelector("div.grid-icon__title")?.textContent.trim() || 
            element.parentElement.parentElement.parentElement.parentElement.querySelector("a.link-title")?.textContent.trim().replace('→ ', '') ||
            'icon';
        }
        else if (isIconFont){
            return element?.parentElement?.nextElementSibling?.getAttribute?.('title') ?? 'icon';
        }
        console.log("unknown name: ", element);
        return 'icon';
    }

    function injectCSS(css: string){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        // wait for document.head

        document.head.appendChild(style);
    }

    document.addEventListener('DOMContentLoaded', function() {
        injectCSS(`
        .block-icon-list li .icon-cover{
            position: relative;
        }
        .footer {
            display: none;
        }
    `);
    });
    // if(isWebView2)
    //     window.addEventListener('domcontentloaded', initialize);
    // else
        initialize();

})();