<template>
  <div class="page">
    <!-- BACK -->
    <p class="breadcrumb" @click="$router.push('/admin/dashboard')">
      ← Kembali ke daftar laporan
    </p>

    <h1 class="title">Detail Laporan Masuk</h1>

    <!-- DETAIL -->
    <div v-if="laporan" class="card">
      <p><b>Nama:</b> {{ laporan.userId.name }}</p>
      <p><b>Email:</b> {{ laporan.userId.email }}</p>
      <p><b>Lokasi:</b> {{ laporan.lokasi }}</p>
      <p><b>Judul:</b> {{ laporan.judul }}</p>
      <p><b>Deskripsi:</b> {{ laporan.deskripsi }}</p>

      <p>
        <b>Status:</b>
        <span class="badge" :class="laporan.statusLaporan">
          {{ labelStatus(laporan.statusLaporan) }}
        </span>
      </p>
    </div>

    <!-- FOTO -->
    <div v-if="laporan?.fotoLaporan?.length" class="card">
      <h3>Foto Bukti</h3>
      <div class="foto-list">
        <img
          v-for="(foto, i) in laporan.fotoLaporan"
          :key="i"
          :src="`http://localhost:3000/${foto}`"
          alt="Foto bukti"
        />
      </div>
    </div>

    <!-- ACTION ADMIN -->
    <div
      v-if="laporan?.statusLaporan === 'menunggu'"
      class="card action"
    >
      <textarea
        v-model="catatan"
        placeholder="Catatan admin untuk dinas (opsional)"
      ></textarea>

      <div class="btn-group">
        <button class="btn-approve" @click="verifikasi">
          Verifikasi & Teruskan
        </button>

        <button class="btn-reject" @click="tolak">
          Tolak Laporan
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "AdminDetailLaporan",

  data() {
    return {
      laporan: null,
      catatan: "",
    };
  },

  mounted() {
    this.fetchDetail();
  },

  methods: {
    async fetchDetail() {
      try {
        const res = await api.get(
          `/api/admin/laporan/${this.$route.params.id}`
        );
        this.laporan = res.data;
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil detail laporan");
      }
    },

    labelStatus(status) {
      if (status === "menunggu") return "MENUNGGU";
      if (status === "proses") return "PROSES";
      if (status === "selesai") return "SELESAI";
      if (status === "ditolak") return "DITOLAK";
      return status;
    },

    async verifikasi() {
      if (!confirm("Teruskan laporan ke dinas?")) return;

      try {
        await api.post(
          `/api/admin/laporan/${this.laporan._id}/verifikasi`,
          { catatanPetugas: this.catatan }
        );

        alert("Laporan diteruskan ke dinas");
        this.$router.push("/admin/dashboard");
      } catch (err) {
        console.error(err);
        alert("Gagal verifikasi laporan");
      }
    },

    async tolak() {
      if (!confirm("Tolak laporan ini?")) return;

      try {
        await api.post(
          `/api/admin/laporan/${this.laporan._id}/tolak`
        );

        alert("Laporan ditolak");
        this.$router.push("/admin/dashboard");
      } catch (err) {
        console.error(err);
        alert("Gagal menolak laporan");
      }
    },
  },
};
</script>

<style scoped>
.page {
  padding: 40px;
}

.breadcrumb {
  cursor: pointer;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 20px;
}

.badge {
  padding: 4px 12px;
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

.badge.selesai {
  background: #22c55e;
  color: #fff;
}

.badge.ditolak {
  background: #ef4444;
  color: #fff;
}

.foto-list {
  display: flex;
  gap: 12px;
}

.foto-list img {
  width: 160px;
  border-radius: 10px;
}

.action textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  margin-bottom: 12px;
}

.btn-group {
  display: flex;
  gap: 12px;
}

.btn-approve {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
}

.btn-reject {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
}
</style>
