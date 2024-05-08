<template>
  <div>
  <header class="p-3 text-bg-dark" v-if="id_user===0">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link class="nav-link px-4 text-white" to="/">Home</router-link></li>
          <li><router-link class="nav-link px-4 text-white" to="/registro">Crear una Casa</router-link></li>
          <li><router-link class="nav-link px-4 text-white" to="/aboutus">Sobre nosotros</router-link></li>
        </ul>
        <div class="text-end">
          <router-link type="button" class="btn btn-warning me-2" to="/login">Iniciar Sesión</router-link>
          <router-link class="btn btn-warning" to="/registro">Registrarse</router-link>
        </div>
      </div>
    </div>
  </header>
  <header class="p-3 text-bg-dark" v-else>
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="#" class="profile-picture" data-bs-toggle="dropdown" aria-expanded="true">
          <span class="initials">{{ iniciales }}</span>
        </a>
          <ul class="dropdown-menu text-small" style="position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(0px, -33.6px, 0px);" data-popper-placement="top-start">
            <li><a class="dropdown-item" @click="cerrarSesion">Cerrar Sesión</a></li>
          </ul>
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 mx-5">
          <li><router-link class="nav-link px-4 text-white" to="/">Home</router-link></li>
          <li><router-link class="nav-link px-4 text-white" to="/casaNueva">Crear Casa</router-link></li>
          <li><router-link class="nav-link px-4 text-white" to="/aboutUs">Sobre Nosotros</router-link></li>
        </ul>
        <div class="text-end">
          <input class="form-control" type="search" placeholder="Buscar Casa" aria-label="Search" v-model="search">
        </div>
      </div>
    </div>
  </header>
  <router-view v-if="search === ''"/>

  <div v-if="(search !== '' && casas.length !== 0)">
    <ul class="cards container d-flex align-items-center flex-column gap-5 mt-5 mt-5">
      <div v-for="casa in casas" :key="casa.id_casa">
        <router-link @click="search=''" :to="{name:'casaLogin',params:{id:casa.id_casa, nombre: casa.nombre}}"><li class="elemento py-2 px-4" >{{ casa.nombre }}</li></router-link>
      </div>
    </ul>
  </div>

  <div class="body" v-if="(search !== '' && casas.length === 0)">
    <h1 class="h1">{{ search }} no existe</h1>
  </div>


</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, watch, onMounted } from 'vue';

const id_user = ref(localStorage.getItem('userId') == null ? 0 : localStorage.getItem('userId'));

const router = useRouter();
const cerrarSesion = ()=>{
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  router.go(0);
}

let casas_usuario = [];
let search = ref('');
let casas = ref([]);
let iniciales = ref('')

watch(()=>search.value, async (newValue)=>{
  try {
    if(newValue !== ''){
        let data = {
          nombre: newValue
        };
        const response = await fetch("http://localhost:4000/searchCasas", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const fetchedCasas = await response.json();

        let idCasas = casas_usuario.map(obj =>obj.id_casa);

        casas.value = fetchedCasas.filter(obj => !idCasas.includes(obj.id_casa));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

watch(()=>localStorage.getItem('userId'), (newValue)=>{
  if(newValue !== null){
    router.go(0);
  }
})

onMounted(async()=>{
  if(localStorage.getItem('userId')!==null){
    try {
    let data = {
      id_user: id_user
    };

    let nombre = localStorage.getItem('userName');
    iniciales.value = nombre.substring(0, 2);

    

    const response = await fetch("http://localhost:4000/listaCasas", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const fetchedCasas = await response.json();
    casas_usuario = fetchedCasas;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});


</script>

<style lang="scss" scoped>
.profile-picture {
  width: 50px;
  height: 50px;
  background-color: #0f0; 
  border-radius: 50%; 
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff; 
  font-size: 23px; 
  font-weight: bold; 
  text-transform: uppercase; 
  text-align: center; 
}



.cards{
  list-style-type: none;
  padding: 0;
}

.elemento{
  list-style-type: none;
  font-size: 3rem;
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 12px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  text-align: center;
  margin-bottom: 1rem; 
  height: 9rem; 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27rem;
  transition: all 0.3s ease;
}

.elemento:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.body{
	color-scheme: auto;
	margin: 0;
	display:flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	min-height: 100vh;
	font-family: sans-serif;
}

.h1{
	font-size: 5rem;
	margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

a{
  cursor: pointer;
}
</style>
