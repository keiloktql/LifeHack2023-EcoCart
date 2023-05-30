// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getStorageData, setStorageData } from './storage';

// Generate a list of preferred brands that are environmentally conscious and friendly
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

(() => {
  function getWrapper(): Element | null {
    try {
      const wrapper = document.querySelector(
        '.shopee-search-item-result__items',
      );

      return wrapper;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Function to call on product page
  const runScriptProductPage = (function () {
    return async function (wrapper) {
      const cards = wrapper.querySelectorAll(
        '.shopee-search-item-result__item',
      );

      // Loop through the cards and see if the title contains any of the preferred brands
      for (const card of cards) {
        const title = card.querySelector('.Cve6sh')?.textContent;

        if (title !== null) {
          for (const brand of PREFERRED_BRANDS) {
            if (title?.includes(brand)) {
              console.log('Found preferred brand:', brand);
              // Change the cards to green

              // Add a  pill saying this is a preferred brand
              // Prepend the pill to the card
              const pill = document.createElement('div');
              pill.innerHTML = `
                  <div style="color: #084C2E; width: 100%; border-radius: 3px; border: 1px solid #099250; white-space: nowrap; display: inline-block; font-size: 0.8em; padding: 0.125rem 0.25rem; text-align: center; margin-bottom: 10px;">
                  <img src="https://ecocart-lifehack2023.netlify.app/favicon.ico" style="height: 10px; width: 10px; margin-right: 5px;" />
                      EcoCart Preferred
                  </div>
                `;
              card.querySelector('.hpDKMN')?.prepend(pill);
              card.querySelector('.hpDKMN').style =
                'display: flex; flex-direction: column; height: 100%; align-items: start; justify-content: flex-end';
              card.querySelector('.rVLWG6').style = 'flex-grow: 0';

              // if the user clicks on the card, add score to the user in chrome storage
              card.addEventListener('click', async () => {
                const currentStorageData = await getStorageData();
                const newStorageData = Object.assign({}, currentStorageData, {
                  score: currentStorageData.score + 1,
                });
                await setStorageData(newStorageData);
              });
            }
          }
        }
      }
    };
  })();

  const waitFor = function (
    varSetter: any,
    sleepTime: number,
    condition: any,
    continuation: any,
  ) {
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

  waitFor(
    getWrapper,
    3000,
    (wrapper: Element | null) => wrapper !== null,
    function (wrapper: Element) {
      // Check if the url is a product page or search page by checking the url
      try {
        runScriptProductPage(wrapper);
      } catch (err) {
        console.log(err);
      }
    },
  );
})();
