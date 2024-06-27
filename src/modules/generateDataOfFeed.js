import { uniqueId } from 'lodash';

export default (rssData) => {
  const title = rssData.querySelector('title').textContent;
  const description = rssData.querySelector('description').textContent;
  const id = uniqueId();
  return {
    title,
    description,
    id,
  };
};
