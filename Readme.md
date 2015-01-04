# NNProxy

A simple proxy server based on node.js with the feature like nginx location forward.

## Usage

### Install

```
npm install nnproxy -g
```

### Start proxy server

- config your proxy, add a proxy.json file to any location you like:

```
{
    "default": {
        "^/google": {
            "target": "http://www.google.com",
            "headers": [
                ["X-Proxy-By", "Node"]
            ]
        },

        "^/": {
            "target": "http://127.0.0.1:3000",
            "headers": []
        }
    },

    "develop": {
        "^/google": {
            "target": "http://www.google.com.hk",
            "headers": [
                ["X-Proxy-By", "Node"]
            ]
        },

        "^/": {
            "target": "http://127.0.0.1:3001",
            "headers": []
        }
    }
}
```
- start your proxy: under the same directory with your proxy.json file, run the command  

```
$ nnp
```

That's it!

### Run with options

```
-p --port the port for your proxy server, 80 by default
-c --config the config file location, proxy.json under current process directory by default
-g --group the group you want to use in the proxy.json file, "default" by default
```

## Credit

- [http-proxy](https://www.npmjs.com/package/http-proxy)
- [commander](https://www.npmjs.com/package/commander)