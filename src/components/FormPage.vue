<template>
  <div class="form-page">
    <div class="tab-header">
      <div :class="{'tab': true, 'active': activeTab.mainTab === key}" v-for="(value, key, index) in tabForms" :key="index" @click="changeTab(key)">
        {{ key }}
      </div>
    </div>
    <div class="form-body">
      <h1>{{ this.capitalizedActiveTab }}</h1>
      <form class="campaign-form" name="campaign-form" @submit.prevent="formSubmit">
        <AdditionalItemsComponent v-if="activeTab.mainTab === 'Campaign items' || activeTab.mainTab === 'Tags'" :tab-form="this.tabForms[activeTab.mainTab]" :active-tab="this.activeTab.mainTab">
        </AdditionalItemsComponent>
        <div class="form-controls">
          <div :class="'form-control input-' + tabForm.name" v-for="(tabForm, index) in this.getInputfields" :key="index">
            <label :for="tabForm.name">{{tabForm.label}}: </label>
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
        <div class="additional-form-actions" v-if="this.shouldShowAdditionalActions">
          <div @click="handleAdditionalFormAction()" v-if="this.activeTab.mainTab === 'Campaign items'">Voeg campaign item toe</div>
          <div @click="handleAdditionalFormAction()" v-if="this.activeTab.mainTab === 'Tags'">Voeg tag toe</div>
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
      activeTab: {
        mainTab: 'Basics',
        subTab: null,
      },
      tabForms: {
        "Basics" : {
            subTabs: null,
            inputFields: [
              { type: 'text', name: 'title', label: 'Title', required: true, value: null },
              { type: 'text', name: 'campaign-url', label: 'Campaign url', required: false, value: null },
              { type: 'date', name: 'start-date', label: 'Start date', required: true, value: null },
              { type: 'date', name: 'end-date', label: 'End date', required: true, value: null },
              { type: 'textarea', name: 'promo-description', label: 'Campaign Promotional description Text', required: true, value: null },
              { type: 'textarea', name: 'promo-summary', label: 'Campaign Promotional Summary Text', required: true, value: null },
              { type: 'text', name: 'ribbon-text', label: 'Ribbon Text', required: true, value: null },
              { type: 'text', name: 'campaign-terms-url: ', label: 'Campaign Terms Url', required: false, value: null }
            ]
        },
        "Advanced" : {
          subTabs: null,
          inputFields: [
            {
              type: 'selectbox',
              name: 'client-group',
              label: 'Client Group(s)',
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
              label: 'Root Indicator',
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
          subTabs: null,
          inputFields: [
            { type: 'text', name: 'campaign-filter-image', label: 'Campaign Filter Image Url', required: false, value: null },
            { type: 'text', name: 'campaign-filter-overlay-text', label: 'Campaign Filter Overlay Text', required: false, value: null },
            { type: 'text', name: 'campaign-promotional-img-url', label: 'Campaign Promotional Image Url', required: true, value: null },
            { type: 'text', name: 'campaign-promotional-img-alt', label: 'Campaign Promotional Image Alt Text', required: true, value: null },
            { type: 'text', name: 'mobile-image-url', label: 'Mobile Image Url', required: false, value: null }
          ]
        },
        "Campaign items" : {
          subTabs: {
            "Basics" : {
              inputFields: [
                { type: 'text', name: 'campaign-item-title', label: 'Campaign Item Title', required: true, value: null },
                { type: 'textarea', name: 'campaign-item-promo-text', label: 'Campaign Item Promotion Text', required: true, value: null },
                {
                  type: 'selectbox',
                  name: 'priority',
                  label: 'Priority',
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
                  value: 'M'
                },
                { type: 'text', name: 'teaser', label: 'Teaser', required: false, value: null },
                { type: 'text', name: 'extra-tekst', label: 'Tekst', required: false, value: null }
              ]
            },
            "Images" : {
              inputFields: [
                { type: 'text', name: 'campaign-item-promo-img', label: 'Campaign Item Promotion Image Url', required: true, value: null },
                { type: 'text', name: 'campaign-item-promo-img-alt-text', label: 'Campaign Item Promotion Image Alt Text', required: false, value: null },
              ]
            },
            "Discounts": {
              inputFields: [
                { type: 'text', name: 'campaign-item-discount-price', label: 'Discount Price', required: false, value: null },
                { type: 'text', name: 'campaign-item-discount-percentage', label: 'Discount Percentage', required: false, value: null },
                { type: 'text', name: 'campaign-item-discount-tu-points', label: 'TU Points', required: false, value: null },
              ],
              values: []
            }
          },
          values: [],
          inputFields: []
        },
        "Tags" : {
          subTabs: null,
          values: [],
          inputFields: [
            { type: 'text', name: 'campaign-item-tag', label: 'Tag', required: false, value: null }
          ]
        }
      },
      errorMessages: []
    }
  },
  computed: {
    capitalizedActiveTab() {
      return this.activeTab.mainTab.charAt(0).toUpperCase() + this.activeTab.mainTab.slice(1);
    },
    capitalizedUserAction() {
      return this.userAction.charAt(0).toUpperCase() + this.userAction.slice(1);
    },
    getInputfields() {
      let inputFields;
      if (this.activeTab.main !== null && this.activeTab.subTab === null) {
        inputFields = this.tabForms[this.activeTab.mainTab].inputFields;
      } else {
        inputFields = this.tabForms[this.activeTab.mainTab].subTabs[this.activeTab.subTab].inputFields;
      }
      return inputFields;
    },
    shouldShowAdditionalActions() {
      const allowedTabs = ['Campaign items', 'Tags'];
      return allowedTabs.includes(this.activeTab.mainTab);
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
      this.activeTab.mainTab = paramTabName;
      if (this.activeTab.mainTab === 'Campaign items') {
        this.activeTab.subTab = 'Basics';
      } else {
        this.activeTab.subTab = null;
      }
    },
    changeSubTab(paramTabName) {
      this.activeTab.subTab = paramTabName;
    },
    addCampaignItem() {
      let campaignItem = {
        campaignItemId: null,
        promoTitle: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[0].value,
        promoText: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[1].value,
        promoImgUrl: this.tabForms['Campaign items'].subTabs['Images'].inputFields[0].value,
        promoImgAltText: this.tabForms['Campaign items'].subTabs['Images'].inputFields[1].value,
        weight: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[2].value,
        teaser: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[3].value,
        extraText: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[4].value,
      }
      this.tabForms['Campaign items'].values.push(campaignItem)
    },
    addTag() {
      let tagObject = { title: this.tabForms['Tags'].inputFields[0].value };
      this.tabForms['Tags'].values.push(tagObject);
    },
    handleAdditionalFormAction() {
      if (this.activeTab.mainTab === 'Campaign items') {
        this.addCampaignItem();
      } else {
        this.addTag();
      }
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
      Object.keys(this.tabForms).forEach((tab) => {
        this.validateFields(this.tabForms[tab].inputFields);
        if (this.tabForms[tab].subTabs !== null) {
          Object.keys(this.tabForms[tab].subTabs).forEach(subTab => {
            this.validateFields(this.tabForms[tab].subTabs[subTab].inputFields);
          });
        }
      });
    },
    validateFields(paramInputFields) {
      paramInputFields.forEach((field) => {
        if (((field.value === null || field.value === '') && field.required) && this.tabForms['Campaign items'].values.length === 0) {
          this.errorMessages.push(`Er ontbreekt een waarde voor de vereiste eigenschap "${field.label}"`);
        }
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
  }
  .form-page .form-body h1 {
    padding: 20px 20px 0px
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
  form.campaign-form .form-controls
  {
    padding: 20px;
  }
  form.campaign-form .additional-form-actions,
  form.campaign-form .form-actions {
    padding: 0px 20px 10px 20px;
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
    border-top: 1px solid #000000;
  }
</style>