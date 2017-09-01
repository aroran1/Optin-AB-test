# Optin-AB-test

Running an AB test that directly compares a variation against a current experience lets you ask focused questions about changes to your website or app.

In an A/B test, you take a webpage or app screen and modify it to create a second version of the same page. This change can be as simple as a single headline or button, or be a complete redesign of the page.

For this example, we set up 2 version of the same page live on slightly differet urls, for example A named as www.example.com/listings and version B was set on the beta url. When users land on the page original page the set % of user asked a question to try out the new (B) page, which drop cookie on their browser as per their decisions. If the user choose yesthen when they revisit the page they will automatically be shown the newer version (B) of the page. If they have decided not to try out the new page then thewy will not be asked again and they will carry on using the A version of the page until the decision been made which version will stay live.

In the given code the audience percentage to see the B version of the page can be changed with 'setUserPecent' value, currently set to 100% in the example.
