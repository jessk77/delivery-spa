<template>
  <q-page>
    <!-- <p class="text-h6">Elementos de </p> -->
     <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el to="/dashboard" label="Inicio" />
      <q-breadcrumbs-el to="/menu" label="Categorias" />
      <q-breadcrumbs-el :label="$route.query.name" />
    </q-breadcrumbs>
    
    <!-- <q-toolbar class="bg-white text-primary q-mb-md shadow-2 rounded-borders">
      <q-toolbar-title>
        <q-input filled bottom-slots v-model="buscar" label="Buscar" dense class="q-mt-md gt-xs" style="width: 350px">
          <template v-slot:append>
            <q-icon v-if="buscar !== ''" name="close" @click="buscar = ''" class="cursor-pointer" />
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar-title>
      <q-btn push color="indigo-13" @click="dialog=true" icon="add" label="agregar nuevo" />
    </q-toolbar> -->

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
              /> -->

              <div class="text-h4 q-ml-md text-white">{{$route.query.name}}</div>
            </div>
          </th>
        </tr>
        <tr class="text-white">
          <th class="text-right">Imagen</th>
          <th class="text-left">Producto</th>
          <th class="text-right">Precio</th>
          <th class="text-right">Modificadores</th>
          <th class="text-right">Disponibilidad</th>
          <th class="text-right"></th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(item,index) in productos" :key="index">
          <td class="text-right">
             <q-avatar size="40px" class="q-mb-sm" v-if="item.image!=''">
              <img :src="item.image">
            </q-avatar>
          </td>
          <td class="text-left">{{item.name}}</td>
          <td class="text-right">${{item.price | numfix}}</td>
          <td class="text-right">{{item.modificador | modi}}</td>
          <td class="text-right">{{item.status | dispo}}</td>
          <td class="text-right">
             <q-btn flat round color="indigo-14" icon="edit" @click="editDialog(index)" />
              <q-btn flat round color="red" icon="delete" @click="deleteDialog(index)"></q-btn>
          </td>
        </tr>

        <tr v-if="productos.length===0"><td colspan="6">No hay productos aún</td></tr>
        
      </tbody>
    </q-markup-table>

     <q-dialog v-model="dialog">
      <q-card style="width: 600px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProdForm :cat_id="$route.params.id" :item="{}" @submited="submited" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="cerrar" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

     <q-dialog v-model="edit">
      <q-card style="width: 600px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editar Producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProdForm :cat_id="$route.params.id" :item="actionItem" @submited="edited" />
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
import ProdForm from 'components/menu/ProdForm'
import firebase from "firebase";

export default {
  name: "Products",
  components: {
    ProdForm
  },
  data() {
    return {
      buscar: "",
      uid: "",
      dialog: false,
      edit: false,
      confirm: false,
      productos: [],
      actionIndex: 0,
      actionItem: {},
    };
  },
  mounted: function () {
     let self = this;
      this.uid=firebase.auth().currentUser.uid
    var db = firebase.firestore();
    db.collection("products_" + this.uid).where("cat_id", "==", this.$route.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var temp = doc.data();
          temp.id = doc.id;
          self.productos.push(temp);
        });
      });
  },
  methods:{
     submited(data){
      this.productos.push(data)
      console.log(this.productos)
      this.dialog=false
      this.$q.notify({
        message: 'Se ha agregado el producto',
        color: 'green'
      })
    },
    editDialog(index){
      this.edit=true
      this.actionIndex=index
      this.actionItem=this.productos[this.actionIndex]

      console.log(this.actionItem)
      
    },
     edited(data){
      this.productos[this.actionIndex]=data
      console.log(this.productos[this.actionIndex])
      this.edit=false
      this.$q.notify({
        message: 'Se ha editado el producto',
        color: 'green'
      })
    },
    deleteDialog(index){
      this.confirm=true
      this.actionIndex=index
      console.log(this.actionIndex)
    },
    deleteItem(){
      let self=this
      var item=this.productos[this.actionIndex]
      
     var db = firebase.firestore();

      db.collection("categories_" + this.uid)
        .doc(item.id)
        .delete()
        .then(function() {
          if (item.image !== "") {
            var storageRef = firebase.storage().refFromURL(item.image);
            storageRef.delete();
          }
          self.productos.splice(self.actionIndex, 1);
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    }
  },
  filters: {
    numfix: function(value) {
     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    modi: function(value){
      var cad=""
      if(value.values!=null){
          value.values.forEach(function(item){
        cad+=""+item.name+" | "
      })
      }
      
      return cad
    },
    dispo: function(value) {
      if (value ==1 ) {
        return "Disponible";
      } else {
         return "Agotado"
      }
      
    }
  }
};
</script>
