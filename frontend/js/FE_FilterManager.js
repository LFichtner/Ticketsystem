//require('functions.js');

FilterManager = function (_serverURL, URL_Suffixs) {
    var _that = this;
    
//    var _serverURL = server_url;
    
    this.loadFilterButtons = function (params) {
        var data = {
            params: {},
            sessionID: params.sessionID,
            methode: 'find_html'
        };
        ajaxPostHandler(_serverURL + URL_Suffixs[4], data, function (result) {
            if (result.data && result.data.length > 0) {
                for (var i = 0;i < result.data.length;i++) {
                    $(params.selector).append(result.data[i]);
                }
                $(params.selector).append('<button class="newFilter btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>');
            }
            else {
                console.warn('ERROR: No Filter found on loadFilterButtons');
                $(params.selector + '.error').text('ERROR: No Filter found.').show();
            }
        });
    };
    
    this.getFilter = function (data, res, callback) {

    };

    this.findFilters = function () {
        
    };
    
    this.createFilter = function (params, res, callback) {

    };
    
    this.updateFilter = function (params, res, callback) {

    };

    this.removeFilter = function (data, res, callback) {

    };
};

//check if nodejs is running this code
try {
    module.exports = function () {
        return FilterManager;
    }();
} catch (e) {

}