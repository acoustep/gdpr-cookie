/*!
 * gdpr-cookie - A jQuery plugin to manage cookie settings in compliance with EU law
 *
 * Copyright (c) 2018 Martijn Saly
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 0.1
 *
 */
(function($, window, document) {
    
    var settings, showing = false, display;

    var setCookie = function(name, value, expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
        return getCookie(name);
    };

    var getCookie = function(name) {
        var ca = decodeURIComponent(document.cookie).split(";");
        name += "=";
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
    };
    
    $.gdprcookie = function(options) {

        // Set defaults
        settings = $.extend({
            cookieTypes: [
                {
                    type: "Essential",
                    value: "essential",
                    description: "These are cookies that are essential for the website to work correctly."
                },
                {
                    type: "Site Preferences",
                    value: "preferences",
                    description: "These are cookies that are related to your site preferences, e.g. remembering your username, site colours, etc."
                },
                {
                    type: "Analytics",
                    value: "analytics",
                    description: "Cookies related to site visits, browser types, etc."
                },
                {
                    type: "Marketing",
                    value: "marketing",
                    description: "Cookies related to marketing, e.g. newsletters, social media, etc"
                }
            ],
            title: "Cookies & privacy",
            subtitle: "Select cookies to accept",
            message: "Cookies enable you to use shopping carts and to personalize your experience on our sites, tell us which parts of our websites people have visited, help us measure the effectiveness of ads and web searches, and give us insights into user behaviour so we can improve our communications and products.",
            delay: 2000,
            expires: 30,
            acceptBtnLabel: "Accept cookies",
            advancedBtnLabel: "Customize cookies",
            customShowMessage: undefined,
            customHideMessage: undefined,
            customShowChecks: undefined
        }, window.GdprCookieSettings, options);
        
        $(function() { display(); });
    };
    
    display = function(alwaysShow) {
        console.log(alwaysShow);
        if (showing) {
            return;
        }
        
        var body = $("body"),
            myCookie = getCookie("cookieControl"),
            myCookiePrefs = getCookie("cookieControlPrefs");
        
        var elements = {
            container: undefined,
            types: undefined,
            typesContainer: undefined,
            buttons: { 
                accept: undefined, 
                advanced: undefined 
            },
            allChecks: [ ],
            nonessentialChecks: [ ]
        };
            
        var setCookieControl = function(value, expiryDays) {
            setCookie("cookieControl", value, expiryDays);
            if (elements.container) {
                if ($.isFunction(settings.customHideMessage)) {
                    settings.customHideMessage.call(elements.container, elements.container);
                    showing = false;
                }
                else {
                    elements.container.fadeOut("fast", function() {
                        $(this).remove();
                        showing = false;
                    });
                }
            }
        };

        if (alwaysShow || !myCookie || !myCookiePrefs) {
            elements.types = $("<ul/>").append(
                $.map(settings.cookieTypes, function(field, index) {
                    if (!field.type || !field.value) {
                        return;
                    }
                    var isEssential = field.value === "essential";
                    
                    var input = $("<input/>", {
                        type: "checkbox",
                        id: "gdpr-cookietype-" + index,
                        name: "gdpr[]",
                        value: field.value,

                        // The essential cookies checkbox is checked and cannot be unchecked
                        checked: isEssential,
                        disabled: isEssential
                    });
                    
                    elements.allChecks.push(input.get(0));
                    if (!isEssential) {
                        elements.nonessentialChecks.push(input.get(0));
                    }
                    
                    var label = $("<label/>", {
                        "for": "gdpr-cookietype-" + index,
                        text: field.type,
                        title: field.description
                    });

                    return $("<li/>").append([
                        input.get(0),
                        label.get(0)
                    ]).get(0);
                })
            );
            elements.allChecks = $(elements.allChecks);
            elements.nonessentialChecks = $(elements.nonessentialChecks);
            
            // When accept button is clicked drop cookie
            var acceptClick = function() {
                // Set cookie
                setCookieControl(true, settings.expires);

                // Save user cookie preferences (in a cookie!)
                var prefs = $.map(elements.allChecks.filter(function() { return this.checked || this.disabled; }), function(checkbox) { return checkbox.value; });
                setCookie("cookieControlPrefs", JSON.stringify(prefs), 365);

                // Trigger cookie accept event
                body.trigger("gdpr:accept");
            };
            
            // Toggle advanced cookie options
            var advancedClick = function() {
                // Uncheck all checkboxes except for the disabled "necessary"
                // one. The user can now select the cookies they want to accept.
                elements.nonessentialChecks.prop("checked", false);
                elements.buttons.advanced.prop("disabled", true);
                
                if ($.isFunction(settings.customShowChecks)) {
                    settings.customShowChecks.call(elements.typesContainer, elements.typesContainer);
                }
                else {
                    elements.typesContainer.slideDown("fast");
                }
                
                // Trigger advanced show event
                body.trigger("gdpr:advanced");
            };
            
            // Build cookie message to display later on
            var cookieMessage = (elements.container = $("<div class=gdprcookie>")).append([
                $("<h1/>", { text: settings.title }).get(0),
                $("<p/>", { html: settings.message }).get(0),
                (elements.typesContainer = $("<div class=gdprcookie-types/>")).hide().append([
                    $("<h2/>", { text: settings.subtitle }).get(0),
                    elements.types.get(0)
                ]).get(0),
                $("<div class=gdprcookie-buttons/>").append([
                    (elements.buttons.accept = $("<button/>", { type: "button", text: settings.acceptBtnLabel, click: acceptClick })).get(0),
                    (elements.buttons.advanced = $("<button/>", { type: "button", text: settings.advancedBtnLabel, click: advancedClick })).get(0)
                ]).get(0)
            ]);
            
            var show = function() {
                body.append(cookieMessage);
                showing = true;
                if ($.isFunction(settings.customShowMessage)) {
                    settings.customShowMessage.call(elements.container, elements.container);
                }
                else {
                    elements.container.hide().fadeIn("slow");
                }
                
                // Trigger container show event
                body.trigger("gdpr:show");
            };
            
            if (!settings.delay || alwaysShow) {
                show();
            }
            else {
                window.setTimeout(show, settings.delay);
            }
        }
        else {
            var cookieVal = true;
            if (myCookie === undefined) {
                cookieVal = false;
            }
            setCookieControl(cookieVal, settings.expires);
        }
    };
    
    $.gdprcookie.display = function() {
        display(true);
    };

    // Method to check if user cookie preference exists
    $.gdprcookie.preference = function(cookieTypeValue) {
        var control = getCookie("cookieControl");
        var preferences = getCookie("cookieControlPrefs");
        try {
            preferences = JSON.parse(preferences);
        }
        catch(ex) {
            preferences = undefined;
        }

        if (control === undefined || preferences === undefined || !$.isArray(preferences)) {
            return;
        }
        return preferences;
    };

}(this.jQuery, this, this.document));
