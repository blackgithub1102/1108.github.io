<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Add new</h4>
        <p class="category">Add new staff information</p>
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
                <label>Staff Name</label>
                <md-input v-model="name" type="text" required></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100" v-if="check_id == true">
              <md-field>
                <label>Salary</label>
                <md-input v-model="salary" type="number" required></md-input>
              </md-field>
            </div>
            
            <div class="md-layout-item md-size-100">
              <router-link to="/staff">
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
      staffs: [],
      a: 0,
      i_phone: "",
      phone: "",
      name: "",
      salary: 500,
      check_id: false,
    }
  },
  computed: {
    isDisabled: function() {
      return this.check_id;
    }
  },
  created() {
    db.collection("staffs")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            'id': doc.id,
            'phone': doc.data().phone,
          };
          this.staffs.push(data);
        });
      });
  },
  methods: {
    savePro() {
      db.collection("staffs")
        .add({
          phone: this.i_phone,
          name: this.name,
          salary: parseInt(this.salary),
          active: "true"
        })
        .then(docRef => this.$router.push("/staff"))
        .catch(error => console.log(error));
      M.toast({ html: "A new staff added!", classes: "rounded light-green" });
    },
    checkID: function() {
      try {
        let pro = this.staffs;
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