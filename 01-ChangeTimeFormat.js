// ==UserScript==
// @name         转换网页时间形式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https?://(www\.)?(voidtools|stackoverflow|github)\.\w+/.*$/
// @icon         https://www.google.com/s2/favicons?domain=voidtools.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const CONFIG = {
        webConfig: {
            "www.voidtools.com": {
                "viewtopic.php": function (){
                    return [
                        ...document.querySelectorAll('.author').lastChild,
                        ...document.querySelectorAll('.profile-joined').lastChild,
                    ]
                }
            },
            "stackoverflow.com": {
                "questions\/\\d": function (){
                    return [
                        ...Array.from(document.querySelectorAll('.relativetime')).map(function (ele){
                            return [ele.title, ele]
                        }),
                        ...Array.from(document.querySelectorAll('.relativetime-clean')).map(function (ele){
                            return [ele.title.substring(0, 20), ele]
                        }),
                    ]
                }
            },
            "github.com": {
                ".": function (){
                    return [
                        ...Array.from(document.querySelectorAll('relative-time')).map(function (ele){
                            return [ele.getAttribute('datetime'), ele]
                        })
                    ]
                }
            },
            "softoroom.net": {
                "net/topic": function (){
                    return [
                        ...Array.from(document.querySelectorAll('time')).map(function (ele){
                            return [ele.getAttribute('datetime'), ele]
                        })
                    ]
                }
            }
        }
    }
    let host = window.location.host;
    let matchConfig = CONFIG.webConfig[host];

    main();

    onHrefChange(() => setTimeout(main, 1000));

    function onHrefChange(func){
        var oldHref = document.location.href;
        var bodyList = document.querySelector("body")
        , observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (oldHref != document.location.href) {
                        oldHref = document.location.href;
                        // MYCODE
                        func();
                        
                    }
                });
            });
        var config = {
            childList: true,
            subtree: true
        };
        observer.observe(bodyList, config);
    }

    function main(){
        let href = window.location.href;
        if(matchConfig){
            for(let key in matchConfig){
                if(href.match(key)){
                    let toFormatCSS = matchConfig[key];
                    for(let item of toFormatCSS()){
                        if(item instanceof Node)
                            item && formatDate(item.textContent.trim(), item);
                        else if(item instanceof Array)
                            item && formatDate(item[0], item[1]);
                        else
                            console.error("Invalid Type: " + item);
                    }
                    break;
                }
            }
        }
    }

    function formatDate(dateText, dateElement) {
        // let dateText = dateElement.textContent.trim();
        let date = new Date(dateText);
        // dateElement.textContent = dateElement.textContent.replace(dateText, date.toLocaleString());
        dateElement.textContent = date.toLocaleString();
    }


})();