<template>
  <div class="forgot-page">
    <div class="forgot-card">
      <h1 class="logo">Lapor<span>Pekanbaru.</span></h1>

      <h2>Lupa Password?</h2>
      <p class="subtitle">
        Masukkan email terdaftar untuk reset password.
      </p>

      <form @submit.prevent="submitEmail">
        <div class="form-group">
          <label>ALAMAT EMAIL</label>
          <input
            type="email"
            placeholder="budi@example.com"
            required
          />
        </div>

        <button type="submit" class="btn-submit">
          KIRIM LINK RESET
        </button>
      </form>

      <p class="back-login">
        <router-link to="/login">← Kembali ke Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgotPassword",
  methods: {
    submitEmail() {
      // sementara simulasi
      alert("Link reset password telah dikirim ke email Anda");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  background: #eef9f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forgot-card {
  background: #ffffff;
  width: 380px;
  padding: 32px;
  border-radius: 14px;
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
  color: #2c3e50;
  margin-bottom: 6px;
}
.subtitle {
  text-align: center;
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 22px;
}

.form-group {
  margin-bottom: 18px;
}
label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #7f8c8d;
  margin-bottom: 6px;
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

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #2a9d8f;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-submit:hover {
  background: #21867a;
}

.back-login {
  margin-top: 18px;
  text-align: center;
  font-size: 12px;
}
.back-login a {
  color: #1abc9c;
  font-weight: 600;
  text-decoration: none;
}
</style>
