require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const resumeRoutes = require('./routes/resumeRoutes');
const mongoose = require('mongoose');

//  these are middle wares
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'],
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