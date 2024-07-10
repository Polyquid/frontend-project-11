import { uniqueId, differenceWith, isEqual } from 'lodash';
import loadRSS from './loadRSS.js';
import parseRSS from './parseRSS.js';

const trackingRSSFlows = (watchedState) => {
  setTimeout(() => {
    const promises = watchedState.feeds.map(({ id, url }) => loadRSS(url)
      .then((res) => parseRSS(res.data.contents))
      .then(({ items }) => {
        const filteredCurrentPosts = watchedState.posts
          .filter((post) => post.feedId === id)
          .map(({ title, description, link }) => ({
            title,
            description,
            link,
          }));
        const filteredNewPosts = differenceWith(items, filteredCurrentPosts, isEqual)
          .map((post) => ({ ...post, id: uniqueId(), feedId: id }));
        watchedState.posts.unshift(...filteredNewPosts);
      })
      .catch((error) => console.error(error)));
    Promise.all(promises)
      .then(() => trackingRSSFlows(watchedState));
  }, 5000);
};

export default trackingRSSFlows;
