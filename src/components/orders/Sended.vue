<template>
  <div>
    <div class="text-h5 q-mb-md">Ordenes enviadas hoy</div>
    <br />
    <div class="row q-col-gutter-md">
      <div v-for="(item) in orders" :key="item.id" class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section class="text-left">
            <div class="row items-center no-wrap">
              <div class="col text-left">
                <div class="text-subtitle1">Cliente: {{item.client }}</div>
                <div class>ID: {{ item.id | cutcat }}</div>
              </div>
              <div class="col-auto">
                <div side class="text-h6">{{item.created | convert}}</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list dense>
              <q-item v-for="(item, index) in item.productos" :key="index">
                <q-item-section avatar>
                  <span class="text-h6">{{ item.cantidad }}</span>
                </q-item-section>

                <q-item-section class="text-left">
                  <q-item-label style="font-size: 16px">{{item.name}}</q-item-label>
                  <q-item-label caption class="text-grey-7">{{item.observacion}}</q-item-label>
                </q-item-section>

                <q-item-section style="font-size: 16px" side>${{item.price}}</q-item-section>
              </q-item>

              <q-separator inset="item" />
            </q-list>
          </q-card-section>

          <q-card-section class="text-right">
            <div class="text-h6">Total: ${{ item.subtotal }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Sended",
  data() {
    return {
      uid: "jess",
      alert: false,
      no_orders: 0,
      orders: [],
    };
  },
  created: function() {
    this.uid = firebase.auth().currentUser.uid;
    let self = this;

    var db = firebase.firestore();
    let start = new Date();
    start.setHours(0,0,0,0);

    db.collection("orders_" + this.uid)
      // .where("status", "==", "enviado")
      .where('sended', '>', start)
      .onSnapshot(function(querySnapshot) {
        self.orders = [];
        querySnapshot.forEach(function(doc) {
          var temp = doc.data();
          temp.id = doc.id;
          self.orders.push(temp);
        });
      });
  },
  methods: {},
  filters: {
    convert(val) {
      var curdate = new Date(null);
      curdate.setTime(val.seconds * 1000);
      var x = curdate.toLocaleTimeString().substring(8, 11);
      return curdate.toLocaleTimeString().substring(5, -2) + x;
    },
    cutcat(val) {
      return val.substr(val.length - 6);
    },
  }
};
</script>