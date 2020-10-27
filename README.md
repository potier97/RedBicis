<h1 align="center">
  <img src="public\images\14886.png"/><br/>
  <a href="https://bicired.herokuapp.com/">BICI RED</a>
</h1> 

Este es un proyecto para la creacion de una app Web del lado del servidor utilizando Node y Express, bajo la arquitectura MVC, se encuentra alojado en Heroku: [Bici Red](https://bicired.herokuapp.com/)




## Instalación

Utiliza [nmp](https://npm.com) para manejar las dependencias e instalarlas.

```bash
npm install
```



## Principal

```js
require('dotenv').config();
require('newrelic');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var mongoDBStore = require("connect-mongodb-session")(session);
var jwt = require("jsonwebtoken");
var passport = require("./config/passport"); 



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletaRouter = require('./routes/bicicletas')
var bicicletaAPIRouter = require('./routes/api/bicicletas')
var usuariosAPIRouter = require('./routes/api/usuarios')
var authAPIRouter = require("./routes/api/");
var tokenRouter = require("./routes/token");
var usuariosRouter = require("./routes/usuarios");

const Usuario = require("./models/usuario");
const Token = require("./models/token");



let store  
if (process.env.NODE_ENV === "development") {
  store = new session.MemoryStore();
} else {
  store = new mongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });
  store.on("error", function (error) {
    assert.ifError(error);
    assert.ok(false);
  });
}


var app = express();
app.set("secretKey", "sdcss9scss.dcsd12");
app.use(
  session({
    cookie: { maxAge: 240 * 60 * 60 * 1000 },
    store,
    saveUninitialized: true,
    resave: true,
    secret: "red_bicicletas!!!_1987",
  })
);



//Conexión a db
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/red_bicicletas';
//mongoose.connect(mongoDB, { useNewUrlParser: true});
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Conection error: '))




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/users', usersRouter);
app.use('/bicicletas', bicicletaRouter);
app.use('/api/bicicletas', bicicletaAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);



app.get("/login", function (req, res) {
  res.render("session/login");
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, usuario, info) {
    if (err) return next(err);
    if (!usuario) return res.render("session/login", { info });
    req.logIn(usuario, function (err) {
      if (err) next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/login");
});

app.get("/forgotPassword", function (req, res) {
  res.render("session/forgotPassword");
});

app.post("/forgotPassword", function (req, res, next) {
  const { email } = req.body; 
  Usuario.findOne({ email }, function (err, usuario) {
    if (!usuario)
      return res.render("session/forgotPassword", {
        info: { message: "Ese correo no está registrado" },
      });
    usuario.resetPassword(function (err) {
      if (err) return next(err);
      console.log("session/forgotPasswordMessage");
    });
    res.render("session/forgotPasswordMessage");
  });
});

app.get("/resetPassword/:token", function (req, res, next) {
  const { token } = req.params;
  Token.findOne({ token }, function (err, token) {
    if (!token)
      return res
        .status(400)
        .send({ type: "not-verified", msg: "Token inválido." });
    Usuario.findById(token._userId, function (err, usuario) {
      if (!usuario)
        return res
          .status(400)
          .send({ type: "not-verified", msg: "Token inválido." });
      res.render("session/resetPassword", { errors: {}, usuario });
    });
  });
});

app.post("/resetPassword", function (req, res) {
  const { email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    res.render("session/resetPassword", {
      errors: { confirm_password: "No coincide la contraseña" },
      usuario: new Usuario({ email }),
    });
    return;
  }
  Usuario.findOne({ email }, function (err, usuario) {
    usuario.password = password;
    usuario.save(function (err) {
      if (err) {
        res.render("session/resetPassword", {
          errors: err.errors,
          usuario: new Usuario({ email }),
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});


 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bicicletas', loggedIn, bicicletaRouter);
app.use('/api/bicicletas', validarUsuario, bicicletaAPIRouter);
app.use("/api/auth", authAPIRouter);
app.use('/api/usuarios',usuariosAPIRouter);
app.use("/usuarios", usuariosRouter);
app.use("/token", tokenRouter);


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read',
      'profile',
      'email'
    ],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/bicicletas",
    failureRedirect: "/error,",
  })
);

app.use('/privacy_policy', (req, res) => {
  res.sendFile('public/privacy_policy.html');
});

app.use('/google41ce4fbadbeb6963', (req, res) => {
  res.sendFile('public/google41ce4fbadbeb6963.html');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next) {
  if (req.user) next();
  else res.redirect("/login");
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (
    err,
    decoded
  ) {
    if (err) res.json({ status: "error", message: err.message, data: null });
    else {
      req.body.userId = decoded.id;
      console.log("jwt-verify", decoded);
      next();
    }
  });
}

module.exports = app;

```

## Contributing
Todas tus contribuciones son bienvenidas, puedes contactarme para cualquier clase de comentario, necesidad, ayuda o inquietud acerca del proyecto

## License
Este proyecto tiene la licencia [MIT](https://github.com/potier97/RedBicis/blob/master/LICENSE)