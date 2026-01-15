<template>
  <div class="page">
    <button class="back" @click="$router.push('/dinas/dashboard')">
      ← Kembali
    </button>

    <h1>Laporan Penyelesaian Tugas</h1>

    <div v-if="!task" class="empty">
      Memuat data...
    </div>

    <div v-else class="card">
      <!-- REFERENSI LAPORAN -->
      <h3>Referensi Masalah</h3>

      <img
        v-if="task.laporanMasyarakatId?.fotoLaporan?.length"
        :src="`http://localhost:3000/${task.laporanMasyarakatId.fotoLaporan[0]}`"
        class="foto"
      />

      <p><b>Judul:</b> {{ task.laporanMasyarakatId.judul }}</p>
      <p><b>Lokasi:</b> {{ task.laporanMasyarakatId.lokasi }}</p>
      <p><b>Status:</b> Sedang Dikerjakan</p>

      <!-- UPLOAD FOTO -->
      <h3>Bukti Pengerjaan</h3>
      <input type="file" @change="handleFile" />

      <img v-if="preview" :src="preview" class="foto" />

      <!-- CATATAN -->
      <h3>Catatan Petugas</h3>
      <textarea v-model="catatan" rows="4"></textarea>

      <!-- SUBMIT -->
      <button class="submit" @click="submit">
        KIRIM LAPORAN SELESAI
      </button>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "DinasSelesaiTugas",

  data() {
    return {
      task: null,
      file: null,
      preview: "",
      catatan: "",
    };
  },

  async mounted() {
    await this.fetchTask();
  },

  methods: {
    async fetchTask() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/api/laporan-dinas/${id}`);
        this.task = res.data;
      } catch (err) {
        alert("Gagal mengambil data tugas dinas");
        console.error(err);
      }
    },

    handleFile(e) {
      this.file = e.target.files[0];
      this.preview = URL.createObjectURL(this.file);
    },

    async submit() {
      if (!this.file || !this.catatan) {
        alert("Foto dan catatan wajib diisi");
        return;
      }

      const formData = new FormData();
      formData.append("fotoBukti", this.file);
      formData.append("catatanPetugas", this.catatan);

      try {
        // ✅ SELESAIKAN LAPORAN DINAS (TIDAK BUAT BARU)
      await api.post(
        `/api/laporan-dinas/selesai/${this.task._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


        alert("✅ Laporan berhasil diselesaikan");

        // 🔥 UX BENAR (tidak bisa submit ulang)
        this.$router.replace("/dinas/riwayat");
      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Gagal menyelesaikan laporan"
        );
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.foto {
  width: 100%;
  max-width: 420px;
  margin: 12px 0;
  border-radius: 12px;
  object-fit: cover;
}

textarea {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
}

.submit {
  width: 100%;
  margin-top: 16px;
  background: #294b57;
  color: #fff;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.back {
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
}
</style>
