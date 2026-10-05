import {
  DesignItem,
  DesignDna,
  PromptStudioSelections,
  GeneratedPromptResult,
  BackupPayload,
  BackupValidationResult,
  BackupImportMode,
  BackupImportSummary,
} from '../types';

const DB_NAME = 'designdna_studio_db';
const DB_VERSION = 1;
const STORE_DESIGNS = 'designs';
const STORE_KEYVAL = 'keyval';

// IndexedDB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_DESIGNS)) {
        db.createObjectStore(STORE_DESIGNS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_KEYVAL)) {
        db.createObjectStore(STORE_KEYVAL);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Memory fallback cache in case browser storage is sandboxed
const memoryCache: {
  designs: Map<string, DesignItem>;
  keyval: Map<string, any>;
} = {
  designs: new Map(),
  keyval: new Map(),
};

export const storage = {
  // --- DESIGNS ---
  async getAllDesigns(): Promise<DesignItem[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_DESIGNS, 'readonly');
        const store = tx.objectStore(STORE_DESIGNS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback: localStorage or memory
      try {
        const raw = localStorage.getItem('ddna_designs');
        if (raw) return JSON.parse(raw);
      } catch {}
      return Array.from(memoryCache.designs.values());
    }
  },

  async getDesign(id: string): Promise<DesignItem | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_DESIGNS, 'readonly');
        const store = tx.objectStore(STORE_DESIGNS);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      const list = await this.getAllDesigns();
      return list.find((d) => d.id === id) || null;
    }
  },

  async saveDesign(design: DesignItem): Promise<void> {
    memoryCache.designs.set(design.id, design);
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_DESIGNS, 'readwrite');
        const store = tx.objectStore(STORE_DESIGNS);
        const req = store.put(design);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to localStorage without breaking
      try {
        const all = await this.getAllDesigns();
        const index = all.findIndex((d) => d.id === design.id);
        if (index >= 0) all[index] = design;
        else all.unshift(design);
        localStorage.setItem('ddna_designs', JSON.stringify(all));
      } catch (e) {
        console.warn('LocalStorage quota or access limitation for designs:', e);
      }
    }
  },

  async deleteDesign(id: string): Promise<void> {
    memoryCache.designs.delete(id);
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_DESIGNS, 'readwrite');
        const store = tx.objectStore(STORE_DESIGNS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      try {
        const all = await this.getAllDesigns();
        const filtered = all.filter((d) => d.id !== id);
        localStorage.setItem('ddna_designs', JSON.stringify(filtered));
      } catch {}
    }
  },

  async clearAllDesigns(): Promise<void> {
    memoryCache.designs.clear();
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_DESIGNS, 'readwrite');
        const store = tx.objectStore(STORE_DESIGNS);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      try {
        localStorage.removeItem('ddna_designs');
      } catch {}
    }
  },

  // --- DESIGN DNA ---
  async getDesignDna(): Promise<DesignDna | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_KEYVAL, 'readonly');
        const store = tx.objectStore(STORE_KEYVAL);
        const req = store.get('design_dna');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      try {
        const raw = localStorage.getItem('ddna_dna');
        if (raw) return JSON.parse(raw);
      } catch {}
      return memoryCache.keyval.get('design_dna') || null;
    }
  },

  async saveDesignDna(dna: DesignDna): Promise<void> {
    memoryCache.keyval.set('design_dna', dna);
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_KEYVAL, 'readwrite');
        const store = tx.objectStore(STORE_KEYVAL);
        const req = store.put(dna, 'design_dna');
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      try {
        localStorage.setItem('ddna_dna', JSON.stringify(dna));
      } catch {}
    }
  },

  // --- PROMPT STUDIO STATE ---
  async getPromptStudioSelections(): Promise<PromptStudioSelections | null> {
    try {
      const raw = localStorage.getItem('ddna_prompt_selections');
      if (raw) return JSON.parse(raw);
    } catch {}
    return memoryCache.keyval.get('prompt_selections') || null;
  },

  async savePromptStudioSelections(selections: PromptStudioSelections): Promise<void> {
    memoryCache.keyval.set('prompt_selections', selections);
    try {
      localStorage.setItem('ddna_prompt_selections', JSON.stringify(selections));
    } catch {}
  },

  // --- PROMPT STUDIO LAST GENERATED RESULT ---
  async getLastPromptResult(): Promise<GeneratedPromptResult | null> {
    try {
      const raw = localStorage.getItem('ddna_last_prompt');
      if (raw) return JSON.parse(raw);
    } catch {}
    return memoryCache.keyval.get('last_prompt') || null;
  },

  async saveLastPromptResult(result: GeneratedPromptResult | null): Promise<void> {
    memoryCache.keyval.set('last_prompt', result);
    try {
      if (!result) localStorage.removeItem('ddna_last_prompt');
      else localStorage.setItem('ddna_last_prompt', JSON.stringify(result));
    } catch {}
  },

  // --- BACKUP & RESTORE ---
  getLastBackupTimestamp(): string | null {
    try {
      return localStorage.getItem('ddna_last_backup_at');
    } catch {
      return null;
    }
  },

  recordBackupTimestamp(): string {
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem('ddna_last_backup_at', timestamp);
    } catch {}
    return timestamp;
  },

  /**
   * Constructs a complete, self-contained JSON backup payload of all library data.
   */
  async exportBackup(): Promise<BackupPayload> {
    const designs = await this.getAllDesigns();
    const designDna = await this.getDesignDna();
    const promptSelections = await this.getPromptStudioSelections();
    const lastPromptResult = await this.getLastPromptResult();

    const timestamp = this.recordBackupTimestamp();

    const payload: BackupPayload = {
      format: 'designdna-backup',
      version: 1,
      app: 'DesignDNA Studio',
      exportedAt: timestamp,
      designs,
      designDna,
      promptSelections,
      lastPromptResult,
    };

    return payload;
  },

  /**
   * Validates an imported backup JSON object or raw string before touching any database.
   */
  validateBackup(data: any): BackupValidationResult {
    let parsed = data;
    if (typeof data === 'string') {
      try {
        parsed = JSON.parse(data);
      } catch (err: any) {
        return {
          isValid: false,
          error: 'Invalid JSON file: Failed to parse backup file content.',
        };
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        isValid: false,
        error: 'Invalid backup file: Root must be a JSON object.',
      };
    }

    if (parsed.format !== 'designdna-backup') {
      return {
        isValid: false,
        error: 'Unrecognized format: Expected a "designdna-backup" file.',
      };
    }

    if (parsed.version !== 1) {
      return {
        isValid: false,
        error: `Unsupported backup version: Version ${parsed.version} is not supported.`,
      };
    }

    if (!Array.isArray(parsed.designs)) {
      return {
        isValid: false,
        error: 'Corrupted backup: "designs" field must be an array.',
      };
    }

    // Validate designs entries
    for (let i = 0; i < parsed.designs.length; i++) {
      const item = parsed.designs[i];
      if (!item || typeof item !== 'object') {
        return {
          isValid: false,
          error: `Corrupted record at index ${i}: Expected design item object.`,
        };
      }
      if (!item.id || typeof item.id !== 'string') {
        return {
          isValid: false,
          error: `Corrupted record at index ${i}: Missing valid "id".`,
        };
      }
      if (!item.name || typeof item.name !== 'string') {
        return {
          isValid: false,
          error: `Corrupted record at index ${i} (${item.id}): Missing valid "name".`,
        };
      }
      if (!item.imageUrl || typeof item.imageUrl !== 'string') {
        return {
          isValid: false,
          error: `Corrupted record at index ${i} (${item.name}): Missing valid "imageUrl".`,
        };
      }
    }

    const analyzedCount = parsed.designs.filter(
      (d: any) => d.analysisStatus === 'analyzed' && d.analysis
    ).length;

    return {
      isValid: true,
      payload: parsed as BackupPayload,
      designsCount: parsed.designs.length,
      analyzedCount,
      hasDesignDna: !!parsed.designDna,
      exportedAt: parsed.exportedAt,
    };
  },

  /**
   * Imports a validated backup payload into the application storage using either 'merge' or 'replace' mode.
   */
  async importBackup(
    payload: BackupPayload,
    mode: BackupImportMode
  ): Promise<BackupImportSummary> {
    if (mode === 'replace') {
      // 1. Completely clear existing designs
      await this.clearAllDesigns();

      // 2. Put all designs from backup
      for (const item of payload.designs) {
        await this.saveDesign(item);
      }

      // 3. Restore Design DNA if provided
      if (payload.designDna) {
        await this.saveDesignDna(payload.designDna);
      }

      // 4. Restore Prompt Studio state if provided
      if (payload.promptSelections) {
        await this.savePromptStudioSelections(payload.promptSelections);
      }
      if (payload.lastPromptResult) {
        await this.saveLastPromptResult(payload.lastPromptResult);
      }

      return {
        mode: 'replace',
        totalInBackup: payload.designs.length,
        addedCount: payload.designs.length,
        updatedCount: 0,
        preservedCount: 0,
        totalFinalCount: payload.designs.length,
        dnaRestored: !!payload.designDna,
      };
    } else {
      // MERGE Mode
      const existing = await this.getAllDesigns();
      const existingById = new Map<string, DesignItem>();
      const existingByName = new Map<string, DesignItem>();

      existing.forEach((d) => {
        existingById.set(d.id, d);
        existingByName.set(d.name.trim().toLowerCase(), d);
      });

      let addedCount = 0;
      let updatedCount = 0;
      let preservedCount = 0;

      for (const importedItem of payload.designs) {
        const matchById = existingById.get(importedItem.id);
        const matchByName = existingByName.get(importedItem.name.trim().toLowerCase());
        const match = matchById || matchByName;

        if (match) {
          // If existing design is unanalyzed, but imported design has full analysis, upgrade existing
          if (
            match.analysisStatus !== 'analyzed' &&
            importedItem.analysisStatus === 'analyzed' &&
            importedItem.analysis
          ) {
            const upgraded: DesignItem = {
              ...match,
              analysis: importedItem.analysis,
              analysisStatus: 'analyzed',
              tags: Array.from(new Set([...(match.tags || []), ...(importedItem.tags || [])])),
              influence: importedItem.influence || match.influence,
            };
            await this.saveDesign(upgraded);
            existingById.set(upgraded.id, upgraded);
            updatedCount++;
          } else {
            // Preserve existing
            preservedCount++;
          }
        } else {
          // New design: insert into database
          await this.saveDesign(importedItem);
          existingById.set(importedItem.id, importedItem);
          existingByName.set(importedItem.name.trim().toLowerCase(), importedItem);
          addedCount++;
        }
      }

      // Design DNA in Merge mode: restore if current is empty or null
      let dnaRestored = false;
      const currentDna = await this.getDesignDna();
      if (!currentDna && payload.designDna) {
        await this.saveDesignDna(payload.designDna);
        dnaRestored = true;
      }

      const finalAll = await this.getAllDesigns();

      return {
        mode: 'merge',
        totalInBackup: payload.designs.length,
        addedCount,
        updatedCount,
        preservedCount,
        totalFinalCount: finalAll.length,
        dnaRestored,
      };
    }
  },
};

/**
 * Browser helper to trigger download of the backup file as a JSON attachment.
 */
export function downloadBackupJsonFile(payload: BackupPayload): void {
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `designdna-backup-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
