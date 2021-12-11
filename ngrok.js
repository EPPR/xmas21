// Este archivo se usa para iniciar un túnel seguro con NGROK.
// Para iniciar este programa debes correr:
// node ngrok.js 3000
// El último puerto define el puerto que deseas abrir.
const ngrok = require('ngrok');
var myArgs = process.argv.slice(2);
(async () => {
    const port = myArgs[0] ? myArgs[0] : 8080;
    const url = await ngrok.connect(port);
    console.log(url);
})();