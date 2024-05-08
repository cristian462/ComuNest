<template>
	<div class="container ml-5">
	<div class="ficha">
  <h2>Ingresa a la casa {{ casa_nombre }}</h2>
    <div class="input-container">
      <label class="pb-2" for="password">Contraseña:</label>
      <input type="password" id="password" v-model="pass" class="form-control " :class="mal">
    </div>
	
	<button type="submit" @click="submit">Enviar</button>
    <div class="integrantes">
      <h3>Integrantes:</h3>
      <ul>
        <li v-for="integrante in integrantes" :key="integrante.nombre">{{ integrante.nombre }}</li>
      </ul>
    </div>
</div>
<h4 class="atras mb-5 ml-5 pl-5 pb-5" @click="volverAtras()">&lt;&lt; Volver</h4>
</div>


</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
	
	const route = useRoute();
	const router = useRouter();
	const integrantes = ref([]);

	let mal=ref();
	let pass = ref('');

	const volverAtras = ()=>{
    router.go(-1);
	}

	let casa_nombre = ref(route.params.nombre);

	const submit = async()=>{
		try{
			let data = {
				id_user: localStorage.getItem('userId'),
				id_casa: route.params.id,
				pass: pass.value
			};
			const response = await fetch('http://localhost:4000/casaLogin',{
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const respuesta = await response.json();

			console.log(respuesta);
			if(respuesta.exito === 1){
				router.push('/');
			}else{
				mal = 'is-invalid';
			}
		}catch(err){
			mal = 'is-invalid';
		}
	};

	

	onMounted(async()=>{
		try{
			let data = {
			id_casa: route.params.id
			};
			const response = await fetch('http://localhost:4000/compruebaUsers',{
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			integrantes.value = await response.json();
		}catch(err){
			mal = 'is-invalid';
		}
	});
		

</script>


<style scoped>
.atras{
    cursor: pointer;
    color: blue;
  }
.ficha {
  display: flex;
  flex-direction: column;
  width: 700px;
  margin: 50px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 80px;
}

.input-container {
  margin-bottom: 40px;
}

label {
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.integrantes {
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 5px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 100px;
}

button:hover {
  background-color: #0056b3;
}


</style>