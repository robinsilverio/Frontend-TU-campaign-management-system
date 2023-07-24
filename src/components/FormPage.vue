<template>
  <div class="form-page">
    <div class="tab-header">
      <div :class="{'tab': true, 'active': activeTab === 'basic'}" @click="changeTab('basic')">Basic</div>
      <div :class="{'tab': true, 'active': activeTab === 'advanced'}" @click="changeTab('advanced')">Advanced</div>
      <div :class="{'tab': true, 'active': activeTab === 'image'}" @click="changeTab('image')">Image</div>
      <div :class="{'tab': true, 'active': activeTab === 'campaign-items'}" @click="changeTab('campaign-items')">Campaign items</div>
      <div :class="{'tab': true, 'active': activeTab === 'tags'}" @click="changeTab('tags')">Tags</div>
    </div>
    <div class="form-body">
      <h1>{{ this.capitalizedActiveTab }}</h1>
      <form class="campaign-form" name="campaign-form" @submit.prevent="formSubmit">
        <div :class="'form-control input-' + tabForm.name" v-for="(tabForm, index) in this.tabForms[activeTab].inputFields" :key="index">
          <label for="{{tabForm.name}}">{{tabForm.label}}</label>
          <input :type="tabForm.type" :name="tabForm.name" :value="tabForm.value" v-if="tabForm.type !== 'textarea'" />
          <textarea name="{{tabForm.name}}" v-if="tabForm.type === 'textarea'"></textarea>
        </div>
        <div class="form-control">
          <button class="form-submit">{{ this.capitalizedUserAction }} campaign</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: "FormPage",
  data() {
    return {
      activeTab: 'basic',
      tabForms: {
        "basic" : {
            inputFields: [
              { type: 'text', name: 'title', label: 'Title: ', value: null },
              { type: 'text', name: 'campaign-url', label: 'Campaign url: ', value: null },
              { type: 'date', name: 'start-date', label: 'Start date: ', value: null },
              { type: 'date', name: 'end-date', label: 'End date: ', value: null },
              { type: 'textarea', name: 'promo-description', label: 'Campaign Promotional description Text: ', value: '' },
              { type: 'textarea', name: 'promo-summary', label: 'Campaign Promotional Summary Text: ', value: '' },
              { type: 'text', name: 'ribbon-text', label: 'Ribbon Text: ', value: '' },
              { type: 'text', name: 'campaign-terms-url: ', label: 'Campaign Terms Url: ', value: '' }
            ]
        },
        "advanced" : {
          inputFields: [],
        },
        "images" : {
          inputFields: []
        },
        "campaign-items" : {
          inputFields: [
            { type: 'text', name: 'tag', label: '', value: '' },
          ],
          savedCampaignItems: []
        },
        "tags" : {
          inputFields: [
            { type: 'text', name: 'tag', label: '', value: '' },
          ],
          savedTags: []
        }
      }
    }
  },
  computed: {
    capitalizedActiveTab() {
      return this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1);
    },
    capitalizedUserAction() {
      return this.userAction.charAt(0).toUpperCase() + this.userAction.slice(1);
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
    },
    formSubmit() {
      if (this.userAction === 'create') {
        console.log('Perform create process.')
      } else {
        console.log('Perform update process.')
      }
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
    padding: 20px;
  }
  .form-page .form-body .campaign-form {
    margin-top: 25px;
  }
</style>