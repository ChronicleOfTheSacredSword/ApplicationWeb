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
            <p v-if="errorMessage" class="error-message">
                {{ errorMessage }}
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
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore();
const router = useRouter();

const isNewUser = ref(false);
const userName = ref("");
const password = ref("");
const passwordConfirmed = ref("");
const errorMessage = ref("");

function toggleMode() {
    isNewUser.value = !isNewUser.value
    password.value = ""
    passwordConfirmed.value = ""
    errorMessage.value = ""
}

async function submit() {
    errorMessage.value = ""

    const user = {
        name: userName.value,
        password: password.value
    }

    try {
        if (isNewUser.value) {
            if (!isPasswordValid.value) return
            await createUser(user)
        } else {
            await loginUser(user)
        }
    } catch (err: any) {
        errorMessage.value = err.message || "Something went wrong"
    } finally {
        password.value = ""
        passwordConfirmed.value = ""
        userName.value = ""
    }
}

async function createUser(user: any) {
    try{
        console.log("Creating user:", user)

        const newUserResponse = await fetch("http://localhost:5000/user",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        })

        const newUser = await newUserResponse.json();

        console.log("newUser", newUser);
        authStore.setUser(newUser);

        isNewUser.value = false
    } catch(error) {
        throw new Error("Failed to create account")
    }
}

async function loginUser(user: any) {
    try{
        console.log("Login user:", user)

        const tokenResponse = await fetch("http://localhost:5001/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        })

        const token = await tokenResponse.json();

        console.log("token", token);
        authStore.setAccessToken(token.accessToken);
        authStore.setRefreshToken(token.refreshToken);

        await router.push("/hero");
    } catch(error) {
        throw new Error("Failed to authentificate your account")
    }
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

.error-message {
    color: #d93025;
    background: #fdecea;
    border: 1px solid #f5c2c0;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

</style>
