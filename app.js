const bodyParser = require('body-parser');
const express = require('express');
const fs = require("fs");
const app = express();
const exphbs = require("express-handlebars");

const port = 3000;

//reading main json data and parsing it
var file=fs.readFileSync('data.json');
file = JSON.parse(file);

//for serving up static files through express and urlencoded for body parsing
app.use('/static', express.static('./static/'));
var urlencoded = bodyParser.urlencoded({extended: false});

//for template
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.get('/hbs', (req, res) => {
    res.render('home');
});


//main GET request for sending app file
app.get('/', (req,res) => {
    res.sendFile(__dirname + "/" + "app.html");
});

app.get('/add.html', (req,res) => {
    res.sendFile(__dirname + "/" + "add.html");
});

app.get('/delete.html', (req,res) => {
    res.sendFile(__dirname + "/" + "delete.html");
}); 

app.post('/add', urlencoded, (req,res) =>{
    var item = req.body.item;
    var item_val = req.body.item_val;
    //added item into lowercase
    item = item.toLowerCase();
    file[item] = Number(item_val);

    file = JSON.stringify(file, null, 2);

    fs.writeFile('data.json', file, (err)=>{console.log(err);});
    res.send("Added "+ item + " with value "+ item_val);    
});

app.get('/search',urlencoded, function(req, res) {
    // Prepare output in JSON format
    var id = req.query.search;

    id = Number(id);
    console.log(id);
    file[id]._id = id;

    let book =  {   
                    "all": file[id],
                    "name": file[id].title,
                    "author": file[id].authors,
                };
    if(book != undefined){
        res.render('home', book.all);
    }else{
        res.send("Not Available in Database");
    }
});

app.post('/category',urlencoded, function(req, res) {
    var cat = req.body.category;
    console.log(cat);
    let bookarr = [];
    
    function catSearch(cat){
        file.forEach(book => {
            book.categories.forEach(category => {
                if(category == cat){
                    bookarr.push(book);
                }
            })
        });

        res.send(bookarr);
    }
    catSearch(cat);
});

app.post('/year',urlencoded, (req,res) => {
    var year = req.body.year;
    let bookarr = []; 

    function yearSearch(year){
        file.forEach(book => {
            if(book.publishedDate){
                if(book.publishedDate.$date.includes(year)){
                    bookarr.push(book);
                }
                
            }
        });

        res.send(bookarr);
    }

    yearSearch(year);
});

app.listen(port,() => {
    console.log(`Running the express app at http://localhost:${port}`);
});
