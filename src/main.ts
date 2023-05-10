import { forEach } from 'lodash';

const viewport = document.createElement('meta');

function cleanElements() {
  ['meta[name=viewport]', '#minWidthSpacer'].forEach((selector) => {
    const el = document.querySelector(selector);
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }
  });

  forEach(document.querySelectorAll('style'), (s) => {
    if (/@-ms-viewport/.test(s.textContent || '')) {
      s.parentElement?.removeChild(s);
    }
  });

  viewport.setAttribute('name', 'viewport');
  viewport.setAttribute('content', 'width=device-width, initial-scale=1');

  document.head.appendChild(viewport);
}

function extendStyles() {
  GM_addStyle(/* css */ `
    body {
      font-size: 14px
    }
    
    #mc > * {
      margin-left: 0;
      margin-right: 0;
    }
    `);
}

function main() {
  cleanElements();

  extendStyles();
}

main();
