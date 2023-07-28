<template>
  <div class="list-of-additional-items">
    <p>{{ printOrderedListTitle[this.activeTab] }}</p>
    <ol v-if="this.tabForm.values.length > 0">
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Campaign items'">{{ item.promoTitle }}</li>
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Tags'">{{ item }}</li>
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Discounts'">{{ item.skuIds.join(", ") }}</li>
    </ol>
    <p v-else style="color: red; font-weight: bold">De lijst is leeg.</p>
  </div>
</template>
<script>
export default {
  name: "AdditionalItemsComponent",
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
</style>