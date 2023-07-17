import mongoose from "mongoose";

// const profile = { preferences: { genres: [], favArtits: [] } }
const User = mongoose.model("User", mongoose.Schema({
  username: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profile: { type: Object, default: { 'preferences': { 'genres': [], 'favArtists': [] } } }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }));

export default User;