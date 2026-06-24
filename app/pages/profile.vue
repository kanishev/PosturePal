<template>
  <div class="p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">
        {{ t('profile.title') }}
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">
        {{ t('profile.description') }}
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="text-sm text-muted-foreground">{{ t('common.loading') }}</span>
    </div>

    <profile-form v-else :profile="profile" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ProfileForm, useProfileStore } from "~/modules/profile";

definePageMeta({
  layout: "default",
});

const { t } = useI18n();
const { profile, isLoading } = storeToRefs(useProfileStore());
</script>
