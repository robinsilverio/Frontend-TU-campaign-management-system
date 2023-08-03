<script setup>
    import NavigationBar from '../components/NavigationBar.vue';
    import SideBar from "@/components/SideBar.vue";
    import FormPage from "@/components/FormPage.vue";
</script>
<template>
    <NavigationBar></NavigationBar>
    <main class="admin-panel">
        <SideBar :user-action="this.userAction" @changeUserAction="changeUserAction"></SideBar>
        <div class="display-component">
          <FormPage
              v-if="this.userAction !== 'none' && this.userAction !== 'delete'"
              :user-action="userAction"
              :selected-campaign="this.selectedCampaignForUpdate"
              @changeUserAction="changeUserAction"></FormPage>
        </div>
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
        computed: {
          selectedCampaignForUpdate() {
            return this.$store.getters.getSelectedCampaign;
          }
        },
        watch: {
          selectedCampaignForUpdate(campaign) {
            this.changeUserAction('update');
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