const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LaporanMasyarakatSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  lokasi: {
    type: String,
    required: true,
  },
  
  judul: {
    type: String,
    required: true,
  },

  deskripsi: {
    type: String,
    required: true,
  },

  fotoLaporan: {
    type: [String],
    default: [],
  },

  statusLaporan: {
    type: String,
    enum: ["menunggu", "proses", "selesai", "ditolak"],
    default: "menunggu",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "LaporanMasyarakat",
  LaporanMasyarakatSchema
);
