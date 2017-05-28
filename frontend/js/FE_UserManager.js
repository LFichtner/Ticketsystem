//require('functions.js');

UserManager = function (_serverURL, URL_Suffixs) {
    var _that = this;
    var userSelectOptions;
    
    this.returnUserSelectOptions = function (sessionID, callback, update) {
        if (!userSelectOptions || update) {
            var data = {
                params: {},
                sessionID: sessionID,
                methode: 'find'
            };
            ajaxPostHandler(_serverURL + URL_Suffixs[1], data, function (result) {
                if (result.errorMessage == undefined) {
                    userSelectOptions = createSelectOptions(result.data, 'userName', 'User');
                    if (callback) {
                        callback(userSelectOptions);
                    }
                }
                else {
                    console.log('ERROR on returnUserSelectOptions: ', result.errorMessage);
                }
            });
        }
        else {
            if (callback) {
                callback(userSelectOptions);
            }
        }
    };

    this.loadUserTable = function (params) {
        var data = {
            params: {},
            sessionID: params.sessionID,
            methode: 'find_html'
        };
        if (params.filterID != undefined) {
            data.params.filterID = params.filterID;
        }
        ajaxPostHandler(_serverURL + URL_Suffixs[1], data, function (result) {
            if (result.data && result.data.length > 0) {
                $(params.selector).html('');
                for (var i = 0;i < result.data.length;i++) {
                    $(params.selector).append(result.data[i]);
                }
            }
            else {
                console.warn('ERROR: No User found on loadUserTable');
                $(params.selector + '.error').text('ERROR: No User found.').show();
            }
        });
    };
    
    this.login = function (username, password, callback) {
        var data = {
            params: {
                userName: username,
                userPassword: password
            },
            methode: 'login'
        };
        ajaxPostHandler(_serverURL + URL_Suffixs[1], data, function (result) {
            if (result.errorMessage == undefined) {
                var sessionID = result.data.sessionID;
                localStorage.setItem('sessionID', sessionID);
                localStorage.setItem('userPermission', result.data.userPermission);
//                console.log('sessionID', sessionID);
                callback(true, result.data.userPermission);
            }
            else {
                //TODO also throw error
                console.error('UM: ERROR on login: ', result.errorMessage);
                callback(result.errorMessage);
            }
        });
    };
    
    this.logout = function (params, callback) {
        var sessionID = params.sessionID;
//        console.log('sessionID', sessionID);
        var data = {
            params: {},
            methode: 'logout',
            sessionID: sessionID
        };
        ajaxPostHandler(_serverURL + URL_Suffixs[1], data, function (result) {
            if (result.errorMessage == undefined) {
                var sessionID = result.data;
                localStorage.removeItem('sessionID');
                localStorage.removeItem('userPermission');
                callback(true);
            }
            else {
                console.error('UM: ERROR on logout: ', result.errorMessage);
                callback(false);
            }
        });
    };
    
    this.getUser = function (params) {
//        var sessionID = params.sessionID;
//        var data = {
//            params: {
//                ticketID: params.ticketID
//            },
//            sessionID: sessionID,
//            methode: 'get'
//        };
//        ajaxPostHandler(_serverURL + URL_Suffixs[2], data, function (result) {
//            if (result.data) {
//                loadSelects({sessionID: sessionID}, function () {
//                    console.info('append on selector: ', params.selector + '.ticketTitle', $(params.selector + '.ticketTitle'))
//                    console.info('result.data: ', result.data);
////                    console.info('ticketSelectOptions.ticketProjektSelectOptions: ', ticketSelectOptions.ticketProjektSelectOptions, 'ticketSelectOptions.ticketTypeSelectOptions: ', ticketSelectOptions.ticketTypeSelectOptions, 'ticketSelectOptions.ticketPrioritySelectOptions: ', ticketSelectOptions.ticketPrioritySelectOptions);
//                    $(params.selector + '.ticketTitle').html(result.data.ticketTitle);
//                    $(params.selector + '.ticketDescription').html(result.data.ticketDescription);
//                    $(params.selector + '.ticketUser').html(result.data.ticketUserID);
//                    $(params.selector + '.ticketProjekt').html(ticketSelectOptions.ticketProjektSelectOptions);
//                    $(params.selector + '.ticketType').html(ticketSelectOptions.ticketTypeSelectOptions);
//                    $(params.selector + '.ticketPriority').html(ticketSelectOptions.ticketPrioritySelectOptions);
////                    $(params.selector + '.ticketProjekt').val(ticketSelectOptions.ticketProjektSelectOptions);
//                    $(params.selector + '.ticketType').val(result.data.ticketType);
//                    $(params.selector + '.ticketPriority').val(result.data.ticketPriority);
//                    if (result.data.ticketInProgress) {
//                        $(params.selector + '.ticketInProgress').prop('checked', true);
//                    }
//                    else {
//                        $(params.selector + '.ticketInProgress').prop('checked', false);
//                    }
//                });
//            }
//            else {
//                console.warn('ERROR: Ticket not found on getTicket');
//                $(params.selector + '.error').text('ERROR: Ticket not found.').show();
//            }
//        });
    };

    this.findUsers = function () {
        
    };
    
    this.createUser = function (params, res, callback) {
        _that.returnUserSelectOptions(params.sessionID, null, true);
    };
    
    this.updateUser = function (params, res, callback) {
        _that.returnUserSelectOptions(params.sessionID, null, true);
    };

    this.removeUser = function (data, res, callback) {
        _that.returnUserSelectOptions(params.sessionID, null, true);
    };
};

//check if nodejs is running this code
try {
    module.exports = function () {
        return UserManager;
    }();
} catch (e) {

}