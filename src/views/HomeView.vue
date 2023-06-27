<script setup>
</script>

<template>
  <main class="home-screen">
    <div class="TU-CMT-login-screen">
      <div class="login-screen-header">
        <div class="logo">
          <img src="../assets/images/TU-logo.png" alt="Technische Unie" title="" height="96" width="96" />
        </div>
        <h1>Technische Unie Campaign management tool</h1>
      </div>
      <div class="login-screen-body">
        <form name="login" @submit.prevent="login">
          <div class="form-inputs">
            <div class="form-control">
              <label for="username">Username: </label>
              <input type="text" v-model="loginUsername" name="username" id="username" placeholder="Username">  
            </div>
            <div class="form-control">
              <label for="password">Password: </label>
              <input type="password" v-model="loginPassword" name="password" id="password" placeholder="Password">
            </div>
          </div>
          <div class="form-control">
            <button>Login</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script>
  export default {
    name: 'Home Screen',
    data() {
      return {
        loginUsername : '',
        loginPassword: ''
      }
    },
    methods : {
      login() {
        if(this.loginUsername != 'Robin' && this.loginPassword != 'test123') {
          this.$toast.error('De ingevoerde gebruikersnaam of het ingevoerde wachtwoord is ongeldig.')
        } else {
          this.$router.push('/admin')
        }
      }
    }
  }
</script>
<style scoped>

@import '../assets/base.css';
.home-screen{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.TU-CMT-login-screen {
  width: 500px;
  height: 370px;
  background-color: var(--TU-color);
  border: 1px solid #BBB;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
.TU-CMT-login-screen .login-screen-header h1 {
  color: var(--vt-c-white);
}
.login-screen-body form .form-inputs {
  display: flex;
}
</style>
