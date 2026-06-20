import type { ComponentProps } from '../types/config';

const ComponentRegistry: Record<string, React.ComponentType<{ props: ComponentProps; actions?: unknown[]; dispatch?: (a: unknown) => void }>> = {};

export function registerComponent(
  name: string,
  component: React.ComponentType<{ props: ComponentProps; actions?: unknown[]; dispatch?: (a: unknown) => void }>
): void {
  ComponentRegistry[name] = component;
}

export function getComponent(name: string) {
  return ComponentRegistry[name] || null;
}

export default ComponentRegistry;