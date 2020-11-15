<template>
  <q-page>
    <div class="row q-col-gutter-md">
      <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
        <q-card class="my-card q-mb-lg">
          <q-card-section horizontal>
            <q-btn size="30px" color="indigo-14" icon="person" />

            <q-card-section>
              <div>Usuarios registrados:</div>
              <div class="text-h4 text-center">{{users}}</div>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="my-card q-mb-lg">
          <q-card-section horizontal>
            <q-btn size="30px" color="red-13" icon="restaurant" />

            <q-card-section>
              <div>No. Productos:</div>
              <div class="text-h4 text-center">{{products}}</div>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="my-card q-mb-lg">
          <q-card-section horizontal>
            <q-btn size="30px" color="green-14" icon="assignment" />

            <q-card-section>
              <div>Ordenes del mes:</div>
              <div class="text-h4 text-center">{{orders}}</div>
            </q-card-section>
          </q-card-section>
        </q-card>
         <q-card class="my-card">
          <q-card-section horizontal>
            <q-btn size="30px" color="yellow-14" icon="star" />

            <q-card-section>
              <div>Calificación del mes:</div>
              <div class="text-h4 text-center">{{rating}}</div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      
      
      <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Entradas del mes</div>
          </q-card-section>
          <q-card-section>
            <div class="small">
              <line-chart v-if="datacollection!=null" style="height: 350px" :options="options2" :chart-data="datacollection2"></line-chart>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
    </div>
    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
          <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Ordenes del mes</div>
          </q-card-section>
          <q-card-section>
            <div class="small">
              <bar-chart v-if="datacollection!=null" style="height: 350px" :options="options" :chart-data="datacollection"></bar-chart>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6 q-mb-lg">Ultimas Ordenes</div>
            <q-markup-table dense flat>
              <thead>
                <tr class="bg-indigo-14 text-white">
                  <th class="text-left">Cliente</th>
                  <th class="text-right">Estatus</th>
                  <th class="text-right">Total</th>
                  <th class="text-right">Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in lastOrders" :key="item.id">
                  <td class="text-left">{{item.client}}</td>
                  <td class="text-right">{{item.status}}</td>
                  <td class="text-right">{{item.subtotal}}</td>
                  <td class="text-right">{{item.created | convert}}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
          <q-card-section></q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import BarChart from "components/BarChart.js";
import LineChart from "components/LineChart.js";
import firebase from "firebase";

export default {
  name: "PageIndex",
  components: {
    BarChart,
    LineChart
  },
  data() {
    return {
      uid: "",
      products: 0,
      users: 0,
      orders: 0,
      rating: 0,
      lastOrders: [],
      datacollection: null,
      datacollection2: null,
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      options2: {
        responsive: true,
        maintainAspectRatio: false,
      }
    };
  },
  mounted() {
    this.uid = firebase.auth().currentUser.uid;
    this.fillData();
    this.fillLastOrders();
    this.fillProducts();
    this.fillUsers();
  },
  methods: {
    fillLastOrders() {
      let self = this;
      var db = firebase.firestore();
      this.lastOrders = [];
      db.collection("orders_" + this.uid)
        .orderBy("created", "desc")
        .limit(10)
        // .where("created", ">=", start)
        // .where("created", "<=", end)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var temp = doc.data();
            temp.id = doc.id;

            self.lastOrders.push(temp);
          });
        });
    },
    fillProducts() {
      let self = this;
      var db = firebase.firestore();
      db.collection("products_" + this.uid)
        .get()
        .then(querySnapshot => {
          self.products = querySnapshot.size;
        });
    },
    fillUsers() {
      let self = this;
      var db = firebase.firestore();
      db.collection("users_" + this.uid)
        .get()
        .then(querySnapshot => {
          self.users = querySnapshot.size;
        });
    },
    fillData: async function() {
      let self = this;
      var d = new Date();
      var start = new Date(d.getFullYear(), d.getMonth() , 1);
      var end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      end.setHours(23, 59, 59);

       var labels = [],
        set1 = [],
        set2 = [],
        set3 = [];

        var now = new Date();

         for (var i = 0; i < new Date(now.getFullYear(), now.getMonth()+1, 0).getDate(); i++) {
        labels[i] = i + 1;
        set1[i] = 0;
        set2[i] = 0;
        set3[i] = 0;
      }

      var rate=0; var noRates=0;

      var db = firebase.firestore();
      await db
        .collection("orders_" + this.uid)
        .orderBy("created", "desc")
        .where("created", ">=", start)
        .where("created", "<=", end)
        .get()
        .then(querySnapshot => {
          self.orders = querySnapshot.size;
          querySnapshot.forEach(doc => {
            var curdate = new Date(null);
            curdate.setTime(doc.data().created.seconds * 1000); 
            //console.log(curdate.getDate(),doc.data().status)
            if(doc.data().status=="cancelada"){
              set2[curdate.getDate()-1]++
            }
            else{
              set1[curdate.getDate()-1]++
              set3[curdate.getDate()-1]+=doc.data().subtotal
            }
            
            if(doc.data().rating>0){
              noRates++
              rate+=doc.data().rating;
            }
          });

          self.rating=rate/noRates
        });


      this.datacollection = {
        labels: labels,
        datasets: [
          {
            label: "Ordenes Recibidas",
            backgroundColor: "#304FFE",
            data: set1
          },
          {
            label: "Ordenes Canceladas",
            backgroundColor: "#fc2075",
            data: set2
          }
        ]
      };

      this.datacollection2 = {
        labels: labels,
        datasets: [
          {
            label: "Entradas",
            borderColor: '#4D67FB',
            pointBackgroundColor: '#4D67FB',
            backgroundColor: 'transparent',
            data: set3
          }
        ]
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
  },
  filters: {
    convert(val) {
      var curdate = new Date(null);
      curdate.setTime(val.seconds * 1000);
      return curdate.toLocaleString();
    }
  }
};
</script>
