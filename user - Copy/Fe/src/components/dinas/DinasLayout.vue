<template>
  <div class="dinas-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h2 class="logo">
        Dinas<span>PU</span>
      </h2>

      <ul class="menu">
        <li
          :class="{ active: $route.path === '/dinas/dashboard' }"
          @click="$router.push('/dinas/dashboard')"
        >
          📥 Laporan Masuk
        </li>

        <li
          :class="{ active: $route.path === '/dinas/riwayat' }"
          @click="$router.push('/dinas/riwayat')"
        >
          ✅ Riwayat Selesai
        </li>
      </ul>

      <button class="logout" @click="logout">
        Log Out
      </button>
    </aside>

    <!-- CONTENT -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>



<script>
export default {
  name: "DinasLayout",
  computed: {
    // 🔥 TRUE hanya di dashboard
    isDashboard() {
      return this.$route.path === "/dinas/dashboard";
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/dinas/login");
    },
  },
};
</script>



<style scoped>
.dinas-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #1f3a44;
  color: #fff;
  padding: 28px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 22px;
  margin-bottom: 30px;
}

.logo span {
  color: #36c6b3;
}

.menu {
  list-style: none;
  padding: 0;
  flex: 1;
}

.menu li {
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 6px;
  color: #cbd5e1;
}

.menu li.active {
  background: #2d5c68;
  color: #fff;
  font-weight: 600;
}

.logout {
  background: none;
  border: none;
  color: #ffb4b4;
  cursor: pointer;
  text-align: left;
}

.content {
  flex: 1;
  padding: 32px;
  background: #f4f7fb;
}
</style>


