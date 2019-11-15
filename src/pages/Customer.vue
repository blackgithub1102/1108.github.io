<template>
  <div class="product">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="purple">
            <div class="row">
              <h4 class="title col s11">Customer List</h4>

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
              to="/newcus"
              class="left btn-floating btn-small purple accent-1 waves-effect waves-light"
            >
              <md-tooltip md-direction="right">Add new</md-tooltip>
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
              :items="customer"
              :fields="fields"
              responsive
            >
              
              <template slot="[ ]" slot-scope="aaa">
                <router-link
                  v-bind:to="{ name:'Edit Customer', params: {id: aaa.item.phone}}"
                >
                  <a
                    class="btn-floating btn-small waves-effect waves-light btn-large purple accent-3"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">Edit Information</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#4a148c">edit</md-icon>
                  </a>
                </router-link>

                <router-link
                  v-bind:to="{ name:'View Details', params: {id: aaa.item.id}}"
                >
                  <a
                    class="btn-floating btn-small waves-effect waves-light btn-large pink accent-3"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">Detail</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#880e4f">visibility</md-icon>
                  </a>
                </router-link>

              </template>
            </b-table>
            <div>
                <md-button class="md-primary" disabled>Customer(s): {{ customer.length }}</md-button>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import db from "./firebaseinit";
export default {
  data() {
    return {
      customer: [],
      fields: [
        { key: "id", label: "Phone (ID)#", sortable: true },
        { key: "name", label: "Customer Name", sortable: true },
        { key: "area", sortable: true },
        { key: "ci", label: "Citizen Identification"},
        " ",
      ]
    };
  },
  created() {
    db.collection("customers")
      .orderBy("area", "asc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            ci: doc.data().ci,
            name: doc.data().name,
            area: doc.data().area,
            phone: doc.data().phone,

          };
          this.customer.push(data);
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
  computed: {
    rows() {
      return this.products.length;
    }
  }
};
</script>

<style>
input[type="search"]::placeholder { /* Firefox, Chrome, Opera */ 
    color: lightgreen; 
} 
</style>