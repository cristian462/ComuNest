<template>
	<div class="container-md mt-3">
    <div class="header p-5 pb-4 border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2 mb-4">Crear una nueva casa</h1>
    </div>
    <div class="body p-5 pt-0">
		<div class="input-group">
                <span class="input-group-text">@</span>
                <div class="form-floating">
                    <input type="text" class="form-control" :class="nombremal" placeholder="Nombre" v-model="user.nombre" required>
                    <label for="nombre">Nombre*</label>
                </div>
            </div>

            <div class="mb-5 text-danger mx-5">{{ nombrevacio }}</div>

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

            <button class="w-100 my-2 btn btn-lg rounded-3 btn-primary" @click="submit">Crear casa</button>
    </div>
</div>
</template>

<script setup>
</script>