// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

(() => {
  function getWrapper(): Element | null {
    try {
      const wrapper = document.querySelector('div.container');
      if (wrapper === null) {
        throw new Error('Wrapper element not found');
      }

      return wrapper;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const overrideCheckoutButton = async function (wrapper): Promise<void> {
    const checkoutFooter = wrapper.querySelector('.rnocow > div.c2pfrq');
    console.log(checkoutFooter);
    // Create a div
    const node = document.createElement('button');
    node.id = 'ecocart-button';
    node.classList.add('shopee-button-solid', 'shopee-button-solid--primary');
    // Make a node a button
    node.innerHTML = `
              <span class="btn__content">
                  <span class="btn__text">Calculate Carbon Footprint</span>
              </span>
          `;
    // Insert the button before the checkout button if there are no existing buttons with the same id
    if (checkoutFooter.querySelector('#ecocart-button') === null) {
      // Insert it before the last child
      checkoutFooter.insertBefore(node, checkoutFooter.lastChild);
    }
  };

  // Function to call on product page
  const runScriptProductPage = (function () {
    return async function (wrapper) {
      console.log('running script');
      console.log(wrapper);
      await overrideCheckoutButton(wrapper);
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
    1000,
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
