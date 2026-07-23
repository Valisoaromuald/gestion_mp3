<script lang="ts" setup>
import {  useUtilisateur } from '@/composables/login/useUtilisateur';
import { ref } from 'vue';

const { errorMessage, isLoginLoading, loginForm, authentifier } = useUtilisateur()
const showPassword = ref(false)

function togglePasswordVisibility() {
    showPassword.value = !showPassword.value
}
</script>

<template>
    <div class="login-view container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div class="login-card shadow p-4 p-md-5 w-100 mx-auto" style="max-width: 450px;">
            <div class="card-body">

                <h2 class="h3 fw-bold text-center mb-4 login-title">
                    <i class="bi bi-apple-music"></i>Melofy
                </h2>

                <form @submit.prevent="authentifier">
                    <!-- LOGIN -->
                    <div class="mb-3">
                        <label for="login" class="form-label fw-medium login-label">
                            Login
                        </label>
                        <input id="login" type="text" class="form-control login-input" v-model="loginForm.login"
                            placeholder="ex. jeandupont" />
                    </div>

                    <!-- PASSWORD -->
                    <div class="mb-4">
                        <label for="password" class="form-label fw-medium login-label">
                            Mot de passe
                        </label>
                        <div class="password-wrapper">
                            <input
                                id="password"
                                :type="showPassword ? 'text' : 'password'"
                                class="form-control login-input password-input"
                                v-model="loginForm.motDePasse"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                class="password-toggle"
                                @click="togglePasswordVisibility"
                                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                            >
                                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit" class="btn w-100 login-btn" :disabled="isLoginLoading">
                       {{ !isLoginLoading ? " Se connecter" : "Connexion..." }}
                    </button>
                </form>

            </div>
        </div>

        <div v-show="errorMessage.length !== 0" class="alert login-alert mt-4 mx-auto" style="max-width: 450px;">
            {{ errorMessage }}
        </div>
    </div>
</template>

<style scoped>
.login-view {
    background-color: var(--body-color);
}

.login-card {
    background-color: var(--surface-color);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
}

.login-title {
    color: var(--text-color);
}

.login-label {
    color: var(--text-secondary);
}

.login-input {
    background-color: var(--bg-gray);
    border: 1px solid var(--border-subtle);
    color: var(--text-color);
}

.login-input::placeholder {
    color: var(--text-tertiary);
}

.login-input:focus {
    background-color: var(--bg-gray);
    border-color: var(--primary-color);
    color: var(--text-color);
    box-shadow: 0 0 0 3px rgba(53, 178, 224, 0.2);
}

/* --- Toggle mot de passe --- */
.password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.password-input {
    padding-right: 2.75rem; /* laisse la place à l'icône */
}

.password-toggle {
    position: absolute;
    right: 0.75rem;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    transition: color 0.15s ease;
}

.password-toggle:hover {
    color: var(--primary-color);
}

.password-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
}

.login-btn {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--body-color);
    font-weight: 600;
    transition: opacity 0.2s ease;
}

.login-btn:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    opacity: 0.85;
    color: var(--body-color);
}
.login-btn:disabled{
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    opacity: 0.60;
    color: var(--body-color);
}
.login-alert {
    background-color: var(--error-bg);
    border: 1px solid var(--error-border);
    color: var(--error-color);
}
</style>