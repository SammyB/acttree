/*
 * jQuery File Upload Plugin JS Example 8.9.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, regexp: true */
/*global $, window, blueimp */

jQ(function () {
    'use strict';

    // Initialize the jQ File Upload widget:
    jQ('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'server/php/'
    });

    // Enable iframe cross-domain access via redirect option:
    jQ('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );

    // Load existing files:
    jQ('#fileupload').addClass('fileupload-processing');
    jQ.ajax({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: jQ('#fileupload').fileupload('option', 'url'),
        dataType: 'json',
        context: jQ('#fileupload')[0]
    }).always(function () {
        jQ(this).removeClass('fileupload-processing');
    }).done(function (result) {
        jQ(this).fileupload('option', 'done')
            .call(this, jQ.Event('done'), {result: result});
    });

});
