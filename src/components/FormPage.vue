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
            v-if="activeTab.mainTab === Tabs.CAMPAIGN_ITEMS || activeTab.mainTab === Tabs.TAGS"
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
              v-if="activeTab.mainTab === Tabs.CAMPAIGN_ITEMS && activeTab.subTab === Tabs.DISCOUNTS"
              :tab-form="this.tabForms[activeTab.mainTab].subTabs[activeTab.subTab]"
              :active-tab="this.activeTab.subTab"
              @onSelectDiscount="onSelectDiscount"
          >
          </AdditionalItemsComponent>
          <div :class="'form-control input-' + tabForm.name" v-for="(tabForm, index) in this.getInputfields" :key="index">
            <label :for="tabForm.name">{{tabForm.label}}: </label>
            <div class="form-group horizontal" v-if="tabForm.type === InputType.FORM_GROUP">
              <input :type="tabForm.inputFields[0].type" :name="tabForm.inputFields[0].name" v-model="tabForm.inputFields[0].value" />
              <div :class="{ 'campaign-item-discount-sku-button': true }" @click="addSku()">
                <p>Voeg sku toe.</p>
              </div>
              <p>
                Toegevoegde sku's:
                <span style="margin-right: 5px" v-for="(sku, index) in tabForm.values" v-bind:key="index">
                  {{ sku }}
                  <img
                      src="../assets/images/icons/close.png"
                      alt="remove"
                      style="position: relative; top: 1px;"
                      @click="removeSku(sku)"
                  />
                </span>
              </p>
            </div>
            <input :type="tabForm.type" :name="tabForm.name" v-model="tabForm.value" :value="tabForm.value" :disabled="tabForm.disabled" v-if="tabForm.type !== InputType.TEXT_AREA && tabForm.type !== 'selectbox' && tabForm.type !== 'radiogroup' && tabForm.type !== 'formGroup'" />
            <div class="radio-wrapper" v-if="tabForm.type === InputType.RADIO_GROUP">
              <div v-for="(radioOption, subIndex) in tabForm.radioOptions" :key="subIndex">
                <input type="radio" :id="`${tabForm.name}-${subIndex}`" :value="radioOption.value" v-model="tabForm.value" @change="handleRadioFunction()[radioOption.onChange]()" />
                <label :for="`${tabForm.name}-${subIndex}`">{{ radioOption.label }}</label>
              </div>
            </div>
            <select :name="tabForm.name" v-model="tabForm.value" :value="tabForm.value" v-if="tabForm.type !== InputType.RADIO_GROUP && tabForm.type === InputType.SELECT_BOX">
              <option v-for="(option, subIndex) in tabForm.options" :key="subIndex" :value="option">{{ option }}</option>
            </select>
            <textarea :name="tabForm.name" v-if="tabForm.type === InputType.TEXT_AREA" v-model="tabForm.value"></textarea>
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
import {Tabs} from "@/enums/tabs";
import {RegEx} from "@/enums/regEx";
import {InputType} from "@/enums/inputType";
import {ListUtils} from "@/utils/list-utils";

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
              { type: InputType.TEXT, name: 'title', label: 'Title', required: true, value: null, disabled: false },
              { type: InputType.TEXT, name: 'relativeUrl', label: 'Campaign url', required: false, value: null, disabled: false },
              { type: InputType.DATE, name: 'startDate', label: 'Start date', required: true, value: null, disabled: false },
              { type: InputType.DATE, name: 'endDate', label: 'End date', required: true, value: null, disabled: false },
              { type: InputType.TEXT_AREA, name: 'promoDescriptionText', label: 'Campaign Promotional description Text', required: true, value: null, disabled: false },
              { type: InputType.TEXT_AREA, name: 'promoSummaryText', label: 'Campaign Promotional Summary Text', required: true, value: null, disabled: false },
              { type: InputType.TEXT, name: 'ribbonType', label: 'Ribbon Text', required: true, value: null, disabled: false },
              { type: InputType.TEXT, name: 'termsUrl', label: 'Campaign Terms Url', required: false, value: null, disabled: false }
            ]
        },
        "Advanced" : {
          subTabs: null,
          inputFields: [
            {
              type: InputType.SELECT_BOX,
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
              type: InputType.RADIO_GROUP,
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
            { type: InputType.TEXT, name: 'filterImgUrl', label: 'Campaign Filter Image Url', required: false, value: null, disabled: false },
            { type: InputType.TEXT, name: 'filterOverlayText', label: 'Campaign Filter Overlay Text', required: false, value: null, disabled: false },
            { type: InputType.TEXT, name: 'promoImgUrl', label: 'Campaign Promotional Image Url', required: true, value: null, disabled: false },
            { type: InputType.TEXT, name: 'promoImgAltText', label: 'Campaign Promotional Image Alt Text', required: true, value: null, disabled: false },
            { type: InputType.TEXT, name: 'appImageUrl', label: 'Mobile Image Url', required: false, value: null, disabled: false }
          ]
        },
        "Campaign items" : {
          subTabs: {
            "Basics" : {
              inputFields: [
                { type: InputType.TEXT, name: 'campaign-item-title', label: 'Campaign Item Title', required: true, value: null, disabled: false },
                { type: InputType.TEXT_AREA, name: 'campaign-item-promo-text', label: 'Campaign Item Promotion Text', required: true, value: null, disabled: false },
                {
                  type: InputType.SELECT_BOX,
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
                { type: InputType.TEXT, name: 'teaser', label: 'Teaser', required: false, value: null, disabled: false },
                { type: InputType.TEXT, name: 'extra-tekst', label: 'Tekst', required: false, value: null, disabled: false }
              ]
            },
            "Images" : {
              inputFields: [
                { type: InputType.TEXT, name: 'campaign-item-promo-img', label: 'Campaign Item Promotion Image Url', required: true, value: null, disabled: false },
                { type: InputType.TEXT, name: 'campaign-item-promo-img-alt-text', label: 'Campaign Item Promotion Image Alt Text', required: false, value: null, disabled: false },
              ]
            },
            "Discounts": {
              inputFields: [
                {
                  type: InputType.FORM_GROUP,
                  name: 'campaign-item-discount-form-group',
                  label: 'Discount sku',
                  inputFields: [
                    { type: InputType.TEXT, name: 'campaign-item-discount-sku', label: 'Discount sku', required: false, value: null, disabled: false }
                  ],
                  required: false,
                  values: []
                },
                {
                  type: InputType.RADIO_GROUP,
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
                  type: InputType.TEXT,
                  name: 'campaign-item-discount-price',
                  label: 'Discount Price',
                  required: true,
                  value: null,
                  disabled: false
                },
                {
                  type: InputType.TEXT,
                  name: 'campaign-item-discount-percentage',
                  label: 'Discount Percentage',
                  required: true,
                  value: null,
                  disabled: true
                },
                { type: InputType.TEXT, name: 'campaign-item-discount-tu-points', label: 'TU Points', required: true, value: null, disabled: false },
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
            { type: InputType.TEXT, name: 'campaign-item-tag', label: 'Tag', required: true, value: null, disabled: false }
          ]
        }
      },
      errorMessages: [],
      PERCENTAGE: 'PCT',
      PRICE: 'P',
      selectedCampaignItem: null,
      selectedDiscount: null,
      selectedTag: null,
      listUtils: new ListUtils()
    }
  },
  computed: {
    Tabs() {
      return Tabs
    },
    InputType() {
      return InputType
    },
    capitalizedActiveTab() {
      return this.activeTab.mainTab.charAt(0).toUpperCase() + this.activeTab.mainTab.slice(1);
    },
    capitalizedUserAction() {
      return this.userAction.charAt(0).toUpperCase() + this.userAction.slice(1);
    },
    getInputfields() {
      let inputFields;
      if (this.isMainTabOnlySelected()) {
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
      if (this.activeTab.mainTab === Tabs.CAMPAIGN_ITEMS && this.activeTab.subTab !== Tabs.DISCOUNTS) {
        return this.userActionsOnSubForms.campaignItemsForm === UserAction.CREATE ? 'Voeg campaign item toe' : 'Campaign item bijwerken';
      } else if (this.activeTab.mainTab === Tabs.TAGS) {
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
      if (this.hasMainTabSubForms()) {
        this.activeTab.subTab = Tabs.BASICS;
      } else {
        this.changeSubTab(null);
      }
    },
    changeSubTab(paramTabName) {
      this.activeTab.subTab = paramTabName;
    },
    hasMainTabSubForms() {
      return this.activeTab.mainTab === Tabs.CAMPAIGN_ITEMS;
    },
    isMainTabOnlySelected() {
      return this.activeTab.mainTab !== null && this.activeTab.subTab === null;
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
      this.tabForms[Tabs.CAMPAIGN_ITEMS].values.push(paramCampaignItemToBeInserted);
    },
    updateCampaignItem(paramCampaignItemToBeUpdated) {
      this.tabForms[Tabs.CAMPAIGN_ITEMS].values = this.tabForms[Tabs.CAMPAIGN_ITEMS].values.map(
          campaignItem => campaignItem.campaignItemId === paramCampaignItemToBeUpdated.campaignItemId ?
              paramCampaignItemToBeUpdated : campaignItem
      );
      this.userActionsOnSubForms.campaignItemsForm = UserAction.CREATE;
    },
    addDiscount(paramDiscountToBeInserted) {
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values.push(paramDiscountToBeInserted);
    },
    updateDiscount(paramDiscountToBeUpdated, paramInputFieldsForDeterminingDiscountType) {

      let existingDiscount = this.listUtils.findItemOfList(
          this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values,
          discount => discount.discountId === paramDiscountToBeUpdated.discountId
      );
      let existingCampaignItem = (this.selectedCampaignItem !== null) ? this.listUtils.findItemOfList(
          this.tabForms[Tabs.CAMPAIGN_ITEMS].values,
          campaignItem => campaignItem.campaignItemId === this.selectedCampaignItem.campaignItemId
      ) : undefined;

      const isCurrentTypePrice = existingDiscount.discountPrice != null;
      const isCurrentTypePercentage = existingDiscount.discountPercentage != null;
      const isUpdatingToPrice = paramInputFieldsForDeterminingDiscountType['radioGroupDiscountType'].value === this.PRICE;
      const isUpdatingToPercentage = paramInputFieldsForDeterminingDiscountType['radioGroupDiscountType'].value === this.PERCENTAGE;

      if (isCurrentTypePrice !== isUpdatingToPrice || isCurrentTypePercentage !== isUpdatingToPercentage) {
        this.$toast.warning('You cannot change the discount type.');
        return;
      }
      if (existingDiscount.discountId !== null && existingCampaignItem !== undefined) {
        this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values = this.listUtils.updateItemToList(
            this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values,
            discount => discount.discountId === paramDiscountToBeUpdated.discountId ? paramDiscountToBeUpdated : discount
        );
        existingCampaignItem.campaignItemDiscounts = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values;
        this.tabForms[Tabs.CAMPAIGN_ITEMS].values = this.listUtils.updateItemToList(
            this.tabForms[Tabs.CAMPAIGN_ITEMS].values,
            campaignItem => campaignItem.campaignItemId === existingCampaignItem.campaignItemId ? existingCampaignItem : campaignItem
        );
      } else {
        this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values = this.listUtils.updateItemToList(
            this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values,
            discount => discount.discountId === paramDiscountToBeUpdated.discountId ? paramDiscountToBeUpdated : discount
        );
      }
      this.userActionsOnSubForms.discountsForm = UserAction.CREATE;
    },
    addTag(paramTagToBeInserted) {
      const existingTag = this.listUtils.findItemOfList(
          this.tabForms[Tabs.TAGS].values,
          tag => tag.toLowerCase() === paramTagToBeInserted.toLowerCase());

      if (existingTag !== undefined) {
        this.$toast.warning('Deze tag bestaat al.');
      } else {
        this.tabForms[Tabs.TAGS].values.push(paramTagToBeInserted);
      }
    },
    updateTag(paramTagToBeUpdated) {
      this.tabForms[Tabs.TAGS].values = this.listUtils.updateItemToList(
          this.tabForms[Tabs.TAGS].values,
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
      let skuList = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].values;
      let skuId = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].inputFields[0].value;
      skuList.push(skuId);
      this.clearInputFields(this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].inputFields);
    },
    removeSku(paramSku) {
      let indexOfSku = this.selectedDiscount.skuIds.indexOf(paramSku);
      this.selectedDiscount.skuIds.splice(indexOfSku, 1);
    }
    ,
    hasUserVisitedCampaignItemsForm() {
      return this.activeTab.mainTab === Tabs.CAMPAIGN_ITEMS && this.activeTab.subTab !== Tabs.DISCOUNTS;
    },
    hasUserVisitedDiscountsForm() {
      return this.activeTab.mainTab === Tabs.CAMPAIGN_ITEMS && this.activeTab.subTab === Tabs.DISCOUNTS;
    },
    handleAdditionalFormAction() {
      if (this.hasUserVisitedCampaignItemsForm()) {
        this.validateTabForms({ basics: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS], images: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.IMAGES] });
        this.validateDiscounts();

        if (this.hasValidationErrors()) return;
        let campaignItem = {
          campaignItemId: (this.selectedCampaignItem !== null) ? this.selectedCampaignItem.campaignItemId : null,
          promoTitle: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[0].value,
          promoText: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[1].value,
          promoImgUrl: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.IMAGES].inputFields[0].value,
          promoImgAltText: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.IMAGES].inputFields[1].value,
          weight: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[2].value,
          teaser: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[3].value,
          extraText: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[4].value,
          campaignItemDiscounts: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values
        }
        this.handleFormActionCampaignItem()[this.userActionsOnSubForms.campaignItemsForm](campaignItem);
        this.clearInputFields(this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields);
        this.clearInputFields(this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.IMAGES].inputFields);
        this.clearDiscounts();
      }
      else if (this.hasUserVisitedDiscountsForm()) {

        this.validateTabForms({ discounts: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS] });
        this.validateSkus();

        if(this.hasValidationErrors()) return;

        let discountTypesRadioGroup = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[1];
        let discountPriceInputField = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[2];
        let discountPercentageInputField = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[3];

        let inputFieldsForDeterminingDiscountType = {
          "radioGroupDiscountType": discountTypesRadioGroup,
          "inputFieldPrice": discountPriceInputField,
          "inputFieldPercentage": discountPercentageInputField
        };

        let discountObject = {
          discountId: (this.selectedDiscount !== null) ? this.selectedDiscount.discountId : null,
          tuPoints: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[4].value,
          skuIds: this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].values,
          discountPrice: null,
          discountPercentage: null
        }

        const discountType = inputFieldsForDeterminingDiscountType['radioGroupDiscountType'].value;
        const selectedDiscountType = this.selectedDiscount ? (discountType === this.PRICE ? this.selectedDiscount.discountPrice : this.selectedDiscount.discountPercentage) : null;
        const isDiscountPrice = () => discountType === this.PRICE;

        if (isDiscountPrice()) {
          discountObject.discountPrice = {
            discountId: selectedDiscountType ? selectedDiscountType.discountId : null,
            price: parseFloat(inputFieldsForDeterminingDiscountType['inputFieldPrice'].value)
          };
        } else {
          discountObject.discountPercentage = {
            discountId: selectedDiscountType ? selectedDiscountType.discountId : null,
            percentage: parseFloat(inputFieldsForDeterminingDiscountType['inputFieldPercentage'].value)
          };
        }

        this.handleFormActionDiscount()[this.userActionsOnSubForms.discountsForm](discountObject, inputFieldsForDeterminingDiscountType);
        this.clearInputFields(this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields);
        this.clearSkus();
      }
      else {
        this.validateTagInputfield();
        if (this.hasValidationErrors()) return;
        let tag = this.tabForms[Tabs.TAGS].inputFields[0].value;
        this.handleFormActionTag()[this.userActionsOnSubForms.tagsForm](tag);
        this.clearInputFields(this.tabForms[Tabs.TAGS].inputFields);
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

      let discountTypesRadioGroup = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[1];
      let discountPriceInputInputField = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[2];
      let discountPercentageInputField = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[3];

      discountPriceInputInputField.disabled = discountTypesRadioGroup.value === this.PERCENTAGE;
      discountPercentageInputField.disabled = discountTypesRadioGroup.value === this.PRICE;

    },
    formSubmit() {
      this.validateTabForms(this.tabForms);
      this.validateCampaignItems();
      if (this.hasValidationErrors()) return;

      let campaign = new CampaignDTO(
          (this.selectedCampaign !== null) ? this.selectedCampaign.campaignId : null,
          null,
          this.tabForms[Tabs.BASICS].inputFields[0].value,
          this.tabForms[Tabs.BASICS].inputFields[1].value,
          this.tabForms[Tabs.BASICS].inputFields[2].value,
          this.tabForms[Tabs.BASICS].inputFields[3].value,
          '9001',
          this.tabForms[Tabs.BASICS].inputFields[4].value,
          this.tabForms[Tabs.BASICS].inputFields[5].value,
          this.tabForms[Tabs.BASICS].inputFields[6].value,
          this.tabForms[Tabs.BASICS].inputFields[7].value,
          [this.tabForms[Tabs.ADVANCED].inputFields[0].value],
          this.tabForms[Tabs.TAGS].values,
          this.tabForms[Tabs.ADVANCED].inputFields[1].value,
          this.tabForms[Tabs.IMAGES].inputFields[0].value,
          this.tabForms[Tabs.IMAGES].inputFields[1].value,
          this.tabForms[Tabs.IMAGES].inputFields[2].value,
          this.tabForms[Tabs.IMAGES].inputFields[3].value,
          null,
          null,
          null,
          null,
          null,
          this.tabForms[Tabs.BASICS].inputFields[1].value,
          this.tabForms[Tabs.CAMPAIGN_ITEMS].values,
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
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].values = [];
    },
    clearDiscounts() {
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values = [];
    },
    clearCampaignItems() {
      this.tabForms[Tabs.CAMPAIGN_ITEMS].values = [];
    },
    clearTags() {
      this.tabForms[Tabs.TAGS].values = [];
    },
    hasValidationErrors() {
      if (this.errorMessages.length > 0) {
        this.errorMessages.forEach(errorMessage => this.$toast.error(errorMessage));
        this.errorMessages = [];
        return true;
      }
      return false;
    },
    validateTabForms(paramTabForms) {
      const errors = [];
      Object.keys(paramTabForms).forEach((tab) => {
        const tabErrors = this.validateFields(paramTabForms[tab].inputFields);
        errors.push(...tabErrors);
      });
      this.errorMessages = errors;
    },
    validateFields(paramInputFields) {
      const errors = [];
      const optionalInputFields = ['campaign-item-tag'];
      paramInputFields.forEach((field) => {
        if (field.required && !field.disabled && (field.value === null || field.value === '') && !optionalInputFields.includes(field.name)) {
          errors.push(`Er ontbreekt een waarde voor de vereiste eigenschap "${field.label}"`);
        } else {
          if (!optionalInputFields.includes(field.name)) {
            if (field.type === InputType.DATE && !this.isValidDate(field)) {
              errors.push(`Startdatum of einddatum mag niet gisteren of vandaag zijn.`);
            } else if (field.type === InputType.TEXT) {
              if ((field.required && !field.disabled) || (field.value !== null && field.value !== '')) {
                const textValidationResult = this.validateText(field);
                if (textValidationResult) {
                  errors.push(textValidationResult);
                }
              }
            } else if (field.type === InputType.TEXT_AREA) {
              if (!this.isValidTextAreaValue(field)) {
                errors.push(`De waarde voor het veld ${field.label} is ongeldig. Voer alstublieft een geldige beschrijving in.`);
              }
            }
          }
        }
      });
      return errors;
    },
    validateText(field) {

      const imageUrlInputFieldNames = [
        'filterImgUrl',
        'promoImgUrl',
        'campaign-item-promo-img',
        'appImageUrl',
      ];
      const regularUrlInputFieldNames = ['relativeUrl', 'termsUrl'];
      const numericInputFieldNames = ['campaign-item-discount-sku', 'campaign-item-discount-price', 'campaign-item-discount-percentage'];
      const excludedInputFieldsForValidatingNormalTextRegex = [...imageUrlInputFieldNames, ...regularUrlInputFieldNames];

      if (!RegEx.TITLE.test(field.value) && !excludedInputFieldsForValidatingNormalTextRegex.includes(field.name)) {
        return `De waarde voor het veld ${field.label} is ongeldig. Voer alstublieft een geldige naam of titel in.`;
      } else if (!RegEx.IMG_URL.test(field.value) && imageUrlInputFieldNames.includes(field.name) && field.required) {
        return `De waarde voor het veld ${field.label} moet een geldige afbeelding extensie hebben (bijvoorbeeld, .jpg).`;
      } else if (!RegEx.REGULAR_URL.test(field.value) && regularUrlInputFieldNames.includes(field.name)) {
        return `De waarde voor het veld ${field.label} moet een geldige URL zijn.`;
      } else if (!RegEx.NUMBER.test(field.value) && numericInputFieldNames.includes(field.name)) {
        return `De waarde voor het veld ${field.label} moet numeriek zijn.`
      }
    },
    isValidTextAreaValue(field) {
      return RegEx.DESCRIPTION.test(field.value);
    },
    isValidDate(field) {
      const now = new Date();
      const selectedDate = new Date(field.value);
      return !(
          (field.name === 'startDate' && selectedDate <= now) ||
          (field.name === 'endDate' && selectedDate <= now)
      );
    },
    validateCampaignItems() {
      if (this.tabForms[Tabs.CAMPAIGN_ITEMS].values.length === 0) {
        this.errorMessages.push("Het is vereist om een campaign item toe te voegen");
      }
    },
    validateDiscounts() {
      if (this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values.length === 0) {
        this.errorMessages.push("Het is vereist om een korting aan een campaign item toe te passen.");
      }
    },
    validateSkus() {
     if (this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].values.length === 0) {
       this.errorMessages.push("Het is vereist om een of meerdere sku's toe te voegen aan een discount.");
     }
    },
    validateSkuInputField() {
      let skuInputField = this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].inputFields[0];
      if (skuInputField.value === null || skuInputField.value === '') {
        this.errorMessages.push("Het invoeren van sku id is vereist.");
      } else {
        const errorMessage = this.validateText(skuInputField);
        if (errorMessage) {
          this.errorMessages.push(errorMessage);
        }
      }
    },
    validateTagInputfield() {
      let tagInputField = this.tabForms[Tabs.TAGS].inputFields[0];
      if (tagInputField.value === null || tagInputField.value === undefined || tagInputField.value === '') {
        this.errorMessages.push("Naam van de tag is vereist.");
      }
    },
    loadCampaignItemsAndTags() {
      this.tabForms[Tabs.CAMPAIGN_ITEMS].values = this.selectedCampaign.campaignItems;
      this.tabForms[Tabs.TAGS].values = this.selectedCampaign.campaignTags;
    },
    loadCampaignItemValuesInForm() {
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[0].value = this.selectedCampaignItem.promoTitle;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[1].value = this.selectedCampaignItem.promoText;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.IMAGES].inputFields[0].value = this.selectedCampaignItem.promoImgUrl;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.IMAGES].inputFields[1].value = this.selectedCampaignItem.promoImgAltText;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[2].value = this.selectedCampaignItem.weight;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[3].value = this.selectedCampaignItem.teaser;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.BASICS].inputFields[4].value = this.selectedCampaignItem.extraText;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].values = this.selectedCampaignItem.campaignItemDiscounts
    },
    loadDiscountValuesInForm() {
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[1].value = (this.selectedDiscount.discountPrice !== null) ? this.PRICE : this.PERCENTAGE;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[2].value = (this.selectedDiscount.discountPrice !== null) ? this.selectedDiscount.discountPrice.price : null;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[3].value = (this.selectedDiscount.discountPercentage !== null) ? this.selectedDiscount.discountPercentage.percentage : null;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[4].value = this.selectedDiscount.tuPoints;
      this.tabForms[Tabs.CAMPAIGN_ITEMS].subTabs[Tabs.DISCOUNTS].inputFields[0].values = this.selectedDiscount.skuIds;
      this.handleDisabledStateOnDiscountSelection();
    },
    loadTagValuesInForm() {
      this.tabForms[Tabs.TAGS].inputFields[0].value = this.selectedTag;
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
          if (field.type === InputType.DATE) {
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