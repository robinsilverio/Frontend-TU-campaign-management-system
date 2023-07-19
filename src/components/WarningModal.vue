<template>
  <div class="warning-overlay">
    <div class="warning-modal">
      <div class="warning-info">
        <h1>Bevestigen</h1>
        <p>U staat op een punt om {{ this.listOfSelectedCampaigns.length }} activa te verwijderen:</p>
        <ul>
          <li>{{this.listOfSelectedCampaigns.length}} activa van type campaign.</li>
        </ul>
      </div>
      <div class="button-container">
        <button @click="handleCampaignRemoval()">OK</button>
        <button @click="cancelDeletion()">Annuleren</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WarningModal",
  props: {
    listOfSelectedCampaigns: {
      type: Array,
      default: () => [],
    },
    typeOfActiva: String
  },
  methods: {
    handleCampaignRemoval() {

      let confirmationMessage = "";

      if (this.listOfSelectedCampaigns.length > 1) {
        // Perform deletion of multiple campaigns.
        let selectedCampaigns = {
          selectedCampaigns: this.listOfSelectedCampaigns
        }
        this.$store.dispatch('deleteSelectedCampaigns', selectedCampaigns)
            .then(
                success => {
                  confirmationMessage = `${this.listOfSelectedCampaigns.length} items zijn succesvol verwijderd.`;
                  this.$toast.success(confirmationMessage);
                },
                error => {
                  let errorMessage = 'Er is een fout opgetreden tijdens het verwijderen van een campagne.';
                  this.$toast.error(errorMessage);
                }
            )
      } else {
        // Perform a deletion of one single campaign.
        this.$store.dispatch('deleteCampaign', this.listOfSelectedCampaigns[0])
            .then(success => {
              confirmationMessage = 'Een item is succesvol verwijderd.';
              this.$toast.success(confirmationMessage);
            }, error => {
              let errorMessage = 'Er is een fout opgetreden tijdens het verwijderen van een campagne.';
              this.$toast.error(errorMessage);
            });
      }
      this.$emit('onModalClosed');
    },
    cancelDeletion() {
      this.$emit('onModalClosed');
    }
  }
}
</script>
<style scoped>
  .warning-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
    z-index: 999; /* Set a high z-index value to ensure it overlays other elements */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .warning-modal {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 400px;
    height: 220px;
    background-color: var(--TU-color);
    color: #FFF;
    border: 1px solid #42596D;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
  }
  .warning-modal .warning-info {
    text-align: center;
  }
  .warning-modal .warning-info ul {
    padding: 0px;
    list-style: none;
  }
  .warning-modal .button-container {
    display: flex;
    justify-content: flex-end;
  }
</style>