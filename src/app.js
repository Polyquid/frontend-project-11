import i18next from 'i18next';
import { uniqueId } from 'lodash';
import { object, string } from 'yup';
import { Modal } from 'bootstrap';
import initView from './view.js';
import initTextContent from './modules/initTextContent.js';
import ru from './locales/ru.js';
import parseRSS from './modules/parseRSS.js';
import yupLocale from './locales/yupLocale.js';
import validateUrl from './modules/validateUrl.js';
import loadRSS from './modules/loadRSS.js';
import createNodeOfPost from './modules/createNodeOfPost.js';
import getLoadingProcessErrorType from './modules/getLoadingProcessErrorType.js';

export default () => {
  const elements = {
    inputForm: document.querySelector('form .form-control'),
    rssForm: document.querySelector('.rss-form'),
    feedbackText: document.querySelector('.feedback'),
    submitButton: document.querySelector('.rss-form button[type="submit"]'),
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
    form: {
      status: null,
      errors: [],
      isValid: false,
    },
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
    const trackingRSSFlow = (url, feedId) => {
      setTimeout(() => {
        loadRSS(url)
          .then((res) => parseRSS(res.data.contents))
          .then(({ items }) => {
            const filteredCurrentPosts = watchedState.posts
              .filter((post) => post.feedId === feedId);
            const filteredNewPosts = items
              .filter((post) => !filteredCurrentPosts.some(({
                title: currTitle,
                description: currDes,
                link: currLink,
              }) => post.title === currTitle
              && post.description === currDes
              && post.link === currLink))
              .map((item) => {
                const id = uniqueId();
                const node = createNodeOfPost({ ...item, id }, i18nInstance, watchedState);
                return {
                  ...item,
                  feedId,
                  id,
                  node,
                };
              });
            watchedState.posts.unshift(...filteredNewPosts);
            trackingRSSFlow(url, feedId);
          })
          .catch((error) => console.error(error));
      }, 5000);
    };
    elements.rssForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const currentUrl = {
        url: data.get('url').trim(),
      };
      validateUrl(urlSchema, currentUrl, watchedState.feeds)
        .then(({ url }) => {
          watchedState.form.status = 'sending';
          watchedState.form.errors.length = 0;
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
            const node = createNodeOfPost({ ...item, id }, i18nInstance, watchedState);
            return {
              ...item,
              feedId: feed.id,
              id,
              node,
            };
          });
          watchedState.feeds.push(feed);
          watchedState.posts.unshift(...posts);
          trackingRSSFlow(currentUrl.url, feed.id);
          elements.rssForm.reset();
        })
        .catch((error) => {
          watchedState.form.isValid = false;
          watchedState.form.status = getLoadingProcessErrorType(error);
          watchedState.form.errors.push(error.message);
        });
    });
  });
};
