const express = require("express");
const router = express.Router();
//const mysqlconecct = require("../database");

router.get("/getpizarras", (req, res) => {
  var _pizarras = [
    { codigo: 1, titulo: "1er Pizarra", img: "/assets/img/pizarra.png" },
    { codigo: 2, titulo: "2da Pizarra", img: "/assets/img/pizarra.png" },
    { codigo: 3, titulo: "3ra Pizarra", img: "/assets/img/pizarra.png" },
    { codigo: 4, titulo: "4ta Pizarra", img: "/assets/img/pizarra.png" },
    { codigo: 5, titulo: "5ta Pizarra", img: "/assets/img/pizarra.png" },
    { codigo: 6, titulo: "6ta Pizarra", img: "/assets/img/pizarra.png" }, 
  ];
  res.send(_pizarras);
  /*mysqlconecct.query("SELECT * FROM tbl_producto where producto_id = "+req.params.id, function (err, result) {
      respuesta.datos = { productos: result };
      res.send(respuesta);
    });*/
});

module.exports = router;
