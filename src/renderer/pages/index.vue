<template>
  <div @click.stop>
    <!-- transparent {{show}} -->
    <transition name="fade">
      <div v-if="show" class="roundwrap">

        <div v-if="files.length" class="wrap" ref="masonry">
          <!-- {{files}} -->
          <h1>{{ activeFile ? activeFile.app.name : focusedProcess.name }}</h1>
          <SearchBar v-if="activeFile" :q.sync="search" ref="search"/>
          <div v-if="activeFile" class="masonry">
            <Section
              v-for="([name, section], idx) in filteredSections"
              :key="idx"
              :name="name"
              :section="section"
              :selected="
                selected -
                filteredSections
                  .slice(0, idx)
                  .map((x) => x[1])
                  .reduce((acc, val) => [...acc, ...Object.keys(val)], []).length
              "
              @reset-selected="onSelect"
            />
          </div>
          <h1
            v-else
            style="text-align: center; margin-bottom: -10px; font-size: 1.2rem"
          >
            Niestety, nie znamy skrótów klawiszowych dla tego programu.
          </h1>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import { promises } from "fs";
import { parse } from "toml";
import * as path from "path";

export default {
  data() {
    return {
      search: "",
      itempos: [],
      selected: -1,
      files: [],
      focusedProcess: {},
      show: false
    };
  },
  async mounted() {
    console.log("mount");
    window.addEventListener("keydown", this.keyDown);
    ipcRenderer.on('shortcut-invoked', this.onAltSpace);
    ipcRenderer.on('window-hidden', this.hide);
    const fileNames = await promises.readdir(path.join(this.respath, "app/dist/resources/shortcuts/"));
    const files = [];
    for (const fileName of fileNames) {
      const { name, process, ...sections } = parse(
        await promises.readFile(path.join(this.respath, "app/dist/resources/shortcuts/", fileName))
      );
      files.push({
        app: {
          name,
          process,
        },
        sections,
      });
    }
    this.files = files;
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyDown);
    ipcRenderer.removeListener('shortcut-invoked', this.onAltSpace);
    ipcRenderer.removeListener('window-hidden', this.hide);
  },
  methods: {
    keyDown(e) {
      if (e.key === "ArrowDown") {
        this.selected++;
        const filteredItemsCount = this.filteredSections
          .map((x) => x[1])
          .reduce((acc, val) => [...acc, ...Object.keys(val)], []).length;
        if (this.selected >= filteredItemsCount)
          this.selected = filteredItemsCount - 1;
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        this.selected--;
        if (this.selected < 0) this.selected = 0;
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") {
        const [top, left] = this.itempos[this.selected];
        const col = this.itempos.slice(0, this.selected);
        let nearest = null;
        let nearestDist = Infinity;
        col.forEach(([_top], i) => {
          const dist = Math.abs(top - _top);

          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = i;
          }
        })
        this.selected = nearest;
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        const [top, left] = this.itempos[this.selected];
        const idx = this.itempos.findIndex(([_top, _left]) => _left > left);
        if (!~idx) return;
        const col = this.itempos.slice(idx);
        let nearest = null;
        let nearestDist = Infinity;
        col.forEach(([_top], i) => {
          const dist = Math.abs(top - _top);

          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = idx + i;
          }
        })
        this.selected = nearest;
        e.preventDefault();
      }
      if (e.key === "Escape") {
        console.log('esc');
        ipcRenderer.send('toggle-window');
        e.preventDefault();
      }
    },
    onAltSpace(_, data) {
      this.focusedProcess = data;
      setTimeout(() => {
        this.show = true;
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.$refs.search?.$refs?.search?.focus?.()
          })
        })
        // this.$refs.search.$refs.search.focus()
      }, 10);
    },
    hide() {
      this.show = false;
    },
    onSelect({keys, desc}) {
      this.selected = -1;
      this.$store.commit('recent/use', {process: this.focusedProcess.process, keys, desc});
    }
  },
  computed: {
    activeFile() {
      return this.files.find(
        (x) => x.app.process === this.focusedProcess.process
      );
    },
    respath() {
      return process.resourcesPath;
    },
    sections() {      
      return {
        'Ostatnio Używane': Object.fromEntries(
          Object.entries(this.$store.state.recent.processes[this.focusedProcess.process] || {}).reverse()
        ),
        ...(this.activeFile?.sections || {}),
      };
    },
    filteredSections() {
      if (!this.sections) return [];
      this.$nextTick(() => {
        this.itempos = [
          ...this.$refs.masonry.querySelectorAll(".shortcutitem"),
        ].map((x) => [
          x.getBoundingClientRect().top,
          x.getBoundingClientRect().left,
        ]);
      });
      return Object.entries(this.sections).map(([k, v]) => [
        k,
        Object.fromEntries(
          Object.entries(v).filter(
            ([k2, v2]) => ~v2.toLowerCase().indexOf(this.search.toLowerCase())
          )
        ),
      ]);
    },
  },
  watch: {
    // filteredSections: {
    //   immediate: true,
    //   deep: true,
    //   handler(n) {
    //     if (!n.length) return;
    //     this.$nextTick(() => {
    //       this.itempos = [
    //         ...this.$refs.masonry.querySelectorAll(".shortcutitem"),
    //       ].map((x) => [
    //         x.getBoundingClientRect().top,
    //         x.getBoundingClientRect().left,
    //       ]);
    //     });
    //   },
    // },
    search(n) {
      this.selected = -1;
    },
    show(n) {
      // console.log(n);
      if (!n) {
        this.search = '';
        this.selected = -1;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: all .2s ease-in-out 0s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(50px);
}
.wrap {
}
h1 {
  text-align: center;
  margin: 0;
  margin-bottom: 30px;
  // margin-top: 5px;
  font-size: 1.5rem;
  font-family: "Barlow";
}
.masonry {
  // height: 200px;
  padding: 1px;
  margin: 1px;
  columns: 2;
}
</style>
