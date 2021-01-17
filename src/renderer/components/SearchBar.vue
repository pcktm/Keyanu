<template>
  <div class="outer">
    <div class="wrap">
      <i class="bx bx-search" />
      <input :value="q" @input="$emit('update:q', $event.target.value)" ref="search">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    q: String
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  border-bottom: 2px solid white;
  padding-bottom: 5px;
}
.outer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}
input {
  background: none;
  border: 0;
  outline: none;
  width: 300px;
  color: white;
  font-family: "Work Sans";
  font-size: 1.5rem;
  margin-left: 10px;
  margin-top: -5px;
}
</style>