// const express=require('express')
// const app=express()
// var flash=require('express-flash')
// const path = require('path');


// const systemConfig=require('./config/system.js')

// const routerAdmin=require('./routers/admin/index.route.js')
// const router= require('./routers/client/route_index')
// const methodOverride=require("method-override")
// const bodyParser= require("body-parser");
// const cookieParser=require("cookie-parser");
// const expressSession=require("express-session");
// const moment=require("moment");

// const database=require("./config/database");
// //env set
// require('dotenv').config();
// const port=process.env.PORT || 3000;
// //end set env

// //flash
// app.use(cookieParser("12345"));
// app.use(expressSession({cookie : {maxAge:60000}}));
// app.use(flash());
// //end flash

// //tiny mce
// app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// //end tiny mce

// //body-parse
// app.use(bodyParser.urlencoded({extended:true}))
// app.use(express.json());
// //end body-parse

// //method 
// app.use(methodOverride("_method"));
// //end method
// app.locals.prefixAdmin=systemConfig.prefixAdmin;
// app.locals.moment=moment;
// database.connect();
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'views'));
// // app.set("views",`${__dirname}/views`)  //cm
// app.set("view engine","pug")
// // app.use(express.static(`${__dirname}/public`))

// //route
// router(app)
// routerAdmin(app)


// app.listen(port,()=>{
//     console.log(`example listening on ${port}`);
// })
// // module.exports=app
// // 


//---------------------------------------------
const express = require('express');
const app = express();
const path = require('path');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const moment = require('moment');

// ── Env ────────────────────────────────────────────────────
require('dotenv').config();
const port = process.env.PORT || 3000;

// ── Internal modules ───────────────────────────────────────
const systemConfig = require('./config/system.js');
const routerAdmin = require('./routers/admin/index.route.js');
const router = require('./routers/client/route_index');
const database = require('./config/database');

// ── Database ───────────────────────────────────────────────
database.connect().catch(err => {
  console.error('❌ DB connection failed:', err);
  process.exit(1);
});

// ── Cookie & Session ───────────────────────────────────────
app.use(cookieParser('12345'));
app.use(expressSession({
  secret: '12345',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 60 * 60,
  }),
  cookie: { maxAge: 60000 },
}));
app.use(flash());

// ── Body parser ────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ── Method override ────────────────────────────────────────
app.use(methodOverride('_method'));

// ── Static files ───────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// ── View engine ────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ── App locals ─────────────────────────────────────────────
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// ── Routes ─────────────────────────────────────────────────
router(app);
routerAdmin(app);

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('client/pages/errors/404.pug', {
    pageTitle: 'Không tìm thấy trang',
  });
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).send('Server error: ' + err.message);
});

// ── Start server ───────────────────────────────────────────
app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});

module.exports = app;
