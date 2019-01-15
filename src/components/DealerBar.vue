<template>
    <div v-if="display">
         <!-- 店铺信息 -->
        <div class="store-bar">
            <input type="checkbox" v-model="checked" @click="checkItemHandler">
            <img class="store-logo" :src="logo">
            <p class="store-name">{{name}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DealerBar',
    props: ['id', 'name', 'logo'],
    data() {
        return {
            display: true,
            checked: false
        }
    },
    methods: {
        checkItemHandler: function() {
            this.checked = !this.checked;
            this.$emit('storeItemSelect', {store_id: this.id, checked: this.checked});
        }
    }
}
</script>

<style scoped>
/* 商品所属店家 */
.store-bar{
    padding: .5rem;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-bottom: solid 1px #dfdfdf;
}
.store-logo{
    margin: 0 .3rem 0 .5rem;
    height: 1rem;
}
.store-name{
    color: #444;
    font-weight: bold;
    letter-spacing: 1px;
}
</style>

