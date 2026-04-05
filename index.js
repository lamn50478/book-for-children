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

const express=require('express')
const app=express()
var flash=require('express-flash')
const path = require('path');

const systemConfig=require('./config/system.js')
const routerAdmin=require('./routers/admin/index.route.js')
const router= require('./routers/client/route_index')
const methodOverride=require("method-override")
const bodyParser= require("body-parser");
const cookieParser=require("cookie-parser");
const expressSession=require("express-session");
const MongoStore=require("connect-mongo"); // [+] thêm
const moment=require("moment");
const database=require("./config/database");

//env set
require('dotenv').config();
const port=process.env.PORT || 3000;
//end set env

//flash
app.use(cookieParser("12345"));
app.use(expressSession({
    secret:"12345",          // [+] thêm
    resave:false,            // [+] thêm
    saveUninitialized:false, // [+] thêm
    store:MongoStore.create({ mongoUrl:process.env.MONGO_URL, ttl:60*60 }), // [+] thêm
    cookie:{maxAge:60000}
}));
app.use(flash());
//end flash

//tiny mce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//end tiny mce

//body-parse
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
//end body-parse

//method 
app.use(methodOverride("_method"));
//end method

app.locals.prefixAdmin=systemConfig.prefixAdmin;
app.locals.moment=moment;

database.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine","pug")

//route
router(app)
routerAdmin(app)

// [~] đổi app.listen -> chỉ chạy khi local, Vercel dùng module.exports
if(require.main === module){
    app.listen(port,()=>{
        console.log(`example listening on ${port}`);
    });
}
module.exports=app; // [+] thêm