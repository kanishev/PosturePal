import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import type { Database } from "../../app/shared/types/supabase/database.types";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

const translations = [
  {
    slug: "neck-tilt",
    ru: {
      name: "Наклон головы",
      description: "Мягкое боковое растяжение шеи для снятия напряжения.",
      instructions: "1. Сядьте прямо.\n2. Медленно наклоните голову вправо.\n3. Держите 5 секунд.\n4. Повторите влево.",
    },
  },
  {
    slug: "neck-rotation",
    ru: {
      name: "Вращение шеи",
      description: "Полное вращение шеи для улучшения подвижности.",
      instructions: "1. Сядьте прямо.\n2. Медленно вращайте голову по часовой стрелке.\n3. Повторите против часовой стрелки.",
    },
  },
  {
    slug: "chin-tuck",
    ru: {
      name: "Подтягивание подбородка",
      description: "Укрепляет глубокие сгибатели шеи и улучшает осанку.",
      instructions: "1. Сядьте или встаньте прямо.\n2. Втяните подбородок назад.\n3. Держите 5 секунд.\n4. Медленно отпустите.",
    },
  },
  {
    slug: "shoulder-rolls",
    ru: {
      name: "Вращение плечами",
      description: "Снимает напряжение в плечах и верхней части спины.",
      instructions: "1. Сядьте прямо.\n2. Вращайте плечами вперёд 5 раз.\n3. Вращайте назад 5 раз.",
    },
  },
  {
    slug: "cat-cow-stretch",
    ru: {
      name: "Кошка-корова",
      description: "Классическое йога-движение для мобилизации позвоночника.",
      instructions: "1. Встаньте на четвереньки.\n2. Вдох — прогните спину, поднимите голову.\n3. Выдох — округлите спину, опустите голову.\n4. Повторяйте медленно.",
    },
  },
  {
    slug: "childs-pose",
    ru: {
      name: "Поза ребёнка",
      description: "Глубокое растяжение нижней части спины и бёдер.",
      instructions: "1. Встаньте на колени.\n2. Сядьте на пятки.\n3. Вытяните руки вперёд на полу.\n4. Держите 30 секунд.",
    },
  },
  {
    slug: "cobra-stretch",
    ru: {
      name: "Поза кобры",
      description: "Укрепляет мышцы спины и раскрывает грудную клетку.",
      instructions: "1. Лягте лицом вниз.\n2. Положите руки под плечи.\n3. Поднимитесь на руках, бёдра на полу.\n4. Держите 10 секунд.",
    },
  },
  {
    slug: "seated-forward-bend",
    ru: {
      name: "Наклон сидя вперёд",
      description: "Растягивает подколенные сухожилия и нижнюю часть спины.",
      instructions: "1. Сядьте с прямыми ногами.\n2. Вдох — вытяните позвоночник.\n3. Выдох — потянитесь к стопам.\n4. Держите 20 секунд.",
    },
  },
];

async function seedTranslations() {
  console.log("Seeding translations...");

  const { data: exercises, error: fetchError } = await supabase
    .from("exercises")
    .select("id, slug");

  if (fetchError) {
    console.error("Failed to fetch exercises:", fetchError.message);
    process.exit(1);
  }

  const rows = translations.flatMap(({ slug, ru }) => {
    const exercise = exercises.find(e => e.slug === slug);

    if (!exercise) {
      console.warn(`Exercise not found for slug: ${slug}`);
      return [];
    }
    return [{
      exercise_id: exercise.id,
      locale: "ru",
      name: ru.name,
      description: ru.description,
      instructions: ru.instructions,
    }];
  });

  const { error } = await supabase
    .from("exercise_translations")
    .upsert(rows, { onConflict: "exercise_id,locale" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} translations`);
  process.exit(0);
}

seedTranslations().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
