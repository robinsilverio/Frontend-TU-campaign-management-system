<template>
  <WarningModal
      :list-of-selected-campaigns="selectedCampaigns"
      v-if="this.userAction === 'delete'"
      @onModalClosed="onModalClosed"
  ></WarningModal>
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
</template>
<script>
  import CampaignsList from "@/components/sidebar/CampaignsList.vue";
  import WarningModal from "@/components/WarningModal.vue";

  export default {
    name: "SideBar",
    components: {WarningModal, CampaignsList},
    emits: ['changeUserAction'],
    props: {
      userAction: {
        type: String,
        default: () => 'none'
      },
    },
    data() {
      return {
        campaignMappings: [],
        resetSelectAll: false,
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
      onModalClosed() {
        this.$emit('changeUserAction', 'none');
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
      },
      openWarningModalUponDeletion() {
        if (this.selectedCampaigns.length > 0) {
          this.$emit('changeUserAction', 'delete');
        } else {
          this.$toast.warning('Selecteer een campagne om te verwijderen.');
        }
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
<style scoped>
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
</style>