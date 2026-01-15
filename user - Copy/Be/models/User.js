const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,

  nik: {
    type: String,
    unique: true,   
    sparse: true    
  },

  email: {
    type: String,
    unique: true,
    sparse: true
  },

  password: String,

  role: {
    type: String,
    enum: ["masyarakat", "admin", "dinas"],
    required: true
  },

  statusUser: {
    type: String,
    default: "aktif"
  },

  nip: {
    type: String,
    unique: true,
    sparse: true
  }
});

module.exports = mongoose.model("User", UserSchema);
