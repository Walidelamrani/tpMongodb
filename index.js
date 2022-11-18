const argon2  = require('argon2');
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const { User } = require("./model/User");
const port = 3000;
const  checkJwt  = require("./middlewares/checkjwt");

var jwt = require('jsonwebtoken');

app.use(express.urlencoded({
    extended: true
}))

////////////////////// Login
app.post('/api/auth/login', async(req, res) =>{

  const body = req.body

  if (body.email.length <= 1)
return res.status(401).json({
  error: true,
  message: "l'email saisis est incorrecte"
})

if (body.password.length <= 3 )
return res.status(401).json({
  error: true,
  message: "Le Password saisis est incorrecte"
})

const user =await User.findOne({
  email: body.email
})

if (!user) {
  return res.status(401).json({
    error: true,
    message: "User inexistant , veuillez créer un compte"
  })
}

const password = await argon2.verify(user.password , body.password)

 if (!password)  {
  return res.status(401).json({
    error: true,
    message:" Password incorrecte"
  })
  }
  const token = await jwt.sign({ email: user.email },'mySecret');
    res.cookie("token", token, {
    httpOnly: true,
  })

res.status(200).json({
  user : {
     email : user.email,
     nom : user.nom,
     prenom : user.prenom,
     telephone : user.telephone
  },
  message : "Authentification réussie ! "
  })
})
 app.post('/api/auth/register', async(req, res) =>{
  const body = req.body;
  if (body.nom.length <= 1)
    return res.status(401).json({
    error: true,
    message: "veuillez remplir le champ 'Nom' "
  })

  if (body.prenom.length <= 1)
  return res.status(401).json({
    error: true,
    message: "Veuillez remplir le champ 'Prénom' "
})

if (body.email.length <= 1)
return res.status(401).json({
  error: true,
  message: "Veuillez remplir le champ 'Email'"
})

if (body.password.length <= 1 )
return res.status(401).json({
  error: true,
  message: "Veuillez remplir le champ 'Password'"
})

if (body.password != body.password2 )
return res.status(401).json({
  error: true,
  message: "Les Passwords ne sont pas identique"
})

if (body.password.length <= 3) {
  return res.status(401).json({
    error: true,
    message: "Votre Password est trop cours , veuillez saisir un password d'au moin 6 caracteres"
  })
}

const hash= await argon2.hash(body.password);

console.log(hash)

  const user = await new User({
    nom: body.nom,
    email: body.email,
    prenom: body.prenom,
    telephone: body.telephone,
    password: hash
  })
  console.log(user)

  await user.save()
  return res.status(200).json({
    error: false,
    user,
    hash
  })

})

///////////////// Profile
app.get('/api/user/profile',checkJwt ,async(req, res) =>{

  const user = await User.findOne({ email : res.locals.jwtPayload.email }) 

res.status(200).json({
  user : {
     email : user.email,
     nom : user.nom,
     prenom : user.prenom,
     telephone : user.telephone
  },
  message : "Voici le profile recherché ! "
})
})

///////////////////////////// Name and Prenom Edit

app.put("/api/user/edit", checkJwt , async (req, res) => {

const user = await User.findOne({ email : res.locals.jwtPayload.email }) ;
user.prenom = req.body.prenom || user.prenom;
user.nom = req.body.nom || user.nom;


await user.save();

 
res.status(200).json({
  user : {
     nom : user.nom,
     prenom : user.prenom,
  },
  message : "Informations modifiées avec succès ! "
})
 
})

///////////////////// Password Edit
app.put("/api/user/edit-password", checkJwt , async (req, res) => {
  const body = req.body;

  const password = await argon2.hash(body.password);

  const password2 = await argon2.hash(body.password2);

  const samePassword = await argon2.verify(password ,password2);

if (!samePassword) { 
    return res.status(401).json({
      error: true,
       message:" la confirmation du password est erronée"
})
} 
const user = await User.findOne({ email : res.locals.jwtPayload.email }) ;

user.password = password;

await user.save();

res.status(200).json({
  user : {
    password : user.password,
  },
  message : "Password Modifié avec succès ! "
})
 
})

////////////////// phone number edit

app.put("/api/user/edit-phone", checkJwt , async (req, res) => {

  const user = await User.findOne({ email : res.locals.jwtPayload.email }) ;

  user.telephone = req.body.telephone ;
  
  await user.save();
  
  res.status(200).json({
    user : {
       telephone : user.telephone
    },
    message : "Numéro telephone modifié avec succès ! "
  })
})

/////////////////// Email Edit

app.put("/api/user/edit-email", checkJwt , async (req, res) => {

  const user = await User.findOne({ email : res.locals.jwtPayload.email }) ;

  user.email = req.body.email ;
  
  await user.save();
  
  res.status(200).json({
    user : {
       email : user.email
    },
    message : "Votre email a été modifié avec succès ! "
  })
})

//////////////////// Connected user delete
app.delete("/api/user/delete", checkJwt ,async (req, res) => {

 await User.findOneAndRemove({ email : res.locals.jwtPayload.email }) ;

  return res.status(200).json({
    error: false,
    message: "user deleted"
    })
  })
//////////////////////// connexion 
const start = async () => {
  try {
    mongoose.connect(
      "mongodb://0.0.0.0:27017/testdb"
    ).catch(err => console.log(err.reason));
    app.listen(port, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();