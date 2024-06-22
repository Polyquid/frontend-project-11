import onChange from 'on-change';
import generateNodesOfFeeds from './modules/generateNodesOfFeeds.js';
import generateNodesOfPosts from './modules/generateNodesOfPosts.js';
import initFeedsAndPosts from './modules/initFeedsAndPosts.js';

export default (elements, i18n, state) => onChange(state, (path, value, prevValue) => {
  if (path === 'errors') {
    elements.submitButton.removeAttribute('disabled');
    elements.feedbackText.textContent = i18n.t(value);
    elements.inputForm.classList.add('is-invalid');
    elements.feedbackText.classList.remove('text-success');
    elements.feedbackText.classList.add('text-danger');
  }
  if (path === 'status' && value === 'sending') {
    elements.submitButton.setAttribute('disabled', '');
    elements.inputForm.classList.remove('is-invalid');
    elements.feedbackText.textContent = '';
    elements.inputForm.classList.remove('is-invalid');
  }
  if (path === 'status' && value === 'form.feedback.ok') {
    elements.submitButton.removeAttribute('disabled');
    elements.inputForm.classList.remove('is-invalid');
    elements.feedbackText.textContent = i18n.t(value);
    elements.feedbackText.classList.add('text-success');
    elements.feedbackText.classList.remove('text-danger');
  }
  if (path === 'feeds' && prevValue.length === 0) {
    initFeedsAndPosts(elements.postsWrapper, elements.feedsWrapper, i18n);
  }
  if (path === 'feeds') {
    const feedsBody = document.querySelector('.feeds ul');
    feedsBody.innerHTML = '';
    const elems = generateNodesOfFeeds(value);
    elems.forEach((elem) => feedsBody.append(elem));
  }
  if (path === 'posts') {
    const postsBody = document.querySelector('.posts ul');
    postsBody.innerHTML = '';
    const elems = generateNodesOfPosts(value, i18n);
    elems.forEach((elem) => postsBody.append(elem));
  }
});
