<template>
  <Card class="w-full max-w-sm">
    <form @submit.prevent="onSubmit">
      <card-header>
        <card-title>{{ t('login.title') }}</card-title>
        <card-description>
          {{ t('login.description') }}
        </card-description>
        <card-action>
          <Button
            as="button"
            variant="link"
            type="button"
            data-testid="sign-up-button"
            @click="navigateTo('/register')"
          >
            {{ t('login.signUp') }}
          </Button>
        </card-action>
      </card-header>
      <card-content>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">{{ t('login.email') }}</Label>
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
              <Label for="password">{{ t('login.password') }}</Label>
              <a href="#" class="ml-auto inline-block text-sm underline">
                {{ t('login.forgotPassword') }}
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
          {{ isLoading ? t('common.loading') : t('login.submit') }}
        </Button>
        <Button
          as="button"
          variant="outline"
          type="button"
          data-testid="google-button"
          class="w-full"
        >
          {{ t('login.googleLogin') }}
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
    email: z.string().min(1, "Invalid email").email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
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
    error.value = e instanceof Error ? e.message : t("login.errors.loginFailed");
  }
  finally {
    isLoading.value = false;
  }
});
</script>
