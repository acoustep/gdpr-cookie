# GDPR 🍪 jQuery plugin

Inspired by [ihaveacookie](https://github.com/ketanmistry/ihavecookies).

A jQuery plugin that displays a GDPR-compliant cookie consent message as required by EU regulation. The plugin displays a message when a visitor first visits your website and, by default, again 30 days after their last visit.

The visitor must click the accept button in order for consent to be granted, as is required by EU regulation. No cookie set means no consent, which means your site is only allowed to set essential cookies.

## Usage

If your site already uses jQuery, make sure it's at version 1.7.4 or later. jQuery 2.x and 3.x will also work fine. Not using jQuery yet? [Download jQuery](http://jquery.com/download/) and choose whichever method suits you best to include it on your site.

Download the latest version of `gdpr-cookie` and place it in your html, like so:

```html
<script src=gdpr-cookie.js></script>
```

After that you can initialize the script like so:

```javascript
$.gdprcookie();
```

This will give you the default options.

## Styling

The plugin by itself does not do any styling. You are responsible for making the popup look good. It's going to look different on each website anyway, but if you need some sort of starting point, you could have a look at `gdpr-cookie.css` which is also included when you download this plugin.

## Settings

### title

The title that will be rendered at the very start of the popup. It'll be rendered as a `<h1>` tag. No html is allowed. Default is `"Cookies & privacy"`.

### subtitle

The title that will be rendered above the checkboxes after pressing the customize button. It'll be rendered as a `<h2>` tag. No html is allowed. Default is `"Select cookies to accept"`.

### message

A passage of text that can serve as an introduction and a means to include a link to your privacy policy. Html is allowed. Default is a long text. You'll want to set this option for sure.

### delay

A delay in milliseconds to wait until displaying the popup after the page has loaded (meaning the `DOMContentReady` event, a.k.a. jQuery's document-ready). This delay is not applied when manually displaying the popup. You can supply a value of `0` to disable any delay. The default is 2000.

### expires

The time in days for the cookie expiry. This means the cookie that remembers what the user has chosen. Cookies *you* set, are unaffected. Default is 30 days.

### acceptBtnLabel

Label for the accept button. No html is allowed. Default is `"Accept cookies"`.

### advancedBtnLabel

Label for the customize button. No html is allowed. Default is `"Customize cookies"`.

### customShowMessage

Callback function for when to show the popup, if you're not satisfied with the default `fadeIn`.

### customHideMessage

Callback function for when to hide the popup, if you're not satisfied with the default `fadeOut`. If you supply this callback, you are responsible for removing the popup from the DOM!

### customShowChecks

Callback function for when to show the checkboxes, if you're not satisfied with the default `slideDown`.

### cookieTypes

An array of objects containing the types of cookies you need to specify. Each object has three properties:

`type` - A title to show on the label next to the checkbox.  
`value` - A unique name for the type of cookie (e.g. `"essential"`, `"marketing"`, etc).  
`description` - An optional description that will be rendered in the `title` attribute of the correcponding `<label>`.

## Events

A set of events are available that will be triggered on the `<body>` element. And you can catch them for some extra control, logging, or customization.

You can use them as follows:

```javascript
$("body").on(eventName, function() {
    // Do something...
});
```

### gdpr:show

Triggered when the popup is shown. Either manually or on page load.

### gdpr:accept

Triggered when the visitor presses the accept button.

### gdpr:advanced

Triggered when the visitor presses the customize button.

## Methods

The following methods exist for some extra control.

### $.gdprcookie.preference()

Returns an array of values, which are the ones specified in `settings.cookieTypes`, that the visitor has chosen to accept. This array is empty when the visitor hasn't pressed the accept button yet.

### $.gdprcookie.display()

Manually displays the popup, e.g. for visitors to change their preferences. It's considered good practice to include a link to this somewhere on your site.

## Cookie

When the visitor pressed the accept button, the cookie `cookieControl` with value true is set along with cookie `cookieControlPrefs` which contains an array of accepted cookie types e.g. `["preferences", "analytics"]`. This will enable you to perform additional checks where necessary within your application with regard to GDPR regulations. These cookies are accessible by the server as well, enabling you to choose whether or not to render certain passages of code that do or don't comply with the visitor's preferences.

## License

This plugin is available under the MIT license.

## Credit

Credit where credit is due: this plugin is heavily inspired on [ihavecookies](https://github.com/ketanmistry/ihavecookies) by [Ketan Mistry](https://iamketan.com.au/). I chose not to fork because of the heavy modifications I was planning to do.