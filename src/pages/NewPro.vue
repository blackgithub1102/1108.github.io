<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Add new</h4>
        <p class="category">Add new product information</p>
      </md-card-header>
      <form @submit.prevent="savePro">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Product ID#</label>
                <md-input v-model="input_id" :maxlength="10" required :disabled="isDisabled"></md-input>
                <i
                  class="chip btn right waves-effect waves-light"
                  @click="checkID()"
                  v-if="input_id != ''"
                  :disabled="isDisabled"
                >Check ID</i>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100" v-if="check_id == true">
              <md-field>
                <label>Product Name</label>
                <md-input v-model="name" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100" v-if="check_id == true">
              <md-field>
                <label>Category</label>
                <md-input v-model="category" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100" v-if="check_id == true">
              <md-field>
                <label>Supplier</label>
                <md-input v-model="supplier" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100">
              <router-link to="/products">
                <md-button class="md-raised md-default">Back</md-button>
              </router-link>
              <md-button
                type="submit"
                class="md-raised md-success right"
                v-if="check_id == true"
              >Create</md-button>
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
  name: "AddNew",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "green"
    }
  },
  data() {
    return {
      products: [],
      a: 0,
      input_id: "",
      product_id: "",
      name: "",
      category: "",
      supplier: "",
      check_id: false,
      date: new Date().toDateString(),
    }
  },
  computed: {
    isDisabled: function() {
      return this.check_id;
    }
  },
  created() {
    db.collection("products")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            'id': doc.id,
            'product_id': doc.data().product_id,
            'name': doc.data().name,
            'category': doc.data().category,
            'supplier': doc.data().supplier
          };
          this.products.push(data);
        });
      });
  },
  methods: {
    savePro() {
      db.collection("products")
        .add({
          product_id: this.input_id,
          name: this.name,
          category: this.category,
          supplier: this.supplier
        })
        .then(docRef => this.$router.push("/products"))
        .catch(error => console.log(error));
      
      db.collection("store")
        .add({
          id: this.input_id,
          name: this.name,
          price: 0,
          quantity: 0
        })
        .then(docRef => this.$router.push("/products"))
        .catch(error => console.log(error));

      db.collection("noitification")
      .add({
        time: new Date().toDateString(),
        type: "Created a new product - ID:"+ this.input_id,
      })
      .then()
      .catch(error => console.log(error));

      M.toast({ html: "A new product added!", classes: "rounded light-green" });
    },
    checkID: function() {
      try {
        let pro = this.products;
        for (var i = 0; i <= pro.length; i++) {
          if (pro[i].product_id === this.input_id) {
            this.a = i;
            alert(pro[i].product_id + " have been exist");
            break;
          } else {
            this.a = i+1;
          };
            if (this.a == pro.length) {
            this.check_id = true;
            alert(this.input_id + " valid");
        }
        };
      } catch (error) {}
    },
  }
};
</script>