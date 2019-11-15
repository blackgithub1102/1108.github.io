<template>
  <div class="product">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <div class="row">
              <h4 class="title col s11">Products List</h4>

              <b-input
              style="margin-right:50px;margin-left:400px"
                class="col s1"
                id="myInput"
                type="search"
                placeholder="Type here to search"
                @keyup="searchBar()"
              ></b-input>
            </div>
            <router-link
              to="/newpro"
              class="left btn-floating btn-small light-green accent-4 waves-effect waves-light"
            >
              <md-tooltip md-direction="top">Add new</md-tooltip>
              <i class="fa fa-plus"></i>
            </router-link>

            <router-link
              to="/ipd"
              class="left btn-floating btn-small green accent-3 waves-effect waves-light"
            >
              <md-tooltip md-direction="top">Upload data list</md-tooltip>
              <i class="fa fa-upload"></i>
            </router-link>

            <a @click="dowloadJSON2Excel()"
              class="left btn-floating btn-small green accent-2 waves-effect waves-light"
            >
              <md-tooltip md-direction="top">Download Excel file</md-tooltip>
              <i class="fa fa-download"></i>
            </a>

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
              selected-variant="success"
              :items="products"
              :fields="fields"
              @row-selected="onRowSelected"
              responsive
            >
              <template slot="[ ]" slot-scope="aaa">
                <router-link
                  class="right"
                  v-bind:to="{ name:'Edit Product', params: {product_id: aaa.item.product_id}}"
                >
                  <a
                    class="btn-floating btn-small waves-effect waves-light btn-large green accent-3"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">Edit Information</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#b2ff59">edit</md-icon>
                  </a>
                </router-link>
              </template>
            </b-table>
            <div>
              <p>
                <md-button
                  v-b-modal.modal-center
                  v-if="selected.length !=0"
                  class="md-success"
                >Import</md-button>
                <md-button class="md-success" disabled>Selected Row(s): {{ selected.length }}/{{products.length}}</md-button>
                <md-button
                  v-if="selected.length != 0"
                  @click="clearSelected"
                  class="md-success"
                >Clear Selected</md-button>
              </p>
              <b-modal hide-footer id="modal-center" size="xl">
                  <md-card>
                    <md-card-header :data-background-color="dataBackgroundColor">
                      <h4 class="title">Import</h4>
                      <p class="category">Import goods into warehouse</p>
                    </md-card-header>
                    <form @submit.prevent="crateRecipt">
                      <md-card-content>
                        <b-table
                          sticky-header
                          hover
                          bordered
                          small
                          :items="selected"
                          :fields="fields2"
                        >
                        <template slot="[price]" slot-scope="tb2p">
                            <b-input type="number" step="any" v-model="tb2p.item.price" :min="0" required></b-input>
                        </template>
                        <template slot="[quantity]" slot-scope="tb2q">
                            <b-input type="number" v-model="tb2q.item.quantity" :min="1" required></b-input>
                        </template>
                        <template slot="[amount]" slot-scope="tb2a">
                            <div>{{tb2a.item.price * tb2a.item.quantity}}</div>
                        </template>
                        </b-table>
                      </md-card-content>
                      <div class="md-layout">
                        <div class="md-layout-item md-size-57" style="margin-left:20px">
                          <label>Date:</label>
                          <input v-model="date" v-bind="getDate()" type="text" disabled />
                        </div>
                        <div
                          class="md-layout-item md-size-20"
                        >
                          <p style="color:blue">Total Quantity:</p>
                          <md-button class="md-info" disabled>{{ total_qty }}</md-button>
                        </div>
                        <div
                          class="md-layout-item md-size-20"
                        >
                          <p style="color:blue">Total Price:</p>
                          <md-button class="md-info" disabled>{{ total_price }}</md-button>
                        </div>
                        <div class="md-layout-item md-size-100">
                          <md-button
                            type="submit"
                            class="md-raised md-info"
                          >Creating a goods import receipt</md-button>
                        </div>
                      </div>
                    </form>
                  </md-card>
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
  name: "product",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "blue"
    }
  },
  data() {
    return {
      products: [],
      selected: [],
      date: null,
      selectMode: "multi",
      fields: [
        { key: "name", label: "Product Name", sortable: true },
        { key: "product_id", label: "ID#", sortable: true },
        "category",
        "supplier",
        " "
      ],
      fields2: [
        { key: "name", label: "Product Name", sortable: true },
        { key: "product_id", label: "ID#", sortable: true },
        "price",
        "quantity",
        "amount"
      ]
    };
  },
  created() {
    db.collection("products")
      .orderBy("category")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            product_id: doc.data().product_id,
            name: doc.data().name,
            category: doc.data().category,
            supplier: doc.data().supplier
          };
          this.products.push(data);
        });
      });
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

    onRowSelected(items) {
      this.selected = items;
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
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
    crateRecipt() {
      db.collection("good_recipt")
        .add({
          date: this.date,
          items: this.selected,
          total_qty: this.total_qty,
          total_price: this.total_price
        })
        .then(docRef =>
          this.$router.push({
            name: "   ",
            params: { date: this.date }
          })
        )
        .catch(error => console.log(error));
        db.collection("noitification")
        .add({
          time: new Date().toDateString(),
          type: "Created a import receipt",
        })
        .then()
        .catch(error => console.log(error));
      M.toast({
        html: "Created a  goods import receipt!",
        classes: "rounded blue"
      });
    },
    dowloadJSON2Excel(){
       var createXLSLFormatObj = [];
 
        /* XLS Head Columns */
        var xlsHeader = ["#","Product ID", "Name","Category","Supplier"];
        createXLSLFormatObj.push(xlsHeader);
        $.each(this.products, function(index, value) {
            var innerRowData = [];
            
            $.each(value, function(ind, val) {
 
                innerRowData.push(val);
            });
            createXLSLFormatObj.push(innerRowData);
        });
 
 
        /* File Name */
        var filename = "JSON_To_XLS.xlsx";
 
        /* Sheet Name */
        var ws_name = "Data";
 
        if (typeof console !== 'undefined') console.log(new Date());
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
 
        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
 
        /* Write workbook and Download */
        if (typeof console !== 'undefined') console.log(new Date());
        XLSX.writeFile(wb, filename);
        if (typeof console !== 'undefined') console.log(new Date());
    }
  },
  computed: {
    rows() {
      return this.products.length;
    },
    total_qty() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + parseInt(select.quantity);
        }, 0);
      }
    },
    abstotal_qty() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + Math.abs(parseInt(select.quantity));
        }, 0);
      }
    },
    total_price() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + parseInt(select.quantity) * parseInt(select.price);
        }, 0);
      }
    },
    abstotal_price() {
      if (this.selected.length != 0) {
        return this.selected.reduce((sum, select) => {
          return sum + Math.abs(parseInt(select.quantity)) * Math.abs(parseInt(select.price));
        }, 0);
      }
    }
  }
};
</script>

<style>
input[type="search"]::placeholder { /* Firefox, Chrome, Opera */ 
    color: lightgreen; 
} 
</style>