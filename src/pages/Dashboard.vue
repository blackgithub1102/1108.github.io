<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" id="chart_div" style="height: 500px;"></div>
      
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>home_work</md-icon>
          </template>

          <template slot="content">
            <p class="category">Stock</p>
            <h3 v-bind="getStock()" class="title">{{stock}}</h3>
          </template>

          <template slot="footer">
            <div class="stats" style="color:green" v-if="stock>0 & stock<5000">
              <md-icon>storage</md-icon>
              Storage limit: {{stock}}/10.000
            </div>
            <div class="stats" style="color:orange" v-if="stock>=5000 & stock<8500">
              <md-icon>storage</md-icon>
              Storage limit: {{stock}}/10.000
            </div>
            <div class="stats" style="color:red" v-if="stock>=8500">
              <md-icon>storage</md-icon>
              Storage limit: {{stock}}/10.000
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="green">
          <template slot="header">
            <md-icon>save_alt</md-icon>
          </template>

          <template slot="content">
            <p class="category">Daily Import</p>
            <h3 class="title" v-bind="getDataChart1()">
              {{quantity1}}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>info</md-icon>
              <router-link to="/warehousereport"><a style="color:blue">View more</a></router-link>
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>redo</md-icon>
          </template>

          <template slot="content">
            <p class="category">Daily Export</p>
            <h3 class="title" v-bind="getDailyExport()" >{{quantity2}}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>info</md-icon>
              <router-link to="/warehousereport"><a style="color:blue">View more</a></router-link>
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <i class="fab fa-twitter"></i>
          </template>

          <template slot="content">
            <p class="category">Folowers</p>
            <h3 class="title">+245</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>update</md-icon>
              Just Updated
            </div>
          </template>
        </stats-card>
      </div>
      
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-50 md-size-50"
      >
        <chart-card 
          :chart-data="dailySalesChart.data"
          :chart-options="dailySalesChart.options"
          :chart-type="'Bar'"
          data-background-color="blue"
        >
          <template slot="content" >
            <h4 class="title">Daily Sales</h4>
            <p class="category"> 
              <span class="text-success"
                ><i class="fas fa-long-arrow-alt-up"></i> 55%
              </span>
              increase in today sales.
            </p>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>
              updated 4 minutes ago
            </div>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <chart-card
          :chart-data="emailsSubscriptionChart.data"
          :chart-options="emailsSubscriptionChart.options"
          :chart-responsive-options="emailsSubscriptionChart.responsiveOptions"
          :chart-type="'Bar'"
          data-background-color="red"
        >
          <template slot="content">
            <h4 class="title">Email Subscription</h4>
            <p class="category">
              Last Campaign Performance
            </p>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>
              updated 10 days ago
            </div>
          </template>
        </chart-card>
      </div>

      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" id="piechart" style="height: 500px;"></div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" id="chart_div1" style="height: 500px;"></div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" id="chart_div2" style="height: 500px;"></div>
    </div>
  </div>
</template>

<script>
import db from "./firebaseinit";
import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  NavTabsTable,
  OrderedTable
} from "@/components";

export default {
  components: {
    StatsCard,
    ChartCard,
    NavTabsCard,
    NavTabsTable,
    OrderedTable
  },
  data() {
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(this.drawVisualization);
  google.charts.setOnLoadCallback(this.drawChart);
  google.charts.setOnLoadCallback(this.drawChart1);
  google.charts.setOnLoadCallback(this.drawBasic);
    return {
      dailySalesChart: {
        data: {
          labels: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() -6).toDateString(), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() -5).toDateString(), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() -4).toDateString(), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() -3).toDateString(), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() -2).toDateString(), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() -1).toDateString(), new Date().toDateString()+" (today)"],
          series: [[]]
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 5000,
          chartPadding: {
            top: 0,
            right: 100,
            bottom: 0,
            left: 100
          }
        }
      },
      
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De"
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 5000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      stock:0,
      quantity1:0,
      quantity2:0,
      warehouse:[],
      ex:[],
      aa:2000,
      aa1:1500,
      aa2:378,
      aa3:999,
      aa4:1225,
      aa5:420,
      aa6:3000,
    };
  },
  created() {
    db.collection("warehouse")
      .orderBy("date")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
          quantity: doc.data().quantity,
          date: doc.data().date,
          };
          this.warehouse.push(data);
        });
      });
  db.collection("good_issue").get().then(querySnapshot =>{
    querySnapshot.forEach(doc =>{
      const data ={
        total_qty: doc.data().total_qty,
        date: doc.data().date
      };
      this.ex.push(data);
    })
  })
  },
  methods:{
    drawBasic() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Dogs');

      data.addRows([
        [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
        [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
        [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
        [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
        [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
        [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
        [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
        [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
        [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
        [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
        [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
        [66, 70], [67, 72], [68, 75], [69, 80]
      ]);

      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Popularity'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div2'));

      chart.draw(data, options);
    },
     drawChart1() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses'],
          ['2013',  1000,      400],
          ['2014',  1170,      460],
          ['2015',  660,       1120],
          ['2016',  1030,      540]
        ]);

        var options = {
          title: 'Company Performance',
          hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('chart_div1'));
        chart.draw(data, options);
      },
    drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);

        var options = {
          title: 'My Daily Activities'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      },
    drawVisualization() {
        // Some raw data (not necessarily accurate)
        var data = google.visualization.arrayToDataTable([
          ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
          ['2004/05',  165,      938,         522,             998,           450,      614.6],
          ['2005/06',  135,      1120,        599,             1268,          288,      682],
          ['2006/07',  157,      1167,        587,             807,           397,      623],
          ['2007/08',  139,      1110,        615,             968,           215,      609.4],
          ['2008/09',  136,      691,         629,             1026,          366,      569.6]
        ]);

        var options = {
          title : 'Monthly Coffee Production by Country',
          vAxis: {title: 'Cups'},
          hAxis: {title: 'Month'},
          seriesType: 'bars',
          series: {}        };

        var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      },
    getStock(){
      let war = this.warehouse;
      var a = 0;
      for (let i = 0; i < war.length; i++) {
         a = a + war[i].quantity;
      };
      this.stock = a;
      
    },
    getDailyExport(){
      var toDay = new Date();
      var today = new Date().toDateString();
      let war = this.ex;
      var a = 0;
      for (let i = 0; i < war.length; i++) {
        var todate = new Date(war[i].date).toDateString();
        if (today == todate) {
          a = a +war[i].total_qty;
        }
      };
      this.quantity2 = a;
    },
    getDataChart1(){
      var toDay = new Date();
      var today = new Date().toDateString();
      var d1 = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()-1).toDateString();
      var d2 = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()-2).toDateString();
      var d3 = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()-3).toDateString();
      var d4 = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()-4).toDateString();
      var d5 = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()-5).toDateString();
      var d6 = new Date(toDay.getFullYear(),toDay.getMonth(),toDay.getDate()-6).toDateString();
      let war = this.warehouse;
      var a = 0;
      var a1=0;
      var a2=0;
      var a3=0;
      var a4=0;
      var a5=0;
      var a6=0;
      for (let i = 0; i < war.length; i++) {
        var todate = new Date(war[i].date).toDateString();
        if (today == todate) {
          a = a +war[i].quantity;
        }
        else if (d1 == todate) {
          a1 = a1+war[i].quantity;
        }
        else if (d2 == todate) {
          a2 = a2+war[i].quantity;
        }
        else if (d3 == todate) {
          a3 = a3+war[i].quantity;
        }
        else if (d4 == todate) {
          a4 = a4+war[i].quantity;
        }
        else if (d5 == todate) {
          a5 = a5+war[i].quantity;
        }
        else if (d6 == todate) {
          a6 = a6+war[i].quantity;
        }
      };
      this.aa = a;
      this.aa1 = a1;
      this.aa2 = a2;
      this.aa3 = a3;
      this.aa4 = a4;
      this.aa5 = a5;
      this.aa6 = a6;
      this.quantity1 = a;
    },
  },
};
</script>