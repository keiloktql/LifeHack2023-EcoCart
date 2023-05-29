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

function doesProductExistInDatabase() {
  return false;
}

// Function to call on product page
const runScriptProductPage = (function () {
  return async function (wrapper) {
    try {
      // Variables
      const productInformation = {
        categories: [],
      };

      const breadcrumbWrapper = wrapper.querySelector(
        'div.page-product__breadcrumb',
      );
      const productWrapper = wrapper.querySelector(
        '.page-product__detail > div',
      );
      const productRowAndColumn = productWrapper.querySelectorAll('div.dR8kXc');

      // Scripting
      productInformation.categories = Array.from(
        breadcrumbWrapper.querySelectorAll('a, span'),
      ).map((breadcrumb) => breadcrumb.innerText);
      productInformation['Product Name'] =
        productInformation.categories[productInformation.categories.length - 1];

      Array.from(productRowAndColumn).forEach((row) => {
        const title = row.querySelector('label').innerText;
        const body = row.querySelector('div')?.innerText || '';

        // Check if the body is an empty string, it might be a link / anchor tag
        if (body === '') {
          const anchor = row.querySelector('a');
          if (anchor) {
            productInformation[title] = anchor.innerText;
          }
        } else {
          productInformation[title] = body;
        }
      });

      const productTitleWrapper = wrapper.querySelector('._44qnta');
      document.querySelector('div[id="ecocart-flag"]')?.remove();
      productTitleWrapper.parentElement.prepend(
        await addReinforcement(doesProductExistInDatabase, productInformation),
      );
    } catch (err) {
      console.log(err);
    }
  };
})();

// Insert banner into the page
const addReinforcement = async function (
  dataExistInDatabase = false,
  productInformation = {},
) {
  const node = document.createElement('div');
  node.innerHTML = `
    <div id="ecocart-flag" class="ecocart-banner" style="border: 1px solid var(--petalc); color: var(--petalc); background: #CBF0C1; /* padding: 1rem; */ font: 0.9rem sans-serif; width: 100%; margin-bottom: 1rem; padding-left: 1rem; padding-top: 1rem; padding-bottom: 1rem; border-radius: 5px;">
      <span>
        ${dataExistInDatabase && '<img src="https://w7.pngwing.com/pngs/910/897/png-transparent-twitter-verified-badge-hd-logo.png" style="height: 17px; width: 17px;">'}
        Did you the process of making '${productInformation['Product Name']}' produces <b>1000kg</b> of CO2? That is equivalent to driving a car (10km) or charging your phone (1000 times)!
      </span>
    </div>`;

  return node;
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
  waitFor(
    getSpecificElement,
    1000,
    (wrapper) =>
      wrapper !== null &&
      wrapper.querySelector('.page-product__detail') !== null,
    function () {
      // Check if the url is a product page or search page by checking the url
      const url = window.location.href;
      const isSearchPage = url.includes('search');

      if (!isSearchPage) runScriptProductPage(getWrapper());
    },
  );
})();
