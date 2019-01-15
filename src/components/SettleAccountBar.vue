<template>
    <!-- 结算栏 -->
    <div class="settle-container">
        <div class="all-check">
            <input type="checkbox" id="all_select" v-model="checked" @click="allSelect">
            <label for="all_select">全选</label>
        </div>
        <div class="settle-right-side">
            <div class="count-side">
                <div class="count-price"><span class="count-price-text">总计：</span>￥{{totalPrice}}</div>
                <div class="count-more">总额￥{{totalPrice}} 立减￥0.00</div>
            </div>
            <div class="go-settle" :class="{enabled: enabled}"><span class="go-settle-text">去结算</span>({{checkedShopTotal}}件)</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SettleAccountBar',
    data() {
        return {
            checked: false,
            enabled: false
        }
    },
    methods: {
        allSelect() {
            this.checked = !this.checked;
            this.$emit('allSelect', {checked: this.checked});
        }
    },
    computed: {
        totalPrice() {
            return this.$store.getters.refreshTotalPrice;
        },
        checkedShopTotal() {
            return this.$store.getters.checkedShopTotal;
        }
    }
}
</script>
<style scoped>
.settle-container{
    bottom: 0;
    width: 540px;
    display: flex;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, .8);
    border-top: solid 1px #DFDFDF;
    font-size: .8rem;
    position: fixed;
    z-index: 1000;
}
.all-check{
    padding: .5rem 0 .5rem .25rem;
    color: #666;
    font-size: .6rem;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.settle-right-side{
    display: flex;
    align-items: center;
}

.count-side{
    margin-right: .5rem;
    text-align: right;
}
.count-price{
    color: #E93B3D;
    font-weight: bold;
    font-size: .9rem;
}
.count-price-text{
    color: #333;
    font-size: 1rem;
}
.count-more{
    color: #888;
    font-size: .6rem;
}

.go-settle{
    padding: .9rem 1.2rem;
    color: #fff;
    background-color: #D7D7D7;
    text-align: center;
    cursor: pointer;
}
.go-settle-text{
    font-size: 1rem;
    font-weight: bold;
}

.enabled{
    background-color: #E4393C;
}
</style>


