import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameApp } from "@/components/GameApp";
import { getQuestionById, questions } from "@/data/questions";
import { buildQuestionSequence } from "@/lib/game";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return questions.filter((question) => question.active).map((question) => ({ id: question.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const question = getQuestionById(id);
  if (!question) return {};
  const title = `${question.benefit}。ただし、${question.consequence}`;
  return {
    title,
    description: `${title}。あなたは赤いボタンを押す？`,
    openGraph: { title, description: "あなたは押す？『絶対に押すな』" },
    twitter: { card: "summary_large_image", title, description: "あなたは押す？" },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { id } = await params;
  const question = getQuestionById(id);
  if (!question) notFound();
  return <GameApp initialQuestions={buildQuestionSequence(questions, id, () => 0.42)} startImmediately />;
}
