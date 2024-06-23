const setTextContent = (elements, i18n, path = []) => {
  const entries = Object.entries(elements);
  entries.forEach(([name, node]) => {
    if (!(node instanceof HTMLElement)) {
      setTextContent(node, i18n, [...path, name]);
      return;
    }
    const pathName = path.length > 0 ? `${path.join('.')}.` : '';
    if (name.includes('Placeholder')) {
      node.setAttribute('placeholder', i18n.t(`${pathName}${name}`));
      return;
    }
    node.textContent = i18n.t(`${pathName}${name}`);
  });
};

export default (document, i18n) => {
  const mapElements = {
    title: document.querySelector('h1'),
    description: document.querySelector('h1+p'),
    form: {
      inputPlaceholder: document.querySelector('input[name="url"]'),
      labelUrl: document.querySelector('label[for="url"]'),
      submit: document.querySelector('button[type="submit"]'),
      exampleUrl: document.querySelector('#exampleUrl'),
    },
    created: {
      template: document.querySelector('#authorTemplate'),
      author: document.querySelector('#author'),
    },
    modal: {
      close: document.querySelector('.modal-footer>button'),
      readAll: document.querySelector('.modal-footer>a'),
    },
  };
  setTextContent(mapElements, i18n);
};
