/* cada Js actua como si fuera una clase y para poder ser 
instanciada debe ser permitir su exportación con
 module.exports = router
 que comparte las rutas de los webservices a desarrollar */

//Imports
const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  //res.sendFile(path.join(__dirname,'index.html'))
  res.redirect("login");
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

router.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "registro.html"));
});

router.get("/principal", (req, res) => {
  console.log(typeof req.session.nombre == 'undefined');
  if (typeof req.session.nombre != 'undefined' || req.session.nombre != null) {
    res.sendFile(path.join(__dirname, "principal.html"));
  } else {
    res.redirect("login");
  }
});

router.get("/listapizarras", (req, res) => {
  console.log(req.session.nombre);

  if (typeof req.session.nombre != 'undefined' || req.session.nombre != null) {
    res.sendFile(path.join(__dirname, "listapizarras.html"));
  } else {
    res.redirect("login");
  }
});

router.get("/pizarra", (req, res) => {
  console.log(req.session.nombre);

  if (typeof req.session.nombre != 'undefined' || req.session.nombre != null) {
    res.sendFile(path.join(__dirname, "pizarra.html"));
  } else {
    res.redirect("login");
  }
});

//Exports
module.exports = router;
