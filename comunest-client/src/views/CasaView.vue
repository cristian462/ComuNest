<template>
	<div class="container d-flex flex-wrap gap-5 px-5 mt-5 flex-column">
    <h1 class="d-flex justify-content-center" style="font-size: 2.9rem">{{nombre_casa}}</h1>
    <div><router-link :to="{name: 'mesNuevo', params:{id: id_casa.id_casa}}"><button class="btn btn-primary">+</button></router-link></div>

    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-4" v-for="mes in meses" :key="mes.id_mes">
                <div class="card">
                  <router-link :to="{name: 'gastos', params: {id_mes: mes.id_mes, nombre: mes.nombre, resuelto: mes.resuelto, id_casa: id_casa.id_casa}}">
                    <div class="card-body">
                        <h5 class="card-title">{{ mes.nombre }}</h5>
                        <p class="card-text">Total: {{ mes.total }}€</p>
                        <p class="card-status text-danger" v-if="!mes.resuelto">No Resuelto</p>
                        <p class="card-status text-success" v-else>Resuelto</p>
                    </div>
                  </router-link>
                </div>
            </div>
      </div>
    </div>
    <h4 class="atras" @click="volverAtras()">&lt;&lt; Volver</h4>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';



const route = useRoute();
  const id = ref();
  id.value = route.params.id;

	let id_casa ={
    id_casa: route.params.id
  };

const router = useRouter();

  const volverAtras = ()=>{
    router.go(-1);
  }

  const nombre_casa = ref('');
  nombre_casa.value = route.params.nombre;

  const meses = ref([]);

onMounted(async()=>{
	try {
    const response = await fetch("http://localhost:4000/casa", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id_casa)
    });
	const fetchedMeses = await response.json();
  meses.value = fetchedMeses;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style scoped>
  .atras{
    cursor: pointer;
    color: blue;
  }

 .card{
    transition: transform 0.3s ease;
  }

  a{
    text-decoration: none !important;
    color: black !important;
  }
  .card:hover{
    cursor: pointer;
    transform: scale(1.03);
  }

  /* @media(width<652px){
    .card{
      min-width: 200px;
    }
    .contenedor-cards{
      flex-direction: column !important;
    }
  } */
</style>