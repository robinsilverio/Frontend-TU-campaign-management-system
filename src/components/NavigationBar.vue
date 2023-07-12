<script setup>
</script>
<template>
    <header>
        <div class="logo">
            <img alt="Technische unie" class="logo" src="@/assets/images/TU-logo.png" width="60" height="55" />
            <h1>Admin panel campaign management tool</h1>
        </div>
        <div class="wrapper">
            <p>Welkom Robin</p>
            <a class="logout-button" @click="logout">Logout</a>
        </div>
    </header>
</template>
<script>
export default {
    name: 'NavigationBar',
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

header .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

}
.wrapper p {
    margin-right: 10px;
}

.wrapper p, .wrapper .logout-button {
    position: relative;
    top: 10px;
}

.logo {
    display: flex;
    gap: 20px;
}
</style>