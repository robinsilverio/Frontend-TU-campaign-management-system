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
              <button class="create-button">Create campaign</button>
            </div>
            <div class="campaigns-list">
                <div class="campaign" v-for="(campaignMapping, index) in campaignMappings" :key="index">
                  <div class="campaign-short-info">
                    <input type="checkbox" id="myCheckbox" v-model="campaignMapping.campaign.checked" @change="handleCampaignSelection(campaignMapping.campaign)">
                    <label>{{ campaignMapping.campaign.title }}</label>
                  </div>
                  <button class="delete-btn" @click="openWarningModalUponDeletion(campaignMapping.campaign)">
                    &times;
                  </button>
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
                userAction: ''
            }
        },
        methods: {
            handleCampaignSelection(paramCampaign) {
                if (paramCampaign.checked) {
                    this.selectedCampaigns.push(paramCampaign);
                } else {
                    const indexOfCampaign = this.selectedCampaigns.indexOf(paramCampaign);
                    this.selectedCampaigns.splice(indexOfCampaign, 1);
                }
            },
            openWarningModalUponDeletion(paramCampaign) {
              this.userAction = 'delete';
              this.selectedCampaigns.push(paramCampaign);
            },
            onModalClosed() {
              this.userAction = '';
              this.selectedCampaigns = [];
            },
        },
        mounted() {
          this.$store.dispatch('retrieveCampaigns')
              .then(
                  success => {
                    this.campaignMappings = this.$store.getters.getCampaigns;
                  },
                  error => {
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
    .admin-panel, .campaigns-sidebar, .display-component {
        height: 100vh;
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
    }
    .campaigns-sidebar .sidebar-menu button {
        border: 0px solid;
        padding: 10px;
        color: #FFF;
    }
    .campaigns-sidebar .sidebar-menu .create-button {
        background-color: green;
    }
    .campaigns-sidebar .campaigns-list {
        display: flex;
        height: 50%;
        flex-direction: column;
        gap: 5px;
        border-top: 1px solid #A6A3AA;
    }
    .campaigns-sidebar .campaigns-list .campaign {
        display: flex;
        justify-content: space-between;
        padding: 5px 0px;
    }
    .campaigns-sidebar .campaigns-list .campaign .campaign-short-info {
        display: flex;
        gap: 20px;
    }

    .campaigns-sidebar .campaigns-list .campaign .campaign-short-info input#myCheckbox {
      position: relative;
      bottom: 3px;
    }
    .campaigns-sidebar .campaigns-list .campaign .campaign-short-info label {
        font-size: 0.9rem;
    }

    .campaigns-sidebar .campaigns-list .campaign .delete-btn {
      background-color: transparent;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }

    .campaigns-sidebar .campaigns-list .campaign .delete-btn:hover {
      color: red;
    }

</style>