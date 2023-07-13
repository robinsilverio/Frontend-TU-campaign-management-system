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
          <div class="errorMessageContainer" v-if="this.errors.length > 0">
              <p v-for="(error, index) in this.errors" :key="index"> {{ error }}</p>
          </div>
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
  import LoginDTO from '../models/LoginDTO'
  export default {
    name: 'HomeScreen',
    data() {
      return {
        loginUsername : '',
        loginPassword: '',
        errors: [],
        authUser: new LoginDTO()
      }
    },
    methods : {
      login() {

        if (this.loginUsername == "" && this.loginPassword == "") {
          this.errors.push("Het inlogveld is leeg");
        } else {
          this.authUser.username = this.loginUsername;
          this.authUser.password = this.loginPassword;
          this.$store.dispatch('login', this.authUser)
          .then(
            success => {
              this.$toast.success("Inloggen succesvol");
              this.$router.push("/admin");
            },
            error => {
              this.$toast.error(error.response.data.message);
            }
          );
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
.login-screen-body form .form-inputs label { color: #FFF; }
.login-screen-body form .errorMessageContainer p {
  color: red;
  font-weight: bold;
  font-size: 0.8rem;
}
</style>
