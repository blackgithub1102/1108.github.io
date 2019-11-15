<template>
  <div class="product">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
            <div class="row">
              <h4 class="title col s11">Purchase History</h4>

              <b-input
              style="margin-right:50px;margin-left:400px"
                class="col s1"
                id="myInput"
                type="search"
                placeholder="Type here to search"
                @keyup="searchBar()"
              ></b-input>
            </div>
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
            <template slot="[amount]" slot-scope="a">
              <p>{{a.item.price*a.item.quantity}}</p>
            </template>
            </b-table>
            <div>
                <md-button class="md-info" disabled>Record(s): {{ items.length }}</md-button>
                <md-button class="md-info right" disabled>Total: {{ total_price }}</md-button>
            </div>
          </md-card-content>
        </md-card>
        <router-link to="/customer"><md-button>Back</md-button></router-link>
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
      items:[],
      fields: [
        { key: "date", sortable: true },
        { key: "name", sortable: true},
        { key: "price", sortable: true },
        { key: "quantity", sortable: true},
        { key: "amount", sortable: true},
      ]
    };
  },
  created() {
    db.collection("customers").doc(this.$route.params.id).collection("history")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            price: doc.data().price,
            name: doc.data().name,
            quantity: doc.data().quantity,
            date: doc.data().date,

          };
          this.items.push(data);
        });
      });
  },
  methods: {
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
  computed:{
    total_price() {
      if (this.items.length != 0) {
        return this.items.reduce((sum, select) => {
          return sum + parseInt(select.quantity) * parseInt(select.price);
        }, 0);
      }
    },
  }
  
};
</script>

<style>
input[type="search"]::placeholder { /* Firefox, Chrome, Opera */ 
    color: white; 
} 
</style>