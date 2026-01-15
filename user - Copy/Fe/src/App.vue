<template>
  <!-- NAVBAR HANYA UNTUK USER -->
  <Navbar v-if="showNavbar" />

  <router-view />
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: { Navbar },
  computed: {
    showNavbar() {
      return !this.$route.path.startsWith("/admin") &&
             !this.$route.path.startsWith("/dinas");
    },
  },
};
</script>
