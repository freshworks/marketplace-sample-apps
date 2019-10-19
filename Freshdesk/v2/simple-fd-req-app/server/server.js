'use strict';
const base64 = require('base-64');
exports = {
    /**
     * @returns Object
     * @param {*} args 
     */
    getIparams : function(args) {
        const { iparams } = args;
        const { fd_domain, fd_api_key } = iparams;
        renderData(null, {
            fd_domain, 
            fd_api_key : base64.encode(fd_api_key)
        });
    }
}