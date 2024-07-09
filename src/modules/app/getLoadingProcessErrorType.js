const getLoadingProcessErrorType = (error) => {
  switch (error.message) {
    case 'form.feedback.invalidUrl':
      return 'invalidUrl';
    case 'form.feedback.alreadyExists':
      return 'alreadyExists';
    case 'form.feedback.invalidRss':
      return 'invalidRss';
    case 'form.feedback.networkError':
      return 'networkError';
    default:
      return 'unknown';
  }
};

export default getLoadingProcessErrorType;
