/////////////////////////////////
//  Twitter Proxy For Node.js  //
/////////////////////////////////

//
//  server information
//
var _serverUrl = "http://localhost",
    _serverPort = "3000",
    _baseUrl = "/twitter_proxy",
    _callbackUrl = _serverUrl + ":" + _serverPort + _baseUrl + "/callback";


//
//  session information
//
var _sessionName = "tp.sid",
    _sessionSecret = "#Write random string#";

//
//  twitter configuration
//
var _consumerKey = '#Twitter Consumer Key#',
    _consumerSecret = '#Twitter Secrect Key#',
    _requestTokenUrl = "https://api.twitter.com/oauth/request_token",
    _accessTokenUrl = "https://api.twitter.com/oauth/access_token",
    _authenticateUrl = "https://twitter.com/oauth/authenticate?oauth_token=",
    _oauthVersion = "1.0A",
    _oauthSignatureMethod = "HMAC-SHA1";

//
//  nodejs module require
//
var express = require('express');
var session = require('express-session');
var uid = require('uid');
var Twitter = require('twitter');
var OAuth = require('oauth');

//
//  configuration
//
var app = express();

var router = express.Router();

var oa = new OAuth.OAuth(
    _requestTokenUrl,
    _accessTokenUrl,
    _consumerKey,
    _consumerSecret,
    _oauthVersion,
    _callbackUrl,
    _oauthSignatureMethod
    );

app.use(_baseUrl, router);

var session_config = {
    genid: function (req) {
        return uid(32);
    },
    name: _sessionName,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 604800000 }, // expires in 1 week
    secret: _sessionSecret
};

//
//  formats the response in jsonp
//
function jsonpResponse(res, jsonpCallback, jsonObj){

	res.header('Content-type','application/json');
	res.header('Charset','utf8');
	res.send(jsonpCallback + '('+ JSON.stringify(jsonObj) + ');');
}


router.use(session(session_config));

//
//  routing
//

router.get('/', function (req, res) {

	res.send('Twitter Proxy');
});



router.get('/search', function (req, res) {

    try {
        
        // Sets app and user credentials
        
        var twitter = new Twitter({
            consumer_key: _consumerKey,
            consumer_secret: _consumerSecret,
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
        });

        var jsonpCallback = req.query.callback;

        delete req.query.callback;

        //  Makes the search on Twitter and formats the respond in jsonp
        
        twitter.get('search/tweets',
            req.query,
            function (error, tweets, response) {
                if (!error) {
					jsonpResponse(res, jsonpCallback, tweets);
                } else {
                    jsonpResponse(res, jsonpCallback, error);
                }

            });

    } catch (error) {
        jsonpResponse(res, jsonpCallback, error);
    }
});

router.get('/oauth', function (req, res) {

    
    //  Requests an authentication token and redirects the user to Twitter
    
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {

            res.redirect(req.session.oauth.callback);
			
        } else {

            req.session.oauth = {};
            req.session.oauth.token = oauth_token;
            req.session.oauth.token_secret = oauth_token_secret;
            req.session.oauth.callback = req.query.redirect_uri;

            res.redirect(_authenticateUrl + oauth_token)
        }
    });
});

router.get('/callback', function (req, res, next) {
    
    // Saves the access token in the user session and redirects him
    
    if (req.session.oauth) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var oauth = req.session.oauth;

        oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
            function (error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
					
                    res.redirect(req.session.oauth.callback);
					
                } else {

                    req.session.oauth.access_token = oauth_access_token;
                    req.session.oauth.access_token_secret = oauth_access_token_secret;

                    req.session.oauth.user_id = results.user_id;
                    req.session.oauth.screen_name = results.screen_name;

        			res.redirect(req.session.oauth.callback);
                }
            }
            );
    } else {
        next(new Error(""));
    }
});


router.get('/check', function (req, res) {
    
    //  Checks if the user is logged in

    if (req.session.oauth) {

        var user = {
            screen_name: req.session.oauth.screen_name
        };

		jsonpResponse(res, req.query.callback, user);

    } else {
        jsonpResponse(res, req.query.callback, {});
    }
});

router.get('/logout', function (req, res) {

    //  Disconnects the user by deleting the user session
    
    req.session.destroy();

    jsonpResponse(res, req.query.callback, {});

});





//
//  start listening
//
var server = app.listen(_serverPort, function () {

    console.log("\nTwitter_Proxy_Server\n");
    console.log("Port:", server.address().port);
});
