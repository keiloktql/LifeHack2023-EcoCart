// Get the wrapper element
function getWrapper() {
    return document.querySelectorAll('div[role="main"]')[0];
}

// Function to scan for new elements
let scanDiv = (function () {
    var MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;
    return function (obj, callback) {
        if (!obj || obj.nodeType !== 1) return;
        if (MutationObserver) {
            var mutationObserver = new MutationObserver(callback);
            mutationObserver.observe(obj, {
                childList: true,
                subtree: false
            });
            return mutationObserver;
        } else if (window.addEventListener) {
            obj.addEventListener("DOMNodeInserted", callback, false);
            obj.addEventListener("DOMNodeRemoved", callback, false);
        }
    };
})();

// Get the text content from the scanDiv wrapper
let getTextContent = (function () {
    return function (el) {
        // Only proceed if query success, otherwise return empty string
        if (el) {
            let blockInnerTextContent = el.querySelectorAll(
                'div[data-content-editable-leaf="true"]'
            )[0];
            if (blockInnerTextContent) return blockInnerTextContent.innerText;
            else return "";
        } else return "";
    };
})();

let setTextContent = (el, text) => {
    let blockContent = el.querySelectorAll(
        'div[data-content-editable-leaf="true"]'
    )[0];
    window.alert("blockContent: " + "clicked");
    blockContent.innerText = "Clicked!";
};

// Function to append advisory
let addWarning = (function () {
    return async function (el, score) {
        console.log(el);
        // addCardToSidebar(el, score);
        // Get the tweet from this element
        let blockInnerTextContent = el.querySelectorAll(
            'div[data-content-editable-leaf="true"]'
        )[0];

        blockInnerTextContent.style.color = "red";
        blockInnerTextContent.addEventListener("click", () => {
            getNewGeneratedContentForReplacement(blockInnerTextContent);
        });

        return;
    };
})();

async function getNewGeneratedContentForReplacement(currentNode) {

}

async function getBlockTextContentRiskScore(blockText) {
    // Return a random between 0 to 50
    try {
        console.log("Raw texts", blockText);
        const resp = await fetch("http://localhost:8080/api/v1/detect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: blockText
            })
        });

        const result = await resp.json();
        console.log(result.result);
        return Promise.resolve(result.result);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

// Function to call for each element of the homepage
let runScript = (function () {
    return async function (allNodes) {
        // Cast allNodes to an array
        allNodes = Array.from(allNodes);
        let promises = allNodes.map(async (node, i) => {
            // Reset score
            let score = 0;
            // Get block's text content for analysis
            let blockTextContent = getTextContent(node);
            // Make backend call to identify if content might be generated by a bot
            blockTextRiskScore = await getBlockTextContentRiskScore(
                blockTextContent
            );

            // Log score of content
            console.log(
                "Paragraph has a risk score eval of: " + blockTextRiskScore
            );

            console.log("blockTextRiskScore", blockTextRiskScore);
            console.log("threshold", threshold);
            if (blockTextRiskScore < threshold) {
                console.log("THIS IS BEING INVOKED! INDEED!");
                addWarning(node, score);
            }
            return blockTextRiskScore;
        });
        let allScores = await Promise.all(promises);
        return allScores;
    };
})();

// Function to call on product page
let runScriptProductPage = (function () {
    return async function (wrapper) {
        const categories = Array.from(wrapper.querySelectorAll(".page-product__breadcrumb > a, span")).map((breadcrumb) => {
            return breadcrumb.innerText;
        });

        const productRowAndColumn = wrapper.querySelector(".product-detail");
        console.log({
            categories,
        });
        console.log(">>>", productRowAndColumn);
    };
})();

const loadCss = function () {
    let $ = document;
    let head = $.getElementsByTagName("head")[0];
    let link = $.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("contentStyle.css");
    link.media = "all";
    head.appendChild(link);
};

const waitFor = function (
    varSetter,
    sleepTime,
    condition,
    continuation
) {
    let variable = varSetter();
    if (!condition(variable)) {
        setTimeout(
            () => waitFor(varSetter, sleepTime, condition, continuation),
            sleepTime
        );
    } else {
        continuation(variable);
    }
};

waitFor(
    getWrapper,
    1000,
    (wrapper) => wrapper !== undefined,
    function (wrapper) {
        // Pre-load CSS
        // loadCss();

        // Check if the url is a product page or search page by checking the url
        const url = window.location.href;
        const isSearchPage = url.includes("search");

        if (!isSearchPage) {
            runScriptProductPage(wrapper);
        }

        // Product specific pages

        // loadCss();

        // Observe for changes of wrapper's child nodes
        // (() => {
        //     scanDiv(wrapper, function (el) {
        //         var addedNodes = [],
        //             removedNodes = [];

        //         // Record down added divs
        //         el.forEach((record) => {
        //             record.addedNodes.length &
        //                 addedNodes.push(...record.addedNodes);
        //         });

        //         // Record down deleted divs
        //         el.forEach(
        //             (record) =>
        //                 record.removedNodes.length &
        //                 removedNodes.push(...record.removedNodes)
        //         );

        //         // Run the script for added nodes
        //         runScript(addedNodes);

        //         console.log("Added:", addedNodes, "Removed:", removedNodes);
        //     });
        // })();
    }
);