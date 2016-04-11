define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/request/script",
    "dojo/date/locale"


], function (
    declare,
    array,
    lang,
    on,
    requestScript,
    locale

    ) {

        function Instagram(media) {                       
            
            this.type = media.type;
            
            if(this.type == "image"){
                
                 this.image = media.images.standard_resolution;
                
            }else{
                
                this.video = media.videos.low_resolution;
            }
            
            this.latitude = media.location.latitude;
            this.longitude = media.location.longitude;
            
            this.filter = media.filter;
            this.created_time = media.created_time;
            this.link = media.link;
                        
                        
            this.text = media.caption.text;            
            this.tags = media.tags;           
            
            this.id = media.id;
            
            this.username = media.user.username;
            this.profilePicture = media.user.profile_picture;
            
            this._htmlText = "";
            this._htmlMedia = "";
                      
        }

        var Element = {

            parse: function (/*Object*/ data) {
                
                //summary: 
                //          Parses the data from a search
                //
                //description:
                //          If the data are valide, the function parses the input data and 
                //          puts all the media inside an array
                //  
                //tags:
                //          public
                //
                //returns:
                //          An array with all the media
                //
                
                var instagrams = [];              
                                
                if (data.meta.code != 200) { return instagrams; }

                if (!data.data) { return instagrams; }

                data.data.forEach(function (i) {

                    try {                        
                        
                        if (!i.location) { return; }                   
                        
                        var instagram = new Instagram(i);    
                        
                        instagrams.push(instagram);

                    } catch (error) {

                    }

                });                           

                return instagrams; //Array

            },


            _addSpaces: function(/*String*/ text){
            
                //summary: 
                //          Adds spaces where needed
                // 
                //tags:
                //          private
                //
                
                var text2 = "";
                
                for (i = 0; i < text.length; i++) {

                  if (text[i] == "#") {

                    if (i - 1 >= 0 && text[i - 1] != " ") {
                      text2 += " #"
                    } else {
                      text2 += "#";
                    }

                  } 
  
                  else {
                    text2 += text[i];
                  }
                }
                
                return text2 /*String*/;
            },
           
            
            _wrapHashtag: function (/*String*/ text) {
                
                //summary: 
                //          Wraps an hashtag in html
                // 
                //tags:
                //          private
                //
                                
                return text.replace(/#(\S*)/g, '<a href="https://www.instagram.com/explore/tags/$1">#$1</a>'); // String
                            
                
            },
                    

            _wrapUser: function (/*Object*/ text) {

                //summary: 
                //          Wraps an user in html
                // 
                //tags:
                //          private
                //
                
                return text.replace(/@(\S*)/g, '<a href="https://www.instagram.com/$1">@$1</a>'); // String
            },

            
            _wrapImage: function (/*Object*/ image) {

                //summary: 
                //          Wraps an user in html
                // 
                //tags:
                //          private
                //
                
                var html = "<img src='{url}' width='95%' style='max-width: {width}px; max-height: {height}px;'/>";
                
                return lang.replace(html, image); // String
            },
            
             _wrapVideo: function (/*Object*/ video) {

                //summary: 
                //          Wraps an user in html
                // 
                //tags:
                //          private
                //
                
                var html = "<video width='95%' style='max-width: {width}px; max-height: {height}px;' controls>" +
                    "<source src='{url}' type='video/mp4'>" +
                    " Your browser does not support the video tag." +
                    "</video>";
                
                return lang.replace(html, video); // String
            },
            
            
            
            formatElement: function (/*Object*/ element) {

                //summary: 
                //          Formats the attributes, used before they are added to a graphic
                //
                //description:
                //          Wraps the hashtags and the media in html.
                //  
                //tags:
                //          public
                //

            
                if (element._htmlText !== "") { return; }            
            
                var result = element.text;

                result = this._addSpaces(result);
                
                result = this._wrapHashtag(result);                
                    
                element._htmlText = result;

                //format the media                
                
                if(element.type == "image"){
                    
                    element._htmlMedia = this._wrapImage(element.image);
                    
                }else if(element.type == "video"){
                    
                    element._htmlMedia = this._wrapVideo(element.video);                    
                }
                
                //format the date
                
                var created_at = new Date(element.created_at);

                element.created_at = locale.format(created_at);

            }

        };

        return Element;

    });


