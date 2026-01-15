<template>
  <div class="admin-login">
    <!-- LEFT PANEL -->
    <div class="left">
      <div class="branding">
        <h1>
          <span class="portal">Portal</span
          ><span class="admin">Admin</span>.
        </h1>
        <p>
          Sistem Manajemen Laporan Infrastruktur Kota Pekanbaru
        </p>
        <div class="line"></div>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right">
      <div class="form-box">
        <h2>Masuk ke Dashboard</h2>
        <p class="subtitle">
          Silakan masuk menggunakan ID.
        </p>

        <form @submit.prevent="login">
          <div class="form-group">
            <label>ID ADMIN</label>
            <input
              type="text"
              v-model="username"
              placeholder="admin@lapor.id"
              required
            />
          </div>

          <div class="form-group">
            <label>KATA SANDI</label>
            <input
              type="password"
              v-model="password"
              placeholder="********"
              required
            />
          </div>

          <button type="submit">LOGIN</button>
        </form>

        <div class="help">
          Lupa akses? Hubungi IT Support.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "LoginAdmin",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const res = await api.post("/api/login", {
          identifier: this.username,
          password: this.password,
          role: "admin",
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.dispatchEvent(new Event("auth-change"));

        this.$router.push("/admin/dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Login admin gagal");
      }
    },
  },
};
</script>

<style scoped>
.admin-login {
  display: flex;
  min-height: 100vh;
  font-family: Inter, system-ui, sans-serif;
}

/* LEFT */
.left {
  flex: 1;
  background: #294b57;
  display: flex;
  align-items: center;
  padding: 80px;
  color: #fff;
}

.branding h1 {
  font-size: 42px;
  margin-bottom: 14px;
}

.portal {
  color: #36c6b3;
}

.admin {
  color: #ffffff;
}

.branding p {
  font-size: 14px;
  max-width: 420px;
  line-height: 1.6;
  color: #d1e5e3;
}

.line {
  width: 60px;
  height: 4px;
  background: #36c6b3;
  margin-top: 20px;
  border-radius: 4px;
}

/* RIGHT */
.right {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-box {
  width: 360px;
}

h2 {
  margin-bottom: 6px;
  font-size: 24px;
  color: #1f2937;
}

.subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 28px;
}

/* FORM */
.form-group {
  margin-bottom: 18px;
}

label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
  display: block;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #36c6b3;
}

/* BUTTON */
button {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border-radius: 12px;
  border: none;
  background: #294b57;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

button:hover {
  background: #1f3a44;
}

.help {
  margin-top: 20px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}
</style>
