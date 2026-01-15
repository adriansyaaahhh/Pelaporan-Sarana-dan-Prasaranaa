<template>
  <div class="page">
    <!-- HEADER -->
    <div class="page-header">
      <h1>Manajemen Pengguna Sistem</h1>
      <p class="subtitle">Kelola akun pengguna dan status akses</p>
    </div>
    <!-- POPUP KONFIRMASI BLOKIR -->
<div v-if="showConfirm" class="modal-overlay">
  <div class="confirm-modal">
    <h3>Konfirmasi Tindakan</h3>

    <p>
      Apakah Anda yakin ingin
      <strong>
        {{ selectedUser.statusUser === 'aktif'
          ? 'MEMBLOKIR'
          : 'MENGAKTIFKAN' }}
      </strong>
      pengguna
      <strong>"{{ selectedUser.name }}"</strong>?
    </p>

    <p class="note" v-if="selectedUser.statusUser === 'aktif'">
      Pengguna yang diblokir tidak akan bisa login ke sistem.
    </p>

    <div class="modal-actions">
      <button class="btn-cancel" @click="cancelToggle">
        Batal
      </button>

      <button
        class="btn-confirm"
        :class="selectedUser.statusUser === 'aktif'
          ? 'danger'
          : 'success'"
        @click="confirmToggle"
      >
        Ya, {{ selectedUser.statusUser === 'aktif'
          ? 'Blokir'
          : 'Aktifkan' }}
      </button>
    </div>
  </div>
</div>


    <!-- CARD -->
    <div class="card">
      <!-- TOOLBAR -->
      <div class="toolbar">
        <input
          v-model="keyword"
          type="text"
          placeholder="Cari nama atau email..."
        />

        <button class="btn-add" @click="openAdd">
          + Tambah Pengguna
        </button>
      </div>

      <!-- TABLE -->
      <table>
        <thead>
          <tr>
            <th class="col-user">Pengguna</th>
            <th class="col-role">Peran</th>
            <th class="col-status">Status</th>
            <th class="col-action">Aksi</th>

          </tr>
        </thead>

        <tbody>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4" class="empty">
              Tidak ada data pengguna
            </td>
          </tr>

          <tr v-for="u in filteredUsers" :key="u._id">
            <td class="col-user">
              <strong>{{ u.name }}</strong><br />
              <small>{{ u.email }}</small>
            </td>

            <td class="col-role">
              {{ u.role }}
            </td>
            <td class="col-status">
              <span class="status" :class="u.statusUser">
                {{ u.statusUser.toUpperCase() }}
              </span>
            </td>

            <td class="col-action">
              <div class="action-wrap">
                <button
                  class="btn-toggle"
                  :class="u.statusUser === 'aktif' ? 'danger' : 'success'"
                  @click="toggleStatus(u)"
                >
                  {{ u.statusUser === 'aktif' ? 'Blokir' : 'Aktifkan' }}
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL TAMBAH -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Tambah Pengguna</h3>

        <div class="form-group">
          <label>Nama</label>
          <input v-model="form.name" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" />
        </div>

        <div class="form-group">
          <label>Password</label>

          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              autocomplete="new-password"
            />

            <span
              class="password-toggle"
              @click="showPassword = !showPassword"
            ></span>
          </div>
        </div>


        <div class="form-group">
          <label>Role</label>
          <select v-model="form.role">
            <option value="masyarakat">Masyarakat</option>
            <option value="dinas">Dinas</option>
          </select>
        </div>

        <div class="form-group" v-if="form.role === 'masyarakat'">
          <label>NIK</label>
          <input v-model="form.nik" />
        </div>

        <div class="form-group" v-if="form.role === 'dinas'">
          <label>NIP</label>
          <input v-model="form.nip" />
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">
            Batal
          </button>
          <button class="btn-save" @click="saveUser">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "AdminManajemenUser",

  data() {
    return {
      users: [],
      keyword: "",
      showModal: false,
      // 🔥 TAMBAHAN UNTUK POPUP KONFIRMASI
      showConfirm: false,
      selectedUser: null,
      showPassword: false,
      form: {
        name: "",
        email: "",
        password: "",
        role: "masyarakat",
        nik: "",
        nip: "",
      },
    };
  },

  mounted() {
    this.fetchUsers();
  },

  computed: {
    filteredUsers() {
      return this.users
        .filter(u => u.role !== "admin")
        .filter(
          u =>
            u.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
            u.email.toLowerCase().includes(this.keyword.toLowerCase())
        );
    },
  },

  methods: {
    // ✅ FIX: endpoint benar
    async fetchUsers() {
      const res = await api.get("/api/users");
      this.users = res.data;
    },

    openAdd() {
      this.showModal = true;
      this.form = {
        name: "",
        email: "",
        password: "",
        role: "masyarakat",
        nik: "",
        nip: "",
      };
    },

    closeModal() {
      this.showModal = false;
    },

    // ✅ FIX: endpoint benar
    async saveUser() {
      try {
        await api.post("/api/users", this.form);
        alert("✅ Pengguna berhasil ditambahkan");
        this.closeModal();
        this.fetchUsers();
      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Gagal menambahkan pengguna"
        );
      }
    },

    toggleStatus(user) {
      this.selectedUser = user;
      this.showConfirm = true;
    },

    async confirmToggle() {
      const user = this.selectedUser;
      const newStatus =
        user.statusUser === "aktif" ? "diblokir" : "aktif";

      try {
        await api.patch(
          `/api/users/${user._id}/status`,
          { statusUser: newStatus }
        );

        this.showConfirm = false;
        this.selectedUser = null;
        this.fetchUsers();
      } catch (err) {
        alert("Gagal mengubah status pengguna");
      }
    },

    cancelToggle() {
      this.showConfirm = false;
      this.selectedUser = null;
    },

  },
};
</script>

<style scoped>

.page {
  max-width: 1100px;
  margin: 0 auto;
}


.page-header {
  margin-bottom: 20px;
}

.subtitle {
  color: #64748b;
  font-size: 14px;
}

.btn-add {
  background: #36c6b3;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar input {
  width: 260px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.col-action {
  width: 20%;
  text-align: center;
}

.action-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 🔥 kunci layout */
}
.col-user {
  width: 40%;
}

.col-role {
  width: 20%;
}

.col-status {
  width: 20%;
  text-align: center;
}


th {
  text-align: left;
  font-size: 12px;
  color: #64748b;
  padding-bottom: 12px;
}

td {
  padding: 14px 0;
  border-top: 1px solid #eef2f7;
}

.col-action {
  text-align: right;
}

.status {
  padding: 4px 12px;
  font-size: 11px;
  border-radius: 20px;
  font-weight: 600;
}

.status.aktif {
  background: #dcfce7;
  color: #166534;
}

.status.diblokir {
  background: #fee2e2;
  color: #991b1b;
}

.empty {
  text-align: center;
  padding: 30px;
  color: #999;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  width: 420px;
  border-radius: 14px;
  padding: 24px;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  font-size: 12px;
  color: #64748b;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 26px;
}

/* RESET BUTTON */
.modal-actions button {
  min-width: 110px;
  height: 40px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel,
.btn-confirm {
  min-width: 100px;
  height: 35px;
  padding: 0 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

/* SIMPAN (HIJAU PROFESIONAL) */
.btn-save {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #ffffff;
  border: none;
  box-shadow: 0 6px 14px rgba(34, 197, 94, 0.35);
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(34, 197, 94, 0.45);
}

.btn-save:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);
}


/* ===== BUTTON BLOKIR / AKTIFKAN (STYLE EXPERT) ===== */
.btn-toggle {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* kondisi AKTIF → tombol BLOKIR */
.btn-toggle.danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn-toggle.danger:hover {
  background: #fecaca;
}

/* kondisi DIBLOKIR → tombol AKTIFKAN */
.btn-toggle.success {
  background: #dcfce7;
  color: #166534;
}

.btn-toggle.success:hover {
  background: #bbf7d0;
}

/* ===== POPUP KONFIRMASI ===== */
.confirm-modal {
  background: #ffffff;
  width: 420px;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
}

.confirm-modal h3 {
  margin-bottom: 12px;
}

.confirm-modal p {
  font-size: 14px;
  color: #334155;
}

.confirm-modal .note {
  font-size: 13px;
  color: #b91c1c;
  margin-top: 8px;
}

/* ===== BLOKIR ===== */
.btn-confirm.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  box-shadow: 0 6px 14px rgba(239, 68, 68, 0.35);
}

.btn-confirm.danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(239, 68, 68, 0.45);
}

.btn-confirm.danger:active {
  transform: translateY(0);
}

/* ===== AKTIFKAN ===== */
.btn-confirm.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 6px 14px rgba(16, 185, 129, 0.35);
}

.btn-confirm.success:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(16, 185, 129, 0.45);
}

/* ===== ISI TABEL ===== */
td {
  padding: 16px 0;
  vertical-align: middle; /* 🔥 sejajar tengah */
}

td.col-status,
td.col-action {
  text-align: center;
}
th.col-status,
th.col-action {
  text-align: center;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 100%;
  padding-right: 44px;
}

.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.6;
}
/* MATA BUKA */
.password-wrapper input[type='text'] + .password-toggle {
  opacity: 1;
}

/* MATA TUTUP */
.password-toggle {
  background-image: url("data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'>\
  <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/>\
  <circle cx='12' cy='12' r='3'/>\
  </svg>");
}



</style>