//require('functions.js');

TicketManager = function (_serverURL, URL_Suffixs) {
    var _that = this;
    var ticketTypes = [{ticketType: 'Bug'}, {ticketType: 'Task'}, {ticketType: 'Feature'}, {ticketType: 'Improvement'}];
    var ticketPrioritys = [{ticketPriority: 1},{ticketPriority: 2}, {ticketPriority: 3}];
    var priorityAndTypeSelectOptions = {};
    
        
    this.returnPriorityAndTypeSelectOptions = function () {
        if (priorityAndTypeSelectOptions.ticketTypeSelectOptions && priorityAndTypeSelectOptions.ticketPrioritySelectOptions) {
            return priorityAndTypeSelectOptions;
        }
        else {
            priorityAndTypeSelectOptions.ticketPrioritySelectOptions = createSelectOptions(ticketPrioritys, 'ticketPriority', 'Priority');
            priorityAndTypeSelectOptions.ticketTypeSelectOptions = createSelectOptions(ticketTypes, 'ticketType', 'Type');
            return priorityAndTypeSelectOptions;
        }
    };
    
    this.loadTicketTable = function (params) {
        var data = {
            params: {},
            sessionID: params.sessionID,
            methode: 'find_html',
            pretty: true
        };
        if (params.filterID != undefined) {
            data.params.filterID = params.filterID;
        }
        ajaxPostHandler(_serverURL + URL_Suffixs[2], data, function (result) {
            if (result.data && result.data.length > 0) {
                $(params.selector).html('');
                for (var i = 0;i < result.data.length;i++) {
                    $(params.selector).append(result.data[i]);
                }
                // temp for IHK
                $('.ticketView .tickets').DataTable();
            }
            else {
                console.warn('ERROR: No Tickets found on loadTicketTable');
                $(params.selector + '.error').text('ERROR: No Tickets found.').show();
            }
        });
    };
    
    this.setTicketOnActive = function () {
        
    };
    
    this.getTicket = function (params, callback) {
        var sessionID = params.sessionID;
        var data = {
            params: {
                ticketID: params.ticketID
            },
            sessionID: sessionID,
            methode: 'get'
        };
        if (params.pretty) {
            data.pretty = true;
        }
        ajaxPostHandler(_serverURL + URL_Suffixs[2], data, function (result) {
            if (result.data) {
                callback(result);
            }
            else {
                console.warn('ERROR: Ticket not found on getTicket');
                $(params.selector + '.error').text('ERROR: Ticket not found.').show();
            }
        });
    };

    this.findTickets = function (params, callback) {
        
    };
    
    this.createTicket = function (dataParams) {
        var sessionID = dataParams.sessionID;
        var data = {
            params: dataParams.params,
            sessionID: sessionID,
            methode: 'create'
        };
        // TODO move to BE
        data.params.ticketInProgress == false;
        ajaxPostHandler(_serverURL + URL_Suffixs[2], data, function (result) {
            if (result.errorMessage == undefined) {
                $(dataParams.selector + '.successMessage').text('Ticket successfully created.').show();
            }
            else {
                console.warn('ERROR: on createTicket ajax-call create: ', + result.errorMessage);
                $(dataParams.selector + '.errorMessage').text('ERROR Ticket not created.').show();
            }
        });
    };
    
    this.updateTicket = function (dataParams) {
        var sessionID = dataParams.sessionID;
        var data = {
            params: dataParams.params,
            sessionID: sessionID,
            methode: 'update'
        };
        // TODO move to BE
        ajaxPostHandler(_serverURL + URL_Suffixs[2], data, function (result) {
            if (result.errorMessage == undefined) {
                $(dataParams.selector + '.successMessage').text('Ticket successfully updated.').show();
            }
            else {
                console.warn('ERROR: on updateTicket ajax-call update: ', + result.errorMessage);
                $(dataParams.selector + '.errorMessage').text('ERROR Ticket not updated.').show();
            }
        });
    };
    
    // archive-function have to change archived attribute to true
    this.archivTicket = function (params, res, callback) {

    };

    this.removeTicket = function (data, res, callback) {

    };
};

//check if nodejs is running this code
try {
    module.exports = function () {
        return TicketManager;
    }();
} catch (e) {

}