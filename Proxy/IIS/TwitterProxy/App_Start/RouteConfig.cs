using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace TwitterProxy
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
                        
            routes.MapRoute(
                name: "twitter_proxy",
                url: "twitter_proxy/{action}/{id}",
                defaults: new { controller = "Twitter", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Twitter", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
