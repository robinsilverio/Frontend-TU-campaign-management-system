<script setup>
    import NavigationBar from '../components/NavigationBar.vue';
    import SideBar from "@/components/SideBar.vue";
</script>
<template>
    <NavigationBar></NavigationBar>
    <main class="admin-panel">
        <SideBar :user-action="this.userAction" @changeUserAction="changeUserAction"></SideBar>
        <div class="display-component"></div>
    </main>
</template>
<script>
    export default {
        name: 'AdminPanel',
        data() {
          return {
            userAction: 'none'
          }
        },
        methods: {
          changeUserAction(action) {
            this.userAction = action;
          }
        }
    }
</script>
<style>
    .admin-panel {
        display: flex;
    }
    .campaigns-sidebar {
        width: 25%;
        background-color: #FFF;
        border-right: 1px solid #a6a3aa;
        border-left: 1px solid #A6A3AA;
        border-bottom: 1px solid #A6A3AA;
    }
    .campaigns-sidebar .sidebar-menu, .campaigns-list {
      padding: 10px;
    }
    .campaigns-sidebar .sidebar-menu {
      display: flex;
      justify-content: flex-end;
      gap: 5px;
    }
    .campaigns-sidebar .sidebar-menu button {
        border: 0px solid;
        padding: 10px;
        color: #FFF;
        cursor: pointer;
    }
    .campaigns-sidebar .sidebar-menu .delete-btn-primary {
      background-color: red;
    }
    .campaigns-sidebar .sidebar-menu .create-button {
        background-color: green;
    }

    @media (min-width: 320px) {
      main.admin-panel {
        flex-direction: column;
      }
      main.admin-panel .campaigns-sidebar {
        width: 100%;
        height: 410px;
      }
      main.admin-panel .display-component {
        height: 100vh;
        width: 100vw;
      }
    }

    @media (min-width: 768px) {
      main.admin-panel {
        flex-direction: row;
      }
      main.admin-panel .campaigns-sidebar {
        width: 50%;
        height: 100vh;
      }
    }

</style>