<template>
  <div class="page">
    <p class="breadcrumb">Beranda / Riwayat</p>
    <h1 class="title">Riwayat Laporan Anda</h1>

    <!-- SUMMARY -->
    <div class="summary">
      <div class="summary-card">
        <p>Total Laporan</p>
        <h2>{{ laporan.length }}</h2>
      </div>
      <div class="summary-card">
        <p>Menunggu Verifikasi</p>
        <h2 class="yellow">{{ menungguCount }}</h2>
      </div>
      <div class="summary-card">
        <p>Sedang Proses</p>
        <h2 class="orange">{{ prosesCount }}</h2>
      </div>
      <div class="summary-card">
        <p>Laporan Selesai</p>
        <h2 class="green">{{ selesaiCount }}</h2>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="col-no">No</th>
            <th>Judul Laporan</th>
            <th>Deskripsi</th>
            <th>Lokasi</th>
            <th class="col-status">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in laporan"
            :key="item._id"
            class="row"
          >
            <td class="col-no">{{ index + 1 }}</td>
            <td class="judul">{{ item.judul }}</td>
            <td class="desc">{{ item.deskripsi }}</td>
            <td>{{ item.lokasi }}</td>

            <!-- ✅ STATUS + LIHAT HASIL DI DALAM TD -->
            <td class="col-status">
              <div class="status-box">
                <span class="badge" :class="item.statusLaporan">
                  {{ labelStatus(item.statusLaporan) }}
                </span>

                <span
                  v-if="item.statusLaporan === 'selesai'"
                  class="lihat-hasil"
                  @click.stop="openHasil(item._id)"
                >
                  Lihat Hasil
                </span>
              </div>
            </td>
          </tr>

          <tr v-if="laporan.length === 0">
            <td colspan="5" class="empty">Belum ada laporan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Hasil Laporan</h3>
          <span class="close" @click="closeModal">✕</span>
        </div>

        <div class="modal-body">
          <div class="foto-grid">
            <div>
              <h4>Foto Sebelum</h4>
              <img
                v-if="detail?.fotoLaporan?.length"
                :src="`http://localhost:3000/${detail.fotoLaporan[0]}`"
              />
            </div>

            <div>
              <h4>Foto Sesudah</h4>
              <img
                v-if="detail?.laporanDinas?.fotoBukti?.length"
                :src="`http://localhost:3000/${detail.laporanDinas.fotoBukti[0]}`"
              />
            </div>
          </div>

          <div class="catatan-box">
            <h4>Catatan Petugas</h4>
            <p>{{ detail?.laporanDinas?.catatanPetugas || "-" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import api from "../services/api";

export default {
  name: "RiwayatLaporan",

  data() {
    return {
      laporan: [],
      showModal: false,
      detail: null,

    };
  },

  computed: {
    menungguCount() {
      return this.laporan.filter(
        (l) => l.statusLaporan === "menunggu"
      ).length;
    },
    prosesCount() {
      return this.laporan.filter(
        (l) => l.statusLaporan === "proses"
      ).length;
    },
    selesaiCount() {
      return this.laporan.filter(
        (l) => l.statusLaporan === "selesai"
      ).length;
    },
  },

  mounted() {
    this.fetchLaporan();
  },

  methods: {
    async fetchLaporan() {
      try {
        const res = await api.get("/api/laporan/me");
        this.laporan = res.data;
      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Gagal mengambil data laporan"
        );
      }
    },
    async openHasil(id) {
  try {
    const res = await api.get(`/api/laporan/${id}`);
    this.detail = res.data;
    this.showModal = true;
  } catch (err) {
    alert("Gagal mengambil hasil laporan");
  }
},

closeModal() {
  this.showModal = false;
  this.detail = null;
},


    goDetail(id) {
      if (!id) return;
      this.$router.push(`/riwayat/${id}`);
    },

    labelStatus(status) {
      if (status === "menunggu") return "MENUNGGU";
      if (status === "proses") return "PROSES";
      if (status === "selesai") return "SELESAI";
      if (status === "ditolak") return "DITOLAK";
      return "-";
    },
  },
};
</script>

<style scoped>
.page {
  padding: 40px 60px;
}

.breadcrumb {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

/* SUMMARY */
.summary {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  min-width: 180px;
}

.summary-card p {
  font-size: 13px;
  color: #64748b;
}

.summary-card h2 {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 700;
}

.summary-card h2.yellow {
  color: #eab308;
}
.summary-card h2.orange {
  color: #f97316;
}
.summary-card h2.green {
  color: #22c55e;
}

/* TABLE */
.table-wrapper {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #243e47;
  color: #fff;
}

th {
  padding: 14px 12px;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
}

td {
  padding: 14px 12px;
  font-size: 13px;
}

.row:hover {
  background: #f2fdfb;
}

.col-no {
  width: 50px;
  text-align: center;
}

.col-status {
  width: 140px;
  text-align: center;
}

.judul {
  font-weight: 600;
}

.desc {
  font-size: 12px;
  color: #64748b;
}

/* BADGE */
.badge {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.badge.menunggu {
  background: #fde68a;
  color: #92400e;
}

.badge.proses {
  background: #facc15;
  color: #78350f;
}

.badge.ditolak {
  background: #ef4444;
  color: #fff;
}

.badge.selesai {
  background: #22c55e;
  color: #fff;
}

.empty {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
}
.lihat-hasil {
  font-size: 12px;
  color: #0ea5e9;
  cursor: pointer;
  margin-top: 6px;
}

.lihat-hasil:hover {
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: #fff;
  width: 800px;
  border-radius: 14px;
  overflow: hidden;
}

.modal-header {
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.close {
  cursor: pointer;
  font-size: 20px;
}

.modal-body {
  padding: 20px;
}

.foto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.foto-grid img {
  width: 100%;
  border-radius: 10px;
}

.catatan-box {
  margin-top: 16px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
}
.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.lihat-hasil {
  font-size: 12px;
  color: #0ea5e9;
  cursor: pointer;
}

.lihat-hasil:hover {
  text-decoration: underline;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  width: 680px;
  max-height: 85vh;
  background: #fff;
  border-radius: 16px;
  overflow-y: auto;
}

.modal-header {
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.close {
  cursor: pointer;
  font-size: 20px;
}

.modal-body {
  padding: 20px;
}

.foto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.foto-grid img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 12px;
}


</style>
