# Mailgun Validator

Mailgun Validator is an extension of Mailgun's official [validator-demo](https://github.com/mailgun/validator-demo). However, instead of binding to an element and making automatic verification calls, Mailgun Validator allows the developer to make calls to the Mailgun server whenever they like with one simple method.

# How to Install/Use
- Download and include the latest version of jQuery
- Download and include mailgun-validator.js
- [Sign up](https://mailgun.com/signup) for a Mailgun account and find your **public** API key

Once you have finished the steps above, you may now call the *validateEmail* function.

```js
$("input[name=email]").validateEmail({
	apiKey: "[Insert your API key here]",
	onSuccess: function(data) {
		// ... Address is valid ...
	},
	onError: function(data) {
		// ... Address is invalid or connection could not be made to Mailgun ...
	}
});
```

An example of the JSON output:

```json
{
  "address": "john.smith@google.com",
  "did_you_mean": null,
  "is_disposable_address": false,
  "is_role_address": false,
  "is_valid": true,
  "mailbox_verification": "true",
  "parts": {
    "display_name": null,
    "domain": "google.com",
    "local_part": "john.smith"
  },
  "reason": null
}
```

# Customizing Messages
There are a few pre-defined error messages, such as if an email is too long (exceeds 512 characters, does not include a(n) *@* character, etc.) that you may edit if you wish. When passing in the options array, you may also define a *messages* section with the following:

```json
... apiKey ...
messages: {
	max512: "Email address may not exceed 512 characters.",
	atSymbol: "Email address may only contain one @ character.",
	timedOut: "Connection timed out. Email address could not be validated."
}
... onSuccess/onError ...
```

# More Information
[Official Mailgun jQuery Plugin](https://github.com/mailgun/validator-demo)
[Mailgun Email Verification API Documentation](https://documentation.mailgun.com/en/latest/api-email-validation.html)