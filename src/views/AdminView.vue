<script setup>
    import NavigationBar from '../components/NavigationBar.vue';
</script>
<template>
    <NavigationBar></NavigationBar>
    <main class="admin-panel">
        <div class="campaigns-sidebar">
            <div class="sidebar-menu"></div>
            <div class="campaigns-list" v-for="(campaignMapping, index) in campaignMappings">
                <div class="campaign">
                    <input type="checkbox" id="myCheckbox" v-model="campaignMapping.campaign.checked" @change="handleCampaignSelection(campaignMapping.campaign)">
                    <label for="myCheckbox">{{ campaignMapping.campaign.title }}</label>
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
                selectedCampaigns: []
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
                console.log(this.selectedCampaigns);
            }
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
        padding: 10px;
        border-right: 1px solid #a6a3aa;
        border-left: 1px solid #A6A3AA;
        border-bottom: 1px solid #A6A3AA;
    }
    .campaigns-sidebar .campaigns-list .campaign label {
        font-size: 0.9rem;
        position: relative;
        bottom: 1px;
        margin-left: 5px;
    }


</style>