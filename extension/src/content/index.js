console.info('chrome-ext template-vanilla-js content script');

// Get the wrapper element
function getWrapper() {
  return document.querySelectorAll('div[role="main"]')[0];
}

// Function to call on product page
const runScriptProductPage = (function () {
  return async function (wrapper) {
    console.log(wrapper);
    // Variables
    const productInformation = {
      categories: []
    };
    const breadcrumbWrapper = wrapper.querySelector("div.page-product__breadcrumb");
    const productWrapper = wrapper.querySelectorAll("div.product-detail > div")[0];
    const productRowAndColumn = productWrapper.querySelectorAll("div.dR8kXc");

    // Scripting
    productInformation.categories = Array.from(breadcrumbWrapper.querySelectorAll("a, span")).map((breadcrumb) => {
      return breadcrumb.innerText;
    });
    Array.from(productRowAndColumn).forEach((row) => {
      const title = row.querySelector("label").innerText;

      const body = (row.querySelector("div") && row.querySelector("div").innerText) || "";
      productInformation[title] = body;
    });
  };
})();


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

const loadCss = function () {
  var $ = document;
  var head = $.getElementsByTagName('head')[0];
  var link = $.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('popup.css');
  link.media = 'all';
  head.appendChild(link);
};

waitFor(
  getWrapper,
  3000,
  (wrapper) => wrapper !== undefined,
  function (wrapper) {
    // check if loading is done
    console.log("wrapper", wrapper);
    // Check if the url is a product page or search page by checking the url
    const url = window.location.href;
    const isSearchPage = url.includes("search");

    if (!isSearchPage) runScriptProductPage(wrapper);
  }
);

export { };
