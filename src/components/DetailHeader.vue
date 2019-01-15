<template>
    <!-- 详情页面页首 -->
    <div class="detail-header">
        <div class="back" @click="goback"></div>
        <p class="page-title">{{page_title}}</p>
        <div class="menu"></div>
    </div>
</template>

<script>
export default {
    name: 'DetailHeader',
    props: ['page_title'],
    methods: {
        goback() {
            this.$router.back();
        }
    }
}
</script>

<style scoped>
.detail-header{
    padding: .5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #dfdfdf;
    background-color: #fff;
    z-index: 1000;
}

.back, .menu{
    padding: .2rem;
    width: 1.3rem;
    height: 1.3rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 90%;
}

.back{
    background-image: url('../../static/image/cheveron-left.svg');
}

.menu{
    background-image: url('../../static/image/navigation-more.svg');
}

.page-title{
    color: #333;
    font-size: 1.1rem;
}
</style>

