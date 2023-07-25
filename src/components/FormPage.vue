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
        <div class="form-controls">
          <div :class="'form-control input-' + tabForm.name" v-for="(tabForm, index) in this.tabForms[activeTab].inputFields" :key="index">
            <label for="{{tabForm.name}}">{{tabForm.label}}</label>
            <input :type="tabForm.type" :name="tabForm.name" v-model="tabForm.value" v-if="tabForm.type !== 'textarea' && tabForm.type !== 'selectbox' && tabForm.type !== 'radiogroup'" />
            <div class="radio-wrapper" v-if="tabForm.type === 'radiogroup'">
              <div v-for="(radioOption, subIndex) in tabForm.radioOptions" :key="subIndex">
                <input type="radio" :id="`${tabForm.name}-${subIndex}`" :value="radioOption.value" v-model="tabForm.value" />
                <label :for="`${tabForm.name}-${subIndex}`">{{ radioOption.label }}</label>
              </div>
            </div>
            <select :name="tabForm.name" v-model="tabForm.value" v-if="tabForm.type !== 'radiogroup' && tabForm.type === 'selectbox'">
              <option v-for="(option, subIndex) in tabForm.options" :key="subIndex" :value="option">{{ option }}</option>
            </select>
            <textarea name="{{tabForm.name}}" v-if="tabForm.type === 'textarea'" v-model="tabForm.value"></textarea>
          </div>
        </div>
        <div class="form-actions">
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
              { type: 'text', name: 'title', label: 'Title: ', required: true, value: null },
              { type: 'text', name: 'campaign-url', label: 'Campaign url: ', required: false, value: null },
              { type: 'date', name: 'start-date', label: 'Start date: ', required: true, value: null },
              { type: 'date', name: 'end-date', label: 'End date: ', required: true, value: null },
              { type: 'textarea', name: 'promo-description', label: 'Campaign Promotional description Text: ', required: true, value: null },
              { type: 'textarea', name: 'promo-summary', label: 'Campaign Promotional Summary Text: ', required: true, value: null },
              { type: 'text', name: 'ribbon-text', label: 'Ribbon Text: ', required: true, value: null },
              { type: 'text', name: 'campaign-terms-url: ', label: 'Campaign Terms Url: ', required: false, value: null }
            ]
        },
        "advanced" : {
          inputFields: [
            {
              type: 'selectbox',
              name: 'client-group',
              label: 'Client Group(s): ',
              options: [
                "ADVIES",
                "REST",
                "INSTG-TOT",
                "INSTG-SANCV",
                "INSTK-SANCV",
                "INSTK-TOT",
                "RET-SHW",
                "LEV",
                "INSTG-ET",
                "RET-OV",
                "S&O",
                "IND",
                "ONBEKEND",
                "INSTK-ET",
                "MEDEWERKER",
              ],
              required: true,
              value: null },
            {
              type: 'radiogroup',
              name: 'root-indicator',
              label: 'Root Indicator: ',
              radioOptions: [
                {label: 'Ja', value: 1},
                {label: 'Nee', value: 0}
              ],
              required: false,
              value: 1
            }
          ],
        },
        "images" : {
        },
        "campaign-items" : {
        },
        "tags" : {
        }
      },
      errorMessages: []
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
      this.validateInput();
      if (this.errorMessages.length > 0) {
        this.errorMessages.forEach(errorMessage => this.$toast.error(errorMessage));
        this.errorMessages = [];
        return;
      }
      this.mapFunctions()[this.userAction]();
    },
    mapFunctions() {
      return {
        "create": () =>{
          this.$toast.success("Een campagne is succesvol toegevoegd.")
        },
        "update": () => {
          this.$toast.success("Een campagne is succesvol bijgewerkt.");
        }
      }
    },
    validateInput() {
      Object.keys(this.tabForms).forEach((key) => {
        console.log(key);

        this.tabForms[key].inputFields && this.tabForms[key].inputFields.forEach((field) => {
          if ((field.value === null || field.value === '') && field.required) {
            this.errorMessages.push(`Er ontbreekt een waarde voor de vereiste eigenschap "${field.label}"`);
          }
        });
      });
    }
  }
}
</script>
<style scoped>
  .form-page {
    width: 80%;
    margin: auto;
    position: relative;
    top: 1%;
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
    border: 1px solid;
    padding: 20px;
  }
  .form-page .form-body form .form-controls .form-control {
    display: flex;
    flex-direction: column;
  }
  .form-control textarea {
    height: 150px;
  }
  .form-control .radio-wrapper {
    display: flex;
    gap: 10px;
  }
  .form-actions {
    margin-top: 30px;
  }
</style>