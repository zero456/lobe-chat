import { and, asc, desc, eq } from 'drizzle-orm/expressions';

import { LobeChatDatabase } from '@/database/type';
import {
  AiModelSortMap,
  AiModelSourceEnum,
  AiProviderModelListItem,
  ToggleAiModelEnableParams,
} from '@/types/aiModel';

import { AiModelSelectItem, NewAiModelItem, aiModels } from '../../schemas';

export class AiModelModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  create = async (params: NewAiModelItem) => {
    const [result] = await this.db
      .insert(aiModels)
      .values({ ...params, userId: this.userId })
      .returning();

    return result;
  };

  delete = async (id: string) => {
    return this.db
      .delete(aiModels)
      .where(and(eq(aiModels.id, id), eq(aiModels.userId, this.userId)));
  };

  deleteAll = async () => {
    return this.db.delete(aiModels).where(eq(aiModels.userId, this.userId));
  };

  query = async () => {
    return this.db.query.aiModels.findMany({
      orderBy: [desc(aiModels.updatedAt)],
      where: eq(aiModels.userId, this.userId),
    });
  };

  getModelListByProviderId = async (providerId: string) => {
    const result = await this.db
      .select({
        abilities: aiModels.abilities,
        contextWindowTokens: aiModels.contextWindowTokens,
        description: aiModels.description,
        displayName: aiModels.displayName,
        enabled: aiModels.enabled,
        id: aiModels.id,
        pricing: aiModels.pricing,
        source: aiModels.source,
        type: aiModels.type,
      })
      .from(aiModels)
      .where(and(eq(aiModels.providerId, providerId), eq(aiModels.userId, this.userId)))
      .orderBy(
        asc(aiModels.sort),
        desc(aiModels.enabled),
        desc(aiModels.releasedAt),
        desc(aiModels.updatedAt),
      );

    return result as AiProviderModelListItem[];
  };

  findById = async (id: string) => {
    return this.db.query.aiModels.findFirst({
      where: and(eq(aiModels.id, id), eq(aiModels.userId, this.userId)),
    });
  };

  update = async (id: string, value: Partial<AiModelSelectItem>) => {
    return this.db
      .update(aiModels)
      .set({ ...value, updatedAt: new Date() })
      .where(and(eq(aiModels.id, id), eq(aiModels.userId, this.userId)));
  };

  toggleModelEnabled = async (value: ToggleAiModelEnableParams) => {
    return this.db
      .insert(aiModels)
      .values({ ...value, updatedAt: new Date(), userId: this.userId })
      .onConflictDoUpdate({
        set: { enabled: value.enabled, updatedAt: new Date() },
        target: [aiModels.id, aiModels.providerId, aiModels.userId],
      });
  };

  batchUpdateAiModels = async (providerId: string, models: AiModelSelectItem[]) => {
    return this.db.transaction(async (trx) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pools = models.map(async ({ id, providerId: _, ...model }) => {
        return trx
          .insert(aiModels)
          .values({ ...model, id, providerId, updatedAt: new Date(), userId: this.userId })
          .onConflictDoNothing({
            set: { ...model, updatedAt: new Date() },
            target: [aiModels.id, aiModels.userId, aiModels.providerId],
          });
      });

      await Promise.all(pools);
    });
  };

  clearRemoteModels(providerId: string) {
    return this.db
      .delete(aiModels)
      .where(
        and(
          eq(aiModels.providerId, providerId),
          eq(aiModels.source, AiModelSourceEnum.Remote),
          eq(aiModels.userId, this.userId),
        ),
      );
  }

  updateModelsOrder = async (providerId: string, sortMap: AiModelSortMap[]) => {
    await this.db.transaction(async (tx) => {
      const updates = sortMap.map(({ id, sort }) => {
        return tx
          .insert(aiModels)
          .values({
            enabled: true,
            id,
            providerId,
            sort,
            // source: isBuiltin ? 'builtin' : 'custom',
            updatedAt: new Date(),
            userId: this.userId,
          })
          .onConflictDoUpdate({
            set: { sort, updatedAt: new Date() },
            target: [aiModels.id, aiModels.userId, aiModels.providerId],
          });
      });

      await Promise.all(updates);
    });
  };
}
