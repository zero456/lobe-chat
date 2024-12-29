import { AIChatModelCard } from '@/types/aiModel';

import { mergeArrayById } from './merge';
import {expect} from "vitest";

const openaiChatModels: AIChatModelCard[] = [
  {
    contextWindowTokens: 128_000,
    description:
      'o1-mini是一款针对编程、数学和科学应用场景而设计的快速、经济高效的推理模型。该模型具有128K上下文和2023年10月的知识截止日期。',
    displayName: 'OpenAI o1-mini',
    enabled: true,
    id: 'o1-mini',
    maxOutput: 65_536,
    pricing: {
      input: 3,
      output: 12,
    },
    releasedAt: '2024-09-12',
    type: 'chat',
  },
  {
    contextWindowTokens: 128_000,
    description:
      'o1是OpenAI新的推理模型，适用于需要广泛通用知识的复杂任务。该模型具有128K上下文和2023年10月的知识截止日期。',
    displayName: 'OpenAI o1-preview',
    enabled: true,
    id: 'o1-preview',
    maxOutput: 32_768,
    pricing: {
      input: 15,
      output: 60,
    },
    releasedAt: '2024-09-12',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 128_000,
    description:
      'GPT-4o mini是OpenAI在GPT-4 Omni之后推出的最新模型，支持图文输入并输出文本。作为他们最先进的小型模型，它比其他近期的前沿模型便宜很多，并且比GPT-3.5 Turbo便宜超过60%。它保持了最先进的智能，同时具有显著的性价比。GPT-4o mini在MMLU测试中获得了 82% 的得分，目前在聊天偏好上排名高于 GPT-4。',
    displayName: 'GPT-4o mini',
    enabled: true,
    id: 'gpt-4o-mini',
    maxOutput: 16_385,
    pricing: {
      input: 0.15,
      output: 0.6,
    },
    type: 'chat',
  },
];

describe('mergeArrayById', () => {
  it('should merge data', () => {
    const data = mergeArrayById(openaiChatModels, [
      { id: 'o1-mini', displayName: 'OpenAI o1-mini ABC' },
    ]);
    console.log(data);

    expect(data).toEqual([])
  });
});
