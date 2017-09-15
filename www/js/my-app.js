// Initialize your app
//var myApp = new Framework7();

// Determine theme depending on device
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
 
// Set Template7 global devices flags
Template7.global = {
    android: isAndroid,
    ios: isIos
};

// Export selectors engine
var $$ = Dom7;


// Change Through navbar layout to Fixed
if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}
 
// Init App
var myApp = new Framework7({
    // Enable Material theme for Android device only
    material: isAndroid ? true : false,
    // Enable Template7 pages
    template7Pages: true
});
 
// Init View
var mainView = myApp.addView('.view-main', {
    // Don't worry about that Material doesn't support it
    // F7 will just ignore it for Material theme
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

function parsePost() {
    
    // Clears previous content
    document.getElementById('ulAPI').innerHTML = '<li id="liAPI"></li>';
    
    // Parses JSON
    var apiJSON = JSON.parse(this.responseText);
    console.log(apiJSON);
    
    // Iterates through each event
    $$.each(apiJSON, function (index, value) {
        
        // Exception handling for 'empty' organiztion values
        try {
            var orgLogin = value.org.login;
            var orgURL = 'https://github.com/' + value.org.login;
            var orgID = value.org.id
        } catch(e) {
            var orgLogin = 'N/A';
            var orgURL = 'N/A';
            var orgID = 'N/A';
        }
        
        // Appends HTML
        ptrContent.find('#ulAPI').append('<li class="accordion-item">' +
                                         '<a href="" class="item-link item-content">' + 
                                            '<div class="item-inner">' +
                                                '<div class="item-title">' + '<div><img src="' + value.actor.avatar_url + '"></div><div><p><strong>Username: </strong>' + value.actor.display_login + '</p><p><strong>Event Type: </strong>' + value.type.split(/(?=[A-Z])/).join(" ").replace('Event', '') + '</p><p><strong>Repository: </strong>' + value.repo.name + '</p></div></div>' +
                                            '</div>' +
                                        '</a>' + 
                                        '<div class ="accordion-item-content">' +
                                                '<p><strong>Event ID: </strong>' + value.id + '</p>' +
                                                '<p><strong>Time: </strong>' + value.created_at + '</p>' +
                                                '<p><strong>Repository URL: </strong>https://github.com/' + value.repo.name + '</p>' +
                                                '<p><strong>Repository ID: </strong>' + value.repo.id + '</p>' +
                                                '<p><strong>Organization Name: </strong>' + orgLogin + '</p>' +
                                                '<p><strong>Organization URL: </strong>' + orgURL + '</p>' +
                                                '<p><strong>Organization ID: </strong>' + orgID + '</p>' +
                                                '<p><strong>User URL: </strong>https://github.com/' + value.actor.display_login + '</p>' +
                                                '<P><strong>User ID: </strong>' + value.actor.id + '</p>' +
                                        '</div>' +
                                    '</li>');
        });
}

 
// Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');
 
// Add 'refresh' listener on it
ptrContent.on('ptr:refresh', function (e) {
    // Emulates 2s loading
    
    setTimeout(function () {
        
        // Async Ajax "GET"
        var xhr = $$.ajax({
                            type: "GET",
                            async: true,
                            url: "https://api.github.com/events",
                            cache: false,
                            dataType: "json",
                    });
        
        xhr.onload = parsePost;
       
        myApp.pullToRefreshDone();
        
    }, 2000); 
});