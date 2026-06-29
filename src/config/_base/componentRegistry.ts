import type { ComponentRegistry } from '../../types/config';
import RichTextIntro from '../../registry/components/RichTextIntro';
import ElasticSpace from '../../registry/components/ElasticSpace';
import PlaceholderCard from '../../registry/components/PlaceholderCard';

const componentRegistry: ComponentRegistry = {
  RichTextIntro: {
    component: RichTextIntro,
    schema: {
      tag: { type: 'string', label: '标签文字' },
      lines: { type: 'text', label: '多行文字' },
      avatar: { type: 'image', label: '头像' },
    },
  },
  ElasticSpace: {
    component: ElasticSpace,
    schema: {},
  },
  PlaceholderCard: {
    component: PlaceholderCard,
    schema: {
      sectionId: { type: 'string', label: 'Section ID' },
      title: { type: 'string', label: '标题' },
      subtitle: { type: 'string', label: '副标题' },
    },
  },
};

export default componentRegistry;