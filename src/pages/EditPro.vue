<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Edit</h4>
        <p class="category">Edit product information</p>
      </md-card-header>
      <form @submit.prevent="updatePro">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Product ID# (disabled)</label>
                <md-input v-model="product_id" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Product Name</label>
                <md-input v-model="name" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Category</label>
                <md-input v-model="category" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Supplier</label>
                <md-input v-model="supplier" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100">
              <router-link to="/products">
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
      product_id: null,
      name: null,
      category: null,
      supplier: null
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("products")
      .where("product_id", "==", to.params.product_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.product_id = doc.data().product_id;
            vm.name = doc.data().name;
            vm.category = doc.data().category;
            vm.supplier = doc.data().supplier;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      db.collection("products")
        .where("product_id", "==", this.$route.params.product_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.product_id = doc.data().product_id;
            this.name = doc.data().name;
            this.category = doc.data().category;
            this.supplier = doc.data().supplier;
          });
        });
    },
    updatePro() {
      if (confirm("Are you sure?")) {
        db.collection("products")
          .where("product_id", "==", this.$route.params.product_id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref
                .update({
                  product_id: this.product_id,
                  name: this.name,
                  category: this.category,
                  supplier: this.supplier
                })
                .then(() => {
                  this.$router.push({
                    name: "Products"
                  });
                });
            });
          });
          db.collection("noitification")
        .add({
          time: new Date().toDateString(),
          type: "Edited product information - ID:"+ this.product_id,
        })
        .then()
        .catch(error => console.log(error));
        M.toast({ html: "The product updated!", classes: "rounded orange" });
      }
    }
  }
};
</script>
<style></style>
