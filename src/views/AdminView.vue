<script setup>
    import NavigationBar from '../components/NavigationBar.vue';
    import WarningModal from "@/components/WarningModal.vue";
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
            <div class="campaigns-list">
              <div class="select-all-item">
                <div class="default-info">
                  <input type="checkbox" id="myCheckbox" v-model="selectAll" @change="handleSelectAllCampaigns()">
                  <label>Selecteer alles</label>
                </div>
              </div>
              <div class="campaign" v-for="(campaignMapping, index) in campaignMappings" :key="index">
                <div class="campaign-short-info">
                  <input type="checkbox" :id="'myCheckbox-'+ index" v-model="campaignMapping.checked" @change="handleCampaignSelection(campaignMapping)">
                  <label>{{ campaignMapping.campaign.title }}</label>
                </div>
              </div>
            </div>
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
                selectedCampaigns: [],
                selectAll: false,
                userAction: ''
            }
        },
        methods: {
            handleSelectAllCampaigns() {
              this.campaignMappings.forEach(campaignMapping => {
                campaignMapping.checked = this.selectAll;
                let campaign = campaignMapping.campaign;
                if (this.selectAll) {
                  this.selectedCampaigns.push(campaign);
                } else {
                  let indexOfCampaignInList = this.selectedCampaigns.indexOf(campaign);
                  this.selectedCampaigns.splice(indexOfCampaignInList, 1);
                }
              });
            },
            handleCampaignSelection(paramCampaignMapping) {
              if (paramCampaignMapping.checked) {
                  this.selectedCampaigns.push(paramCampaignMapping.campaign);
              } else {
                  const indexOfCampaign = this.selectedCampaigns.indexOf(paramCampaignMapping.campaign);
                  this.selectedCampaigns.splice(indexOfCampaign, 1);
              }
            },
            openWarningModalUponDeletion() {
              if (this.selectedCampaigns.length > 0) {
                this.userAction = 'delete';
              } else {
                this.$toast.warning('Selecteer een campagne om te verwijderen.');
              }
            },
            onModalClosed() {
              this.userAction = '';
              this.selectedCampaigns = [];
              this.campaignMappings.forEach((campaignMapping) => {
                if (campaignMapping.checked) campaignMapping.checked = false;
              });
            },
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
    .campaigns-sidebar .campaigns-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
        border-top: 1px solid #A6A3AA;
    }
    .campaigns-sidebar .campaigns-list .campaign, .select-all-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0px;
    }
    .campaigns-sidebar .campaigns-list .campaign .campaign-short-info, .default-info {
        display: flex;
        gap: 20px;
    }

    .campaigns-sidebar .campaigns-list .campaign .campaign-short-info label, .default-info label {
        font-size: 0.9rem;
    }

    .campaigns-sidebar .campaigns-list .campaign .delete-btn-secondary {
      background-color: transparent;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }

    .campaigns-sidebar .campaigns-list .campaign .delete-btn-secondary:hover {
      color: red;
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
      main.admin-panel .campaigns-sidebar .campaigns-list {
        overflow: auto;
        height: 87%;
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
      main.admin-panel .campaigns-sidebar .campaigns-list {
        height: 94%;
      }
    }

</style>