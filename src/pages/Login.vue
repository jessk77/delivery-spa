
<template>
  <q-layout view="hHh lpR fFf" class="drawer-bg">
    <q-page-container>
      <div class="fixed-center">
        <div class="text-center">
          <img
            width="110px"
            style="padding-bottom: 20px"
            src="~assets/logo_w.png"
          />
        </div>

        <q-card style="width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Inicia Sesión</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form @submit="loginButtonPressed" class="q-gutter-md">
              <q-input
                filled
                dense
                v-model="email"
                type="email"
                label="Correo Electrónico"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Ingrese su email']"
              />

              <q-input
                filled
                dense
                type="password"
                v-model="pass"
                label="Contraseña"
                lazy-rules
                :rules="[val => val !== null && val !== '' || 'Ingrese su contraseña']"
              />

              <div class="text-center q-ma-none">
                <q-btn no-caps size="13px" flat v-on:click="resetPassword">¿Olvidaste tu contraseña?</q-btn>
              </div>

              <div>
                <q-btn
                  push
                  color="indigo-14"
                  type="submit"
                  class="full-width"
                  label="iniciar sesión"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <br />
    </q-page-container>
  </q-layout>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Login",
  data() {
    return {
      response: 1,
      uid: "jess",
      email: "",
      pass: ""
    };
  },
  created: function() {
    let self = this;
    firebase.auth().onAuthStateChanged(userAuth => {
      if (userAuth) {
        firebase
          .auth()
          .currentUser.getIdTokenResult()
          .then(tokenResult => {
            console.log(tokenResult.claims);
            if (tokenResult.claims && tokenResult.claims.admin) {
              self.$router.push("/dashboard");
            } else {
              firebase.auth().signOut()
              self.$q.notify({
                message: "Usuario no registrado como admin",
                color: "red"
              });
            }
          });
      } 
    });
  },
  methods: {
    async loginButtonPressed() {
      try {
        const { user } = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.pass);
      } catch (error) {
        this.$q.notify({
          message: "Acceso incorrecto",
          color: "red"
        });
      }
    },

    onSubmit() {
      
    },
    resetPassword() {
      var self = this;
      this.$q
        .dialog({
          title: "Restablecer contraseña",
          message: "Ingresa tu correo electrónico",
          prompt: {
            model: "",
            isValid: val => val.length > 2, // << here is the magic
            type: "email" // optional
          },
          cancel: true
        })
        .onOk(data => {
          firebase
            .auth()
            .sendPasswordResetEmail(data)
            .then(function() {
              self.$q.notify({
                color: "green",
                message:
                  "Se ha enviado un correo electrónico, revisa tu bandeja de entrada",
                icon: "email",
                position: "bottom-left"
              });
            })
            .catch(function() {
              self.$q.notify({
                message: "Ocurrio un error",
                color: "warning"
              });
            });
        });
    }
  }
};
//testDeliver
</script>

<style>
.drawer-bg {
  background-image: linear-gradient(
    to bottom,
    #0d5ae6 0%,
    #0b96ec 51%,
    #0fc9f4 100%
  );
  background-size: 200% auto;
  transition: background-position 0.2s;
}
</style>
