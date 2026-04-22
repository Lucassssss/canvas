const API_BASE = 'http://127.0.0.1:4001/api';

export interface EnvConfig {
  id: string;
  cli_args: Record<string, string>;
}

export const browserApi = {
  /**
   * 启动浏览器环境
   */
  start: async (env: EnvConfig) => {
    const res = await fetch(`${API_BASE}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(env),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to start browser');
    }
    return res.json();
  },

  /**
   * 停止浏览器环境
   */
  stop: async (id: string) => {
    const res = await fetch(`${API_BASE}/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to stop browser');
    }
    return res.json();
  },

  /**
   * 获取正在运行的浏览器环境状态
   */
  getStatus: async () => {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch status');
    }
    return res.json() as Promise<{ success: boolean; runningEnvs: string[] }>;
  }
};
