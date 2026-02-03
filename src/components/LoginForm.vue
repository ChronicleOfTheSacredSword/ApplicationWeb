<template>
    <section class="login-form">
        <header class="title">
            <h3>{{ isNewUser ? "Sign In" : "Log In" }}</h3>
        </header>

        <form @submit.prevent="submit" class="forms">
            <div class="form-group">
                <label for="username">Username</label>
                <input id="username" type="text" v-model.trim="userName" required />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    v-model.trim="password"
                    :class="{ invalid: isNewUser && password && !isPasswordValid }"
                    required
                />
            </div>

            <div v-if="isNewUser" class="form-group">
                <label for="passwordConfirm">Confirm Password</label>
                <input
                    id="passwordConfirm"
                    type="password"
                    v-model.trim="passwordConfirmed"
                    :class="{ invalid: passwordConfirmed && passwordConfirmed !== password }"
                    required
                />
            </div>

            <p class="small-text">
                <span v-if="isNewUser">
                    Already have an account?
                    <button type="button" @click="toggleMode">Log in</button>
                </span>
                <span v-else>
                    Don’t have an account?
                    <button type="button" @click="toggleMode">Create one</button>
                </span>
            </p>

            <button
                type="submit"
                class="submit"
                :disabled="isNewUser && !isPasswordValid"
            >
                {{ isNewUser ? "Create account" : "Log in" }}
            </button>
        </form>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter();

const isNewUser = ref(false);
const userName = ref("");
const password = ref("");
const passwordConfirmed = ref("");

function toggleMode() {
    isNewUser.value = !isNewUser.value
    password.value = ""
    passwordConfirmed.value = ""
}

function submit() {
    if (isNewUser.value) {
        if (!isPasswordValid.value) return
        createUser()
    } else {
        loginUser()
    }
}

function createUser() {
    console.log("Creating user:", userName.value)
    // TODO: API call to create user
    isNewUser.value = false
}

function loginUser() {
    console.log("Logging in:", userName.value)
    
    // TODO: API call to log in user
    router.push("/hero")
}

const isPasswordValid = computed(() => {
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password.value)
    const hasLowercase = /[a-z]/.test(password.value)
    const hasNumber = /\d/.test(password.value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>/]/.test(password.value)
    const sameAsConfirm = password.value === passwordConfirmed.value
    return password.value.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && sameAsConfirm
})
</script>

<style scoped>
.login-form {
    width: 400px;
    margin: auto;
    padding: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fafafa;
}

.title {
    text-align: center;
    margin-bottom: 1rem;
}

.forms {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

input.invalid {
    border-color: red;
}

.small-text {
    font-size: 0.9rem;
}

.small-text button {
    background: none;
    border: none;
    color: blue;
    cursor: pointer;
    padding: 0;
    font-size: 0.9rem;
}

.submit {
    padding: 0.6rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: #2d8cf0;
    color: white;
    cursor: pointer;
}

.submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
