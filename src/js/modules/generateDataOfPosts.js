import { uniqueId } from 'lodash';

export default (rssData, id) => [...rssData.querySelectorAll('item')].map((post) => ({
  title: post.querySelector('title').textContent,
  description: post.querySelector('description').textContent,
  link: post.querySelector('link').textContent,
  feedId: id,
  postId: uniqueId(),
}));
