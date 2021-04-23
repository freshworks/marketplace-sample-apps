window.fnGetConfigs = (configs) => {
  window.configs = configs;

  if (window.configs.apiToken) {
    // Update from Version 2
    window.configs = {
      account: {
        token: window.configs.apiToken,
        host: '',
      },
    };
  }

  window.dispatchEvent(new CustomEvent('configLoaded'));
};

window.fnPostConfigs = () => {
  if (!window.configs) {
    window.configs = {
      account: {
        token: '',
        host: '',
      },
    };
  }

  window.configs['__meta'] = {
    secure: ['account'],
  };

  return window.configs;
};

window.fnValidate = () => {
  if (!window.configs) {
    return true;
  }

  if (!window.configs.isSettingsVerified) {
    window.dispatchEvent(new CustomEvent('showErrorToast'));
    return false;
  }

  return true;
};
