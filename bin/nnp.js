/**
 * Created by samoay on 1/4/15.
 */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    httpProxy = require('http-proxy'),
    program = require('commander');


program
    .version('0.0.1')
    .option('-p, --port <n>', 'Listening port')
    .option('-c, --config <string>', 'Specify your own config file, default is proxy.json')
    .option('-g, --group <string>', 'Choose a group in your proxy.json config, default group is default')
    .parse(process.argv);

//
// Read config file content
//
var configFilePath;
if (program.config){
    configFilePath = path.resolve( program.config );
}else{
    configFilePath = path.join(process.env.PWD, 'proxy.json');
}

if (!fs.existsSync(configFilePath)){
    console.log("Config file <"+ configFilePath +"> not exist");
    return;
}

var config = JSON.parse(fs.readFileSync(configFilePath));

//
// Choose a group of config
//
var group = program.group || 'default';
if (!config.hasOwnProperty(group)){
    console.log("Config group <"+ group +"> not defined, please check your config file");
    return;
}

var groupConfig = config[group];

//
// Create your proxy server
//
var proxy = httpProxy.createProxyServer({});

//
// Pass headers by config
//
proxy.on('proxyReq', function(proxyReq, req, res, options) {
    var url = req.url;
    for(var k in groupConfig){
        if (groupConfig.hasOwnProperty(k)){
            if (!groupConfig[k]['headers'] || groupConfig[k]['headers'].length==0){
                continue;
            }

            var headers = groupConfig[k]['headers'],
                reg = new RegExp(k);
            if (reg.test(url)){
                for(var i= 0,j=headers.length; i<j; i++){
                    proxyReq.setHeader(headers[i][0], headers[i][1]);
                }

                console.log("url <"+ url +"> cached in proxyReq event");
            }
        }
    }
});

//
// Proxy to different target by config
//
var server = http.createServer(function(req, res) {
    var url = req.url;
    for(var k in groupConfig){
        if (groupConfig.hasOwnProperty(k)){
            var target = groupConfig[k]['target'],
                reg = new RegExp(k);
            if (reg.test(url)){
                proxy.web(req, res, {
                    target: target
                });

                console.log("url <"+ url +"> cached in proxy");
            }
        }
    }
});

server.listen(8080);
console.log("proxy server listening on port 8080");