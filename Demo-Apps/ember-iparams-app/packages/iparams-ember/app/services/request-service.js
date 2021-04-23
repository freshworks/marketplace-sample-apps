import Service, { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Utilities from '../utils/utilities';

export default class RequestServiceService extends Service {
  @service flashMessages;
  @service intl;

  getRequestV2(
    modelName,
    {
      itemPerPage = 100,
      page = 1,
      singlePage = false,
      suppressErrorMessage = false,
    } = {}
  ) {
    let headers = {
        Authorization: `Bearer ${window.configs.token}`,
        'Content-Type': 'application/json',
      },
      headerOptions = {
        headers: headers,
      };
    return new Promise((resolve, reject) => {
      window.client.request
        .get(
          `${window.configs.host}/v2/${modelName}?items_per_page=${itemPerPage}&page=${page}`,
          headerOptions
        )
        .then(
          async (data) => {
            let response = Utilities.safelyParseJson(data.response);

            if (!response) {
              reject({ error: 'No response payload' });
              debounce(
                this,
                this.showErrorMessage,
                this.intl.t('messages.general_error'),
                500
              );
              return;
            }

            let pagination = response.pagination,
              currentResults = response;

            if (
              singlePage ||
              !pagination ||
              pagination.current_page >= pagination.total_pages
            ) {
              resolve(currentResults);
              return;
            }
            try {
              let results = await this.getRequestV2(modelName, {
                itemPerPage,
                page: ++page,
                singlePage,
              });
              currentResults[modelName].pushObjects(results[modelName]);
              resolve(currentResults);
            } catch (e) {
              debounce(
                this,
                this.showErrorMessage,
                this.intl.t('messages.general_error'),
                500
              );
              reject(e);
            }
          },
          (error) => {
            if (!suppressErrorMessage) {
              let errorKey = 'messages.general_error';
              if (error && error.status === 400) {
                errorKey = 'messages.api_key_expired';
              } else if (error && error.message === 'Request timed out!') {
                errorKey = 'messages.request_timeout';
              }
              debounce(this, this.showErrorMessage, this.intl.t(errorKey), 500);
            }
            reject(error);
          }
        );
    });
  }

  showErrorMessage(message) {
    const flashMessages = this.flashMessages;
    flashMessages.danger(message, {
      sticky: true,
      priority: 100,
    });
  }
}
