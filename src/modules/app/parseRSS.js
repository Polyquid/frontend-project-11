const parser = new DOMParser();

export default (data) => new Promise((resolve, reject) => {
  const rssDOM = parser.parseFromString(data, 'text/xml');
  const parseError = rssDOM.querySelector('parsererror');
  if (parseError) {
    reject(new Error('form.feedback.invalidRss'));
  }
  const title = rssDOM.querySelector('title').textContent;
  const description = rssDOM.querySelector('description').textContent;
  const items = [...rssDOM.querySelectorAll('item')].map((post) => {
    const postData = {
      title: post.querySelector('title')?.textContent,
      description: post.querySelector('description')?.textContent,
      link: post.querySelector('link')?.textContent,
    };
    return postData;
  });
  resolve({ title, description, items });
});
