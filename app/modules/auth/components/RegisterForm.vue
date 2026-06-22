<template>
  <Card class="w-full max-w-sm">
    <form @submit.prevent="onSubmit">
      <card-header>
        <card-title>{{ t('register.title') }}</card-title>
        <card-description>{{ t('register.description') }}</card-description>
        <card-action>
          <Button
            as="button"
            variant="link"
            type="button"
            data-testid="sign-in-button"
            @click="navigateTo('/login')"
          >
            {{ t('register.signIn') }}
          </Button>
        </card-action>
      </card-header>
      <card-content>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">{{ t('register.email') }}</Label>
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
            <Label for="password">{{ t('register.password') }}</Label>
            <Input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
            />
            <span v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</span>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="confirmPassword">{{ t('register.confirmPassword') }}</Label>
            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              v-bind="confirmPasswordAttrs"
              type="password"
            />
            <span v-if="errors.confirmPassword" class="text-sm text-destructive">{{ errors.confirmPassword }}</span>
          </div>
          <span v-if="error" class="text-sm text-destructive">{{ error }}</span>
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
          {{ isLoading ? t('common.loading') : t('register.submit') }}
        </Button>
        <Button
          as="button"
          variant="outline"
          type="button"
          data-testid="google-button"
          class="w-full"
        >
          {{ t('register.googleSignUp') }}
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
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { z } from "zod";
import { Button } from "~/shared/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/shared/components/ui/card";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { useAuthStore } from "../stores/auth.store";

const { t } = useI18n();
const authStore = useAuthStore();
const error = ref<string | null>(null);
const isLoading = ref(false);

const schema = toTypedSchema(
  z.object({
    email: z.string().min(1, t("register.errors.enterEmail")).email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
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
    const message = e instanceof Error ? e.message : t("register.errors.registerFailed");
    error.value = message;
    toast.error(message);
  }
  finally {
    isLoading.value = false;
  }
});
</script>
