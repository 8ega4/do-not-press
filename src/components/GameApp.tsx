"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnswerScreen } from "@/components/AnswerScreen";
import { GameShell } from "@/components/GameShell";
import { HomeScreen } from "@/components/HomeScreen";
import { QuestionScreen } from "@/components/QuestionScreen";
import { questions } from "@/data/questions";
import { rolloverAnsweredQuestions, selectNextQuestion } from "@/lib/game";
import { addAnswerToHistory, EMPTY_PLAY_HISTORY, readPlayHistory, savePlayHistory } from "@/lib/playHistory";
import { getTotalVotes, submitVote } from "@/lib/votes";
import type { PlayHistory, Question, VoteChoice, VoteStats } from "@/types/game";

type View = "home" | "question" | "answer";

export function GameApp({ initialQuestion, startImmediately = false }: { initialQuestion?: Question; startImmediately?: boolean }) {
  const [view, setView] = useState<View>(startImmediately ? "question" : "home");
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(initialQuestion);
  const [history, setHistory] = useState<PlayHistory>(EMPTY_PLAY_HISTORY);
  const [historyReady, setHistoryReady] = useState(false);
  const [lastChoice, setLastChoice] = useState<VoteChoice | null>(null);
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedChoice, setFailedChoice] = useState<VoteChoice | null>(null);
  const [impact, setImpact] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const submissionLock = useRef(false);

  useEffect(() => {
    const historyTimer = window.setTimeout(() => {
      setHistory(readPlayHistory());
      setHistoryReady(true);
    }, 0);
    getTotalVotes().then(setTotalVotes).catch(() => undefined);
    return () => window.clearTimeout(historyTimer);
  }, []);

  const startGame = useCallback(() => {
    const storedHistory = readPlayHistory();
    const nextHistory = rolloverAnsweredQuestions(storedHistory, questions);
    const question = selectNextQuestion({
      questions,
      answeredQuestionIds: nextHistory.answeredQuestionIds,
      lastQuestionId: nextHistory.lastQuestionId,
      lastCategory: nextHistory.lastCategory,
    });
    setHistory(nextHistory);
    savePlayHistory(nextHistory);
    setCurrentQuestion(question);
    setLastChoice(null);
    setStats(null);
    setError(null);
    setFailedChoice(null);
    setView("question");
  }, []);

  const answer = useCallback(async (choice: VoteChoice) => {
    const question = currentQuestion;
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
      const currentHistory = historyReady ? history : readPlayHistory();
      const nextHistory = addAnswerToHistory(currentHistory, question, choice);
      setHistory(nextHistory);
      savePlayHistory(nextHistory);
      setStats(nextStats);
      setLastChoice(choice);
      setTotalVotes((current) => current + 1);
      setView("answer");
      setFailedChoice(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "回答を送信できませんでした。");
    } finally {
      submissionLock.current = false;
      setPending(false);
    }
  }, [currentQuestion, history, historyReady]);

  function next() {
    const nextHistory = rolloverAnsweredQuestions(history, questions);
    const question = selectNextQuestion({
      questions,
      answeredQuestionIds: nextHistory.answeredQuestionIds,
      lastQuestionId: nextHistory.lastQuestionId,
      lastCategory: nextHistory.lastCategory,
    });
    setHistory(nextHistory);
    savePlayHistory(nextHistory);
    setCurrentQuestion(question);
    setLastChoice(null);
    setStats(null);
    setError(null);
    setFailedChoice(null);
    setView("question");
  }

  return (
    <GameShell isImpact={impact}>
      {view === "home" && <HomeScreen totalVotes={totalVotes} onStart={startGame} />}
      {view === "question" && currentQuestion && (
        <QuestionScreen question={currentQuestion} history={history} pending={pending || !historyReady} error={error} onAnswer={answer} onRetry={() => failedChoice && answer(failedChoice)} />
      )}
      {view === "answer" && currentQuestion && lastChoice && stats && (
        <AnswerScreen question={currentQuestion} choice={lastChoice} stats={stats} history={history} onNext={next} />
      )}
    </GameShell>
  );
}
