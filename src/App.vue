<template>
  <div id="app">
    <!-- Диалоговое окно -->
    <form name="form1" @submit.prevent="onContainerCb">
      <div id="border-green" class="content">
        
        <!-- Выпадающие списки -->
        <div class="content" id="select-container">
          <ContainerSelect
            v-for="kind in kinds"
            :key="kind.id"
            :kind="kind"
            ref="containercb"                                                      
          ></ContainerSelect>
        </div>
        
        <!-- Двойной ползунок -->
        <div id="slider-section">
          <div class="slalign content">
            <input id="input-left" type="number" :min='min' :max='max' v-model="value[0]"/>
            <input id="input-right" type="number" :min='min' :max='max' v-model="value[1]"/>
          </div>
            
          <div class="slalign content">
            <vue-slider 
            v-model='value'
            :min="min"
            :max='max'
            :interval='1000'
            :process='true'
            :process-style="{ backgroundColor: 'green' }"
            :dot-options='dotOptions'
            :enable-cross='false'
            :marks="[0, 70000]"
            ></vue-slider>
          </div>
        </div>
        
      </div>
 
      <div class="top_bar">
        <input type="submit" value="Show prices">
      </div>

    </form>
    
    <!-- Таблица с результатом запроса -->
    <table id="table-content">
      <tr class="header-row">
        <th>Model</th>
        <th>Category</th>
        <th>Vendor</th>
        <th>Cost, $</th>
      </tr>
    </table>

   </div>
</template>

<script>

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import ContainerSelect from './components/ContainerSelect.vue'
import axios from 'axios'


export default {
  name: 'app',
  components: {
    VueSlider,
    ContainerSelect
  },
  data: function () {
      return {
        value: [0, 70000],
        min:0,
        max:70000,
        dotOptions:[{
          tooltip:'focus'
        },
        {
          tooltip:'focus'
        }
        ],

        kinds: [{id:0, title:'category', opts:[]}, 
            {id:1, title:'vendor', opts:[]}],
        
        checkedcb:{},
               
      }
    },
 
  mounted(){
   
   /**
    * Первоначальное отображение приложения. Данные извлекаются из сервера PostgreSQL (порт 5432) через промежуточный сервер (порт 3000).
    * 
    * @param {Object[]} kinds данные для отображения в выпадающих списках
    * @param {string} baseUrl адрес промежуточного сервера, с которого получается ответ, для отображения в выпадающих списках
    */

   (async (kinds, baseUrl) => {
    
      for (let i=0; i < kinds.length; i++) {

          let url = baseUrl + kinds[i]['title'];
          let response = await axios.get(url);
          this.kinds[i].opts = response.data;
          
                    
        }
     
    })(this.kinds, 'http://127.0.0.1:3000/kinds/').catch(e => console.log(e.stack));

    this.getData('http://127.0.0.1:3000/product?category[]=Coupe&vendor[]=Audi&vendor[]=BMW&cost[]=0&cost[]=70000');
     
  },

  methods: {
      /**
       * Вспомогательный метод для получения данных из PostgreSQL и изменения таблицы приложения
       * 
       * @param {string} url адрес для получения данных с промежуточного сервера 
       */

      getData: async function(url){

        //Получение ответа с сервера
        let responseData = await axios.get(url);
        let tableContainer = document.getElementById('table-content');
        let rowsOld = document.getElementsByClassName("row-data");

        //Удаление устаревших данных из таблицы
        if (rowsOld.length > 0) {

          while(rowsOld.length > 0) {

            rowsOld[0].parentNode.removeChild(rowsOld[0]);

          }   

        } 

        //Заполнение таблицы новыми данными
        let rows = Object.values(responseData)[0];
      
        rows.forEach(row =>{

        let rowContainer = document.createElement('tr');
        rowContainer.classList.add("row-data");

        let rowValue = [];

        let modelValue =  row['model'];
        let costValue = row['cost'];
        let categoryValue = row['Category']['title'];
        let vendorValue = row['Vendor']['title'];

        rowValue.push(modelValue, categoryValue, vendorValue, costValue);

        rowValue.forEach(value =>{

          let cell = document.createElement('td');
          cell.innerText = value;
          rowContainer.appendChild(cell);

        })

        tableContainer.appendChild(rowContainer);

        })

      },

      /**
       * Метод для получения данных и отображения таблицы при отправке формы на промежуточный сервер.
       */

      onContainerCb: function(){
        
        //Формирование запроса
        let reqUrl = 'http://127.0.0.1:3000/product?', pref; 
        let containers = this.$refs.containercb;

        containers.forEach((element, index) => {

          let title = this.kinds[index].title + '[]=', items;

          if (element['checked'].length == 0) {
            
            items = this.kinds[index].opts.map(itemobj => itemobj['title']);

          }
          
          else {items = element['checked'];}
            
          pref = items.reduce((p,item) => {

              return p+title+item+'&';

          }, reqUrl)

          reqUrl = pref;

        })

        reqUrl += 'cost[]=' + this.value[0] + '&' + 'cost[]=' + this.value[1];

        //Отправка запроса
        this.getData(reqUrl);
                                
      }
    
    }

}
</script>

<style  lang="stylus">
@import url("https://ssl.gstatic.com/docs/script/css/add-ons.css");

#input-left
  float left

#input-right
  float right

#app
  display flex
  padding-top 30px

#border-green
  padding-bottom 15px
  border 2px solid green
  width 295px
  text-align center
  margin auto
  margin-bottom 25px
  
#slider-section
  margin-bottom 25px
  float left
  width auto

#select-container
  width 280px

.content
  padding 8px
  float left

.slalign
  height 15px
  vertical-align top
  width 270px

.top_bar
  text-align center
  margin-top 30px

table
  margin-left 50px
  margin-right 50px
  width 100%
  border-collapse collapse


th
  padding 5px
  width 150px
  text-align center
  border 2px solid green
  font-weight bold

td
  padding 5px
  width 150px
  text-align center
  border 1px solid green

#table-content
  border 2px solid green 
  
</style>
