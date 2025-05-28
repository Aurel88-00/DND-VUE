<script setup lang="ts">
import { ref } from "vue";
import { loginSchema } from "../../lib/schemas/login.schema";
import { login } from "../../api/auth";
import { useRouter } from "vue-router";
import type { ILogin } from "../../lib/interfaces/login.interface";

const loginData = ref<ILogin>({
  email: "",
  password: "",
});
const rememberMe = ref(false);
const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

const emailError = ref("");
const passwordError = ref("");
const router = useRouter();

const validateEmail = async () => {
  emailError.value = "";

  try {
    await loginSchema.validate({ email: loginData.value.email, password: "" });
    return true;
  } catch (error: any) {
    emailError.value = error.message;
    return false;
  }
};

const validatePassword = async () => {
  passwordError.value = "";

  try {
    await loginSchema.validate({
      email: loginData.value.email,
      password: loginData.value.password,
    });
    return true;
  } catch (error: any) {
    passwordError.value = error.message;
    return false;
  }
};

const validateForm = async () => {
  try {
    await loginSchema.validate(
      { email: loginData.value.email, password: loginData.value.password },
      { abortEarly: false }
    );

    emailError.value = "";
    passwordError.value = "";
    return true;
  } catch (error: any) {
    if (error.inner) {
      error.inner.forEach((err: any) => {
        if (err.path === "email") {
          emailError.value = err.message;
        }
        if (err.path === "password") {
          passwordError.value = err.message;
        }
      });
    }
    return false;
  }
};

const handleSubmit = async () => {
  const isValid = await validateForm();

  if (!isValid) {
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";
  console.log("handle api request");
  try {
    const { data } = await login({
      email: loginData.value.email,
      password: loginData.value.password,
    });
    console.log(`Login was successful `);
    if (data && data.accessToken) {
      router.push("/");
    }
  } catch (error) {
    errorMessage.value = "Invalid email or password. Please try again.";
    console.error("Login error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main class="login-container">
    <div class="login-area">
      <div class="login-card">
        <h1 class="login-title">Login</h1>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="loginData.email"
              placeholder="Enter your email"
              :class="{ 'input-error': emailError }"
              @blur="validateEmail"
              required
            />
            <span v-if="emailError" class="error-text">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="loginData.password"
                placeholder="Enter your password"
                :class="{ 'input-error': passwordError }"
                @blur="validatePassword"
                required
                
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "Hide" : "Show" }}
              </button>
            </div>
            <span v-if="passwordError" class="error-text">{{
              passwordError
            }}</span>
          </div>

          <div class="form-group remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember">Remember me</label>
          </div>

          <div class="form-actions">
            <button type="submit" class="login-button" :disabled="isSubmitting">
              {{ isSubmitting ? "Logging in..." : "Login" }}
            </button>
          </div>
        </form>

        <div class="signup-link">
          Don't have an account? <RouterLink to="/register">Sign up</RouterLink>
        </div>
      </div>
    </div>
    <div class="image-area">
      <img
        loading="lazy"
        decoding="async"
        srcset="/src/assets/login-image.jpg 50w"
        height="max-content"
        style="aspect-ratio: 5/3; height: 100%; width: 100%; object-fit: cover"
        alt="login-image"
      />
    </div>
  </main>
</template>

<style scoped>
.login-container {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  gap: 20px;
  padding: 20px;
}
.login-area,
.image-area {
  height: 94vh;
}

.login-area{
  align-content: center;
}
.login-title{
  text-align: center;
  margin-bottom: 20px;
  color: #666;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="text"] {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.input-error {
  border-color: #e53935 !important;
}

.error-text {
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
}

.error-message {
  background-color: #ffebee;
  color: #e53935;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.remember-me {
  flex-direction: row !important;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.login-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #3a7bc8;
}

.login-button:disabled {
  background-color: #a5c7f0;
  cursor: not-allowed;
}


.signup-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #555;
}

.signup-link a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}

.password-input-container {
  position: relative;
  display: flex;
}

.password-input-container input {
  flex: 1;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}

.toggle-password:hover {
  color: #4a90e2;
}
</style>
