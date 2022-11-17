const { argon2 } = require('argon2');
const express = require('express');
const res = require('express/lib/response');
const app = express()
const mongoose = require('mongoose');
const { User } = require("./model/User");


app.use(express.urlencoded({
    extended: true
}))

/* app.get('/:v/:test', (req, res) => {
   console.log(req.params.test)
   console.log(req.params.v)
   console.log(req.headers.test)
  return res.status(200).json({
    error: false,
    message: "Hello world"
  })
})


app.post('/user', async(req, res) => {
    console.log(req.body.nom)
    console.log(req.body.prenom)
    console.log(req.body.email)

    const user = new User({
      nom: req.body.nom,
      email: req.body.email,
      prenom: req.body.prenom
    })
    console.log(user)

    await user.save()

    return res.status(200).json({
     error: false,
     message: "Hello world"
   })
 })
 
 app.get("/..../create", async(req,res)) */

 //évaluation

 // nom, prenom, email et mot de passe et confirmer mdp.

 app.post('/register', async(req, res) =>{
  const body = req.body;
  if (body.nom.length !=null || body.nom.length <= null )
  return res.status(401).json({
    error: true,
    message: "nom_incorrecte"
  })

  if (body.prenom.length !=null || body.prenom.length <= null )
  return res.status(401).json({
    error: true,
    message: "prenom__incorrecte"
})

if (body.email.length !=null || body.email.length <= null )
return res.status(401).json({
  error: true,
  message: "email_incorrecte"
})

if (body.password.length !=null || body.password.length <= null )
return res.status(401).json({
  error: true,
  message: "password_incorrecte"
})

if (body.password != body.password2 )
return res.status(401).json({
  error: true,
  message: "password_incorrecte"
})
})


const hash= await argon2.hash(body.password);


 app.post('/login', async(req, res) =>{

})

//route a utiliser via le token

app.get('/user', async(req, res) =>{

})

app.get('/users', async(req, res) =>{

})

app.put('/user', async(req, res) =>{

})
const start = async () => {
  try {
    mongoose.connect(
      "mongodb://0.0.0.0:27017/testdb" // ici c'est notre nom de bd // ce qu'on voit sur studio 3T c'est la collection testbd // j'ai mi meme nom de la base et de la collection
    ).catch(err => console.log(err.reason))
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();