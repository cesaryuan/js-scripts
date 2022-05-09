// ==UserScript==
// @name         转换网页时间形式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将网页上的时间转化为更加友好的形式，提供自动触发和手动触发两种方式（有的网页会自动刷新）
// @author       You
// @update       2022-05-09 1.改进配置形式 2.新增dopus网站支持 3.右下角添加手动触发按钮
// @include      /^https?://(www\.)?(voidtools|stackoverflow|github|resource.dopus)\.\w+/.*$/
// @icon         https://www.google.com/s2/favicons?domain=voidtools.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    // 所有函数返回一个数组
    const CONFIG = {
        webConfig: {
            "www.voidtools.com": {
                "viewtopic.php": function (){
                    var items = [
                        ...document.querySelectorAll('.author').lastChild,
                        ...document.querySelectorAll('.profile-joined').lastChild,
                    ];
                    items.forEach(item => {
                        item.textContent = formatDate(item.textContent.trim());
                    });
                }
            },
            "stackoverflow.com": {
                "questions\/\\d": function (){
                    Array.from(document.querySelectorAll('.relativetime')).forEach(function (ele){
                        ele.textContent = formatDate(ele.title);
                    });
                    Array.from(document.querySelectorAll('.relativetime-clean')).forEach(function (ele){
                        ele.textContent = formatDate(ele.title.substring(0, 20));
                    });
                }
            },
            "github.com": {
                ".": function (){
                    Array.from(document.querySelectorAll('relative-time')).forEach(function (ele){
                        ele.textContent = formatDate(ele.getAttribute('datetime'));
                    })
                }
            },
            "softoroom.net": {
                "net/topic": function (){
                    Array.from(document.querySelectorAll('time')).forEach(function (ele){
                        ele.textContent = formatDate(ele.getAttribute('datetime'));
                    })
                }
            },
            "resource.dopus.com": {
                "/t": function (){
                    Array.from(document.querySelectorAll('.relative-date')).forEach(function (ele){
                        ele.textContent = formatDate(ele.getAttribute('data-time'));
                    });                    
                } 
            }
        }
    }
    let host = window.location.host;
    let matchConfig = CONFIG.webConfig[host];

    main();
    addButtonToRightBottom('转换时间', main);

    // onHrefChange(() => setTimeout(main, 1000));

    // function onHrefChange(func){
    //     var oldHref = document.location.href;
    //     var bodyList = document.querySelector("body")
    //     , observer = new MutationObserver(function(mutations) {
    //             mutations.forEach(function(mutation) {
    //                 if (oldHref != document.location.href) {
    //                     oldHref = document.location.href;
    //                     // MYCODE
    //                     func();
                        
    //                 }
    //             });
    //         });
    //     var config = {
    //         childList: true,
    //         subtree: true
    //     };
    //     observer.observe(bodyList, config);
    // }

    function main(){
        console.log("@Cesaryuan 转换网页时间形式开始运行");
        let href = window.location.href;
        if(matchConfig){
            for(let key in matchConfig){
                if(href.match(key)){
                    let toFormatCSS = matchConfig[key];
                    toFormatCSS();
                    // for(let item of toFormatCSS()){
                    //     if(item instanceof Node)
                    //         item && formatDate(item.textContent.trim(), item);
                    //     else if(item instanceof Array)
                    //         item && formatDate(item[0], item[1]);
                    //     else
                    //         console.error("Invalid Type: " + item);
                    // }
                    break;
                }
            }
        }
    }

    function formatDate(dateText) {
        // let dateText = dateElement.textContent.trim();
        let date = new Date(dateText);
        if(/^\d{10,13}$/.test(dateText)){
            date = new Date(parseInt(dateText));
        }

        // dateElement.textContent = dateElement.textContent.replace(dateText, date.toLocaleString());
        return toFriendlyDate(date);
    }

    function toFriendlyDate(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let day = 1000 * 60 * 60 * 24;
        let hour = 1000 * 60 * 60;
        let minute = 1000 * 60;
        let second = 1000;
        let dayDiff = Math.floor(diff / day);
        let hourDiff = Math.floor((diff % day) / hour);
        let minuteDiff = Math.floor((diff % hour) / minute);
        let secondDiff = Math.floor((diff % minute) / second);
        let result = "";
        if (dayDiff > 0 && dayDiff <= 365) {
            result = dayDiff + "天前";
        } else if (dayDiff > 365) {
            result = date.toLocaleString();
        } else if (hourDiff > 0) {
            result = hourDiff + "小时前";
        } else if (minuteDiff > 0) {
            result = minuteDiff + "分钟前";
        } else if (secondDiff > 0) {
            result = secondDiff + "秒前";
        }
        return result;
    }

    function addButtonToRightBottom(text, onclick) {
        let button = document.createElement("button");
        button.innerText = text;
        button.onclick = onclick;
        button.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            background-color: #f1f1f1;
            border: none;
            padding: 5px 10px;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            color: #000;
            z-index: 9999;
        `;
        document.body.appendChild(button);
    }
})();