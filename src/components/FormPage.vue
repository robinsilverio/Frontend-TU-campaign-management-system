<template>
  <div class="form-page">
    <div class="tab-header">
      <div :class="{'tab': true, 'active': activeTab === key}" v-for="(value, key, index) in tabForms" :key="index" @click="changeTab(key)">
        {{ key }}
      </div>
    </div>
    <div class="form-body">
      <h1>{{ this.capitalizedActiveTab }}</h1>
      <form class="campaign-form" name="campaign-form" @submit.prevent="formSubmit">
        <AdditionalItemsComponent v-if="activeTab === 'Campaign items' || activeTab === 'Tags'" :tab-form="this.tabForms[activeTab]" :active-tab="this.activeTab">
        </AdditionalItemsComponent>
        <div class="form-controls">
          <div :class="'form-control input-' + tabForm.name" v-for="(tabForm, index) in this.tabForms[activeTab].inputFields" :key="index">
            <label for="{{tabForm.name}}">{{tabForm.label}}</label>
            <input :type="tabForm.type" :name="tabForm.name" v-model="tabForm.value" v-if="tabForm.type !== 'textarea' && tabForm.type !== 'selectbox' && tabForm.type !== 'radiogroup' && tabForm.type !== 'formgroup'" />
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
        <div class="additional-form-actions" v-if="activeTab === 'Campaign items'">
          <div @click="addCampaignItem()">Voeg campaign item toe</div>
        </div>
        <div class="form-actions">
          <button class="form-submit-btn">{{ this.capitalizedUserAction }} campaign</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import AdditionalItemsComponent from "@/components/formpage_components/AdditionalItemsComponent.vue";

export default {
  name: "FormPage",
  components: {AdditionalItemsComponent},
  data() {
    return {
      activeTab: 'Basic',
      tabForms: {
        "Basic" : {
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
        "Advanced" : {
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
              value: null
            },
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
        "Images" : {
          inputFields: [
            { type: 'text', name: 'campaign-filter-image', label: 'Campaign Filter Image Url: ', required: true, value: null },
            { type: 'text', name: 'campaign-filter-overlay-text', label: 'Campaign Filter Overlay Text: ', required: false, value: null },
            { type: 'text', name: 'campaign-promotional-img-url', label: 'Campaign Promotional Image Url: ', required: true, value: null },
            { type: 'text', name: 'campaign-promotional-img-alt', label: 'Campaign Promotional Image Alt Text: ', required: true, value: null },
            { type: 'text', name: 'mobile-image-url', label: 'Mobile Image Url: ', required: false, value: null }
          ]
        },
        "Campaign items" : {
          values: [],
          inputFields : [
            { type: 'text', name: 'campaign-item-title', label: 'Title: ', required: true, value: null },
            { type: 'textarea', name: 'promo-text', label: 'Promotion Text: ', required: true, value: null },
            {
              type: 'selectbox',
              name: 'priority',
              label: 'Priority: ',
              options: [
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "XL",
                "XXL"
              ],
              required: true,
              value: null
            },
            { type: 'text', name: 'teaser', label: 'Teaser: ', required: false, value: null },
            { type: 'text', name: 'tekst', label: 'Tekst: ', required: false, value: null }
          ]
        },
        "Tags" : {
          values: [],
          inputFields: []
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
    addCampaignItem() {
      console.log("Hello World");
    },
    validateInput() {
      Object.keys(this.tabForms).forEach((key) => {
        this.tabForms[key].inputFields.forEach((field) => {
          if (((field.value === null || field.value === '') && field.required) && this.tabForms['Campaign items'].values.length === 0) {
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
  .additional-form-actions, .form-actions {
    margin-top: 30px;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
  /* Styling tabform Campaign items*/
  .campaign-form .additional-form-actions div, .campaign-form .form-actions button {
    width: fit-content;
    color: #FFF;
    padding: 5px;
    cursor: pointer;
    border: none;
  }
  .campaign-form .additional-form-actions div {
    background-color: blue;
  }
  .campaign-form .form-actions .form-submit-btn {
    background-color: var(--TU-color);
  }
  .campaign-form .form-controls {
    margin-top: 20px;
  }
  .campaign-form .list-of-additional-items ul {
    padding: 0;
    list-style: none;
  }
</style>