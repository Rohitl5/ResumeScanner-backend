require('dotenv').config();

const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate')
const upload = require ('../middleware/upload');
const pdfParse = require('pdf-parse');
const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI =new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


router.post('/submitResume', upload.single('resume') ,async(req,res)=>{
     const { name, email, jobDescription } = req.body; 
     const fileBuffer = req.file?.buffer;

    //  print the data
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("JD:", jobDescription);

    //  read the resume 
    const resumeText = await pdfParse(fileBuffer);
    const textContent = resumeText.text;

    //  genai prompt

    const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});
    const prompt =` 
    Resume:${textContent}
    Job Description:${jobDescription}

    Analyse how well this resume fits the job description. 
   Return the output in plain JSON format only — no markdown, no explanation. Just JSON.

   { "matchScore":<score out of 10>,
     "summary":"summary of strengths and weaknesses( max 80 words, include both in one para )"
    }
    `;

    
    const result= await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    console.log(responseText);

    
    let jsonText = responseText.trim();
    jsonText = jsonText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    console.log("Cleaned response:", jsonText); // check this output in console

    
    const parsed = JSON.parse(jsonText);
    const matchScore = parsed.matchScore;
    const summary = parsed.summary;

 

   



//   save data in mongo

    Candidate.create({name, email, jobDescription,matchScore:matchScore, geminiSummary:summary})
    .then((candidate)=>{
        res.json({message:{
           "message": "Saved Succesfully",
           "resumedata":{
            "name":name,
            "email":email,
             "jobDescription":jobDescription,
             "matchScore":matchScore,
             "Summary":summary
           }
        }});
    })
    .catch((err)=>{
        console.error("you encoutered error:",err);
    });


});

module.exports = router;