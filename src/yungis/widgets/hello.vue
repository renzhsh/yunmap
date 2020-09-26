<template>
  <div>
    <h1>Hello,world</h1>
    <p>count:{{count}}</p>
    <a href="javascript:;" @click="add">add</a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    add() {
      this.count++;
    }
  }
};
</script>
