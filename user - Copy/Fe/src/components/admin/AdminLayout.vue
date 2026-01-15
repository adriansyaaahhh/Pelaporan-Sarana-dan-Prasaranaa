<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h2 class="logo">Admin<span>Panel</span>.</h2>

      <ul class="menu">
        <li
          :class="{ active: isActive('/admin/dashboard') }"
          @click="$router.push('/admin/dashboard')"
        >
          <span class="indicator"></span>
          Verifikasi Laporan
        </li>

        <li
          :class="{ active: isActive('/admin/users') }"
          @click="$router.push('/admin/users')"
        >
          <span class="indicator"></span>
          Manajemen User
        </li>
      </ul>

      <button class="logout" @click="logout">
        Log Out
      </button>
    </aside>

    <!-- MAIN -->
    <div class="main">
      <header class="header">
        <h3>{{ pageTitle }}</h3>

        <div class="admin-info">
          <span>Super Admin</span>
          <div class="avatar">A</div>
        </div>
      </header>

      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminLayout",
  computed: {
    pageTitle() {
      const path = this.$route.path;

      if (path.includes("/admin/dashboard"))
        return "Verifikasi Laporan Masuk";

      if (path.includes("/admin/users"))
        return "Manajemen User";

      if (path.includes("/admin/dinas"))
        return "Data Dinas";

      return "Admin Panel";
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/admin/login");
    },
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
  },
};
</script>

<style scoped>
/* LAYOUT */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f7fb;
}

/* SIDEBAR */
.sidebar {
  width: 240px;
  background: #1f3a44;
  color: #fff;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 0 24px;
  font-size: 22px;
  margin-bottom: 24px;
}

.logo span {
  color: #36c6b3;
}

/* MENU */
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.menu li {
  position: relative;
  padding: 12px 24px;
  cursor: pointer;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu li:hover {
  background: rgba(255, 255, 255, 0.05);
}

.menu li.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

/* 🔥 BAR HIJAU KIRI */
.menu li .indicator {
  width: 4px;
  height: 100%;
  background: transparent;
  border-radius: 0 4px 4px 0;
}

.menu li.active .indicator {
  background: #36c6b3;
}

/* LOGOUT */
.logout {
  margin: 16px 24px;
  background: none;
  border: none;
  color: #ffb4b4;
  text-align: left;
  cursor: pointer;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  background: #1f3a44;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  padding: 24px;
}
</style>
