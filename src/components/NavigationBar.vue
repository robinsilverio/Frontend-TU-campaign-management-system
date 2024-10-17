<script setup>
</script>
<template>
    <header>
        <div class="logo">
            <img alt="Technische unie" class="logo" src="@/assets/images/TU-logo.png" />
            <h1>Admin panel campaign management tool</h1>
        </div>
        <div class="wrapper">
            <p>Welkom {{ this.displayUsername }}</p>
            <a class="logout-button" @click="logout">Logout</a>
        </div>
    </header>
</template>
<script>
import store from "@/store";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export default {
    name: 'NavigationBar',
    computed: {
      displayUsername() {

        const token = Cookies.get('jwtToken');
        
        if (token) {
          try {
            const decodedToken = jwtDecode(token); // Decode the JWT
            return decodedToken.sub; // Assuming 'sub' contains the username (like "T14832")
          } catch (error) {
            console.error('Failed to decode JWT:', error);
            return '';
          }
        }
        return '';
      }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/');
            this.$toast.success("U bent uitgelogd.");
        }
    }
}
</script>
<style scoped>
header, header .wrapper, header .logo {
    display: flex;
}
header {
    background-color: var(--TU-color);
    color: #FFF;
    padding: 5px;
    display: flex;
    justify-content: space-between;
}

.wrapper p {
    margin-right: 10px;
}

.wrapper p, .wrapper .logout-button {
    position: relative;
    top: 10px;
}

.wrapper .logout-button {
  cursor: pointer;
}

@media (min-width: 320px) {
  .logo { gap: 15px; }
  .logo img {
    height: 70px;
    width: 70px;
  }
  .logo h1 { font-size: 0.86rem; }
  header .wrapper p, header .wrapper .logout-button {
    position: relative;
    top: 0px;
  }
  header .wrapper {
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 375px) {
  .logo h1 { font-size: 1.26rem; }
}

@media (min-width: 425px) {
  .logo {
    gap: 20px;
  }
  .wrapper p, .wrapper .logout-button {
    top: 10px;
  }
}

@media (min-width: 577px) {
  .logo h1 { font-size: 1.36rem; }
}

</style>