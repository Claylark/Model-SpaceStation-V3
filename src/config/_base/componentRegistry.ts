import type { ComponentRegistry } from '../../types/config';

// 组件注册表：名字 → 组件映射
// 在 App.tsx 中初始化时会注入实际的 React 组件
const componentRegistry: ComponentRegistry = {};

export default componentRegistry;