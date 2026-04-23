import { useExercises } from "~/modules/exercises";

export const useI18nData = () => {
  const { locale } = useI18n();

  // collect stores methods to be called after locale changed
  const stores = {
    exercises: useExercises(),
  };

  const refreshAllData = async () => {
    await Promise.allSettled(
      Object.values(stores).map(store =>
        store.fetchData ? store.fetchData() : Promise.resolve(),
      ),
    );
  };

  watch(locale, refreshAllData, { immediate: false });

  return {
    ...stores,
    refreshAllData,
  };
};
