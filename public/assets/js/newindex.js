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
var cargarsubopciones = () => {
    var btnTextGuardar = document.getElementById("btnTextGuardar");
    var btnTextEditar = document.getElementById("btnTextEditar");


    btnTextGuardar.addEventListener("click", () => {
        var group = new Konva.Group({
            x: 0,
            y: 0,
            draggable: true
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

        group.add(caja);
        group.add(simpleText);


        layer.add(group);
        layer.draw()
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
        group.on('dblclick dbltap', function () {
            $("#modalTexto").modal("show");
            document.getElementById("inputTexto").value = simpleText.attrs.text;
            document.getElementById("inputColorTexto").value = caja.attrs.fill;
            btnTextGuardar.style.display = "none";
            btnTextEditar.style.display = "block";
        });
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
    //layer.destroy();
    //stage.destroy();
    //contenedor = document.getElementById("container");
    //propiedades = document.getElementById("panel-propiedades");
    //layer = new Konva.Layer({ "attrs": {}, "className": "Layer", "children": [{ "attrs": { "width": 100, "height": 50, "fill": "#ffff", "stroke": "black", "strokeWidth": 1, "draggable": true }, "className": "Rect" }] });
    // Creación de el Panel Principal
    /*stage = new Konva.Stage({
        container: 'container',   // |id| de contenedor <div> 
        width: contenedor.clientWidth,
        height: contenedor.clientHeight
    });*/

    //stage.add(layer);//panel principal
    //layer.draw();//pintar layer 
});
/*
socket.on('tablero', function (data) {0.
    console.log("tablero", data.shape);
    var rect = new Konva.Rect(data.shape);
    layer.add(rect);
    rect.on('mousedown', function () {
        layer.add(tr);
        tr.nodes([this]);
        elementoseleccionado = this;
        if (!_propiedadesbol) {
            propiedades.style.display = "inline-block";
            _propiedadesbol = true;
        }
    });
    rect.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });

    rect.on('dragstart', function () {
        this.moveToTop();
        layer.draw();
    });

    rect.on('dragend', function () {
        
        console.log("MOVIMIENTO")
        socket.emit('tablero', {
            shape:rect.attrs
        });
        layer.draw();
    }); 
    layer.draw();
});
*/
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
/*
var cargaropcionespropiedad = () => {
    var aceptarcambios = document.getElementById('aceptarcambios');
    aceptarcambios.addEventListener("click", () => {
        var color = document.getElementById("color").value;
        elementoseleccionado.fill(color);
        layer.draw();
    });
}*/
var cargaropciones = () => {

    var opciones = document.getElementById("lista-opciones").getElementsByTagName('li');
    opciones[0].addEventListener("click", () => {//Clic
        tr.remove();
        layer.draw();
        activolapicero = false;
    });
    opciones[1].addEventListener("click", () => {//Rectangulo
        var rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            fill: '#ffff',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true
        });
        /*var rectatt = { "attrs": { "width": 100, "height": 50, "fill": "green", "stroke": "black", "strokeWidth": 1, "draggable": true }, "className": "Rect" };
        var rect = new Konva.Rect(rectatt);*/
        layer.add(rect);
        //console.log(layer);
        layer.draw();
        rect.on('mousedown', function () {
            layer.add(tr);
            tr.nodes([this]);
            elementoseleccionado = this;
        });
        rect.on('mousedown', function () {
            layer.add(tr);
            tr.nodes([this]);
            elementoseleccionado = this;
        });
        rect.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });

        rect.on('dragstart', function () {
            this.moveToTop();
            tr.moveToTop();
            layer.draw();
        });

        socket.emit('tablero', {
            layer: layer
        });
    });

    opciones[2].addEventListener("click", () => {
        var circle = new Konva.Circle({
            x: 150,
            y: 150,
            radius: 70,
            fill: '#ffff',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true
        });
        layer.add(circle);
        layer.draw()

        circle.on('mousedown', function () {
            layer.add(tr);
            tr.nodes([this]);
            elementoseleccionado = this;
        });

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
    //layer = new Konva.Layer({"attrs":{},"className":"Layer","children":[{"attrs":{"width":100,"height":50,"fill":"#ffff","stroke":"black","strokeWidth":1,"draggable":true},"className":"Rect"}]});
    layer = new Konva.Layer(
        {
            "attrs": {}, "className": "Layer", "children": [{
                "attrs": { "width": 100, "height": 50, "fill": "#ffff", "stroke": "black", "strokeWidth": 1, "draggable": true }, "className": "Rect"
            }]
        }
    );
    console.log(layer)
    // Creación de el Panel Principal
    stage = new Konva.Stage({
        container: 'container',   // |id| de contenedor <div> 
        width: contenedor.clientWidth,
        height: contenedor.clientHeight
    });

    stage.add(layer);//panel principal
    layer.draw();//pintar layer
}