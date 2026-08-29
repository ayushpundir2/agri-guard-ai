import React, { useState } from 'react';
import { askGeminiAnalyst, AIAnalysisResult } from '@/lib/api';
import { Bot, Send, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-xl flex flex-col gap-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              ASK AGRIGUARD ANALYST
            </h3>
            <p className="text-[10px] text-slate-400">
              AI-assisted city resilience reasoning layer
            </p>
          </div>
        </div>

        {/* Context indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {activeDisasterName ? `Scenario: ${activeDisasterName}` : 'Baseline Normal'}
          </span>
          {overallRiskScore !== undefined && overallRiskScore !== null && (
            <span className="font-bold text-amber-400">| Risk: {overallRiskScore}/100</span>
          )}
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleAsk(q)}
            disabled={loading}
            className="px-2.5 py-1 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition cursor-pointer text-[10px]"
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
          className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {loading ? 'REASONING...' : 'ANALYZE'}
        </button>
      </form>

      {/* Gemini Analysis Output */}
      {result && result.analysis && (
        <div className="bg-slate-950/80 border border-indigo-900/60 p-4 rounded-lg space-y-3 mt-1 text-slate-200">
          <div>
            <span className="text-[10px] text-indigo-400 uppercase font-bold block mb-1">
              Executive Overview
            </span>
            <p className="text-xs leading-relaxed font-sans">{result.analysis.summary}</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Analytical Reasoning
            </span>
            <p className="text-xs leading-relaxed text-slate-300 font-sans">{result.analysis.reasoning}</p>
          </div>

          {result.analysis.recommended_actions && result.analysis.recommended_actions.length > 0 && (
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                Recommended Priority Actions
              </span>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside font-sans">
                {result.analysis.recommended_actions.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-400/80 leading-tight">
            <strong>Methodology Disclaimer:</strong> {result.analysis.caveats}
          </div>
        </div>
      )}
    </div>
  );
}
