<template>
  <div class="container d-flex flex-wrap gap-5 px-5 mt-5 flex-column">
    <h1 class="d-flex justify-content-center my-3 pb-5" style="font-size: 2.9rem" v-if="data.id_user !== 0">Casas a las que perteneces</h1>
    <div class="d-flex flex-column align-items-center justify-content-center mx-5 my-5 " v-else>
      <h1>Aún no te has registrado en nuestra página</h1>
      <h2>Puedes hacerlo <router-link to="/registro"> <rl class="link"> aquí </rl></router-link> </h2>
    </div>
    <div class="container">
      <div class="row">
            <div class="col-md-4 mb-4" v-for="casa in casas" :key="casa.id_casa">
                <div class="card">
                  <router-link :to="{name: 'casa', params: {id: casa.id_casa, nombre: casa.casa}}">
                    <div class="card-body">
                        <h5 class="card-title">{{ casa.casa }}</h5>
                        <p class="card-text">Mes: {{casa.nombre}}</p>
                        <p class="card-text">Cantidad: {{casa.total}}€</p>
                        <p class="card-status text-danger" v-if="!casa.resuelto">No resuelto</p>
                        <p class="card-status text-success" v-else>Resuelto</p>
                    </div>
                  </router-link>
                </div>
            </div>
          </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const data = {
  id_user: localStorage.getItem('userId') == null ? 0 : localStorage.getItem('userId')
};


const casas = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:4000/listaCasas", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const fetchedCasas = await response.json();
    casas.value = fetchedCasas;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style scopded>
  
  .link{
    color: blue;
    text-decoration-line: underline;
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

  @media(width<720px){
    .card{
      min-width: 200px;
    }
    .contenedor-cards{
      flex-direction: column !important;
    }
    .container{
      height: auto;
      min-height: 500px;
    }
  }
</style>
