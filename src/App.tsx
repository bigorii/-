import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ListFilter,
  NotebookPen,
  Zap,
} from 'lucide-react';
import { MistakesView } from './components/MistakesView';
import { QuizView } from './components/QuizView';
import { ChapterFormulaSheet, SummaryModal } from './components/SheetsAndModals';
import { CHAPTERS, KEY_FORMULAS, POWER_QUESTIONS } from './data/powerQuestions';
import { ActiveTab, AttemptRecord, ChapterId } from './types/study';

const STORAGE_KEY = 'power_circuit_study_attempts_v1';

function loadAttempts(): Record<string, AttemptRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('solve');
  const [selectedChapter, setSelectedChapter] = useState<ChapterId>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, AttemptRecord>>(() => loadAttempts());
  const [retryQueueIds, setRetryQueueIds] = useState<string[] | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSection, setSheetSection] = useState<'chapters' | 'formulas'>('chapters');
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
    } catch {
      // Ignore storage quota errors
    }
  }, [attempts]);

  const activeQuestions = useMemo(() => {
    if (retryQueueIds && retryQueueIds.length > 0) {
      const set = new Set(retryQueueIds);
      return POWER_QUESTIONS.filter((q) => set.has(q.id));
    }
    if (selectedChapter === 'all') return POWER_QUESTIONS;
    return POWER_QUESTIONS.filter((q) => q.chapter === selectedChapter);
  }, [selectedChapter, retryQueueIds]);

  const safeIndex = Math.min(currentIndex, Math.max(0, activeQuestions.length - 1));
  const currentQuestion = activeQuestions[safeIndex] ?? POWER_QUESTIONS[0];

  // Active unresolved mistake badge count for bottom nav & desktop nav
  const activeMistakeCount = useMemo(() => {
    return POWER_QUESTIONS.filter((q) => {
      const a = attempts[q.id];
      if (!a) return false;
      return (!a.isCorrect || a.mistakeStatus === 'hold') && a.mistakeStatus !== 'mastered';
    }).length;
  }, [attempts]);

  const solvedCount = useMemo(
    () => POWER_QUESTIONS.filter((q) => Boolean(attempts[q.id])).length,
    [attempts]
  );

  const correctCount = useMemo(
    () => POWER_QUESTIONS.filter((q) => attempts[q.id]?.isCorrect).length,
    [attempts]
  );

  const handleSelectChapter = (chapter: ChapterId) => {
    setRetryQueueIds(null);
    setSelectedChapter(chapter);
    setCurrentIndex(0);
    setActiveTab('solve');
  };

  const handleSubmitAnswer = (questionId: string, selectedIndex: number) => {
    const q = POWER_QUESTIONS.find((item) => item.id === questionId);
    if (!q) return;
    const isCorrect = selectedIndex === q.correctIndex;
    setAttempts((prev) => {
      const existing = prev[questionId];
      return {
        ...prev,
        [questionId]: {
          questionId,
          selectedIndex,
          isCorrect,
          isSkipped: false,
          mistakeStatus: isCorrect
            ? existing?.mistakeStatus === 'hold'
              ? 'hold'
              : 'mastered'
            : 'incorrect',
          bookmarked: existing?.bookmarked ?? false,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleSkipUnknown = (questionId: string) => {
    setAttempts((prev) => {
      const existing = prev[questionId];
      return {
        ...prev,
        [questionId]: {
          questionId,
          selectedIndex: null,
          isCorrect: false,
          isSkipped: true,
          mistakeStatus: 'incorrect',
          bookmarked: existing?.bookmarked ?? false,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    setAttempts((prev) => {
      const existing = prev[questionId];
      if (!existing) {
        return {
          ...prev,
          [questionId]: {
            questionId,
            selectedIndex: null,
            isCorrect: true,
            isSkipped: false,
            bookmarked: true,
            updatedAt: Date.now(),
          },
        };
      }
      return {
        ...prev,
        [questionId]: {
          ...existing,
          bookmarked: !existing.bookmarked,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleToggleHold = (questionId: string) => {
    setAttempts((prev) => {
      const existing = prev[questionId];
      if (!existing) return prev;
      const nextStatus = existing.mistakeStatus === 'hold' ? (existing.isCorrect ? 'mastered' : 'incorrect') : 'hold';
      return {
        ...prev,
        [questionId]: {
          ...existing,
          mistakeStatus: nextStatus,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleMarkMastered = (questionId: string) => {
    setAttempts((prev) => {
      const existing = prev[questionId];
      if (!existing) return prev;
      const nextStatus = existing.mistakeStatus === 'mastered' ? 'incorrect' : 'mastered';
      return {
        ...prev,
        [questionId]: {
          ...existing,
          mistakeStatus: nextStatus,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleResetQuestion = (questionId: string) => {
    setAttempts((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleJumpToQuestion = (questionId: string) => {
    setRetryQueueIds(null);
    setSelectedChapter('all');
    const idx = POWER_QUESTIONS.findIndex((q) => q.id === questionId);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setActiveTab('solve');
    }
  };

  const handleStartRetryMistakes = (questionIds: string[]) => {
    if (questionIds.length === 0) return;
    setRetryQueueIds(questionIds);
    setCurrentIndex(0);
    setActiveTab('solve');
  };

  const handleResetAll = () => {
    setAttempts({});
    setRetryQueueIds(null);
    setCurrentIndex(0);
  };

  const currentChapterMeta = CHAPTERS.find((c) => c.id === selectedChapter) ?? CHAPTERS[0];
  const prioritizedFormulas = useMemo(() => {
    const ch = currentQuestion.chapter;
    return [
      ...KEY_FORMULAS.filter((f) => f.chapter === ch),
      ...KEY_FORMULAS.filter((f) => f.chapter !== ch),
    ];
  }, [currentQuestion.chapter]);

  return (
    <div className="min-h-dvh bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Desktop Top Header (Clean 3-zone layout) */}
      <header className="hidden lg:block bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('solve')}
            className="text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Zap className="w-5 h-5 text-[#1D4ED8]" />
            <span>Power Circuit Study</span>
          </button>

          <nav className="flex items-center gap-6 text-sm font-semibold" aria-label="주 메뉴">
            <button
              type="button"
              onClick={() => setActiveTab('solve')}
              className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'solve'
                  ? 'border-[#1D4ED8] text-[#1D4ED8]'
                  : 'border-transparent text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              문제 풀기
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mistakes')}
              className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                activeTab === 'mistakes'
                  ? 'border-[#1D4ED8] text-[#1D4ED8]'
                  : 'border-transparent text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <span>오답노트</span>
              {activeMistakeCount > 0 && (
                <span className="font-mono text-xs font-bold text-[#E11D48] tabular-nums">
                  ({activeMistakeCount})
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setSheetSection('formulas');
                setSheetOpen(true);
              }}
              className="py-1.5 border-b-2 border-transparent text-[#475569] hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0"
            >
              핵심 공식집
            </button>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSummaryOpen(true)}
              className="min-h-[40px] px-4 rounded-xl bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0"
            >
              학습 결과
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Compact Header (non-fixed so total fixed chrome stays < 15%) */}
      <header className="lg:hidden bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[440px] mx-auto px-4 h-[52px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <span className="text-[15px] font-bold text-[#0F172A] truncate">
              전기기사 · 전력공학
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSheetSection('chapters');
                setSheetOpen(true);
              }}
              className="min-h-[40px] px-2.5 rounded-lg text-xs font-semibold text-[#1D4ED8] hover:bg-[#EFF6FF] inline-flex items-center gap-1 whitespace-nowrap"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>{currentChapterMeta.shortLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSheetSection('formulas');
                setSheetOpen(true);
              }}
              aria-label="핵심 공식집 열기"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#F1F5F9]"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSummaryOpen(true)}
              aria-label="학습 결과 보기"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#F1F5F9]"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 pt-4 ${
          activeTab === 'solve' ? 'pb-36 lg:pb-12' : 'pb-24 lg:pb-12'
        }`}
      >
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)_320px] lg:gap-6 lg:items-start">
          {/* Desktop Left Rail: Chapters & Quick Problem Grid */}
          <aside className="hidden lg:block space-y-4 sticky top-6">
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 space-y-2.5">
              <h2 className="text-sm font-bold text-[#0F172A]">단원별 기출 선택</h2>
              <div className="space-y-1">
                {CHAPTERS.map((ch) => {
                  const active = !retryQueueIds && selectedChapter === ch.id;
                  const chCount =
                    ch.id === 'all'
                      ? POWER_QUESTIONS.length
                      : POWER_QUESTIONS.filter((q) => q.chapter === ch.id).length;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectChapter(ch.id)}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 text-sm transition-colors ${
                        active
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                          : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                      }`}
                    >
                      <span className="truncate">{ch.label}</span>
                      <span className="font-mono text-xs tabular-nums">{chCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0F172A]">문항 인덱스</h2>
                <span className="font-mono text-xs text-[#475569] tabular-nums">
                  {solvedCount}/{POWER_QUESTIONS.length} 풀이
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {POWER_QUESTIONS.map((q) => {
                  const a = attempts[q.id];
                  const isCurrent = activeTab === 'solve' && currentQuestion.id === q.id;
                  let cls = 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]';
                  if (isCurrent) {
                    cls = 'bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#1D4ED8]';
                  } else if (a?.isCorrect) {
                    cls = 'bg-[#ECFDF5] border-[#059669]/40 text-[#059669]';
                  } else if (a && !a.isCorrect) {
                    cls = 'bg-[#FFF1F2] border-[#E11D48]/40 text-[#E11D48]';
                  }
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpToQuestion(q.id)}
                      className={`min-h-[38px] rounded-lg border font-mono text-xs font-bold tabular-nums transition-colors ${cls}`}
                    >
                      {q.numberLabel.replace('Q.', '')}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Center Interactive Stage (Mobile-portrait proportions preserved) */}
          <section className="w-full max-w-[440px] lg:max-w-[560px] mx-auto">
            {activeTab === 'solve' ? (
              <QuizView
                question={currentQuestion}
                currentIndex={safeIndex}
                totalCount={activeQuestions.length}
                attempt={attempts[currentQuestion.id]}
                isRetryMode={Boolean(retryQueueIds)}
                onExitRetryMode={() => {
                  setRetryQueueIds(null);
                  setCurrentIndex(0);
                }}
                onSubmitAnswer={handleSubmitAnswer}
                onSkipUnknown={handleSkipUnknown}
                onToggleBookmark={handleToggleBookmark}
                onToggleHold={handleToggleHold}
                onResetQuestion={handleResetQuestion}
                onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                onNext={() =>
                  setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1))
                }
                onOpenSummary={() => setSummaryOpen(true)}
              />
            ) : (
              <MistakesView
                questions={POWER_QUESTIONS}
                attempts={attempts}
                onStartRetryMistakes={handleStartRetryMistakes}
                onJumpToQuestion={handleJumpToQuestion}
                onToggleHold={handleToggleHold}
                onMarkMastered={handleMarkMastered}
                onToggleBookmark={handleToggleBookmark}
              />
            )}
          </section>

          {/* Desktop Right Rail: Live Formula & Study Stats */}
          <aside className="hidden lg:block space-y-4 sticky top-6">
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0F172A]">학습 현황</h2>
                <button
                  type="button"
                  onClick={() => setSummaryOpen(true)}
                  className="text-xs font-semibold text-[#1D4ED8] hover:underline"
                >
                  상세 리포트
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#F8FAFC] p-2.5 text-center">
                  <div className="text-[11px] text-[#475569]">풀이</div>
                  <div className="font-mono text-base font-bold text-[#0F172A] tabular-nums">
                    {solvedCount}
                  </div>
                </div>
                <div className="rounded-xl bg-[#ECFDF5] p-2.5 text-center">
                  <div className="text-[11px] text-[#065F46]">정답</div>
                  <div className="font-mono text-base font-bold text-[#059669] tabular-nums">
                    {correctCount}
                  </div>
                </div>
                <div className="rounded-xl bg-[#FFF1F2] p-2.5 text-center">
                  <div className="text-[11px] text-[#9F1239]">오답</div>
                  <div className="font-mono text-base font-bold text-[#E11D48] tabular-nums">
                    {activeMistakeCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4 text-[#1D4ED8]" />
                  <span>현재 단원 핵심 공식</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setSheetSection('formulas');
                    setSheetOpen(true);
                  }}
                  className="text-xs font-semibold text-[#1D4ED8] hover:underline"
                >
                  전체 공식
                </button>
              </div>
              <div className="space-y-2.5">
                {prioritizedFormulas.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#0F172A]">
                        {item.title}
                      </span>
                      {item.chapter === currentQuestion.chapter && (
                        <span className="text-[10px] font-semibold text-[#1D4ED8] inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          연관
                        </span>
                      )}
                    </div>
                    <div className="formula-scroll overflow-x-auto">
                      <code className="font-mono text-xs font-semibold text-[#1D4ED8] whitespace-nowrap">
                        {item.formula}
                      </code>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-[16px]">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Sticky Bottom Navigation Bar (2 primary tabs: 문제 풀기 / 오답노트) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-[60px] pb-safe-nav bg-white border-t border-[#E2E8F0]"
        aria-label="하단 탭 내비게이션"
      >
        <div className="max-w-[440px] mx-auto h-full grid grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab('solve')}
            className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === 'solve' ? 'text-[#1D4ED8]' : 'text-[#64748B]'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[11px] font-semibold tracking-tight flex items-center gap-1">
              <span>문제 풀기</span>
              {activeTab === 'solve' && (
                <span className="w-[3px] h-[3px] rounded-full bg-[#1D4ED8]" aria-hidden="true" />
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mistakes')}
            className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === 'mistakes' ? 'text-[#1D4ED8]' : 'text-[#64748B]'
            }`}
          >
            <div className="relative">
              <NotebookPen className="w-5 h-5" />
              {activeMistakeCount > 0 && (
                <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E11D48] text-white font-mono text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {activeMistakeCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-tight flex items-center gap-1">
              <span>오답노트</span>
              {activeTab === 'mistakes' && (
                <span className="w-[3px] h-[3px] rounded-full bg-[#1D4ED8]" aria-hidden="true" />
              )}
            </span>
          </button>
        </div>
      </nav>

      {/* Sheets & Modals */}
      <ChapterFormulaSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        selectedChapter={selectedChapter}
        onSelectChapter={handleSelectChapter}
        questions={POWER_QUESTIONS}
        attempts={attempts}
        currentQuestionId={currentQuestion.id}
        onJumpToQuestion={handleJumpToQuestion}
        initialSection={sheetSection}
      />

      <SummaryModal
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        questions={POWER_QUESTIONS}
        attempts={attempts}
        onRetryMistakes={handleStartRetryMistakes}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
