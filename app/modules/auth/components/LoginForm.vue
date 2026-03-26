<template>
  <Card class="w-full max-w-sm">
    <form @submit.prevent="onSubmit">
      <card-header>
        <card-title>Login to your account</card-title>
        <card-description>
          Enter your email below to login to your account
        </card-description>
        <card-action>
          <Button
            as="button"
            variant="link"
            type="button"
            data-testid="sign-up-button"
            @click="navigateTo('/register')"
          >
            Sign Up
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
            <span v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
            </span>
          </div>

          <div class="flex flex-col space-y-1.5">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="#" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
            />
            <span v-if="errors.password" class="text-sm text-destructive">
              {{ errors.password }}
            </span>
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
          {{ isLoading ? "Loading..." : "Sign in" }}
        </Button>
        <Button
          as="button"
          variant="outline"
          type="button"
          data-testid="google-button"
          class="w-full"
        >
          Login with Google
        </Button>
      </card-footer>
    </form>
  </Card>
</template>

<script setup lang="ts">
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
  }),
);

const { handleSubmit, errors, defineField } = useForm({ validationSchema: schema });

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
    const message = e instanceof Error ? e.message : "Ошибка входа";
    error.value = message;
    toast.error(message);
  }
  finally {
    isLoading.value = false;
  }
});
</script>
