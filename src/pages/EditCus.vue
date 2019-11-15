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
                <label>Customer Name</label>
                <md-input v-model="name" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Area</label>
                <md-input v-model="area" type="text" required></md-input>
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
                <label>CI</label>
                <md-input v-model="ci" type="text" :maxlength="10" :minlength="10" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100">
              <router-link to="/customer">
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
      area: null,
      phone: null,
      ci:null
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("customers")
      .where("phone", "==", to.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.id = doc.id;
            vm.name = doc.data().name;
            vm.area = doc.data().area;
            vm.phone = doc.data().phone;
            vm.ci= doc.data().ci;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      db.collection("customers")
        .where("phone", "==", this.$route.params.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.id = doc.id;
            this.name = doc.data().name;
            this.area = doc.data().area;
            this.phone = doc.data().phone;
            this.ci = doc.data().ci;
          });
        });
    },
    updatePro() {
      if (confirm("Are you sure?")) {
        db.collection("customers")
          .where("phone", "==", this.$route.params.id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref
                .update({
                  id: this.id,
                  name: this.name,
                  area: this.area,
                  phone: this.phone,
                  ci: this.ci
                })
                .then(() => {
                  this.$router.push("/customer");
                });
            });
          });
          db.collection("noitification")
        .add({
          time: new Date().toDateString(),
          type: "Edited customer information - ID:" + this.id,
        })
        .then()
        .catch(error => console.log(error));
        M.toast({ html: "The customer information updated!", classes: "rounded orange" });
      }
    }
  }
};
</script>
<style></style>
