<script setup>
    import NavigationBar from '../components/NavigationBar.vue';
</script>
<template>
    <NavigationBar></NavigationBar>
    <main class="not-found">
        <h1>404 - page not found</h1>
    </main>
</template>
<script>
    export default {}
</script>
<style scoped>
    main.not-found {
        height: 100vh;
        padding: 10px;
    }
</style>