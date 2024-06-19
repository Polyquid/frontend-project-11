import { uniqueId } from 'lodash';

export default (rssData) => {
  const title = rssData.querySelector('title').textContent;
  const description = rssData.querySelector('description').textContent;
  const id = uniqueId();
  const posts = [...rssData.querySelectorAll('item')].map((post) => ({
    title: post.querySelector('title').textContent,
    description: post.querySelector('description').textContent,
    link: post.querySelector('link').textContent,
    feedId: id,
    postId: uniqueId(),
  }));
  return {
    title,
    description,
    id,
    posts,
  };
};
