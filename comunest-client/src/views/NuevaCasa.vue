<template>
	<div class="container-md mt-3">
    <div class="header p-5 pb-4 border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2 mb-4">Crear una nueva casa</h1>
    </div>
    <div class="body p-5 pt-0">
		<div class="input-group">
                <div class="form-floating">
                    <input type="text" class="form-control" :class="nombremal" placeholder="Nombre" v-model="casa.nombre" required>
                    <label for="nombre">Nombre de la Casa</label>
                </div>
            </div>

            <div class="mb-5 text-danger mx-5">{{ nombrevacio }}</div>

            <div class="form-floating">
                <input type="password" class="form-control rounded-3" :class="pass1mal" placeholder="Password" v-model="casa.pass1" required/>
                <label for="pass">Contraseña</label>
            </div>
            <div class="mb-4 mx-5-md mx-5-lg">
                <span class="text-secondary">La contraseña debe contener: 1 Mayúscula, 1
                    minúscula, 1 número, 1 carácter. Entre 8 y 16 caracteres</span>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control rounded-3" :class="pass2mal" placeholder="Password" v-model="casa.pass2" required/>
                <label for="pass2">Repita Contraseña</label>
            </div>

            <div id="pass2Mal" class="mb-5 text-danger">{{ msjpass2 }}</div>

            <button class="w-100 my-2 btn btn-lg rounded-3 btn-primary" @click="submit">Crear casa</button>
    </div>
    <h4 class="atras" @click="volverAtras()">&lt;&lt; Volver</h4>
</div>
</template>

<script setup>
import {ref, watch} from "vue";
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@()/_-])[a-zA-Z\d@()/_-]{8,16}$/;
const store = useStore();
const router = useRouter();

let casa = ref({
    id_user: store.state.user.id,
    nombre: '',
    pass1: '',
    pass2: ''
});


let msjpass2 = ref("");
let pass1mal = ref("");
let pass2mal = ref("");
let nombrevacio = ref("");
let nombremal = ref("");

const volverAtras = ()=>{
    router.go(-1);
  }

watch(() => casa.value.pass1, (newValue) => {
    if (!regex.test(newValue)) {
        pass1mal.value = "is-invalid";
    } else {
        pass1mal.value = "is-valid";
    }
    });

watch(() => casa.value.pass2, (newValue) => {
if (newValue!== casa.value.pass1) {
    pass2mal.value = "is-invalid";
    msjpass2.value = "Las contraseñas no coinciden.";
} else {
    pass2mal.value = "is-valid";
    msjpass2.value = '';
}
});

watch(() => casa.value.nombre, async(newValue) => {
if (!newValue) {
  nombrevacio.value = "El nombre no puede quedar vacío.";
  nombremal.value = "is-invalid";
}else{
    let data = {
        nombre: newValue
    };
    const request = await fetch('http://localhost:4000/compruebaCasa',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
    });
    const respuesta = await request.json();
    console.log(respuesta);
    if(respuesta.existe === 0){
        nombrevacio.value = "";
        nombremal.value = "is-valid";
    }else{
        nombrevacio.value = "El nombre ya existe";
        nombremal.value = "is-invalid";
    }
  
}
});


const submit = async ()=>{
    if(pass1mal.value == "is-invalid"){
      return false;
    }
    if(pass2mal.value == "is-invalid"){
      return false;
    }
    if(nombrevacio.value != ''){
      return false;
    }

    try{
      const jsonData = {
        "id_user": casa.value.id_user, 
        "nombre": casa.value.nombre, 
        "pass": casa.value.pass1
      };
       const formData = new FormData();
       
       formData.append('datos',JSON.stringify(jsonData));

      const response = await fetch('http://localhost:4000/nuevaCasa',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });

      if(!response.ok){
        throw new Error('Error al enviar la solicitud');
      }else{
            const date = new Date();
			const nombreMesmin = date.toLocaleString('default', { month: 'long' });
			const nombreMes = nombreMesmin.charAt(0).toUpperCase() + nombreMesmin.slice(1);
            const respuesta = await response.json();
            let data = {
				id_casa: respuesta.id_casa,
				nombre: nombreMes,
				id_user: store.state.user.id
			}
            console.log(data.id_casa);
			const createMonth = await fetch("http://localhost:4000/nuevoMes", {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			console.log(createMonth);
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