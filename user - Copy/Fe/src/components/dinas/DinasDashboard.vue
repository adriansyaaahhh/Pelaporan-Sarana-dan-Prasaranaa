<template>
  <div class="page">
    <h1 class="title">Tindak Lanjut Lapangan</h1>

    <div v-if="tasks.length === 0" class="empty">
      Tidak ada tugas dinas
    </div>

    <div
      v-for="task in tasks"
      :key="task._id"
      class="task-card"
    >
      <h3>{{ task.laporanMasyarakatId.judul }}</h3>
      <p class="lokasi">{{ task.laporanMasyarakatId.lokasi }}</p>

      <p class="admin-note">
        <strong>Catatan Admin</strong><br />
        {{ task.catatanPetugas || "-" }}
      </p>

      <div class="actions">
        <button class="btn outline" @click="preview(task)">
          Preview
        </button>

        <button
          class="btn primary"
          @click="$router.push(`/dinas/selesai/${task._id}`)"
        >
          Kerjakan
        </button>
      </div>
    </div>

    <!-- PREVIEW MODAL (VERSI BARU) -->
    <div v-if="showPreview" class="preview-overlay">
      <div class="preview-modal">

        <!-- HEADER -->
        <div class="preview-header">
          <h3>Detail Laporan</h3>
          <button class="close-btn" @click="showPreview = false">✕</button>
        </div>

        <!-- BODY -->
        <div class="preview-body">
          <!-- FOTO -->
          <div class="preview-photo">
            <img
              v-if="selected?.laporanMasyarakatId?.fotoLaporan?.length"
              :src="`http://localhost:3000/${selected.laporanMasyarakatId.fotoLaporan[0]}`"
            />
            <div v-else class="no-photo">Tidak ada foto</div>
          </div>

          <!-- INFO -->
          <div class="preview-info">
            <h4>{{ selected.laporanMasyarakatId.judul }}</h4>

            <p class="lokasi">
              📍 {{ selected.laporanMasyarakatId.lokasi }}
            </p>

            <div class="desc">
              <label>Deskripsi</label>
              <p>{{ selected.laporanMasyarakatId.deskripsi }}</p>
            </div>

            <div class="admin-note">
              <label>Catatan Admin</label>
              <p>{{ selected.catatanPetugas || "Tidak ada catatan" }}</p>
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="preview-footer">
          <button class="btn-outline" @click="showPreview = false">
            Tutup
          </button>

          <button
            class="btn-primary"
            @click="$router.push(`/dinas/selesai/${selected._id}`)"
          >
            Kerjakan
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "DinasDashboard",

  data() {
    return {
      tasks: [],
      showPreview: false,
      selected: null,
    };
  },

  async mounted() {
    await this.fetchTasks();
  },

  methods: {
  async fetchTasks() {
    try {
      const res = await api.get("/api/laporan-dinas");
      this.tasks = res.data;
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil tugas dinas");
    }
  },

  preview(task) {
    this.selected = task;
    this.showPreview = true;
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

.task-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
}

.top {
  display: flex;
  justify-content: flex-end;
}

.task-id {
  font-size: 12px;
  color: #64748b;
}

.lokasi {
  font-size: 14px;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn.primary {
  background: #10b981;
  color: #fff;
}

.btn.outline {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #334155;
}

/* UPLOAD BOX */
.upload-box {
  margin-top: 16px;
  background: #f8fbff;
  border: 2px dashed #c7dbff;
  border-radius: 14px;
  padding: 20px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  width: 760px;
  border-radius: 18px;
}

.modal-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.close {
  font-size: 22px;
  cursor: pointer;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 20px;
  padding: 20px 24px;
}

.photo {
  background: #f1f5f9;
  border-radius: 14px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  color: #94a3b8;
}

.modal-footer {
  padding: 16px 24px;
  text-align: right;
}
/* ===== PREVIEW MODAL (EXPERT UI) ===== */
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-modal {
  background: #fff;
  width: 860px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
  animation: fadeUp 0.25s ease;
}

.preview-header {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.preview-body {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
  padding: 24px;
}

.preview-photo {
  background: #f1f5f9;
  border-radius: 14px;
  overflow: hidden;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-info h4 {
  font-size: 20px;
  font-weight: 700;
}

.admin-note {
  margin-top: 14px;
  padding: 12px;
  background: #f8fafc;
  border-left: 4px solid #10b981;
  border-radius: 8px;
}

.preview-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-outline {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}

.btn-primary {
  padding: 10px 22px;
  border-radius: 10px;
  background: #10b981;
  color: #fff;
  font-weight: 700;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
