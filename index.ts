import express, { Express} from "express";
import elements from './assets/elements.json';
import scientists from './assets/scientists.json';
import {Element,Discoverer} from './views/interfaces'

const elementsArray : Element[] = [];
for(let i = 0; i<elements.length;i++){
    elementsArray.push(elements[i])
}
const scientistsArray : Discoverer[] = [];
    for(let i = 0; i<scientists.length;i++){
        scientistsArray.push(scientists[i])
    }

const app = express();
app.set("port", 3000);
app.set("view engine", "ejs");
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.type('text/html');
    res.status(200);
    res.render('index', {elements:elementsArray})
})

app.get('/elements',(req,res) => {
res.type('text/html');
res.status(200);
res.render('elements', {elements:elementsArray, q:""})
})

app.get('/elements/:id', (req,res) => {
    const id = req.params.id;
    const element = elementsArray.find((element) => element.id === id);
    
    if(element){
        res.type('text/html');
        res.status(200);
        res.render('element', {element:element})
    }else{
        res.type('text/html');
        res.status(404);
        res.send("Element not found")
    }
})

app.get('/search',(req,res) => {
    let q : string = typeof req.query.q == 'string' ? req.query.q : "";
    let filteredElements : Element[] = elements.filter((element) => { 
        return element.name.toLowerCase().startsWith(q.toLowerCase())});
        res.type('text/html');
        res.status(200);
        res.render('elements', {elements:filteredElements, q:q})
})


app.get('/scientists',(req,res) => {
    
    res.type('text/html');
    res.status(200);
    res.render('scientists', {scientists:scientistsArray})
})

app.get('/scientists/:id', (req,res) => {
    const id = req.params.id;
    const scientist = scientistsArray.find((scientist) => scientist.id === id);
    
    if(scientist){
        res.type('text/html');
        res.status(200);
        res.render('scientist', {scientist:scientist})
    }else{
        res.type('text/html');
        res.status(404);
        res.send("Scientist not found")
    }
})

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});