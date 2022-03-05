// ==UserScript==
// @name         阮一峰周刊条目链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为阮一峰周刊的公众号页面的条目添加链接
// @author       Cesaryuan
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    // 获取公众号名称
    var name = document.querySelector('#js_name').innerText;
    // 获取文章名称
    var articleTitle = document.querySelector('#activity-name').innerText;

    if(name.includes('阮一峰的网络日志') && articleTitle.trim().startsWith('科技爱好者周刊')){

        var items = getElementByXpathAll('//p/span[sup and contains(@style, \'rgb(255, 53, 2)\')]')
        for (var item of items) {
            /** @type {HTMLElement} */
            var indexSup = item.firstElementChild;
            if(indexSup.tagName === 'SUP' && indexSup.innerText.startsWith('[')){
                var index = indexSup.innerText.substr(1, indexSup.innerText.length - 2);
                var emLinkElement = getElementByXpath(`//p/code[contains(text(), '[${index}]')]/following::em`);
                var link = emLinkElement.innerText;
                placeElementInAnchor(indexSup, link);

            }
        }
    }

    /**
     * @return {Node}
     * @param xpath
     */
    function getElementByXpath(xpath){
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    /**
     * 
     * @param {string} xpath 
     * @returns {HTMLElement[]}
     */
    function getElementByXpathAll(xpath){
        var result = [];
        var xpathResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            result.push(xpathResult.snapshotItem(i));
        }
        return result;
    }
    
    function placeElementInAnchor(element, url){
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '';
        anchor.innerText = element.innerText;
        element.innerText = '';
        element.appendChild(anchor);
    }
})();