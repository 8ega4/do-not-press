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
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const ogImageUrl = `${siteUrl}/og-image.png`;
  return {
    title,
    description: `${title}。あなたは赤いボタンを押す？`,
    openGraph: {
      title,
      description: "あなたは押す？『絶対に押すな』",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "絶対に押すな" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "あなたは押す？",
      images: [ogImageUrl],
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { id } = await params;
  const question = getQuestionById(id);
  if (!question) notFound();
  return <GameApp initialQuestions={buildQuestionSequence(questions, id, () => 0.42)} startImmediately />;
}
