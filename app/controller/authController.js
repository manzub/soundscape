import bcrypt from "bcryptjs";
import db from "../models/index.js";


const User = db.user;

export const loginUser = async function (req, res) {
  const emailusername = String(req.body.emailusername).match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  User.findOne({ [emailusername ? 'email' : 'username']: req.body.emailusername }).exec().then(function (user) {
    // user not found
    if (!user) return res.send({ status: 0, message: 'User Not Found' });
    // used ontap login
    if (req.body.usedOneTap) {
      const { email, username, _id: userid } = user;
      return res.send({ status: 1, message: 'Login Successful', data: { email, username, userid } });
    } else {
      // password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.send({ status: 0, message: 'Invalid password' })
      // proceed signin
      const { email, username, profile, _id: userid } = user;
      return res.send({ status: 1, message: 'Login Successful', data: { email, username, profile, userid } })
    }
  }).catch(error => res.send({ status: 0, message: error.message }))
}

export const verifyOAuth = async function (req, res) {
  try {
    var googleOAthClient = oAuthClient;
    await googleOAthClient.verifyIdToken({
      idToken: req.body.token,
      audience: req.options.clientId,
    });
    const payload = ticket.getPayload();

    res.send({ status: 1, message: 'verified', payload })
  } catch (error) {
    res.send({ status: 0, message: error.message });
  }
}

export const createNewUser = async function (req, res) {
  let salt = Math.floor(Math.random() * 10);
  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  })

  user.save().then(user => {
    res.send({ status: 1, message: "Registration Successfull" })
  }).catch((err) => res.send({ status: 0, message: 'Could not create new user' }));
}