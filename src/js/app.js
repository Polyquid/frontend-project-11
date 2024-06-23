import i18next from 'i18next';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { object, string, setLocale } from 'yup';
import { Modal } from 'bootstrap';
import initView from './view.js';
import initTextContent from './modules/initTextContent.js';
import ru from '../locales/ru.js';
import parseRSS from './modules/parseRSS.js';
import generateDataOfFeed from './modules/generateDataOfFeed.js';
import generateDataOfPosts from './modules/generateDataOfPosts.js';

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
    body: document.querySelector('body'),
    modal: {
      wrapper: new Modal(document.querySelector('.modal')),
      readAllButton: document.querySelector('.modal-footer>a'),
      title: document.querySelector('.modal-title'),
      description: document.querySelector('.modal-body'),
    },
  };
  const state = {
    urlInput: null,
    status: null,
    errors: [],
    feeds: [],
    posts: [],
    checkedPosts: null,
    modal: {
      isShown: false,
      title: null,
      description: null,
      link: null,
    },
  };
  const watchedState = initView(elements, i18nInstance, state);
  const trackingRSSFlow = (url, id) => {
    setTimeout(() => {
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${url}`)}`)
        .then((res) => {
          const rssData = parseRSS(res.data.contents);
          const newPosts = generateDataOfPosts(rssData, id, i18nInstance, watchedState);
          const filteredCurrentPosts = cloneDeep(watchedState.posts)
            .filter((post) => post.feedId === id);
          const filteredNewPosts = newPosts
            .filter((post) => !filteredCurrentPosts.some(({
              title: currTitle,
              description: currDes,
              link: currLink,
            }) => post.title === currTitle
            && post.description === currDes
            && post.link === currLink));
          watchedState.posts.unshift(...filteredNewPosts);
          trackingRSSFlow(url, id);
        })
        .catch((err) => console.log(err));
    }, 5000);
  };
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
              if (res.data.status.http_code >= 400) {
                watchedState.status = 'invalidRss';
                watchedState.errors.push('form.feedback.invalidRss');
              } else {
                const rssData = parseRSS(res.data.contents);
                const {
                  title,
                  description,
                  id,
                } = generateDataOfFeed(rssData);
                watchedState.feeds.push({
                  title,
                  description,
                  id,
                  url: watchedState.urlInput,
                });
                const newPosts = generateDataOfPosts(rssData, id, i18nInstance, watchedState);
                watchedState.posts.unshift(...newPosts);
                trackingRSSFlow(watchedState.urlInput, id);
                watchedState.status = 'form.feedback.ok';
                elements.rssForm.reset();
              }
            })
            .catch((err) => {
              console.log(err);
              watchedState.status = 'networkError';
              watchedState.errors.push('form.feedback.networkError');
            });
        }
      })
      .catch((err) => {
        watchedState.status = 'urlIsInvalid';
        watchedState.errors = err.errors;
      });
  });
};
