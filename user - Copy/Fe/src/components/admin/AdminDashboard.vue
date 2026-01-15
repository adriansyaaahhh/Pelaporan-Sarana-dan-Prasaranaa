<template>
  <div>
    <!-- ===== STAT ===== -->
    <div class="stats">
      <div class="card warn">
        <p>Perlu Verifikasi</p>
        <h2>{{ jumlahMenunggu }}</h2>
        <span>Laporan Masuk</span>
      </div>

      <div class="card info">
        <p>Sedang Diproses</p>
        <h2>{{ jumlahProses }}</h2>
        <span>Dalam Proses</span>
      </div>

      <div class="card success">
        <p>Total Selesai</p>
        <h2>{{ jumlahSelesai }}</h2>
        <span>Laporan Selesai</span>
      </div>
    </div>

    <!-- ===== TABLE ===== -->
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <th>Pelapor</th>
            <th>Lokasi</th>
            <th>Judul</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="semuaLaporan.length === 0">
            <td colspan="5" style="text-align:center">
              Tidak ada laporan
            </td>
          </tr>

          <tr
            v-for="lapor in semuaLaporan"
            :key="lapor._id"
            class="row"
          >
            <td>
              <strong>{{ lapor.userId?.name }}</strong><br />
              <small>{{ lapor.userId?.email }}</small>
            </td>
            <td>{{ lapor.lokasi }}</td>
            <td>{{ lapor.judul }}</td>
            <td>
              <span class="badge" :class="lapor.statusLaporan">
                {{ lapor.statusLaporan.toUpperCase() }}
              </span>
            </td>
            <td>
              <button
                class="btn"
                @click="goDetail(lapor._id)"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "AdminDashboard",

  data() {
    return {
      semuaLaporan: [],
    };
  },

  computed: {

    jumlahMenunggu() {
      return this.semuaLaporan.filter(
        l => l.statusLaporan === "menunggu"
      ).length;
    },

    jumlahProses() {
      return this.semuaLaporan.filter(
        l => l.statusLaporan === "proses"
      ).length;
    },

    jumlahSelesai() {
      return this.semuaLaporan.filter(
        l => l.statusLaporan === "selesai"
      ).length;
    },
  },

  mounted() {
    this.fetchLaporan();

    this.interval = setInterval(() => {
      this.fetchLaporan();
    }, 5000); // tiap 5 detik
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },


  methods: {
    async fetchLaporan() {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(
          "/api/admin/laporan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.semuaLaporan = res.data;
      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Gagal mengambil data laporan"
        );
      }
    },

    goDetail(id) {
      this.$router.push(`/admin/laporan/${id}`);
    },
  },
};
</script>

<style scoped>
/* ===== STAT ===== */
.stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  width: 240px;
}

.card p {
  font-size: 13px;
  color: #64748b;
}

.card h2 {
  font-size: 28px;
  font-weight: 700;
}

.card span {
  font-size: 12px;
}

/* ===== TABLE ===== */
.table-box {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 13px;
  color: #64748b;
}

td {
  padding: 14px 0;
  border-top: 1px solid #eef2f7;
}

.row:hover {
  background: #f8fafc;
}

.btn {
  background: #294b57;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* ===== BADGE ===== */
.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.badge.proses {
  background: #fde68a;
  color: #92400e;
}

.badge.selesai {
  background: #bbf7d0;
  color: #166534;
}

.badge.ditolak {
  background: #fecaca;
  color: #7f1d1d;
}
.badge.menunggu {
  background: #e0f2fe;
  color: #0369a1;
}

</style>