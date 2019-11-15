<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="blue">
              <h4 class="title col s11">Payroll</h4>
                <p class="category">The last payroll created: {{staff[0].date}} </p>
          </md-card-header>
          <md-card-content>
            <b-table
              id="myTable"
              sticky-header
              hover
              bordered
              small
              :items="staff[0].items"
              :fields="fields"
              responsive
            >
            <template slot="[total]" slot-scope="aaa">
                {{aaa.item.inp_day*(aaa.item.salary/20) + aaa.item.inp_hour*(aaa.item.salary/20/8*2)}}
            </template>
            </b-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div class="md-layout">
        <router-link style="margin-left:20px" to="/staff"><md-button class="md-info">Back</md-button></router-link>
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
      fields: [
        { key: "name", label: "Staff Name", sortable: true },
        { key: "id", label: "ID#"},
        { key: "salary", label: "Coefficients Salary",sortable: true},
        { key: "inp_day", label: "No. of working days",sortable: true},
        { key: "inp_hour", label: "No. of working hours",sortable: true},
        {key:"total", label: "Salary",sortable: true},
      ]
    };
  },
  created() {
    db.collection("salary")
    .orderBy("date","desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            date: doc.data().date,
            items: doc.data().items,
          };
          this.staff.push(data);
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
