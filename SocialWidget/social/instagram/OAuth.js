define([
    
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-class",
    "dojo/cookie",
    "dojo/io-query",
    "dojo/request/script"
    
], function (
    
    declare,
    lang,
    on,
    domClass,
    cookie,
    ioQuery,
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
                this.urls = widget.config.instagram.urls;
                this.client_id = widget.config.instagram.client_id;
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
                //          emit an extentchange to trigger a search.
                //  
                //tags:
                //          private
                //
                
                
                var token = cookie("instagram-token");
                
                if(!token){return;}
                
                var query = {"access_token": token};

                requestScript.get(this.urls.check, {
                    jsonp: "callback",
                    query: query

                }).then(lang.hitch(this, function (data) {
                                        
                    if (data.meta.code != 200) { return; }
                    
                    data = data.data;
                    
                    this.logged = true;
                   
                    this.widget.divUsername.innerHTML = data.username;
                    this.widget.divUsername.href = "https://www.instagram.com/" + data.username;
                    
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

                window.oAuthCallback = function (location) {
                                    
                    var hash = location.hash;                    
                    
                    var query = hash.substring(hash.indexOf("#") + 1, hash.length);                
                    
                    var queryObject = ioQuery.queryToObject(query);         
                    
                    var token = queryObject.access_token;    
                    
                    cookie("instagram-token", token, { expires: 1 });
                    
                    _checkStatus();
                    
                    window.oAuthCallback = null;
                }
                
                var query = {"client_id": this.client_id,
                            "redirect_uri": callbackUrl,
                             "response_type": "token"
                            }
                
                var queryString = ioQuery.objectToQuery(query);

                window.open(this.urls.oauth + "?" + queryString,
                            "Signin Instagram",
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

                this.logged = false;
                this.widget.divUsername.innerHTML = "";

                domClass.add(this.widget.divUser, "hidden");
                domClass.add(this.widget.divQuery, "hidden");
                domClass.remove(this.widget.divNoUser, "hidden");
                                    

                this.widget.layer.cleanLayer();
                    
                cookie("instagram-token", null, {expires: -1});
                    
                this._checkStatus();  
                
                
            }

        });

       // return twitterOAuth;

    });


