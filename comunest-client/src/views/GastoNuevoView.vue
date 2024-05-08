<template>
	<div class="mx-3">
	<div class="container d-flex flex-column gap-4 mt-3 px-5">
  <h1 class="mt-5 mb-4">Añadir Gasto</h1>
    <div>
      <label for="nombre" class="form-label">Nombre:</label>
      <input type="text" class="form-control" id="nombre" v-model="form.nombre" :class="form_invalid.nombre" required>
    </div>
	<div class="mb-3 text-danger mx-5">{{ mensaje_mal.nombre }}</div>
    <div class="mb-3">
      <label for="descripcion" class="form-label">Descripción:</label>
      <textarea class="form-control" id="descripcion" v-model="form.desc"></textarea>
    </div>
    <div>
      <label for="importe" class="form-label">Importe:</label>
      <input type="number" class="form-control" id="importe" min="0.00" step="0.10" v-model="form.importe" :class="form_invalid.importe" required>
    </div>
	<div class="mb-3 text-danger mx-5">{{ mensaje_mal.importe }}</div>
    <button type="submit" @click="submit" class="btn btn-primary">Añadir Gasto</button>
	</div>
	<h4 class="atras my-5 mx-5 " @click="volverAtras()">&lt;&lt; Volver</h4>
	</div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const router = useRouter();
const volverAtras = ()=>{
    router.go(-1);
	};

let form = ref({
	nombre: '',
	desc: '',
	importe: 0
});

let form_invalid = ref({
	nombre: '',
	importe: ''
});

let mensaje_mal = ref({
	nombre: '',
	importe: ''
});

watch(()=>form.value.nombre,(newValue)=>{
	if(newValue === ''){
		form_invalid.value.nombre = 'is-invalid';
		mensaje_mal.value.nombre = 'El nombre del gasto no puede quedar vacío.';
	}else{
		form_invalid.value.nombre = '';
		mensaje_mal.value.nombre = '';
	}
});

watch(()=>form.value.importe,(newValue)=>{
	if(newValue === 0 || newValue === null){
		form_invalid.value.importe = 'is-invalid';
		mensaje_mal.value.importe = 'El importe no puede ser 0.';
	}else{
		if(!isNaN(newValue)){
			form_invalid.value.importe = 'is-invalid';
			mensaje_mal.value.importe = 'El valor de importe debe ser numerico';
		}else{
			form_invalid.value.importe = '';
			mensaje_mal.value.importe = '';
		}
		
	}
});

const submit = async()=>{
	if(form.value.nombre === ''){
		form_invalid.value.nombre = 'is-invalid';
		mensaje_mal.value.nombre = 'El nombre del gasto no puede quedar vacío.';
		return false;
	}
	if(form.value.importe === 0 || form.value.importe === null){
		form_invalid.value.importe = 'is-invalid';
		mensaje_mal.value.importe = 'El nombre del gasto no puede quedar vacío.';
		return false;
	}
	if(!isNaN(form.value.importe)){
		form_invalid.value.importe = 'is-invalid';
		mensaje_mal.value.importe = 'El valor de importe debe ser numerico';
	}

	let data = {
		nombre: form.value.nombre,
		descripcion : form.value.desc,
		importe: form.value.importe,
		id_user: store.state.user.id,
		id_casa: route.params.id_casa,
		id_mes: route.params.id_mes
	};

	console.log(data);
	try{
		const response = await fetch('http://localhost:4000/gastoNuevo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

		const respuesta = await response.json();

		if(respuesta.exito === 1){
			router.go(-1);
		}
	}catch(err){
      console.log(err);
    }
	
}


</script>

<style scoped>
.atras{
    cursor: pointer;
    color: blue;
  }
</style>