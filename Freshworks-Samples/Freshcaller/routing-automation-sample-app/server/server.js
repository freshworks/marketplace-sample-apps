exports = {
  validateVIPPhoneNumber: function (request) {    
    let validVIPNumbers = ['+15684561239','+12587419632'],
    response = validVIPNumbers.includes(request.input) ? 'valid': 'invalid',
    data = {
      response,
      "app_variables": {}
    };
    
    return renderData(null, { data });
  },
  validateUserSingleDigit: function (request) {    
    let validVIPNumbers = ['1','2'],
    response = validVIPNumbers.includes(request.input) ? 'valid': 'invalid';
    // Third party API and response structure
    return renderData(null, { success: true, data: {
      response,
      "app_variables": {}
    }});
  },
  validateUserMultipleDigits: function (request) {    
    let validVIPNumbers = ['11','12'],
    response = validVIPNumbers.includes(request.input) ? 'valid': 'invalid';
    
    return renderData(null, { success: true, data: {
      response,
      "app_variables": {}
    }});
  },
  validateUserSpeech: function (request) {    
    let regex = /(transfer)|(call)/,
    response = regex.test(request.input) ? 'valid': 'invalid';
    
    return renderData(null, { success: true, data: {
      response,
      "app_variables": {}
    }});
  },
  respondOrderStatus: function () {    
    let index = Math.floor(Math.random() * Math.max(5));
    
    let name = ['Freshcaller', "Freshdesk", "Freshsales", "Freshchat", "Freshservice"],
      response = arguments[0].input;

    return renderData(null, { success: true, data: { 
      response, "app_variables": { "name": name[index], status: "in progress"}
     }});
  }
};
