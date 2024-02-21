const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {executeQuery} = require('./db');
const app = express();
// app.use(cors());

app.use(express.json())
app.use(cors());
app.get('/employees', async(req, res)=>{
    // const {start}= req.params;
    try{
        // console.log(start);
        let query = `Select * from emp;`;
        // if(start!=='undefined' || start!==''){query +=` and LOWER(employeeName) LIKE LOWER('%${start}%')`;}
        console.log(query);
        const response = await executeQuery(query);
        console.log(response);
        res.status(200).send(response);
    }catch(error){
        res.status(500).send({message: "not suck"});
    }
});

app.get('/employees/:start', async(req, res)=>{
    const {start}= req.params;
    try{
        console.log(start);
        let query = `Select * from emp `;
        if(start!=='undefined' || start!==''){query +=` where LOWER(employeeName) LIKE LOWER('%${start}%') order by id ;`;}
        console.log(query);
        const response = await executeQuery(query);
        console.log(response);
        res.status(200).send(response);
    }catch(error){
        res.status(500).send({message: "not suck"});
    }
});
app.post('/add_employee',async(req, res) =>{
    console.log(req.body);
    const {employeeName, employeeId, department, dob, gender, designation, salary} = req.body;
    try {
        const query = `INSERT INTO emp(employeeName, employeeId, department, dob, gender, designation, salary) VALUE("${employeeName}", "${employeeId}", "${department}", "${dob}", "${gender}", "${designation}", "${salary}");`;
        console.log(query);
        const  result = await executeQuery(query);
        // console.log(result);
        console.log("result",result.insertId);
        res.status(200).json({message: "added succesful"});
    } catch (error) {
        res.status(500).send({message: "not successful"});
    }
});

app.post('/delete_employee', async(req, res) => {
    console.log(req.body);
    const {ids} = req.body;
    try {
        for(let i of ids){
            const response = await executeQuery(`delete from emp where id=${i}`);
            console.log(i, response);
        }
        res.status(200).json({message: "success"});
    } catch (error) {
        res.status(500).json({message: "Not Authenticated"});
    }

});

app.post('/update_employee/:id', async(req, res)=>{
    const {employeeName, employeeId, department, dob, gender, designation, salary} = req.body;
    const id = req.params.id;
    console.log(id);
    try {
        const response = await executeQuery(`UPDATE emp SET employeeName="${employeeName}", employeeId="${employeeId}", department="${department}", dob="${dob}", gender="${gender}", designation="${designation}", salary="${salary}" where id=${id}`);
        console.log(response);
        res.status(200).send({message: "succesful"});
    } catch (error) {
        res.status(500).send({message: error});
    }
})


const port = process.env.PORT || 5000;
app.listen(port, console.log("listening on port:", port));
