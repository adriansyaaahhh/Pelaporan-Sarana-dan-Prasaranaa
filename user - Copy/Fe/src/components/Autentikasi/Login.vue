<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="logo">Lapor<span>Pekanbaru.</span></h1>

      <h2>Selamat Datang!</h2>
      <p class="subtitle">Masuk untuk mengelola laporan Anda.</p>

      <form @submit.prevent="login">
        <div class="form-group">
          <label>ALAMAT EMAIL</label>
          <input
            type="email"  
            v-model="email"
            placeholder="budi@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label>KATA SANDI</label>
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="••••••••"
            required
          />

        <span class="toggle" @click="togglePassword">
          <i class="eye" :class="{ active: showPassword }"></i>
        </span>



        </div>

        </div>

        <button type="submit" class="btn-login">MASUK</button>
      </form>

      <p class="register">
        Belum punya akun?
        <router-link to="/register">Daftar Sekarang</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false, // 🔥 BARU
    };
  },
  methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
    },

    async login() {
      try {
        const res = await api.post("/api/login", {
          identifier: this.email,
          password: this.password,
          role: "masyarakat",
        });

        console.log("LOGIN RESPONSE USER ===>", res.data.user);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.dispatchEvent(new Event("auth-change"));

        this.$router.push("/beranda");
      } catch (err) {
        alert(err.response?.data?.message || "Login gagal");
      }
    }
      
  },
};
</script>


<style scoped>
/* Background */
.login-page {
  min-height: 100vh;
  background: #eef9f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card */
.login-card {
  background: #ffffff;
  width: 380px;
  padding: 32px;
  border-radius: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* Logo */
.logo {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #1abc9c;
  margin-bottom: 16px;
}
.logo span {
  color: #2c3e50;
}

/* Headings */
h2 {
  text-align: center;
  font-size: 22px;
  margin-bottom: 6px;
  color: #2c3e50;
}
.subtitle {
  text-align: center;
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 24px;
}

/* Form */
.form-group {
  margin-bottom: 16px;
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

/* Password */
.password-wrapper {
  position: relative;
}
.toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.eye {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  transition: opacity 0.15s ease, transform 0.15s ease;
  opacity: 0.7;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>");
}

/* efek hover */
.toggle:hover .eye {
  opacity: 1;
}

/* efek saat diklik */
.eye.active {
  transform: scale(0.9);
  opacity: 1;
}
/* Options */
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 20px;
}
.options a {
  color: #1abc9c;
  text-decoration: none;
}

/* Button */
.btn-login {
  width: 100%;
  padding: 12px;
  background: #264653;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-login:hover {
  background: #1f3a44;
}

/* Register */
.register {
  text-align: center;
  font-size: 12px;
  margin-top: 18px;
}
.register a {
  color: #1abc9c;
  font-weight: 600;
  text-decoration: none;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 42px;
}

.toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

</style>