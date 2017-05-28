/*
 * 
 * 
 * in localStorage at the moment sessionID, userPermission, currentView are saved
 * 
 * @param {type} server_url
 * @returns {Controller}
 */
Controller = function (server_url) {
    var _that = this;
    var _serverURL = server_url;
    var defaultView = 'ticketView';
    var URL_Suffixs = ['updateSession', 'userManager', 'ticketManager', 'projektManager', 'filterManager'];
    
    // TODO replace all trough assoziative array on production
//    URL_Suffixs['session'] = 'updateSession';
//    URL_Suffixs['user'] = 'userManager';
//    URL_Suffixs['ticket'] = 'ticketManager';
//    URL_Suffixs['projekt'] = 'projektManager';
//    URL_Suffixs['filter'] = 'filterManager';
    
    // maybe include trough require (at the moment required in index)
//    var UserManager = require('UserManager.js');
//    var TicketManager = require('TicketManager.js');
//    var ProjektManager = require('ProjektManager.js');
//    var FilterManager = require('FilterManager.js');
    
    var MyUserManager = new UserManager(_serverURL, URL_Suffixs);
    var MyTicketManager = new TicketManager(_serverURL, URL_Suffixs);
    var MyProjektManager = new ProjektManager(_serverURL, URL_Suffixs);
    var MyFilterManager = new FilterManager(_serverURL, URL_Suffixs);
    
    var _selectors = ['.loginView ', '.userView ', '.ticketView ', '.navbar '];
    
    // TODO replace all trough assoziative array on production
//    _selectors['login'] = '.loginView ';
//    _selectors['user'] = '.userView ';
//    _selectors['ticket'] = '.ticketView ';
//    _selectors['navbar'] = '.navbar ';
    
    var openedTicketID;
    var currentFilterID;
    
    var returnAndValidateCurrentSessionID = function (callback, validate) {
        var sessionID = localStorage.getItem('sessionID');
//        console.log('sessionID: ', sessionID);
        if (sessionID) {
            var data = {sessionID: sessionID};
            ajaxPostHandler(_serverURL + URL_Suffixs[0], data, function (result) {
                if (result.errorMessage == undefined) {
                    callback(sessionID);
                }
                else {
                    console.log('ERROR: on returnAndValidateSessionID: ', result.errorMessage);
                    sessionExpired();
                }
            });
        }
        else if (validate) {
            console.error('Fatal ERORR: SessionID is undefined or null by the time read from localStorage');
            // show modal forceLogout or?
        }
        else {
            callback();
        }
    };
    
    var sessionExpired = function () {
        $.get('modal-sessionExpired.html', function (modalSessionExpired) {
            $('body').html(modalSessionExpired);
            $('#modal-sessionExpiered').modal('show');
            $('#modal-sessionExpiered .btn-close').click(function () {
                localStorage.removeItem('sessionID');
                localStorage.removeItem('userPermission');
                location.reload(); 
            });
        });
    };
    
    var getUserPermission = function () {
        var userPermission = localStorage.getItem('userPermission');
//        console.log('userPermission: ', userPermission);
        if (userPermission) {
            return userPermission;
        }
        else {
            console.error('ERORR: userPermission is undefined or null by the time read from localStorage');
            return false;
        }
    };
    
    var getCurrentView = function () {
        var currentView = localStorage.getItem('currentView');
        if (!currentView) {
            currentView = defaultView;
        }
//        console.log('currentView: ', currentView);
        if (currentView) {
            return currentView;
        }
        else {
            console.error('ERORR: currentView is undefined or null by the time read from localStorage');
            return false;
        }
    };
    
    var returnTicketSelectOptions = function(sessionID, callback) {
        var ticketSelectOptions = MyTicketManager.returnPriorityAndTypeSelectOptions();
        MyProjektManager.returnProjektSelectOptions(sessionID, function (projektSelectOptions) {
            ticketSelectOptions.ticketProjektSelectOptions = projektSelectOptions;
            MyUserManager.returnUserSelectOptions(sessionID, function (userSelectOptions) {
                ticketSelectOptions.ticketUserSelectOptions = userSelectOptions;
                console.info(ticketSelectOptions);
                callback(ticketSelectOptions);
            });
        });
    };
    
    // maybe proof sessionID in localStorage, in order to validate, wether user has permission to open page(if user is logged in), on every call of load-function(exclding login obviously)
    this.load = function (view) {
        switch(view) {
            case 'init':
                console.info('TODO: ');
                console.info('thought about where to save ticketID maybe could be saved in localStorage or a temp var in Ticketmanager(have to be updatet various times)');
                console.log('better error message on fail load table data');
                console.log('unbind delegate in tr-click');
                console.log('style in case no switchView button(maybe just in case you don´t need it remove display: table from navbar-element)');
                console.log('style error- and successMessage in ticketView add in userView');
                console.log('forceLogout in backend and frontend returnSession...');
//                console.log('third log about this problem but its getting more and more worse everytime thinking about it. the user can´t login anymore cause the sessionID remains in array until server gets rebooted.');\/
                console.log('on validateSession in backend implement a kind of garbageCollection that removes old sessions');
                console.log('always validate ids read from html');
//                console.log('can´t fucking select default with .val() try removing selected from it??solved??');
                console.log('ticketTable get not reload right after createTicket');
                console.info('>=====================<');
                
                
                returnAndValidateCurrentSessionID(function (sessionID) {
                    if (sessionID) {
                        _that.load(getCurrentView());
                    }
                    else {
                        _that.load('loginView');
                    }
                });
                break;
            case 'loginView':
                $.get('login.html', function (loginPage) {
                    $('body').html(loginPage);
                    $('body').removeClass('BSnavbar');
                    bindClickHandler(null, 'loginView', true);
                });
                break;
            case 'ticketView':
                $.get('header.html', function (header) {
                    $.get('ticketView.html', function (ticketView) {
                        returnAndValidateCurrentSessionID(function (sessionID) {
                            $('body').html(header + ticketView);
                            $('body').addClass('BSnavbar');

                            if (getUserPermission()) {
                                $(_selectors[3] + '.changeView-btn').html('USERS').show();
                            }

                            var filterParams = {
                                sessionID: sessionID,
                                selector: _selectors[2] + '.filter'
                            };
                            MyFilterManager.loadFilterButtons(filterParams);

                            var ticketParams = {
                                sessionID: sessionID,
                                selector: _selectors[2] + '.tickets tbody'
                            };
                            MyTicketManager.loadTicketTable(ticketParams);

                            localStorage.setItem('currentView', 'ticketView');
                            bindClickHandler(null, 'ticketView', true);
                        }, true);
                    });
                });
                break;
            case 'userView':
                $.get('header.html', function (header) {
                    $.get('userView.html', function (userView) {
                        returnAndValidateCurrentSessionID(function (sessionID) {
                            $('body').html(header + userView);
                            $('body').addClass('BSnavbar');

                            $(_selectors[3] + '.changeView-btn').html('TICKETS').show();

                            var userParams = {
                                sessionID: sessionID,
                                selector: _selectors[1] + '.user tbody'
                            };
                            MyUserManager.loadUserTable(userParams);

                            localStorage.setItem('currentView', 'userView');
                            bindClickHandler(null, 'userView', true);
                        }, true);
                    });
                });
                break;
        }
    };
    
    // TODO always unbind !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!(unbind after click to prevent multiple ajax-calls
    var bindClickHandler = function (element, view, init) {
        var validateNewTicketModalInputs = function() {
            $(_selectors[2] + '#modal-ticketDetails .form-control').removeClass('invalid');
                        
            var ticketTitle = $(_selectors[2] + '#modal-ticketDetails .ticketTitle').html();
            if (!ticketTitle || ticketTitle == '' || ticketTitle == 'Enter a Title') {
                $(_selectors[2] + '#modal-ticketDetails .ticketTitle').addClass('invalid');
                ticketTitle = false;
            }

            var ticketDescription = $(_selectors[2] + '#modal-ticketDetails .ticketDescription').val();
            if (!ticketDescription || ticketDescription == '') {
                $(_selectors[2] + '#modal-ticketDetails .ticketDescription').addClass('invalid');
                ticketDescription = false;
            }

            var ticketDueDate = $(_selectors[2] + '#modal-ticketDetails .ticketDueDate').val();
            if (!ticketDueDate || ticketDueDate == '') {
                // TODO write transform function to keep date in a format
                $(_selectors[2] + '#modal-ticketDetails .ticketDueDate').addClass('invalid');
                ticketDueDate = false;
            }

            var ticketProjektSelector = _selectors[2] + '#modal-ticketDetails .ticketProjekt ';
            var ticketProjekt = $(ticketProjektSelector + 'option:selected').attr('id');
//                        console.log('$(ticketProjektSelector + .default).val()', $(ticketProjektSelector + '.default').val());
            if (!ticketProjekt || $(ticketProjektSelector + 'option:selected').val() == $(ticketProjektSelector + '.default').val()) {
                // TODO write transform function to keep date in a format
                $(ticketProjektSelector).addClass('invalid');
                ticketProjekt = false;
            }

            var ticketTypeSelector = _selectors[2] + '#modal-ticketDetails .ticketType ';
            var ticketType = $(ticketTypeSelector).val();
//                        console.log('$(ticketTypeSelector .default).val()', $(ticketTypeSelector + '.default').val());
            if (!ticketType || ticketType == $(ticketTypeSelector + '.default').val()) {
                // TODO write transform function to keep date in a format
                $(ticketTypeSelector).addClass('invalid');
                ticketType = false;
            }

            var ticketPrioritySelector = _selectors[2] + '#modal-ticketDetails .ticketPriority ';
            var ticketPriority = $(ticketPrioritySelector).val();
//                        console.log('$(ticketPrioritySelector + .default).val()', $(ticketPrioritySelector + '.default').val());
            if (!ticketPriority || ticketPriority == $(ticketPrioritySelector + '.default').val()) {
                // TODO write transform function to keep date in a format
                $(ticketPrioritySelector).addClass('invalid');
                ticketPriority = false;
            }

            var ticketUserSelector = _selectors[2] + '#modal-ticketDetails .ticketUser ';
            var ticketUser = $(ticketUserSelector + 'option:selected').attr('id');
//                        console.log('$(ticketUserSelector + .default).val()', $(ticketUserSelector + '.default').val());
            if (!ticketUser || $(ticketUserSelector + 'option:selected').val() == $(ticketUserSelector + '.default').val()) {
                // TODO write transform function to keep date in a format
                $(ticketUserSelector).addClass('invalid');
                ticketUser = false;
            }
            
            if (ticketTitle && ticketDescription && ticketDueDate && ticketProjekt && ticketType && ticketPriority && ticketUser) {
                var resultObj = {
                    ticketTitle: ticketTitle, 
                    ticketDescription: ticketDescription, 
                    ticketDueDate: ticketDueDate, 
                    ticketProjekt: ticketProjekt, 
                    ticketType: ticketType, 
                    ticketPriority: ticketPriority, 
                    ticketUser: ticketUser
                };
                
                return resultObj;
            }
            else {
                return false;
            }
        };
        
        if (init == true) {
            switch(view) {
                case 'loginView':
                    bindClickHandler('loginView-clear-btn', null, false);
                    bindClickHandler('loginView-login-btn', null, false);
                    bindClickHandler('loginView-pwdforgotten-btn', null, false);
                    break;
                case 'ticketView':
                    bindClickHandler('ticketView-filter-btn', null, false);
                    bindClickHandler('ticketView-ticket-tr', null, false);
                    bindClickHandler('ticketView-createTicket-btn', null, false);
//                    bindClickHandler('ticketView-filter-btn', null, false);
                    bindClickHandler(null, 'header', true);
                    break;
                case 'userView':
                    bindClickHandler('userView-filter-btn', null, false);
                    bindClickHandler('userView-user-tr', null, false);
//                    bindClickHandler('ticketView-filter-btn', null, false);
                    bindClickHandler(null, 'header', true);
                    break;
                case 'modal':
                    break;
                case 'header':
                    bindClickHandler('header-changepwd-btn', null, false);
                    bindClickHandler('header-logout-btn', null, false);
                    if (getUserPermission()) {
                        bindClickHandler('header-changeView-btn', null, false);
                    }
                    break;
            }
        }
        else if (init == false) {
            switch (element) {
                case 'loginView-clear-btn':
                    var password = $(_selectors[0] + '.password');
                    var username = $(_selectors[0] + '.username');
                    $(_selectors[0] + '.btn-clear').unbind('click').click(function() {
                        username.val('');
                        password.val('');
                    });
                    break;
                case 'loginView-login-btn':
                    var password = $(_selectors[0] + '.password');
                    var username = $(_selectors[0] + '.username');
                    $(_selectors[0] + '.btn-login').unbind('click').click(function() {
                        $(_selectors[0] + '.btn-login').unbind('click');
                        MyUserManager.login(username.val(), password.val(), function (result) {
                            // TODO validate result and throw error or handle session and userID
                            if (result == true) {
                                _that.load(getCurrentView());
                            }
                            else {
                                $(_selectors[0] + '.errorMessage').text(result);
                                bindClickHandler('loginView-login-btn', null, false);
                            }
                        });
                    });
                    break;
                case 'loginView-pwdforgotten-btn':
                    var password = $(_selectors[0] + '.password');
                    var username = $(_selectors[0] + '.username');
                    $(_selectors[0] + '.btn-pwdforgotten').unbind('click').click(function() {
                        $(_selectors[0] + '.btn-pwdforgotten').unbind('click');
                        if (username.val() && username.val() != '') {
                            MyUserManager.pwdForgotten(username, function (result) {
                                if (result == false) {
                                    $('#modal-pwdforgotten .modal-title').text('Username not found in Database. Please try again.');
                                }

                                $('#modal-pwdforgotten').modal('show');

                                $('#modal-pwdforgotten .btn-close').unbind('click').click(function() {
                                    $('#modal-pwdforgotten').modal('hide');
                                    bindClickHandler('loginView-pwdforgotten-btn', null, false);
                                });
                            });
                        }
                        else {
                            $(_selectors[0] + '.errorMessage').text('Please enter a username first.');
                            $(_selectors[0] + '.errorMessage').show();
                        }
                    });
                    break;
                case 'ticketView-createTicket-btn':
                    $(_selectors[3] + '.btn-create').unbind('click').click(function() {
//                        $(_selectors[3] + '.btn-create').unbind('click');
                        $(_selectors[2] + '#modal-ticketDetails .form-control').removeClass('invalid');

                        returnAndValidateCurrentSessionID(function (sessionID) {
                            returnTicketSelectOptions(sessionID, function (ticketSelectOptions) {
                                $(_selectors[2] + '#modal-ticketDetails .ticketProjekt').html(ticketSelectOptions.ticketProjektSelectOptions);
                                $(_selectors[2] + '#modal-ticketDetails .ticketType').html(ticketSelectOptions.ticketTypeSelectOptions);
                                $(_selectors[2] + '#modal-ticketDetails .ticketPriority').html(ticketSelectOptions.ticketPrioritySelectOptions);
                                $(_selectors[2] + '#modal-ticketDetails .ticketUser').html(ticketSelectOptions.ticketUserSelectOptions);
                            });
                        }, true);
                        
                        // TODO empty modal
                        $(_selectors[2] + '#modal-ticketDetails .ticketProjekt').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketPriority').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketUser').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketType').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketDescription').val('');
                        $(_selectors[2] + '#modal-ticketDetails .ticketDueDate').val('');
                        
                        $(_selectors[2] + '#modal-ticketDetails').modal('show');
                        $(_selectors[2] + '#modal-ticketDetails .ticketInProgress').closest('.form-group').hide();
                        
                        bindClickHandler('modal-title-toggleInput', null, false);
                        bindClickHandler('modal-newTicket-save-btn', null, false);
                    });
                    break;
                case 'modal-newTicket-save-btn':
                    $(_selectors[2] + '#modal-ticketDetails .btn-save').unbind('click').click(function () {
                        $(_selectors[2] + '#modal-ticketDetails .btn-save').unbind('click');
                        
                        var ticketParams = validateNewTicketModalInputs();
                        if (ticketParams) {
                            returnAndValidateCurrentSessionID(function (sessionID) {
                                var data = {
                                    params: ticketParams,
                                    sessionID: sessionID,
                                    selector: _selectors[2]
                                };
                                MyTicketManager.createTicket(data);
                                var userParams = {
                                    sessionID: sessionID,
                                    selector: _selectors[2] + '.user tbody'
                                };
                                MyUserManager.loadUserTable(userParams);
//                                bindClickHandler('ticketView-createTicket-btn', null, false);
                                $(_selectors[2] + '#modal-ticketDetails').modal('hide');
                            }, true);
                            
                        }
                        else {
                            bindClickHandler('modal-newTicket-save-btn', null, false);
                        }
                    });
                    break;
                case 'ticketView-filter-btn':
                    $(_selectors[2] + '.filter')/*.unbind('delegate')*/.delegate('input', 'click', function() {
//                        $(_selectors[2] + '.filter').unbind('delegate');                        
                        var filterID = $(this).attr('id');
                        if (filterID && filterID != '') {
                            currentFilterID = filterID;
                            returnAndValidateCurrentSessionID(function (sessionID) {
                                var ticketParams = {
                                    sessionID: sessionID,
                                    filterID: filterID,
                                    selector: _selectors[2] + '.tickets tbody '
                                };
                                MyTicketManager.loadTicketTable(ticketParams);
                            }, true);
                        }
                        else {
                            console.log('Fatal ERROR on ticketView-filter-tr clickhandler. filterID is undefined');
                        }
//                        bindClickHandler('ticketView-filter-btn', null, false);
                    });
                    break;
                case 'ticketView-newFilter-btn':
                    $(_selectors[2] + '.filter .ticketView-newFilter-btn').click(function() {
                        
                    });
                    break;
                case 'ticketView-ticket-tr':
//                    console.log('bind to: ', _selectors[2] + '.tickets tbody');
                    $(_selectors[2] + '.tickets tbody').delegate('tr', 'click', function() {
//                        console.info('tr clicked: ', $('#modal-ticketDetails'));
                        $(_selectors[2] + '#modal-ticketDetails .form-control').removeClass('invalid');
                        
                        /* have to be outgrouped */
                        $(_selectors[2] + '#modal-ticketDetails .ticketProjekt').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketPriority').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketUser').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketType').val('default');
                        $(_selectors[2] + '#modal-ticketDetails .ticketDescription').val('');
                        $(_selectors[2] + '#modal-ticketDetails .ticketDueDate').val('');
                        /**/
                        
                        var ticketID = $(this).attr('id');
                        if (ticketID && ticketID != '') {
                            openedTicketID = ticketID;
                            returnAndValidateCurrentSessionID(function (sessionID) {
                                var ticketDetailsParams = {
                                    ticketID: ticketID,
                                    sessionID: sessionID,
                                    selector: _selectors[2] + '#modal-ticketDetails ',
                                    pretty: true
                                };

                                MyTicketManager.getTicket(ticketDetailsParams, function (result) {
                                    returnTicketSelectOptions(sessionID, function (ticketSelectOptions) {
                                        $(_selectors[2] + '#modal-ticketDetails .ticketTitle').html(result.data.ticketTitle);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketDescription').val(result.data.ticketDescription);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketDueDate').val(result.data.ticketDueDate);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketProjekt').html(ticketSelectOptions.ticketProjektSelectOptions);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketType').html(ticketSelectOptions.ticketTypeSelectOptions);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketPriority').html(ticketSelectOptions.ticketPrioritySelectOptions);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketUser').html(ticketSelectOptions.ticketUserSelectOptions);
        //                                console.log(result.data.ticketProjekt, $(_selectors[2] + '#modal-ticketDetails .ticketProjekt'), $(_selectors[2] + '#modal-ticketDetails .ticketProjekt').val());
                                        $(_selectors[2] + '#modal-ticketDetails .ticketProjekt').val(result.data.ticketProjektName);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketType').val(result.data.ticketType);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketPriority').val(result.data.ticketPriority);
                                        $(_selectors[2] + '#modal-ticketDetails .ticketUser').val(result.data.ticketUserName);
                                        if (result.data.ticketInProgress) {
                                            $(_selectors[2] + '#modal-ticketDetails .ticketInProgress').prop('checked', true);
                                        }
                                        else {
                                            $(_selectors[2] + '#modal-ticketDetails .ticketInProgress').prop('checked', false);
                                        }
                                    });
                                });
                                
                                $(_selectors[2] + '#modal-ticketDetails .ticketInProgress').closest('.form-group').show();
                                $(_selectors[2] + '#modal-ticketDetails').modal('show');
                                
                                bindClickHandler('modal-title-toggleInput', null, false);
                                bindClickHandler('modal-ticket-save-btn', null, false);
                            }, true);
                        }
                        else {
                            console.log('Fatal ERROR on ticketView-ticket-tr clickhandler. ticketID is undefined');
                        }
//                        bindClickHandler('ticketView-ticket-btn', null, false);
                    });
                    break;
                case 'modal-ticket-save-btn':
                    $(_selectors[2] + '#modal-ticketDetails .btn-save').unbind('click').click(function () {
                        $(_selectors[2] + '#modal-ticketDetails .btn-save').unbind('click');
                        
                        var ticketParams = validateNewTicketModalInputs();
                        if (ticketParams) {
                            if (openedTicketID && openedTicketID != '') {
                                returnAndValidateCurrentSessionID(function (sessionID) {
                                    ticketParams.ticketID = openedTicketID;
                                    ticketParams.ticketInProgress = $(_selectors[2] + '#modal-ticketDetails .ticketInProgress').prop('checked');
                                    
                                    var data = {
                                        params: ticketParams,
                                        sessionID: sessionID,
                                        selector: _selectors[2]
                                    };
                                    
                                    MyTicketManager.updateTicket(data);
                                    var userParams = {
                                        sessionID: sessionID,
                                        selector: _selectors[2] + '.user tbody'
                                    };
                                    MyUserManager.loadUserTable(userParams);
                                    // here have to be bound the delegate event if it get unbind on upper function
    //                                bindClickHandler('ticketView-ticket-tr', null, false);
                                    $(_selectors[2] + '#modal-ticketDetails').modal('hide');
                                }, true);
                            }
                            else {
                                console.error('Fatal ERROR: openedTicketID is undefined on updateTicket clickhandler(modal-ticket-save-btn)');
                            }
                        }
                        else {
                            bindClickHandler('modal-ticket-save-btn', null, false);
                        }
                    });
                    break;
                case 'userView-filter-btn':
                    break;
    //            case 'userView-':
    //                break;
                case 'userView-table-tr':
                    break;
                case 'modal-close-btn':
                    $(_selectors[2] + '#modal-ticketDetails .form-control').removeClass('invalid');
                    break;
                case 'modal-user-submit-btn':
                    break;
                case 'modal-title-toggleInput':
                    $('.modal-title').html('Enter a Title').unbind('click').click(function() {
                        console.warn('made this warning to validate if clickhandler is bound multiple times on it');
                        $('.modal-title').hide();
                        // input
                        $('.ticketTitle-input').show();
                        $('.ticketTitle-input').unbind('keypress focusout').bind('keypress focusout', function(event) {
                            console.info(event.which);
                            if (event.type == 'keypress') {
                                if (event.which == 13) {
                                    $('.modal-title').html($('.ticketTitle-input').val()).show();
                                    $('.ticketTitle-input').hide();
                                }
                            }
                            else {
                                $('.modal-title').html($('.ticketTitle-input').val()).show();
                                $('.ticketTitle-input').hide();
                            }
                        });
                    });
                    break;
                case 'modal-':
                    break;
                case 'modal-':
                    break;
                case 'modal-':
                    break;
                case 'modal-':
                    break;
                case 'header-changepwd-btn':
                    $(_selectors[3] + '.changepwd-btn').unbind('click').click(function() {
                        $(_selectors[3] + '.changepwd-btn').unbind('click');
                        
                        bindClickHandler('header-changepwd-btn', null, false);
                    });
                    break;
                case 'header-logout-btn':
                    $(_selectors[3] + '.logout-btn').unbind('click').click(function() {
                        $(_selectors[3] + '.logout-btn').unbind('click');
                        returnAndValidateCurrentSessionID(function (sessionID) {
                            MyUserManager.logout({sessionID: sessionID}, function (result) {
                                if (result == true) {
                                    _that.load('loginView');
                                }
                            });
                        }, true);
                        
                    });
                    break;
                case 'header-changeView-btn':
                    $(_selectors[3] + '.changeView-btn').unbind('click').click(function() {
                        $(_selectors[3] + '.changeView-btn').unbind('click');
                        if (getCurrentView() == 'userView') {
                            _that.load('ticketView');
                        }
                        else if (getCurrentView() == 'ticketView') {
                            _that.load('userView');
                        }
                        else {
                            console.error('ERROR on changeView currentView is neither ticketView nor userView');
                        }
                    });
                    break;
            }
        }
        else {
            console.error('Error on bindClickHandler: init have to be boolean');
        }
    };
    
    var loadTicketView = function (sessionID, filterID) {
        // TODO selector
        MyFilterManager.loadFilterButtons('', function () {
            
        });
        MyTicketManager.loadTicketTable('', function () {
            
        });
        
    };
    
    var loadUserView = function (sessionID, filterID) {
        var data = {
            params: {},
            sessionID: sessionID,
            methode: 'get'
        };
        if (filterID) {
            data.params.filterID = filterID;
        }
        ajaxPostHandler(_serverURL + URL_Suffixs[1], data, function () {
            
        });
    };
};

//check if nodejs is running this code
try {
    module.exports = function () {
        return Controller;
    }();
} catch (e) {

}