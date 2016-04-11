define([
    
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-class",
    "dojo/request/script"
    
], function (
    
    declare,
    lang,
    on,
    domClass,
    requestScript

    ) {
        
        return declare(null, {

            constructor: function (/*Widget*/ widget) {

                //summary: 
                //        Called when a new instance it's created
                //
                //description:
                //        Sets the widget and the proxyUrl variables.
                //        Sets a state variable call logged to false.
                //        Checks if the user is already logged in.
                //  
                //tags:
                //        public
                //
                //widget:
                //        The widget which creates this instance
                //
                //proxyUrl:
                //        A map with all the url to the proxy
                //

                this.widget = widget;
                this.proxyUrl = widget.config.twitter.urls;
                this.logged = false;
                
                this._checkStatus();
                
            },


            _checkStatus: function () {

                //summary: 
                //         Checks if the user is logged
                //
                //description:
                //          Makes a jsonp request to the proxy server.
                //          In case the request confirms the user is authenticated,
                //          sets the logged to true, 
                //          writes the username,
                //          changes the dom by hidding the signin button and showing the logout,
                //          starts a search.
                //  
                //tags:
                //          private
                //

                requestScript.get(this.proxyUrl.check, {
                    jsonp: "callback"

                }).then(lang.hitch(this, function (data) {
                                            
                    if(data.error){

                        if(data.error[0].code != 25){ return; }
     
                    }else if (!data.screen_name) { 
                        
                        return; 
                    }
                    
                    this.logged = true;
                    
                    if (!data.screen_name) { data.screen_name = ""; }
                   
                    this.widget.divUsername.innerHTML = "@" + data.screen_name;
                    this.widget.divUsername.href = "https://twitter.com/" + data.screen_name;
                    
                    domClass.add(this.widget.divNoUser, "hidden");
                    domClass.remove(this.widget.divQuery, "hidden");
                    domClass.remove(this.widget.divUser, "hidden");
                    
                    this.widget.layer.cleanLayer();
                    this.widget.layer.search(this.widget.map.geographicExtent);


                }));
            },


            signin: function () {

                //summary: 
                //          Executes the signin
                //
                //description:
                //          The authentication process (OAuth) needs a callback page when it's done.
                //          CallbackUrl is the url to that page, 
                //          when it's opened starts the window.oAuthCallback and
                //          checks if the user is authenticated.
                //          Window.open opens a new window to the login/sigin page 
                //          of the social network where the user can put his username and password
                //  
                //tags:
                //          public
                //

                var callbackUrl = window.location.protocol + "//" +
                    window.location.host + this.widget.folderUrl + "oauth-callback.html";

                var _checkStatus = lang.hitch(this, "_checkStatus");

                window.oAuthCallback = function (popup) {

                    _checkStatus();
                    window.oAuthCallback = null;
                }

                window.open(this.proxyUrl.oauth + "?redirect_uri=" +
                    encodeURIComponent(callbackUrl),
                    "Signin with Twitter",
                    "");
            },

            logout: function () {

                //summary: 
                //          Executes the logout
                //
                //description:
                //          Prevents the widget from making any search.
                //          Calls the proxy server to logout,
                //          when its callback starts:
                //          sets logged to false, 
                //          changes the username to nothing,
                //          changes the dom by hidding the logout button and showing the signin,
                //          clear the layer from the graphics added during this session,
                //          checks the user status just to be sure everything was right.
                //  
                //tags:
                //          public
                //

                var _stopSearch = lang.hitch(this.widget.layer, "_stopSearch");
                
                _stopSearch();

                requestScript.get(this.proxyUrl.logout, {
                    jsonp: "callback"

                }).then(lang.hitch(this, function (data) {
                    
                    this.logged = false;
                    this.widget.divUsername.innerHTML = "";

                    domClass.add(this.widget.divUser, "hidden");
                    domClass.add(this.widget.divQuery, "hidden");
                    domClass.remove(this.widget.divNoUser, "hidden");
                    
                    

                    this.widget.layer.cleanLayer();
                    
                    this._checkStatus();

                }));

            }

        });

    });


