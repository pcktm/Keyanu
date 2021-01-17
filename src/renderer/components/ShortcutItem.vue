<template>
  <div class="wrap shortcutitem" :class="[selected && 'selected']" ref="wrap" @click="mouseClick">
    <div class="keys">
      <component v-for="(key, idx) in keysSplit" :key="idx" :is="idx % 2 == 0 ? keyComponent : 'span'" :text="key">
        {{key}}
      </component>
    </div>

    <aside class="dash">—</aside>
    <aside>
      {{desc}}
    </aside>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
  data() {
    return {
      keyComponent: () => import('./KeyboardKey')
    }
  },
  props: {
    keys: String,
    desc: String,
    selected: Boolean
  },
  mounted() {
    window.addEventListener('keydown', this.keyDown);
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyDown);
  },
  methods: {
    mouseClick() {
      console.log()
      const keys = this.keysSplit.filter((_, idx) => idx % 2 == 0).map(x => (
        {
          CTRL: 'control'
        }[x] || x
      ).toLowerCase());
      this.$emit('reset-selected', {keys: this.keys, desc: this.desc});
      ipcRenderer.send('type-shortcut', keys);
    },
    keyDown({key}) {
      if (key === 'Enter' && this.selected) {
        this.mouseClick();
      }
    },
  },
  computed: {
    keysSplit() {
      return this.keys.split(' ')
    }
  },
  watch: {
    selected(n) {
      if (n) this.$refs.wrap.scrollIntoView({block: "center", inline: "nearest"})
    }
  }
}
</script>

<style lang="scss" scoped>
.keys {
  display: flex;
  // justify-content: center;
  align-items: center;
  $gap: 2px;
  margin: -$gap;
  & > * {
    margin: $gap;
  }
  span {
    font-size: 1.2rem;
  }
}
.wrap {
  
}
aside {
  margin-left: 10px;
  font-size: 1.1rem;
}
.dash {
  position: relative;
  top: -2px;
}
.selected {
  // transform: scale(1.03);
  // transition: transform .1s ease-in-out;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    $gap: 5px;
    top: -$gap;
    left: -$gap;
    right: -$gap - 10px;
    bottom: -$gap;
    // background: white;
    border: 2px solid white;
    border-radius: 5px;
    // z-index: 0;
  }
  & > * {
    // z-index: 1000;
  }
}
.shortcutitem {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  // transition: transform .1s ease-in-out;
  & + & {
    margin-top: 20px;
  }
  &:hover::before {
    content: '';
    position: absolute;
    $gap: 5px;
    top: -$gap;
    left: -$gap;
    right: -$gap - 10px;
    bottom: -$gap;
    // background: white;
    border: 2px solid white;
    border-radius: 5px;
    // z-index: 0;
  }
}
</style>