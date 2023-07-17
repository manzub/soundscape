import db from "../models/index.js";

const User = db.user;

export const getProfile = async function (req, res) {
  User.findOne({ email: req.params.email }).exec().then(function (user) {
    if(!user) res.send({ status: 0, message: 'User not found' })

    res.send({ status: 1, message: 'Profile found', data: user.profile })
  })
}

export const addToFavoriteGenres = async function (req, res) {
  User.findOne({ email: req.body.email }).exec().then(function (user) {
    if (user) {
      let profile = user.profile
      const genres = user.profile.preferences.genres;
      profile.preferences.genres = [...genres, req.body.genre];
      User.findOneAndUpdate({ email: req.body.email }, { profile: profile }, { returnOriginal: false }).exec().then(function (err, doc) {
        res.send({ status: 1, message: 'New genre added' })
      })
    } else res.send({ status: 0, message: 'User not found' });
  }).catch(error => res.send({ status: 0, message: error.message }))
}