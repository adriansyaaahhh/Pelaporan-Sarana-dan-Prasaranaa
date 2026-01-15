<template>
  <header class="navbar">
    <!-- LEFT -->
    <div class="nav-left">
      <span class="logo">Lapor<span>Pekanbaru.</span></span>
    </div>

    <!-- RIGHT -->
    <div class="nav-right">
      <!-- MENU -->
      <nav class="menu">
        <router-link to="/beranda">Beranda</router-link>
        <router-link to="/buat-laporan">Buat Laporan</router-link>
        <router-link to="/riwayat">Riwayat Laporan</router-link>
      </nav>

      <!-- BELUM LOGIN -->
      <router-link
        v-if="!user"
        to="/login"
        class="btn-login"
      >
        Masuk
      </router-link>

      <!-- SUDAH LOGIN -->
      <div
        v-else
        class="user-box"
        @click="$router.push('/profile')"
      >
        <div class="avatar">
          {{ avatarInitial }}
        </div>
        <span class="username">
          {{ user.name }}
        </span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Navbar",

  data() {
    return {
      user: null,
    };
  },

  computed: {
    avatarInitial() {
      return this.user?.name
        ? this.user.name.charAt(0).toUpperCase()
        : "U";
    },
  },

  methods: {
    loadUser() {
      const data = localStorage.getItem("user");
      this.user = data ? JSON.parse(data) : null;
    },

    handleStorageChange(e) {
      if (e.key === "user" || e.key === "token") {
        this.loadUser();
      }
    },
  },

  mounted() {
    // load awal
    this.loadUser();

    // custom event (login & logout)
    window.addEventListener("auth-change", this.loadUser);

    // untuk multi-tab / refresh
    window.addEventListener("storage", this.handleStorageChange);
  },

  beforeUnmount() {
    window.removeEventListener("auth-change", this.loadUser);
    window.removeEventListener("storage", this.handleStorageChange);
  },
};
</script>

<style scoped>
.navbar {
  height: 64px;
  padding: 0 48px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: #1abc9c;
}
.logo span {
  color: #1f2937;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 28px;
}

.menu {
  display: flex;
  gap: 24px;
}
.menu a {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}
.menu a.router-link-active {
  color: #1abc9c;
  font-weight: 600;
}

.btn-login {
  font-size: 14px;
  font-weight: 600;
  color: #7c3aed;
  text-decoration: none;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 999px;
}
.user-box:hover {
  background: #f1f5f9;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1abc9c, #16a085);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}
</style>
