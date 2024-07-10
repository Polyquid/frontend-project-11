import onChange from 'on-change';
import initFeedsAndPosts from './initFeedsAndPosts.js';
import renderSendingState from './renderSendingState.js';
import renderSuccessfulState from './renderSuccessfulState.js';
import renderErrorState from './renderErrorState.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';
import renderModal from './renderModal.js';
import renderCheckedPost from './renderCheckedPost.js';

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
