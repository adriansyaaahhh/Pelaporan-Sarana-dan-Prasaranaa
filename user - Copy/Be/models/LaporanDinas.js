const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LaporanDinasSchema = new Schema(
  {
    laporanMasyarakatId: {
      type: Schema.Types.ObjectId,
      ref: "LaporanMasyarakat",
      required: true,
    },

    // penanda dinas (opsional)
    dinas: {
      type: String,
      default: "dinas",
    },

    //  FOTO BUKTI PENGERJAAN (FINAL)
    fotoBukti: {
      type: [String],
      default: [],
    },

    catatanPetugas: {
      type: String,
      default: "",
    },

    statusKerja: {
      type: String,
      enum: ["progress", "selesai"],
      default: "progress",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LaporanDinas", LaporanDinasSchema);
