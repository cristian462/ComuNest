<template>
  <div class="container-md mt-5">
    <div class="header p-5 pb-4 border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2 mb-4">Registrarse gratuitamente</h1>
    </div>
    <div class="body p-5 pt-0">
            <label for=""></label>
            <div class="container d-flex justify-content-end my-2">
            </div>
            <div class="input-group">
                <span class="input-group-text">@</span>
                <div class="form-floating">
                    <input type="text" class="form-control" placeholder="Nombre" v-model="user.nombre" required>
                    <label for="nombre">Nombre*</label>
                </div>
            </div>

            <div class="mb-5 text-danger mx-5">{{ nombrevacio }}</div>

            <div class="form-floating">
                <input type="email" class="form-control rounded-3" placeholder="name@example.com" v-model="user.correo" :class="correomal" required/>
                <label for="mail">Correo Electrónico*</label>
            </div>

            <div id="mailMal" class="mb-5 text-danger">{{ msjcorreo }}</div>

            <div class="form-floating">
                <input type="password" class="form-control rounded-3" :class="pass1mal" placeholder="Password" v-model="user.pass1" required/>
                <label for="pass">Contraseña*</label>
            </div>
            <div class="mb-4 mx-5-md mx-5-lg">
                <span class="text-secondary">La contraseña debe contener: 1 Mayúscula, 1
                    minúscula, 1 número, 1 carácter. Entre 8 y 16 caracteres</span>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control rounded-3" :class="pass2mal" placeholder="Password" v-model="user.pass2" required/>
                <label for="pass2">Repita Contraseña*</label>
            </div>

            <div id="pass2Mal" class="mb-5 text-danger">{{ msjpass2 }}</div>

            <label class="mb-2" for="terminos"><input type="checkbox" value="1" v-model="user.condiciones" /> <small
                    class="text-body-secondary">Registrándote aceptas los términos y condiciones.*</small></label>
            <button class="w-100 my-2 btn btn-lg rounded-3 btn-primary" @click="submit">Registrarse</button>
    </div>
</div>
</template>

<script setup>
import {ref, watch} from "vue";

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@()/_-])[a-zA-Z\d@()/_-]{8,16}$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let user = ref({
    nombre: '',
    correo: '',
    pass1: '',
    pass2: '',
    condiciones:false
  });

  let msjpass2 = ref('');
  let pass1mal = ref('');
  let pass2mal = ref('');
  let nombrevacio = ref('');
  let correomal = ref('');
  let msjcorreo = ref('');

    watch(() => user.value.pass1, (newValue) => {
    if (!regex.test(newValue)) {
        pass1mal.value = "is-invalid";
    } else {
        pass1mal.value = "is-valid";
    }
    });

    watch(() => user.value.correo, (newValue) => {
    if (!regexEmail.test(newValue)) {
        correomal.value = "is-invalid";
        msjcorreo.value = "Este correo no existe.";
    } else {
        correomal.value = "is-valid";
        msjcorreo.value = '';
    }
    });

    watch(() => user.value.pass2, (newValue) => {
    if (newValue!== user.value.pass1) {
        pass2mal.value = "is-invalid";
        msjpass2.value = "Las contraseñas no coinciden.";
    } else {
        pass2mal.value = "is-valid";
        msjpass2.value = '';
    }
    });

    watch(() => user.value.nombre, (newValue) => {
    if (!newValue) {
      nombrevacio.value = "El nombre no puede quedar vacío."
    }
    });

  const submit = ()=>{
    if(user.value.condiciones == false){
      alert("Debes aceptar los términos y condiciones de uso");
      return false;
    }
    if(pass1mal.value == "is-invalid"){
      return false;
    }
    if(pass2mal.value == "is-invalid"){
      return false;
    }
    if(nombrevacio.value != ''){
      return false;
    }
    if(correomal.value == "is-invalid"){
      return false;
    }

    fetch("localhost:4000")
  }

   

</script>

<style scoped>
</style>
