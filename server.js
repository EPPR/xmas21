// EPPR Proyecto Grupal 2021
// Escuela de Programación y Pensamiento Recursivo
// eppr.link
// Archivo: server.js
const { exec } = require("child_process");
var moment = require('moment');
var express = require('express');
var app = express();

app.set('view engine', 'ejs')
// Definimos la carpeta "public" para servir contenido estático.
app.use(express.static('public'))

const port = 3000;

function generateRandomDigits(){
    var result = Math.ceil(Math.random()*6)

    // result = ???
    // Algoritmo para generar un número aleatorio de 1 al 6.

    return result 
}

function resultLog(csv){
    // En esta función ejecutar shell o línea de comandos para guardar el log en un archivo.
    // Ver ejemplo de comando "exec()" (Línea 36, branch original)
    var cli = `echo "${csv}" >> resultados.log`
    exec(cli,(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        // Limpiar respuesta, usualmente incluye multiples entradas de línea "\n"
        var cmdResult = stdout.replace("\n", "").replace("\n", "")
        console.log(`Resultado : ${cmdResult}`);
    });

    // Esta línea va a imprimir en consola del servidor.
    console.log(`Nueva línea en log: ${csv}`)
    return true
}

server = app.listen(port, function () {
    console.log('Node JS corriendo en el puerto 3000!');
    console.log('Para iniciar corre NGROK y visita la página que aparezca');
    // Corre un comando Shell desde NodeJS.
    // Este ejemplo sirve para mostrar como ejecutar una serie de comandos mediante BASH/SHELL
    exec("pwd", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        // Limpiar respuesta, usualmente incluye multiples entradas de línea "\n"
        var pwdLocation = stdout.replace("\n", "").replace("\n", "")
        console.log(`Este programa corre en la carpeta : ${pwdLocation}`);
    });

});

// Código para iniciar Socket.IO
const io = require("socket.io")(server)
// Función de conexión, sucede cada vez que un dispositivo se conecta.
io.on('connection', (socket) => {
    // setScore : Función inicial para reportar el Record actual.
    socket.emit('welcome', { msg: "Bienvenidos!", ip: socket.conn.remoteAddress.replace("::ffff:","") });
    console.log('Nueva conexión: '+socket.conn.remoteAddress.replace("::ffff:","")+'')
    // request : Esta función se emite desde el HTML hacia nuestro servidor.
    // Se solicita lanzar un dado y obtener un número aleatorio entre 1-6.
    socket.on('request', (data) => {
        var diceResult = generateRandomDigits()
        // La siguiente función envía el resultado al Front End para la animación.
        io.emit('result', { data: {number: diceResult, ip: data.ip } });
        // La siguiente función debe guardar los resultados en un archivo.
        resultLog(`${diceResult},${data.ip}`);
    });
})

app.get('/', function (req, res) {
    res.render('index')
});
