const validateUrl = (urlSchema, currentUrl, feeds) => new Promise((resolve, reject) => {
  urlSchema.validate(currentUrl)
    .then((data) => {
      if (feeds.some(({ url }) => url === currentUrl.url)) {
        const error = new Error('form.feedback.alreadyExists');
        reject(error);
      } else {
        resolve(data);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export default validateUrl;
