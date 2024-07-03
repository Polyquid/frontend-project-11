import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import { object, string } from 'yup';
import { Modal } from 'bootstrap';
import initView from './view.js';
import initTextContent from './modules/initTextContent.js';
import ru from './locales/ru.js';
import parseRSS from './modules/parseRSS.js';
import generateDataOfFeed from './modules/generateDataOfFeed.js';
import generateDataOfPosts from './modules/generateDataOfPosts.js';
import yupLocale from './locales/yupLocale.js';
import addProxyToUrl from './modules/addProxyToUrl.js';
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
    const trackingRSSFlow = (url, id) => {
      setTimeout(() => {
        axios.get(addProxyToUrl(url))
          .then((res) => {
            const rssData = parseRSS(res.data.contents);
            const newPosts = generateDataOfPosts(rssData, id, i18nInstance, watchedState);
            const filteredCurrentPosts = watchedState.posts
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
          .catch((error) => {
            console.log(error);
          });
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
          console.log(res);
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
            const postId = uniqueId();
            const node = createNodeOfPost({ ...item, postId }, i18nInstance, watchedState);
            return {
              ...item,
              id: feed.id,
              postId,
              node,
            };
          });
          watchedState.feeds.push(feed);
          watchedState.posts.unshift(...posts);
        })
        .catch((error) => {
          watchedState.form.isValid = false;
          watchedState.form.status = getLoadingProcessErrorType(error);
          watchedState.form.errors.push(error.message);
        });
      // urlSchema.validate(currentUrl)
      //   .then(() => {
      //     watchedState.form.status = 'sending';
      //     watchedState.form.errors.length = 0;
      //     if (watchedState.feeds.some(({ url }) => url === currentUrl.url)) {
      //       watchedState.form.status = 'alreadyExists';
      //       watchedState.form.errors.push('form.feedback.alreadyExists');
      //     } else {
      //       axios.get(addProxyToUrl(currentUrl.url))
      //         .then((res) => {
      //           try {
      //             const rssData = parseRSS(res.data.contents);
      //             const {
      //               title,
      //               description,
      //               id,
      //             } = generateDataOfFeed(rssData);
      //             watchedState.feeds.push({
      //               title,
      //               description,
      //               id,
      //               url: currentUrl.url,
      //             });
      //             const newPosts = generateDataOfPosts(rssData, id, i18nInstance, watchedState);
      //             watchedState.posts.unshift(...newPosts);
      //             trackingRSSFlow(currentUrl.url, id);
      //             watchedState.form.isValid = true;
      //             elements.rssForm.reset();
      //           } catch (error) {
      //             watchedState.form.status = 'invalidRss';
      //             watchedState.form.isValid = false;
      //             watchedState.form.errors.push('form.feedback.invalidRss');
      //           }
      //         })
      //         .catch((error) => {
      //           console.log(error);
      //           watchedState.form.status = 'networkError';
      //           watchedState.form.isValid = false;
      //           watchedState.form.errors.push('form.feedback.networkError');
      //         });
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     watchedState.form.status = 'urlIsInvalid';
      //     watchedState.form.isValid = false;
      //     watchedState.form.errors = error.errors;
      //   });
    });
  });
};
