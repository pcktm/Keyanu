<template>
  <div class="passthrough" @click="hide">
    <nuxt/>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  methods: {
    hide() {
      ipcRenderer.send('toggle-window');
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  width: 0px;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
body {
  margin: 0 !important;
  color: white;
  font-family: "Work Sans";
  /* overflow: hidden; */
}
.passthrough {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0; 
  right: 0;
  overflow: auto;
}
.roundwrap {
  background: rgba(0, 0, 0, .9);
  /* background: linear-gradient(to bottom, rgba(0, 0, 0, .3) 0, rgba(0, 0, 0, .8) 40px, rgba(0, 0, 0, .8) calc(100% - 40px), rgba(0, 0, 0, .3) 100%); */
  border: 5px solid rgba(0, 0, 0, .5);
  border-radius: 10px;
  padding: 20px 20px 30px;
  margin-top: 150px;
  margin-bottom: 50px;
  /* position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0; */
  /* overflow: auto; */
  box-sizing: border-box;
}
</style>
