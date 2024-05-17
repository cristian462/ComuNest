<template>
	<div class="mt-4 mx-5">
		<div class="d-flex justify-content-end " v-if="resuelto == 0"><button class="btn btn-success" @click="resolver">Resolver</button></div>
		<h1 class="d-flex justify-content-center">Gastos de {{ nombre_mes }}</h1>
		<h3 class="text-success d-flex justify-content-center mb-3" v-if="resuelto == 1">Resuelto</h3>
		<h3 class="text-danger d-flex justify-content-center mb-3" v-if="resuelto == 0">No Resuelto</h3>
		<div class="mb-4 mx-5" v-if="resuelto == 0"><router-link class="mx-5" :to="{name: 'gastoNuevo', params:{id_mes: id_mes, id_casa: id_casa}}"><button class="btn btn-primary">+</button></router-link></div>
		<div class="container">
  <table class="styled-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Importe</th>
        <th>Usuario</th>
        <th v-if="resuelto == 0"></th>
      </tr>
    </thead>
	<tbody>
      <tr v-for="gasto in gastos" :key="gasto.id_gasto">   
        <td>{{ gasto.nombre }}</td>
        <td>{{ gasto.descripcion }}</td>
        <td>{{ gasto.importe }}€</td>
        <td>{{ gasto.nombre_user }}</td>
        <td v-if="resuelto == 0"><button @click="deleteRow(gasto.id_gasto)" class="delete-btn">X</button></td>
      </tr>
	</tbody>
  </table>
</div>
<h4 class="atras my-5 mx-5" @click="volverAtras()">&lt;&lt; Volver</h4>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute,useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const gastos = ref([]);
const id_mes = route.params.id_mes;
const nombre_mes = ref(route.params.nombre);
const resuelto = ref(route.params.resuelto);
const id_casa = route.params.id_casa;

const volverAtras = ()=>{
    router.go(-1);
	}

const resolver = async()=>{
	let data = {
		id_mes: id_mes
	}
	const response = await fetch('http://localhost:4000/resolver', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
	const respuesta = await response.json();
	if(respuesta.resuelto == 1){
		resuelto.value = 1;
		router.go(-1);
	}
};

const deleteRow = async(id)=>{
  let data = {
    id: id
  };
  console.log(data);
  const response = await fetch('http://localhost:4000/borrarGasto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
  });

  const respuesta = await response.json();
  if(respuesta.exito === 1){
    router.go(0);
  }


}

onMounted(async()=>{
	let data = {
		id_mes: id_mes
	};

	const response = await fetch('http://localhost:4000/gastos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
	const fetchedGastos = await response.json();
	gastos.value = fetchedGastos.filter(objeto => objeto.importe !== 0);
});

</script>

<style scoped>
.container {
  margin: 20px auto;
  max-width: 800px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.styled-table th, .styled-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.styled-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.styled-table tbody tr:hover {
  background-color: #f2f2f2;
}

.delete-btn {
  padding: 8px 12px;
  background-color: #ff5f5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #e74c3c;
}

.atras{
    cursor: pointer;
    color: blue;
  }

@media(width<375px){
  .container {
  margin: 20px auto;
  max-width: 800px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.styled-table th, .styled-table td {
  padding: 12px 8px; /* Se reduce el padding horizontal para dispositivos móviles */
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.styled-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.styled-table tbody tr:hover {
  background-color: #f2f2f2;
}

.delete-btn {
  padding: 8px; /* Se reduce el padding para dispositivos móviles */
  background-color: #ff5f5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #e74c3c;
}

.atras{
    cursor: pointer;
    color: blue;
    text-align: center; /* Se centra el texto para dispositivos móviles */
    margin-top: 20px; /* Se añade un espacio en la parte superior para dispositivos móviles */
  }

/* Se reduce el tamaño del texto para dispositivos móviles */
.h1 {
  font-size: 24px;
}

.text-success, .text-danger {
  font-size: 18px;
}

/* Se reduce el tamaño del botón "Resolver" para dispositivos móviles */
.btn-success {
  font-size: 14px;
  padding: 6px 12px;
}

/* Se reduce el tamaño del botón "+" para dispositivos móviles */
.btn-primary {
  font-size: 14px;
  padding: 6px 12px;
}

/* Se reduce el tamaño de las celdas de la tabla para dispositivos móviles */
.styled-table th, .styled-table td {
  font-size: 14px;
}

/* Se añade un margen inferior a los botones de acción para dispositivos móviles */
td:last-child {
  margin-bottom: 10px;
}

/* Se ajusta el tamaño del botón de eliminar para dispositivos móviles */
.delete-btn {
  font-size: 12px;
  padding: 6px 8px;
}

/* Se añade un espacio entre los botones de acción para dispositivos móviles */
.delete-btn + .delete-btn {
  margin-left: 5px;
}


}
</style>