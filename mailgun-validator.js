(function($) {
    const DEFAULT_OPTIONS = {
        apiKey: null,
        messages: {
            max512: "Email address may not exceed 512 characters.",
            atSymbol: "Email address may only contain one @ character.",
            timedOut: "Connection timed out. Email address could not be validated."
        },
        onSuccess: null,
        onError: null
    };

    /**
     * The amount of time, in seconds, that must elapse before the
     * connection to Mailgun will be terminated and declared "timed-out"
     */
    const TIMEOUT_DELAY = 30;

    $.fn.validateEmail = function(settings) {
        return this.each(function() {
            let $this = $(this);
            let options = $.extend({}, DEFAULT_OPTIONS, settings);

            _internalValidate($this, options);
        });
    };

    function _internalValidate($element, options) {
        // Verify that the options contains an API key
        if(options && options.apiKey === null) {
            console.error("You must specify your public Mailgun API key before sending a request.");
            return;
        }

        // Don't run the validator if no input was received
        let emailAddress = $.trim($element.val());
        if(!emailAddress) return;

        // Check length & syntax of the email address
        let errorMsg = null;

        if(emailAddress.length > 512) {
            errorMsg = options.messages.max512;
        } else if((emailAddress.split("@").length - 1) !== 1) {
            errorMsg = options.messages.atSymbol;
        }

        if(errorMsg !== null) {
            options.onError(errorMsg);
            return;
        }

        // Timeout the request if it's been longer than the specified time
        let currentRequest = null;
        let timeoutId = setTimeout(function() {
            options.onError(options.messages.timedOut);

            if(currentRequest !== null) {
                currentRequest.abort();
                currentRequest = null;
            }
        }, (TIMEOUT_DELAY * 1000));

        // Send the call to Mailgun and respond to the caller
        currentRequest = $.ajax({
            type: "GET",
            url: "https://api.mailgun.net/v3/address/validate",
            data: {
                address: emailAddress,
                api_key: options.apiKey
            },
            dataType: "jsonp",
            crossDomain: true,
            success: function(data) {
                clearTimeout(timeoutId);

                if(options && options.onSuccess !== null) {
                    options.onSuccess(data);
                }
            },
            error: function(data) {
                clearTimeout(timeoutId);

                if(options && options.onError !== null) {
                    options.onError(data);
                }
            }
        });
    }
})(jQuery);