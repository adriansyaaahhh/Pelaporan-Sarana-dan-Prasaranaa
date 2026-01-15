<template>
  <div class="page">
    <button class="back" @click="$router.back()">← Kembali</button>

    <h1>{{ data.judul }}</h1>
    <p class="lokasi">{{ data.lokasi }}</p>

    <div class="photos">
      <div>
        <label>Foto Sebelum</label>
        <img :src="data.fotoBefore" />
      </div>

      <div>
        <label>Foto Sesudah</label>
        <img :src="data.fotoAfter" />
      </div>
    </div>

    <div class="section">
      <h3>Catatan Admin</h3>
      <p>{{ data.adminNote }}</p>
    </div>

    <div class="section">
      <h3>Catatan Petugas</h3>
      <p>{{ data.catatanPetugas }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DinasDetailRiwayat",
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    const id = Number(this.$route.params.id);
    const riwayat =
      JSON.parse(localStorage.getItem("riwayat_selesai")) || [];

    this.data = riwayat.find(r => r.id === id) || {};
  },
};
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
}

.back {
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
}

.photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.photos img {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
}

label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.section {
  background: #fff;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 16px;
}
</style>
