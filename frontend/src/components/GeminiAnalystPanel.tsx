import React, { useState } from 'react';
import { askGeminiAnalyst, AIAnalysisResult } from '@/lib/api';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';

interface GeminiAnalystPanelProps {
  activeDisasterName?: string | null;
  overallRiskScore?: number | null;
  riskLevel?: string | null;
  parcelId?: string;
  marketId?: string;
}

const SUGGESTED_QUESTIONS = [
  'What should the city prioritize?',
  'Why is the food-supply risk HIGH?',
  'Which wholesale markets are most exposed?',
  'What are the most urgent recovery actions?'
];

export default function GeminiAnalystPanel({
  activeDisasterName,
  overallRiskScore,
  riskLevel,
  parcelId,
  marketId
}: GeminiAnalystPanelProps) {
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const handleAsk = async (qText: string) => {
    if (!qText.trim()) return;
    setLoading(true);
    setQuestion(qText);
    const res = await askGeminiAnalyst(qText, parcelId, marketId);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="bg-civic-card border border-civic-neutral p-5 rounded-2xl shadow-sm flex flex-col gap-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-civic-neutral pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-civic-forest" />
          <div>
            <h3 className="text-sm font-bold text-civic-forest uppercase tracking-wider">
              ASK AGRIGUARD ANALYST
            </h3>
            <p className="text-[10px] text-civic-charcoal/70 font-sans">
              AI-assisted city resilience reasoning layer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-civic-ivory border border-civic-neutral text-[10px] text-civic-charcoal">
          <ShieldCheck className="w-3.5 h-3.5 text-civic-leaf" />
          <span>
            {activeDisasterName ? `Scenario: ${activeDisasterName}` : 'Baseline Normal'}
          </span>
          {overallRiskScore !== undefined && overallRiskScore !== null && (
            <span className="font-bold text-civic-terracotta">| Risk: {overallRiskScore}/100</span>
          )}
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-1.5 font-sans">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleAsk(q)}
            disabled={loading}
            className="px-2.5 py-1 bg-civic-ivory hover:bg-civic-neutral/60 border border-civic-neutral rounded-lg text-civic-charcoal transition cursor-pointer text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(question);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Gemini about food risks, market impact, or recovery actions..."
          disabled={loading}
          className="flex-1 bg-civic-ivory border border-civic-neutral text-civic-charcoal rounded-xl px-3 py-2 text-xs outline-none focus:border-civic-forest font-sans"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-civic-forest hover:bg-civic-leaf text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 text-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {loading ? 'REASONING...' : 'ANALYZE'}
        </button>
      </form>

      {/* Gemini Analysis Output */}
      {result && result.analysis && (
        <div className="bg-civic-ivory/80 border border-civic-neutral p-4 rounded-xl space-y-3 mt-1 text-civic-charcoal font-sans">
          <div>
            <span className="text-[10px] text-civic-forest uppercase font-mono font-bold block mb-1">
              Executive Overview
            </span>
            <p className="text-xs leading-relaxed">{result.analysis.summary}</p>
          </div>

          <div>
            <span className="text-[10px] text-civic-charcoal/70 uppercase font-mono font-bold block mb-1">
              Analytical Reasoning
            </span>
            <p className="text-xs leading-relaxed text-civic-charcoal/90">{result.analysis.reasoning}</p>
          </div>

          {result.analysis.recommended_actions && result.analysis.recommended_actions.length > 0 && (
            <div>
              <span className="text-[10px] text-civic-leaf uppercase font-mono font-bold block mb-1">
                Recommended Priority Actions
              </span>
              <ul className="space-y-1 text-xs list-disc list-inside">
                {result.analysis.recommended_actions.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-civic-neutral text-[10px] text-civic-saffron font-mono leading-tight">
            <strong>Methodology Disclaimer:</strong> {result.analysis.caveats}
          </div>
        </div>
      )}
    </div>
  );
}
