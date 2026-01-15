import { createRouter, createWebHistory } from "vue-router";

import Beranda from "../components/Beranda.vue";

// USER AUTH
import Login from "../components/Autentikasi/Login.vue";
import Register from "../components/Autentikasi/Daftar.vue";
import ForgotPassword from "../components/Autentikasi/LupaPW.vue";

// USER LAPORAN
import BuatLaporan from "../components/BuatLaporan.vue";
import RiwayatLaporan from "../components/RiwayatLaporan.vue";
import DetailLaporan from "../components/DetailLaporan.vue";
import Profile from "../components/Profile.vue";

// ADMIN
import LoginAdmin from "../components/Autentikasi/LoginAdmin.vue";
import AdminLayout from "../components/admin/AdminLayout.vue";
import AdminDashboard from "../components/admin/AdminDashboard.vue";
import AdminDetailLaporan from "../components/admin/AdminDetailLaporan.vue";
import AdminManajemenUser from "../components/admin/AdminManajemenUser.vue";

// DINAS
import LoginDinas from "../components/Autentikasi/LoginDinas.vue";
import DinasLayout from "../components/dinas/DinasLayout.vue";
import DinasDashboard from "../components/dinas/DinasDashboard.vue";
import DinasSelesaiTugas from "../components/dinas/DinasSelesaiTugas.vue";
import DinasRiwayatSelesai from "../components/dinas/DinasRiwayatSelesai.vue";
import DinasDetailRiwayat from "../components/dinas/DinasDetailRiwayat.vue";

const routes = [
  { path: "/", redirect: "/beranda" },
  { path: "/beranda", component: Beranda },

  /* ========= USER ========= */
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },

  {
    path: "/buat-laporan",
    component: BuatLaporan,
    meta: { requiresAuth: true, role: "masyarakat" },
  },

{
  path: "/riwayat",
  component: RiwayatLaporan,
  meta: { requiresAuth: true, role: "masyarakat" },
},
{
  path: "/riwayat/:id",
  component: DetailLaporan,
  meta: { requiresAuth: true, role: "masyarakat" },
},


  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true, role: "masyarakat" },
  },

  /* ========= ADMIN ========= */
  { path: "/admin/login", component: LoginAdmin },

  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "dashboard", component: AdminDashboard },
      { path: "laporan/:id", component: AdminDetailLaporan },
      { path: "users", component: AdminManajemenUser },
    ],
  },

  /* ========= DINAS ========= */
  { path: "/dinas/login", component: LoginDinas },

  {
    path: "/dinas",
    component: DinasLayout,
    meta: { requiresAuth: true, role: "dinas" },
    children: [
      { path: "dashboard", component: DinasDashboard },
      { path: "selesai/:id", component: DinasSelesaiTugas },
      { path: "riwayat", component: DinasRiwayatSelesai },
      { path: "riwayat-selesai/:id", component: DinasDetailRiwayat },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* =========================
   🔐 GLOBAL ROUTE GUARD (JWT)
========================= */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // ================= ADMIN LOGIN =================
  if (to.path === "/admin/login") {
    // ADMIN boleh buka login meskipun user login
    if (token && user?.role === "admin") {
      return next("/admin/dashboard");
    }
    return next();
  }

  // ================= DINAS LOGIN =================
  if (to.path === "/dinas/login") {
    if (token && user?.role === "dinas") {
      return next("/dinas/dashboard");
    }
    return next();
  }

  // ================= USER LOGIN =================
  if (to.path === "/login") {
    if (token && user?.role === "masyarakat") {
      return next("/beranda");
    }
    return next();
  }

  // ================= PROTECTED ROUTES =================
  if (to.meta.requiresAuth) {
    if (!token || !user) {
      if (to.meta.role === "admin") return next("/admin/login");
      if (to.meta.role === "dinas") return next("/dinas/login");
      return next("/login");
    }

    if (to.meta.role && to.meta.role !== user.role) {
      // SALAH ROLE → logout paksa
      localStorage.clear();
      if (to.meta.role === "admin") return next("/admin/login");
      if (to.meta.role === "dinas") return next("/dinas/login");
      return next("/login");
    }
  }

  next();
});



export default router;
