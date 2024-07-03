import onChange from 'on-change';
import generateNodesOfFeeds from './modules/generateNodesOfFeeds.js';
import initFeedsAndPosts from './modules/initFeedsAndPosts.js';

export default (elements, i18n, state) => onChange(state, (path, value, prevValue) => {
  if (path === 'form.errors') {
    elements.submitButton.removeAttribute('disabled');
    elements.feedbackText.textContent = i18n.t(value);
    elements.inputForm.classList.add('is-invalid');
    elements.feedbackText.classList.remove('text-success');
    elements.feedbackText.classList.add('text-danger');
  }
  if (path === 'form.status' && value === 'sending') {
    elements.submitButton.setAttribute('disabled', '');
    elements.inputForm.classList.remove('is-invalid');
    elements.feedbackText.textContent = '';
    elements.inputForm.classList.remove('is-invalid');
  }
  if (path === 'form.status' && value === 'done') {
    elements.submitButton.removeAttribute('disabled');
    elements.inputForm.classList.remove('is-invalid');
    elements.feedbackText.textContent = i18n.t('form.feedback.ok');
    elements.feedbackText.classList.add('text-success');
    elements.feedbackText.classList.remove('text-danger');
  }
  if (path === 'feeds' && prevValue.length === 0) {
    initFeedsAndPosts(elements.postsWrapper, elements.feedsWrapper, i18n);
  }
  if (path === 'feeds') {
    const feedsBody = document.querySelector('.feeds ul');
    feedsBody.innerHTML = '';
    const feeds = generateNodesOfFeeds(value);
    feeds.forEach((feed) => feedsBody.append(feed));
  }
  if (path === 'posts') {
    const postsBody = document.querySelector('.posts ul');
    postsBody.innerHTML = '';
    value.forEach(({ node }) => postsBody.append(node));
  }
  if (path.includes('modal') && typeof value === 'object') {
    elements.modal.title.textContent = value.title;
    elements.modal.description.textContent = value.description;
    elements.modal.readAllButton.setAttribute('href', `${value.link}`);
    elements.modal.wrapper.show();
  }
  if (path.includes('modal') && value === false) {
    elements.modal.wrapper.hide();
  }
  if (path.includes('checkedPosts')) {
    value.classList.remove('fw-bold');
    value.classList.add('fw-normal', 'link-secondary');
  }
});
