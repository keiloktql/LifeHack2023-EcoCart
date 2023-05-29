// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
console.info('chrome-ext template-vanilla-js content script');

// Get the wrapper element
function getWrapper() {
  return document.querySelectorAll('div[role="main"]')[0];
}

// Get a specific element
function getSpecificElement() {
  return document.querySelector('div.page-product__content');
}

// Function to call on product page
const runScriptProductPage = (function () {
  return async function () {
    // Variables
    const wrapper = getWrapper();
    const productInformation = {
      categories: [],
    };
    const breadcrumbWrapper = wrapper.querySelector(
      'div.page-product__breadcrumb',
    );
    const productWrapper = wrapper.querySelector('.page-product__detail > div');
    const productRowAndColumn = productWrapper.querySelectorAll('div.dR8kXc');

    // Scripting
    productInformation.categories = Array.from(
      breadcrumbWrapper.querySelectorAll('a, span'),
    ).map((breadcrumb) => {
      return breadcrumb.innerText;
    });

    productInformation['Product Name'] =
      productInformation.categories[productInformation.categories.length - 1];
    Array.from(productRowAndColumn).forEach((row) => {
      const title = row.querySelector('label').innerText;
      const body =
        (row.querySelector('div') && row.querySelector('div').innerText) || '';

      // if the body is an empty string, it might be because it's a link / anchor tag
      if (body === '') {
        const anchor = row.querySelector('a');
        if (anchor) {
          productInformation[title] = anchor.innerText;
        }
      } else {
        productInformation[title] = body;
      }
    });

    console.log(productInformation);
  };
})();

// Insert banner into the page
const addReinforcement = async function (positive = true) {
  console.log('HELLO');
};

const waitFor = function (varSetter, sleepTime, condition, continuation) {
  const variable = varSetter();

  if (!condition(variable)) {
    setTimeout(
      () => waitFor(varSetter, sleepTime, condition, continuation),
      sleepTime,
    );
  } else {
    continuation(variable);
  }
};

const loadCss = function () {
  const $ = document;
  const head = $.getElementsByTagName('head')[0];
  const link = $.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('popup.css');
  link.media = 'all';
  head.appendChild(link);
};

(() => {
  console.log('HIII');
  waitFor(
    getSpecificElement,
    1000,
    (wrapper) =>
      wrapper !== null &&
      wrapper.querySelector('.page-product__detail') !== null,
    function () {
      console.log('THIS IS BEING CALLED');
      // Check if the url is a product page or search page by checking the url
      const url = window.location.href;
      const isSearchPage = url.includes('search');

      if (!isSearchPage) runScriptProductPage(getWrapper());
    },
  );
})();
