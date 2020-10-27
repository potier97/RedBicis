var mongoose = require('mongoose'); const bcrypt = require("bcrypt");
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const mailer = require("../mailer/mailer");
var Reserva = require('./reserva');
var Token = require("./token");

var Schema = mongoose.Schema;

const saltRounds = 10;

const validateEmail = (email) => {
  const re = /[^@]+@[^\.]+\..+/g;
  return re.test(email);
};

var usuarioSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "El email es obligatorio"],
    lowercase: true,
    validate: [validateEmail, "El email es inválido"],
    match: [/[^@]+@[^\.]+\..+/g],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "La contraseña es obligatoria"],
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  verificado: { type: Boolean, default: false },
  googleId: String,
  facebookId: String
});

//plugin para la utilizacion de UNIQUE
usuarioSchema.plugin(uniqueValidator, { message: "El usuario {PATH} ya existe" });

//se ejecuta antes de hacer el evento save
usuarioSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

//compara la password para permitir el acceso
usuarioSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
  var reserva = new Reserva({ usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta });
  console.log(reserva);
  reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
  const token = new Token({
    _userId: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  const email_destination = this.email;
  token.save(function (err) {
    if (err) return console.log(err.message);

    const mailOptions = {
      from: "noreply@redbicicletas.com",
      to: email_destination,
      subject: "Verificación de cuenta",
      text: `Por favor, verifica tu cuenta haciendo clic en el siguiente link \n http://localhost:3000/token/confirmation/${token.token}`,
    };

    mailer.sendMail(mailOptions, function (err) {
      if (err) return console.log(err.message);
      console.log(`Correo de verificación enviado a: ${email_destination}`);
    });
  });
};

usuarioSchema.methods.resetPassword = function (cb) {
  const token = new Token({
    _userId: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  const email_destination = this.email;
  token.save(function (err) {
    if (err) return cb(err);

    const mailOptions = {
      from: "noreply@redbicicletas.com",
      to: email_destination,
      subject: "Reseteo de contraseña",
      text: `Para resetear su constraseña haz clic en el siguiente link \n
        http://localhost:3000/resetPassword/${token.token}`,
    };

    mailer.sendMail(mailOptions, function (err) {
      if (err) return cb(err);
      console.log(
        `Correo de reseteo de contraseña enviado a: ${email_destination}`
      );
    });
    cb(null);
  });
};

// usuarioSchema.statics.findOneOrCreateByGoogle = function findOrCreate(
//     condition,
//     callback
//     ) {
//     const self = this;

//     self.findOne(
//         {
//         $or: [
//             {
//             googleId: condition.id,
//             email: condition.emails[0].value
//             },
//         ],
//         },
//         (err, result) => {
//         if (result) { 
//             callback(err, result);
//         } else {
//             console.log("=====CONDITION=====");
//             console.log(condition);
//             let values = {};
//             values.googleId = condition.id;
//             values.email = condition.emails[0].value;
//             values.nombre = condition.displayName || "Sin Nombre";
//             values.verificado = true;
//             values.password = condition.id;
//             console.log("=====VALUES=====");
//             console.log(values);
//             self.create(values, (err, result) => {
//             if (err) console.log(err);
//             return callback(err, result);
//             });
//         }
//         }
//     );
// };

// usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, callback) {
//     const self = this;
//     console.log(condition);
//     self.findOne({
//       $or: [
//         { 'facebookId': condition.id }, { 'email': condition.emails[0].value }
//       ]
//     }, (err, result) => {
//       if (result) {
//         callback(err, result)
//       } else {
//         console.log('-------Condition--------');
//         console.log(condition);
//         let values = {};
//         values.facebookId = condition.id;
//         values.email = condition.emails[0].value;
//         values.nombre = condition.displayName || 'Sin Nombre';
//         values.verificado = true;
//         values.password = crypto.randomBytes(16).toString('hex');
//         console.log('-------Values------');
//         console.log(values)
//         self.create(values, (err, result) => {
//           if (err) console.log(err);
//           return callback(err, result)
//         })
//       }
//     }
//     )
//   }

module.exports = mongoose.model('Usuario', usuarioSchema);