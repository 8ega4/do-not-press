import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const questionsPath = resolve(root, "src/data/questions.ts");
const schemaPath = resolve(root, "supabase/schema.sql");
const source = readFileSync(questionsPath, "utf8");
const questionPattern = /\{ id: "([^"]+)", benefit: "([^"]+)", consequence: "([^"]+)", category: "([^"]+)", active: (true|false), priority: (\d+) \}/g;
const questions = [...source.matchAll(questionPattern)].map((match) => ({
  id: match[1],
  benefit: match[2],
  consequence: match[3],
  category: match[4],
  active: match[5],
  priority: match[6],
}));

if (questions.length < 100) {
  throw new Error(`100問以上必要です。現在は${questions.length}問です。`);
}

const sqlString = (value) => `'${value.replaceAll("'", "''")}'`;
const rows = questions.map((question) =>
  `  (${sqlString(question.id)}, ${sqlString(question.benefit)}, ${sqlString(question.consequence)}, ${sqlString(question.category)}, ${question.active}, ${question.priority})`,
).join(",\n");
const generated = `-- BEGIN GENERATED QUESTIONS
-- This block is generated from src/data/questions.ts. Do not edit by hand.
insert into public.questions (id, benefit, consequence, category, active, priority) values
${rows}
on conflict (id) do update set
  benefit = excluded.benefit,
  consequence = excluded.consequence,
  category = excluded.category,
  active = excluded.active,
  priority = excluded.priority;
-- END GENERATED QUESTIONS`;

const schema = readFileSync(schemaPath, "utf8");
const nextSchema = schema.replace(
  /-- BEGIN GENERATED QUESTIONS[\s\S]*?-- END GENERATED QUESTIONS/,
  generated,
);

if (nextSchema !== schema) {
  writeFileSync(schemaPath, nextSchema);
  console.log(`${questions.length} questions written to supabase/schema.sql`);
} else {
  console.log(`supabase/schema.sql is up to date (${questions.length} questions)`);
}
