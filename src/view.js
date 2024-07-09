import onChange from 'on-change';
import initFeedsAndPosts from './modules/view/initFeedsAndPosts.js';
import renderSendingState from './modules/view/renderSendingState.js';
import renderSuccessfulState from './modules/view/renderSuccessfulState.js';
import renderErrorState from './modules/view/renderErrorState.js';
import renderFeeds from './modules/view/renderFeeds.js';
import renderPosts from './modules/view/renderPosts.js';
import renderModal from './modules/view/renderModal.js';
import renderCheckedPost from './modules/view/renderCheckedPost.js';

export default (elements, i18n, state) => {
  const watchedState = onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'form.status':
        if (value === 'sending') {
          renderSendingState(elements);
        } else {
          renderSuccessfulState(elements, i18n);
        }
        break;
      case 'form.errors':
        renderErrorState(elements, i18n, value);
        break;
      case 'feeds':
        if (prevValue.length === 0) {
          initFeedsAndPosts(elements.postsWrapper, elements.feedsWrapper, i18n);
        }
        renderFeeds(value);
        break;
      case 'posts':
        renderPosts(watchedState, i18n, value);
        break;
      case 'modal.postId':
        renderModal(watchedState, elements, value);
        break;
      case 'ui.seen':
        renderCheckedPost(watchedState, elements, value);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
