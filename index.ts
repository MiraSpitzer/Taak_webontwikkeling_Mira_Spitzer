import express, { Express} from "express";
import elements from './assets/elements.json';
import scientists from './assets/scientists.json';
import {Element,Discoverer, User} from './views/interfaces'
import {secureMiddleware} from './views/middleware/secureMiddleware'
import bcrypt from "bcrypt";
import { login, checkDatabaseAndfillElements,checkDatabaseAndfillScientists, connect, discovererscollection, elementscollection, getDataById, search} from "./database";


const elementsArray : Promise<Element[]> = checkDatabaseAndfillElements();
const scientistsArray : Promise<Discoverer[]> = checkDatabaseAndfillScientists();
console.log(elementsArray);


const app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.type('text/html');
    res.status(200);
    res.render('index')
})

app.get('/elements',(req,res) => {
res.type('text/html');
res.status(200);
res.render('elements', {elements:elementsArray, q:""})
})

app.get('/elements/:id', (req,res) => {
    const id = req.params.id;
    const element = getDataById(id,elementscollection);
    
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
    let filteredElements: Promise<Element[]> = search(q,elementsArray);
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
    const scientist = getDataById(id,discovererscollection);
    
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


app.post('/elements/:id/update', (req,res) => {
    const id = req.params.id;
    const element = getDataById(id,elementscollection);
    const name = req.body.name;
    const type = req.body.type;
    const valence = req.body.valence;
    const discoveryDate = req.body.discoveryDate;
    
    async function updateElement() {
        await elementscollection.updateOne({ id: id }, { $set: {name: name, valenceElectrons: valence, type: type, discoveryDate: discoveryDate } })}
        updateElement();
        res.type('text/html');
        res.status(200);
        res.redirect('/elements/' + id)
    }
)

app.get('/login',(req,res) => {
    res.type('text/html');
    res.status(200);
    res.render('login')
})

app.post('/login', async (req,res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        let user: User = await login(email, password);
        req.session.user = user;
        req.session.message = { type: "success", message: "Login successful" };
        res.redirect("/")
    } catch (e: any) {
        req.session.message = { type: "error", message: e.message };
        res.redirect('/login');
    }
});

app.get("/logout", secureMiddleware, async (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/login");
    });
});

app.listen(app.get("port"), async() => {
    await connect();
    console.log("Server started on http://localhost:" + app.get('port'));
});