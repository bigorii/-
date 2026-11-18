import React from 'react';
import { BookOpen, CheckCircle2, Play, RotateCcw, X, XCircle } from 'lucide-react';
import { CHAPTERS, KEY_FORMULAS } from '../data/powerQuestions';
import { AttemptRecord, ChapterId, Question } from '../types/study';

interface ChapterFormulaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChapter: ChapterId;
  onSelectChapter: (chapter: ChapterId) => void;
  questions: Question[];
  attempts: Record<string, AttemptRecord>;
  currentQuestionId?: string;
  onJumpToQuestion: (questionId: string) => void;
  initialSection?: 'chapters' | 'formulas';
}

export const ChapterFormulaSheet: React.FC<ChapterFormulaSheetProps> = ({
  isOpen,
  onClose,
  selectedChapter,
  onSelectChapter,
  questions,
  attempts,
  currentQuestionId,
  onJumpToQuestion,
  initialSection = 'chapters',
}) => {
  const [tab, setTab] = React.useState<'chapters' | 'formulas'>(initialSection);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialSection);
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/45 backdrop-blur-xs flex items-end lg:items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="단원 선택 및 핵심 공식집"
    >
      <div
        className="w-full max-w-[440px] lg:max-w-[540px] max-h-[85vh] bg-white rounded-t-3xl lg:rounded-2xl border border-[#E2E8F0] shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="lg:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#CBD5E1]" />
        </div>

        {/* Sheet Header */}
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl">
            <button
              type="button"
              onClick={() => setTab('chapters')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                tab === 'chapters' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#475569]'
              }`}
            >
              단원 · 문항 이동
            </button>
            <button
              type="button"
              onClick={() => setTab('formulas')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                tab === 'formulas' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#475569]'
              }`}
            >
              핵심 공식집
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#475569] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4 pb-safe">
          {tab === 'chapters' ? (
            <>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[#475569]">단원별 필터</h3>
                <div className="space-y-1.5">
                  {CHAPTERS.map((ch) => {
                    const count =
                      ch.id === 'all'
                        ? questions.length
                        : questions.filter((q) => q.chapter === ch.id).length;
                    const active = selectedChapter === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          onSelectChapter(ch.id);
                          onClose();
                        }}
                        className={`w-full min-h-[52px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${
                          active
                            ? 'bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#1D4ED8]'
                            : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">{ch.label}</div>
                          <div className="text-xs text-[#475569] truncate">
                            {ch.description}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold tabular-nums shrink-0">
                          {count}문항
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Question Matrix */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <h3 className="text-xs font-semibold text-[#475569]">빠른 문항 이동</h3>
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q) => {
                    const a = attempts[q.id];
                    const isCurrent = q.id === currentQuestionId;
                    let cls =
                      'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]';
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
                        onClick={() => {
                          onJumpToQuestion(q.id);
                          onClose();
                        }}
                        className={`min-h-[44px] rounded-xl border font-mono text-xs font-bold tabular-nums transition-colors ${cls}`}
                      >
                        {q.numberLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {KEY_FORMULAS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#0F172A]">{item.title}</span>
                    <span className="font-mono text-[11px] font-medium text-[#475569] shrink-0">
                      [{item.unit}]
                    </span>
                  </div>
                  <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 formula-scroll overflow-x-auto">
                    <code className="font-mono text-xs font-semibold text-[#1D4ED8] whitespace-nowrap">
                      {item.formula}
                    </code>
                  </div>
                  <p className="text-xs text-[#475569] leading-[18px]">{item.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  attempts: Record<string, AttemptRecord>;
  onRetryMistakes: (ids: string[]) => void;
  onResetAll: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  questions,
  attempts,
  onRetryMistakes,
  onResetAll,
}) => {
  if (!isOpen) return null;

  const answeredList = questions.filter((q) => Boolean(attempts[q.id]));
  const correctList = answeredList.filter((q) => attempts[q.id]?.isCorrect);
  const wrongIds = questions
    .filter((q) => {
      const a = attempts[q.id];
      return a && !a.isCorrect;
    })
    .map((q) => q.id);

  const accuracy =
    answeredList.length > 0
      ? Math.round((correctList.length / answeredList.length) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="학습 결과 리포트"
    >
      <div
        className="w-full max-w-[440px] bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2E8F0] p-5 space-y-5 shadow-xl pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>전력공학 학습 요약</span>
            </div>
            <h2 className="text-[22px] font-bold text-[#0F172A]">현재 학습 성취도</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl text-[#475569] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
            <div className="text-xs text-[#475569]">정답률</div>
            <div className="font-mono text-2xl font-bold text-[#1D4ED8] tabular-nums mt-0.5">
              {accuracy}%
            </div>
          </div>
          <div className="rounded-xl bg-[#ECFDF5] border border-[#059669]/20 p-3">
            <div className="text-xs text-[#065F46] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>정답</span>
            </div>
            <div className="font-mono text-2xl font-bold text-[#059669] tabular-nums mt-0.5">
              {correctList.length}
            </div>
          </div>
          <div className="rounded-xl bg-[#FFF1F2] border border-[#E11D48]/20 p-3">
            <div className="text-xs text-[#9F1239] flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>오답</span>
            </div>
            <div className="font-mono text-2xl font-bold text-[#E11D48] tabular-nums mt-0.5">
              {wrongIds.length}
            </div>
          </div>
        </div>

        {/* Chapter Breakdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold text-[#475569]">단원별 풀이 현황</h3>
          {CHAPTERS.filter((c) => c.id !== 'all').map((ch) => {
            const chQuestions = questions.filter((q) => q.chapter === ch.id);
            const chCorrect = chQuestions.filter((q) => attempts[q.id]?.isCorrect).length;
            const pct = Math.round((chCorrect / chQuestions.length) * 100);
            return (
              <div key={ch.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0F172A]">{ch.label}</span>
                  <span className="font-mono text-[#475569] tabular-nums">
                    {chCorrect}/{chQuestions.length} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1D4ED8] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          {wrongIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onRetryMistakes(wrongIds);
                onClose();
              }}
              className="w-full min-h-[52px] rounded-xl bg-[#1D4ED8] text-white font-bold text-base hover:bg-[#1E40AF] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>틀린 문제 바로 복습하기 ({wrongIds.length}문항)</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onResetAll();
              onClose();
            }}
            className="w-full min-h-[48px] rounded-xl bg-white border border-[#E2E8F0] text-[#475569] font-semibold text-sm hover:bg-[#F8FAFC] inline-flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>전체 풀이 기록 초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
};
