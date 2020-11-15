<template>
  <div>
    <div class="q-mb-sm row items-end q-gutter-md">
      <q-select
        dense
        style="width: 300px"
        color="indigo-13"
        bg-color="white"
        filled
        v-model="month"
        :options="options"
        label="Mes"
        emit-value
        map-options
      ></q-select>
      <q-input
        dense
        style="width: 300px"
        type="number"
        color="indigo-13"
        bg-color="white"
        filled
        v-model="year"
        label="Año"
      ></q-input>
    </div>

    <!-- <div class="text-h5 q-mb-md">Ordenes nuevas</div> -->
    <q-table
      :rows-per-page-options="[0,20,50,100,200]"
      title="Historial"
      :data="orders"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-btn
          color="indigo-14"
          icon-right="archive"
          label="Exportar a csv"
          no-caps
          @click="exportTable"
        />
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="md"
              color="indigo-14"
              round
              dense
              options-dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%" class="bg-indigo-13">
            <q-card style="width: 700px; max-width: 80vw;">
              <q-card-section>
                <div class="text-h6">Cliente: {{ props.row.client }}</div>
                <div class="text-subtitle2">ID Orden: {{ cutcat(props.row.id) }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-list dense>
                  <q-item v-for="(item, index) in props.row.productos" :key="index">
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
                <div class="text-h6">Total: ${{ props.row.subtotal }}</div>
              </q-card-section>
            </q-card>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- <div class="text-center q-ma-lg">
      <q-btn push color="indigo-13" icon="refresh" label="mostrar más" @click="getMoreOrders" />
    </div> -->
    <!-- <div v-for="item in orders" :key="item.id">{{item.id}}</div> -->
  </div>
</template>

<script>
import firebase from "firebase";
import { exportFile } from 'quasar'
function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  name: "List",
  data() {
    return {
      orders: [],
      listeners: [],
      start: null,
      end: null,
      year: 2020,
      month: "",
      options: [
        { label: "Enero", value: "1" },
        { label: "Febrero", value: "2" },
        { label: "Marzo", value: "3" },
        { label: "Abril", value: "4" },
        { label: "Mayo", value: "5" },
        { label: "Junio", value: "6" },
        { label: "Julio", value: "7" },
        { label: "Agosto", value: "8" },
        { label: "Septiembre", value: "9" },
        { label: "Octubre", value: "10" },
        { label: "Noviembre", value: "11" },
        { label: "Diciembre", value: "12" }
      ],

      columns: [
        { name: "id", align: "left", label: "ID de Orden", field: "id",format: val => this.cutcat(val), },
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
          name: "estatus",
          label: "Estatus",
          field: "status",
          format: val => val.toUpperCase(),
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
          label: "Fecha y Hora de Pedido",
          field: row => row.created,
          format: val => this.convert(val),
          sortable: true
        },
        {
          name: "sended",
          label: "Fecha y Hora de Envío",
          field: row => row.sended,
          format: val => this.convert(val),
          sortable: true
        },
        { name: "rating", label: "Calificacion", field: "rating", sortable: true },
      ]
    };
  },
  created: function() {
    var TodayDate = new Date();
    var y = TodayDate.getFullYear();
    var m = TodayDate.getMonth() + 1 + "";

    this.year = y;
    this.month = m;

    //this.loadOrders()
  },
  methods: {
    loadOrders() {
      var uid = firebase.auth().currentUser.uid;
      let self = this;

      var start = new Date(this.year, this.month - 1, 1);
      var end = new Date(this.year, this.month, 0);
      end.setHours(23, 59, 59);

      console.log(start,end)

       var db = firebase.firestore();
      this.orders=[]
      db.collection("orders_" + uid)
        .orderBy("created", "desc")
        .where("created", ">=", start)
        .where("created", "<=", end)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var temp = doc.data();
            temp.id = doc.id;

            self.orders.push(temp);
          });
        });
    },
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.orders.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'orders_export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'El navegador denegó la descarga...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    cutcat(val) {
      return val.substr(val.length - 6);
    },
    convert(val) {
      if(val!=null){
          var curdate = new Date(null);
      curdate.setTime(val.seconds * 1000);
      return curdate.toLocaleString();
      }
      else{
        return ''
      }
      
    }
  },
  watch: {
    month() {
      this.loadOrders()
    },
    year(){
      this.loadOrders()
    }
  }
};
</script>