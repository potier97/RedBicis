var Usuario = require("../models/usuario");

module.exports = {
  list: function (req, res, next) {
    Usuario.find({}, (err, usuarios) => {
      res.render("usuarios/index", { usuarios });
    });
  },

  update_get: function (req, res, next) {
    Usuario.findById(req.params.id, function (err, usuario) {
      res.render("usuarios/update", { errors: {}, usuario });
    });
  },

  update: function (req, res, next) {
    const { nombre, email } = req.body;
    const update_values = { nombre };
    Usuario.findByIdAndUpdate(req.params.id, update_values, function (
      err,
      usuario
    ) {
      if (err) {
        res.render("usuarios/update", {
          errors: err.errors,
          usuario: new Usuario({ nombre, email }),
        });
      } else {
        res.redirect("/usuarios");
        return;
      }
    });
  },

  create_get: function (req, res, next) {
    res.render("usuarios/create", { errors: {}, usuario: new Usuario() });
  },

  create: function (req, res, next) {
    const { nombre, password, confirm_password, email } = req.body;
    if (password !== confirm_password) {
      res.render("usuarios/create", {
        errors: { confirm_password: { message: "No coincide con el password ingresado" } },
        usuario: new Usuario({ nombre, email }),
      });
      return;
    }
    Usuario.create({ nombre, email, password }, function (err, usuario) {
      if (err) {
        res.render("usuarios/create", { errors: err.errors });
      } else {
        usuario.enviar_email_bienvenida();
        res.redirect("/usuarios");
      }
    });
  },
  delete: function (req, res, next) {
    Usuario.findByIdAndDelete(req.body.id, function (err) {
      if (err) next(err);
      else res.redirect("/usuarios");
    });
  },
};
