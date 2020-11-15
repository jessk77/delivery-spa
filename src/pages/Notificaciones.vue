<template>
  <q-page>
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el to="/dashboard" label="Inicio" />
      <q-breadcrumbs-el label="Notificaciones" />
    </q-breadcrumbs>
    <div class="text-center">
      <q-card style="max-width: 500px" bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Notificaciones a usuarios</div>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
        >Ingresa el titulo y cuerpo del mensaje que quieras que reciban los usuarios de tu App.</q-card-section>

        <q-separator inset />

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              filled
              dense
              counter
              maxlength="80"
              v-model="titulo"
              label="Titulo *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
            />

            <q-input
              filled
              dense
              counter
              maxlength="120"
              type="textarea"
              v-model="cuerpo"
              label="Cuerpo *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
            />

            <div>
              <q-btn class="full-width" label="enviar" type="submit" color="indigo-14" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script >
import firebase from "firebase";
export default {
  name: "Notificaciones",
  data() {
    return {
      titulo: "",
      cuerpo: ""
    };
  },
  methods: {
    onSubmit() {
      let self=this
      self.$q.loading.show({
            message: "Enviando ..."
          });
     var ruid = firebase.auth().currentUser.uid;
      this.axios({
        method: "post",
        url:
          "https://us-central1-api-project-363815265684.cloudfunctions.net/sendFullNotification",
        data: {
          ruid: ruid,
          title: this.titulo,
          body: this.cuerpo
        }
      }).then(function(response) {
        self.$q.notify({
          color: "green-4",
          textColor: "white",
          message: "Mensaje enviado"
        });
        console.log(response.data);
          self.titulo=""
          self.cuerpo=""
         self.$q.loading.hide();
      });
    }
  }
};
</script>
