<template>
  <div class="form-page">
    <div class="tab-header">
      <div :class="{'tab': true, 'active': activeTab.mainTab === key}" v-for="(value, key, index) in tabForms" :key="index" @click="changeTab(key)">
        <p>{{ key }}</p>
      </div>
    </div>
    <div class="form-body">
      <h1>{{ this.capitalizedActiveTab }}</h1>
      <form class="campaign-form" name="campaign-form" @submit.prevent="formSubmit">
        <AdditionalItemsComponent
            v-if="activeTab.mainTab === 'Campaign items' || activeTab.mainTab === 'Tags'"
            :tab-form="this.tabForms[activeTab.mainTab]"
            :active-tab="this.activeTab.mainTab"
            @onSelectCampaignItem="onSelectCampaignItem"
            @onSelectTag="onSelectTag"
        >
        </AdditionalItemsComponent>
        <div class="sub-tab-header" v-if="activeTab.subTab !== null">
          <div :class="{'tab': true, 'active': activeTab.subTab === key}" v-for="(value, key, index) in this.tabForms[activeTab.mainTab].subTabs" :key="index" @click="changeSubTab(key)">
            <p>{{ key }}</p>
          </div>
        </div>
        <div :class="{'form-controls': true, 'sub-tab-form-controls': activeTab.subTab !== null}">
          <AdditionalItemsComponent
              v-if="activeTab.mainTab === 'Campaign items' && activeTab.subTab === 'Discounts'"
              :tab-form="this.tabForms[activeTab.mainTab].subTabs[activeTab.subTab]"
              :active-tab="this.activeTab.subTab"
              @onSelectDiscount="onSelectDiscount"
          >
          </AdditionalItemsComponent>
          <div :class="'form-control input-' + tabForm.name" v-for="(tabForm, index) in this.getInputfields" :key="index">
            <label :for="tabForm.name">{{tabForm.label}}: </label>
            <div class="form-group horizontal" v-if="tabForm.type === 'formGroup'">
              <input :type="tabForm.inputFields[0].type" :name="tabForm.inputFields[0].name" v-model="tabForm.inputFields[0].value" />
              <div :class="{ 'campaign-item-discount-sku-button': true }" @click="addSku()">
                <p>Voeg sku toe.</p>
              </div>
              <p>Toegevoegde sku's: {{ tabForm.values.join(', ') }}</p>
            </div>
            <input :type="tabForm.type" :name="tabForm.name" v-model="tabForm.value" :value="tabForm.value" :disabled="tabForm.disabled" v-if="tabForm.type !== 'textarea' && tabForm.type !== 'selectbox' && tabForm.type !== 'radiogroup' && tabForm.type !== 'formGroup'" />
            <div class="radio-wrapper" v-if="tabForm.type === 'radiogroup'">
              <div v-for="(radioOption, subIndex) in tabForm.radioOptions" :key="subIndex">
                <input type="radio" :id="`${tabForm.name}-${subIndex}`" :value="radioOption.value" v-model="tabForm.value" @change="handleRadioFunction()[radioOption.onChange]()" />
                <label :for="`${tabForm.name}-${subIndex}`">{{ radioOption.label }}</label>
              </div>
            </div>
            <select :name="tabForm.name" v-model="tabForm.value" :value="tabForm.value" v-if="tabForm.type !== 'radiogroup' && tabForm.type === 'selectbox'">
              <option v-for="(option, subIndex) in tabForm.options" :key="subIndex" :value="option">{{ option }}</option>
            </select>
            <textarea :name="tabForm.name" v-if="tabForm.type === 'textarea'" v-model="tabForm.value"></textarea>
          </div>
        </div>
        <div class="additional-form-actions" v-if="shouldShowAdditionalActions">
          <div @click="handleAdditionalFormAction">{{ this.showAdditionalActionText }}</div>
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
import CampaignDTO from "@/models/CampaignDTO";
import {UserAction} from "@/enums/userAction";

export default {
  name: "FormPage",
  components: {AdditionalItemsComponent},
  data() {
    return {
      userActionsOnSubForms: {
        campaignItemsForm: UserAction.CREATE,
        discountsForm: UserAction.CREATE,
        tagsForm: UserAction.CREATE
      },
      activeTab: {
        mainTab: 'Basics',
        subTab: null,
      },
      tabForms: {
        "Basics" : {
            subTabs: null,
            inputFields: [
              { type: 'text', name: 'title', label: 'Title', required: true, value: null, disabled: false },
              { type: 'text', name: 'relativeUrl', label: 'Campaign url', required: false, value: null, disabled: false },
              { type: 'date', name: 'startDate', label: 'Start date', required: true, value: null, disabled: false },
              { type: 'date', name: 'endDate', label: 'End date', required: true, value: null, disabled: false },
              { type: 'textarea', name: 'promoDescriptionText', label: 'Campaign Promotional description Text', required: true, value: null, disabled: false },
              { type: 'textarea', name: 'promoSummaryText', label: 'Campaign Promotional Summary Text', required: true, value: null, disabled: false },
              { type: 'text', name: 'ribbonType', label: 'Ribbon Text', required: true, value: null, disabled: false },
              { type: 'text', name: 'termsUrl', label: 'Campaign Terms Url', required: false, value: null, disabled: false }
            ]
        },
        "Advanced" : {
          subTabs: null,
          inputFields: [
            {
              type: 'selectbox',
              name: 'campaignClientGroups',
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
              name: 'rootIndicator',
              label: 'Root Indicator',
              radioOptions: [
                {label: 'Ja', value: 1, onChange: ''},
                {label: 'Nee', value: 0, onChange: ''}
              ],
              required: true,
              value: 1
            }
          ],
        },
        "Images" : {
          subTabs: null,
          inputFields: [
            { type: 'text', name: 'filterImgUrl', label: 'Campaign Filter Image Url', required: false, value: null, disabled: false },
            { type: 'text', name: 'filterOverlayText', label: 'Campaign Filter Overlay Text', required: false, value: null, disabled: false },
            { type: 'text', name: 'promoImgUrl', label: 'Campaign Promotional Image Url', required: true, value: null, disabled: false },
            { type: 'text', name: 'promoImgAltText', label: 'Campaign Promotional Image Alt Text', required: true, value: null, disabled: false },
            { type: 'text', name: 'appImageUrl', label: 'Mobile Image Url', required: false, value: null, disabled: false }
          ]
        },
        "Campaign items" : {
          subTabs: {
            "Basics" : {
              inputFields: [
                { type: 'text', name: 'campaign-item-title', label: 'Campaign Item Title', required: true, value: null, disabled: false },
                { type: 'textarea', name: 'campaign-item-promo-text', label: 'Campaign Item Promotion Text', required: true, value: null, disabled: false },
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
                { type: 'text', name: 'teaser', label: 'Teaser', required: false, value: null, disabled: false },
                { type: 'text', name: 'extra-tekst', label: 'Tekst', required: false, value: null, disabled: false }
              ]
            },
            "Images" : {
              inputFields: [
                { type: 'text', name: 'campaign-item-promo-img', label: 'Campaign Item Promotion Image Url', required: true, value: null, disabled: false },
                { type: 'text', name: 'campaign-item-promo-img-alt-text', label: 'Campaign Item Promotion Image Alt Text', required: false, value: null, disabled: false },
              ]
            },
            "Discounts": {
              inputFields: [
                {
                  type: 'formGroup',
                  name: 'campaign-item-discount-form-group',
                  label: 'Discount sku',
                  inputFields: [
                    { type: 'text', name: 'campaign-item-discount-sku', required: false, value: null, disabled: false }
                  ],
                  required: false,
                  values: []
                },
                {
                  type: 'radiogroup',
                  name: 'discount-types',
                  label: 'Choose discount-types',
                  radioOptions: [
                    { label: 'Price', value: 'P', onChange: 'handleDisabledStateOnDiscountSelection' },
                    { label: 'Percentage', value: 'PCT', onChange: 'handleDisabledStateOnDiscountSelection' }
                  ],
                  required: true,
                  value: 'P'
                },
                {
                  type: 'text',
                  name: 'campaign-item-discount-price',
                  label: 'Discount Price',
                  required: true,
                  value: null,
                  disabled: false
                },
                {
                  type: 'text',
                  name: 'campaign-item-discount-percentage',
                  label: 'Discount Percentage',
                  required: true,
                  value: null,
                  disabled: true
                },
                { type: 'text', name: 'campaign-item-discount-tu-points', label: 'TU Points', required: true, value: null, disabled: false },
              ],
              required: true,
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
            { type: 'text', name: 'campaign-item-tag', label: 'Tag', required: true, value: null, disabled: false }
          ]
        }
      },
      errorMessages: [],
      PERCENTAGE: 'PCT',
      PRICE: 'P',
      selectedCampaignItem: null,
      selectedDiscount: null,
      selectedTag: null
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
      const allowedMainTabs = ['Campaign items', 'Tags'];
      const allowedSubTabs = ['Discounts'];
      const isMainTabAllowed = allowedMainTabs.includes(this.activeTab.mainTab);
      const isSubTabAllowed = allowedSubTabs.includes(this.activeTab.subTab);
      return (isMainTabAllowed && this.activeTab.subTab !== 'Discounts') || isSubTabAllowed;
    },
    showAdditionalActionText() {
      if (this.activeTab.mainTab === 'Campaign items' && this.activeTab.subTab !== 'Discounts') {
        return this.userActionsOnSubForms.campaignItemsForm === UserAction.CREATE ? 'Voeg campaign item toe' : 'Campaign item bijwerken';
      } else if (this.activeTab.mainTab === 'Tags') {
        return this.userActionsOnSubForms.tagsForm === UserAction.CREATE ? 'Voeg tag toe' : 'Tag bijwerken';
      } else {
        return this.userActionsOnSubForms.discountsForm === UserAction.CREATE ? 'Voeg hier een discount toe' : 'Discount bijwerken';
      }
    }
  },
  watch: {
    selectedCampaign() {
      this.loadValuesInInputFieldsFromSelectedCampaign();
      this.loadCampaignItemsAndTags();
    },
    userAction(useraction) {
      if (useraction !== UserAction.UPDATE) {
        this.clearInputFieldsOfMainTabs();
        this.clearCampaignItems();
        this.clearTags();
      }
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
        this.changeSubTab(null);
      }
    },
    changeSubTab(paramTabName) {
      this.activeTab.subTab = paramTabName;
    },
    onSelectCampaignItem(paramCampaignItem){
      this.userActionsOnSubForms.campaignItemsForm = UserAction.UPDATE;
      this.selectedCampaignItem = paramCampaignItem;
      this.loadCampaignItemValuesInForm();
    },
    onSelectDiscount(paramDiscount){
      this.userActionsOnSubForms.discountsForm = UserAction.UPDATE
      this.selectedDiscount = paramDiscount;
      this.loadDiscountValuesInForm();
    },
    onSelectTag(paramTag) {
      this.userActionsOnSubForms.tagsForm = UserAction.UPDATE;
      this.selectedTag = paramTag;
      this.loadTagValuesInForm();
    },
    addCampaignItem(paramCampaignItemToBeInserted) {
      this.tabForms['Campaign items'].values.push(paramCampaignItemToBeInserted);
    },
    updateCampaignItem(paramCampaignItemToBeUpdated) {
      this.tabForms['Campaign items'].values = this.tabForms['Campaign items'].values.map(
          campaignItem => campaignItem.campaignItemId === paramCampaignItemToBeUpdated.campaignItemId ?
              paramCampaignItemToBeUpdated : campaignItem
      );
      this.userActionsOnSubForms.campaignItemsForm = UserAction.CREATE;
    },
    addDiscount(paramDiscountToBeInserted) {
      this.tabForms['Campaign items'].subTabs['Discounts'].values.push(paramDiscountToBeInserted);
    },
    updateDiscount(paramDiscountToBeUpdated, paramInputFieldsForDeterminingDiscountType) {
      const existingDiscount = this.tabForms['Campaign items'].subTabs['Discounts'].values.find(
          discount => discount.discountId === paramDiscountToBeUpdated.discountId
      );
      const updateDiscountToList = (list, discountToBeUpdated) => {
        return list.map(
            discount => discount.discountId === discountToBeUpdated.discountId ? discountToBeUpdated : discount
        );
      }

      if (existingDiscount) {
        const isCurrentTypePrice = existingDiscount.discountPrice != null;
        const isCurrentTypePercentage = existingDiscount.discountPercentage != null;
        const isUpdatingToPrice = paramInputFieldsForDeterminingDiscountType['radioGroupDiscountType'].value === this.PRICE;
        const isUpdatingToPercentage = paramInputFieldsForDeterminingDiscountType['radioGroupDiscountType'].value === this.PERCENTAGE;

        if (isCurrentTypePrice !== isUpdatingToPrice || isCurrentTypePercentage !== isUpdatingToPercentage) {
          this.$toast.warning('You cannot change the discount type.');
          return;
        }
        this.tabForms['Campaign items'].subTabs['Discounts'].values = updateDiscountToList(this.tabForms['Campaign items'].subTabs['Discounts'].values, paramDiscountToBeUpdated);
        this.selectedCampaignItem.campaignItemDiscounts = updateDiscountToList(this.selectedCampaignItem.campaignItemDiscounts, paramDiscountToBeUpdated);
      }
      this.userActionsOnSubForms.discountsForm = UserAction.CREATE;
    },
    addTag(paramTagToBeInserted) {
      const findExistingTag = (tagToBeSearched) => {
        return this.tabForms['Tags'].values.find(tag => tag.toLowerCase() === tagToBeSearched.toLowerCase());
      }
      const existingTag = findExistingTag(paramTagToBeInserted);
      if (existingTag !== undefined) {
        this.$toast.warning('Deze tag bestaat al.');
      } else {
        this.tabForms['Tags'].values.push(paramTagToBeInserted);
      }
    },
    updateTag(paramTagToBeUpdated) {
      this.tabForms['Tags'].values = this.tabForms['Tags'].values.map(
          tag => tag === this.selectedTag ? paramTagToBeUpdated : tag
      );
      this.userActionsOnSubForms.tagsForm = UserAction.CREATE;
    },
    handleFormActionCampaignItem() {
      return {
        [UserAction.CREATE]: (paramCampaignItemToBeInserted) => {
          this.addCampaignItem(paramCampaignItemToBeInserted);
        },
        [UserAction.UPDATE]: (paramCampaignItemToBeUpdated) => {
          this.updateCampaignItem(paramCampaignItemToBeUpdated);
        }
      }
    },
    handleFormActionDiscount() {
      return {
        [UserAction.CREATE]: (paramDiscountToBeInserted) => {
          this.addDiscount(paramDiscountToBeInserted);
        },
        [UserAction.UPDATE]: (paramDiscountToBeUpdated, inputFieldsForDeterminingDiscountType) => {
          this.updateDiscount(paramDiscountToBeUpdated, inputFieldsForDeterminingDiscountType);
        }
      }
    },
    handleFormActionTag() {

      return {
        [UserAction.CREATE]: (paramTagToBeInserted) => {
          this.addTag(paramTagToBeInserted);
        },
        [UserAction.UPDATE]: (paramTagToBeUpdated) => {
          this.updateTag(paramTagToBeUpdated);
        }
      }
    },
    addSku() {
      this.validateSkuInputField();
      if (this.hasValidationErrors()) return;
      let skuList = this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].values;
      let skuId = this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].inputFields[0].value;
      skuList.push(skuId);
      this.clearInputFields(this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].inputFields);
    },
    handleAdditionalFormAction() {
      if (this.activeTab.mainTab === 'Campaign items' && this.activeTab.subTab !== 'Discounts') {
        this.validateFields(this.tabForms['Campaign items'].subTabs['Basics'].inputFields);
        this.validateFields(this.tabForms['Campaign items'].subTabs['Images'].inputFields);
        this.validateDiscounts();

        if (this.hasValidationErrors()) return;
        let campaignItem = {
          campaignItemId: (this.selectedCampaignItem !== null) ? this.selectedCampaignItem.campaignItemId : null,
          promoTitle: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[0].value,
          promoText: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[1].value,
          promoImgUrl: this.tabForms['Campaign items'].subTabs['Images'].inputFields[0].value,
          promoImgAltText: this.tabForms['Campaign items'].subTabs['Images'].inputFields[1].value,
          weight: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[2].value,
          teaser: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[3].value,
          extraText: this.tabForms['Campaign items'].subTabs['Basics'].inputFields[4].value,
          campaignItemDiscounts: this.tabForms['Campaign items'].subTabs['Discounts'].values
        }
        this.handleFormActionCampaignItem()[this.userActionsOnSubForms.campaignItemsForm](campaignItem);
        this.clearInputFields(this.tabForms['Campaign items'].subTabs['Basics'].inputFields);
        this.clearInputFields(this.tabForms['Campaign items'].subTabs['Images'].inputFields);
        this.clearDiscounts();
      }
      else if (this.activeTab.mainTab === 'Campaign items' && this.activeTab.subTab === 'Discounts') {

        this.validateFields(this.tabForms['Campaign items'].subTabs['Discounts'].inputFields);
        this.validateSkus();

        if(this.hasValidationErrors()) return;

        let discountTypesRadioGroup = this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[1];
        let discountPriceInputField = this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[2];
        let discountPercentageInputField = this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[3];

        let inputFieldsForDeterminingDiscountType = {
          "radioGroupDiscountType": discountTypesRadioGroup,
          "inputFieldPrice": discountPriceInputField,
          "inputFieldPercentage": discountPercentageInputField
        };

        let discountObject = {
          discountId: (this.selectedDiscount !== null) ? this.selectedDiscount.discountId : null,
          tuPoints: this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[4].value,
          skuIds: this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].values,
          discountPrice: null,
          discountPercentage: null
        }

        const discountType = inputFieldsForDeterminingDiscountType['radioGroupDiscountType'].value;
        const selectedDiscountType = this.selectedDiscount ? (discountType === this.PRICE ? this.selectedDiscount.discountPrice : this.selectedDiscount.discountPercentage) : null;

        if (discountType === this.PRICE) {
          discountObject.discountPrice = {
            discountId: selectedDiscountType ? selectedDiscountType.discountId : null,
            price: inputFieldsForDeterminingDiscountType['inputFieldPrice'].value
          };
        } else {
          discountObject.discountPercentage = {
            discountId: selectedDiscountType ? selectedDiscountType.discountId : null,
            percentage: inputFieldsForDeterminingDiscountType['inputFieldPercentage'].value
          };
        }

        this.handleFormActionDiscount()[this.userActionsOnSubForms.discountsForm](discountObject, inputFieldsForDeterminingDiscountType);
        this.clearInputFields(this.tabForms['Campaign items'].subTabs['Discounts'].inputFields);
        this.clearSkus();
      }
      else {
        this.validateTagInputfield();
        if (this.hasValidationErrors()) return;
        let tag = this.tabForms['Tags'].inputFields[0].value;
        this.handleFormActionTag()[this.userActionsOnSubForms.tagsForm](tag);
        this.clearInputFields(this.tabForms['Tags'].inputFields);
      }
    },
    handleFormSubmission() {

      return {
        [UserAction.CREATE]: (campaignToBeInserted) =>{
          this.$store.dispatch('createCampaign', campaignToBeInserted)
              .then(
                  success => {
                    this.$toast.success("Een campagne is succesvol aangemaakt");
                  },
                  error => {
                    this.$toast.error("Er is iets mis gegaan tijdens het aanmaken van een campagne.");
                  }
              )
        },
        [UserAction.UPDATE]: (campaignToBeUpdated) => {
          this.$store.dispatch('updateCampaign', campaignToBeUpdated)
              .then(
                  success => {
                    this.$toast.success("Een campagne is succesvol bijgewerkt.");
                  },
                  error => {
                    this.$toast.success("Er is iets mis gegaan tijdens het bijwerken van een campagne.");
                  }
              );
        }
      }
    },
    handleRadioFunction(paramFunctionName) {
      return {
        "handleDisabledStateOnDiscountSelection" : () => this.handleDisabledStateOnDiscountSelection(),
        "" : () => {}
      }
    },
    handleDisabledStateOnDiscountSelection() {

      let discountTypesRadioGroup = this.tabForms["Campaign items"].subTabs["Discounts"].inputFields[1];
      let discountPriceInputInputField = this.tabForms["Campaign items"].subTabs["Discounts"].inputFields[2];
      let discountPercentageInputField = this.tabForms["Campaign items"].subTabs["Discounts"].inputFields[3];

      discountPriceInputInputField.disabled = discountTypesRadioGroup.value === this.PERCENTAGE;
      discountPercentageInputField.disabled = discountTypesRadioGroup.value === this.PRICE;

    },
    formSubmit() {
      this.validateInput();
      this.validateCampaignItems();
      if (this.hasValidationErrors()) return;

      let campaign = new CampaignDTO(
          (this.selectedCampaign !== null) ? this.selectedCampaign.campaignId : null,
          null,
          this.tabForms["Basics"].inputFields[0].value,
          this.tabForms["Basics"].inputFields[1].value,
          this.tabForms["Basics"].inputFields[2].value,
          this.tabForms["Basics"].inputFields[3].value,
          '9001',
          this.tabForms["Basics"].inputFields[4].value,
          this.tabForms["Basics"].inputFields[5].value,
          this.tabForms["Basics"].inputFields[6].value,
          this.tabForms["Basics"].inputFields[7].value,
          [this.tabForms['Advanced'].inputFields[0].value],
          this.tabForms['Tags'].values,
          this.tabForms['Advanced'].inputFields[1].value,
          this.tabForms['Images'].inputFields[0].value,
          this.tabForms['Images'].inputFields[1].value,
          this.tabForms['Images'].inputFields[2].value,
          this.tabForms['Images'].inputFields[3].value,
          null,
          null,
          null,
          null,
          null,
          this.tabForms["Basics"].inputFields[1].value,
          this.tabForms["Campaign items"].values,
      );
      this.handleFormSubmission()[this.userAction](campaign);
      this.clearInputFieldsOfMainTabs();
      this.clearCampaignItems();
      this.clearTags();
      this.$emit('changeUserAction', UserAction.NONE);
    },
    clearInputFieldsOfMainTabs() {
      Object.keys(this.tabForms).forEach(key => {
        this.clearInputFields(this.tabForms[key].inputFields);
      })
    },
    clearInputFields(paramInputfields) {
      paramInputfields.forEach(inputField => inputField.value = '');
    },
    clearSkus() {
      this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].values = [];
    },
    clearDiscounts() {
      this.tabForms['Campaign items'].subTabs['Discounts'].values = [];
    },
    clearCampaignItems() {
      this.tabForms['Campaign items'].values = [];
    },
    clearTags() {
      this.tabForms['Tags'].values = [];
    },
    hasValidationErrors() {
      if (this.errorMessages.length > 0) {
        this.errorMessages.forEach(errorMessage => this.$toast.error(errorMessage));
        this.errorMessages = [];
        return true;
      }
      return false;
    },
    validateInput() {
      Object.keys(this.tabForms).forEach((tab) => {
        this.validateFields(this.tabForms[tab].inputFields);
      });
    },
    validateFields(paramInputFields) {
      let optionalInputfields = ["campaign-item-tag"];
      paramInputFields.forEach((field) => {
        if (((field.value === null || field.value === '') && field.required && !field.disabled) && !optionalInputfields.includes(field.name)) {
          this.errorMessages.push(`Er ontbreekt een waarde voor de vereiste eigenschap "${field.label}"`);
        }
      });
    },
    validateCampaignItems() {
      if (this.tabForms['Campaign items'].values.length === 0) {
        this.errorMessages.push("Het is vereist om een campaign item toe te voegen");
      }
    },
    validateDiscounts() {
      if (this.tabForms['Campaign items'].subTabs['Discounts'].values.length === 0) {
        this.errorMessages.push("Het is vereist om een korting aan een campaign item toe te passen.");
      }
    },
    validateSkus() {
     if (this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].values.length === 0) {
       this.errorMessages.push("Het is vereist om een of meerdere sku's toe te voegen aan een discount.");
     }
    },
    validateSkuInputField() {
      let skuInputField = this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].inputFields[0];
      if (skuInputField.value === null || skuInputField.value === '') {
        this.errorMessages.push("Het invoeren van sku id is vereist.");
      }
    },
    validateTagInputfield() {
      let tagInputField = this.tabForms['Tags'].inputFields[0];
      if (tagInputField.value === null || tagInputField.value === undefined || tagInputField.value === '') {
        this.errorMessages.push("Naam van de tag is vereist.");
      }
    },
    loadCampaignItemsAndTags() {
      this.tabForms['Campaign items'].values = this.selectedCampaign.campaignItems;
      this.tabForms['Tags'].values = this.selectedCampaign.campaignTags;
    },
    loadCampaignItemValuesInForm() {
      this.tabForms['Campaign items'].subTabs['Basics'].inputFields[0].value = this.selectedCampaignItem.promoTitle;
      this.tabForms['Campaign items'].subTabs['Basics'].inputFields[1].value = this.selectedCampaignItem.promoText;
      this.tabForms['Campaign items'].subTabs['Images'].inputFields[0].value = this.selectedCampaignItem.promoImgUrl;
      this.tabForms['Campaign items'].subTabs['Images'].inputFields[1].value = this.selectedCampaignItem.promoImgAltText;
      this.tabForms['Campaign items'].subTabs['Basics'].inputFields[2].value = this.selectedCampaignItem.weight;
      this.tabForms['Campaign items'].subTabs['Basics'].inputFields[3].value = this.selectedCampaignItem.teaser;
      this.tabForms['Campaign items'].subTabs['Basics'].inputFields[4].value = this.selectedCampaignItem.expect;
      this.tabForms['Campaign items'].subTabs['Discounts'].values = this.selectedCampaignItem.campaignItemDiscounts
    },
    loadDiscountValuesInForm() {
      this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[1].value = (this.selectedDiscount.discountPrice !== null) ? this.PRICE : this.PERCENTAGE;
      this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[2].value = (this.selectedDiscount.discountPrice !== null) ? this.selectedDiscount.discountPrice.price : null;
      this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[3].value = (this.selectedDiscount.discountPercentage !== null) ? this.selectedDiscount.discountPercentage.percentage : null;
      this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[4].value = this.selectedDiscount.tuPoints;
      this.tabForms['Campaign items'].subTabs['Discounts'].inputFields[0].values = this.selectedDiscount.skuIds;
      this.handleDisabledStateOnDiscountSelection();
    },
    loadTagValuesInForm() {
      this.tabForms["Tags"].inputFields[0].value = this.selectedTag;
    },
    loadValuesInInputFieldsFromSelectedCampaign() {

      const formatDate = (paramStringDate) => {
        let date = new Date(paramStringDate);
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0'); //Months are zero based
        let year = date.getFullYear();
        return `${year}-${month}-${day}`; // Correct format is 'yyyy-mm-dd'
      }

      Object.keys(this.tabForms).forEach(tabs => {
        this.tabForms[tabs].inputFields.forEach(field => {
          field.value = this.selectedCampaign[field.name];
          if (field.type === 'date') {
            field.value = formatDate(this.selectedCampaign[field.name]);
          } else if (['campaignClientGroups'].includes(field.name)) {
            field.value = (this.selectedCampaign[field.name] !== null) ? this.selectedCampaign[field.name][0] : null;
          } else if (['rootIndicator'].includes(field.name)) {
            field.value = (field.value) ? 1 : 0;
          }
        });
      });
    }
  },
  created() {
    if (this.selectedCampaign !== null) {
      this.loadValuesInInputFieldsFromSelectedCampaign();
      this.loadCampaignItemsAndTags();
    }
  },
  beforeUnmount() {
    this.$store.commit('updateSelectedCampaign', null);
    this.selectedCampaignItem = null;
    this.selectedDiscount = null;
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
  .form-page .tab-header, .sub-tab-header {
    display: flex;
    justify-content: flex-start;
  }
  .tab-header .tab, .sub-tab-header .tab {
    background-color: #000;
    padding: 10px 30px;
    color: #FFF;
    cursor: pointer;
    border: 1px solid #FFF;
    border-bottom: none;
  }
  .tab-header .tab.active, .sub-tab-header .tab.active {
    background-color: #FFF;
    border-color: #000;
    color: #000;
  }
  .tab-header .tab.active p, .sub-tab-header .tab.active p {
    border: 0 solid var(--TU-color);
    border-bottom-width: 2px;
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
    border-top: 1px solid #000000;
  }

  form.campaign-form .form-controls .form-group {
    display: flex;
    gap: 10px
  }
  form.campaign-form .form-controls .form-group.horizontal {
    flex-direction: row;
  }
  form.campaign-form .form-controls .form-group.vertical {
    flex-direction: column;
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

  .campaign-form .additional-form-actions div, .campaign-item-discount-sku-button, .campaign-form .form-actions button {
    width: fit-content;
    color: #FFF;
    padding: 5px;
    cursor: pointer;
    border: none;
  }
  .campaign-form .additional-form-actions div, .campaign-item-discount-sku-button {
    background-color: blue;
    font-size: 0.8rem;
  }
  .campaign-form .form-actions .form-submit-btn {
    background-color: var(--TU-color);
  }
</style>