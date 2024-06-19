import i18next from 'i18next';
import axios from 'axios';
import { object, string, setLocale } from 'yup';
import initView from './view.js';
import initTextContent from './modules/initTextContent.js';
import ru from '../locales/ru.js';
import parseRSS from './modules/parseRSS.js';
import generateDataOfFeedAndPosts from './modules/generateDataOfFeedAndPosts.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });
  initTextContent(document, i18nInstance);
  setLocale({
    string: {
      url: 'form.feedback.invalidUrl',
    },
  });
  const urlSchema = object({
    urlInput: string().url(),
  });
  const elements = {
    inputForm: document.querySelector('form .form-control'),
    rssForm: document.querySelector('.rss-form'),
    feedbackText: document.querySelector('.feedback'),
    submitButton: document.querySelector('button[type="submit"]'),
    postsWrapper: document.querySelector('.posts'),
    feedsWrapper: document.querySelector('.feeds'),
  };
  const state = {
    urlInput: null,
    status: null,
    errors: [],
    feeds: [],
    posts: [],
  };
  const watchedState = initView(elements, i18nInstance, state);
  elements.inputForm.addEventListener('input', (e) => {
    watchedState.urlInput = e.target.value.trim();
  });
  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    urlSchema.validate(watchedState)
      .then(() => {
        watchedState.status = 'sending';
        watchedState.errors.length = 0;
        if (watchedState.feeds.some(({ url }) => url === watchedState.urlInput)) {
          watchedState.status = 'alreadyExists';
          watchedState.errors.push('form.feedback.alreadyExists');
        } else {
          axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${watchedState.urlInput}`)}`)
            .then((res) => {
              const rssData = parseRSS(res.data.contents);
              const {
                title,
                description,
                id,
                posts,
              } = generateDataOfFeedAndPosts(rssData);
              watchedState.feeds.push({
                title,
                description,
                id,
                url: watchedState.urlInput,
              });
              watchedState.posts = [...watchedState.posts, ...posts];
              watchedState.status = 'form.feedback.ok';
            });
        }
      })
      .catch((err) => {
        watchedState.status = 'urlIsInvalid';
        watchedState.errors = err.errors;
      })
      .finally(() => {
        elements.rssForm.reset();
      });
  });
};
