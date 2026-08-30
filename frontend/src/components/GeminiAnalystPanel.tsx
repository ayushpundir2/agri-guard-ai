'use client';

import React, { useState } from 'react';
import { askGeminiAnalyst, AIAnalysisResult, ChatMessage } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { Bot, Sparkles, ShieldCheck, AlertCircle, Send, CheckCircle2, FileText, ListChecks } from 'lucide-react';

interface GeminiAnalystPanelProps {
  activeDisasterName?: string | null;
  overallRiskScore?: number | null;
  riskLevel?: string | null;
  parcelId?: string;
  marketId?: string;
}

export interface ConversationTurn {
  id: string;
  question: string;
  loading: boolean;
  error?: string | null;
  result?: AIAnalysisResult | null;
}

export default function GeminiAnalystPanel({
  activeDisasterName,
  overallRiskScore,
  riskLevel,
  parcelId,
  marketId
}: GeminiAnalystPanelProps) {
  const { language, t } = useLanguage();
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const suggestedQuestions = [
    t('ai.suggested.cityPrioritize', 'What should the city prioritize right now?'),
    t('ai.suggested.whyCritical', 'Why is the food-supply risk HIGH?'),
    t('ai.suggested.exposedMarkets', 'Which wholesale market is most exposed?'),
    t('ai.suggested.recoverFirst', 'Which agricultural parcel should we recover first?'),
    t('ai.suggested.floodImpact', 'What are the consequences of the current flood scenario?')
  ];

  const handleAsk = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setInputQuestion('');

    const turnId = `turn-${Date.now()}`;
    const newTurn: ConversationTurn = {
      id: turnId,
      question: trimmed,
      loading: true
    };

    setTurns((prev) => [...prev, newTurn]);

    // Build history for backend context
    const historyPayload: ChatMessage[] = turns.flatMap((turn) => {
      if (!turn.result?.analysis) return [];
      return [
        { role: 'user', content: turn.question },
        { role: 'assistant', content: `${turn.result.analysis.summary} ${turn.result.analysis.reasoning}` }
      ];
    });

    try {
      const res = await askGeminiAnalyst(
        trimmed,
        parcelId,
        marketId,
        language,
        historyPayload
      );

      setTurns((prev) =>
        prev.map((t) => {
          if (t.id === turnId) {
            return {
              ...t,
              loading: false,
              result: res,
              error: res?.error || (!res?.analysis?.summary && !res?.analysis?.reasoning ? 'Information is currently unavailable.' : null)
            };
          }
          return t;
        })
      );
    } catch (err: any) {
      setTurns((prev) =>
        prev.map((t) => {
          if (t.id === turnId) {
            return {
              ...t,
              loading: false,
              error: err.message || 'Failed to connect to AgriGuard Analyst service.'
            };
          }
          return t;
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-civic-card border border-civic-neutral p-6 rounded-2xl shadow-civic flex flex-col gap-5 font-mono text-xs" style={{ minHeight: 'calc(100vh - 200px)' }}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-civic-neutral pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-civic-forest text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-civic-forest uppercase tracking-wider font-sans">
              {t('ai.askAgriGuard', 'Ask AgriGuard Analyst')}
            </h3>
            <p className="text-[11px] text-civic-charcoal/70 font-sans">
              {t('ai.subtitle', 'AI-assisted city resilience reasoning layer')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-ivory border border-civic-neutral text-[11px] text-civic-charcoal">
          <ShieldCheck className="w-4 h-4 text-civic-leaf" />
          <span>
            {activeDisasterName ? `Scenario: ${activeDisasterName}` : t('states.normal', 'Normal Conditions')}
          </span>
          {overallRiskScore !== undefined && overallRiskScore !== null && (
            <span className="font-bold text-civic-terracotta">| Risk: {overallRiskScore}/100</span>
          )}
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-civic-charcoal/60 tracking-wider font-sans block">
          Suggested Intelligence Inquiries:
        </span>
        <div className="flex flex-wrap gap-2 font-sans">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              disabled={isSubmitting}
              type="button"
              className="px-3 py-1.5 bg-civic-ivory hover:bg-civic-neutral/70 border border-civic-neutral rounded-xl text-civic-charcoal transition cursor-pointer text-xs disabled:opacity-50 text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread - scrollable, grows to fill available space */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: '280px' }}>
        {turns.map((turn) => (
            <div key={turn.id} className="space-y-3 border-t border-civic-neutral/60 pt-4 font-sans">
              {/* User Question */}
              <div className="flex items-start gap-3 bg-civic-ivory p-3.5 rounded-xl border border-civic-neutral">
                <span className="text-base">👤</span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-civic-leaf block mb-0.5">
                    Query
                  </span>
                  <p className="text-xs font-semibold text-civic-forest">{turn.question}</p>
                </div>
              </div>

              {/* Loading Indicator */}
              {turn.loading && (
                <div className="p-4 bg-civic-ivory/50 rounded-xl border border-civic-neutral/60 flex items-center gap-3 text-civic-charcoal/70">
                  <div className="w-4 h-4 border-2 border-civic-forest border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-xs font-bold text-civic-forest">
                    {t('ai.reasoning', 'Synthesizing food-system data & reasoning...')}
                  </span>
                </div>
              )}

              {/* Error State */}
              {turn.error && !turn.loading && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs">Response Error</p>
                    <p className="text-xs">{turn.error}</p>
                  </div>
                </div>
              )}

              {/* Structured AI Answer */}
              {turn.result?.analysis && (turn.result.analysis.summary || turn.result.analysis.reasoning) && !turn.loading && !turn.error && (
                <div className="bg-civic-white border border-civic-neutral p-5 rounded-2xl shadow-xs space-y-4">
                  {/* Section 1: Executive Answer */}
                  <div className="space-y-1.5 bg-civic-ivory/60 p-3.5 rounded-xl border border-civic-neutral/60">
                    <div className="flex items-center gap-2 text-civic-forest font-mono text-[11px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-civic-leaf" />
                      <span>{t('ai.analysis', 'ANSWER / EXECUTIVE OVERVIEW')}</span>
                    </div>
                    <p className="text-xs text-civic-charcoal font-medium leading-relaxed">
                      {turn.result.analysis.summary}
                    </p>
                  </div>

                  {/* Section 2: Key Evidence */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-civic-charcoal/80 font-mono text-[11px] font-bold uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-civic-forest" />
                      <span>{t('ai.keyEvidence', 'KEY EVIDENCE & REASONING')}</span>
                    </div>
                    <p className="text-xs text-civic-charcoal/90 leading-relaxed pl-6">
                      {turn.result.analysis.reasoning}
                    </p>
                  </div>

                  {/* Section 3: Recommended Action */}
                  {turn.result.analysis.recommended_actions && turn.result.analysis.recommended_actions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-civic-leaf font-mono text-[11px] font-bold uppercase tracking-wider">
                        <ListChecks className="w-4 h-4 text-civic-leaf" />
                        <span>{t('ai.recommendedAction', 'RECOMMENDED ACTIONS')}</span>
                      </div>
                      <ul className="space-y-1.5 pl-6">
                        {turn.result.analysis.recommended_actions.map((act, idx) => (
                          <li key={idx} className="text-xs text-civic-charcoal leading-relaxed flex items-start gap-2">
                            <span className="font-mono font-bold text-civic-forest text-[11px]">{idx + 1}.</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Disclaimer Footer */}
                  <div className="pt-3 border-t border-civic-neutral text-[10px] text-civic-saffron font-mono leading-tight">
                    <strong>{t('ai.disclaimer', 'Methodology Disclaimer')}:</strong> {turn.result.analysis.caveats}
                  </div>
                </div>
              )}
            </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(inputQuestion);
        }}
        className="flex gap-3 pt-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={t('ai.placeholder', 'Ask AgriGuard about food risks, market impact, or recovery actions...')}
          disabled={isSubmitting}
          aria-label="Ask food resilience question"
          className="flex-1 bg-civic-ivory border border-civic-neutral text-civic-charcoal rounded-xl px-4 py-3 text-xs outline-none focus:border-civic-forest font-sans shadow-xs transition"
        />
        <button
          type="submit"
          disabled={isSubmitting || !inputQuestion.trim()}
          className="flex items-center gap-2 px-5 py-3 bg-civic-forest hover:bg-civic-leaf text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 text-xs font-mono shadow-xs shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? t('actions.analyze', 'ANALYZING...').toUpperCase() : t('actions.analyze', 'ANALYZE')}</span>
        </button>
      </form>
    </div>
  );
}
