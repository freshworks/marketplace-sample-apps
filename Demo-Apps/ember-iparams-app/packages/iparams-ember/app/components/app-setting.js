import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class AppSettingComponent extends Component {
  // Keeps track of whether the integration is verified
  @tracked isIntegrationVerified = false;

  // Keeps track of whether the 'verify button was ever clicked
  @tracked isIntegrationVerifyClicked = false;

  // Keeps track of the integration input domain
  @tracked integrationDomain;

  // Keeps track of the integration input token
  @tracked integrationToken;

  @service requestService;

  constructor() {
    super(...arguments);
    this.initializeIntegration();
    this.bindConfigEventListener();
  }

  bindConfigEventListener() {
    window.addEventListener('configLoaded', () => {
      this.initializeIntegration();
    });
  }

  initializeIntegration() {
    if (!window.configs) {
      window.configs = {
        account: {
          token: '',
          host: '',
        },
      };
    }

    if (
      window.configs &&
      window.configs.account &&
      window.configs.account.token &&
      window.configs.account.host
    ) {
      this.integrationDomain = window.configs.account.host;
      this.integrationToken = window.configs.account.token;
      this.isIntegrationVerified = true;
      this.isIntegrationVerifyClicked = true;
      window.configs.isSettingsVerified = true;
    } else {
      this.integrationDomain = window.configs.account.host || '';
      this.integrationToken = window.configs.account.token || '';
    }
  }

  @action
  verifyIntegration() {
    return new RSVP.Promise((resolve) => {
      window.configs.account.token = this.integrationToken;
      window.configs.account.host = this.integrationDomain;
      this.requestService
        .getRequestV2('agents', {
          itemPerPage: 10,
          singlePage: true,
          suppressErrorMessage: true,
        })
        .then(
          (data) => {
            if (data) {
              this.isIntegrationVerified = true;
              this.isIntegrationVerifyClicked = true;
              window.configs.account.token = this.integrationToken;
              window.configs.account.host = this.integrationDomain;

              this.canRouteToRules();

              resolve();
            }
          },
          () => {
            this.isIntegrationVerified = false;
            this.isIntegrationVerifyClicked = true;
            window.configs.isSettingsVerified = false;
            window.configs.account.token = '';
            window.configs.account.host = '';
            resolve();
          }
        );
    });
  }

  @action
  onInputChange() {
    this.isIntegrationVerified = false;
    this.isIntegrationVerifyClicked = false;
  }

  canRouteToRules() {
    if (this.isIntegrationVerified) {
      window.configs.isSettingsVerified = true;
    } else {
      window.configs.isSettingsVerified = false;
    }
  }
}
