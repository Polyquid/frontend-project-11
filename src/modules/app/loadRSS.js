import axios from 'axios';
import addProxyToUrl from './addProxyToUrl.js';

const loadRSS = (url) => new Promise((resolve, reject) => {
  axios.get(addProxyToUrl(url))
    .then((data) => resolve(data))
    .catch(() => reject(new Error('form.feedback.networkError')));
});

export default loadRSS;
