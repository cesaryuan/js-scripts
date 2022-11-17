// ==UserScript==
// @name        给页面window注入GM对象
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      -
// @description 2022/11/17 10:02:48
// ==/UserScript==

let warnDiv = document.createElement('div');
warnDiv.innerText = 'GM对象已注入window';
warnDiv.style = 'position: fixed; top: 0; left: 0; background: #fff; padding: 10px; border: 1px solid #000; z-index: 9999;';
document.body.appendChild(warnDiv);

unsafeWindow.GM_addStyle = GM_addStyle;
unsafeWindow.GM_getResourceText = GM_getResourceText;
unsafeWindow.GM_getResourceURL = GM_getResourceURL;
unsafeWindow.GM_getValue = GM_getValue;
unsafeWindow.GM_listValues = GM_listValues;
unsafeWindow.GM_notification = GM_notification;
unsafeWindow.GM_openInTab = GM_openInTab;
unsafeWindow.GM_registerMenuCommand = GM_registerMenuCommand;
unsafeWindow.GM_setClipboard = GM_setClipboard;
unsafeWindow.GM_setValue = GM_setValue;
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
