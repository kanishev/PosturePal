<template>
  <Card class="w-full max-w-sm">
    <form @submit.prevent="onSubmit">
      <card-header>
        <card-title>Create an account</card-title>
        <card-description>
          Enter your email below to create your account
        </card-description>
        <card-action>
          <Button
            as="button"
            variant="link"
            type="button"
            data-testid="sign-in-button"
            @click="navigateTo('/login')"
          >
            Sign In
          </Button>
        </card-action>
      </card-header>
      <card-content>
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
            <span v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
            />
            <span v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              v-bind="confirmPasswordAttrs"
              type="password"
            />
            <span v-if="errors.confirmPassword" class="text-sm text-destructive">{{ errors.confirmPassword }}</span>
          </div>
        </div>
      </card-content>
      <card-footer class="flex flex-col gap-2">
        <Button
          as="button"
          class="w-full"
          type="submit"
          data-testid="submit-button"
          :disabled="isLoading"
        >
          {{ isLoading ? "Loading..." : "Sign Up" }}
        </Button>
        <Button
          as="button"
          variant="outline"
          type="button"
          data-testid="google-button"
          class="w-full"
        >
          Sign Up with Google
        </Button>
      </card-footer>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
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
    email: z.string().min(1, "Введите email").email("Некорректный email"),
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
    await navigateTo("/");
  }
  catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Ошибка регистрации";
    error.value = message;
    toast.error(message);
  }
  finally {
    isLoading.value = false;
  }
});
</script>
