<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Export Recipt</h4>
      </md-card-header>
      <form>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item  md-size-25">
              <md-field>
                <label>Export ID#</label>
                <md-input v-model="id" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item  md-size-50"></div>
            <div class="md-layout-item  md-size-25">
              <md-field>
                <label>Date</label>
                <md-input v-model="date" type="text" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item  md-size-100">
              <b-table style="padding-bottom:20px"
                hover
                bordered
                small
                :items="items"
                :fields="fields1"
              >
              <template slot="[amount]" slot-scope="tb2a">
                  <div>{{tb2a.item.input_price * tb2a.item.input_qty}}</div>
              </template>
              </b-table>
            </div>
            <div class="md-layout-item  md-size-70"></div>
            <div class="md-layout-item  md-size-15">
              <label>Total Quantity</label>
              <p>{{total_qty}}</p>
            </div>
            <div class="md-layout-item  md-size-15">
              <label>Total Price</label>
              <p>{{total_price}}</p>
            </div>
            <div class="md-layout-item  md-size-100" style="padding-bottom:100px"></div>
            <div class="md-layout-item  md-size-25">
              <label>Signature of Creator receipt</label>
              <b-input disabled></b-input>
            </div>
            <div class="md-layout-item  md-size-25">
              <label>Signature of Stocker</label>
              <b-input disabled></b-input>
            </div>
            <div class="md-layout-item  md-size-25">
              <label>Signature of Receiver</label>
              <b-input disabled></b-input>
            </div>
            <div class="md-layout-item  md-size-25">
              <label>Signature of Manager</label>
              <b-input disabled></b-input>
            </div>
            <div class="md-layout-item  md-size-100" style="padding-bottom:50px"></div>
            <div class="md-layout-item md-size-75">
              <router-link to="/warehouse"><md-button class="md-raised md-warning">Move to Warehouse</md-button></router-link>
              <md-button class="md-raised md-warning" type="button" onclick="window.print()">Print to paper</md-button>
            </div>
          </div>
        </md-card-content>
      </form>
    </md-card>
  </form>
</template>

<script>
import db from "./firebaseinit";
export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "orange"
    }
  },
  data(){
    return{
      items:[],
      total_price: null,
      total_qty: null,
      date:null,
      fields1: [
        { key: "name", label: "Product Name" },
        { key: "i_id", label: "Import ID#" },   
        { key: "input_price", label: "Price"},    
        { key: "input_qty", label: "Quantity" },
        {key: "amount"}
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("good_issue")
      .where("date", "==", to.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.id = doc.id;
            vm.date = doc.data().date;
            vm.total_price = doc.data().total_price;
            vm.total_qty = doc.data().total_qty;
            vm.items = doc.data().items;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods:{
    fetchData() {
      db.collection("good_issue")
        .where("date", "==", to.params.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.id = doc.id;
            this.date = doc.data().date;
            this.items = doc.data().items;
            this.total_qty = doc.data().total_qty;
            this.total_price = doc.data().total_price;
          });
        });
    },
    getDate(){
      var day= new Date().getDate();
      var MM= new Date().getMonth()+1;
      var y= new Date().getFullYear();
      var h= new Date().getHours();
      var m= new Date().getMinutes();
      var s= new Date().getSeconds();
      this.date= ""+y+"/"+MM+"/"+day+" "+h+":"+m+":"+s;
    },
    
  }  
}

</script>
