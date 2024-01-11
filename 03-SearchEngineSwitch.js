// ==UserScript==
// @name         SearchEngineSwitch
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  谷歌百度搜索引擎快速切换
// @author       You
// @author       Cesaryuan
// @match        *://*.baidu.com/s*
// @match        *://www.google.com.*/*
// @match        *://www.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // check is mobile
    
    function waitForEle(selector, callback, maxWaitTime) {
        var waitTime = 0;
        var interval = setInterval(function () {
            var element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                console.log('waitForEle: ' + selector + ' found');
                callback(element);
            } else if (waitTime >= maxWaitTime) {
                clearInterval(interval);
            } else {
                waitTime += 100;
            }
        }, 100);
    }

    function initialize() {
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            console.log('isMobile');
            addSearchButton();
            return;
        }else{
            console.log('is not Mobile');
        }
    }

    // create a search button
    function addSearchButton(text) {
        var searchButton = document.createElement('button');
        searchButton.innerHTML = '换';
        searchButton.id = 'searchButton';
        // inject stylesheet
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #searchButton {
                position: fixed;
                top: 10px;
                right: 0;
                z-index: 9999;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 4px 8px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease-in-out;
                box-shadow: 0 0 5px rgb(0 0 0 / 20%);
                width: 2.5em;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(searchButton);
        searchButton.addEventListener('click', function() {
            var url = GetSearchUrl() + encodeURIComponent(GetSearchInputText());
            window.location.href = url;
        });
    }

    // check is in google search page
    function isGoogleSearchPage() {
        return /google.com(\.\w+)?\/search/.test(window.location.href);
    }

    // check is in baidu search page
    function isBaiduSearchPage() {
        return /baidu.com\//.test(window.location.href);
    }

    function GetSearchUrl(){
        if(isBaiduSearchPage()){
            return "https://www.google.com.hk/search?q=";
        }else if(isGoogleSearchPage()){
            return "https://www.baidu.com/s?wd=";
        }else{
            return "";
        }
    }

    function GetSearchInputText(){
        if(isGoogleSearchPage()){
            return document.querySelector('textarea[spellcheck]').value;
        }else if(isBaiduSearchPage()){
            return document.querySelector('input[placeholder]')?.value || document.querySelector('#head-queryarea').innerText.trim();
        }else{
            return "";
        }
    }
    if(isBaiduSearchPage())
        waitForEle('input', initialize, 5000);
    if(isGoogleSearchPage())
        waitForEle('textarea', initialize, 5000);
        

})();