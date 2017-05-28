// creates an unique id
function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
           s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = "4";
    // bits 6-7 of the clock_seq_hi_and_reserved to 01  
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
;

var ajaxPostHandler = function (url, data, callback) {
    if (url, data) {
        $.ajax({
            type: 'post',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            error: function (x, s, t) {
                console.error('jquery-ajax-error: ' + s + '\n' + t);
            },
            success: function (result) {
                //            console.log('<------ajax success handler------>');
                //            console.log('typeof result: ', typeof result);
                if (result) {
                    if (typeof result == 'string') {
                        result = JSON.parse(result);
                    }
                    else {
//                        console.warn('ERROR: Result is not a string proof if its correct always');
                    }

                    if (result.errorMessage == undefined) {
                        console.info('Backend result: ', result);
                    }
                    else {
                        console.error('ERROR from Backend: ', result.errorMessage);
                    }

                    if (callback != undefined) {
                        callback(result);
                    }
                    else {
                        console.warn('ERROR: Callback is undefined in ajax-call success-handler. No result is passed');
                    }
                }
                else {
                    var methodeName = 'not set';
                    if (data.methode) {
                        methodeName = data.methode;
                    }

                    console.error('Fatal ERROR: Result is undefined or null on ' + methodeName + '´s ajax call');
                }
            }
        });
    }
    else {
        console.error('Fatal ERROR: url or data are not set on calling ajaxPostHandler');
        console.log('url: ', url);
        console.log('data: ', data);
    }

};

var createSelectOptions = function (data, fieldName, selectName) {
//    console.info('<======= createSelectOptions data: ', data, ' ==============>');
    if (data.length > 0 && data[0][fieldName] != undefined) {
        // not the beast idea to set default here either reach a second parameter or pass the 
        var htmlString = '<option class="default" style="display:none;">Select a ' + selectName + '</option>';
        for (var i = 0; i < data.length; i++) {
//        console.info('<======= createSelectOptions fieldName: ', data[i][fieldName], ' ==============>');
            if (data[i]._id) {
                htmlString += ('<option id="' + data[i]._id + '">' + data[i][fieldName] + '</option>');
            }
            else {
                htmlString += ('<option>' + data[i][fieldName] + '</option>');
            }
        }
        return htmlString;
    }
    else {
        return ('<option selected="selected">ERROR no ' + selectName + 's found</option>');
    }
};