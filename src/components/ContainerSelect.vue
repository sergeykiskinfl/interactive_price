<template>
  <!-- Компонент для выпадающего списка -->
  <div class="multiselect">
        <div class="selectbox" @click="checkexpand">
          <select>
            <option>Select a {{kind.title}}</option>
          </select>
          <div class="overselect"></div>
        </div>
        <div class="checkboxes" :style="{display:visible}">
            <label v-for="opt in kind.opts" :key="opt.id" :for="opt.title">
              <input type="checkbox" :id="opt.title" :value="opt.title" v-model="checked">
              {{opt.title}}
            </label>
        </div>
  </div>  
</template>

<script>

export default {
  
  data: function(){

    return {

      visible:"none",
      expanded:false,
      checked:[],
      allopts:"kind.opts"

      }

  },

  name: 'ContainerSelect',
  props: ['kind'],
 
  methods:{
    //Метод для отображения раскрытия списка
    checkexpand:function(){

      if (!this.expanded) {
        this.visible = 'block';
        this.expanded = true;
      } else{
        this.visible='none';
        this.expanded=false;
      }
    
    } 

  }  

}
</script>

<style lang="stylus" scoped>

dpc()
  clear both
  display block

.multiselect
  width auto
  text-align right
  dpc()

.selectbox
  position relative
  margin-bottom 5px
  & select
    width 100%
    font-weight bold
    
          
.overselect
  position absolute
  left 0
  right 0
  top 0
  bottom 0
    
.checkboxes
  display block
  padding 3px
  float left
  margin-bottom 5px
  & label
    dpc()
    &:hover
      background-color #228b22
      color #ffffff

label
  float left
  padding-right 15px

</style>