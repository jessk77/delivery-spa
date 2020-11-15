<template>
  <div>
    <div class="text-h5 q-mb-md">Ordenes nuevas</div>
    <br />
    <div class="row q-col-gutter-md">
      <div v-for="(item) in orders" :key="item.id" class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col text-left">
                <div class="text-subtitle1" >Cliente: {{item.client }}  <q-btn @click="map=true, lat=item.lat, lng=item.lng, dir=item.direccion"  size="xs" round push color="indigo-14" icon="place" /></div>
                <div class>ID: {{ item.id | cutcat }} </div>
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
            <q-btn flat label="cancelar pedido" @click="cancelarPedido( item)" color="red" />
            <q-btn
            disable
              @click="confirmarPedido(item.id,item.client_uid)"
              label="confirmar pedido"
              color="indigo-14"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <MapModal :active="map" :lat="lat" :lng="lng" :dir="dir" @dismiss="map=false" />
  </div>
</template>

<script>
import firebase from "firebase";
import MapModal from "components/MapModal";

export default {
  name: "New",
  components:{
    MapModal
  },
  data() {
    return {
      uid: "jess",
      alert: false,
      map: false,
      lat: 0,
      lng: 0,
      dir: "",
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
        {
          name: "tipo_pago",
          align: "center",
          label: "Forma Pago",
          field: "tipo_pago",
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
      .where("status", "==", "creada")
      .orderBy("created", "asc")
      .onSnapshot(function(querySnapshot) {
        self.orders = [];
        querySnapshot.forEach(function(doc) {
          var temp = doc.data();
          temp.id = doc.id;
          self.orders.push(temp);
        });
        if (querySnapshot.size > self.no_orders) {
          var audio = new Audio(require("assets/swiftly.mp3"));
          //audio.play();
        }
        self.no_orders = querySnapshot.size;
      });
  },
  methods: {
    confirmarPedido(docId, client) {
      let self = this;
      this.$q.loading.show({
        message: "Cambiando estatus ..."
      });
      var db = firebase.firestore();
      var db_data = {
        status: "preparacion"
      };

      db.collection("orders_" + this.uid)
        .doc(docId)
        .update(db_data)
        .then(function() {
          self.$q.loading.hide();
          self.$q.notify({
            color: "green",
            message: "Orden en Preparacion"
          });
          self
            .axios({
              method: "post",
              url:
                "https://us-central1-api-project-363815265684.cloudfunctions.net/sendNotification",
              data: {
                ruid: self.uid,
                client: client,
                type: "aceptada"
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
    },
    cancelarPedido(row) {
      let self = this;
      this.$q
        .dialog({
          title: "Cancelar orden",
          message: "Ingrese el motivo de cancelación",
          cancel: {
            flat: true,
            color: "negative",
            label: "No cancelar"
          },
          prompt: {
            model: "",
            isValid: val => val.length > 2, // << here is the magic
            type: "text" // optional
          },
        })
        .onOk(motivo => {
          self.$q.loading.show({
            message: "Cancelando ..."
          });
          var db = firebase.firestore();
          var db_data = {
            motivo: motivo,
            status: "cancelada"
          };
          if (row.tipo_pago === "PAYPAL") {
            self.axios({
              method: "post",
              url:
                "https://us-central1-api-project-363815265684.cloudfunctions.net/refundPayment ",
              data: {
                total: row.subtotal,
                saleId: row.p_transaction,
                uid: self.uid
              }
            }).then(function(response) {
              console.log(response.data);
              if (response.data == "ok") {
                db.collection("orders_" + self.uid)
                  .doc(row.id)
                  .update(db_data)
                  .then(function() {
                    self.$q.loading.hide();
                    self.$q.notify({
                      color: "green",
                      message: "Orden Cancelada"
                    });
                  });
                self.axios({
                  method: "post",
                  url:
                    "https://us-central1-api-project-363815265684.cloudfunctions.net/sendNotification",
                  data: {
                    ruid: self.uid,
                    client: row.client_uid,
                    type: "cancelada"
                  }
                });
              } else {
                self.$q.loading.hide();
                self.$q.notify({
                  color: "red",
                  message: "Ocurrio un error"
                });
              }
            });
          } else {
            db.collection("orders_" + this.uid)
              .doc(row.id)
              .update(db_data)
              .then(function() {
                self.$q.loading.hide();
                self.$q.notify({
                  color: "green",
                  message: "Orden Cancelada"
                });
              })
              .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });
          }
        });
    },
    convert(val) {
      var curdate = new Date(null);
      curdate.setTime(val.seconds * 1000);
      return curdate.toLocaleString();
    }
  },
  filters: {
    cutcat(val) {
      return val.substr(val.length - 6);
    },
    convert(val) {
      var curdate = new Date(null);
      curdate.setTime(val.seconds * 1000);
      var x = curdate.toLocaleTimeString().substring(8, 11);
      return curdate.toLocaleTimeString().substring(5, -2) + x;
    }
  }
};
</script>