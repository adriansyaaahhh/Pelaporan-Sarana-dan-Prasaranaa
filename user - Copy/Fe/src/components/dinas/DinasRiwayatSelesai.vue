<template>
  <div class="page">
    <h1 class="title">Riwayat Laporan Selesai</h1>

    <div v-if="riwayat.length === 0" class="empty">
      Belum ada laporan yang diselesaikan
    </div>

    <!-- LIST CARD -->
    <div
      v-for="item in riwayat"
      :key="item._id"
      class="card clickable"
      @click="openDetail(item)"
    >
      <div class="left">
        <img
          v-if="item.fotoBukti && item.fotoBukti.length"
          :src="`http://localhost:3000/${item.fotoBukti[0]}`"
          class="thumb"
        />
        <div v-else class="no-photo">Tidak ada foto</div>
      </div>

      <div class="right">
        <h3>{{ item.laporanMasyarakatId?.judul || "-" }}</h3>
        <p class="lokasi">
          {{ item.laporanMasyarakatId?.lokasi || "-" }}
        </p>

        <p class="note">
          <b>Catatan:</b> {{ item.catatanPetugas || "-" }}
        </p>

        <div class="meta">
          <span class="badge">SELESAI</span>
          <span class="date">
            {{ formatDate(item.updatedAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- POPUP DETAIL -->
    <div
      v-if="showDetail"
      class="modal-overlay"
      @click.self="closeDetail"
    >
      <div class="modal">
        <div class="modal-header">
          <h2>{{ selected?.laporanMasyarakatId?.judul }}</h2>
          <span class="close" @click="closeDetail">×</span>
        </div>

        <p class="lokasi">
          {{ selected?.laporanMasyarakatId?.lokasi }}
        </p>

        <div class="photos">
          <div class="photo-box">
            <h4>Foto Sebelum</h4>
            <img
              v-if="selected?.laporanMasyarakatId?.fotoLaporan?.length"
              :src="`http://localhost:3000/${selected.laporanMasyarakatId.fotoLaporan[0]}`"
            />
            <p v-else class="no-photo-text">Tidak ada foto</p>
          </div>

          <div class="photo-box">
            <h4>Foto Sesudah</h4>
            <img
              v-if="selected?.fotoBukti?.length"
              :src="`http://localhost:3000/${selected.fotoBukti[0]}`"
            />
            <p v-else class="no-photo-text">Tidak ada foto</p>
          </div>
        </div>

        <div class="note-box">
          <b>Catatan Admin</b>
          <p>{{ selected?.laporanMasyarakatId?.catatanAdmin || "-" }}</p>
        </div>

        <div class="note-box">
          <b>Catatan Petugas</b>
          <p>{{ selected?.catatanPetugas || "-" }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "DinasRiwayatSelesai",

  data() {
    return {
      riwayat: [],
      selected: null,
      showDetail: false,
    };
  },

  async mounted() {
    try {
      const res = await api.get("/api/laporan-dinas/selesai", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.riwayat = res.data;
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil riwayat laporan selesai");
    }
  },

  methods: {
    openDetail(item) {
      this.selected = item;
      this.showDetail = true;
    },
    closeDetail() {
      this.showDetail = false;
      this.selected = null;
    },
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return isNaN(d) ? "-" : d.toLocaleDateString("id-ID");
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1000px;
  margin: 0 auto;
}

.title {
  margin-bottom: 24px;
}

.card {
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.05);
}

.clickable {
  cursor: pointer;
}

.left {
  width: 120px;
}

.thumb {
  width: 110px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.no-photo {
  width: 110px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #94a3b8;
}

.right {
  flex: 1;
}

.lokasi {
  font-size: 14px;
  color: #64748b;
}

.note {
  font-size: 13px;
  margin-top: 6px;
}

.meta {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.badge {
  background: #dcfce7;
  color: #166534;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
}

.date {
  font-size: 12px;
  color: #64748b;
}

.empty {
  text-align: center;
  color: #94a3b8;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: #fff;
  padding: 24px;
  border-radius: 18px;
  max-width: 900px;
  width: 100%;
}

.photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}

.photos img {
  width: 100%;
  border-radius: 12px;
}

.no-photo-text {
  font-size: 13px;
  color: #94a3b8;
}

.note-box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  margin-top: 10px;
}
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  max-width: 800px;   /* 🔥 BIKIN TIDAK GEDE */
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  color: #64748b;
}

.close:hover {
  color: #ef4444;
}

.photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}

.photo-box img {
  width: 100%;
  max-height: 220px;   /* 🔥 FOTO TIDAK KEGEDEAN */
  object-fit: contain;
  border-radius: 12px;
  background: #f1f5f9;
}

.note-box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  margin-top: 12px;
}

.no-photo-text {
  font-size: 13px;
  color: #94a3b8;
}

</style>
