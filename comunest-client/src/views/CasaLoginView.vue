<template>
	<div class="ficha">
  <h2>Ingresa a la casa {{ casa_nombre }}</h2>
    <div class="input-container">
      <label class="pb-2" for="password">Contraseña:</label>
      <input type="password" :class="mal" v-model="pass" id="password" placeholder="Ingresa la contraseña...">
    </div>
	
	<button type="submit" @click="submit">Enviar</button>
    <div class="integrantes">
      <h3>Integrantes:</h3>
      <ul>
        <li>Nombre 1</li>
        <li>Nombre 2</li>
        <li>Nombre 3</li>
      </ul>
    </div>
</div>


</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref } from 'vue';
	
	const route = useRoute();
	const router = useRouter();
	const store = useStore();

	let mal=ref('');
	let pass = ref('');

	let casa_nombre = ref(route.params.nombre);

	const submit = async()=>{
		try{
			let data = {
				id_user: store.state.user.id,
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
			if(respuesta.exito === 0){
				mal = 'is-invalid';
			}else{
				router.push('/');
			}
		}catch(err){
			console.error("Error fetching data:", err);
		}
		

	}

</script>


<style scoped>

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