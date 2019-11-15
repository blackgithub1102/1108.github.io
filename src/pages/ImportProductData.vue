<template>
  <div class="product">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title col s11">Upload List of Products</h4>
            <p class="category" style="padding-left:20px">Upload Excel file (.xls or .xlsx)</p>
          </md-card-header>
          <md-card-content>
            <input :disabled="a" type="file" id="fileUpload" style=" padding-top:5px; padding-bottom:5px"/>
            <button class="btn-small waves-effect waves-light" @click="Upload()">
              <md-tooltip md-direction="top">Upload</md-tooltip>
              <i class="fa fa-upload"></i>
            </button>
            <hr />
            <div v-if="!a" id="dvExcel"></div>
            <b-table v-if="a"
                hover
              bordered
              small
              :items="products"
              :fields="fields"
            >
            <template slot="[duplicate]" slot-scope="aaa">
                <button v-if="aaa.item.duplicate==true" @click="delPro(aaa.item.Id)"
                    class="btn-floating btn-small waves-effect waves-light btn-large red accent-3 pulse"
                    style="margin-right:20px;"
                  >
                    <md-tooltip md-direction="top">Remove</md-tooltip>
                    <md-icon style="margin-bottom:30px;color:#ffd740">remove</md-icon>
                </button>
            </template>
            </b-table>
          </md-card-content>
        </md-card>
        <md-button v-if="a" :disabled="b" class="md-success" @click="save()">Add</md-button>
      </div>
    </div>
  </div>
</template>

<script >
import db from "./firebaseinit";
export default {
    data() {
    return {
      products: [],
      products2:[],
      date:null,
      a: false,
      b: true,
      fields: [
          { key: "Id", label: "ID#", sortable: true },
        { key: "Name", label: "Product Name", sortable: true },
        "Category",
        "Supplier",
        {key:"duplicate",sortable: true}
      ]
    };
  },
  created() {
    db.collection("products")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            'product_id': doc.data().product_id,
          };
          this.products2.push(data);
        });
      });
  },
  methods: {
    Upload() {
      let _this = this;
      //Reference the FileUpload element.
      var fileUpload = document.getElementById("fileUpload");

      //Validate whether File is valid Excel file.
      var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
      if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof FileReader != "undefined") {
          var reader = new FileReader();

          //For Browsers other than IE.
          if (reader.readAsBinaryString) {
            reader.onload = function(e) {
              _this.ProcessExcel(e.target.result);
            };
            reader.readAsBinaryString(fileUpload.files[0]);
          } else {
            //For IE Browser.
            reader.onload = function(e) {
              var data = "";
              var bytes = new Uint8Array(e.target.result);
              for (var i = 0; i < bytes.byteLength; i++) {
                data += String.fromCharCode(bytes[i]);
              }
              _this.ProcessExcel(data);
            };
            reader.readAsArrayBuffer(fileUpload.files[0]);
          }
        } else {
          alert("This browser does not support HTML5.");
        }
      } else {
        alert("Please upload a valid Excel file.");
      }
    },
    ProcessExcel(data) {
      //Read the Excel File data.
      var workbook = XLSX.read(data, {
        type: "binary"
      });

      //Fetch the name of First Sheet.
      var firstSheet = workbook.SheetNames[0];

      //Read all rows from First Sheet into an JSON array.
      var excelRows = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[firstSheet]
      );

      //Create a HTML Table element.
      var table = document.createElement("table");
      table.border = "1";

      //Add the header row.
      var row = table.insertRow(-1);

      //Add the header cells.
      var headerCell = document.createElement("TH");
      headerCell.innerHTML = "Id";
      row.appendChild(headerCell);

      headerCell = document.createElement("TH");
      headerCell.innerHTML = "Name";
      row.appendChild(headerCell);

      headerCell = document.createElement("TH");
      headerCell.innerHTML = "Category";
      row.appendChild(headerCell);

      headerCell = document.createElement("TH");
      headerCell.innerHTML = "Supplier";
      row.appendChild(headerCell);

      //Add the data rows from Excel file.
      for (var i = 0; i < excelRows.length; i++) {
        //Add the data row.
        var row = table.insertRow(-1);

        //Add the data cells.
        var cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Id;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Name;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Category;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Supplier;
      }

      var dvExcel = document.getElementById("dvExcel");
      dvExcel.innerHTML = "";
      dvExcel.appendChild(table);
      this.a = true;
      let _this = this;
      _this.convert();
      _this.checkDuplicate();
      _this.checkToAdd();
    },
    save(){
        for (let i = 0; i < this.products.length; i++) {
            db.collection("products")
            .add({
            product_id: this.products[i].Id,
            name: this.products[i].Name,
            category: this.products[i].Category,
            supplier: this.products[i].Supplier
            }).catch(error => console.log(error));

            db.collection("store")
            .add({
            id: this.products[i].Id,
            name: this.products[i].Name,
            price: 0,
            quantity: 0
            })
            .catch(error => console.log(error));
        };
        db.collection("noitification")
        .add({
          time: new Date().toDateString(),
          type: "Imported list of products",
        })
        .catch(error => console.log(error));
        this.$router.push("/products");
        M.toast({ html: "A list of product added!", classes: "rounded light-green" });
    },
    convert(){
        var myRows = [];
        var $headers = $("th");
        var $rows = $("tbody tr").each(function(index) { var
        $cells = $(this).find("td");
        myRows[index] = {};
        $cells.each(function(cellIndex) {
            myRows[index][$($headers[cellIndex]).html()] = $(this).html();
        });    
        });
        var myObj = {};
        myObj.myrows = myRows;
        this.products = myRows;
        this.products.splice(0,1);
      },
    checkDuplicate: function() {
      try {
        let pro = this.products;
        let pro2 = this.products2
        for (var i = 0; i < pro.length; i++) {
          for (let j = 0; i < pro2.length; j++) {
              if (pro[i].Id == pro2[j].product_id) {
                  pro[i].duplicate = true;
                  break;
              }
          }
        }
      } catch (error) {}
    },
    checkToAdd: function() {
      try {
        let pro = this.products;
        for (var i = 0; i < pro.length; i++) {
          if (pro[i].duplicate == true) {
              break; 
          }else{
            this.b = false;
          }
        }
      } catch (error) {}
    },
    delPro(id){
      let _this = this;

        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].Id == id) {
                this.products.splice(i,1);
            }
        }
              _this.checkToAdd();
    }
  },

};

</script>