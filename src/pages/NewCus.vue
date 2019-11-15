<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Add new</h4>
        <p class="area">Add new customer information</p>
      </md-card-header>
      <form @submit.prevent="savePro">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Phone</label>
                <md-input v-model="i_phone" required :maxlength="10" :disabled="isDisabled"></md-input>
                <i
                  class="chip btn right waves-effect waves-light"
                  @click="checkID()"
                  v-if="i_phone != '' & i_phone.length==10"
                  :disabled="isDisabled"
                >Check</i>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100" v-if="check_id == true">
              <md-field>
                <label>Customer Name</label>
                <md-input v-model="name" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100" v-if="check_id == true">
              <md-field>
                <label>Area</label>
                <md-input v-model="area" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100" v-if="check_id == true">
              <md-field>
                <label>Citizen Identification</label>
                <md-input v-model="ci" type="text" :maxlength="10" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100">
              <router-link to="/customer">
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
      customers: [],
      a: 0,
      i_phone: "",
      phone: "",
      name: "",
      area: "",
      ci: "",
      check_id: false,
    }
  },
  computed: {
    isDisabled: function() {
      return this.check_id;
    }
  },
  created() {
    db.collection("customers")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            'id': doc.id,
            'phone': doc.data().phone,
            'name': doc.data().name,
            'area': doc.data().area,
            'ci': doc.data().ci
          };
          this.customers.push(data);
        });
      });
  },
  methods: {
    savePro() {
      db.collection("customers").doc(this.i_phone)
        .set({
          phone: this.i_phone,
          name: this.name,
          area: this.area,
          ci: this.ci
        })
        .then(docRef => this.$router.push("/customer"))
        .catch(error => console.log(error));
        db.collection("noitification")
        .add({
          time: new Date().toDateString(),
          type: "Created a new customer - ID:"+ this.i_phone,
        })
        .then()
        .catch(error => console.log(error));
      M.toast({ html: "A new customer added!", classes: "rounded light-green" });
    },
    checkID: function() {
      try {
        let pro = this.customers;
        for (var i = 0; i <= pro.length; i++) {
          if (pro[i].phone === this.i_phone) {
            this.a = i;
            alert(pro[i].phone + " have been exist");
            break;
          } else {
            this.a = i+1;
          };
            if (this.a == pro.length) {
            this.check_id = true;
            alert(this.i_phone + " valid");
        }
        };
      } catch (error) {}
    }
  }
};
</script>