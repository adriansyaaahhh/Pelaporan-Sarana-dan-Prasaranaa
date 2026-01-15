<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="logo">Lapor<span>Pekanbaru.</span></h1>

      <h2>Buat Akun Baru</h2>
      <p class="subtitle">Mari berkontribusi untuk kota kita.</p>

      <form @submit.prevent="register">
        <div class="form-group">
          <label>NAMA LENGKAP</label>
          <input
            type="text"
            placeholder="Nama lengkap"
            v-model="name"
            required
          />
        </div>

        <div class="form-group">
          <label>NIK (KTP)</label>
          <input
            type="text"
            placeholder="16 digit NIK"
            v-model="nik"
            required
          />
        </div>

        <div class="form-group">
          <label>ALAMAT EMAIL</label>
          <input
            type="email"
            placeholder="budi@example.com"
            v-model="email"
            required
          />
        </div>

        <div class="form-group">
          <label>PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            v-model="password"
            required
          />
        </div>

        <div class="form-group">
          <label>KONFIRMASI PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            v-model="confirmPassword"
            required
          />
        </div>

        <button type="submit" class="btn-register">
          DAFTAR SEKARANG
        </button>
      </form>

      <p class="login-link">
        Sudah punya akun?
        <router-link to="/login">Masuk Disini</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  data() {
    return {
      name: "",
      nik: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert("Password tidak sama");
        return;
      }

      try {
      await api.post("/api/users", {
        name: this.name,
        nik: this.nik,
        email: this.email,
        password: this.password,
        role: "masyarakat"
      });



        alert("Registrasi berhasil, silakan login");
        this.$router.push("/login");
      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Registrasi gagal"
        );
      }
    },
  },
};
</script>




<style scoped>
/* STYLE KAMU TETAP, TIDAK DIUBAH */
.register-page {
  min-height: 100vh;
  background: #eef9f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-card {
  background: #ffffff;
  width: 400px;
  padding: 34px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.logo {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #1abc9c;
  margin-bottom: 14px;
}
.logo span {
  color: #2c3e50;
}

h2 {
  text-align: center;
  font-size: 22px;
  margin-bottom: 4px;
  color: #2c3e50;
}
.subtitle {
  text-align: center;
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 14px;
}
label {
  font-size: 11px;
  font-weight: 600;
  color: #7f8c8d;
  margin-bottom: 6px;
  display: block;
}
input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  font-size: 14px;
}
input:focus {
  outline: none;
  border-color: #1abc9c;
}

.btn-register {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: #2a9d8f;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-register:hover {
  background: #21867a;
}

.login-link {
  text-align: center;
  font-size: 12px;
  margin-top: 18px;
}
.login-link a {
  color: #1abc9c;
  font-weight: 600;
  text-decoration: none;
}
</style>
