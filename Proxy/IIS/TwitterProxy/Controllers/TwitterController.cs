using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Tweetinvi;
using Tweetinvi.Core.Credentials;

namespace TwitterProxy.Controllers
{

    public class TwitterController : Controller
    {

        private string consumerKey = "#Twitter Consumer Key#";
        private string consumerSecret = "#Twitter Consumer Secret#";

        private static string tweetSearchUrl = "https://api.twitter.com/1.1/search/tweets.json";

        private static class SK
        {
            public static string Redirect = "redirect_uri";
            public static string User = "userCreds";
        }


        public ActionResult Index()
        {
            return Content("Twitter Proxy");
        }

        /// <summary>
        /// Requests an authentication token and redirects the user to Twitter
        /// </summary>
        public ActionResult Oauth()
        {

            ConsumerCredentials appCreds;

            string redirectURL, oauthURL;

            try
            {

                Session[SK.Redirect] = Request.QueryString["redirect_uri"];

                appCreds = new ConsumerCredentials(consumerKey, consumerSecret);

                redirectURL = "http://" + Request.Url.Authority + "/twitter/callback";

                oauthURL = CredentialsCreator.GetAuthorizationURL(appCreds, redirectURL);

                return new RedirectResult(oauthURL);

            }
            catch (Exception)
            {
                return new RedirectResult("/twitter/check");
            }
        }

        /// <summary>
        /// Saves user credentials in the user session and redirects him
        /// </summary>
        public ActionResult Callback()
        {

            ITwitterCredentials userCreds;

            string verifierCode, authorizationId, redirect_uri;

            try
            {
                verifierCode = Request.Params.Get("oauth_verifier");
                authorizationId = Request.Params.Get("authorization_id");

                userCreds = CredentialsCreator.GetCredentialsFromVerifierCode(verifierCode, authorizationId);

                Session[SK.User] = userCreds;

                redirect_uri = Session[SK.Redirect].ToString();

                return Redirect(redirect_uri);
            }
            catch (Exception)
            {
                return new RedirectResult("/twitter/check");
            }
        }

        /// <summary>
        /// Gets user credentials from the session,
        /// makes the search on Twitter and formats the respond in jsonp
        /// </summary>
        public void Search()
        {


            try
            {
                string jsonpCallback = Request.QueryString["callback"];

                if (jsonpCallback == null) { throw new Exception(); }

                
                var userCreds = (ITwitterCredentials)Session[SK.User];

                if (userCreds == null) { throw new Exception(); } 


                string url = tweetSearchUrl + Request.Url.Query;

                var userJson = Auth.ExecuteOperationWithCredentials(userCreds, () =>
                {
                    return TwitterAccessor.ExecuteJsonGETQuery(url);
                });

                this.jsonpResponseFormatter(Response, userJson);


            }
            catch (Exception)
            {
                this.jsonpResponseFormatter(Response, "", new { });
            }
            
        }

        /// <summary>
        /// Checks if the user is logged in
        /// </summary>
        public void Check()
        {

            try
            {
                string jsonpCallback = Request.QueryString["callback"];

                if (jsonpCallback == null) { throw new Exception(); }

                var userCreds = (ITwitterCredentials)Session[SK.User];

                if (userCreds == null) { throw new Exception(); }

                string name = Tweetinvi.User.GetAuthenticatedUser(userCreds).ScreenName;
                
                this.jsonpResponseFormatter(Response, jsonpCallback, new { screen_name = name });

            }
            catch (Exception)
            {
                this.jsonpResponseFormatter(Response, "", new { });
            }
        }

        /// <summary>
        /// Disconnects the user by deleting the user session
        /// </summary>
        public void Logout()
        {

            try
            {
                string jsonpCallback = Request.QueryString["callback"];

                if (jsonpCallback == null) { throw new Exception(); }

                Session.Abandon();

                this.jsonpResponseFormatter(Response, jsonpCallback, new { });

            }
            catch (Exception)
            {
                this.jsonpResponseFormatter(Response, "", new { });
            }
            
        }

        /// <summary>
        /// Formats the response in jsonp
        /// </summary>
        /// <param name="res">The response to format</param>
        /// <param name="jsonpCallback">The name for the function in the jsonp</param>
        /// <param name="obj">The object to add in the response</param>
        private void jsonpResponseFormatter(HttpResponseBase res, string jsonpCallback, Object obj)
        {

            string jsonpResponse;
            StringBuilder sb;

            if (!obj.ToString().StartsWith(jsonpCallback))
            {
                sb = new StringBuilder();
                sb.Append(jsonpCallback + "(");
                sb.Append(JsonConvert.SerializeObject(obj));
                sb.Append(");");

                jsonpResponse = sb.ToString();
            }
            else
            {
                jsonpResponse = obj.ToString();
            }                        

            res.Clear();
            res.ContentType = "application/json";
            res.Charset = "utf8";

            res.Write(jsonpResponse);
        }

        /// <summary>
        /// Formats the response in jsonp
        /// </summary>
        /// <param name="res">The response to format</param>
        /// <param name="jsonp">The jsonp to add in the response</param>
        private void jsonpResponseFormatter(HttpResponseBase res, string jsonp)
        {
            
            res.Clear();
            res.ContentType = "application/json";
            res.Charset = "utf8";

            res.Write(jsonp);
        }


    }
}
