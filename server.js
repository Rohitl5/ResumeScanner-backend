require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const resumeRoutes = require('./routes/resumeRoutes');
const mongoose = require('mongoose');

//  these are middle wares
// app.use(cors());
const allowedOrigins = [
  'http://localhost:3000',
  'https://resume-scanner-frontend-iota.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//  mongoose setup
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("mongoDb connected"))
.catch(err => console.log("Mongo error:", err))






// custom ping
app.get('', (req,res)=>{
    res.send("ping this from backend");
});

// other routes
app.use('/api', resumeRoutes);

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is runing on http://localhost:${PORT}`);
});