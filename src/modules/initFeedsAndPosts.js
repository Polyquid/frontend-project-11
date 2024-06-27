export default (postsWrapper, feedsWrapper, i18n) => {
  const postsElem = document.createElement('div');
  postsElem.classList.add('card', 'border-0');
  const postsHeader = document.createElement('div');
  postsHeader.classList.add('card-body');
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = i18n.t('posts.title');
  const postsBody = document.createElement('ul');
  postsBody.classList.add('list-group', 'border-0', 'rounded-0');

  postsHeader.append(postsTitle);
  postsElem.append(postsHeader);
  postsElem.append(postsBody);
  postsWrapper.append(postsElem);

  const feedsElem = document.createElement('div');
  feedsElem.classList.add('card', 'border-0');
  const feedsHeader = document.createElement('div');
  feedsHeader.classList.add('card-body');
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18n.t('feeds.title');
  const feedsBody = document.createElement('ul');
  feedsBody.classList.add('list-group', 'border-0', 'rounded-0');

  feedsHeader.append(feedsTitle);
  feedsElem.append(feedsHeader);
  feedsElem.append(feedsBody);
  feedsWrapper.append(feedsElem);
};
