const pantalla_login = "login";
const pantalla_principal = "principal";
var time = 0;
//var initialOffset = '440';
var i = 99
window.onload = () => {

    var btnlogin = GetId("btnlogin");
    btnlogin.addEventListener("click", () => {
        GetId(pantalla_login).style.display = 'none';
        GetId(pantalla_principal).style.display = 'flex';
    });
    var temporizador = GetId("temporizador");
    var interval = setInterval(function () {
        temporizador.innerHTML = i
        if (i == time) {
            clearInterval(interval);
            return;
        }
        i--;
    }, 1000);
}

var GetId = (id) => {
    return document.getElementById(id);
}

var timout;
function apagar() {
    //document.getElementById("testdiv").innerHTML = "En 10 segundos se apagará el computador.";
    timout = setTimeout(function () {
        //document.getElementById("testdiv").innerHTML = "Computador apagado.";
    }, 10000, "JavaScript");
}
function cancelar() {
    clearTimeout(timout);
    //document.getElementById("testdiv").innerHTML = "Operación cancelada.";
}