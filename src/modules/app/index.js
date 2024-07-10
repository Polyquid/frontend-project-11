import i18next from 'i18next';
import { uniqueId } from 'lodash';
import { object, string } from 'yup';
import { Modal } from 'bootstrap';
import initView from '../view/index.js';
import initTextContent from '../view/initTextContent.js';
import ru from '../../locales/ru.js';
import parseRSS from './parseRSS.js';
import yupLocale from '../../locales/yupLocale.js';
import validateUrl from './validateUrl.js';
import loadRSS from './loadRSS.js';
import getLoadingProcessErrorType from './getLoadingProcessErrorType.js';
import trackingRSSFlows from './trackingRSSFlows.js';

export default () => {
  const elements = {
    inputForm: document.querySelector('form .form-control'),
    rssForm: document.querySelector('.rss-form'),
    feedbackText: document.querySelector('.feedback'),
    submitButton: document.querySelector('.rss-form button[type="submit"]'),
    postsWrapper: document.querySelector('.posts'),
    feedsWrapper: document.querySelector('.feeds'),
    body: document.querySelector('body'),
    modal: new Modal(document.querySelector('.modal')),
  };
  const state = {
    form: {
      status: null,
      errors: [],
      isValid: false,
    },
    feeds: [],
    posts: [],
    modal: {
      postId: null,
    },
    ui: {
      seen: [],
    },
  };
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    initTextContent(document, i18nInstance);
    yupLocale();
    const urlSchema = object({
      url: string().url(),
    });
    const watchedState = initView(elements, i18nInstance, state);
    elements.rssForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const currentUrl = {
        url: data.get('url').trim(),
      };
      validateUrl(urlSchema, currentUrl, watchedState.feeds)
        .then(({ url }) => {
          watchedState.form.status = 'sending';
          watchedState.form.errors = [];
          return loadRSS(url);
        })
        .then((res) => {
          watchedState.form.status = 'done';
          return parseRSS(res.data.contents);
        })
        .then(({ title, description, items }) => {
          const feed = {
            title,
            description,
            id: uniqueId(),
            url: currentUrl.url,
          };
          const posts = items.map((item) => {
            const id = uniqueId();
            return {
              ...item,
              feedId: feed.id,
              id,
            };
          });
          watchedState.feeds.unshift(feed);
          watchedState.posts.unshift(...posts);
          elements.rssForm.reset();
        })
        .catch((error) => {
          watchedState.form.isValid = false;
          watchedState.form.status = getLoadingProcessErrorType(error);
          watchedState.form.errors.push(error.message);
        });
    });
    trackingRSSFlows(watchedState);
  });
};
