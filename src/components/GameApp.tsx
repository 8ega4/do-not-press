"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnswerScreen } from "@/components/AnswerScreen";
import { GameShell } from "@/components/GameShell";
import { HomeScreen } from "@/components/HomeScreen";
import { QuestionScreen } from "@/components/QuestionScreen";
import { SummaryScreen } from "@/components/SummaryScreen";
import { questions } from "@/data/questions";
import { buildQuestionSequence, summarizeAnswers } from "@/lib/game";
import { getTotalVotes, INITIAL_TOTAL_VOTES, submitVote } from "@/lib/votes";
import type { GameAnswer, Question, VoteChoice, VoteStats } from "@/types/game";

type View = "home" | "question" | "answer" | "summary";

export function GameApp({ initialQuestions = [], startImmediately = false }: { initialQuestions?: Question[]; startImmediately?: boolean }) {
  const [view, setView] = useState<View>(startImmediately ? "question" : "home");
  const [sequence, setSequence] = useState<Question[]>(initialQuestions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [lastChoice, setLastChoice] = useState<VoteChoice | null>(null);
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedChoice, setFailedChoice] = useState<VoteChoice | null>(null);
  const [impact, setImpact] = useState(false);
  const [totalVotes, setTotalVotes] = useState(INITIAL_TOTAL_VOTES);
  const submissionLock = useRef(false);

  useEffect(() => {
    getTotalVotes().then(setTotalVotes).catch(() => undefined);
  }, []);

  const startGame = useCallback(() => {
    setSequence(buildQuestionSequence(questions));
    setIndex(0);
    setAnswers([]);
    setLastChoice(null);
    setStats(null);
    setError(null);
    setFailedChoice(null);
    setView("question");
  }, []);

  const answer = useCallback(async (choice: VoteChoice) => {
    const question = sequence[index];
    if (!question || submissionLock.current) return;
    submissionLock.current = true;
    setPending(true);
    setError(null);
    setFailedChoice(choice);
    if (choice === "press") {
      setImpact(true);
      window.navigator.vibrate?.(35);
      window.setTimeout(() => setImpact(false), 280);
    }

    try {
      const nextStats = await submitVote(question.id, choice);
      setStats(nextStats);
      setLastChoice(choice);
      setAnswers((current) => [...current, { questionId: question.id, choice }]);
      setTotalVotes((current) => current + 1);
      setView("answer");
      setFailedChoice(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "回答を送信できませんでした。");
    } finally {
      submissionLock.current = false;
      setPending(false);
    }
  }, [index, sequence]);

  function next() {
    if (index >= sequence.length - 1) {
      setView("summary");
      return;
    }
    setIndex((current) => current + 1);
    setLastChoice(null);
    setStats(null);
    setError(null);
    setFailedChoice(null);
    setView("question");
  }

  const currentQuestion = sequence[index];
  const summary = summarizeAnswers(answers);

  return (
    <GameShell isImpact={impact}>
      {view === "home" && <HomeScreen totalVotes={totalVotes} onStart={startGame} />}
      {view === "question" && currentQuestion && (
        <QuestionScreen question={currentQuestion} index={index} answeredCount={answers.length} pending={pending} error={error} onAnswer={answer} onRetry={() => failedChoice && answer(failedChoice)} />
      )}
      {view === "answer" && currentQuestion && lastChoice && stats && (
        <AnswerScreen question={currentQuestion} choice={lastChoice} stats={stats} isLast={index === sequence.length - 1} onNext={next} />
      )}
      {view === "summary" && <SummaryScreen answers={answers} {...summary} onRestart={startGame} />}
    </GameShell>
  );
}
