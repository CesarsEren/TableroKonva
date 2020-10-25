const express = require("express");
const router = express.Router();
const mysqlconecct = require("../database");

// default answer
var respuesta = {
  error: false,
  estado: 200,
  mensaje: "SUCCESS",
  datos: null,
};

router.get("/productos", (req, res) => {
  mysqlconecct.query("SELECT * FROM tbl_producto", function (err, result) {
    respuesta.datos = { productos: result };
	res.send(respuesta);
  });
});

router.get("/productos/:id", (req, res) => {
    mysqlconecct.query("SELECT * FROM tbl_producto where producto_id = "+req.params.id, function (err, result) {
      respuesta.datos = { productos: result };
      res.send(respuesta);
    });
});

  //query
router.post('/productos', function (req, res) {
	/*var nom = req.query.nom;
	var id = req.query.id;
    var precio = req.query.pre;*/
    const {id,nom,pre} = req.query; 
    console.log(nom, id, pre);
	mysqlconecct.connect(function (err) { 
		mysqlconecct.query("insert into Productos values(?,?,?)",[id,nom,pre], function (err, result) { 
			//respuesta.datos = result;
			console.log(result);
			respuesta.mensaje = "Registro ingresado";
			res.send(respuesta);
		});
	}); 
});

/*
router.post('/', function (req, res) {
	var nom = req.query.nom;
	var id = req.query.id;
    var precio = req.query.pre;
    console.log(nom, id, precio);
	mysqlconecct.connect(function (err) { 
		mysqlconecct.query("insert into Productos values(?,?,?)"), function (err, result) {
			//respuesta.datos = result;
			console.log(result);
			respuesta.mensaje = "Registro ingresado";
			res.send(respuesta);
		});
	}); 
});

//body json
router.post('/', function (req, res) {
	var nom = req.body.nom;
	var id = req.body.id;
    var precio = req.body.pre;
    console.log(nom, id, precio);
	mysqlconecct.connect(function (err) { 
		mysqlconecct.query("insert into Productos values(,'"+nom+"','"+precio+"')",[id,nom,precio]), function (err, result) { 
			//respuesta.datos = result;
			console.log(result);
			respuesta.mensaje = "Registro ingresado";
			res.send(respuesta);
		});
	}); 
});

*/
module.exports = router;