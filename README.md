# node_openttdlib
Node.js version of OpenTTDLib

## Synopsis

This is a node.js version of [OpenTTDLib](https://theyosh.nl/speeltuin/OpenTTDLib-0.3.2/docs/li_OpenTTDLib.html). 
With it you can extract information from a OpenTTD server.

## CLI

### Global install

```sh
npm install -g nodejs_openttdlib
```

### Usage

nottdlib [options]

   Options:

    -h, --help      output usage information
    -V, --version   output the version number
    -p, --port <n>  Specify port
    -h, --host <n>  Specify host
    -i, --info      Get server info
    -d, --details   Get detailed server info

## Require

### Local install

```sh
npm install nodejs_openttdlib
```

```javascript
const nottdlib = require('nodejs_openttdlib');

// promises
nottdlib.getServerInfo()
.then((info) => {
	console.log(info);
})
.catch((err) => {
	console.error(err);
});

// callbacks
nottdlib.getServerDetail((err, details) => {
	if( err ) {
		console.error(err);
		return;
	}

	console.log(details);
});

```

## License

GPL-2.0