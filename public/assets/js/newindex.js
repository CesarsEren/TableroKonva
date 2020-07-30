var stage;
var layer;
var tr = new Konva.Transformer();
var elementoseleccionado;
var contenedor;
var propiedades;
var _propiedadesbol = false;
var socket = io.connect('http://localhost:4000');
window.onload = () => {
    $("#login").modal("show");
}
var isPaint = false;
var mode = 'brush';
var activolapicero = false;
var lastLine;
var cargarcomplementosopciones = () => {

    stage.on('mousedown touchstart', function (e) {
        if (activolapicero) {
            isPaint = true;
            var pos = stage.getPointerPosition();
            if (mode === 'brush') {
                lastLine = new Konva.Line({
                    stroke: '#df4b26',
                    strokeWidth: 5,
                    globalCompositeOperation: 'source-over',
                    points: [pos.x, pos.y],
                });
            } else {
                lastLine = new Konva.Line({
                    stroke: '#df4b26',
                    strokeWidth: 50,
                    globalCompositeOperation: 'destination-out',
                    points: [pos.x, pos.y],
                });
            }
            layer.add(lastLine);
        }
    });

    stage.on('mouseup touchend', function () {
        isPaint = false;
    });

    // and core function - drawing
    stage.on('mousemove touchmove', function () {
        if (!isPaint) {
            return;
        }
        const pos = stage.getPointerPosition();
        var newPoints = lastLine.points().concat([pos.x, pos.y]);
        lastLine.points(newPoints);
        layer.batchDraw();
    });

}



socket.on('usuarios', function (data) {
    console.log(data);
    var listusers = document.getElementById("lista-usuarios");
    listusers.innerHTML = '';
    for (var x = 0; x < data.length; x++) {
        var node = document.createElement("LI");
        node.classList.add("list-group-item");
        var textnode = document.createTextNode(data[x].usuario);
        node.appendChild(textnode);
        listusers.appendChild(node);
    }
});

socket.on('tablero', function (data) {
    switch (data.accion) {
        case 'crearcuadrado':
            crearcuadrado(data.shape, false);
            break;
        case 'actualizarcuadrado':
            actualizarcuadrado(data.shape, false);
            break;
        case 'crearcirculo':
            crearcircle(data.shape, false);
            break;
        case 'actualizarcircle':
            actualizarcircle(data.shape, false);
            break;
        case 'crearcuadrotexto':
            crearcuadrotexto(data.group,data.caja,data.simpleText, false);
            break;
        case 'actualizarcuadrotexto':
            actualizarcuadrotexto(data.group,data.caja,data.simpleText, false);
            break;

    }
});























var crearcuadrotexto = function (_group, _caja, _simpleText, emit) {
    var group = new Konva.Group(_group);
    console.log("condicion cuadro", _idcreado !== group.id());
    if (_idcreado !== group.id()) { 
        var simpleText = new Konva.Text(_simpleText); 
        var caja = new Konva.Rect(_caja);

        group.add(caja);
        group.add(simpleText);

        layer.add(group);
        group.on('mousedown', function () {
            layer.add(tr);
            tr.nodes([this]);
            elementoseleccionado = this;
        });
        group.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });

        group.on('dragstart', function () {
            this.moveToTop();
            tr.moveToTop();
            layer.draw();
        });

        group.on('dragend', function () {
            actualizarcuadrotexto(group.attrs,caja.attrs,simpleText.attrs,true);
        });

        group.on('dblclick dbltap', function () {
            $("#modalTexto").modal("show");
            document.getElementById("inputTexto").value = simpleText.attrs.text;
            document.getElementById("inputColorTexto").value = caja.attrs.fill;
            btnTextGuardar.style.display = "none";
            btnTextEditar.style.display = "block";
        });
        layer.draw();
        console.log("EMITIR", emit);
        if (!emit) { return; }

        socket.emit('tablero', {
            accion: "crearcuadrotexto",
            group: group.attrs,
            caja: caja.attrs,
            simpleText: simpleText.attrs,
        });
    }
}
var actualizarcuadrotexto = function(_group,_caja,_simpleText,emit)
{
    var _groupT =new  Konva.Group(_group);
    var group = stage.find('#' + _groupT.id())[0];

    var _RectT = new Konva.Rect(_caja);
    var _TextT = new Konva.Text(_simpleText);

    var Rect = group.getChildren(function (node) {
        return node.getClassName() === 'Rect';
    });

    var Text = group.getChildren(function (node) {
        return node.getClassName() === 'Text';
    });
    Rect[0].fill(_RectT.fill());
    Text[0].text(_TextT.text());
    Rect[0].width(_TextT.width() + 16);
    Rect[0].height(_TextT.width() + 16);
    Text[0].y((_RectT.y() + _RectT.height() / 2) - 8);
 
    group.scaleX(_groupT.scaleX());
    group.scaleY(_groupT.scaleY());

    group.x(_groupT.x());
    group.y(_groupT.y());

    layer.draw();

    if(!emit){return;}
    socket.emit("tablero", {
        accion: "actualizarcuadrotexto",
        group: group.attrs,
        caja: Rect[0].attrs,
        simpleText: Text[0].attrs,
    });
}
var cargarsubopciones = () => {
    var btnTextGuardar = document.getElementById("btnTextGuardar");
    var btnTextEditar = document.getElementById("btnTextEditar");

    btnTextGuardar.addEventListener("click", () => {
        var id = generarid();
        var group = new Konva.Group({
            x: 0,
            y: 0,
            draggable: true,
            id: id
        });

        var intexto = document.getElementById("inputTexto").value;
        var inputColorTexto = document.getElementById("inputColorTexto").value;

        var simpleText = new Konva.Text({
            x: stage.width() / 2,
            y: 0,
            text: intexto,
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: 'black',
        });

        var caja = new Konva.Rect({
            x: (stage.width() / 2) - 8,
            y: 0,
            width: simpleText.width() + 16,
            height: simpleText.width() + 16,
            fill: inputColorTexto,
            stroke: '#A000',
            strokeWidth: 0,
        });
        simpleText.y((caja.y() + caja.height() / 2) - 8);
        crearcuadrotexto(group.attrs, caja.attrs, simpleText.attrs, true);
        _idcreado = id;
        $("#modalTexto").modal("hide");
    });

    btnTextEditar.addEventListener("click", () => {
        console.log(elementoseleccionado)
        var intexto = document.getElementById("inputTexto").value;
        var inputColorTexto = document.getElementById("inputColorTexto").value;

        var Rect = elementoseleccionado.getChildren(function (node) {
            return node.getClassName() === 'Rect';
        });

        var Text = elementoseleccionado.getChildren(function (node) {
            return node.getClassName() === 'Text';
        });

        Rect[0].fill(inputColorTexto);
        Text[0].text(intexto);
        Rect[0].width(Text[0].width() + 16);
        Rect[0].height(Text[0].width() + 16);
        Text[0].y((Rect[0].y() + Rect[0].height() / 2) - 8);
        layer.draw();
        $("#modalTexto").modal("hide");
    });
} 
var sessioniniciada = false;
var iniciarchat = () => {

    var trabajo = document.getElementById('trabajo');

    trabajo.style.display = "none";
    if (!sessioniniciada) {
        trabajo.style.display = "block";
        var user = document.getElementById('inuser').value;
        socket.emit('usuarios', {
            usuario: user
        });
        $("#login").modal("hide");
    }

    iniciarpantalla();
    cargaropciones();
    cargarsubopciones();
    cargarcomplementosopciones();
};

var cargaropcionesdisable = () => {
    layer.on('click', null, function (evt) {
        tr.remove();
        layer.draw();
    });
}
var generarid = () => {
    var code = uuid.v1();
    return code.toString().replace(/-/g, '');
}

var crearcircle = (data, emit) => {
    var circle = new Konva.Circle(data);

    if (_idcreado !== circle.id()) {
        layer.add(circle);
        circle.on('mousedown', function () {
            layer.add(tr);
            tr.nodes([this]);
            elementoseleccionado = this;
        });
        circle.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        circle.on('dragstart', function () {
            this.moveToTop();
            tr.moveToTop();
            layer.draw();
        });
        circle.on('dragend', function () {
            //console.log("elementoseleccionado", elementoseleccionado);
            var shape = stage.find('#' + circle.id())[0];
            //console.log("shape", shape);
            actualizarcircle(shape.attrs, true);
        });

        layer.draw();
        if (!emit) { return; }
        socket.emit('tablero', {
            accion: "crearcirculo",
            shape: circle.attrs
        });
    }
}

var actualizarcircle = (data, emit) => {
    var rect = new Konva.Rect(data);
    var shape = stage.find('#' + rect.id())[0];
    shape.x(rect.x());
    shape.y(rect.y());
    shape.scaleX(rect.scaleX());
    shape.scaleY(rect.scaleY());
    shape.fill(rect.fill());
    shape.strokeWidth(rect.strokeWidth());
    shape.moveToTop();
    tr.moveToTop();
    layer.draw();
    if (!emit) { return }
    socket.emit('tablero', {
        accion: "actualizarcircle",
        shape: rect.attrs
    });
}

var actualizarcuadrado = (data, emit) => {
    var rect = new Konva.Rect(data);
    var shape = stage.find('#' + rect.id())[0];
    shape.x(rect.x());
    shape.y(rect.y());
    shape.scaleX(rect.scaleX());
    shape.scaleY(rect.scaleY());
    shape.fill(rect.fill());
    shape.strokeWidth(rect.strokeWidth());
    shape.moveToTop();
    tr.moveToTop();
    layer.draw();
    if (!emit) { return }
    socket.emit('tablero', {
        accion: "actualizarcuadrado",
        shape: rect.attrs
    });
}
var crearcuadrado = (data, emit) => {
    var rect = new Konva.Rect(data);
    if (_idcreado !== rect.id()) {
        layer.add(rect);

        rect.on('mousedown', function () {
            layer.add(tr);
            tr.nodes([this]);
            elementoseleccionado = this;
            console.log(rect.id());
        });
        rect.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });

        rect.on('dragstart', function () {
            this.moveToTop();
            tr.moveToTop();
            layer.draw();
        });

        rect.on('dragend', function () {
            console.log("elementoseleccionado", elementoseleccionado);
            var shape = stage.find('#' + rect.id())[0];
            console.log("shape", shape);
            actualizarcuadrado(shape.attrs, true);
        });

        layer.draw();
        if (!emit) { return; }

        //console.log("emitir", emit);
        socket.emit('tablero', {
            accion: "crearcuadrado",
            shape: rect.attrs
        });
    }
}
var _idcreado = 'XXXX';
var cargaropciones = () => {

    var opciones = document.getElementById("lista-opciones").getElementsByTagName('li');
    opciones[0].addEventListener("click", () => {//Clic
        tr.remove();
        layer.draw();
        activolapicero = false;
    });
    opciones[1].addEventListener("click", () => {//Rectangulo
        activolapicero = false;
        var id = generarid();
        var rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            fill: '#ffff',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true,
            id: id
        });
        crearcuadrado(rect.attrs, true);
        _idcreado = id;
    });

    opciones[2].addEventListener("click", () => {
        activolapicero = false;
        var id = generarid();
        var circle = new Konva.Circle({
            x: 150,
            y: 150,
            radius: 70,
            fill: '#ffff',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true,
            id: id
        });
        crearcircle(circle.attrs, true);
        _idcreado = id;
    });

    opciones[3].addEventListener("click", function () {
        activolapicero = true;
        mode = 'brush';
    });
    opciones[4].addEventListener("click", function () {
        activolapicero = true;
        mode = 'eraser';
    });

    opciones[6].addEventListener("click", function () {//li Texto
        activolapicero = false;
        $("#modalTexto").modal("show");
        document.getElementById("btnTextGuardar").style.display = "block";
        document.getElementById("btnTextEditar").style.display = "none";
    });


    opciones[7].addEventListener("click", function () {//li Eliminar
        elementoseleccionado.destroy();
        tr.remove();
        layer.draw();
        if (!_propiedadesbol) {
            propiedades.style.display = "inline-block";
            _propiedadesbol = true;
        }
        //remove(elementoseleccionado);
        layer.draw()

    });
}

var iniciarpantalla = () => {

    contenedor = document.getElementById("container");
    propiedades = document.getElementById("panel-propiedades");
    layer = new Konva.Layer();
    //console.log(layer)
    // Creación de el Panel Principal
    stage = new Konva.Stage({
        container: 'container',   // |id| de contenedor <div> 
        width: contenedor.clientWidth,
        height: contenedor.clientHeight
    });

    stage.add(layer);//panel principal
    layer.draw();//pintar layer
}