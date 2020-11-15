<template>
  <div>
    <div class="text-h6">General</div>
    <br />
    <q-input
      filled
      bottom-slots
      v-model="name"
      label="Nombre del Restaurate"
      counter
      maxlength="30"
      style="max-width: 500px"
    >
      <template v-slot:before>
        <q-icon name="store_mall_directory" />
      </template>

      <!-- <template v-slot:hint>Este es el nombre que veran tus clientes en la aplicación</template> -->

      <!-- <template v-slot:append>
              <q-btn round dense flat color="indigo-14" icon="save" />
      </template>-->
    </q-input>
    <br />
    <q-input
      filled
      bottom-slots
      v-model="envio"
      label="Costo de envío"
      style="max-width: 300px"
    >
      <template v-slot:before>
        <q-icon name="directions_bike" />
      </template>

      <template v-slot:hint>Monto adicional que pagarán tus clientes por concepto de envío</template>

      <!-- <template v-slot:append>
              <q-btn round dense flat color="indigo-14" icon="save" />
      </template>-->
    </q-input>
    <br>
    <div class="text-h6">Horario</div>
    <br />
    <p>Seleccione los días y especifique el horario entre los que los clientes pueden realizar pedidos en la aplicación</p>
    <q-list dense>
      <!--
        Rendering a <label> tag (notice tag="label")
        so QCheckboxes will respond to clicks on QItems to
        change Toggle state.
      -->

      <q-item v-for="item in horario" :key="item.val">
        <q-item-section avatar>
          <q-checkbox
            v-model="item.abierto"
            :true-value="true"
            :false-value="false"
            color="indigo-12"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{item.dia}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-input
              dense
              label="Hora de Inicio"
              filled
              v-model="item.hi"
              mask="time"
              :rules="['time']"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="item.hi" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-input
              dense
              label="Hora de fin"
              filled
              v-model="item.hf"
              mask="time"
              :rules="['time']"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="item.hf" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="text-center">
      <q-btn
        push
        color="indigo-14"
        icon="save"
        class="q-ma-md"
        @click="guardar"
        label="guardar cambios"
      />
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "General",
  data() {
    return {
      user: null,
      name: "",
      envio: 0,
      horario: [
        { dia: "Lunes", val: 1, hi: "13:00", hf: "21:00", abierto: true },
        { dia: "Martes", val: 2, hi: "13:00", hf: "21:00", abierto: true },
        { dia: "Miercoles", val: 3, hi: "13:00", hf: "21:00", abierto: true },
        { dia: "Jueves", val: 4, hi: "13:00", hf: "21:00", abierto: true },
        { dia: "Viernes", val: 5, hi: "13:00", hf: "21:00", abierto: true },
        { dia: "Sabado", val: 6, hi: "13:00", hf: "21:00", abierto: true },
        { dia: "Domingo", val: 7, hi: "13:00", hf: "21:00", abierto: true }
      ]
    };
  },
  mounted: function() {
    let self = this;

    var db = firebase.firestore();
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          self.user = doc.data();
          self.name = doc.data().name;
          self.envio = doc.data().envio;
          if (doc.data().hasOwnProperty("horario")) {
            self.horario = doc.data().horario;
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
  },
  methods: {
    guardar() {
      var db = firebase.firestore();
      let self = this;
       var user = firebase.auth().currentUser;
      var db_data = { name: this.name, envio: this.envio, horario: this.horario };
      db.collection("users")
        .doc(user.uid)
        .update(db_data)
        .then(function() {
          user.updateProfile({
              displayName: self.name,
            })

          self.$q.notify({
            message: "Se han guardado los cambios",
            color: "green"
          });
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
  }
};
</script>