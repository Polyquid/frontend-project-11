import createNodesOfFeeds from './createNodesOfFeeds.js';

const renderFeeds = (value) => {
  const feedsBody = document.querySelector('.feeds ul');
  feedsBody.innerHTML = '';
  const feeds = createNodesOfFeeds(value);
  feeds.forEach((feed) => feedsBody.append(feed));
};

export default renderFeeds;
