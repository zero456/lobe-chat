import { ModelIcon } from '@lobehub/icons';
import { ActionIcon, Tag, copyToClipboard } from '@lobehub/ui';
import { Switch, Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { LucideSettings } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { ModelInfoTags } from '@/components/ModelSelect';
import { aiModelSelectors, useAiInfraStore } from '@/store/aiInfra';
import { AiProviderModelListItem, ChatModelPricing } from '@/types/aiModel';

import ModelConfigModal from './ModelConfigModal';

export const useStyles = createStyles(({ css, token, cx }) => {
  const config = css`
    transition: all 100ms ease-in-out;
    opacity: 0;
  `;

  return {
    config,
    container: css`
      border-radius: 12px;

      transition: all 200ms ease-in-out;

      &:hover {
        background-color: ${token.colorFillTertiary};

        .${cx(config)} {
          opacity: 1;
        }
      }

      position: relative;
    `,
    desc: css`
      flex: 1;
      min-width: 0;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  };
});

interface ModelItemProps extends AiProviderModelListItem {
  enabled: boolean;
  id: string;
  isAzure?: boolean;
  pricing?: ChatModelPricing;
  releasedAt?: string;
  removed?: boolean;
}

const ModelItem = memo<ModelItemProps>(
  ({
    displayName,
    id,
    enabled,
    // removed,
    releasedAt,
    pricing,
    source,
    contextWindowTokens,
    abilities,
  }) => {
    const { styles } = useStyles();
    const { t } = useTranslation(['modelProvider', 'components', 'models']);
    const theme = useTheme();

    const [isModelLoading, toggleModelEnabled] = useAiInfraStore((s) => [
      aiModelSelectors.isModelLoading(id)(s),
      s.toggleModelEnabled,
    ]);

    const [checked, setChecked] = useState(enabled);
    const [showConfig, setShowConfig] = useState(false);
    const content = [
      releasedAt && `发布于${releasedAt}`,
      typeof pricing?.input !== 'undefined' ? `输入 $${pricing?.input} /M` : undefined,
      typeof pricing?.output !== 'undefined' ? `输出 $${pricing?.output} /M` : undefined,
    ].filter(Boolean) as string[];

    return (
      <Flexbox
        align={'center'}
        className={styles.container}
        gap={24}
        horizontal
        justify={'space-between'}
        padding={12}
        width={'100%'}
      >
        <Flexbox align={'center'} flex={1} gap={8} horizontal style={{ minWidth: 0 }}>
          <ModelIcon model={id} size={32} />
          <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
            <Flexbox align={'center'} gap={8} horizontal>
              {displayName || id}
              <Tag
                onClick={() => {
                  copyToClipboard(id);
                }}
                style={{ cursor: 'pointer', marginRight: 0 }}
              >
                {id}
              </Tag>
              <div className={styles.config}>
                <ActionIcon
                  icon={LucideSettings}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfig(true);
                  }}
                  size={'small'}
                  title={t('providerModels.item.config')}
                />
              </div>
              {showConfig && <ModelConfigModal id={id} open={showConfig} setOpen={setShowConfig} />}
            </Flexbox>
            <Flexbox align={'baseline'} gap={8} horizontal>
              {content.length > 0 && (
                <Typography.Text
                  style={{ color: theme.colorTextSecondary, fontSize: 12, marginBottom: 0 }}
                >
                  {content.join(' · ')}
                </Typography.Text>
              )}
            </Flexbox>
          </Flexbox>
        </Flexbox>
        <Flexbox align={'center'} gap={8} horizontal>
          <ModelInfoTags
            placement={'top'}
            {...abilities}
            contextWindowTokens={contextWindowTokens}
          />
          {/*{removed && (*/}
          {/*  <Tooltip*/}
          {/*    overlayStyle={{ maxWidth: 300 }}*/}
          {/*    placement={'top'}*/}
          {/*    style={{ pointerEvents: 'none' }}*/}
          {/*    title={t('ModelSelect.removed')}*/}
          {/*  >*/}
          {/*    <ActionIcon icon={Recycle} style={{ color: theme.colorWarning }} />*/}
          {/*  </Tooltip>*/}
          {/*)}*/}
          <Switch
            checked={checked}
            loading={isModelLoading}
            onChange={async (e) => {
              setChecked(e);
              await toggleModelEnabled({ enabled: e, id, source });
            }}
            size={'small'}
          />
        </Flexbox>
      </Flexbox>
    );
  },
);

export default ModelItem;
