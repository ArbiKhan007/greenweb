const fs = require('fs');
var arr = [];

var file = fs.readFileSync('data.json');
file = JSON.parse(file);

var arrFile = fs.readFileSync('category.json');
arrFile = JSON.parse(arrFile);

file.forEach(book => {
    book.categories.forEach(cat => {
        cat = toString(cat);
        arr.push(cat);
        fs.writeFile('category.json',arr ,(err)=> console.log(err));
    });
});