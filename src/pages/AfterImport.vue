<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Import Recipt</h4>
      </md-card-header>
      <form @submit.prevent="crateRecipt" method="post" action="#" id="printJS-form">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item  md-size-30">
              <md-field>
                <label>ID# (disabled)</label>
                <md-input v-model="id" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item  md-size-50">
            </div>
            <div class="md-layout-item  md-size-20">
              <md-field>
                <md-input v-model="date" type="text" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item  md-size-100">
              <label>Detail</label>
              <b-table
              hover
              bordered
              large
              :items="items"
              :fields="fields"
            >
            <template slot="[amount]" slot-scope="aaa">
              <p>{{aaa.item.price*aaa.item.quantity}}</p>
            </template>
            </b-table>
            </div>
            <div class="md-layout-item  md-size-60"></div>
            <div class="md-layout-item  md-size-20">
              <label>Total Quantity</label>
              <p>{{total_qty}}</p>
              </div>
            <div class="md-layout-item  md-size-20">
              <label>Total Price</label>
              <p>{{total_price}}$</p></div>
            <div class="md-layout-item  md-size-100" style="padding-bottom:50px"></div>
            <div class="md-layout-item  md-size-25">
              <label>Signature of Creator receipt</label>
              <b-input disabled></b-input>
            </div>           
            <div class="md-layout-item  md-size-25">
              <label>Signature of Shipper</label>
              <b-input disabled></b-input>
            </div>
            <div class="md-layout-item  md-size-25">
              <label>Signature of Stocker</label>
              <b-input disabled></b-input>
            </div>
            <div class="md-layout-item  md-size-25">
              <label>Signature of Manager</label>
              <b-input disabled></b-input>
            </div>
            <div class="md-layout-item md-size-100" style="padding:50px"></div>
            <div class="md-layout-item">
              <md-button type="submit" class="md-raised md-primary">Move to Warehouse</md-button>
              <md-button onclick="window.print()" class="md-primary">Print to paper</md-button>
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
      default: "purple"
    }
  },
  data() {
    return {
      id: null,
      total_price: null,
      total_qty: null,
      items: [],
      date: null,
      fields: [
        { key: "name", label: "Product Name", sortable: true },
        { key: "product_id", label: "ID#", sortable: true },
        "price",
        "quantity",
        "amount"
      ]
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("good_recipt")
      .where("date", "==", to.params.date)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.id = doc.id;
            vm.total_price = doc.data().total_price;
            vm.total_qty = doc.data().total_qty;
            vm.items = doc.data().items;
            vm.date = doc.data().date;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      db.collection("good_recipt")
        .where("date", "==", this.$route.params.date)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.id = doc.id;
            this.total_price = doc.data().total_price;
            this.total_qty = doc.data().total_qty;
            this.items = doc.data().items;
          });
        });
    },
    crateRecipt() {
      for (let i = 0; i < this.items.length; i++) {
        db.collection("warehouse")
        .add({
          i_id: this.id + "/" + i,
          p_id: this.items[i].product_id,
          name: this.items[i].name,
          price: parseInt(this.items[i].price),
          quantity: parseInt(this.items[i].quantity),
          date: this.date
        })
        .catch(error => console.log(error));
      }
      this.$router.push("/warehouse");
      M.toast({ html: "Moving to Warehouse!", classes: "rounded purple" });
    },
  }
};

</script>