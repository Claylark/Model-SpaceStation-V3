import type { AppConfig } from '../types/config';
import { apiClient } from './apiClient';

// 🔒 预留：配置 CRUD 接口
export async function fetchAppConfig(): Promise<AppConfig> {
  return apiClient.get('/api/config');
}

export async function saveAppConfig(config: AppConfig): Promise<void> {
  await apiClient.put('/api/config', config);
}

export async function publishAppConfig(): Promise<void> {
  await apiClient.post('/api/config/publish', {});
}