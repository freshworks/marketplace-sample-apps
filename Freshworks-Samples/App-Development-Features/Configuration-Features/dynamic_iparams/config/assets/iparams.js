/* global app,client, utils */

/**
 * App lifecycle method to initialize the app and to obtain the `client` object
 * More details on Dynamic Installation parameters can be found at https://developers.freshdesk.com/v2/docs/installation-parameters/#dynamic_install_page
 */
app.initialized().then(
    function (_client) {
        //If successful, register the app activated and deactivated event callback.
        window.client = _client;
    },
    function (error) {
        //If unsuccessful
        console.log(error);
    }
);

/**
 * Using this iparam callback function, we are validating the details using a third-party API. 
 * In this case, we are making use of `httpbin.org` to return 200 OK status. 
 * In real-world, this could be a valid third-party API that can return an approporiate status code
 * Payload and other options can be specified using `options`
 * 
 * @param {string} newValue The new value of the iparam field
 */
function checkAccountID(newValue) {
    //Validate
    if (!isNaN(newValue))
        return Promise.reject("Account ID has to be a string");
    //Verify account ID
    var url = "https://httpbin.org/status/200";
    var options = {
        body: JSON.stringify({
            param: newValue
        })
    };
    var p = new Promise(function (resolve, reject) {
        client.request.post(url, options).then(
            function (data) {
                // Upon success
                resolve();
            },
            function (error) {
                // Upon failure - send an approporiate validation error message
                reject("This Account ID does not exist. Please enter the right one");
            }
        );
    });
    return Promise.resolve();
}
/**
 * When the contact method changes, hide or show approporiate fields
 */
function contactMethodChanged() {
    //Let us get the selected options for contact methods
    const cm = utils.get("contact_methods");
    toggleFieldsVisibility(cm);
}
/**
 * getConfigs() can also be used to perform certain operations on fields while the iparams page is loaded
 * @param {object} data 
 */
function getConfigs(data) {
    const cm = data.contact_methods;
    toggleFieldsVisibility(cm);
    setFieldValues(["twitter_id","twitter_tags","contact_methods","domain_name","api_key","mobile","tags"],data);
    populateTags();
}
/**
 * Populate the multi-choice field `tags` based on the value of `twitter_tags` field
 */
function populateTags() {
    const tagCSV = utils.get('twitter_tags');
    utils.set('tags', {
        'values': tagCSV.split(",")
    });
}
/**
 *  Dynamically enable / disable standard iparam fields using the utility methods
 * @param {object} cm 
 */
function toggleFieldsVisibility(cm) {
    if (!Array.isArray(cm))
        return console.error("Something went wrong while toggling field visibility");
    utils.set("twitter_id", {
        visible: cm.includes("Twitter ID")
    });
    utils.set("twitter_tags", {
        visible: cm.includes("Twitter ID")
    });
    utils.set("tags", {
        visible: cm.includes("Twitter ID")
    });
    utils.set("mobile", {
        visible: cm.includes("Mobile")
    });
}
/**
 * Set the iparam field values based on the iparam field keys that are passed.
 * Utility methods can be used to set a field value
 * @param {object} fields 
 * @param {object} data
 */
function setFieldValues(fields,data) {
    if (!Array.isArray(fields))
        return console.error("Something went wrong while setting field values. Ensure that an array of field names matching the iparam key names in iparams.json is passed");
    fields.map(function (field) {
        utils.set(field, {
            'value': data[field]
        });
    });
}