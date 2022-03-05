// ==UserScript==
// @name         复制页面中的公式为latex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  右键单击页面中的公式将其复制为latex
// @author       Cesaryuan
// @match        https://*.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    var pageConfig = {
        "wikipedia.org": function(){
            document.addEventListener("contextmenu", function(e){
                /** @type {HTMLElement} */
                var target = e.target;
                if(target.tagName == "IMG" && target.className.startsWith('mwe-math')){
                    e.preventDefault();
                    // 右键菜单
                    copyLatexMenu(e, target.alt);
                    
                }
            })
        }
    }

    for(var domain in pageConfig){
        if(window.location.hostname.endsWith(domain)){
            pageConfig[domain]();
        }
    }
    // toast message in the bottom center corner
    function toast(msg) {
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = msg;
        toast.style.position = 'fixed';
        toast.style.bottom = '10px';
        toast.style.right = '10px';
        toast.style.zIndex = '9999';
        toast.style.backgroundColor = '#fff';
        toast.style.color = '#000';
        toast.style.padding = '10px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 0 5px #000';
        toast.style.fontSize = '16px';
        toast.style.fontWeight = 'bold';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.opacity = '1';
        }, 100);
        setTimeout(function () {
            toast.style.opacity = '0';
        }
        , 2000);
        setTimeout(function () {
            document.body.removeChild(toast);
        }
        , 3000);
    }

    function copyLatexMenu(e, latexText) {
        var menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.top = e.pageY + 'px';
        menu.style.left = e.pageX + 'px';
        menu.style.zIndex = '9999';
        menu.style.backgroundColor = '#fff';
        menu.style.color = '#000';
        menu.style.padding = '10px';
        menu.style.borderRadius = '5px';
        menu.style.boxShadow = '0 0 5px #000';
        menu.style.fontSize = '16px';
        menu.style.fontWeight = 'bold';
        menu.style.opacity = '0';
        menu.style.transition = 'opacity 0.5s';
        document.body.appendChild(menu);
        setTimeout(function () {
            menu.style.opacity = '1';
        }, 100);

        // 复制公式
        var copy = createMenuItem('复制公式');
        copy.onclick = function () {
            navigator.clipboard.writeText(latexText);
            toast('复制成功');
        };

        // 复制latex ($$ $$)
        var latex = createMenuItem('复制latex ($$ $$)');
        latex.onclick = function () {
            navigator.clipboard.writeText('$$' + latexText + '$$');
            toast('复制成功');
        };

        // 复制latex (\\[ \\])
        var latex2 = createMenuItem('复制latex (\\[ \\])');
        latex2.onclick = function () {
            navigator.clipboard.writeText('\\[ ' + latexText + ' \\]');
            toast('复制成功');
        };

        menu.onmouseleave = function () {
            closeMenu(500);
        };

        menu.onclick = function () {
            closeMenu(0);
        }

        function closeMenu(time) {
            setTimeout(function () {
                menu.style.opacity = '0';
            },
            time);
            setTimeout(function () {
                document.body.removeChild(menu);
            },
            time + 500);
        }

        function createMenuItem(text) {
            var item = document.createElement('div');
            item.innerHTML = text;
            menu.appendChild(item);
            return item;
        }
    }
})();


