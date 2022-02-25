<script setup lang="ts">
const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
let emailErrorMessage = ref("")
let passwordErrorMessage = ref("")
const password = ref("")

const onEmailUpdate = (value: string) => {
    isEmailUntouched.value = false
    console.log("### onEmailUpdate", value)
    email.value = value
}
const onPasswordUpdate = (value: string) => {
    isPasswordUntouched.value = false
    console.log("### onPasswordUpdate", value)
    password.value = value
}
const isMailValid = computed(() => {
    if (isEmailUntouched.value) {
        return true
    }

    console.log("### ismailvalid?", email.value);

    if (!email.value.includes("@")) {
        emailErrorMessage.value = "Le courriel doit contenir @"
        return false
    }

    emailErrorMessage.value = ""
    console.log('### is valid')

    return true
})
const isPasswordValid = computed(() => {
    if (isPasswordUntouched.value) {
        return true
    }

    console.log("### isPasswordValid?", password.value);

    if (!password.value.length) {
        passwordErrorMessage.value = "Le mot de passe ne peut pas être vide"
        return false
    }

    passwordErrorMessage.value = ""
    console.log('### is valid')

    return true
})
const submit = () => {
    console.log("### submit")
}
</script>

<template>
    <div class="is-flex flex-center">
        <div class="sm-container">
            <h1>Connexion</h1>
            <DsfrInputGroup
                :error-message="emailErrorMessage"
                :is-invalid="!isMailValid"
                :model-value="email"
                label="courriel"
                :labelVisible="true"
                placeholder="jean@fournisseur.fr"
                @update:modelValue="onEmailUpdate"
            />
            <DsfrInput
                :error-message="passwordErrorMessage"
                :is-invalid="!isPasswordValid"
                :model-value="password"
                label="mot de passe"
                :labelVisible="true"
                placeholder="******"
                type="password"
                @update:modelValue="onPasswordUpdate"
            />
            <DsfrButton @click="submit" label="Connexion" class="fr-my-2w" />
        </div>
    </div>
</template>
