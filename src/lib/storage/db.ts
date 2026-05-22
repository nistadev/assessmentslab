import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, INDEX, STORE, type AssessmentsLabSchema } from './schema';

let dbPromise: Promise<IDBPDatabase<AssessmentsLabSchema>> | null = null;

export function getDb(): Promise<IDBPDatabase<AssessmentsLabSchema>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in the browser.'));
  }

  if (!dbPromise) {
    dbPromise = openDB<AssessmentsLabSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const quiz = db.createObjectStore(STORE.quizSessions, { keyPath: 'uid' });
          quiz.createIndex(INDEX.byLastUsed, 'lastUsedAt');

          const study = db.createObjectStore(STORE.studySessions, { keyPath: 'uid' });
          study.createIndex(INDEX.byLastUsed, 'lastUsedAt');

          db.createObjectStore(STORE.dailyQuiz, { keyPath: 'dateKey' });
          db.createObjectStore(STORE.dailyLesson, { keyPath: 'dateKey' });
          db.createObjectStore(STORE.streaks, { keyPath: 'mode' });
          db.createObjectStore(STORE.meta, { keyPath: 'key' });
        }
      },
    });
  }

  return dbPromise;
}

export function resetDbForTests() {
  dbPromise = null;
}
