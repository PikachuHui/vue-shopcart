import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 被选中的商品列表
        checked_goods: []
    },
    mutations: {
        // 向被选中商品列表中添加一个商品
        pushGoods: (state, item) => {
            if (state.checked_goods.length >= 1) {
                state.checked_goods.forEach((goods, index) => {
                    // 检查相同ID商品是否已存在
                    if (goods.id == item.id) {
                        state.checked_goods.splice(index, 1);
                    }
                });
            }
            state.checked_goods.push(item);
        },
        // 删除单个被选中商品列表中的商品
        popGoods: (state, id) => {
            state.checked_goods.forEach(goods => {
                if (goods.id == id) {
                    --goods.totality;
                }
            });
        },
        // 删除被选中的指定商品
        removeGoods: (state, id) => {
            state.checked_goods.forEach((goods, index) => {
                if (goods.id == id) {
                    state.checked_goods.splice(index, 1);
                }
            });
        }
    },
    getters: {
        refreshTotalPrice: state => {
            let total_price = 0;
            state.checked_goods.forEach(item => {
                total_price += item.price * item.totality;
            });
            return parseFloat(total_price).toFixed(2);
        },
        checkedShopTotal: state => {
            return state.checked_goods.length;
        }
    }
})