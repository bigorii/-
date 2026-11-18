import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  HelpCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { OPTION_CIRCLES } from '../data/powerQuestions';
import { AttemptRecord, Question } from '../types/study';
import { CircuitSchematic } from './CircuitSchematics';

interface QuizViewProps {
  question: Question;
  currentIndex: number;
  totalCount: number;
  attempt?: AttemptRecord;
  isRetryMode: boolean;
  onExitRetryMode: () => void;
  onSubmitAnswer: (questionId: string, selectedIndex: number) => void;
  onSkipUnknown: (questionId: string) => void;
  onToggleBookmark: (questionId: string) => void;
  onToggleHold: (questionId: string) => void;
  onResetQuestion: (questionId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenSummary: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  question,
  currentIndex,
  totalCount,
  attempt,
  isRetryMode,
  onExitRetryMode,
  onSubmitAnswer,
  onSkipUnknown,
  onToggleBookmark,
  onToggleHold,
  onResetQuestion,
  onPrev,
  onNext,
  onOpenSummary,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(true);

  const isAnswered = Boolean(attempt);
  const isLast = currentIndex === totalCount - 1;

  useEffect(() => {
    setSelectedOption(attempt?.selectedIndex ?? null);
    setShowHint(false);
    setExplanationOpen(true);
  }, [question.id, attempt]);

  const handleConfirm = () => {
    if (selectedOption === null) return;
    onSubmitAnswer(question.id, selectedOption);
    setExplanationOpen(true);
  };

  const handleSkip = () => {
    onSkipUnknown(question.id);
    setExplanationOpen(true);
  };

  const isOnHold = attempt?.mistakeStatus === 'hold';
  const isBookmarked = attempt?.bookmarked ?? false;

  return (
    <div className="space-y-4">
      {isRetryMode && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FEF3C7] border border-[#F59E0B]/40 px-4 py-2.5 text-sm text-[#92400E]">
          <span className="font-medium truncate">
            오답 집중 복습 중 ({currentIndex + 1}/{totalCount})
          </span>
          <button
            type="button"
            onClick={onExitRetryMode}
            className="shrink-0 whitespace-nowrap font-semibold text-[#B45309] hover:underline focus-visible:outline-2 focus-visible:outline-[#D97706] rounded px-1.5 py-1"
          >
            전체 문제로
          </button>
        </div>
      )}

      {/* Progress hairline bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#475569]">
          <span className="font-mono font-medium tabular-nums">
            {currentIndex + 1} / {totalCount} 문항
          </span>
          <span className="font-mono tabular-nums">
            {Math.round(((currentIndex + 1) / totalCount) * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
          <div
            className="h-full rounded-full bg-[#1D4ED8] transition-transform duration-200 origin-left"
            style={{
              transform: `scaleX(${(currentIndex + 1) / totalCount})`,
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <article className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]">
        {/* Card Header Slot — clean unboxed typography + bookmark button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-mono text-base font-bold text-[#1D4ED8] tabular-nums">
                {question.numberLabel}
              </span>
              <span className="text-[#CBD5E1]" aria-hidden="true">
                ·
              </span>
              <span className="font-mono text-xs font-medium text-[#475569]">
                {question.examSession}
              </span>
              <span className="text-[#CBD5E1]" aria-hidden="true">
                ·
              </span>
              <span className="text-xs font-medium text-[#475569]">
                {question.chapterName}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleBookmark(question.id)}
            aria-label={isBookmarked ? '북마크 해제' : '북마크 저장'}
            aria-pressed={isBookmarked}
            className={`-mr-2 -mt-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8] ${
              isBookmarked
                ? 'text-[#D97706] bg-[#FEF3C7]/60'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Question Prompt */}
        <h2 className="text-[17px] leading-[28px] font-medium text-[#0F172A] mb-4">
          {question.prompt}
        </h2>

        {/* Schematic & Formula Preview Box */}
        {(question.schematic || !isAnswered) && (
          <div className="mb-4 space-y-2.5">
            {question.schematic && (
              <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3">
                <div className="formula-scroll overflow-x-auto">
                  <CircuitSchematic type={question.schematic} />
                </div>
                {question.schematicCaption && (
                  <p className="mt-1.5 text-center font-mono text-[11px] text-[#475569]">
                    {question.schematicCaption}
                  </p>
                )}
              </div>
            )}

            {!isAnswered && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D4ED8] hover:text-[#1E40AF] py-1 px-1 rounded focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHint ? '핵심 공식 숨기기' : '핵심 공식 힌트 보기'}</span>
                </button>
                {showHint && (
                  <div className="mt-1.5 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2.5 formula-scroll overflow-x-auto">
                    <code className="font-mono text-[13px] font-medium text-[#1D4ED8] whitespace-nowrap">
                      {question.formulaHint}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Multiple-Choice Option Items */}
        <div className="space-y-2.5" role="radiogroup" aria-label="선다형 보기">
          {question.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectChoice = idx === question.correctIndex;
            const showCorrect = isAnswered && isCorrectChoice;
            const showWrong = isAnswered && isSelected && !isCorrectChoice;

            let containerClass =
              'bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#94A3B8] hover:bg-[#F8FAFC]';
            let circleClass = 'bg-[#F1F5F9] text-[#475569]';

            if (!isAnswered && isSelected) {
              containerClass =
                'bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#0F172A]';
              circleClass = 'bg-[#1D4ED8] text-white';
            } else if (showCorrect) {
              containerClass =
                'bg-[#ECFDF5] border-2 border-[#059669] text-[#065F46]';
              circleClass = 'bg-[#059669] text-white';
            } else if (showWrong) {
              containerClass =
                'bg-[#FFF1F2] border-2 border-[#E11D48] text-[#9F1239]';
              circleClass = 'bg-[#E11D48] text-white';
            }

            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isAnswered}
                onClick={() => setSelectedOption(idx)}
                className={`w-full min-h-[56px] rounded-xl px-3.5 py-3 flex items-center gap-3 text-left transition-all duration-150 active:scale-[0.99] disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-[#1D4ED8] ${containerClass}`}
              >
                <span
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm font-bold transition-colors ${circleClass}`}
                >
                  {OPTION_CIRCLES[idx]}
                </span>
                <span className="flex-1 text-[15px] leading-[22px] font-medium">
                  {optionText}
                </span>
                {showCorrect && (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#059669]" aria-label="정답" />
                )}
                {showWrong && (
                  <XCircle className="w-5 h-5 shrink-0 text-[#E11D48]" aria-label="오답" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-submit Feedback Banner & Explanation Accordion */}
        {isAnswered && attempt && (
          <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-3">
            {/* Explicit status row with icon + text (never hue-only) */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {attempt.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#059669]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    정답입니다
                  </span>
                ) : attempt.isSkipped ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#D97706]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    모름 처리 · 오답노트 저장됨
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1F2] px-2.5 py-1 text-xs font-semibold text-[#E11D48]">
                    <XCircle className="w-3.5 h-3.5" />
                    오답 · 정답 {OPTION_CIRCLES[question.correctIndex]}
                  </span>
                )}

                {isOnHold && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#D97706]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    오답보류
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleHold(question.id)}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#D97706] ${
                    isOnHold
                      ? 'bg-[#FEF3C7] text-[#B45309]'
                      : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {isOnHold ? '보류 해제' : '오답보류'}
                </button>
                <button
                  type="button"
                  onClick={() => onResetQuestion(question.id)}
                  aria-label="이 문제 다시 풀기"
                  className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>재풀이</span>
                </button>
              </div>
            </div>

            {/* Collapsible Explanation Drawer */}
            <div className="rounded-xl bg-[#F1F5F9] overflow-hidden">
              <button
                type="button"
                onClick={() => setExplanationOpen((o) => !o)}
                className="w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-[#0F172A] hover:bg-[#E2E8F0]/50 transition-colors"
                aria-expanded={explanationOpen}
              >
                <span>공식 및 단계별 풀이 해설</span>
                {explanationOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#475569]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#475569]" />
                )}
              </button>

              {explanationOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Formula Box */}
                  <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 formula-scroll overflow-x-auto">
                    <code className="font-mono text-[13px] font-semibold text-[#1D4ED8] whitespace-nowrap">
                      {question.formulaHint}
                    </code>
                  </div>

                  {/* Calculation Steps */}
                  <div className="space-y-1.5">
                    {question.explanationSteps.map((step, i) => (
                      <p
                        key={i}
                        className="font-mono text-[13px] leading-[21px] text-[#0F172A]"
                      >
                        {step}
                      </p>
                    ))}
                  </div>

                  {/* Key takeaway */}
                  <div className="pt-2 border-t border-[#CBD5E1]/70 text-[13px] leading-[20px] text-[#475569]">
                    <span className="font-semibold text-[#0F172A]">핵심 포인트: </span>
                    {question.keyTakeaway}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </article>

      {/* Desktop Inline Action Bar (hidden on mobile because mobile uses thumb-zone bottom dock) */}
      <div className="hidden lg:flex items-center gap-3 pt-1">
        {!isAnswered ? (
          <>
            <button
              type="button"
              onClick={handleSkip}
              className="min-h-[52px] px-5 rounded-xl bg-white border border-[#E2E8F0] text-[#475569] font-semibold text-[15px] hover:bg-[#F1F5F9] hover:text-[#0F172A] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              모름 (해설 보기)
            </button>
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleConfirm}
              className="flex-1 min-h-[52px] px-6 rounded-xl bg-[#1D4ED8] text-white font-semibold text-[16px] hover:bg-[#1E40AF] disabled:bg-[#CBD5E1] disabled:text-[#64748B] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              정답 확인
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={onPrev}
              className="min-h-[52px] px-4 rounded-xl bg-white border border-[#E2E8F0] text-[#475569] font-semibold text-[15px] hover:bg-[#F1F5F9] disabled:opacity-40 inline-flex items-center gap-1 whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전</span>
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={onOpenSummary}
                className="flex-1 min-h-[52px] px-6 rounded-xl bg-[#059669] text-white font-semibold text-[16px] hover:bg-[#047857] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                학습 결과 리포트 보기
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                className="flex-1 min-h-[52px] px-6 rounded-xl bg-[#1D4ED8] text-white font-semibold text-[16px] hover:bg-[#1E40AF] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>다음 문제</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Mobile Thumb-Zone Action Controls (Fixed Dock above Bottom Nav on < lg) */}
      <div className="lg:hidden fixed left-0 right-0 bottom-[60px] z-30 bg-white/95 backdrop-blur-sm border-t border-[#E2E8F0] px-4 py-2 shadow-[0_-4px_16px_-2px_rgba(15,23,42,0.06)]">
        <div className="max-w-[440px] mx-auto flex items-center gap-2.5">
          {!isAnswered ? (
            <>
              <button
                type="button"
                onClick={handleSkip}
                className="min-h-[48px] px-4 rounded-xl bg-white border border-[#E2E8F0] text-[#475569] font-semibold text-[15px] active:scale-[0.98] transition-transform whitespace-nowrap"
              >
                모름
              </button>
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleConfirm}
                className="flex-1 min-h-[48px] px-5 rounded-xl bg-[#1D4ED8] text-white font-bold text-[16px] disabled:bg-[#CBD5E1] disabled:text-[#64748B] active:scale-[0.98] transition-transform whitespace-nowrap"
              >
                정답 확인
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={onPrev}
                className="min-h-[48px] px-3.5 rounded-xl bg-white border border-[#E2E8F0] text-[#475569] font-semibold text-[15px] disabled:opacity-40 inline-flex items-center gap-1 whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전</span>
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={onOpenSummary}
                  className="flex-1 min-h-[48px] px-5 rounded-xl bg-[#059669] text-white font-bold text-[16px] active:scale-[0.98] transition-transform whitespace-nowrap"
                >
                  학습 결과 보기
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="flex-1 min-h-[48px] px-5 rounded-xl bg-[#1D4ED8] text-white font-bold text-[16px] active:scale-[0.98] transition-transform inline-flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <span>다음 문제</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
