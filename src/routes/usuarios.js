/* cada Js actua como si fuera una clase y para poder ser 
instanciada debe ser permitir su exportación con
 module.exports = router
 que comparte las rutas de los webservices a desarrollar */

//Imports
const express = require("express");
const router = express.Router();
const mysqlconecct = require("../database");
router.post("/regusuario", (req, res) => {
  /*
    console.log(req.params);*/
  //console.log(req.query);
  //console.log(req.params);
  console.log(req.body);

  const { nombres, paterno, materno, correo, pass } = req.body;

  mysqlconecct.query(
    "insert into Usuario(nombres,apepaterno,apematerno,correo,password) values(?,?,?,?,?)",
    [nombres, paterno, materno, correo, pass],
    function (err, result) {
      //respuesta.datos = result;
      console.log("result", result);
      console.log("err", err);
      var mensaje = "Usuario Registrado";
      if (err == null) {
        res.redirect("login");
      } else {
        var error =
          err + "".includes("Duplicate") ? "El correo ya fue registrado" : err;
        res.redirect(
          "registro?correo=" +
            correo +
            "&nombres=" +
            nombres +
            "&paterno=" +
            paterno +
            "&materno=" +
            materno +
            "&error=" +
            error
        );
      }
    }
  );
});
router.post("/ingresar", (req, res) => {
  const { correo, pass } = req.body;
  mysqlconecct.query(
    "select * from Usuario where correo = ? and password = ? ",
    [correo, pass],
    function (err, result) {
      //console.log(result);
      if (err == null && result.length != 0) {
        req.session.nombre = result[0].nombres;
        res.redirect("principal");
      } else {
        res.redirect("login?correo=" + correo + "&error=Usuario no Encontrado");
      }
    }
  );
});

//Exports
module.exports = router;
