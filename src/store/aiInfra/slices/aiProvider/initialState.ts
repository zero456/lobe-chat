import { AiProviderDetailItem, AiProviderListItem } from '@/types/aiProvider';

export interface AIProviderState {
  activeAiProvider?: string;
  activeProviderModelList: any[];
  aiProviderDetail?: AiProviderDetailItem | null;
  aiProviderList: AiProviderListItem[];
  aiProviderLoadingIds: string[];
  // providerDetailLoading
  initAiProviderList: boolean;
  providerSearchKeyword: string;
}

export const initialAIProviderState: AIProviderState = {
  activeProviderModelList: [],
  aiProviderList: [],
  aiProviderLoadingIds: [],
  initAiProviderList: false,
  providerSearchKeyword: '',
};
