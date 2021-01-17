<template>
  <div v-if="Object.entries(section).length" class="wrapsection">
    <h1>
      <i v-if="name === 'Ostatnio Używane'" class="bx bxs-time"/>
      {{name}}
    </h1>
    <ShortcutItem v-for="([keys, desc], idx) in Object.entries(section)" :key="idx" :keys="keys" :desc="desc" :selected="selected == idx" v-on="$listeners"/>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    section: null,
    selected: null
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-family: "Barlow";
  font-size: 1.2rem;
  text-transform: uppercase;
  margin-top: 0;
  display: flex;
  align-items: center;
  i {
    font-size: 1rem;
    margin-right: 7px;
  }
}
.wrapsection {
  break-inside: avoid-column;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 10px;
  & + & {
    margin-top: 30px;
  }
}
</style>