// app define express application setup and imports the routes ,middleware and applies them globaly.


const express=require('express');
const app =express();//Initalizing the express application
const morgan=require('morgan');//a middleware for logging http requests and responses
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const authRoutes=require('./api/routes/auth-routes');
const itemRoutes=require('./api/routes/item-routes');
const cartRoutes=require('./api/routes/cart-routes');

//middleware for logging requests and parsing the body
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());


//CORS setup
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");

    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");



if(req.method==='OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,GET,PATCH');
    return res.status(200).json({});


}
next();

});

app.get('/', (req, res) => {
    res.send('Welcome to the e-commerce backend API!');
    });



app.use('/auth',authRoutes);
app.use('/items',itemRoutes);
app.use('/cart',cartRoutes);

const menuAssetsPath = path.resolve(__dirname, '../frontend/assets/images/menu');
app.use('/assets/images/menu', express.static(menuAssetsPath));



const userImageAssetsPath = path.resolve(__dirname, '../frontend/assets/images/user-image');
app.use('/assets/images/user-image', express.static(userImageAssetsPath));


app.use((req,res,next)=>{
    const error= new Error('Not found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });
    
});



module.exports=app;


