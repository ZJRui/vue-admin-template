<template >
    <div v-if="!item.hidden">
        <!-- <template v-if="">
            <app-link v-if="" :to="">

            </app-link>

        </template> -->
        
    </div>
</template>
<script>
import AppLink from './Link.vue'
export default {

    name:"LearnSidebarItem",
    props:{
        item:{
            type:Object,
            required:true
        }
    },
    components:{
        AppLink,
    }
    
}
</script>
<style lang="">
    
</style>