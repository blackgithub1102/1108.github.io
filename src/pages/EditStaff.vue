<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Edit</h4>
        <p class="category">Edit customer information</p>
      </md-card-header>
      <form @submit.prevent="updatePro">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>ID# (disabled)</label>
                <md-input v-model="id" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Staff Name</label>
                <md-input v-model="name" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Salary</label>
                <md-input v-model="salary" type="number" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Phone</label>
                <md-input v-model="phone" type="text" :maxlength="10" :minlength="10" disabled required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <div class="col s1">Active:</div>
                    <b-form-select class="col s3" v-model="active" :options="options" required></b-form-select>
                </md-field>
            </div>
            <div class="md-layout-item md-size-100">
              <router-link to="/staff">
                <md-button class="md-raised md-default">Back</md-button>
              </router-link>
              <md-button type="submit" class="md-raised md-warning right">Update</md-button>
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
  data() {
    return {
      id: null,
      name: null,
      salary: null,
      phone: null,
      active:null,
      options:[{ value: 'true', text: 'True' },{ value: 'false', text: 'False' }]
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("staffs")
      .where("phone", "==", to.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.id = doc.id;
            vm.name = doc.data().name;
            vm.salary = doc.data().salary;
            vm.phone = doc.data().phone;
            vm.active= doc.data().active;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      db.collection("staffs")
        .where("phone", "==", this.$route.params.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.id = doc.id;
            this.name = doc.data().name;
            this.salary = doc.data().salary;
            this.phone = doc.data().phone;
            this.active = doc.data().active;
          });
        });
    },
    updatePro() {
      if (confirm("Are you sure?")) {
        db.collection("staffs")
          .where("phone", "==", this.$route.params.id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref
                .update({
                  id: this.id,
                  name: this.name,
                  salary: this.salary,
                  phone: this.phone,
                  active: this.active
                })
                .then(() => {
                  this.$router.push("/staff");
                });
            });
          });
          db.collection("noitification")
        .add({
          time: new Date().toDateString(),
          type: "Edited staff information - ID:"+ this.id,
        })
        .then()
        .catch(error => console.log(error));
        M.toast({ html: "The staff information updated!", classes: "rounded orange" });
      }
    }
  }
};
</script>
<style></style>
