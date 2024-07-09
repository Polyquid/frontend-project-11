import createNodeOfPost from './createNodeOfPost.js';

const renderPosts = (watchedState, i18n, value) => {
  const postsBody = document.querySelector('.posts ul');
  postsBody.innerHTML = '';
  value.forEach((item) => {
    const node = createNodeOfPost(item, i18n, watchedState);
    if (watchedState.ui.seen.some((id) => id === item.id)) {
      const link = node.querySelector('a');
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal', 'link-secondary');
    }
    postsBody.append(node);
  });
};

export default renderPosts;
