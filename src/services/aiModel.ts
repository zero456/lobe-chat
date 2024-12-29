import { lambdaClient } from '@/libs/trpc/client';
import {
  AiModelSortMap,
  AiProviderModelListItem,
  CreateAiModelParams,
  ToggleAiModelEnableParams,
} from '@/types/aiModel';

class AiModelService {
  createAiModel = async (params: CreateAiModelParams) => {
    return lambdaClient.aiModel.createAiModel.mutate(params);
  };

  getAiProviderModelList = async (id: string): Promise<AiProviderModelListItem[]> => {
    return lambdaClient.aiModel.getAiProviderModelList.query({ id });
  };

  getAiModelById = async (id: string) => {
    return lambdaClient.aiModel.getAiModelById.query({ id });
  };

  toggleModelEnabled = async (params: ToggleAiModelEnableParams) => {
    return lambdaClient.aiModel.toggleModelEnabled.mutate(params);
  };

  updateAiModel = async (id: string, value: any) => {
    return lambdaClient.aiModel.updateAiModel.mutate({ id, value });
  };

  batchUpdateAiModels = async (id: string, models: AiProviderModelListItem[]) => {
    return lambdaClient.aiModel.batchUpdateAiModels.mutate({ id, models });
  };

  clearRemoteModels = async (providerId: string) => {
    return lambdaClient.aiModel.clearRemoteModels.mutate({ providerId });
  };

  updateAiModelOrder = async (providerId: string, items: AiModelSortMap[]) => {
    return lambdaClient.aiModel.updateAiModelOrder.mutate({ providerId, sortMap: items });
  };

  deleteAiModel = async (id: string) => {
    return lambdaClient.aiModel.removeAiModel.mutate({ id });
  };
}

export const aiModelService = new AiModelService();
