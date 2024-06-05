import i18next from 'i18next';
import onChange from 'on-change';
import { object, string, setLocale } from 'yup';
import initTextContent from './modules/initTextContent.js';
import ru from '../../locales/ru.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });
  const state = {
    urlInput: null,
    isValid: null,
    errorMessage: [],
  };
  initTextContent(document, i18nInstance);

  setLocale({
    string: {
      url: i18nInstance.t('form.feedback.invalidUrl'),
    },
  });

  const urlSchema = object({
    urlInput: string().url(),
  });

  const inputForm = document.querySelector('form .form-control');
  const rssForm = document.querySelector('.rss-form');
  const feedbackText = document.querySelector('.feedback');
  const watchedState = onChange(state, (path, value) => {
    if (path === 'errors') {
      feedbackText.textContent = i18nInstance.t('form.feedback.invalidUrl');
      inputForm.classList.add('is-invalid');
    }
    if (path === 'isValid' && value === true) {
      feedbackText.textContent = '';
      inputForm.classList.remove('is-invalid');
    }
  });
  inputForm.addEventListener('input', (e) => {
    watchedState.urlInput = e.target.value.trim();
  });
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    urlSchema.validate(watchedState)
      .then(() => {
        watchedState.isValid = true;
        watchedState.errors.length = 0;
      })
      .catch((err) => {
        watchedState.isValid = false;
        watchedState.errors = err.errors;
      });
  });
};
