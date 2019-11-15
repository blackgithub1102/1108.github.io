<template>
  <div class="product">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
            <div class="row">
              <h4 class="title col s11">Goods in Store</h4>

              <b-input
              style="margin-right:50px;margin-left:400px"
                class="col s1"
                id="myInput"
                type="search"
                placeholder="Type here to search"
                @keyup="searchBar()"
              ></b-input>
            </div>
            <router-link
              to="/warehouse"
              class="left btn-floating btn-small cyan lighten-3 waves-effect waves-light"
            >
              <md-tooltip md-direction="right">Import goods in store</md-tooltip>
              <i class="fa fa-plus"></i>
            </router-link>
          </md-card-header>
          <md-card-content>
            <b-table
              id="myTable"
              sticky-header
              hover
              bordered
              small
              :items="items"
              :fields="fields"
              responsive
            >
              <template slot="[quantity]" slot-scope="aa">
                <a v-if="aa.item.quantity == 0" class="btn-floating btn-small red pulse"><i class="material-icons">exposure_zero</i><md-tooltip md-direction="right">Out of stock</md-tooltip></a>
              </template>
              <template slot="[ ]" slot-scope="aaa">
                <router-link
                  v-bind:to="{ name:'Edit Good in Store', params: {id: aaa.item.id}}"
                >
                  <a
                    class="btn-floating btn-small waves-effect waves-light btn-large cyan accent-3"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">Edit Information</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#0091ea">edit</md-icon>
                  </a>
                </router-link>
                
                <a v-if="aaa.item.quantity <= 20 & aaa.item.quantity >0" class="btn-floating btn-small orange pulse"><i class="material-icons">expand_more</i><md-tooltip md-direction="right">Running out</md-tooltip></a>
                <a v-if="aaa.item.price == 0" class="btn-floating btn-small pink pulse"><i class="material-icons">local_atm</i><md-tooltip md-direction="right">Price is Zero</md-tooltip></a>
              </template>
            </b-table>
            <div>
                <md-button class="md-info" disabled>Item(s): {{ items.length }}</md-button>
            </div>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout">
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
        <stats-card data-background-color="blue">
          <template slot="header">
            <i><md-icon>local_atm</md-icon></i>
            <p class="category">Discount</p>    
          </template>
          <template slot="content">
            <b-row>
              <b-col><md-button  class="md-info">Create<md-tooltip md-direction="top">Create a new discount</md-tooltip></md-button></b-col>
              <b-col><md-button  class="md-info">View<md-tooltip md-direction="top">View all discount</md-tooltip></md-button></b-col>
            </b-row>
          </template>
          <template slot="footer">
            <div class="stats">
            
            </div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
        <stats-card data-background-color="blue">
          <template slot="header">
            <i><md-icon>local_atm</md-icon></i>
            <p class="category">Revenue</p>    
          </template>
          <template slot="content">
            <b-row>
              <b-col><md-button @click="viewRevenueY" class="md-info">Year <md-tooltip md-direction="top">Revenue of this year</md-tooltip></md-button></b-col>
              <b-col><md-button @click="viewRevenueM" class="md-info">Month <md-tooltip md-direction="top">Revenue of this month</md-tooltip></md-button></b-col>
              <b-col><md-button @click="viewRevenueD" class="md-info">Day <md-tooltip md-direction="top">Revenue of this day</md-tooltip></md-button></b-col>
            </b-row>
          </template>
          <template slot="footer">
            <div class="stats" v-if="view2">
              <p>View by: {{vby2}}</p>
              <p>Total receipt: {{r_receipt2}}</p>
              <p>Total quantity: {{r_qty2}}</p>
              <p>Total price: {{r_price2}} $</p>
            </div>
          </template>
        </stats-card>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import db from "./firebaseinit";
import { NavTabsCard, NavTabsTable, StatsCard } from "@/components";
export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    StatsCard
  },
  data() {
    return {
      r_receipt2:0,
      r_qty2:0,
      r_price2:0,
      view2:false,
      vby2:null,
      items:[],
      items2:[],
      fields: [
        { key: "name", label: "Product Name", sortable: true },
        { key: "id", label: "ID#"},
        { key: "price",sortable: true},
        { key: "quantity", sortable: true},
        " ",
      ]
    };
  },
  created() {
    db.collection("store")
      .orderBy("name", "asc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.data().id,
            name: doc.data().name,
            price: doc.data().price,
            quantity: doc.data().quantity,

          };
          this.items.push(data);
        });
      });
    db.collection("sale")
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            customer: doc.data().customer,
            total_price: doc.data().total_price,
            total_qty: doc.data().total_qty,
            items: doc.data().items,
            date: doc.data().date,
          };
          this.items2.push(data);
        });
      });  
  },
  methods: {
    viewRevenueY(){
      this.vby2="Year";
      this.r_receipt2 =0;
      this.r_qty2=0;
      this.r_price2=0;
      this.view2 = true;
      var toDay = new Date();
      var year = toDay.getFullYear();
      for (let i = 0; i < this.items2.length; i++) {
        if (year == new Date(this.items2[i].date).getFullYear()) {
          this.r_receipt2 ++;
          this.r_qty2 += this.items2[i].total_qty;
          this.r_price2 += this.items2[i].total_price;
        } 
      }
    },
    viewRevenueM(){
      this.vby2="Month";
      this.r_receipt2 =0;
      this.r_qty2=0;
      this.r_price2=0;
      this.view2 = true;
      var toDay = new Date();
      var year = new Date(toDay.getFullYear(),toDay.getMonth()).toDateString();
      for (let i = 0; i < this.items2.length; i++) {
        var b = new Date(this.items2[i].date);
        if (year == new Date(b.getFullYear(),b.getMonth()).toDateString()) {
          this.r_receipt2 ++;
          this.r_qty2 += this.items2[i].total_qty;
          this.r_price2 += this.items2[i].total_price;
        } 
      }
    },
    viewRevenueD(){
      this.vby2="Day";
      this.r_receipt2 =0;
      this.r_qty2=0;
      this.r_price2=0;
      this.view2 = true;
      var toDay = new Date();
      var year = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()).toDateString();
      for (let i = 0; i < this.items2.length; i++) {
        var b = new Date(this.items2[i].date);
        if (year == new Date(b.getFullYear(),b.getMonth(),b.getDate()).toDateString()) {
          this.r_receipt2 ++;
          this.r_qty2 += this.items2[i].total_qty;
          this.r_price2 += this.items2[i].total_price;
        } 
      }
    },
    searchBar() {
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");

      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    },
  },
  
};
</script>

<style>
input[type="search"]::placeholder { /* Firefox, Chrome, Opera */ 
    color: white; 
} 
</style>