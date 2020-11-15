<template>
  <q-page>
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el to="/dashboard" label="Inicio" />
      <q-breadcrumbs-el label="Categorías" />
    </q-breadcrumbs>
    <p class="text-h6">Categorías</p>
    <!-- <q-toolbar class="bg-white text-primary q-mb-md shadow-2 rounded-borders">
      <q-toolbar-title>
        <q-input
          filled
          bottom-slots
          v-model="buscar"
          label="Buscar"
          dense
          class="q-mt-md gt-xs"
          style="width: 350px"
        >
          <template v-slot:append>
            <q-icon v-if="buscar !== ''" name="close" @click="buscar = ''" class="cursor-pointer" />
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar-title>
      <q-btn push color="indigo-13" icon="add" label="agregar nuevo" @click="dialog=true" />
    </q-toolbar> -->
    <div class="text-right q-ma-lg">

     <q-btn push color="indigo-13" icon="add" label="agregar nuevo" @click="dialog=true" />
    </div>

    <div class="row q-col-gutter-md">
      <div
        v-for="(item,index) in categorias"
        :key="index"
        class="col-lg-3 col-md-4 col-sm-12 col-xs-12 text-center"
      >
        <q-card class="my-card card-menu">
          <q-img
            @click="$router.push({ path: `/products/${item.id}` , query: { name: item.name }})"
            :src="item.image | render"
            style="height: 200px;"
          >
            <div class="absolute-bottom text-h6">{{item.name | cap}}</div>
          </q-img>

          <q-separator />

          <q-card-actions>
            <q-btn flat color="indigo-14" icon="edit" @click="editDialog(index)" />
            <q-btn flat color="red" icon="delete" @click="deleteDialog(index)"></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Categoría</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <CatForm :uid="uid" :item="{}" @submited="submited" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="cerrar" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editar Categoría</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <CatForm :uid="uid" :item="actionItem" @submited="edited" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="cerrar" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">¿Deseas eliminar este elemento?.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="indigo-14" v-close-popup />
          <q-btn label="Eliminar" color="indigo-14" v-close-popup @click="deleteItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import CatForm from "components/menu/CatForm";
import firebase from "firebase";

export default {
  name: "PageIndex",
  components: {
    CatForm
  },
  data() {
    return {
      uid: "",
      dialog: false,
      edit: false,
      confirm: false,
      actionIndex: 0,
      actionItem: {},
      buscar: "",
      categorias: []
    };
  },
  mounted: function() {
    this.uid=firebase.auth().currentUser.uid

    let self = this;

    var db = firebase.firestore();
    db.collection("categories_" + this.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var temp = doc.data();
          temp.id = doc.id;
          self.categorias.push(temp);
        });
      });
  },
  methods: {
    submited(data) {
      this.categorias.push(data);
      console.log(this.categorias);
      this.dialog = false;
      this.$q.notify({
        message: "Se ha agregado la categoría",
        color: "green"
      });
    },
    editDialog(index) {
      this.edit = true;
      this.actionIndex = index;
      this.actionItem = this.categorias[this.actionIndex];

      console.log(this.actionItem);
    },
    edited(data) {
      this.categorias[this.actionIndex] = data;
      console.log(this.categorias[this.actionIndex]);
      this.edit = false;
      this.$q.notify({
        message: "Se ha editado la categoría",
        color: "green"
      });
    },
    deleteDialog(index) {
      this.confirm = true;
      this.actionIndex = index;
      console.log(this.actionIndex);
    },
    deleteItem() {
      let self = this;
      var item = this.categorias[this.actionIndex];
      var db = firebase.firestore();

      db.collection("categories_" + this.uid)
        .doc(item.id)
        .delete()
        .then(function() {
          if (item.image !== "") {
            var storageRef = firebase.storage().refFromURL(item.image);
            storageRef.delete();
          }
          self.categorias.splice(self.actionIndex, 1);
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    }
    // filterFn (val, update) {
    //   if (val === '') {
    //     update(() => {
    //       this.options = stringOptions

    //       // with Quasar v1.7.4+
    //       // here you have access to "ref" which
    //       // is the Vue reference of the QSelect
    //     })
    //     return
    //   }

    //   update(() => {
    //     const needle = val.toLowerCase()
    //     this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    //   })
    // }
  },
  filters: {
    cap: function(value) {
      return value.toUpperCase();
    },
    render: function(value) {
      if (value != "") {
        return value;
      } else {
        return "https://firebasestorage.googleapis.com/v0/b/api-project-363815265684.appspot.com/o/plate.jpg?alt=media&token=a977c0d8-f9f0-4bdf-8061-abe110f28e58";
      }
    }
  }
};
</script>

<style>
.card-menu{
  cursor: pointer;
}
</style>
