// ==UserScript==
// @name         Quicker讨论区帖子页面优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  优化Quicker讨论区帖子的评论显示，使其结构更加清晰
// @author       Cesaryuan
// @update       2022-05-07 1.支持动作评论 2.高亮专业版用户 3.修复bug
// @match        https://getquicker.net/QA/Question/*
// @match        https://getquicker.net/Common/Topics/ViewTopic/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";
    var url = window.location.href;
    // if (url.indexOf("https://getquicker.net/QA/Question/") != -1) {
        var elemets = document.querySelectorAll('.child-comment > .flex-grow-1')
        elemets.forEach(element => {
            /** @type {HTMLSpanElement} */
            var header = null;
            if(element.children.length == 2) {
                header = document.createElement('span');
                element.prepend(header);
            } else {
                /** @type {HTMLSpanElement} */
                header = element.children[0];
            }
            var replyingContainerSpan = element.children[2];
            var replying = replyingContainerSpan.querySelector('a');
            var userContent = element.querySelector('.user-content');
            header.prepend(replying);
            // add class
            header.classList.add('comment-header');

            // element.insertBefore(userContent, replyingContainerSpan);
            header.append(replyingContainerSpan);
            userContent.style.display = 'block';
        });

        injectStyle(`
            .child-comment {
                border-bottom: 4px solid #ededed;
            }
            .child-comment:nth-last-child(2) {
                border-bottom: 0px solid #ededed;
            }
            .comment-header {
                font-size: 14px;
                font-weight: 600;
            }
        `);
    // }


    function injectStyle(css) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        document.head.appendChild(style);
    }
})();