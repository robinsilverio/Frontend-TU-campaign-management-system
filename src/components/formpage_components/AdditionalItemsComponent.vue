<template>
  <div class="list-of-additional-items">
    <p v-if="activeTab === 'Campaign items'">Campaign item(s): </p>
    <p v-else>Tag(s): </p>
    <ol v-if="this.tabForm.values.length > 0">
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Campaign items'">{{ item.promoTitle }}</li>
      <li v-for="(item, index) in this.tabForm.values" :key="index" v-if="activeTab === 'Tags'" @click="dropForm()">{{ item.title }}</li>
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
  }
}
</script>
<style scoped>
  .campaign-form .list-of-additional-items {
    padding: 20px;
  }
  .campaign-form .list-of-additional-items ol {
    border: 1px solid;
    background-color: #eee;
    height: 100px;
    overflow: auto;
  }
</style>