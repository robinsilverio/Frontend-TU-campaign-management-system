<template>
  <div class="list-of-additional-items">
    <p v-if="activeTab === 'Campaign items'">Campaign item(s): </p>
    <p v-else>Tag(s): </p>
    <ul>
      <li v-if="this.tabForm.values.length === 0">Leeg</li>
      <li v-for="(item, index) in this.tabForm.values" :key="index">{{ item.title }}</li>
    </ul>
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

</style>