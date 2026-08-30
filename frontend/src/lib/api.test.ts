import { describe, it, expect, vi } from 'vitest';
import { askGeminiAnalyst } from './api';

// Mock global fetch
global.fetch = vi.fn();

describe('askGeminiAnalyst Error Handling', () => {
  it('should properly extract and return the backend error message on a 500 status', async () => {
    // This simulates the exact scenario: 
    // Backend returns 500 Internal Server Error, but the body contains `{"error": "..."}`
    const mockErrorResponse = { error: "Simulated backend error: Gemini API key is not configured" };
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => mockErrorResponse,
    });

    const result = await askGeminiAnalyst("test question");
    
    // Regression check: 
    // Before the fix, this threw an error or returned null, causing the UI to show a generic message.
    // After the fix, it cleanly catches the JSON error and embeds it into the returned state.
    expect(result).not.toBeNull();
    expect(result?.success).toBe(false);
    expect(result?.error).toBe("Simulated backend error: Gemini API key is not configured");
  });
});
