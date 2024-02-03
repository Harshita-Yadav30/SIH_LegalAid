import path from 'path';
import express from 'express';
import multer from 'multer';
import pdf from 'html-pdf';
import alert from 'alert-node';
import nodemailer from 'nodemailer';

const app = express();

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        return cb(null, "./uploads");
    },
    filename: function (req,file,cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({storage: storage});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.static(path.join(path.resolve(),"uploads")));
app.use(express.static(path.join(path.resolve(),"certificates")));

app.get("/", (req,res) => {
    return res.redirect("landing.html");
});

app.get("/dashboard.html", (req,res) => {
    return res.redirect("dashboard.html");
});

app.get("/fill_profile", (req,res) => {
    return res.render("fill_profile");
});

app.post('/dashboard.html', (req,res) => {
    const {mobile, password, name, email, phone, address, qualification, experience, bio, specialization, achievement, fees} = req.body;
    if (password == undefined){
        // UPDATE PROFILE OF PROFESSIONAL CODE
        res.redirect('dashboard.html');
    }
    else{
        //FETCH DATA FROM DATABASE TO VERIFY PROFESSIONAL EXISTS OR NOT
        if (mobile === 'abc' && password === 'abc'){
            return res.redirect('dashboard.html');
        }
        else{
            res.redirect("professional_login.html");
        }
    }
});

app.post("/fill_profile", upload.single("profile"), (req,res) => {
    return res.render("fill_profile",{f:req.file.filename});
});

app.get('/professional_description', (req,res)=>{
    return res.render('professional_description');
})

app.post('/', (req,res)=>{
    try{
        const {name, password, userType, mobile, email, address, city, state} = req.body;
        if (name == undefined){
            throw new Error({status:404, error:"Not create Account"});
        }
        // ADD USER TO DATABASE CODE
    }
    catch (err){
        const {mobile, password} = req.body;
        // CHECK WHETHER CLIENT EXISTS OR NOT BY FETCHING DATA FROM DATABASE
    }
    res.redirect("landing.html");
})

app.get("/certificate", (req,res)=>{
    var date = new Date();
    date = date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
    const name = 'Adv. Rajesh Sharma';
    const reg_date = '01-01-2016';

    res.render('certificate',{name:name, reg_date:reg_date, date:date}, (err,data)=>{
        if (err) return res.send(err);
        const fName = date+'-'+name+'.pdf';
        pdf.create(data,{format:'A4', header:{height:"50cm"}, footer:{height:"5cm"}}).toFile('./public/'+fName, (e,resp) => {
            if (e) return console.log(e);
            res.render('generate',{file:fName});
        })
    });
})

app.get('/advocate_search', (req,res)=>{
    //FETCH DETAILS OF TOP ADVOCATES FROM LEADERBOARD DATABASE
    return res.render('advocate_search', {names: ['Adv. Rajesh Sharma', 'Adv. Parth Jain','Sr. Adv. Paulami Singh', 'Sr. Adv. Jay Verma', 'Adv. Shruti Sen', 'Adv. Grace Roy', 'Adv. Abhi Mukherjee', 'Sr. Adv. Nitin Roy Singh'], education: [], id: [1,2,3,4,5,6,7,8]});
})

app.get('/doc_writer_search', (req,res)=>{
    //FETCH DETAILS OF TOP DOCUMENT WRITERS FROM LEADERBOARD DATABASE
    return res.render('doc_writer_search', {names: ['Adv. Rajesh Sharma', 'Adv. Parth Jain','Sr. Adv. Paulami Singh', 'Sr. Adv. Jay Verma', 'Adv. Shruti Sen', 'Adv. Grace Roy', 'Adv. Abhi Mukherjee', 'Sr. Adv. Nitin Roy Singh'], education: [], id: [1,2,3,4,5,6,7,8]});
})

app.get('/arbitrator_search', (req,res)=>{
    //FETCH DETAILS OF TOP ARBITRATORS FROM LEADERBOARD DATABASE
    return res.render('arbitrator_search', {names: ['Adv. Rajesh Sharma', 'Adv. Parth Jain','Sr. Adv. Paulami Singh', 'Sr. Adv. Jay Verma', 'Adv. Shruti Sen', 'Adv. Grace Roy', 'Adv. Abhi Mukherjee', 'Sr. Adv. Nitin Roy Singh'], education: [], id: [1,2,3,4,5,6,7,8]});
})

app.get('/notary_search', (req,res)=>{
    //FETCH DETAILS OF TOP NOTARIES FROM LEADERBOARD DATABASE
    return res.render('notary_search', {names: ['Adv. Rajesh Sharma', 'Adv. Parth Jain','Sr. Adv. Paulami Singh', 'Sr. Adv. Jay Verma', 'Adv. Shruti Sen', 'Adv. Grace Roy', 'Adv. Abhi Mukherjee', 'Sr. Adv. Nitin Roy Singh'], education: [], id: [1,2,3,4,5,6,7,8]});
})

app.post('/advocate_description', (req,res)=>{
    const val = req.body.card_number;
    console.log(val);
    //LOGIC FOR WHICH ADVOCATE HAS BEEN CHOSEN AND WHAT DATA IS TO BE DISPLAYED IN A JSON OBJECT, THEN PASS THE JSON OBJECT TO RENDER
    const values = {id: val, name: 'ABC', specialization: 'Xyz', city: 'Abc', about: 'abc', education: 'abc', experience: 'abc', certificate: 'abc'}
    return res.render('advocate_description', values);
})

app.post('/doc_writer_description', (req,res)=>{
    const val = req.body.card_number;
    console.log(val);
    //LOGIC FOR WHICH DOCUMENT WRITER HAS BEEN CHOSEN AND WHAT DATA IS TO BE DISPLAYED IN A JSON OBJECT, THEN PASS THE JSON OBJECT TO RENDER
    const values = {id: val, name: 'ABC', specialization: 'Xyz', city: 'Abc', about: 'abc', education: 'abc', experience: 'abc', certificate: 'abc'}
    return res.render('doc_writer_description', values);
})

app.post('/arbitrator_description', (req,res)=>{
    const val = req.body.card_number;
    console.log(val);
    //LOGIC FOR WHICH ARBITRATOR HAS BEEN CHOSEN AND WHAT DATA IS TO BE DISPLAYED IN A JSON OBJECT, THEN PASS THE JSON OBJECT TO RENDER
    const values = {id: val, name: 'ABC', specialization: 'Xyz', city: 'Abc', about: 'abc', education: 'abc', experience: 'abc', certificate: 'abc'}
    return res.render('arbitrator_description', values);
})

app.post('/notary_description', (req,res)=>{
    const val = req.body.card_number;
    console.log(val);
    //LOGIC FOR WHICH NOTARY HAS BEEN CHOSEN AND WHAT DATA IS TO BE DISPLAYED IN A JSON OBJECT, THEN PASS THE JSON OBJECT TO RENDER
    const values = {id: val, name: 'ABC', specialization: 'Xyz', city: 'Abc', about: 'abc', education: 'abc', experience: 'abc', certificate: 'abc'}
    return res.render('notary_description', values);
})

app.post('/professional_home', (req,res)=>{
    const id = req.body.id;
    console.log(id);

    //GET EMAIL OF PROFESSIONAL REQUESTED FROM THE DATABASE USING THE ID OBTAINED AND REPLACE THAT E-MAIL WITH THE E-MAIL GIVEN IN 'TO' OF MAILOPTIONS BELOW
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yadav.harshita22@vit.edu',
          pass: '12211430'
        }
      });
      
      var mailOptions = {
        from: 'yadav.harshita22@vit.edu',
        to: 'harshita3792@gmail.com',
        subject: 'Client Request',
        text: `Dear professional (ID: ${id}),

This e-mail is to notify you that a client has requested your service. You can look at the details of the client on your dashboard under Client Requests tab.
               
Thanks and regards,
Team LegalAid`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
    alert('Done');
    res.redirect('professional_home.html');
})

app.listen(5000, () => console.log("Server is running"))
