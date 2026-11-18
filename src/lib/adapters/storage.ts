import { z } from 'zod';

// Storage item interface
export interface StorageItem {
  id: string;
  data: unknown;
  metadata: {
    createdAt: string;
    updatedAt: string;
    contentType?: string;
    size?: number;
  };
}

// Storage adapter interface
export interface StorageAdapter {
  // Basic CRUD operations
  get<T>(collection: string, id: string): Promise<T | null>;
  getAll<T>(collection: string): Promise<T[]>;
  create<T>(collection: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, schema?: z.ZodSchema<T>): Promise<T>;
  update<T>(collection: string, id: string, data: Partial<T>, schema?: z.ZodSchema<T>): Promise<T | null>;
  delete(collection: string, id: string): Promise<boolean>;
  
  // Query operations
  find<T>(collection: string, predicate: (item: T) => boolean): Promise<T[]>;
  findOne<T>(collection: string, predicate: (item: T) => boolean): Promise<T | null>;
  
  // Bulk operations
  batchCreate<T>(collection: string, items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]>;
  batchDelete(collection: string, ids: string[]): Promise<number>;
  
  // Collection management
  createCollection(collection: string): Promise<boolean>;
  deleteCollection(collection: string): Promise<boolean>;
  listCollections(): Promise<string[]>;
  
  // Export/Import
  exportCollection(collection: string): Promise<StorageItem[]>;
  importCollection(collection: string, items: StorageItem[]): Promise<boolean>;
  
  // Health check
  health(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    message?: string;
    collections?: number;
    totalItems?: number;
  }>;
}

// Mock storage adapter implementation (in-memory)
export class MockStorageAdapter implements StorageAdapter {
  private storage: Map<string, Map<string, StorageItem>> = new Map();
  
  constructor() {
    // Initialize with default collections
    this.createCollection('profiles');
    this.createCollection('projects');
    this.createCollection('experience');
    this.createCollection('education');
    this.createCollection('skills');
    this.createCollection('blogPosts');
    this.createCollection('socialLinks');
    this.createCollection('resumes');
    this.createCollection('contactMessages');
    this.createCollection('siteSettings');
  }
  
  private generateId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  private getCollection(collection: string): Map<string, StorageItem> {
    if (!this.storage.has(collection)) {
      this.storage.set(collection, new Map());
    }
    return this.storage.get(collection)!;
  }
  
  async get<T>(collection: string, id: string): Promise<T | null> {
    const col = this.getCollection(collection);
    const item = col.get(id);
    return item ? (item.data as T) : null;
  }
  
  async getAll<T>(collection: string): Promise<T[]> {
    const col = this.getCollection(collection);
    return Array.from(col.values()).map(item => item.data as T);
  }
  
  async create<T>(
    collection: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, 
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    // Validate against schema if provided
    let validatedData = { ...data } as T;
    if (schema) {
      validatedData = schema.parse({
        ...data,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      validatedData = {
        ...data,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as T;
    }
    
    const col = this.getCollection(collection);
    const id = (validatedData as any).id;
    
    col.set(id, {
      id,
      data: validatedData,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
    
    return validatedData;
  }
  
  async update<T>(
    collection: string, 
    id: string, 
    data: Partial<T>,
    schema?: z.ZodSchema<T>
  ): Promise<T | null> {
    const col = this.getCollection(collection);
    const existing = col.get(id);
    
    if (!existing) {
      return null;
    }
    
    const currentData = existing.data as T;
    const updatedData = {
      ...currentData,
      ...data,
      id,
      updatedAt: new Date().toISOString()
    } as T;
    
    // Validate against schema if provided
    let validatedData = updatedData;
    if (schema) {
      validatedData = schema.parse(updatedData);
    }
    
    col.set(id, {
      id,
      data: validatedData,
      metadata: {
        ...existing.metadata,
        updatedAt: new Date().toISOString()
      }
    });
    
    return validatedData;
  }
  
  async delete(collection: string, id: string): Promise<boolean> {
    const col = this.getCollection(collection);
    return col.delete(id);
  }
  
  async find<T>(collection: string, predicate: (item: T) => boolean): Promise<T[]> {
    const col = this.getCollection(collection);
    const items = Array.from(col.values());
    return items
      .map(item => item.data as T)
      .filter(predicate);
  }
  
  async findOne<T>(collection: string, predicate: (item: T) => boolean): Promise<T | null> {
    const col = this.getCollection(collection);
    const items = Array.from(col.values());
    const found = items.map(item => item.data as T).find(predicate);
    return found || null;
  }
  
  async batchCreate<T>(
    collection: string, 
    items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<T[]> {
    const created: T[] = [];
    
    for (const item of items) {
      const createdItem = await this.create(collection, item);
      created.push(createdItem);
    }
    
    return created;
  }
  
  async batchDelete(collection: string, ids: string[]): Promise<number> {
    const col = this.getCollection(collection);
    let deletedCount = 0;
    
    for (const id of ids) {
      if (col.delete(id)) {
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
  
  async createCollection(collection: string): Promise<boolean> {
    if (!this.storage.has(collection)) {
      this.storage.set(collection, new Map());
      return true;
    }
    return false;
  }
  
  async deleteCollection(collection: string): Promise<boolean> {
    return this.storage.delete(collection);
  }
  
  async listCollections(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
  
  async exportCollection(collection: string): Promise<StorageItem[]> {
    const col = this.getCollection(collection);
    return Array.from(col.values());
  }
  
  async importCollection(collection: string, items: StorageItem[]): Promise<boolean> {
    const col = this.getCollection(collection);
    
    for (const item of items) {
      col.set(item.id, item);
    }
    
    return true;
  }
  
  async health(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    message?: string;
    collections?: number;
    totalItems?: number;
  }> {
    const collections = this.listCollections();
    const totalItems = Array.from(this.storage.values()).reduce(
      (sum, col) => sum + col.size,
      0
    );
    
    return {
      status: 'healthy',
      message: 'Mock storage adapter is running',
      collections: (await collections).length,
      totalItems
    };
  }
}

// Factory function to create storage adapter
export function createStorageAdapter(type: 'mock' | 'local' | 's3' = 'mock'): StorageAdapter {
  switch (type) {
    case 'mock':
      return new MockStorageAdapter();
    case 'local':
      // Local JSON file storage would go here
      throw new Error('Local storage adapter not implemented yet');
    case 's3':
      // AWS S3 storage would go here
      throw new Error('S3 storage adapter not implemented yet');
    default:
      return new MockStorageAdapter();
  }
}

// Default instance export
export const storage = createStorageAdapter('mock');