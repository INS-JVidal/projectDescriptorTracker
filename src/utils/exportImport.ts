import type { ExportData } from '../types';

/**
 * Validate that imported data has the correct structure
 */
export function validateExportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check required fields
  if (typeof obj.version !== 'string') return false;
  if (typeof obj.exportedAt !== 'string') return false;
  if (!obj.project || typeof obj.project !== 'object') return false;

  const project = obj.project as Record<string, unknown>;
  if (typeof project.id !== 'string') return false;
  if (typeof project.name !== 'string') return false;

  // Check arrays exist
  if (!Array.isArray(obj.categories)) return false;
  if (!Array.isArray(obj.subcategories)) return false;
  if (!Array.isArray(obj.requirements)) return false;
  if (!Array.isArray(obj.implementationNodes)) return false;

  return true;
}

/**
 * Download a JSON string as a file
 */
export function downloadJson(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a filename for export
 */
export function generateExportFilename(projectName: string): string {
  const sanitizedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const date = new Date().toISOString().split('T')[0];
  return `destrack-${sanitizedName}-${date}.json`;
}

/**
 * Read a file and return its contents as a string
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Parse JSON safely, returning null on error
 */
export function parseJsonSafe<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Check if the browser supports the required APIs
 */
export function checkBrowserSupport(): { supported: boolean; missing: string[] } {
  const missing: string[] = [];

  if (typeof localStorage === 'undefined') {
    missing.push('localStorage');
  }

  if (typeof Blob === 'undefined') {
    missing.push('Blob');
  }

  if (typeof FileReader === 'undefined') {
    missing.push('FileReader');
  }

  return {
    supported: missing.length === 0,
    missing,
  };
}
