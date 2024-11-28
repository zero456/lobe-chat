import { AIChatModelCard } from '@/types/aiModel';

// ref: https://platform.deepseek.com/api-docs/pricing
const deepseekChatModels: AIChatModelCard[] = [
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 65_536,
    description:
      '融合通用与代码能力的全新开源模型, 不仅保留了原有 Chat 模型的通用对话能力和 Coder 模型的强大代码处理能力，还更好地对齐了人类偏好。此外，DeepSeek-V2.5 在写作任务、指令跟随等多个方面也实现了大幅提升。',
    displayName: 'DeepSeek V2.5',
    enabled: true,
    id: 'deepseek-chat',
    pricing: {
      cachedInput: 0.1,
      currency: 'CNY',
      input: 1,
      output: 2,
    },
    releasedAt: '2024-09-05',
  },
];

export const allModels = [...deepseekChatModels];

export default allModels;
