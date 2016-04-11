**Social Widget**
--------------------------------------------------

Copyright ©2016 Esri Italia e  **Andrea Lorino**.  

**Italiano**

Social Widget è un widget per il [Web AppBuilder](https://developers.arcgis.com/web-appbuilder/) che permette di integrare Twitter, Instagram e YouTube all'interno di una applicazione web.

**Configurazione Instagram e YouTube**: 

1. Richiedere un client_id 

    * Instagram: Registrare un'applicazione da [Instagram Developer](https://www.instagram.com/developer/) 
    * YouTube: Creare un progetto da [Google Console](https://console.developers.google.com/) con "YouTube Data API" abilitato e richiedere una "OAuth client ID" da "Credentials" 

2. Quando richiesto inserire come redirect uri: 
[http://**_path_applicazione_**/widgets/SocialWidget/oauth-callback.html](),
es: http://localhost/myapp/widgets/SocialWidget/oauth-callback.html

3. Configurare l'applicazione da Web AppBuilder ed inserire il client_id

4. Caricare l'applicazione sul proprio sito

5. Registrare l'applicazione in [Developer ArcGIS](https://developers.arcgis.com/applications)


**Configurazione Twitter**: 

1. Creare una applicazione da [Twitter](https://apps.twitter.com/)

2. Inserire come callback url:
[http://**_path_applicazione_**/widgets/SocialWidget/oauth-callback.html](), 
es: http://localhost/myapp/widgets/SocialWidget/oauth-callback.html

3. Sotto "Permissions" modificare "Access" a "Read Only"

4. Da "Keys and Access Tokens" prendere Consumer Key e Consumer Secret

5. Inserire Consumer Key e Consumer Secret in uno dei due proxy (quello per NodeJS o quello per IIS)
    * Per NodeJS modificare il file "twitter_proxy.js", inoltre creare un stringa casuale da inserire come "_sessionSecret" e impostare il "_serverUrl"
    * Per IIS modificare "Controllers/TwitterController.cs"
    
6. Caricare su un server il proxy

7. Configurare l'applicazione da Web AppBuilder inserendo come url: 

    * oauth: [http://**_mysite:myport_**/twitter_proxy/oauth]()
    * check: [http://**_mysite:myport_**/twitter_proxy/check]()
    * logout: [http://**_mysite:myport_**/twitter_proxy/logout]()
    * search: [http://**_mysite:myport_**/twitter_proxy/search]()
    
8. Caricare l'applicazione sul proprio sito

9. Registrare l'applicazione in [Developer ArcGIS](https://developers.arcgis.com/applications)

**English**

Social Widget is a widget for [Web AppBuilder](https://developers.arcgis.com/web-appbuilder/), It adds support for Twitter, Instagram and YouTube inside a web application.

**Instagram and YouTube Configuration**: 

1. Request for a client_id 

    * Instagram: Register an application from [Instagram Developer](https://www.instagram.com/developer/) 
    * YouTube: Create a project from [Google Console](https://console.developers.google.com/) with "YouTube Data API" enabled and create an "OAuth client ID" from "Credentials" 

2. When asked put this as redirect uri: 
[http://**_path_applicazione_**/widgets/SocialWidget/oauth-callback.html](),
ex: http://localhost/myapp/widgets/SocialWidget/oauth-callback.html

3. Configure the application from the Web AppBuilder and add the client_id

4. Load the application on your site

5. Register your application in [Developer ArcGIS](https://developers.arcgis.com/applications)


**Twitter Configuration**: 

1. Create an application from [Twitter](https://apps.twitter.com/)

2. Add this as callback url:
[http://**_path_applicazione_**/widgets/SocialWidget/oauth-callback.html](), 
ex: http://localhost/myapp/widgets/SocialWidget/oauth-callback.html

3. Under "Permissions" change "Access" to "Read Only"

4. Under "Keys and Access Tokens" copy Consumer Key and Consumer Secret

5. Write Consumer Key e Consumer Secret in one of the two proxy server (the one for NodeJS or the one for IIS)
    * For NodeJS change the file "twitter_proxy.js", also create a random string to add as "_sessionSecret" and set "_serverUrl"
    * For IIS change "Controllers/TwitterController.cs"
    
6. Load the proxy server

7. Configure the application from the Web AppBuilder and add this url: 

    * oauth: [http://**_mysite:myport_**/twitter_proxy/oauth]()
    * check: [http://**_mysite:myport_**/twitter_proxy/check]()
    * logout: [http://**_mysite:myport_**/twitter_proxy/logout]()
    * search: [http://**_mysite:myport_**/twitter_proxy/search]()

8. Load the application on your site

9. Register your application in [Developer ArcGIS](https://developers.arcgis.com/applications)

--------------------------------------------------

**Dependencies**:

* [twitter-text - Twitter Text Libraries](https://github.com/twitter/twitter-text)
* [twitter - Twitter API client library for node.js](https://www.npmjs.com/package/twitter)
* [Tweetinvi](https://github.com/linvi/tweetinvi)





