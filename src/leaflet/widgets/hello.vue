<template>
    <div>
        <h1>{{ title }}</h1>
        <p>count:{{ count }}</p>
        <a href="javascript:;" @click="add">add</a>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: "Hello,world"
        }
    },
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
