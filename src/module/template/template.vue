<template>
    <div class="top">
        <div class="one"><span class="arrow"></span></div>
        <div class="two"><p>123</p><span>456</span></div>
        <div class="three">
            <button id="jj" @click="jqjq">jq控制台查看</button>
            <button @click="aa">axios</button>
        </div>
    </div>
</template>

<script>

import Lib from 'assets/lib.js';

export default {
    data(){
        return {

        }
    },
    created(){

    },
    methods: {
        jqjq(){
            console.log($('#jj'));
        },
        aa(){
            axios.get('/public/sactivity/shop_list/')
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>

