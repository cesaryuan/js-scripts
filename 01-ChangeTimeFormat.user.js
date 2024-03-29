// ==UserScript==
// @name         转换网页时间形式
// @namespace    Cesaryuan
// @version      0.3
// @description  将网页上的时间转化为更加友好的形式，提供自动触发和手动触发两种方式（有的网页会自动刷新）
// @author       Cesaryuan
// @update       2022-10-28 1.自动触发
// @update       2022-05-09 1.改进配置形式 2.新增dopus网站支持 3.右下角添加手动触发按钮
// @match        https://www.voidtools.com/*
// @match        https://stackoverflow.com/*
// @match        https://github.com/*
// @match        https://softoroom.net/*
// @match        https://resource.dopus.com/*
// @icon         https://www.google.com/s2/favicons?domain=voidtools.com
// @grant        none
// @grant        window.onurlchange
// @run-at       document-idle
// ==/UserScript==

(function () {
    "use strict";
    // 所有函数返回一个数组
    const CONFIG = {
        webConfig: {
            "www.voidtools.com": {
                "viewtopic.php": function () {
                    var items = [
                        ...document.querySelectorAll(".author").lastChild,
                        ...document.querySelectorAll(".profile-joined").lastChild,
                    ];
                    items.forEach((item) => {
                        item.textContent = formatDate(item.textContent.trim());
                    });
                },
            },
            "stackoverflow.com": {
                "questions/\\d": function () {
                    Array.from(document.querySelectorAll(".relativetime")).forEach(function (ele) {
                        ele.textContent = formatDate(ele.title);
                    });
                    Array.from(document.querySelectorAll(".relativetime-clean")).forEach(function (
                        ele
                    ) {
                        ele.textContent = formatDate(ele.title.substring(0, 20));
                    });
                },
            },
            "github.com": {
                ".": function () {
                    Array.from(document.querySelectorAll("relative-time")).forEach(function (ele) {
                        (ele.shadowRoot || ele).textContent = formatDate(ele.getAttribute("datetime"));
                    });
                },
            },
            "softoroom.net": {
                "net/topic": function () {
                    Array.from(document.querySelectorAll("time")).forEach(function (ele) {
                        ele.textContent = formatDate(ele.getAttribute("datetime"));
                    });
                },
            },
            "resource.dopus.com": {
                "/t": function () {
                    Array.from(document.querySelectorAll(".relative-date")).forEach(function (ele) {
                        ele.textContent = formatDate(ele.getAttribute("data-time"));
                    });
                },
            },
        },
    };
    let host = window.location.host;
    let matchConfig = CONFIG.webConfig[host];
    if(matchConfig){
        main();
        addButtonToRightBottom("转换时间", main);
        // observeElement(document.body, main);
        if(window.onurlchange === undefined) addUrlChangeEvent;
        window.addEventListener("urlchange", main);
        function main() {
            console.log("@Cesaryuan - 转换网页时间形式开始运行");
            let href = window.location.href;
            for (let key in matchConfig) {
                if (href.match(key)) {
                    let functionA = matchConfig[key];
                    functionA();
                    break;
                }
            }
        }
    }


    function formatDate(dateText) {
        // let dateText = dateElement.textContent.trim();
        let date = new Date(dateText);
        if (/^\d{10,13}$/.test(dateText)) {
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

    function observeElement(element, callback) {
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "childList") {
                    if(callback()){
                        disconnect();
                    }
                }
            });
        });
        const disconnect = observer.disconnect;
        observer.observe(element, {
            childList: true,
            subtree: true
        });
    }

    function addUrlChangeEvent() {
        history.pushState = ( f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.pushState);

        history.replaceState = ( f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate',()=>{
            window.dispatchEvent(new Event('urlchange'))
        });
    }
})();
