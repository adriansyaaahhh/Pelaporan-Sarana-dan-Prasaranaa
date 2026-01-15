const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// MODELS
const User = require("./models/User");
const LaporanMasyarakat = require("./models/LaporanMasyarakat");
const LaporanDinas = require("./models/LaporanDinas");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


const JWT_SECRET = "laporan-rahasia";

/* =========================
   MONGODB
========================= */
mongoose
  .connect(
    "mongodb+srv://adhitiaibnu:adhit123@cluster0.yktnneh.mongodb.net/laporan_db"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* =========================
   STATIC
========================= */
app.use("/uploads", express.static("uploads"));

/* =========================
   MULTER
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const name =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, name);
  },
});
const upload = multer({ storage });

/* =========================
   JWT MIDDLEWARE
========================= */
const auth = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    const token = header.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Akses ditolak" });
      }

      next();
    } catch {
      return res.status(401).json({ message: "Token tidak valid" });
    }
  };
};

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Backend hidup + JWT OK");
});

/* =================================================
   AUTH (LOGIN MULTI IDENTIFIER)
================================================= */
app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    let user;

    if (role === "masyarakat") {
      user = await User.findOne({ email: identifier });
    } else if (role === "dinas") {
      user = await User.findOne({ nip: identifier });
    } else if (role === "admin") {
      user = await User.findOne({ name: identifier });
    }

    if (!user) {
      return res.status(401).json({ message: "Akun tidak ditemukan" });
    }

    if (user.statusUser === "diblokir") {
      return res.status(403).json({ message: "Akun diblokir admin" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Role tidak sesuai" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch(
  "/api/users/change-password",
  auth(["masyarakat", "admin", "dinas"]),
  async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        return res.status(400).json({ message: "Password lama salah" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: "Password berhasil diubah" });
    } catch (err) {
      res.status(500).json({ message: "Gagal ganti password", error: err.message });
    }
  }
);


/* =================================================
   USER (REGISTER & ADMIN MANAGE USER)
================================================= */
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, nik } = req.body;

    if (!nik) {
      return res.status(400).json({
        message: "NIK wajib diisi"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      nik,               
      password: hashed,
      role: "masyarakat",
      statusUser: "aktif",
    });

    res.json({
      message: "User dibuat",
      data: user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.patch(
  "/api/users/:id/status",
  auth(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { statusUser: req.body.statusUser },
        { new: true }
      );

      res.json({ message: "Status user diperbarui", data: user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ ADMIN - AMBIL SEMUA USER
app.get(
  "/api/users",
  auth(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


/* =================================================
   LAPORAN MASYARAKAT
================================================= */
app.post(
  "/api/laporan",
  auth(["masyarakat"]),
  upload.array("fotoLaporan", 5),
  async (req, res) => {
    try {
      console.log("FILES:", req.files);
      console.log("BODY:", req.body);

      const foto = req.files
        ? req.files.map((f) => f.path)
        : [];

      const laporan = await LaporanMasyarakat.create({
        userId: req.user.id,
        judul: req.body.judul,
        lokasi: req.body.lokasi,
        deskripsi: req.body.deskripsi,
        fotoLaporan: foto,
        statusLaporan: "menunggu",
      });

      res.json({
        message: "Laporan berhasil dikirim",
        data: laporan,
      });
    } catch (err) {
      console.error("ERROR LAPORAN:", err);
      res.status(500).json({
        message: "Gagal membuat laporan",
        error: err.message,
      });
    }
  }
);



app.patch(
  "/api/laporan/:id/status",
  auth(["admin"]),
  async (req, res) => {
    try {
      const laporan = await LaporanMasyarakat.findByIdAndUpdate(
        req.params.id,
        { statusLaporan: req.body.statusLaporan },
        { new: true }
      );

      res.json({ message: "Status laporan diubah", data: laporan });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =================================================
   RIWAYAT LAPORAN USER (MASYARAKAT)
================================================= */
app.get(
  "/api/laporan/me",
  auth(["masyarakat"]),
  async (req, res) => {
    try {
      const laporan = await LaporanMasyarakat.find({
        userId: req.user.id,
      }).sort({ createdAt: -1 });

      res.json(laporan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =================================================
   DETAIL LAPORAN USER
================================================= */
app.get(
  "/api/laporan/:id",
  auth(["masyarakat"]),
  async (req, res) => {
    try {
      const laporan = await LaporanMasyarakat.findById(req.params.id)
        .populate("userId", "name email")
        .lean();

      if (!laporan) {
        return res.status(404).json({
          message: "Laporan tidak ditemukan",
        });
      }

      if (laporan.userId._id.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Akses ditolak",
        });
      }

      const laporanDinas = await LaporanDinas.findOne({
        laporanMasyarakatId: laporan._id,
      }).lean();

      res.json({
        ...laporan,
        laporanDinas: laporanDinas || null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);



/* =================================================
   LAPORAN DINAS
================================================= */
app.post(
  "/api/laporan-dinas",
  auth(["dinas"]),
  upload.array("fotoBukti", 5),
  async (req, res) => {
    try {
      const laporan = await LaporanMasyarakat.findById(
        req.body.laporanMasyarakatId
      );

      if (!laporan || laporan.statusLaporan === "ditolak") {
        return res.status(400).json({
          message: "Laporan tidak valid / ditolak",
        });
      }

      const foto = req.files.map((f) => f.path);

      const dinas = await LaporanDinas.create({
        laporanMasyarakatId: req.body.laporanMasyarakatId,
        fotoBukti: foto,
        catatanPetugas: req.body.catatanPetugas,
        statusKerja: "progress",
      });

      res.json({ message: "Laporan dinas dibuat", data: dinas });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =================================================
   DINAS - KIRIM LAPORAN SELESAI (FINAL)
================================================= */
app.post(
  "/api/laporan-dinas/selesai/:id",
  auth(["dinas"]),
  upload.array("fotoBukti", 5),
  async (req, res) => {
    try {
      const laporanDinas = await LaporanDinas.findById(req.params.id);

      if (!laporanDinas) {
        return res.status(404).json({
          message: "Laporan dinas tidak ditemukan",
        });
      }

      // 🔒 CEGAH KIRIM ULANG
      if (laporanDinas.statusKerja === "selesai") {
        return res.status(400).json({
          message: "Laporan ini sudah diselesaikan",
        });
      }

      // ✅ UPDATE LAPORAN DINAS
      laporanDinas.statusKerja = "selesai";
      laporanDinas.catatanPetugas =
        req.body.catatanPetugas || "";
      laporanDinas.fotoBukti =
        req.files?.map((f) => f.path) || [];

      await laporanDinas.save();

      // ✅ UPDATE STATUS LAPORAN MASYARAKAT
      await LaporanMasyarakat.findByIdAndUpdate(
        laporanDinas.laporanMasyarakatId,
        { statusLaporan: "selesai" }
      );

      res.json({
        message: "Laporan berhasil diselesaikan",
      });
    } catch (err) {
      console.error("SELESAI DINAS ERROR:", err);
      res.status(500).json({
        message: "Gagal mengirim laporan selesai",
      });
    }
  }
);



/* =================================================
   DINAS - AMBIL SEMUA TUGAS
================================================= */
app.get(
  "/api/laporan-dinas/selesai",
  auth(["dinas"]),
  async (req, res) => {
    try {
      const selesai = await LaporanDinas.find({
        statusKerja: "selesai",
      })
        .populate("laporanMasyarakatId")
        .sort({ createdAt: -1 });

      res.json(selesai);
    } catch (err) {
      console.error("RIWAYAT ERROR:", err);
      res.status(500).json({
        message: "Gagal mengambil riwayat selesai",
        error: err.message,
      });
    }
  }
);


/* =================================================
   DINAS - DETAIL TUGAS
================================================= */
app.get(
  "/api/laporan-dinas/:id",
  auth(["dinas"]),
  async (req, res) => {
    try {
      const tugas = await LaporanDinas.findById(req.params.id)
        .populate("laporanMasyarakatId");

      if (!tugas) {
        return res.status(404).json({
          message: "Tugas dinas tidak ditemukan",
        });
      }

      res.json(tugas);
    } catch (err) {
      res.status(500).json({
        message: "Gagal mengambil detail tugas dinas",
        error: err.message,
      });
    }
  }
);

// ===============================
// DINAS - RIWAYAT SELESAI
// ===============================
app.get(
  "/api/laporan-dinas/selesai",
  auth(["dinas"]),
  async (req, res) => {
    try {
      const selesai = await LaporanDinas.find({
        statusKerja: "selesai",
      })
        .populate("laporanMasyarakatId")
        .sort({ createdAt: -1 });

      // 🔥 AMANKAN DATA RUSAK
      const clean = selesai.filter(
        (d) => d.laporanMasyarakatId
      );

      res.json(clean);
    } catch (err) {
      console.error("RIWAYAT ERROR:", err);
      res.status(500).json({
        message: "Gagal mengambil riwayat selesai",
        error: err.message,
      });
    }
  }
);



/* =================================================
   JOIN LAPORAN
================================================= */
app.get("/api/laporan-full", auth(), async (req, res) => {
  try {
    const laporan = await LaporanMasyarakat.find()
      .populate("userId", "name email role")
      .lean();

    const ids = laporan.map((l) => l._id);

    const dinas = await LaporanDinas.find({
      laporanMasyarakatId: { $in: ids },
    }).lean();

    const map = {};
    dinas.forEach((d) => {
      map[d.laporanMasyarakatId.toString()] = d;
    });

    const result = laporan.map((l) => ({
      ...l,
      laporanDinas: map[l._id.toString()] || null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =================================================
   ADMIN - AMBIL SEMUA LAPORAN
================================================= */
app.get("/api/admin/laporan", auth(["admin"]), async (req, res) => {
  try {
    const laporan = await LaporanMasyarakat.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(laporan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =================================================
   ADMIN - DETAIL LAPORAN
================================================= */
app.get(
  "/api/admin/laporan/:id",
  auth(["admin"]),
  async (req, res) => {
    try {
      const laporan = await LaporanMasyarakat.findById(req.params.id)
        .populate("userId", "name email")
        .lean();

      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      const laporanDinas = await LaporanDinas.findOne({
        laporanMasyarakatId: laporan._id,
      }).lean();

      res.json({
        ...laporan,
        laporanDinas: laporanDinas || null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =================================================
   ADMIN - VERIFIKASI & TERUSKAN KE DINAS
================================================= */
app.post(
  "/api/admin/laporan/:id/verifikasi",
  auth(["admin"]),
  async (req, res) => {
    try {
      const { catatanPetugas } = req.body;

      const laporan = await LaporanMasyarakat.findById(req.params.id);
      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      // update status laporan masyarakat
      laporan.statusLaporan = "proses";
      await laporan.save();

      // buat laporan dinas (generic)
      const laporanDinas = await LaporanDinas.create({
        laporanMasyarakatId: laporan._id,
        dinas: "dinas",
        catatanPetugas: catatanPetugas || "",
        statusKerja: "progress",
      });

      res.json({
        message: "Laporan diverifikasi & diteruskan ke dinas",
        laporan,
        laporanDinas,
      });
    } catch (err) {
      console.error("ERROR VERIFIKASI:", err);
      res.status(500).json({
        message: "Gagal verifikasi laporan",
        error: err.message,
      });
    }
  }
);




/* =================================================
   ADMIN - TOLAK LAPORAN
================================================= */
app.post(
  "/api/admin/laporan/:id/tolak",
  auth(["admin"]),
  async (req, res) => {
    try {
      const laporan = await LaporanMasyarakat.findById(req.params.id);
      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      laporan.statusLaporan = "ditolak";
      await laporan.save();

      res.json({ message: "Laporan ditolak" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);



/* =================================================
   DINAS - AMBIL TUGAS AKTIF (DARI ADMIN)
================================================= */
app.get(
  "/api/laporan-dinas",
  auth(["dinas"]),
  async (req, res) => {
    try {
      const tugas = await LaporanDinas.find({
        statusKerja: "progress",
      })
        .populate("laporanMasyarakatId")
        .sort({ createdAt: -1 });

      const clean = tugas.filter(
        (t) => t.laporanMasyarakatId
      );

      res.json(clean);
    } catch (err) {
      console.error("DINAS DASHBOARD ERROR:", err);
      res.status(500).json({
        message: "Gagal mengambil tugas dinas",
        error: err.message,
      });
    }
  }
);

/* =========================
   SERVER
========================= */
app.listen(3000, () => {
  console.log("Server jalan di port 3000");
});