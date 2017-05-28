//require('functions.js');

ProjektManager = function (_serverURL, URL_Suffixs) {
    var _that = this;
    var projektSelectOptions;
    
//    var _serverURL = server_url;
    this.returnProjektSelectOptions = function (sessionID, callback, update) {
        if (!projektSelectOptions || update) {
            var data = {
                params: {},
                sessionID: sessionID,
                methode: 'find'
            };
            ajaxPostHandler(_serverURL + URL_Suffixs[3], data, function (result) {
                if (result.errorMessage == undefined) {
                    projektSelectOptions = createSelectOptions(result.data, 'projektName', 'Projekt');
                    if (callback) {
                        callback(projektSelectOptions);
                    }
                }
                else {
                    console.log('ERROR on returnProjektSelectOptions: ', result.errorMessage);
                }
            });
        }
        else {
            if (callback) {
                callback(projektSelectOptions);
            }
        }
    };

    this.findProjekts = function () {
        
    };
    
    this.createProjekt = function (params, res, callback) {
        _that.returnProjektSelectOptions(params.sessionID, null, true);
    };

    this.removeProjekt = function (data, res, callback) {
        _that.returnProjektSelectOptions(params.sessionID, null, true);
    };
};

//check if nodejs is running this code
try {
    module.exports = function () {
        return ProjektManager;
    }();
} catch (e) {

}