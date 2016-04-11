define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/request/script",
    "dojo/date/locale",
    
    "./lib/twitter-text-1.13.0.min"


], function (
    declare,
    array,
    lang,
    on,
    requestScript,
    locale,
     
    twitterText

    ) {

        function Tweet(status) {
            this.iso_language_code = status.metadata.iso_language_code;
            this.created_at = status.created_at;
            this.id = status.id;
            this.id_str = status.id_str;
            this.text = status.text;
            this._htmlText = "";
            this.latitude = status.geo.coordinates[0];
            this.longitude = status.geo.coordinates[1];

            this.user_id = status.user.id;
            this.user_id_str = status.user.id_str;
            this.user_name = status.user.name;
            this.user_screen_name = status.user.screen_name;
            this.user_lang = status.user.lang;
            this.user_profile_image = status.user.profile_image_url;

            this.entities = status.entities;
        }       

        var Element = {

            parse: function (/*Object*/ data) {
                
                //summary: 
                //          Parses the data from a search
                //
                //description:
                //          If the data are valide, the function parses the input data and 
                //          puts all the tweets inside an array
                //  
                //tags:
                //          public
                //
                //returns:
                //          An array with all the tweets
                //
                
                var statuses = data.statuses;

                var tweets = [];

                if (!statuses) { return tweets; }

                statuses.forEach(function (status) {

                    try {

                        if (!status.geo) { return; }

                        var tweet = new Tweet(status);

                        tweets.push(tweet);

                    } catch (error) {

                    }

                });

                return tweets; //Array

            },



            formatElement: function (/*Object*/ element) {

                //summary: 
                //          Formats the attributes, used before they are added to a graphic
                //
                //description:
                //          Wraps tweets entities in html code using the twitter-text library
                //  
                //tags:
                //          public
                //

                if (!element.entities) { return; }
                if (element._htmlText !== "") { return; }                
                
                element._htmlText = twitterText.autoLinkWithJSON(element.text, element.entities);          
         
                //format the date
                
                var created_at = new Date(element.created_at);

                element.created_at = locale.format(created_at);

            }

        };

        return Element;

    });


