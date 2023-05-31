// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
console.info('chrome-ext template-vanilla-js content script');

import { setStorageData, getStorageData } from './storage';

// Switch for the popup
let activePopup = false;
let counter = 0;
let theNewssite, haveNetflix, theSport, theHobby;
const PREFERRED_BRANDS = [
  'Uniqlo',
  'MUJI',
  'ITO EN',
  'The Body Shop',
  'Shiseido',
  'Innisfree',
  'Cosrx',
  'H&M Conscious',
  'Etude House',
  'Amorepacific',
  'Tata Power Solar',
  'Himalaya Herbals',
  'Neemrana Hotels',
  'Dabur',
  'Kao Corporation',
  'Lotte Group',
  'BYD',
  'Haier',
  'Samsung',
  'Tencent',
];

chrome.storage.local.get('newsSite', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  theNewssite = data.newsSite;
});
chrome.storage.local.get('netFlix', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  haveNetflix = data.netFlix;
});
chrome.storage.local.get('mySport', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  theSport = data.mySport;
});
chrome.storage.local.get('myHobby', (data) => {
  if (chrome.runtime.lastError) {
    return;
  }
  theHobby = data.myHobby;
});

const makePopup = (function () {
  return function (score) {
    // Check if element exists, otherwise make one
    let poop = document.getElementById('alertPopup');
    if (poop) document.getElementById('alertPopup').remove();

    poop = document.createElement('div');
    poop.setAttribute('id', 'alertPopup');

    document.body.prepend(poop);
    document.documentElement.classList.add('alertedPopup');

    // This would be so much easier with jQuery but lets not load a whole library to do one thing
    // $(poop).load("theHtmlFile.html"); though
    const request = new XMLHttpRequest();

    // eslint-disable-next-line no-undef
    request.open('GET', chrome.runtime.getURL('overlay.html'), true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        let resp = request.responseText;
        poop.innerHTML = resp;
        genPopup(poop, score);
      }
    };

    request.send();

    const genPopup = function (elem, score) {
      const populateNav = function (theNav) {
        if (theNav) {
          if (haveNetflix)
            theNav.innerHTML += '<a href="http://netflix.com">Netflix</a>';
          theNav.innerHTML += newsLink(theNewssite);
          theNav.innerHTML +=
            '<span>' +
            theSport[0].toUpperCase() +
            theSport.substring(1) +
            '</span>';
          theNav.innerHTML +=
            '<span>' +
            theHobby[0].toUpperCase() +
            theHobby.substring(1) +
            '</span>';
        }

        function newsLink(theNewssite) {
          let link;
          switch (theNewssite) {
            case 'gnn':
              link =
                '<a href="http://www.goodnewsnetwork.org">Good News Network</a>';
              break;
            case 'pn':
              link = '<a href="http://www.positive.news">Positive News</a>';
              break;
            case 'od':
              link =
                '<a href="http://www.optimistdaily.com">Optimist Daily</a>';
              break;
            case 'reddit':
              link =
                '<a href="http://reddit.com/r/UpliftingNews">r/UpliftingNews</a>';
              break;
            default:
              link = '';
              break;
          } //switch
          return link;
        }
      };
      // score should range from -0.5 to 0.5 (normalized)
      // lower is worse, if 100% turn off
      // go back to [0, 1] then subtract
      // populateNav(elem.querySelectorAll('.popupContent nav')[0]);

      let close1 = elem.querySelectorAll('.popupContent .cls')[0];
      console.log('>>> gay >>>');
      console.log(close1);
      let close2 = elem.querySelectorAll('.popupContent .fx')[0];
      console.log(close2);

      close1.style.visibility = 'hidden';
      setTimeout(function () {
        close1.style.visibility = 'visible';
        close2.style.visibility = 'hidden';
      }, 3000); //10s timer

      // Bind events
      close1.addEventListener('click', removePopup);
      close2.addEventListener('click', forceClosePopup);

      if (document.getElementsByClassName('petalbloom')[0] === undefined)
        return;
      // Kill some plants yo
      killFlower(score);
    };
  };
})();

// Function to regen petals over time
let tHnd; // global so that I can turn it off elsewhere

// Function to remove the popup gently and reset the score
let removePopup = function () {
  const thePopup = document.getElementById('alertPopup');
  if (thePopup) thePopup.remove();

  document.documentElement.classList.remove('alertedPopup');

  // Reset score
  totalScore = 0;
  activePopup = false;
  counter = 0;
};

// Function to force the popup to close
const forceClosePopup = function () {
  let thePopup = document.getElementById('alertPopup');
  if (thePopup) thePopup.remove();

  document.documentElement.classList.remove('alertedPopup');

  // Turn off the popup trigger
  activePopup = false;

  // Set timer to turn it on again
  activePopup = setTimeout(function () {
    return true;
  }, 10000);

  // Stop petals from regenerating
  clearInterval(tHnd);
};

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

function convertCO2ToUnit(grams) {
  const units = [
    { label: 'cigarettes', conversion: 21.8 },
    { label: 'car miles', conversion: 404 },
    { label: 'smartphone charges', conversion: 0.5 },
    // Add more units and their conversion factors as needed
  ];

  const convertedUnits = units.map((unit) => {
    // round to 2 decimal places
    const quantity = Math.round((grams / unit.conversion) * 100) / 100;

    return `${quantity} ${unit.label}`;
  });

  return convertedUnits;
}

// Function to call on product pagex
const runScriptProductPage = (function () {
  return async function (wrapper) {
    try {
      console.log(await getStorageData());
      // letiables
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

      for (const brand of PREFERRED_BRANDS) {
        if (productInformation['Product Name']?.includes(brand)) {
          makePopup(await getStorageData().score);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
})();

const runScriptSearchPage = (function () {
  return async function (wrapper) {
    console.log('DOOMED');
    console.log(wrapper);
  };
})();

// Insert banner into the page
const addReinforcement = async function (
  dataExistInDatabase = false,
  productInformation = {},
) {
  const arbitaryNumber = Math.floor(Math.random() * (1000 - 100) + 300);
  const relativeUnits = convertCO2ToUnit(arbitaryNumber);
  const node = document.createElement('div');
  node.innerHTML = `
    <div id="ecocart-flag" class="ecocart-banner" style="border: 1px solid let(--petalc); color: let(--petalc); background: #CBF0C1; padding: 1rem; font: 0.9rem sans-serif; margin-bottom: 1rem; padding-left: 1rem; padding-top: 1rem; padding-bottom: 1rem; border-radius: 5px;">
      <span style="display: flex; justify-content: center; align-items: center;">
        <span class="tooltip">
          <img src="https://cdn-icons-png.flaticon.com/512/665/665049.png" style="height: 17px; width: 17px; margin-right: 10px;">
          <span class="tooltiptext">Source generated from <a style="color: #79afe0; text-decoration: underline; " href="https://openai.com/" target="_blank" rel="noopener noreferrer">OpenAI</a></span>
        </span>
        <p>
          Did you the process of making '${
            productInformation['Product Name']
          }' produces <b>${arbitaryNumber}</b> of CO2? That is equivalent to <b>${relativeUnits.join(
    ', ',
  )}</b>!
        </p>
      </span>
      <div style="display: flex; justify-content: flex-end; align-items: center;">
        <img src="https://ecocart-lifehack2023.netlify.app/favicon.ico" style="height: 17px; width: 17px; margin-right: 10px;" />
        <h1 style="font-size: 12px;">EcoCart</h1>
      </div>  
    </div>`;

  return node;
};

const waitFor = function (letSetter, sleepTime, condition, continuation) {
  const letiable = letSetter();

  if (!condition(letiable)) {
    setTimeout(
      () => waitFor(letSetter, sleepTime, condition, continuation),
      sleepTime,
    );
  } else {
    continuation(letiable);
  }
};

const loadCss = function () {
  const $ = document;
  const head = $.getElementsByTagName('head')[0];
  const link = $.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('overlay.css');
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
      console.log('I AM BEING INVOKED HERE');
      // Check if the url is a product page or search page by checking the url
      const url = window.location.href;
      const isSearchPage = url.includes('search');

      console.log(isSearchPage);
      loadCss();
      if (!isSearchPage) {
        runScriptProductPage(getWrapper());
      } else {
        runScriptSearchPage(getWrapper());
      }
    },
  );
})();
