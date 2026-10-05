import { DesignItem, DesignDna, PromptStudioSelections, GeneratedPromptResult } from '../types';

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
};
