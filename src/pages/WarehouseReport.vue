<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <nav-tabs-card>
          <template slot="content">
            <span class="md-nav-tabs-title">Report:</span>
            <md-tabs class="md-primary" md-alignment="left">
              <md-tab id="tab-home" md-label="Import" md-icon="save_alt">
                <b-container fluid>
                  <b-row>
                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Sort"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="sortBySelect"
                        class="mb-0"
                      >
                        <b-input-group size="sm">
                          <b-form-select
                            v-model="sortBy"
                            id="sortBySelect"
                            :options="sortOptions"
                            class="w-75"
                          >
                            <template v-slot:first>
                              <option value>-- none --</option>
                            </template>
                          </b-form-select>
                          <b-form-select
                            v-model="sortDesc"
                            size="sm"
                            :disabled="!sortBy"
                            class="w-25"
                          >
                            <option :value="false">Asc</option>
                            <option :value="true">Desc</option>
                          </b-form-select>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col lg="8"></b-col>
                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Filter"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="filterInput"
                        class="mb-0"
                      >
                        <b-input-group size="sm">
                          <b-form-input
                            class="col s3"
                            v-model="filter"
                            type="search"
                            id="filterInput"
                            placeholder="Type to Search"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col lg="4"></b-col>
                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Per page"
                        label-cols-sm="6"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="perPageSelect"
                        class="mb-0"
                      >
                        <b-form-select
                          class="col s6"
                          v-model="perPage"
                          id="perPageSelect"
                          size="sm"
                          :options="pageOptions"
                        ></b-form-select>
                        <div class="col s6">Row(s): {{totalRows}}</div>
                      </b-form-group>
                    </b-col>

                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Filter On"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        description="Leave all unchecked to filter on all data"
                        class="mb-0"
                      >
                        <b-form-checkbox-group v-model="filterOn" class="mt-1">
                          <b-form-checkbox value="id">ID</b-form-checkbox>
                          <b-form-checkbox value="date">Date</b-form-checkbox>
                        </b-form-checkbox-group>
                      </b-form-group>
                    </b-col>
                    <b-col lg="4"></b-col>
                    <b-col lg="4" class="my-1">
                      <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                      ></b-pagination>
                    </b-col>
                  </b-row>

                  <!-- Main table element -->
                  <b-table
                    responsive
                    hover
                    bordered
                    footClone
                    :items="items"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filterIncludedFields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    @filtered="onFiltered"
                  >
                    <template slot="[show_details]" slot-scope="row">
                      <b-button style="background-color:green"
                        size="sm"
                        @click="row.toggleDetails"
                        class="mr-2"
                      >{{ row.detailsShowing ? 'Hide' : 'Show'}} Details</b-button>

                      <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
                      <b-form-checkbox
                        v-model="row.detailsShowing"
                        @change="row.toggleDetails"
                      >Details via check</b-form-checkbox>
                    </template>
                    <template v-slot:row-details="row">
                      <b-card>
                        <b-row class="mb-2">
                          <b-col md="4" class="text-sm-right">
                            <b>Item(s): {{row.item.arr.length}}</b>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col class="mb-2">
                            <b>Name[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].name}}
                              <br />
                            </b>
                          </b-col>
                          <b-col class="mb-2">
                            <b>ID#[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].product_id}}
                              <br />
                            </b>
                          </b-col>
                          <b-col class="mb-2">
                            <b>Price[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].price}}
                              <br />
                            </b>
                          </b-col>
                          <b-col class="mb-2">
                            <b>Quantity[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].quantity}}
                              <br />
                            </b>
                          </b-col>
                        </b-row>
                        <b-button style="background-color:green" size="sm" @click="row.toggleDetails">Hide Details</b-button>
                      </b-card>
                    </template>
                  </b-table>
                </b-container>
              </md-tab>

              <md-tab id="tab-pages" md-label="Export" md-icon="redo">
                <b-container fluid>
                  <b-row>
                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Sort"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="sortBySelect"
                        class="mb-0"
                      >
                        <b-input-group size="sm">
                          <b-form-select
                            v-model="sortBy"
                            id="sortBySelect"
                            :options="sortOptions"
                            class="w-75"
                          >
                            <template v-slot:first>
                              <option value>-- none --</option>
                            </template>
                          </b-form-select>
                          <b-form-select
                            v-model="sortDesc"
                            size="sm"
                            :disabled="!sortBy"
                            class="w-25"
                          >
                            <option :value="false">Asc</option>
                            <option :value="true">Desc</option>
                          </b-form-select>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col lg="4"></b-col>
                    <b-col lg="4"></b-col>
                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Filter"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="filterInput"
                        class="mb-0"
                      >
                        <b-input-group size="sm">
                          <b-form-input
                            class="col s3"
                            v-model="filter"
                            type="search"
                            id="filterInput"
                            placeholder="Type to Search"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col lg="4"></b-col>
                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Per page"
                        label-cols-sm="6"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="perPageSelect"
                        class="mb-0"
                      >
                        <b-form-select
                          class="col s6"
                          v-model="perPage"
                          id="perPageSelect"
                          size="sm"
                          :options="pageOptions"
                        ></b-form-select>
                        <div class="col s6">Row(s): {{totalRows2}}</div>
                      </b-form-group>
                    </b-col>

                    <b-col lg="4" class="my-1">
                      <b-form-group
                        label="Filter On"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        description="Leave all unchecked to filter on all data"
                        class="mb-0"
                      >
                        <b-form-checkbox-group v-model="filterOn" class="mt-1">
                          <b-form-checkbox value="id">ID</b-form-checkbox>
                          <b-form-checkbox value="date">Date</b-form-checkbox>
                        </b-form-checkbox-group>
                      </b-form-group>
                    </b-col>
                    <b-col lg="4"></b-col>
                    <b-col lg="4" class="my-1">
                      <b-pagination
                        v-model="currentPage2"
                        :total-rows="totalRows2"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                      ></b-pagination>
                    </b-col>
                  </b-row>

                  <!-- Main table element -->
                  <b-table
                  responsive
                    hover
                    footClone
                    :items="items2"
                    :fields="fields2"
                    :current-page="currentPage2"
                    :per-page="perPage"
                    :filter="filter"
                    :filterIncludedFields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    @filtered="onFiltered2"
                  >
                    <template slot="[show_details]" slot-scope="row">
                      <b-button style="background-color:orange"
                        size="sm"
                        @click="row.toggleDetails"
                        class="mr-2"
                      >{{ row.detailsShowing ? 'Hide' : 'Show'}} Details</b-button>

                      <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
                      <b-form-checkbox 
                        v-model="row.detailsShowing"
                        @change="row.toggleDetails"
                      >Details via check</b-form-checkbox>
                    </template>
                    <template v-slot:row-details="row">
                      <b-card>
                        <b-row class="mb-2">
                          <b-col md="4" class="text-sm-right">
                            <b>Item(s): {{row.item.arr.length}}</b>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col class="mb-2">
                            <b>Name[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].name}}
                              <br />
                            </b>
                          </b-col>
                          <b-col class="mb-1">
                            <b>ID#[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].p_id}}
                              <br />
                            </b>
                          </b-col>
                          <b-col class="mb-2">
                            <b>IID[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].i_id}}
                              <br />
                            </b>
                          </b-col>
                          <b-col class="mb-2">
                            <b>Price[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].input_price}}
                              <br />
                            </b>
                          </b-col>
                          <b-col class="mb-2">
                            <b>Quantity[]:</b>
                            <br />
                            <b v-for="(atem,index) in row.item.arr" :key="index">
                              {{row.item.arr[index].input_qty}}
                              <br />
                            </b>
                          </b-col>
                        </b-row>
                        <b-button style="background-color:orange" size="sm" @click="row.toggleDetails">Hide Details</b-button>
                      </b-card>
                    </template>
                  </b-table>
                </b-container>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
        <stats-card data-background-color="green">
          <template slot="header">
            <md-button class="md-success" @click="dowloadJSON2ExcelImport()"><md-tooltip md-direction="top">Detail</md-tooltip><md-icon>save_alt</md-icon></md-button>
            <p class="category">Import</p>    
          </template>
          <template slot="content">
            <b-row>
              <b-col><md-button class="md-success" @click="viewImportY">Year</md-button></b-col>
              <b-col><md-button class="md-success" @click="viewImportM">Month</md-button></b-col>
              <b-col><md-button class="md-success" @click="viewImportD">Day</md-button></b-col>
            </b-row>
          </template>
          <template slot="footer">
            <div class="stats" v-if="view">
              <p>View by: {{vby}}</p>
              <p>Total receipt: {{r_receipt}}</p>
              <p>Total quantity: {{r_qty}}</p>
              <p>Total price: {{r_price}} $</p>
            </div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-button class="md-warning" @click="dowloadJSON2ExcelExport()"><md-tooltip md-direction="top">Detail</md-tooltip><md-icon>redo</md-icon></md-button>
            <p class="category">Export</p>
          </template>
          <template slot="content">
            <b-row>
              <b-col><md-button class="md-warning" @click="viewExportY">Year</md-button></b-col>
              <b-col><md-button class="md-warning" @click="viewExportM">Month</md-button></b-col>
              <b-col><md-button class="md-warning" @click="viewExportD">Day</md-button></b-col>
            </b-row>
          </template>
          <template slot="footer">
            <div class="stats" v-if="view2">
              <p>View by: {{vby2}}</p>
              <p>Total receipt: {{r_receipt2}}</p>
              <p>Total quantity: {{r_qty2}}</p>
              <p>Total price: {{r_price2}} $</p>
            </div>
          </template>
        </stats-card>
      </div>
    </div>
  </div>
</template>

<script>
import db from "./firebaseinit";
import { NavTabsCard, NavTabsTable, StatsCard } from "@/components";
export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    StatsCard
  },
  data() {
    return {
      items: [],
      itemitems:[],
      itemitems2:[],
      items2: [],
      fields: [
        {
          key: "id",
          label: "Import ID"
        },
        "show_details",
        {
          key: "total_price",
          label: "Price ($)",
          sortable: true
        },
        { key: "total_qty", label: "Quantity", sortable: true },
        { key: "date", label: "Date", sortable: true }
      ],
      fields2: [
        {
          key: "id",
          label: "Export ID"
        },
        {
          key: "type",
          sortable: true
        },
        "show_details",
        {
          key: "total_price",
          label: "Price ($)",
          sortable: true
        },
        { key: "total_qty", label: "Quantity", sortable: true },
        { key: "date", label: "Date", sortable: true }
      ],
      totalRows: 1,
      totalRows2: 0,
      currentPage: 1,
      currentPage2: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      r_receipt:0,
      r_qty:0,
      r_price:0,
      view:false,
      vby:null,
      r_receipt2:0,
      r_qty2:0,
      r_price2:0,
      view2:false,
      vby2:null,
    };
  },
  created() {
    db.collection("good_recipt")
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            arr: doc.data().items,
            total_qty: doc.data().total_qty,
            total_price: doc.data().total_price,
            date: doc.data().date
          };
          this.items.push(data);
          this.totalRows++;
        });
      });
    db.collection("good_issue")
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            arr: doc.data().items,
            total_qty: doc.data().total_qty,
            total_price: doc.data().total_price,
            type: doc.data().type,
            date: doc.data().date
          };
          this.items2.push(data);
          this.totalRows2++;
        });
      });
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
    this.totalRows2 = this.items2.length;
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onFiltered2(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows2 = filteredItems.length;
      this.currentPage2 = 1;
    },
    viewImportY(){
      this.vby="Year";
      this.r_receipt =0;
      this.r_qty=0;
      this.r_price=0;
      this.view = true;
      var toDay = new Date();
      var year = toDay.getFullYear();
      for (let i = 0; i < this.items.length; i++) {
        if (year == new Date(this.items[i].date).getFullYear()) {
          this.r_receipt ++;
          this.r_qty += this.items[i].total_qty;
          this.r_price += this.items[i].total_price;
        } 
      }
    },
    viewImportM(){
      this.vby="Month";
      this.r_receipt =0;
      this.r_qty=0;
      this.r_price=0;
      this.view = true;
      var toDay = new Date();
      var year = new Date(toDay.getFullYear(),toDay.getMonth()).toDateString();
      for (let i = 0; i < this.items.length; i++) {
        var b = new Date(this.items[i].date);
        if (year == new Date(b.getFullYear(),b.getMonth()).toDateString()) {
          this.r_receipt ++;
          this.r_qty += this.items[i].total_qty;
          this.r_price += this.items[i].total_price;
        } 
      }
    },
    viewImportD(){
      this.vby="Day";
      this.r_receipt =0;
      this.r_qty=0;
      this.r_price=0;
      this.view = true;
      var toDay = new Date();
      var year = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()).toDateString();
      for (let i = 0; i < this.items.length; i++) {
        var b = new Date(this.items[i].date);
        if (year == new Date(b.getFullYear(),b.getMonth(),b.getDate()).toDateString()) {
          this.r_receipt ++;
          this.r_qty += this.items[i].total_qty;
          this.r_price += this.items[i].total_price;
        } 
      }
    },
    viewExportY(){
      this.vby2="Year";
      this.r_receipt2 =0;
      this.r_qty2=0;
      this.r_price2=0;
      this.view2 = true;
      var toDay = new Date();
      var year = toDay.getFullYear();
      for (let i = 0; i < this.items2.length; i++) {
        if (year == new Date(this.items2[i].date).getFullYear()) {
          this.r_receipt2 ++;
          this.r_qty2 += this.items2[i].total_qty;
          this.r_price2 += this.items2[i].total_price;
        } 
      }
    },
    viewExportM(){
      this.vby2="Month";
      this.r_receipt2 =0;
      this.r_qty2=0;
      this.r_price2=0;
      this.view2 = true;
      var toDay = new Date();
      var year = new Date(toDay.getFullYear(),toDay.getMonth()).toDateString();
      for (let i = 0; i < this.items2.length; i++) {
        var b = new Date(this.items2[i].date);
        if (year == new Date(b.getFullYear(),b.getMonth()).toDateString()) {
          this.r_receipt2 ++;
          this.r_qty2 += this.items2[i].total_qty;
          this.r_price2 += this.items2[i].total_price;
        } 
      }
    },
    viewExportD(){
      this.vby2="Day";
      this.r_receipt2 =0;
      this.r_qty2=0;
      this.r_price2=0;
      this.view2 = true;
      var toDay = new Date();
      var year = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()).toDateString();
      for (let i = 0; i < this.items2.length; i++) {
        var b = new Date(this.items2[i].date);
        if (year == new Date(b.getFullYear(),b.getMonth(),b.getDate()).toDateString()) {
          this.r_receipt2 ++;
          this.r_qty2 += this.items2[i].total_qty;
          this.r_price2 += this.items2[i].total_price;
        } 
      }
    },
    dowloadJSON2ExcelImport(){
       var createXLSLFormatObj = [];
      let i1 = this.items;
       for (let i = 0; i < i1.length; i++) {
         let i2 = i1[i].arr;
         for (let j = 0; j < i2.length; j++) {
           var obj = {
             id: i1[i].id,
            p_id: i2[j].product_id,
            price: i2[j].price,
            quantity: i2[j].quantity,
            date:i1[i].date
           }
           this.itemitems.push(obj);
         }
       }
 
        /* XLS Head Columns */
        var xlsHeader = ["#","Product ID", "Price","Quantity","Date"];
        createXLSLFormatObj.push(xlsHeader);
        $.each(this.itemitems, function(index, value) {
            var innerRowData = [];
            
            $.each(value, function(ind, val) {
 
                innerRowData.push(val);
            });
            createXLSLFormatObj.push(innerRowData);
        });
 
 
        /* File Name */
        var filename = "im_REPORT_DETAIL.xlsx";
 
        /* Sheet Name */
        var ws_name = "ird";
 
        if (typeof console !== 'undefined') console.log(new Date());
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
 
        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
 
        /* Write workbook and Download */
        if (typeof console !== 'undefined') console.log(new Date());
        XLSX.writeFile(wb, filename);
        if (typeof console !== 'undefined') console.log(new Date());
    },
    dowloadJSON2ExcelExport(){
       var createXLSLFormatObj = [];
      let i1 = this.items2;
       for (let i = 0; i < i1.length; i++) {
         let i2 = i1[i].arr;
         for (let j = 0; j < i2.length; j++) {
           var obj = {
             id: i1[i].id,
            p_id: i2[j].p_id,
            price: i2[j].input_price,
            quantity: i2[j].input_qty,
            date: i1[i].date
           }
           this.itemitems2.push(obj);
         }
       }
 
        /* XLS Head Columns */
        var xlsHeader = ["#","Product ID", "Price","Quantity"];
        createXLSLFormatObj.push(xlsHeader);
        $.each(this.itemitems2, function(index, value) {
            var innerRowData = [];
            
            $.each(value, function(ind, val) {
 
                innerRowData.push(val);
            });
            createXLSLFormatObj.push(innerRowData);
        });
 
 
        /* File Name */
        var filename = "ex_REPORT_DETAIL.xlsx";
 
        /* Sheet Name */
        var ws_name = "erd";
 
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
  }
};
</script>
