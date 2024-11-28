'use client';

import { Divider } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';


import ModelList from '../../features/ModelList';
import ProviderConfig, { ProviderConfigProps } from '../../features/ProviderConfig';

const ProviderDetail = memo<ProviderConfigProps>((card) => {
  return (
    <Flexbox gap={24} paddingBlock={8}>
      <ProviderConfig {...card} />
      <Divider dashed style={{ margin: 0 }} />
      <ModelList id={card.id} {...card.modelList} />
    </Flexbox>
  );
});

export default ProviderDetail;
