<template>
  <div>
    <div class="text-h5 q-mb-md">Ordenes en Preparación</div>
    <br />
    <div class="row q-col-gutter-md">
      <!-- <div class="text-h5 q-mb-md">Ordenes nuevas</div> -->
      <div v-for="(item) in orders" :key="item.id" class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section class="text-left">
            <div class="row items-center no-wrap">
              <div class="col text-left">
                <div class="text-subtitle1">Cliente: {{item.client }}</div>
                <div class>ID: {{ item.id | cutcat}}</div>
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
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              @click="enviarPedido(item.id,item.client_uid)"
              label="enviar orden"
              color="indigo-14"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Process",
  data() {
    return {
      uid: "jess",
      alert: false,
      no_orders: 0,
      orders: [],
      columns: [
        { name: "id", align: "left", label: "ID de Orden", field: "id" },
        {
          name: "client",
          required: true,
          label: "Cliente",
          align: "left",
          field: row => row.client,
          format: val => `${val}`,
          sortable: true
        },
        { name: "subtotal", label: "Total", field: "subtotal", sortable: true },
        {
          name: "created",
          label: "Fecha y Hora",
          field: row => row.created,
          format: val => this.convert(val)
        }
      ]
    };
  },
  created: function() {
    this.uid = firebase.auth().currentUser.uid;
    let self = this;

    var db = firebase.firestore();
    db.collection("orders_" + this.uid)
      .where("status", "==", "preparacion")
      .onSnapshot(function(querySnapshot) {
        self.orders = [];
        querySnapshot.forEach(function(doc) {
          var temp = doc.data();
          temp.id = doc.id;
          self.orders.push(temp);
        });
      });
  },
  methods: {
    enviarPedido(docId, client){
      let self = this;
      this.$q.loading.show({
        message: "Cambiando estatus ..."
      });
      var db = firebase.firestore();
      var db_data = {
        sended: firebase.firestore.FieldValue.serverTimestamp(),
        status: "enviado"
      };

      db.collection("orders_" + this.uid)
        .doc(docId)
        .update(db_data)
        .then(function() {
          self.$q.loading.hide();
          self.$q.notify({
            color: "green",
            message: "Orden Enviada"
          });
          self
            .axios({
              method: "post",
              url:
                "https://us-central1-api-project-363815265684.cloudfunctions.net/sendNotification",
              data: {
                ruid: self.uid,
                client: client,
                type: "enviada"
              }
            })
            .then(function(response) {
              console.log(response.data);
            });
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
  },
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