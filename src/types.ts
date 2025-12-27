/* User URLs */
export interface UrlItem {
  id: number;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
}

/* Analytics for a single URL */
export interface Analytics {
  id: number;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
}
