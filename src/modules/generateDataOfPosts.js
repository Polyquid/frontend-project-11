import { uniqueId } from 'lodash';
import createNodeOfPost from './createNodeOfPost.js';

export default (rssData, id, i18n, watchedState) => [...rssData.querySelectorAll('item')].map((post) => {
  const postData = {
    title: post.querySelector('title')?.textContent,
    description: post.querySelector('description')?.textContent,
    link: post.querySelector('link')?.textContent,
    feedId: id,
    postId: uniqueId(),
  };
  const node = createNodeOfPost(postData, i18n, watchedState);
  return { ...postData, node };
});
