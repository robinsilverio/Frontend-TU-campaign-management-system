<template>
  <div class="campaigns-list">
    <div class="select-all-item">
      <div class="default-info">
        <input type="checkbox" id="myCheckbox" v-model="selectAll" @change="handleSelectAllCampaigns()">
        <label>Selecteer alles</label>
      </div>
    </div>
    <div class="campaign" v-for="(campaignMapping, index) in campaignMappings" :key="index">
      <div class="campaign-short-info">
        <input type="checkbox" :id="'myCheckbox-'+ index" v-model="campaignMapping.checked">
        <label @click="onSelectCampaign(campaignMapping.campaign)">{{ campaignMapping.campaign.title }}</label>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "CampaignsList",
    data() {
      return {
        selectAll: false
      }
    },
    emits: ['onSelectAllCheckBoxes'],
    props: {
      campaignMappings: {
        type: Array,
        default: () => []
      },
      resetSelectAll: {
        type: Boolean,
        default: () => false
      }
    },
    watch: {
      resetSelectAll(currentState) {  // Watcher for the new prop
        if (currentState === true) {
          this.selectAll = false;
        }
      }
    },
    methods : {
      handleSelectAllCampaigns() {
        this.$emit('onSelectAllCheckBoxes', this.selectAll);
      },
      onSelectCampaign(campaign) {
        this.$store.commit('updateSelectedCampaign', campaign);
      }
    }
  }
</script>
<style scoped>
  .campaigns-sidebar .campaigns-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-top: 1px solid #A6A3AA;
  }
  .campaigns-list .campaign, .select-all-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0px;
  }
  .campaigns-list .campaign .campaign-short-info, .default-info {
    display: flex;
    gap: 20px;
  }

  .campaigns-list .campaign .campaign-short-info label, .default-info label {
    font-size: 0.9rem;
  }
  .campaigns-list .campaign .campaign-short-info label {
    cursor: pointer;
  }

  .campaigns-list .campaign .delete-btn-secondary {
    background-color: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  .campaigns-list .campaign .delete-btn-secondary:hover {
    color: red;
  }

  @media (min-width: 320px) {
    .campaigns-list {
      overflow: auto;
      height: 87%;
    }
  }

  @media (min-width: 768px) {
    .campaigns-list {
      height: 94%;
    }
  }

</style>