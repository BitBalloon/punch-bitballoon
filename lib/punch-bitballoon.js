var bitballoon = require("bitballoon"),
    fs         = require("fs"),
    prompt     = require("prompt");

var withCredentials = function(config, cb) {
  if (process.env['BITBALLOON_TOKEN']) {
    return cb(null, process.env['BITBALLOON_TOKEN'], process.env['BITBALLOON_SITE']);
  }
  
  if (config.publish && config.publish.options && config.publish.options.access_token) {
    return cb(null, config.publish.options.access_token, config.publish.options.site_id);
  }
  
  setTimeout(function() {
    console.log("No access token found in the publish options.");
    console.log("Now generating a BitBalloon access token (make sure you create an app at https://www.bitballoon.com/applications)");
    prompt.get(["Client ID", "Client Secret"], function(err, result) {
      if (result["Client ID"] && result["Client Secret"]) {
        var client = bitballoon.createClient({client_id: result["Client ID"], client_secret: result["Client Secret"]});
        client.authorizeFromCredentials(function(err, token) {
          if (err) return console.log("Bad ");
          
          console.log("************************************");
          console.log("Your access token:");
          console.log(token);
          console.log("Add this to your config.json under");
          console.log("publish.strategy.options.access_token");
          console.log("If you want to deploy to a specific site, add the site domain or id under");
          console.log("publish.strategy.options.site_id");
          console.log("************************************");
        });
      } else {
        cb("No access token - deploy canceled");
      }
    });
  }, 1000)
};

var siteCreatedFn = function(cb) {
  return function(err, site) {
    if (err) return console.log("Error publishing site", err);
    console.log("Site uploaded - now processing");
    site.waitForReady(function(err) {
      if (err) return console.log("Error publishing site", err);
      console.log("Site pulbished at ", site.url);
      cb();
    });
  }
};

exports.publish = function(config, lastPublished, cb) {
  var dir = config.output_dir, client;
  
  withCredentials(config, function(err, token, siteId) {
    if (err) return console.log("Error publishing site:", err);
    
    client = bitballoon.createClient({access_token: token});
    
    if (siteId) {
      client.site(siteId.replace(/^https?:\/\//, '').replace(/\/$/, ""), function(err, site) {
        if (err) return console.log("Error publishing site", err);
        
        site.update({dir: dir}, siteCreatedFn(cb));
      });
    } else {
      client.createSite({dir: dir}, siteCreatedFn(cb));
    }
  });
}