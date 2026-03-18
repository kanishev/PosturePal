<template>
  <Card class="w-full max-w-sm">
    <card-header>
      <card-title>Create an account</card-title>
      <card-description>
        Enter your email below to create your account
      </card-description>
      <card-action>
        <Button variant="link" @click="navigateTo('/login')">
          Sign In
        </Button>
      </card-action>
    </card-header>
    <card-content>
      <form @submit.prevent="onSubmit">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              placeholder="m@example.com"
            />
            <span v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
            />
            <span v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              v-bind="confirmPasswordAttrs"
              type="password"
            />
            <span v-if="errors.confirmPassword" class="text-sm text-red-500">{{ errors.confirmPassword }}</span>
          </div>
          <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
        </div>
      </form>
    </card-content>
    <card-footer class="flex flex-col gap-2">
      <Button
        class="w-full"
        :disabled="isLoading"
        @click="onSubmit"
      >
        {{ isLoading ? "Loading..." : "Sign Up" }}
      </Button>
      <Button variant="outline" class="w-full">
        Sign Up with Google
      </Button>
    </card-footer>
  </Card>
</template>

<script setup lang="ts">
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
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  }),
);

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema });

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    error.value = null;
    await authStore.register(values.email, values.password);
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Ошибка регистрации";
  }
  finally {
    isLoading.value = false;
  }
});
</script>
