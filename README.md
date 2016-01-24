# node_openttdlib
Node.js version of OpenTTDLib

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

```javascript
let nottdlib = require('nodejs_openttdlib');

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

MIT