const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {executeQuery} = require('./db');
const app = express();
// app.use(cors());

app.use(express.json())
app.use(cors());

app.post('/login', async(req, res)=>{
    const { user, pass, role } = req.body;
    console.log(req.body);
    try{
        let query = "";
        if(role === "admin"){
            query = `Select * from users where username="${user}" AND pass_word="${pass}" LIMIT 1`;
        }else if(role==="user" && pass==="change_me"){
            query = `SELECT id, employeeName as username from emp where employeeId="${user}";`;
        }else{
            res.status(500).send("User Not found || Incorect password");
            return;
        }
        const resp = await executeQuery(query);
        res.status(200).json(resp);
    }catch(err){
        console.log(err);
        res.status(500).send("Internal server eeror");
    }
});


app.post("/add_report", async(req, res)=>{
    const {emp_id, issue, public} = req.body;
    const query = `INSERT INTO report(emp_id, issue, public) value(${emp_id}, "${issue}", "${public}");`;
    const resp = await executeQuery(query);
    res.status(200).send("Success0");
})

app.post('/del_reports', async(req, res)=> {
    const {id} = req.body;
    await executeQuery(`DELETE FROM report where id=${id}`);
    res.status(200).send("Success");
});

app.post('/add_task', async(req, res)=>{
    try {
        const {emp_id, title} = req.body;
        const query = `INSERT INTO tasks(title, stats, emp_id) Values("${title}", "pending", "${emp_id}");`;
        const result = await executeQuery(query);
        res.status(200).send("success");
    } catch (error) {
        console.log(error);
        res.status(500).send("failed");
    }
});

app.get("/get_tasks/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        if(!Number(id)) {
            throw "Invalid user ID";
        } else {
            const query = `select * from tasks where emp_id = ${id}`;
            let data = await executeQuery(query);
            res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error");
    }
});

app.post('/update_task', async(req, res)=>{
    const {t_id, stats} = req.body;
    console.log(req.body);
    const query = `UPDATE tasks SET stats="${stats}" WHERE id=${t_id};`
    const resp = await executeQuery(query);
    console.log(resp);
    res.status(200).send('Task updated');
});
app.get('/get_all_tasks', async(req, res)=>{
    const data = await executeQuery('SELECT t.*, e.employeeName as e_user, e.employeeId as e_id FROM tasks as t LEFT JOIN emp as e ON e.id = t.emp_id');
    console.log("gett_all_tasks" , data);
    res.status(200).json(data);
});
app.post('/get_reports', async(req, res)=>{
    // console.log(req);
    const resp = await executeQuery("SELECT r.*, e.employeeName as username FROM report as r LEFT JOIN emp as e ON r.emp_id = e.id;");
    console.log(resp);
    res.status(200).json(resp);
})


app.get('/employees', async(req, res)=>{
    // const {start}= req.params;
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    try{
        // console.log(start);
        let query = `Select * from emp  LIMIT ${startIndex}, ${pageSize};`;
        // if(start!=='undefined' || start!==''){query +=` and LOWER(employeeName) LIKE LOWER('%${start}%')`;}
        console.log(query);
        const response = await executeQuery(query);
        // const resp2 = await executeQuery(q2);
        // console.log(response);
        res.status(200).send(response);
    }catch(error){
        res.status(500).send({message: "not suck"});
    }
});

app.get('/tot_emp', async(req, res)=>{
    try{
        console.log("tot_emp");
        const result=await executeQuery('SELECT count(*) as total from emp');
        console.log("tot_emp" + " "+ result[0].total + " " + "result");
        if(result.length===0) throw new Error('No data found!');
        else res.status(200).json({tot: result[0].total});
    }catch(er){
        console.log(er);
        res.status(500);
    }
});

app.get('/tot_emp/:start', async(req, res)=>{
    try{
        const {start} = req.params;
        console.log(start);
        let query = `Select COUNT(*) as total from emp `;
        if(start!=='undefined' || start!==''){query +=` where LOWER(employeeName) LIKE LOWER('%${start}%') OR LOWER(employeeId) LIKE LOWER('%${start}%') OR LOWER(department) LIKE LOWER('%${start}%') order by id`;}
        const result=await executeQuery(query);
        console.log("tot_emp" + result[0].total + " " + "result");
        if(result.length===0) throw new Error('No data found!');
        else res.status(200).json({tot: result[0].total});
    }catch(er){
        console.log(er);
        res.status(500);
    }
})

app.get('/employees/:start', async(req, res)=>{
    const {start}= req.params;
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;

    try{
        console.log(start);
        let query = `Select * from emp `;
        if(start!=='undefined' || start!==''){query +=` where LOWER(employeeName) LIKE LOWER('%${start}%') OR LOWER(employeeId) LIKE LOWER('%${start}%') OR LOWER(department) LIKE LOWER('%${start}%') order by id`;}
        query += ` LIMIT ${startIndex}, ${pageSize};`
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
