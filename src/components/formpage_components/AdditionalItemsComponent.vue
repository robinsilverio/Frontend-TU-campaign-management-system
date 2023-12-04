<template>
  <div class="list-of-additional-items">
    <p>{{ printOrderedListTitle[this.activeTab] }}</p>
    <ol v-if="this.tabForm.values.length > 0">
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Campaign items'" @click="selectCampaignItem(item)">
        {{ item.promoTitle }}
        <img
            src="../../assets/images/icons/close.png"
            alt="remove"
            style="position: relative; top: 1px;"
            @click="removeCampaignItem(item)"
        />
      </li>
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Tags'" @click="selectTag(item)">
        {{ item }}
        <img
            src="../../assets/images/icons/close.png"
            alt="remove"
            style="position: relative; top: 1px;"
            @click="removeTag(item)"
        />
      </li>
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Discounts'" @click="selectDiscount(item)">
        {{ item.skuIds.join(", ") }}
        <img
            src="../../assets/images/icons/close.png"
            alt="remove"
            style="position: relative; top: 1px;"
            @click="removeDiscount(item)"
        />
      </li>
    </ol>
    <p v-else style="color: red; font-weight: bold">De lijst is leeg.</p>
  </div>
</template>
<script>
export default {
  name: "AdditionalItemsComponent",
  emits: [
      'onSelectCampaignItem',
      'onSelectDiscount',
      "onSelectTag",
      'onRemoveCampaignItem',
      'onRemoveTag',
      'onRemoveDiscount'
  ],
  props: {
    activeTab: {
      type: String,
      default: () => null
    },
    tabForm: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    printOrderedListTitle() {
      return {
        "Campaign items" : "Campaign item(s): ",
        "Discounts": "Discount(s):",
        "Tags": "Tag(s):"
      }
    }
  },
  methods: {
    selectCampaignItem(paramCampaignItem) {
      this.$emit('onSelectCampaignItem', paramCampaignItem);
    },
    selectDiscount(paramDiscount) {
      this.$emit('onSelectDiscount', paramDiscount);
    },
    selectTag(paramTag) {
      this.$emit('onSelectTag', paramTag);
    },
    removeCampaignItem(paramCampaignItem) {
      event.stopPropagation();
      this.$emit('onRemoveCampaignItem', paramCampaignItem);
    },
    removeTag(paramTag) {
      event.stopPropagation();
      this.$emit('onRemoveTag', paramTag);
    },
    removeDiscount(paramDiscount) {
      event.stopPropagation();
      this.$emit('onRemoveDiscount', paramDiscount);
    }
  }
}
</script>
<style scoped>
  .campaign-form .list-of-additional-items:not(.form-controls.sub-tab-form-controls .list-of-additional-items) {
    padding: 20px;
  }
  .campaign-form .list-of-additional-items ol {
    border: 1px solid;
    background-color: #eee;
    height: 100px;
    overflow: auto;
    padding-left: 20px;
  }
  .campaign-form .list-of-additional-items ol li { cursor: pointer; }
</style>