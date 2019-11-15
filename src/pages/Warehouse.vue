<template>
  <div class="product">
    <div class="md-layout" id="111">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="purple">
            <div class="row">
              <h4 class="title col s11">Warehouse</h4>

              <b-input
              style="margin-right:50px;margin-left:400px"
                class="col s1"
                id="myInput"
                type="search"
                placeholder="Type here to search"
                @keyup="searchBar()"
              ></b-input>
            </div>
          </md-card-header>
          <md-card-content>
            <b-table 
              id="myTable"
              ref="selectableTable"
              sticky-header
              hover
              bordered
              small
              selectable
              :select-mode="selectMode"
              selected-variant="primary"
              :items="warehouse"
              :fields="fields"
              @row-selected="onRowSelected"
              responsive
            >
              <template slot="[ ]" slot-scope="aaa">
                <div class="chip orange" v-if="aaa.item.quantity>0 & aaa.item.quantity<=5">RUNNING OUT</div>
                <router-link v-if="aaa.item.quantity>0 & aaa.item.quantity<=5"
                  to="/products"
                >
                  <a
                    class="btn-floating btn-small waves-effect waves-light btn-large orange accent-3 pulse"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">Import goods</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#ffd740">save_alt</md-icon>
                  </a>
                </router-link>

                <div class="chip red" v-if="aaa.item.quantity==0">OUT OF STOCK</div>
                <button v-if="aaa.item.quantity==0" @click="delPro(aaa.item.i_id)"
                    class="btn-floating btn-small waves-effect waves-light btn-large red accent-3 pulse"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">X</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#ffd740">remove</md-icon>
                </button>

              </template>
            </b-table>
            <div>
              <p>
                <md-button
                  v-b-modal.modal-multi-1
                  v-if="selected.length !=0"
                  class="md-primary"
                >Export</md-button>
                <md-button class="md-primary" disabled>Selected Row(s): {{ selected.length }}/{{warehouse.length}}</md-button>
                <md-button
                  v-if="selected.length != 0"
                  @click="clearSelected"
                  class="md-primary"
                >Clear Selected</md-button>
              </p>
              <b-modal hide-footer id="modal-multi-1" size="xl">
                <form>
                  <md-card>
                    <md-card-header :data-background-color="dataBackgroundColor">
                      <h4 class="title">Export</h4>
                      <p class="category">Export goods from warehouse</p>
                    </md-card-header>
                    <form @submit.prevent="exportGoods">
                      <md-card-content>
            
                          <b-table
                          hover
                          bordered
                          small
                          :items="selected"
                          :fields="fields1"
                        >
                        <template slot="[input_price]" slot-scope="tb2p">
                            <b-input :state="tb2p.item.input_price>=0" type="number" v-model="tb2p.item.input_price" :min="0" required></b-input>
                        </template>
                        <template slot="[input_qty]" slot-scope="tb2q">
                            <b-input :state="tb2q.item.input_qty>0 && tb2q.item.input_qty<=tb2q.item.quantity" type="number" v-model="tb2q.item.input_qty" :max="tb2q.item.quantity" :min="1" required></b-input>
                        </template>
                        <template slot="[amount]" slot-scope="tb2a">
                            <div>{{tb2a.item.input_price * tb2a.item.input_qty}}</div>
                        </template>
                        </b-table>
                      </md-card-content>
                      <div class="md-layout">
                        <div class="md-layout-item md-size-20" style="margin-left:20px">
                          <label>Date:</label>
                          <input v-model="date" v-bind="getDate()" type="text" disabled />
                        </div>
                        <div class="md-layout-item md-size-20" style="margin-right:50px">
                          <label>Customer:</label>
                          <b-input v-model="selectedType" type="text" disabled></b-input>             
                          <md-button class="md-warning" v-b-modal.modal-multi-2>Change</md-button>
                        </div>
                        <div
                          class="md-layout-item md-size-20"
                        >
                          <p style="color:orange">Total Quantity:</p>
                          <md-button class="md-warning" disabled>{{ total_qty }}</md-button>
                        </div>
                        <div
                          class="md-layout-item md-size-20"
                        >
                          <p style="color:orange">Total Price:</p>
                          <md-button class="md-warning" disabled>{{ total_price }}</md-button>
                        </div>
                        <div class="md-layout-item md-size-100" style="padding-bottom:50px"></div>
                        <div class="md-layout-item md-size-100">
                          <md-button
                            type="submit"
                            class="md-raised md-warning"
                          >Creating a goods export receipt</md-button>
                        </div>
                      </div>
                    </form>
                  </md-card>
                </form>
              </b-modal>
              <b-modal id="modal-multi-2" title="Choose Type" hide-footer>
                <b-table hover :items="type" :fields="fields2">
                  <template slot="[ ]" slot-scope="a">
                    <b-button @click="selectType(a.item.phone)">Choose</b-button>
                  </template>
                </b-table>
              </b-modal>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import db from "./firebaseinit";
export default {
  name: "Warehouse",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "orange"
    }
  },
  data() {
    return {
      warehouse: [],
      goods:[],
      selectedType:"Unknown",
      type:[],
      selected: [],
      date: null,
      selectMode: "multi",
      store:{name:"Store", phone:"Store", area:"null"},
      unknown:{name:"Unknown", phone:"Unknown", area:"null"},
      fields: [
        { key: "name", label: "Product Name", sortable: true },
        { key: "i_id", label: "Import ID#", sortable: true },       
        { key: "quantity", label: "Quantity", sortable: true },
        { key: "price", label: "Price", sortable: true },
        {key: "date", sortable: true},
        " "
      ],
      fields1: [
        { key: "name", label: "Product Name" },
        { key: "i_id", label: "Import ID#" },   
        { key: "input_price", label: "Input Price"},    
        { key: "input_qty", label: "Input Quantity" },
        {key: "amount"}
      ],
      fields2:["name","phone","area"," "]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    getDate() {
      var day = new Date().getDate();
      var MM = new Date().getMonth() + 1;
      var y = new Date().getFullYear();
      var h = new Date().getHours();
      var m = new Date().getMinutes();
      var s = new Date().getSeconds();
      this.date = "" + y + "/" + MM + "/" + day + " " + h + ":" + m + ":" + s;
    },
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
    delPro(id) {
      db.collection("warehouse")
        .where("i_id", "==", id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        });
      for (let i = 0; i < this.warehouse.length; i++) {
        if (this.warehouse[i].i_id == id) {
          this.warehouse.splice(i,1);
        }
      }
      M.toast({ html: "OUT OF STOCK", classes: "rounded red" });
    },
    onRowSelected(items) {
      this.selected = items;
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    exportGoods() {
      db.collection("good_issue")
        .add({
          items: this.selected,
          total_qty: this.total_qty,
          total_price: this.total_price,
          type: this.selectedType,
          date: this.date
        })
        .catch(error => console.log(error));

        for (let i = 0; i < this.selected.length; i++) {
          db.collection("warehouse")
          .where("i_id", "==", this.selected[i].i_id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref
                .update({
                  quantity: this.selected[i].quantity - this.selected[i].input_qty,
                })
            });
          });
          if ((this.selected[i].quantity - this.selected[i].input_qty)<20) {
            Email.send({
                SecureToken : "d7e52145-d0ee-4f1f-8a71-cbe124e9defc",
                To : 'maxanstore@gmail.com',
                From : "maxanstore@gmail.com",
                Subject : "PRODUCT RUNNING OUT",
                Body : "Product name:["+ this.selected[i].name + "] - IID:["+ this.selected[i].i_id + "] left:" + (this.selected[i].quantity - this.selected[i].input_qty)
            }).then(

            );
          }
        }
      if (this.selectedType=="Store") {
        if (this.goods.length==0) {
          for (let i = 0; i < this.selected.length; i++) {
             db.collection("store")
              .add({
                name: this.selected[i].name,
                id: this.selected[i].p_id,
                price: parseInt(this.selected[i].price)*2,
                quantity: parseInt(this.selected[i].input_qty)
              })
              .catch(error => console.log(error));
          }
        }else{
          for (let i = 0; i < this.selected.length; i++) {
            for (let j = 0; j < this.goods.length; j++) {
              if (this.selected[i].p_id == this.goods[j].id) {
                db.collection("store")
                .where("id", "==", this.goods[j].id)
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                    doc.ref
                      .update({
                        quantity: this.goods[j].quantity + parseInt(this.selected[i].input_qty),
                        price: parseInt(this.selected[i].price*2)
                      });
                  });
                });
              } 
            }
          }
        }
      };
      if (this.selectedType!="Store" && this.selectedType!="Unknown") {
        for (let i = 0; i < this.selected.length; i++) {
          db.collection("customers").doc(this.selectedType).collection("history").add({
            date: this.date,
            name: this.selected[i].name,
            id: this.selected[i].p_id,
            price: parseInt(this.selected[i].price)*2,
            quantity: parseInt(this.selected[i].input_qty)
          });
        }
      }
      db.collection("noitification")
        .add({
          time: new Date().toDateString(),
          type: "Created a export receipt",
        })
        .then()
        .catch(error => console.log(error));
      this.$bvModal.hide('modal-multi-1');
      M.toast({ html: "Exported Goods", classes: "rounded orange" });
       this.$router.push({
            name: "Export Goods",
            params: { id: this.date }
        });
      
    },
    fetchData() {
      db.collection("warehouse")
      .orderBy("date","desc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
            id: doc.id,
            p_id: doc.data().p_id,
            name: doc.data().name,
            price: doc.data().price,
            quantity: doc.data().quantity,
            i_id: doc.data().i_id,
            date: doc.data().date
          };
          this.warehouse.push(data);
          });
        });
      this.type.push(this.store);
      this.type.push(this.unknown);
      db.collection("customers")
      .orderBy("name","asc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
            id: doc.id,
            name: doc.data().name,
            phone: doc.data().phone,
            area: doc.data().area,
          };
          this.type.push(data);
          });
        });
      db.collection("store")
      .orderBy("name","asc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
            quantity: doc.data().quantity,
            id: doc.data().id,
          };
          this.goods.push(data);
          });
        });
    },
    selectType(item){
      this.selectedType = item;
      this.$bvModal.hide('modal-multi-2');
    }
  },
  computed:{
    rows() {
      return this.warehouse.length;
    },
    total_qty() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + parseInt(select.input_qty);
        }, 0);
      }
    },
    abstotal_qty() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + Math.abs(parseInt(select.input_qty));
        }, 0);
      }
    },
    total_price() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + parseInt(select.input_qty) * parseInt(select.input_price);
        }, 0);
      }
    },
    abstotal_price() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + Math.abs(parseInt(select.input_qty)) * Math.abs(parseInt(select.input_price));
        }, 0);
      }
    },
  }
};
</script>
