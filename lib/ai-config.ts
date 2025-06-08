// AI Model Configuration for OpenAI o3-mini
// Based on ChatGPT recommendation to use o3-mini with tunable reasoning effort

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
    model: 'o3-mini',
    reasoningEffort: 'low',
    description: 'Fast responses with basic reasoning',
    useCase: ['simple queries', 'basic RAG', 'quick responses']
  },
  
  // Balanced performance for most tasks
  balanced: {
    model: 'o3-mini', 
    reasoningEffort: 'medium',
    description: 'Balanced reasoning and performance',
    useCase: ['general RAG', 'content analysis', 'moderate complexity tasks']
  },
  
  // High-quality reasoning for complex tasks
  premium: {
    model: 'o3-mini',
    reasoningEffort: 'high', 
    description: 'Maximum reasoning quality for complex tasks',
    useCase: ['article generation', 'complex analysis', 'multi-step reasoning', 'tool orchestration']
  },
  
  // Fallback to GPT-4o for compatibility if needed
  fallback: {
    model: 'gpt-4o',
    reasoningEffort: 'medium', // Not applicable to GPT-4o but kept for consistency
    description: 'Fallback model for compatibility',
    useCase: ['compatibility mode', 'when o3-mini is unavailable']
  }
} as const;

// Helper function to get provider options for AI SDK
export function getProviderOptions(config: AIModelConfig) {
  // Only apply reasoning effort for o3-mini models
  if (config.model === 'o3-mini') {
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

// Cost estimation helper (based on OpenAI o3-mini pricing)
export function estimateTokenCost(configType: keyof typeof AI_MODEL_CONFIGS, inputTokens: number, outputTokens: number): number {
  const config = AI_MODEL_CONFIGS[configType];
  
  if (config.model !== 'o3-mini') {
    // Rough GPT-4o pricing for comparison
    return (inputTokens * 0.00001 + outputTokens * 0.00003);
  }
  
  // o3-mini pricing varies by reasoning effort
  // These are example rates - adjust based on actual OpenAI pricing
  const rates = {
    low: { input: 0.000005, output: 0.000015 },
    medium: { input: 0.00001, output: 0.00003 },
    high: { input: 0.00002, output: 0.00006 }
  };
  
  const rate = rates[config.reasoningEffort];
  return inputTokens * rate.input + outputTokens * rate.output;
}

export default AI_MODEL_CONFIGS;
