<template>
  <form @submit.prevent="onSubmit">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <Label for="fullName">{{ t('profile.fullName') }}</Label>
        <Input
          id="fullName"
          v-model="fullName!"
          v-bind="fullNameAttrs"
          type="text"
          :placeholder="t('profile.fullNamePlaceholder')"
        />
        <span v-if="errors.full_name" class="text-sm text-destructive">{{ errors.full_name }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="username">{{ t('profile.username') }}</Label>
        <Input
          id="username"
          v-model="username!"
          v-bind="usernameAttrs"
          type="text"
          :placeholder="t('profile.usernamePlaceholder')"
        />
        <span v-if="errors.username" class="text-sm text-destructive">{{ errors.username }}</span>
      </div>

      <div class="flex gap-4">
        <div class="flex flex-1 flex-col gap-1.5">
          <Label for="weight">{{ t('profile.weight') }}</Label>
          <Input
            id="weight"
            v-model="weight!"
            v-bind="weightAttrs"
            type="number"
          />
          <span v-if="errors.weight" class="text-sm text-destructive">{{ errors.weight }}</span>
        </div>

        <div class="flex flex-1 flex-col gap-1.5">
          <Label for="height">{{ t('profile.height') }}</Label>
          <Input
            id="height"
            v-model="height!"
            v-bind="heightAttrs"
            type="number"
          />
          <span v-if="errors.height" class="text-sm text-destructive">{{ errors.height }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="dateOfBirth">{{ t('profile.dateOfBirth') }}</Label>
        <Input
          id="dateOfBirth"
          v-model="dateOfBirth!"
          v-bind="dateOfBirthAttrs"
          type="date"
        />
        <span v-if="errors.date_of_birth" class="text-sm text-destructive">{{ errors.date_of_birth }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="avatarUrl">{{ t('profile.avatarUrl') }}</Label>
        <Input
          id="avatarUrl"
          v-model="avatarUrl!"
          v-bind="avatarUrlAttrs"
          type="url"
          :placeholder="t('profile.avatarUrlPlaceholder')"
        />
        <span v-if="errors.avatar_url" class="text-sm text-destructive">{{ errors.avatar_url }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label>{{ t('profile.gender') }}</Label>
        <div class="flex gap-3">
          <Button
            v-for="option in genderOptions"
            :key="option.value"
            as="button"
            type="button"
            :variant="gender === option.value ? 'default' : 'outline'"
            class="flex-1"
            @click="gender = option.value"
          >
            {{ option.label }}
          </Button>
        </div>
        <span v-if="errors.gender" class="text-sm text-destructive">{{ errors.gender }}</span>
      </div>

      <span v-if="submitError" class="text-sm text-destructive">{{ submitError }}</span>

      <Button
        as="button"
        type="submit"
        class="w-full"
        :disabled="isLoading"
      >
        {{ isLoading ? t('common.loading') : t('profile.save') }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { handleErrorWithToast } from "~/shared/lib/handle-error";
import { useProfileStore } from "../index";
import { profileSchema, type Profile } from "../schemas/profile.schema";

const props = defineProps<{
  profile?: Profile | null
}>();

const { t } = useI18n();
const { isLoading, error: submitError, updateProfile } = useProfileStore();

const schema = toTypedSchema(profileSchema);

const { handleSubmit, defineField, errors, setValues } = useForm({
  validationSchema: schema,
});

const [fullName, fullNameAttrs] = defineField("full_name");
const [username, usernameAttrs] = defineField("username");
const [weight, weightAttrs] = defineField("weight");
const [height, heightAttrs] = defineField("height");
const [dateOfBirth, dateOfBirthAttrs] = defineField("date_of_birth");
const [avatarUrl, avatarUrlAttrs] = defineField("avatar_url");
const [gender] = defineField("gender");

const genderOptions = [
  { value: "male", label: t("profile.male") },
  { value: "female", label: t("profile.female") },
  { value: "other", label: t("profile.other") },
] as const;

watch(() => props.profile, (val) => {
  if (val) {
    setValues({
      full_name: val.full_name,
      username: val.username,
      weight: val.weight,
      height: val.height,
      date_of_birth: val.date_of_birth,
      avatar_url: val.avatar_url,
      gender: val.gender,
    });
  }
}, { immediate: true });

const onSubmit = handleSubmit(
  async (values) => {
    try {
      await updateProfile(values);
      toast.success(t("profile.saveSuccess"));
    }
    catch (e: unknown) {
      handleErrorWithToast(e, t("profile.saveError"));
    }
  },
  (validationErrors) => {
    console.log("validation errors:", validationErrors);
  },
);
</script>
