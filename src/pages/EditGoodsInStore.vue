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
                <label>Name (disabled)</label>
                <md-input v-model="name" type="text" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Price</label>
                <md-input v-model="price" type="number" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100">
              <router-link to="/store">
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
      price: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("store")
      .where("id", "==", to.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.id = doc.data().id;
            vm.name = doc.data().name;
            vm.price = doc.data().price;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      db.collection("store")
        .where("id", "==", this.$route.params.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.id = doc.data().id;
            this.name = doc.data().name;
            this.price = doc.data().price;
          });
        });
    },
    updatePro() {
      if (confirm("Are you sure?")) {
        db.collection("store")
          .where("id", "==", this.$route.params.id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref
                .update({
                  id: this.id,
                  name: this.name,
                  price: parseInt(this.price),
                })
                .then(() => {
                  this.$router.push("/store");
                });
            });
          });
        M.toast({ html: "The price updated!", classes: "rounded orange" });
      }
    }
  }
};
</script>
<style></style>
