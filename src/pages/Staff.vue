<template>
  <div class="product">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
            <div class="row">
              <h4 class="title col s11">Staff List</h4>

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
              to="/newstaff"
              class="left btn-floating btn-small cyan lighten-3 waves-effect waves-light"
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
              :items="staff"
              :fields="fields"
              responsive
            >
              
              <template slot="[ ]" slot-scope="aaa">
                <router-link
                  v-bind:to="{ name:'Edit Staff', params: {id: aaa.item.phone}}"
                >
                  <a
                    class="btn-floating btn-small waves-effect waves-light btn-large cyan accent-3"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">Edit Information</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#0091ea">edit</md-icon>
                  </a>
                </router-link>
                
              </template>
            </b-table>
            <div>
                <md-button class="md-info" disabled>Staff(s): {{ staff.length }}</md-button>
            </div>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout">
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
        <stats-card data-background-color="blue">
          <template slot="header">
            <i><md-icon>local_atm</md-icon></i>
            <p class="category">Salary</p>    
          </template>
          <template slot="content">
            <b-row>
              <b-col><router-link to="/viewpayroll"><md-button class="md-info">Payroll <md-tooltip md-direction="top">View Payroll</md-tooltip></md-button>
              
              </router-link></b-col>
              <b-col v-if="btn2"><router-link to="/payroll"><md-button class="md-info">Create <md-tooltip md-direction="top">Create Payroll</md-tooltip></md-button>
              
              </router-link></b-col>
              <b-col v-else><md-button class="md-info">Create <md-tooltip md-direction="top">The Payroll of this month created</md-tooltip></md-button>
              
              </b-col>
            </b-row>
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
      staff: [],
      items:[],
      btn2:true,
      fields: [
        { key: "name", label: "Staff Name", sortable: true },
        { key: "id", label: "ID#"},
        { key: "phone"},
        { key: "salary", sortable: true},
        { key: "active", sortable: true},
        " ",
      ]
    };
  },
  created() {
    db.collection("staffs")
      .orderBy("salary", "asc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            phone: doc.data().phone,
            name: doc.data().name,
            active: doc.data().active,
            salary: doc.data().salary,

          };
          this.staff.push(data);
        });
      });
    db.collection("salary")
      .orderBy("date", "asc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            date: doc.data().date,
          };
          this.items.push(data);
          var m = new Date().getMonth();
          var b = new Date(this.items[0].date).getMonth();
          if (m == b) {
            this.btn2 = false;
          }
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
  
};
</script>

<style>
input[type="search"]::placeholder { /* Firefox, Chrome, Opera */ 
    color: white; 
} 
</style>