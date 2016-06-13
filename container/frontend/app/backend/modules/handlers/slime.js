var page = require('webpage').create();
page.open("https://google.co.uk", function (status) {
    page.viewportSize = { width:1024, height:768 };
    page.render('screenshot.png')
});
