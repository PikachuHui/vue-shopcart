<template>
    <!-- 单个商品详情 -->
    <div class="shop-item" v-if="display">
        <input type="checkbox" v-model="checked">
        <div class="shop-detail">
            <img class="shop-image" :src="item.image" alt="商品图片">
            <div class="shop-information">
                <p>{{item.name}}</p>
                <div class="shop-detail-line">
                    <select class="size" v-if="item.size.length > 1">
                        <option :value="option" v-for="(option, index) in item.size" :key="index">{{option}}</option>
                    </select>
                    <p class="size" v-else>{{item.size[0]}}</p>
                    <div class="shop-detail-sub-line">
                        <p class="shop-price">￥{{currentPrice | formatMoney}}</p>
                        <ul class="shop-number-controller">
                            <li class="operation" @click="totalPrice(false)">-</li>
                            <li>{{item.totality}}</li>
                            <li class="operation" @click="totalPrice(true)">+</li>
                        </ul>
                    </div>
                </div>
                <div class="delete-shop" @click="deleteItem">删除</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShopItem',
    props: ['item'],
    data() {
        return {
            display: true,
            currentPrice: 0,
            checked: false
        }
    },
    watch: {
        checked: function() {
            this.checked ? this.$options.methods.pushGoods.bind(this)() : this.$store.commit('removeGoods', this.item.id);
            this.$emit('shopItemSelect', {store_id: this.item.store_id});
        }
    },
    methods: {
        // 删除商品
        deleteItem() {
            if(confirm('您确定删除此商品吗？')) {
                this.display = !this.display;
                // 确保删除当前商品后结算栏总价更新
                this.$store.commit('removeGoods', this.item.id);
                this.$emit('deleteShopItem', {id: this.item.id, store_id: this.item.store_id});
                return true;
            }else {
                return false;
            }
        },
        // 统计单件商品的价格
        totalPrice(flag) {
            if(flag) {
                // 响应式更改props中的数据
                this.$set(this.item, 'totality', ++this.item.totality);
                this.currentPrice = parseFloat(this.item.price * this.item.totality);
                this.$options.methods.pushGoods.bind(this)();
            }else {
                if(this.item.totality <= 1) {
                    if(!this.deleteItem()){
                        return;
                    }
                }
                this.$set(this.item, 'totality', --this.item.totality);
                this.currentPrice = parseFloat(this.currentPrice - this.item.price);
                this.$store.commit('popGoods', this.item.id);
            }
        },
        // 状态管理中添加被选中商品
        pushGoods() {
            if(this.checked) {
                this.$store.commit('pushGoods', {
                    id: this.item.id,
                    price: this.item.price,
                    totality: this.item.totality,
                    store_id: this.item.store_id
                });
            }
        }
    },
    filters: {
        formatMoney(value) {
            return value.toFixed(2);
        }
    },
    mounted() {
        this.currentPrice = this.item.price * this.item.totality;
    }
}
</script>

<style scoped>
/* 商品详情 */
.shop-item{
    padding: .5rem;
    font-size: .8rem;
    display: flex;
    align-items: center;
    background-color: #fff;
}
input[type="checkbox"]{
    margin-right: .5rem;
} 
.shop-image{
    margin-top: .3rem;
    width: 4.7rem;
    height: 4.7rem;
}
.shop-detail{
    flex: 1;
    display: flex;
}
.shop-information{
    padding: .3rem;
    display: flex;
    flex-direction: column;
}
.shop-detail-line{
    padding-top: 1rem;
    width: 26rem;
    display: flex;
    flex-direction: column;
}
.size{
    padding: .1rem;
    color: #999;
    font-size: .6rem;
}
.shop-detail-sub-line{
    margin-top: .5rem;
    display: flex;
    justify-content: space-between;
}

.shop-price{
    color: #E93B3D;
}
.shop-number-controller{
    display: flex;
    align-items: center;
}
.shop-number-controller{
    list-style: none;
}
.shop-number-controller>li{
    width: 2rem;
    height: 1.6rem;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
}
.shop-number-controller>li:not(:first-child){
    border-left: solid 1px #fff;
}
.operation{
    color: #333;
    font-size: 1.4rem;
    cursor: pointer;
}
.delete-shop{
    margin-top: .6rem;
    margin-left: auto;
    color: #666;
    text-align: right;
    cursor: pointer;
}
</style>

