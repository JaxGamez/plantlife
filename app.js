var url = require('url');
var querystring = require('querystring');
var express = require('express');
var unblocker = require('unblocker');
var Transform = require('stream').Transform;

var app = express();

function extractHostname(url){var hostname;if (url.indexOf("//") > -1){hostname = url.split('/')[2]}else{hostname = url.split('/')[0];}hostname = hostname.split(':')[0];hostname = hostname.split('?')[0];return hostname.replace('www.','')}

var bannedurls=['googlesyndication.com','googletagmanager.com','etahub.com','adsoftheworld.com','amazon-adsystem.com','juicyads.com','googleadservices.com','moatads.com','doubleclick.net','youtube','trafficjunky.net','localhost','192.168','whatsmyip.com','doubleclick.net','0.0','127.0','discord','whatismyip','pornhub.com','xvideos.com','redtube.com','xhamster.com'];
function userAgent(data){
	bannedurls.forEach(e=>{
		if(!extractHostname(data.url).includes('cdn.discordapp.com') && (extractHostname(data.url).includes(e) || data.url.includes('ads.js'))){
			data.clientResponse.status(403).send('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/><title>403 - Forbidden: Access is denied.</title><style type="text/css"><!--body{margin:0;font-size:.7em;font-family:Verdana, Arial, Helvetica, sans-serif;background:#EEEEEE;}fieldset{padding:0 15px 10px 15px;}h1{font-size:2.4em;margin:0;color:#FFF;}h2{font-size:1.7em;margin:0;color:#CC0000;}h3{font-size:1.2em;margin:10px 0 0 0;color:#000000;}#header{width:96%;margin:0 0 0 0;padding:6px 2% 6px 2%;font-family:"trebuchet MS", Verdana, sans-serif;color:#FFF;background-color:#555555;}#content{margin:0 0 0 2%;position:relative;}.content-container{background:#FFF;width:96%;margin-top:8px;padding:10px;position:relative;}--></style></head><body><div id="header"><h1>Server Error</h1></div><div id="content"><div class="content-container"><fieldset><h2>403 - Forbidden: Access is denied.</h2><h3>You do not have permission to view this directory or page using the credentials that you supplied.</h3></fieldset></div></div></body></html>');
		}
	});
	data.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36 OPR/12';
	if(extractHostname(data.url)==='google.com')data.headers['cookie'] = '';
	return data
}

var unblockerConfig = {
    prefix: '/textbooks/',
	requestMiddleware: [
		userAgent
	]
};




app.use(unblocker(unblockerConfig));


app.use('/', express.static(__dirname + '/public'));


app.get("/no-js", function(req, res) {
  
    var site = querystring.parse(url.parse(req.url).query).url;
  
    res.redirect(unblockerConfig.prefix + site);
});


module.exports = app;
