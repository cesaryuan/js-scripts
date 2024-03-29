"use strict";

// ==UserScript==
// @name         知网搜索修复
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  修复知网更新后不能通过 url params 进行搜索的问题
// @author       Cesaryuan
// @match        https://epub.cnki.net/kns/brief/default_result.aspx*
// @match        https://kns.cnki.net/kns8/defaultresult/index*
// @icon         https://www.google.com/s2/favicons?domain=cnki.net
// @grant        none
// @license      MIT
// ==/UserScript==
(function () {
  'use strict'; // get query dict

  var queryDict = new URL(window.location.href).searchParams;
  var query = queryDict.get("txt_1_value1"); // window.addEventListener("load", function() {
  //     let host = window.location.host;
  //     if(host == "epub.cnki.net"){
  //         let inputEle = document.querySelector("#txt_1_value1") as HTMLInputElement;
  //         let searchBtn = document.querySelector("#btnSearch") as HTMLButtonElement;
  //         inputEle.value = query;
  //         searchBtn.click();
  //     }else if(host == "kns.cnki.net"){
  //         let inputEle = document.querySelector("#txt_search") as HTMLInputElement;
  //         let searchBtn = document.querySelector("body > div.search-box > div > div.search-main > div.input-box > input.search-btn") as HTMLButtonElement;
  //         inputEle.value = query;
  //         searchBtn.click();
  //     }
  //     else{
  //         console.log("油猴脚本-知网搜索修复：未知的 host");
  //     }
  // });
  // hook $.post

  var oldPost = $.post;

  $.post = function (url, data, callback, type) {
    if (url.endsWith("/Group/Result")) {
      var queryJson = JSON.parse(data.queryJson);
      queryJson.QNode.QGroup[0].Items[0].Value = query;
      data.queryJson = JSON.stringify(queryJson);
    }

    return oldPost(url, data, callback, type);
  };
})();