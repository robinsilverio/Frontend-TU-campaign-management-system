<script setup>
    import NavigationBar from '../components/NavigationBar.vue';
    import WarningModal from "@/components/WarningModal.vue";
    import CampaignsList from "@/components/sidebar/CampaignsList.vue";
</script>
<template>
    <NavigationBar></NavigationBar>
    <WarningModal
        :list-of-selected-campaigns="selectedCampaigns"
        v-if="this.userAction === 'delete'"
        @onModalClosed="onModalClosed"
    ></WarningModal>
    <main class="admin-panel">
        <div class="campaigns-sidebar">
            <div class="sidebar-menu">
              <button class="delete-btn-primary" @click="openWarningModalUponDeletion()">Delete</button>
              <button class="create-button">Create campaign</button>
            </div>
            <campaigns-list
                :campaignMappings="this.campaignMappings"
                @onSelectAllCheckBoxes="onSelectAllCheckBoxes"
                :resetSelectAll="resetSelectAll"></campaigns-list>
        </div>
        <div class="display-component"></div>
    </main>
</template>
<script>
    export default {
        name: 'AdminPanel',
        data() {
            return {
                campaignMappings: [],
                resetSelectAll: false,
                userAction: '',
            }
        },
        computed : {
            selectedCampaigns() {
              return this.campaignMappings
                  .filter(campaignMapping => campaignMapping.checked)
                  .map(campaignMapping => campaignMapping.campaign);
            }
        },
        methods: {
            openWarningModalUponDeletion() {
              if (this.selectedCampaigns.length > 0) {
                this.userAction = 'delete';
              } else {
                this.$toast.warning('Selecteer een campagne om te verwijderen.');
              }
            },
            onModalClosed() {
              this.userAction = '';
              this.campaignMappings.forEach((campaignMapping) => {
                if (campaignMapping.checked) campaignMapping.checked = false;
              });
              this.resetSelectAll = true;
              this.$nextTick(() => {
                this.resetSelectAll = false; // Revert this to false after resetting.
              });
            },
            onSelectAllCheckBoxes(state) {
              this.campaignMappings.forEach(campaignMapping => {
                campaignMapping.checked = state;
              });
            }
        },
        mounted() {
          this.$store.dispatch('retrieveCampaigns')
              .then(
                  success => {
                    this.campaignMappings = this.$store.getters.getCampaigns;
                  },
                  error => {
                    this.$toast.error('Er is een fout opgetreden tijdens het laden van campagnes. Probeer het later opnieuw.');
                    console.log(error);
                  }
              );
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