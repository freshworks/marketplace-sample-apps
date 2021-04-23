window.fnGetConfigs = (configs) => {
  window.configs = configs;
  window.dispatchEvent(new CustomEvent('configLoaded'));
};

window.fnPostConfigs = () => {
  window.configs['__meta'] = {
    secure: ['token', 'host'],
  };

  return window.configs;
};

window.fnValidate = () => {
  if (!window.configs.isSettingsVerified) {
    window.dispatchEvent(new CustomEvent('showErrorToast'));
    return false;
  }

  return true;
};
