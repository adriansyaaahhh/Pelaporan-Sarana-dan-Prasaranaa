<template>
  <div class="detail-page">
    <div class="back-link" @click="$router.push('/riwayat')">
      ← Kembali
    </div>

    <h2 class="title">Laporan Anda</h2>
    <p class="subtitle">Detail Laporan</p>

    <div v-if="laporan" class="card">
      <div class="left">
        <div class="item">
          <label>Nama Pelapor</label>
          <p>{{ laporan.userId.name }}</p>
        </div>

        <div class="item">
          <label>Email</label>
          <p>{{ laporan.userId.email }}</p>
        </div>

        <div class="item">
          <label>Lokasi Kejadian</label>
          <p>{{ laporan.lokasi }}</p>
        </div>

        <div class="item">
          <label>Deskripsi Laporan</label>
          <textarea readonly>{{ laporan.deskripsi }}</textarea>
        </div>

        <div class="item">
          <label>Status Laporan</label>
          <p>{{ laporan.statusLaporan.toUpperCase() }}</p>
        </div>
      </div>

      <div class="right">
        <label>Bukti Foto</label>
        <div class="photo-box">
          <div
            v-if="laporan.fotoLaporan && laporan.fotoLaporan.length"
            class="photo-list"
            :class="{
              single: laporan.fotoLaporan.length === 1,
              double: laporan.fotoLaporan.length === 2
            }"
          >
            <div
              class="photo-item"
              v-for="(foto, i) in laporan.fotoLaporan"
              :key="i"
            >
              <img :src="`http://localhost:3000/${foto}`" />
            </div>
          </div>

          <p v-else class="empty">
            Tidak ada foto
          </p>
        </div>

      </div>
    </div>

    <div v-else class="not-found">
      Data laporan tidak ditemukan
    </div>
  </div>
</template>


<script>
import api from "@/services/api";

export default {
  name: "DetailLaporan",
  data() {
    return {
      laporan: null,
    };
  },

  async mounted() {
    try {
      const id = this.$route.params.id;
      const res = await api.get(`/api/laporan/${id}`);
      this.laporan = res.data;
    } catch (err) {
      alert("Gagal memuat detail laporan");
      console.error(err);
    }
  },
};
</script>



<style scoped>
/* === CSS ASLI KAMU (TIDAK DIUBAH) === */

.detail-page {
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
}

.back-link {
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  margin-bottom: 12px;
}

.back-link:hover {
  text-decoration: underline;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.card {
  display: flex;
  gap: 24px;
  background: #ffffff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.left {
  flex: 1;
}

.right {
  width: 40%;
}

.item {
  margin-bottom: 16px;
}

.item label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}

.item p {
  font-size: 15px;
  color: #0f172a;
  background: #f1f5f9;
  padding: 10px 12px;
  border-radius: 8px;
}

textarea {
  width: 100%;
  height: 120px;
  resize: none;
  border: none;
  background: #f1f5f9;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
}

.photo-box {
  margin-top: 8px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  padding: 12px;
}




/* DEFAULT (>=3 FOTO) — tetap seperti sekarang */
.photo-list {
  display: flex;
  gap: 14px;
  overflow-x: auto;
}

/* ===== 1 FOTO ===== */
.photo-list.single {
  justify-content: center;
}

.photo-list.single .photo-item img {
  width: 320px;
  height: 220px;
}

/* ===== 2 FOTO ===== */
.photo-list.double {
  justify-content: center;
}

.photo-list.double .photo-item img {
  width: 240px;
  height: 170px;
}

.photo-item {
  flex: 0 0 auto;
}

.photo-item img {
  width: 220px;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.empty {
  text-align: center;
  color: #64748b;
  font-size: 14px;
}

.photo-box img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.not-found {
  margin-top: 40px;
  text-align: center;
  color: #ef4444;
  font-weight: 600;
}
</style>
