// 封装 localStorage 操作
export const storage = {
  get(key: string) {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  },

  set(key: string, value: string | number | boolean | object) {
    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : String(value)
    );
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};
