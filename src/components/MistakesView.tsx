import React, { useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { OPTION_CIRCLES } from '../data/powerQuestions';
import { AttemptRecord, MistakeFilter, Question } from '../types/study';
import { CircuitSchematic } from './CircuitSchematics';

interface MistakesViewProps {
  questions: Question[];
  attempts: Record<string, AttemptRecord>;
  onStartRetryMistakes: (questionIds: string[]) => void;
  onJumpToQuestion: (questionId: string) => void;
  onToggleHold: (questionId: string) => void;
  onMarkMastered: (questionId: string) => void;
  onToggleBookmark: (questionId: string) => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({
  questions,
  attempts,
  onStartRetryMistakes,
  onJumpToQuestion,
  onToggleHold,
  onMarkMastered,
  onToggleBookmark,
}) => {
  const [filter, setFilter] = useState<MistakeFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const notebookEntries = questions.filter((q) => {
    const a = attempts[q.id];
    if (!a) return false;
    return !a.isCorrect || a.mistakeStatus === 'hold' || a.bookmarked;
  });

  const incorrectCount = notebookEntries.filter((q) => {
    const a = attempts[q.id];
    return a && !a.isCorrect && a.mistakeStatus !== 'mastered' && a.mistakeStatus !== 'hold';
  }).length;

  const holdCount = notebookEntries.filter((q) => attempts[q.id]?.mistakeStatus === 'hold').length;
  const bookmarkedCount = notebookEntries.filter((q) => attempts[q.id]?.bookmarked).length;

  const filteredQuestions = notebookEntries.filter((q) => {
    const a = attempts[q.id];
    if (!a) return false;
    if (filter === 'incorrect') {
      return !a.isCorrect && a.mistakeStatus !== 'mastered';
    }
    if (filter === 'hold') {
      return a.mistakeStatus === 'hold';
    }
    if (filter === 'bookmarked') {
      return a.bookmarked;
    }
    return true;
  });

  const retryableIds = notebookEntries
    .filter((q) => {
      const a = attempts[q.id];
      return a && (!a.isCorrect || a.mistakeStatus === 'hold') && a.mistakeStatus !== 'mastered';
    })
    .map((q) => q.id);

  return (
    <div className="space-y-4">
      {/* Summary Strip */}
      <section className="rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-[18px] font-bold text-[#0F172A]">오답노트 및 보류 관리</h2>
            <p className="text-[13px] text-[#475569] mt-0.5">
              틀린 문제와 헷갈린 공식을 반복 복습하세요.
            </p>
          </div>
          {retryableIds.length > 0 && (
            <button
              type="button"
              onClick={() => onStartRetryMistakes(retryableIds)}
              className="min-h-[44px] px-4 rounded-xl bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] active:scale-[0.98] transition-all inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>오답 다시 풀기 ({retryableIds.length})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E2E8F0]">
          <div className="rounded-xl bg-[#FFF1F2]/70 px-3 py-2">
            <div className="text-[11px] font-medium text-[#9F1239]">미해결 오답</div>
            <div className="font-mono text-lg font-bold text-[#E11D48] tabular-nums">
              {incorrectCount}
            </div>
          </div>
          <div className="rounded-xl bg-[#FEF3C7]/70 px-3 py-2">
            <div className="text-[11px] font-medium text-[#92400E]">오답보류</div>
            <div className="font-mono text-lg font-bold text-[#D97706] tabular-nums">
              {holdCount}
            </div>
          </div>
          <div className="rounded-xl bg-[#EFF6FF]/80 px-3 py-2">
            <div className="text-[11px] font-medium text-[#1E40AF]">북마크</div>
            <div className="font-mono text-lg font-bold text-[#1D4ED8] tabular-nums">
              {bookmarkedCount}
            </div>
          </div>
        </div>
      </section>

      {/* Segmented Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#E2E8F0]/70">
        {(
          [
            { id: 'all', label: `전체 (${notebookEntries.length})` },
            { id: 'incorrect', label: '오답' },
            { id: 'hold', label: '보류' },
            { id: 'bookmarked', label: '저장됨' },
          ] as { id: MistakeFilter; label: string }[]
        ).map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap px-2 ${
                active
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Review Card List */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-8 text-center space-y-2">
          <div className="w-11 h-11 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#0F172A]">
            해당 조건의 복습 문항이 없습니다
          </h3>
          <p className="text-sm text-[#475569]">
            문제 풀기 탭에서 기출문제를 풀거나 북마크하면 이곳에 자동으로 정리됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const a = attempts[q.id];
            const isExpanded = expandedId === q.id;
            const isHold = a?.mistakeStatus === 'hold';
            const isMastered = a?.mistakeStatus === 'mastered';

            return (
              <article
                key={q.id}
                className="rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)] space-y-3"
              >
                {/* Header & Status Chip */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {isMastered ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#059669]">
                          <CheckCircle2 className="w-3 h-3" />
                          해결됨
                        </span>
                      ) : isHold ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-semibold text-[#D97706]">
                          <AlertCircle className="w-3 h-3" />
                          오답보류
                        </span>
                      ) : !a.isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#E11D48]">
                          <XCircle className="w-3 h-3" />
                          {a.isSkipped ? '모름' : '오답'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#059669]">
                          <CheckCircle2 className="w-3 h-3" />
                          정답
                        </span>
                      )}

                      <span className="font-mono text-xs font-bold text-[#1D4ED8] tabular-nums">
                        {q.numberLabel}
                      </span>
                      <span className="text-[#CBD5E1]" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono text-[11px] text-[#475569]">
                        {q.examSession}
                      </span>
                    </div>
                    <div className="text-xs text-[#475569]">{q.chapterName}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleBookmark(q.id)}
                    aria-label="북마크 토글"
                    className={`-mr-2 -mt-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
                      a?.bookmarked
                        ? 'text-[#D97706]'
                        : 'text-[#94A3B8] hover:text-[#475569]'
                    }`}
                  >
                    <Bookmark
                      className="w-4 h-4"
                      fill={a?.bookmarked ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                {/* Question Copy */}
                <p className="text-[15px] leading-[24px] font-medium text-[#0F172A]">
                  {q.prompt}
                </p>

                {/* Choice comparison */}
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2.5 text-xs space-y-1">
                  {a.selectedIndex !== null && !a.isCorrect && (
                    <div className="flex items-start gap-2 text-[#E11D48]">
                      <span className="font-semibold shrink-0">내 선택:</span>
                      <span>
                        {OPTION_CIRCLES[a.selectedIndex]} {q.options[a.selectedIndex]}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-[#059669]">
                    <span className="font-semibold shrink-0">정답:</span>
                    <span className="font-medium">
                      {OPTION_CIRCLES[q.correctIndex]} {q.options[q.correctIndex]}
                    </span>
                  </div>
                </div>

                {/* Expandable Formula & Steps */}
                <div className="rounded-xl bg-[#F1F5F9] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="w-full min-h-[44px] px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-[#0F172A] hover:bg-[#E2E8F0]/50"
                  >
                    <span>풀이 공식 및 해설 {isExpanded ? '접기' : '펼치기'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#475569]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#475569]" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 space-y-2.5">
                      {q.schematic && (
                        <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white p-2.5 formula-scroll overflow-x-auto">
                          <CircuitSchematic type={q.schematic} />
                        </div>
                      )}
                      <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 formula-scroll overflow-x-auto">
                        <code className="font-mono text-xs font-semibold text-[#1D4ED8] whitespace-nowrap">
                          {q.formulaHint}
                        </code>
                      </div>
                      <div className="space-y-1">
                        {q.explanationSteps.map((s, idx) => (
                          <p key={idx} className="font-mono text-xs leading-[19px] text-[#0F172A]">
                            {s}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Thumb Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onJumpToQuestion(q.id)}
                    className="flex-1 min-h-[44px] px-3 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] text-xs font-semibold hover:bg-[#DBEAFE] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>다시 풀기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleHold(q.id)}
                    className={`min-h-[44px] px-3 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                      isHold
                        ? 'bg-[#FEF3C7] border-[#F59E0B]/50 text-[#B45309]'
                        : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {isHold ? '보류 중' : '오답보류'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onMarkMastered(q.id)}
                    className={`min-h-[44px] px-3 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                      isMastered
                        ? 'bg-[#ECFDF5] border-[#059669]/40 text-[#059669]'
                        : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {isMastered ? '해결됨' : '해결 완료'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
