// AI Model Configuration for OpenAI O3 Models
// Updated with correct model IDs from OpenAI documentation (2025-01-31)
// O3-mini: o3-mini-2025-01-31 | O3 Full: o3-2025-04-16

export interface AIModelConfig {
  model: string;
  reasoningEffort: 'low' | 'medium' | 'high';
  description: string;
  useCase: readonly string[];
}

// AI Model configurations for different use cases
export const AI_MODEL_CONFIGS = {
  // Fast responses for simple queries (RAG, quick questions)
  fast: {
    model: 'o3-mini-2025-01-31',
    reasoningEffort: 'low',
    description: 'Fast responses with basic reasoning (O3-mini)',
    useCase: ['simple queries', 'basic RAG', 'quick responses']
  },
  
  // Balanced performance for most tasks
  balanced: {
    model: 'o3-mini-2025-01-31', 
    reasoningEffort: 'medium',
    description: 'Balanced reasoning and performance (O3-mini)',
    useCase: ['general RAG', 'content analysis', 'moderate complexity tasks']
  },
  
  // High-quality reasoning for complex tasks
  premium: {
    model: 'o3-mini-2025-01-31',
    reasoningEffort: 'high', 
    description: 'Maximum reasoning quality for complex tasks (O3-mini)',
    useCase: ['article generation', 'complex analysis', 'multi-step reasoning', 'tool orchestration']
  },

  // Full O3 model for the most demanding tasks
  ultimate: {
    model: 'o3-2025-04-16',
    reasoningEffort: 'high',
    description: 'Ultimate reasoning capability with full O3 model',
    useCase: ['complex research', 'advanced analysis', 'critical decision making', 'enterprise applications']
  },
  
  // Fallback to GPT-4o for compatibility if needed
  fallback: {
    model: 'gpt-4o',
    reasoningEffort: 'medium', // Not applicable to GPT-4o but kept for consistency
    description: 'Fallback model for compatibility',
    useCase: ['compatibility mode', 'when O3 models are unavailable']
  }
} as const;

// Helper function to get provider options for AI SDK
export function getProviderOptions(config: AIModelConfig) {
  // Apply reasoning effort for both O3 model variants
  if (config.model.startsWith('o3-mini-') || config.model.startsWith('o3-')) {
    return {
      openai: {
        reasoningEffort: config.reasoningEffort
      }
    };
  }
  
  // Return undefined for other models (not empty object)
  return undefined;
}

// Convenience functions for common use cases
export const getRAGConfig = () => AI_MODEL_CONFIGS.balanced;
export const getArticleGenerationConfig = () => AI_MODEL_CONFIGS.premium;
export const getAssistantConfig = () => AI_MODEL_CONFIGS.premium;
export const getSimpleQueryConfig = () => AI_MODEL_CONFIGS.fast;
export const getUltimateConfig = () => AI_MODEL_CONFIGS.ultimate; // New function for full O3 model

// Environment-based configuration
export function getModelConfigForEnvironment() {
  const env = process.env.NODE_ENV;
  
  // Use faster models in development for quicker iteration
  if (env === 'development') {
    return AI_MODEL_CONFIGS.fast;
  }
  
  // Use balanced config in production for cost/performance balance
  return AI_MODEL_CONFIGS.balanced;
}

// Cost estimation helper (updated for O3 model pricing)
export function estimateTokenCost(configType: keyof typeof AI_MODEL_CONFIGS, inputTokens: number, outputTokens: number): number {
  const config = AI_MODEL_CONFIGS[configType];
  
  // Full O3 model pricing (higher tier)
  if (config.model.startsWith('o3-2025-')) {
    const rates = {
      low: { input: 0.00005, output: 0.00015 },    // Estimated full O3 rates
      medium: { input: 0.0001, output: 0.0003 },
      high: { input: 0.0002, output: 0.0006 }
    };
    const rate = rates[config.reasoningEffort];
    return inputTokens * rate.input + outputTokens * rate.output;
  }
  
  // O3-mini model pricing
  if (config.model.startsWith('o3-mini-')) {
    const rates = {
      low: { input: 0.000005, output: 0.000015 },
      medium: { input: 0.00001, output: 0.00003 },
      high: { input: 0.00002, output: 0.00006 }
        };
    const rate = rates[config.reasoningEffort];
    return inputTokens * rate.input + outputTokens * rate.output;
  }
  
  // GPT-4o fallback pricing
  return (inputTokens * 0.00001 + outputTokens * 0.00003);
}

export default AI_MODEL_CONFIGS;
