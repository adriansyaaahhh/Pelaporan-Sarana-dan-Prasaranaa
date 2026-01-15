<template>
  <!-- HERO -->
  <section class="hero">
    <div class="content">
      <h1>
        Pekanbaru
        <span>Kota Cerdas.</span>
      </h1>

      <p>
        Bantu kami menjaga fasilitas publik tetap prima.<br />
        Lapor kerusakan jalan, drainase, atau taman kota dalam 1 klik.
      </p>

      <button @click="goBuatLaporan">
        LAPOR SEKARANG
      </button>
    </div>
  </section>

  <!-- WORKFLOW -->
  <section class="workflow">
    <h2>Alur Kerja Sistem</h2>
    <p class="subtitle">
      Transparan dan terpantau di setiap langkahnya.
    </p>

    <div class="steps">
      <div class="step">
        <div class="circle green">✏️</div>
        <h4>1. Tulis Laporan</h4>
        <p>Laporkan keluhan anda dengan jelas & lengkap.</p>
      </div>

      <div class="connector"></div>

      <div class="step">
        <div class="circle orange">🔍</div>
        <h4>2. Verifikasi</h4>
        <p>Admin memvalidasi laporan anda.</p>
      </div>

      <div class="connector"></div>

      <div class="step">
        <div class="circle blue">🛠</div>
        <h4>3. Tindak Lanjut</h4>
        <p>Petugas dinas melakukan perbaikan.</p>
      </div>

      <div class="connector"></div>

      <div class="step">
        <div class="circle dark">✔</div>
        <h4>4. Selesai</h4>
        <p>Laporan ditutup & notifikasi dikirim.</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Beranda",
  methods: {
    goBuatLaporan() {
      const user = localStorage.getItem("user");
      if (!user) {
        this.$router.push("/login");
      } else {
        this.$router.push("/buat-laporan");
      }
    },
  },
};
</script>

<style scoped>
.hero {
  background: #49cbb7;
  padding: 60px 80px;
}

.content {
  max-width: 650px;
}

h1 {
  font-size: 56px;
  color: #134e4e;
  margin: 0;
}

h1 span {
  display: block;
  color: #fff;
}

p {
  margin-top: 20px;
  color: #0f3f3f;
  line-height: 1.7;
}

button {
  margin-top: 36px;
  padding: 14px 32px;
  background: #243e47;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

/* WORKFLOW */
.workflow {
  padding: 50px 30px;
  text-align: center;
}

.steps {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.connector {
  width: 80px;
  height: 2px;
  margin-top: 40px;
  background: repeating-linear-gradient(
    to right,
    #cfd8dc,
    #cfd8dc 6px,
    transparent 6px,
    transparent 12px
  );
}

.step {
  width: 220px;
}

.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.green { background: #e8f9f6; color: #1aa59a; }
.orange { background: #fff1e5; color: #ff8a00; }
.blue { background: #eef2ff; color: #3b6cff; }
.dark { background: #243e47; color: #fff; }
</style>
