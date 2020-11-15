<template>
  <q-page>
    <!-- <p class="text-h6">Elementos de </p> -->
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el to="/dashboard" label="Inicio" />
      <q-breadcrumbs-el label="Cupones" />
    </q-breadcrumbs>

    <div class="text-h6">Cupones</div>

    <div class="text-right q-ma-lg">
      <q-btn push color="indigo-13" @click="dialog=true" icon="add" label="agregar nuevo" />
    </div>

    <q-markup-table bordered separator="horizontal">
      <thead class="bg-indigo-14">
        <tr>
          <th colspan="6">
            <div class="row no-wrap items-center">
              <!-- <q-img
                style="width: 70px"
                :ratio="1"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/donuts.png"
              />-->

              <div class="text-h4 q-ml-md text-white">Cupones</div>
            </div>
          </th>
        </tr>
        <tr class="text-white">
          <th class="text-right">Nombre</th>
          <th class="text-right">Tipo</th>
          <th class="text-right">Cantidad</th>
          <th class="text-right">Fecha Inicio</th>
          <th class="text-right">Fecha Fin</th>
          <th class="text-right"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in cupones" :key="index">
          <td class="text-right">{{item.name}}</td>
          <td class="text-right">{{item.type}}</td>
          <td class="text-right">{{item.amount | numfix}}</td>
          <td class="text-right">{{item.start}}</td>
          <td class="text-right">{{item.end}}</td>
          <td class="text-right">
            <q-btn flat round color="red" icon="delete" @click="deleteItem(index)"></q-btn>
          </td>
        </tr>

        <tr v-if="cupones.length===0">
          <td colspan="6">No hay cupones aún</td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-dialog v-model="dialog">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Cupón</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form action="#" @submit="submit" class="q-gutter-md">
            <q-input
              filled
              v-model="name"
              label="Nombre del cupón"
              required
              dense
              lazy-rules
              :rules="[ val => val && val.length > 3 || 'Ingrese un valor válido']"
            />

            <div class="text-center q-mt-md">
              <p>Tipo de Cupón</p>
              <q-btn-toggle
                v-model="type"
                push
                toggle-color="indigo-14"
                :options="[
          {label: 'Monetario', value: 'Monto'},
          {label: 'Porcentaje', value: 'Porcentaje'},
        ]"
              />
            </div>

            <q-input
              filled
              v-model="amount"
              label="Cantidad"
              required
              dense
              lazy-rules
              :rules="[ val => val && val > 0 || 'Ingrese un valor válido']"
            />

            <q-input
              filled
              v-model="start"
              dense
              label="Fecha de Inicio"
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      :options="optionsFn"
                      v-model="start"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input filled v-model="end" dense label="Fecha Fin" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                    <q-date
                      :options="optionsFn2"
                      v-model="end"
                      @input="() => $refs.qDateProxy2.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <div class="text-center q-mt-md">
              <q-btn
                push
                color="indigo-14"
                icon="save"
                class="full-width q-mt-lg"
                type="submit"
                label="guardar"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="cerrar" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Cupones",
  data() {
    return {
      buscar: "",
      uid: "",
      name: "",
      type: "Monto",
      amount: 0,
      start: new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "/"),
      end: new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "/"),
      dialog: false,
      cupones: []
    };
  },
  mounted: function() {
    this.uid = firebase.auth().currentUser.uid;
         let self = this;
          this.uid=firebase.auth().currentUser.uid
        var db = firebase.firestore();
        db.collection("coupons_" + this.uid)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var temp = doc.data();
              temp.id = doc.id;
              self.cupones.push(temp);
            });
          });
  },
  methods: {
    optionsFn(date) {
      return (
        date >=
        new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "/")
      );
    },
    optionsFn2(date) {
      return date >= this.start;
    },
    submit() {
      let self=this
      var db_data={
        name: this.name,
        type: this.type,
        amount: this.amount,
        start: this.start,
        end: this.end
      }
      var db = firebase.firestore();
      db.collection("coupons_" + this.uid)
        .add(db_data)
        .then(function(docRef) {
          db_data.id = docRef.id;
          self.cupones.push(db_data);
          self.dialog = false;
          self.$q.notify({
            message: "Se ha agregado el cupón",
            color: "green"
          });
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    },
    deleteItem(index) {
      // let self = this;
      // var item = this.productos[this.actionIndex];

      // var db = firebase.firestore();

      // db.collection("categories_" + this.uid)
      //   .doc(item.id)
      //   .delete()
      //   .then(function() {
      //     if (item.image !== "") {
      //       var storageRef = firebase.storage().refFromURL(item.image);
      //       storageRef.delete();
      //     }
      //     self.productos.splice(self.actionIndex, 1);
      //   })
      //   .catch(function(error) {
      //     console.error("Error removing document: ", error);
      //   });
    }
  },
  filters: {
    numfix: function(value) {
     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
  },
  watch: {
    start: function(val) {
      if (new Date(val) > new Date(this.end)) {
        this.end = val;
      }
    }
  }
};
</script>
