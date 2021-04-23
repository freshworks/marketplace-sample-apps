import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service flashMessages;
  @service intl;
  beforeModel() {
    window.addEventListener('showErrorToast', () => {
      const flashMessages = this.flashMessages;
      flashMessages.warning(this.intl.t('messages.app_save_error'), {
        timeout: 2000,
        sticky: false,
        priority: 100,
        showProgress: true,
      });
    });
  }
  setupController() {
    this.hideAppLoader();
  }
  hideAppLoader() {
    document.getElementById('jaya-app-loader').classList.add('hide-loader');
  }
}
