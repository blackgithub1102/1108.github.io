<template>
  <md-card>
    <md-card-header :data-background-color="dataBackgroundColor">
      <h4 class="title">Payroll</h4>
      <p class="category">Create a payroll</p>
    </md-card-header>
    <form @submit.prevent="save" v-if="check">
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-16">
            <label>Staff ID# (disabled)</label>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <label>Staff Name (disabled)</label>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <label>Salary (disabled)</label>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <label>No. of working days</label>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <label>No. of overtime hours</label>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <label>Totally</label>
          </div>
        </div>
        <div class="md-layout" v-for="staff in staffs" :key="staff.id">
          <div class="md-layout-item md-small-size-100 md-size-16">
            <md-field>
              <md-input v-model="staff.id" disabled></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <md-field>
              <md-input v-model="staff.name" disabled></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <md-field>
              <md-input v-model="staff.salary" type="text" disabled></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <md-field>
              <b-input
                :state="staff.inp_day>=0 && staff.inp_day<=20"
                v-model="staff.inp_day"
                type="number"
                :max="20"
                :min="0"
                required
              ></b-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <md-field>
              <b-input
                :state="staff.inp_day>=0 && staff.inp_day<=240"
                v-model="staff.inp_hour"
                type="number"
                :min="0"
                :max="240"
                required
              ></b-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-16">
            <md-field style="margin-top:15px">
              <label>{{staff.inp_day*(staff.salary/20) + staff.inp_hour*(staff.salary/20/8*2) }}</label>
            </md-field>
            <p></p>
          </div>
        </div>
      </md-card-content>
      <div class="md-layout">
        <div class="md-layout-item md-size-100">
          <md-button type="submit" class="md-raised md-default">Create a payroll</md-button>
        </div>
      </div>
    </form>
    <div class="md-layout" v-else>
        <div class="md-layout-item">
            <h3>The payroll of this month created! <router-link to="/viewpayroll">View</router-link></h3> 
        </div>
    </div>
  </md-card>
</template>

<script>
import db from "./firebaseinit";
export default {
  props: {
    dataBackgroundColor: {
      type: String,
      default: "grey"
    }
  },
  data() {
    return {
      staffs: [],
      check: true,
      items: []
    };
  },
  created() {
    db.collection("staffs")
      .orderBy("salary", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            name: doc.data().name,
            salary: doc.data().salary
          };
          this.staffs.push(data);
        });
      });
    db.collection("salary")
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            date: doc.data().date
          };

          this.items.push(data);
          var m = new Date().getMonth();
          var b = new Date(this.items[0].date).getMonth();
          if (m == b) {
            this.check = false;
          }
        });
      });
  },
  methods: {
    save() {
        db.collection("salary")
          .add({
            items: this.staffs,
            date: new Date().toDateString()
          })
          .catch(error => console.log(error));

        M.toast({ html: "Crated a payroll", classes: "rounded grey" });
        this.$router.push({
            name: "Staff"
        });
    }
  }
};
</script>