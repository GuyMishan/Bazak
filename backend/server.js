const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require("path");
require("dotenv").config({ path: ".env" });


//app config
const app = express()

//middlware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Configure Mongo
const db = "mongodb://localhost/Bazak";

// Connect to Mongo with Mongoose
mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
)
    .then(() => console.log("Mongo connected"))
    .catch(err => console.log(err));

//user routes 
const authRoutes = require('./routes/authentication/auth');
const userRoutes = require('./routes/authentication/user');
app.use('/api', authRoutes)
app.use('/api', userRoutes)
//units routes
const gdodRoutes = require("./routes/units/gdod");
const hativaRoutes = require("./routes/units/hativa");
const ogdaRoutes = require("./routes/units/ogda");
const pikodRoutes = require("./routes/units/pikod");
app.use('/api',gdodRoutes)
app.use('/api',hativaRoutes)
app.use('/api',ogdaRoutes)
app.use('/api',pikodRoutes)
//cartypes routes
const magadalRoutes = require("./routes/cartypes/magadal");
const magadRoutes = require("./routes/cartypes/magad");
const mkabazRoutes = require("./routes/cartypes/mkabaz");
app.use('/api',magadalRoutes)
app.use('/api',magadRoutes)
app.use('/api',mkabazRoutes)
//general routes
const cardataRoutes = require("./routes/general/cardata");
app.use('/api',cardataRoutes)

if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('frontend/build'));
    app.get('*', (req,res)=>{
      res.sendFile(path.resolve(__dirname,'frontend', 'build', 'index.html'));
    });  
  }

  //listen
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
