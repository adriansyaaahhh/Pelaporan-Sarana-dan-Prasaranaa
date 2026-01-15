<template>
  <div class="profile-page">
    <div class="profile-card">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="user-info">
          <div class="avatar">{{ userInitial }}</div>
          <h4>{{ user.name }}</h4>
          <p class="role">Masyarakat Umum</p>
        </div>

        <ul class="menu">
          <li
            :class="{ active: activeMenu === 'akun' }"
            @click="activeMenu = 'akun'"
          >
            Informasi Akun
          </li>
          <li
            :class="{ active: activeMenu === 'password' }"
            @click="activeMenu = 'password'"
          >
            Ganti Password
          </li>
        </ul>

        <div class="sidebar-footer">
            <button class="logout" @click="logout">
              Keluar (Log Out)
            </button>

          </div>
      </aside>

      <!-- CONTENT -->
      <section class="content">
        <!-- INFORMASI AKUN -->
        <div v-if="activeMenu === 'akun'">
          <h3>Informasi Akun</h3>

          <div class="form">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input type="text" :value="user.name" readonly />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" :value="user.email" readonly />
            </div>
          </div>
        </div>

        <!-- GANTI PASSWORD -->
        <div v-if="activeMenu === 'password'">
          <h3>Ganti Password</h3>

          <div class="form">
            <div class="form-group">
              <label>Password Lama</label>
              <div class="password-wrapper">
                <input
                  :type="showOld ? 'text' : 'password'"
                  v-model="oldPassword"
                />
                <span class="toggle" @click="showOld = !showOld">
                  <i class="eye" :class="{ active: showOld }"></i>
                </span>
              </div>
            </div>

            <div class="form-group">
              <label>Password Baru</label>
              <div class="password-wrapper">
                <input
                  :type="showNew ? 'text' : 'password'"
                  v-model="newPassword"
                />
                <span class="toggle" @click="showNew = !showNew">
                  <i class="eye" :class="{ active: showNew }"></i>
                </span>
              </div>

            </div>

            <div class="form-group">
              <label>Konfirmasi Password Baru</label>
              <div class="password-wrapper">
                <input
                  :type="showConfirm ? 'text' : 'password'"
                  v-model="confirmPassword"
                />
                <span class="toggle" @click="showConfirm = !showConfirm">
                  <i class="eye" :class="{ active: showConfirm }"></i>
                </span>
              </div>
            </div>

            <button class="btn-primary" @click="changePassword">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "Profile",

  data() {
    return {
      user: {},
      activeMenu: "akun",

      oldPassword: "",
      newPassword: "",
      confirmPassword: "",

      showOld: false,
      showNew: false,
      showConfirm: false,
    };
  },

  computed: {
    userInitial() {
      return this.user?.name
        ? this.user.name.charAt(0).toUpperCase()
        : "U";
    },
  },

  mounted() {
    const data = localStorage.getItem("user");
    if (!data) {
      this.$router.push("/login");
      return;
    }
    this.user = JSON.parse(data);
  },

  methods: {
    async changePassword() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        alert("Semua field wajib diisi");
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert("Konfirmasi password tidak cocok");
        return;
      }

      try {
        const res = await api.patch("/api/users/change-password", {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });

        alert(res.data.message);

        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";

      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Gagal ganti password");
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 70px;
  display:flexbox
}
.profile-content {
  flex: 1;
  background: #ffffff;
  border-radius: 0 16px 16px 0;
  padding: 32px;
}

.profile-card {
  display: flex;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  width: 100%;
  min-height: 100%;
}
.sidebar-footer {
  margin-top: 12px;
}

.sidebar {
  width: 260px;
  background: #f1f5f9;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #1f2933;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.role {
  font-size: 12px;
  color: #64748b;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;

}

.menu li {
  padding: 10px 12px;
  cursor: pointer;
}

.menu li.active {
  background: #e0f2fe;
  color: #0284c7;
  font-weight: 600;
}

.logout {
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  padding: 10px 12px;
}


.content {
  flex: 1;
  padding: 32px;
}

.form {
  max-width: 520px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
  display: block;
}

input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn-primary {
  background: #243e47;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}


.password-wrapper {
  position: relative;
}

.toggle {
  position: absolute;
  right: 14px;
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
  opacity: 0.6;
  transition: opacity 0.15s ease, transform 0.15s ease;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>");
}

.toggle:hover .eye {
  opacity: 1;
}

.eye.active {
  transform: scale(0.9);
  opacity: 1;
}

</style>

