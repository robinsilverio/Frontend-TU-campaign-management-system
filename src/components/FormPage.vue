<template>
  <div class="form-page">
    <div class="tab-header">
      <div :class="{'tab': true, 'active': activeTab === 'basic'}" @click="changeTab('basic')">Basic</div>
      <div :class="{'tab': true, 'active': activeTab === 'advanced'}" @click="changeTab('advanced')">Advanced</div>
      <div :class="{'tab': true, 'active': activeTab === 'image'}" @click="changeTab('image')">Image</div>
      <div :class="{'tab': true, 'active': activeTab === 'campaign-items'}" @click="changeTab('campaign-items')">Campaign items</div>
    </div>
    <div class="form-body">

    </div>
  </div>
</template>
<script>
export default {
  name: "FormPage",
  data() {
    return {
      activeTab: 'basic',
      tabForms: {}
    }
  },
  props: {
    userAction: {
      type: String
    },
    selectedCampaign: {
      type: Object
    }
  },
  methods: {
    changeTab(paramTabName) {
      this.activeTab = paramTabName;
    }
  }
}
</script>
<style scoped>
  .form-page {
    width: 80%;
    height: 600px;
    margin: auto;
    position: relative;
    top: 10%;
  }
  .form-page .tab-header {
    display: flex;
    justify-content: flex-start;
  }
  .tab-header .tab {
    background-color: #000;
    padding: 10px 30px;
    color: #FFF;
    cursor: pointer;
    border: 1px solid #FFF;
  }
  .tab-header .tab.active {
    background-color: #FFF;
    border-color: #000;
    color: #000;
    box-shadow: 0px 3px 0px 0px #007D30;
    bottom: 3px;
    position: relative;
  }
  .form-page .form-body {
    background-color: #FFF;
    height: 100%;
    border: 1px solid;
  }
</style>