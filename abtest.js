
window.NS = window.NS || {};

window.NS.ABTest = (function ($) {

    var specialisation = NS.Section.CookieSettings.specialisation();
    var userVal = Math.floor((Math.random() * 100) + 1);
    var pageUrl = window.location.href;
    var urlSplit = pageUrl.split('/');
    var checkPage = urlSplit[urlSplit.length - 3];

    var abOptInTest = {};
    abOptInTest.config = {
        setUserPecent: 100,
        cookieExpiry: 30,
        cookieTestName: 'NS_abtest_inPlace',
        cookieUserNotMatched: 'NS_abtest_userCaseNotMatched',
        cookieUserMatched: 'NS_abtest_userCaseMatched',
        cookieUserOptIn: 'NS_abtest_userOptIn',
        messageContainer: 'opt-notification',
        messageHead: 'Try out our beta listings',
        messageBody: "We're updating our listings page with a new design that adapts to your desktop, tablet or mobile screen.",
        messageOptinBtnTxt: "Try It Now",
        messageOptoutBtnTxt: "No Thanks",
        optInBtn: 'user-opt-in',
        optOutBtn: 'btn-no-thanks',
        url: '/beta/' + specialisation + '/listings',
        returnToOldPageHead: 'Tell us what you think',
        returnToOldPageMessage: 'Email <a href="mailto:feedback@email.com">feedback@email.com</a> with your comments.',
        returnToOldPageBtnTxt: 'Return to standard listings',
        checkPage: 'beta',
        hideShowBtn: 'hideShowMsg',
        toggle: 'togglepopUp'
    };

    abOptInTest.init = function() {
        userOptedIn();
        userOptedOut();
        hideShow();
    };

    //========================================
    // Set AB Test
    //========================================
    abOptInTest.setTest = function () {

        // check if the AB test cookie already set
        if ($.cookie(abOptInTest.config.cookieTestName) === null || $.cookie(abOptInTest.config.cookieTestName) === "" || $.cookie(abOptInTest.config.cookieTestName) === "null" || $.cookie(abOptInTest.config.cookieTestName) === undefined) {
            // User case for first time user

            // then set the cookie
            $.cookie(abOptInTest.config.cookieTestName, true, { expires: abOptInTest.config.cookieExpiry, path: pageUrl });

            // if user falls in the 30% of the user case
            if (userVal <= abOptInTest.config.setUserPecent) {
                // set the cookie for 'Usercase matched'
                $.cookie(abOptInTest.config.cookieUserMatched, true, { expires: abOptInTest.config.cookieExpiry, path: pageUrl });
                showMessage();
                return;

            } else {
                // set the cookie for 'Usercase not matched'
                // user will always see the page without Opt In message
                $.cookie(abOptInTest.config.cookieUserNotMatched, true, { expires: abOptInTest.config.cookieExpiry, path: pageUrl });
                return;
            }

        } else {
            // User has visited before

            // if 'Usercase matched' cookie exist
            // i.e., user has already seen the message before
            if ($.cookie(abOptInTest.config.cookieUserMatched)) {
                // check if user hasn't opted out already
                showMessage();
                return;
            }

            // if 'Usercase not matched' cookie already exist
            else if ($.cookie(abOptInTest.config.cookieUserNotMatched)) {
                // end the script - user will see the current page without cookieUserOptIn message
                return;
            }
        }
    };

    //========================================
    // Create message for current listings
    //========================================
    var showMessage = function () {

        //var cookieVal = $.cookie(abOptInTest.config.cookieUserOptIn);
        var message = $('<div class="' + abOptInTest.config.messageContainer + '">' +
                            '<div class="' + abOptInTest.config.messageContainer + '-inner">' +
                            '<a class="btn ' + abOptInTest.config.hideShowBtn + '" href="#">Hide</a>' +
                                '<a class="btn ' + abOptInTest.config.optInBtn + ' ga-track-event" href="#" rel="Old page AB Test|Btn click|Try new page">' + abOptInTest.config.messageOptinBtnTxt + '</a>' +
                                '<a class="btn btn-no-thanks ga-track-event" href="#" rel="Old page AB Test|Btn click|No Thanks">' + abOptInTest.config.messageOptoutBtnTxt + '</a>' +
                                '<h4>' + abOptInTest.config.messageHead + '</h4>' +
                                '<p>' + abOptInTest.config.messageBody + '</p>' +
                            '</div>' +
                        '</div>');

        // Show user Opt in message
        if (checkPage !== abOptInTest.config.checkPage) {
            $(message).appendTo('body');
        }
    }

    //========================================
    // Create message for beta listings
    //========================================
    var betaMessage = function () {
        var message = $('<div class="' + abOptInTest.config.messageContainer + '">' +
                            '<div class="' + abOptInTest.config.messageContainer + '-inner">' +
                                '<a class="btn ' + abOptInTest.config.hideShowBtn + '" href="#">Hide</a>' +
                                '<a href="' + '/' + specialisation + '/' + specialisation + '-listings' + '" class="btn btn-cancel go-back-opt-out ga-track-event" rel="New page|Btn click|Go To Old page">' + abOptInTest.config.returnToOldPageBtnTxt + '</a>' +
                                '<h4>' + abOptInTest.config.returnToOldPageHead + '</h4>' +
                                '<p>' + abOptInTest.config.returnToOldPageMessage + '</p>' +
                            '</div>' +
                        '</div>');

        // check if user has closed this message in the past
        if (checkPage == abOptInTest.config.checkPage) {
            if ($('body').children('.' + abOptInTest.config.messageContainer).length == 0) {
                $(message).appendTo('body');
            }
        }
    }

    //========================================
    // User click Opt out
    //========================================
    var hideShow = function () {
        $('body').on('click', '.' + abOptInTest.config.hideShowBtn, function (e) {
            e.preventDefault();

            // Toggle slide class
            $('.' + abOptInTest.config.messageContainer).toggleClass(abOptInTest.config.toggle);

            // Change text
            if ($(this).text() == 'Hide') {
                $(this).text('Show');
            } else {
                $(this).text('Hide');
            }
        });
    }


    //========================================
    // User Click opt in
    //========================================
    var userOptedIn = function() {
        $('body').on('click', '.' + abOptInTest.config.optInBtn, function (e) {
            e.preventDefault();
            $.cookie(abOptInTest.config.cookieUserOptIn, true, { expires: abOptInTest.config.cookieExpiry, path: '/' });
            window.location.href = abOptInTest.config.url;
        });

        betaMessage();
    }


    //========================================
    // User click Opt out
    //========================================
    var userOptedOut = function () {
        $('body').on('click', '.' + abOptInTest.config.optOutBtn, function (e) {
            e.preventDefault();
            $('.' + abOptInTest.config.messageContainer).find('.' + abOptInTest.config.hideShowBtn).text('Show');
            $('.' + abOptInTest.config.messageContainer).addClass(abOptInTest.config.toggle);
        });
    }

    //========================================

    return abOptInTest;

})(jQuery);

jQuery(document).ready(function () {
    NS.ABTest.init();
    NS.ABTest.setTest();
});
