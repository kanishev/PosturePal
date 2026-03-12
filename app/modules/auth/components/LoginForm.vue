<template>
  <div class="flex min-h-screen items-center justify-center">
    <card class="w-full max-w-sm">
      <card-header>
        <card-title>Login to your account</card-title>
        <card-description>
          Enter your email below to login to your account
        </card-description>
        <card-action>
          <Button variant="link" @click="navigateTo('/register')">
            Sign Up
          </Button>
        </card-action>
      </card-header>
      <card-content>
        <form @submit.prevent="onSubmit">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input
                v-bind="emailAttrs"
                id="email"
                v-model="email"
                type="email"
                placeholder="m@example.com"
              />
              <span v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div class="flex flex-col space-y-1.5">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                v-bind="passwordAttrs"
                id="password"
                v-model="password"
                type="password"
              />
              <span v-if="errors.password">{{ errors.password }}</span>
            </div>
            <span v-if="error">{{ error }}</span>
          </div>
        </form>
      </card-content>
      <card-footer class="flex flex-col gap-2">
        <Button
          class="w-full"
          :disabled="isLoading"
          @click="onSubmit"
        >
          {{ isLoading ? "Loading..." : "Sign in" }}
        </Button>
        <Button variant="outline" class="w-full">
          Login with Google
        </Button>
      </card-footer>
    </card>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { z } from "zod";
import { Button } from "~/shared/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/shared/components/ui/card";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();
const error = ref<string | null>(null);
const isLoading = ref(false);

const schema = toTypedSchema(
  z.object({
    email: z.string().email("Некорректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
  }),
);

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema });

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    error.value = null;
    await authStore.login(values.email, values.password);
    await navigateTo("/");
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Ошибка входа";
  }
  finally {
    isLoading.value = false;
  }
});
</script>
