<template>
  <div class="wrap">
    {{text}}
  </div>
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: .2em .5em;
  background: white;
  border-bottom: 3px solid #ccc;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: 600;
  min-width: 15px;
}
</style>