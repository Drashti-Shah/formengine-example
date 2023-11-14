import {clear, createStore, del, get, keys, set, UseStore} from 'idb-keyval'
import type {IFormStorage} from '@react-form-builder/designer'

const indexedDbExists = !!window.indexedDB

/**
 * Creates key-value storage.
 * @param dbName the database name.
 * @param storeName the store name.
 * @returns the object for storage management.
 */
export const kvCreateStore = (dbName: string, storeName: string): UseStore => {
  if (!indexedDbExists) return {} as UseStore
  return createStore(dbName, storeName)
}

/**
 * Removes the value from the store by the specified key.
 * @param key the key.
 * @param customStore the store.
 * @returns the Promise, which can be rejected if operations failed to complete.
 */
export const kvDel = (key: IDBValidKey, customStore?: UseStore): Promise<void> => {
  if (!indexedDbExists) return Promise.reject()
  return del(key, customStore)
}

/**
 * Returns a value from the store for the specified key.
 * @param key the key.
 * @param customStore the store.
 * @returns the Promise with a value or undefined if no value is found.
 */
export const kvGet = <T = any>(key: IDBValidKey, customStore?: UseStore): Promise<T | undefined> => {
  if (!indexedDbExists) return Promise.reject()
  return get<T>(key, customStore)
}

/**
 * Returns an array with all available keys from the store.
 * @param customStore the store.
 * @returns the Promise with the array with all available keys.
 */
export const kvKeys = <KeyType extends IDBValidKey>(customStore?: UseStore): Promise<KeyType[]> => {
  if (!indexedDbExists) return Promise.reject()
  return keys(customStore)
}

/**
 * Sets the value in the store by the specified key.
 * @param key the key.
 * @param value the value.
 * @param customStore the store.
 * @returns the Promise, which can be rejected if operations failed to complete.
 */
export const kvSet = (key: IDBValidKey, value: any, customStore?: UseStore): Promise<void> => {
  if (!indexedDbExists) return Promise.reject()
  return set(key, value, customStore)
}

/**
 * Clears all values in the store.
 * @param customStore the store.
 * @returns the Promise, which can be rejected if operations failed to complete.
 */
export const kvClear = (customStore?: UseStore): Promise<void> => {
  if (!indexedDbExists) return Promise.reject()
  return clear(customStore)
}



/**
 * Stores forms in IndexedDB.
 */
export class IndexedDbFormStorage implements IFormStorage {
  #customStore: UseStore

  /**
   * Constructor.
   * @param dbName the database name.
   * @param storeName the store name.
   */
  constructor(dbName: string, storeName: string) {
    
    this.#customStore = kvCreateStore(dbName, storeName)
    console.log('inside constructor ', dbName, this.#customStore);
  }

  /**
   * Init IndexedDB with specified initial data.
   * @param initialData the initial data.
   */
  async init(initialData: Record<string, string>) {
    console.log('initialData[formName]== ', initialData);
    for (const formName in initialData) {
      const formNames = await this.getFormNames()
      if (formNames.indexOf(formName) === -1) {
        await this.saveForm(formName, initialData[formName])
      }
    }
  }

  /**
   * @inheritDoc
   */
  async getForm(formName: string) {
    console.log('getForm== ', formName);
    
    const formValue = await kvGet(formName, this.#customStore)
    if (!formValue) throw new Error(`Cannot find form '${formName}'`)
    return formValue
  }

  /**
   * @inheritDoc
   */
  getFormNames(): Promise<string[]> {
    return kvKeys(this.#customStore)
  }

  /**
   * @inheritDoc
   */
  removeForm(formName: string): Promise<any> {
    return kvDel(formName, this.#customStore)
  }

  /**
   * @inheritDoc
   */
  async saveForm(formName: string, formValue: string): Promise<any> {  
    await kvSet(formName, formValue, this.#customStore)
    let data =  await this.getForm(formName)
    console.log("data",data);
    
  }

  /**
   * Clears all values in the storage.
   * @returns the Promise with the result of the work.
   */
  async clear() {
    return await kvClear(this.#customStore)
  }
}