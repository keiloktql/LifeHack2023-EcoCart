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
              <div class="shopee-icon-button shopee-icon-button--inactive shopee-icon-button--small shopee-icon-button--circle">
                    <div class="shopee-icon-button__icon">
                        Preferred Brand
                    </div>
                </div>
                `;
              card.querySelector('.hpDKMN')?.prepend(pill);
              card.style.backgroundColor = 'green';

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
