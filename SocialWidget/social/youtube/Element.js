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

        function Youtube(video) {                       
            
            var snippet = video.snippet;
            var recordingDetails = video.recordingDetails;           
            
            this.id = video.id;            
            
            this.publishedAt = snippet.publishedAt;
            
            this.channelId = snippet.channelId;
                
            this.channelTitle = snippet.channelTitle;
            
            this.title = snippet.title;
            
            this.description = snippet.description;
            
            this.thumbnail = snippet.thumbnails.high || snippet.thumbnails.default; 
            
            this.latitude = recordingDetails.location.latitude;
            this.longitude = recordingDetails.location.longitude;
                    
            snippet = null;
            recordingDetails = null;
                
            this._htmlText = "";
            this._htmlMedia = "";
                      
        }

        var Element = {

            parseList: function (/*Object*/ data) {
                
                //summary: 
                //          Parses the data from a search
                //
                //description:
                //          If the data are valide, the function parses the input data and 
                //          puts all the video ids inside an array
                //  
                //tags:
                //          public
                //
                //returns:
                //          An array with all the video ids
                //
                
                
                var videos = [];              
                                
                if (data.error) { return videos; }           

                data.items.forEach(function (v) {

                    try {                        
                        
                        videos.push(v.id.videoId);

                    } catch (error) {

                    }

                });                           

                return videos; //Array

            },
            
            parseVideo: function (/*Object*/ data) {                                         
                
                //summary: 
                //          Parses the data from a search
                //
                //description:
                //          If the data are valide, the function parses the input data and 
                //          puts all the video inside an array
                //  
                //tags:
                //          public
                //
                //returns:
                //          An array with all the video
                //
                
                var videos = [];
                
                if (data.error) { return videos; }      
                                     
                data.items.forEach(function (v) {

                    try {                        
                        
                        var youtube = new Youtube(v);
                        
                        videos.push(youtube);

                    } catch (error) {

                    }

                });                           
                
                return videos; //Array

            },


            _wrapUser: function (/*Object*/ video) {

                //summary: 
                //          Wraps an user in html
                // 
                //tags:
                //          private
                //
                
                var html = "<a href='https://www.youtube.com/channel/{channelId}'>{channelTitle}</a>";
                
                return lang.replace(html, video); // String                           
            },

            

             _wrapVideo: function (/*String*/ video) {

                //summary: 
                //          Wraps the video in html
                // 
                //tags:
                //          private
                //                 

                 
                 var html = "<iframe id='youtube_player' src='https://www.youtube.com/embed/{id}?enablejsapi=1&version=3&playerapiid=ytplayer' frameborder='0' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 100' allowscriptaccess='always' allowfullscreen></iframe>";                 
                         
                return lang.replace(html, video); // String  
            },
            
            
            
            formatElement: function (/*Object*/ element) {

                //summary: 
                //          Formats the attributes, used before they are added to a graphic
                //
                //description:
                //          Wraps the video in html.
                //  
                //tags:
                //          public
                //

            
                if (element._htmlMedia !== "") { return; }            
            
                
                //format the media                

                element._htmlMedia = this._wrapVideo(element);                    
               
                
                //format the date
                
                var publishedAt = new Date(element.publishedAt);

                element.publishedAt = locale.format(publishedAt);

            }

        };

        return Element;

    });


