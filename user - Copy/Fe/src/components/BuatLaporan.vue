<template>
  <div class="page">
    <main class="content">
      <section class="form-section" v-if="user">
        <h1>Buat Laporan Baru</h1>
        <p class="subtitle">
          Sampaikan keluhan fasilitas publik yang rusak di sekitar Anda.
        </p>

        <form @submit.prevent="submitLaporan">
          <div class="row">
            <div class="form-group">
              <label>Nama Pelapor</label>
              <input type="text" :value="user.name" disabled />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" :value="user.email" disabled />
            </div>
          </div>

          <div class="form-group">
            <label>Judul Laporan</label>
            <input
              type="text"
              v-model="judul"
              placeholder="Contoh: Jalan Rusak di Kecamatan Tampan"
              required
            />
          </div>

          <div class="form-group">
            <label>Lokasi Kejadian</label>
            <input
              type="text"
              v-model="lokasi"
              placeholder="Masukkan lokasi kejadian"
              required
            />
          </div>

          <div class="form-group">
            <label>Deskripsi Laporan</label>
            <textarea
              rows="4"
              v-model="deskripsi"
              placeholder="Jelaskan kerusakan secara jelas"
              required
            ></textarea>
          </div>

          <!-- FOTO -->
          <div class="form-group">
            <label>Bukti Foto</label>
            <div class="upload-box">
              <div v-if="previews.length" class="preview-list">
                <div
                  v-for="(img, index) in previews"
                  :key="index"
                  class="preview-item"
                >
                  <img :src="img" />
                  <button type="button" @click="removeImage(index)">✕</button>
                </div>
             </div>

              <input
                type="file"
                hidden
                ref="fileInput"
                accept="image/*"
                multiple
                @change="handleFiles"
              />

              <button type="button" @click="$refs.fileInput.click()">
                + Upload Foto
              </button>
              <small>{{ fileName || "Maksimal 5MB (JPG/PNG)" }}</small>
            </div>
          </div>

          <button type="submit" class="btn-submit">
            KIRIM LAPORAN
          </button>
        </form>
      </section>

      <!-- fallback kalau user null -->
      <section v-else class="form-section">
        <p>Memuat data...</p>
      </section>

      <aside class="tips">
        <h3>Tips Laporan Efektif</h3>
        <ul>
          <li>Lokasi harus jelas</li>
          <li>Foto tidak blur</li>
          <li>Gunakan bahasa sopan</li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "BuatLaporan",

  data() {
    return {
      user: null,
      judul: "",
      lokasi: "",
      deskripsi: "",
      photos: [],
      previews: [],

    };
  },

  mounted() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      this.$router.push("/login");
      return;
    }

    this.user = JSON.parse(userData);
  },

  methods: {
    handleFiles(e) {
      const files = Array.from(e.target.files);

      files.forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        if (file.size > 5 * 1024 * 1024) {
          alert("Ukuran foto maksimal 5MB");
          return;
        }

        this.photos.push(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          this.previews.push(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    removeImage(index) {
      this.photos.splice(index, 1);
      this.previews.splice(index, 1);
    },


    async submitLaporan() {
      const formData = new FormData();
      formData.append("judul", this.judul);
      formData.append("lokasi", this.lokasi);
      formData.append("deskripsi", this.deskripsi);

      this.photos.forEach((file) => {
      formData.append("fotoLaporan", file);
      });


      try {
        await api.post("/api/laporan", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("✅ Laporan berhasil dikirim");
        this.$router.push("/riwayat");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "❌ Gagal kirim laporan");
      }
    },
  },
};
</script>

<style scoped>
/* CSS ASLI KAMU – TIDAK DIUBAH */
.page {
  background: #f5f8f8;
  min-height: 100vh;
}
.content {
  display: flex;
  gap: 30px;
  padding: 40px;
}
.form-section {
  flex: 1;
  background: #fff;
  padding: 30px;
  border-radius: 14px;
}
.subtitle {
  color: #6b7b83;
  margin-bottom: 24px;
}
.row {
  display: flex;
  gap: 20px;
}
.form-group {
  margin-bottom: 16px;
  flex: 1;
}
input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
}
.upload-box {
  border: 2px dashed #8fd9cc;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
}
.upload-box button {
  background: none;
  border: none;
  color: #1aa59a;
  font-weight: 600;
  cursor: pointer;
}
.btn-submit {
  margin-top: 20px;
  background: #243e47;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
}
.tips {
  width: 280px;
  background: #243e47;
  color: #fff;
  padding: 20px;
  border-radius: 14px;
  height: fit-content;
}
.tips h3 {
  color: #49cbb7;
  font-size: 16px;
  margin-bottom: 12px;
}
.tips ul {
  padding-left: 18px;
}
.tips li {
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.4;
}
.preview-list {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
}

.preview-item img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.preview-item button {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  cursor: pointer;
}

</style>