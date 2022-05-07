// ==UserScript==
// @name         Quicker高亮专业版用户
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  让专业版用户的链接更加醒目
// @author       Cesaryuan
// @match        https://getquicker.net/*
// @grant        none
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/444549-quicker%E9%AB%98%E4%BA%AE%E4%B8%93%E4%B8%9A%E7%89%88%E7%94%A8%E6%88%B7/admin
// ==/UserScript==

(function () {
    "use strict";
    var url = window.location.href;

    if(url.indexOf("https://getquicker.net/") != -1) {
        injectStyle(`
            a.user-link.user-pro {
                color: #d98314;
            }
            a.user-link {
                /* font-weight: bold; */
            }
        `);
    }


    function injectStyle(css) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        document.head.appendChild(style);
    }
})();