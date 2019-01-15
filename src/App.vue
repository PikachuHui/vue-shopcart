<template>
  <div class="container">
    <detail-header :page_title='page_title'></detail-header>

    <div class="items" v-for="items in store_list" :key="items.id">
      <dealer-bar ref="dealer_bar"
        :id="items.id"
        :name="items.name"
        :logo="items.logo"
        @storeItemSelect="storeItemSelectHandler"
      ></dealer-bar>
      <shop-item v-for="item in items.goods_list" :key="item.id"
        ref="shop_item"
        :item="item"
        @shopItemSelect="shopItemSelectHandler"
        @deleteShopItem="deleteShopItemHandler"
      ></shop-item>
    </div>

    <settle-account-bar ref="settle_account"
      @allSelect="allSelectHandler"
    ></settle-account-bar>
  </div>
</template>

<script>
// 公共样式
import '../static/css/global.css'
// 详情页面头部
import DetailHeader from './components/DetailHeader'
// 店家信息头部
import DealerBar from './components/DealerBar'
// 商品详情栏
import ShopItem from './components/ShopItem'
// 结算栏
import SettleAccountBar from './components/SettleAccountBar'

export default {
  name: 'App',
  data() {
    return {
      page_title: '购物车',
      store_list: [],
      goods_list: []
    }
  },

  components: {
    DetailHeader,
    DealerBar,
    ShopItem,
    SettleAccountBar
  },

  mounted() {
    this.getGoodsList();
    this.getStoreList();
    // 等待数据获取完毕
    let mergerGoodsListClock = setInterval(() => {
      if(this.goods_list.length && this.store_list) {
        this.mergerGoodsToStore();
        clearInterval(mergerGoodsListClock);
      }
    }, 10);
  },

  methods: {
    getGoodsList() {
      this.axios.get('./static/dataset/goods.json')
      .then((response) => {
        this.goods_list = response.data;
      }).catch((error) => {
        console.log(error);
      });
    },

    getStoreList() {
      this.axios.get('./static/dataset/stores.json')
      .then((response) => {
        this.store_list = response.data;
      }).catch((error) => {
        console.log(error);
      });
    },

    /**
     * 归并商品至对应的店铺
     */
    mergerGoodsToStore() {
      this.goods_list.forEach(goods => {
        this.store_list.forEach(store => {
          if(goods.store_id == store.id) {
            if(typeof store.goods_list == 'undefined') {
              // 往data数据对象内添加新属性需要通过set方法，否则vue无法检测到属性的添加
              this.$set(store, 'goods_list', []);
            }
            store.goods_list.push(goods);
          }
        });
      });
    },

    /**
     * 处理商品被选中
     */
    shopItemSelectHandler(params) {
      if(this.$store.state.checked_goods.length > 0) {
        this.$refs.settle_account.enabled = true;
      }else {
        this.$refs.settle_account.enabled = false;
      }
      // 指定店铺商品是否全选中
      if(this.$options.methods.isAllSelectedOfStoreGoods.bind(this)(params.store_id)) {
        this.$refs.dealer_bar.forEach(dealer => {
          if(dealer.id == params.store_id) {
            dealer.checked = true;
          }
        });
      }else {
        this.$refs.dealer_bar.forEach(dealer => {
          if(dealer.id == params.store_id) {
            dealer.checked = false;
          }
        });
      }
      // 商品是否全部被选中
      this.$refs.settle_account.checked = this.$options.methods.isAllSelectedOfGoods.bind(this)();
    },

    /**
     * 处理商品被删除
     */
    deleteShopItemHandler(params) {
      // 从store_list中删除指定商品
      this.store_list.forEach(store => {
        if(store.id == params.store_id) {
          store.goods_list.forEach((goods, index) => {
            if(goods.id == params.id) {
              store.goods_list.splice(index, 1);
            }
          });
        }
      });
      // 如果对应的店铺已无商品，则将此店铺栏隐藏
      if(!this.$options.methods.getGoodsTotalOfStore.bind(this)(params.store_id)) {
        this.$refs.dealer_bar.forEach(dealer => {
          if(dealer.id == params.store_id) {
            dealer.display = false;
          }
        });
      }
    },

    /**
     * 处理店铺被选中
     */
    storeItemSelectHandler(params) {
      this.$refs.shop_item.forEach(shop => {
        if(shop.item.store_id == params.store_id) {
          shop.checked = params.checked;
        }
      });
    },

    /**
     * 全选被选中
     */
    allSelectHandler(params) {
      this.$refs.shop_item.forEach(shop => {
        shop.checked = params.checked;
      });
    },

    /**
     * 获取指定店铺商品总数
     * @param store_id 店铺ID
     * @return int goods_total 店铺商品总数
     */
    getGoodsTotalOfStore(store_id) {
      let goods_total = 0;
      this.store_list.forEach(store => {
        if(store.id == store_id) {
          goods_total = store.goods_list.length;
        }
      });
      return goods_total;
    },

    /**
     * 获取指定店铺已选中商品数量
     * @param store_id 店铺ID
     * @return int selected_goods_total 已选中的店铺商品总数
     */
    getSelectedGoodsTotalOfStore(store_id) {
      let selected_goods_total = 0;
      this.$store.state.checked_goods.forEach(goods => {
        if(goods.store_id == store_id) {
          ++selected_goods_total;
        }
      });
      return selected_goods_total;
    },

    /**
     * 指定店铺商品是否全选中
     * @param store_id 店铺ID
     * @return boolean
     */
    isAllSelectedOfStoreGoods(store_id) {
      if(this.$options.methods.getGoodsTotalOfStore.bind(this)(store_id) == 
        this.$options.methods.getSelectedGoodsTotalOfStore.bind(this)(store_id)) {
          return true;
        }else {
          return false;
        }
    },

    /**
     * 所有商品是否选中
     * @return boolean
     */
    isAllSelectedOfGoods() {
      let all_checked_total = 0;
      this.store_list.forEach(store => {
        all_checked_total += store.goods_list.length;
      });
      if(all_checked_total == this.$store.state.checked_goods.length) {
        return true;
      }else {
        return false;
      }
    }
  }
}
</script>

<style scoped>
.items{
  margin-bottom: 1rem;
}

.container{
  margin-bottom: 2.2rem;
}
</style>
