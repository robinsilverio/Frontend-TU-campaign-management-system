<script setup>
    import NavigationBar from '../components/NavigationBar.vue';
</script>
<template>
    <NavigationBar></NavigationBar>
    <main class="admin-panel">
        <div class="campaigns-sidebar">
            <div class="sidebar-menu"></div>
            <div class="campaigns-list" v-for="(campaign, index) in campaigns">
                <div class="campaign">
                    <input type="checkbox" id="myCheckbox" v-model="campaign.checked" @change="handleCampaignSelection(campaign)">
                    <label for="myCheckbox">{{ campaign.campaignTitle }}</label>
                </div>
            </div>
        </div>
        <div class="display-component"></div>
    </main>
</template>
<script>
    export default {
        name: 'Admin Panel',
        data() {
            return {
                campaigns: [
                    {
                        campaignId: '1',
                        campaignTitle: 'Summer Sale',
                        campaignDescText: 'Shop now and save!',
                        // Add other campaign properties here
                        checked: false
                    },
                    {
                        campaignId: '2',
                        campaignTitle: 'Back to School',
                        campaignDescText: 'Get ready for the new school year!',
                        // Add other campaign properties here
                        checked: false
                    },
                    {
                        campaignId: '3',
                        campaignTitle: 'Holiday Promotion',
                        campaignDescText: 'Celebrate the holidays with amazing deals!',
                        // Add other campaign properties here
                        checked: false
                    },
                    {
                        campaignId: '4',
                        campaignTitle: 'Clearance Sale',
                        campaignDescText: 'Last chance to grab incredible discounts!',
                        // Add other campaign properties here
                        checked: false
                    },
                    {
                        campaignId: '5',
                        campaignTitle: 'Spring Collection Launch',
                        campaignDescText: 'Discover the latest trends for the season!',
                        // Add other campaign properties here
                        checked: false
                    }
                ],
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
            }
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