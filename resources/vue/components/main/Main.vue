<template>
  <h1>Main</h1>
</template>

<script>
export default {
  name: "Main",
  created() {
    this.$store.dispatch('develop')
  }
}
</script>

<style scoped>

</style>