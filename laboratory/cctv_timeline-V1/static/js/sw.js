self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('sync', event => {
  if (event.tag === 'upload-sync') {
    event.waitUntil(doSyncUpload());
  }
});

async function doSyncUpload() {
  // IndexedDB에서 모든 세션 찾기
  const db = await new Promise(res=>{
    const r = indexedDB.open('upload-db',1);
    r.onupgradeneeded = ()=>r.result.createObjectStore('chunks',{keyPath:'id',autoIncrement:true});
    r.onsuccess = ()=>res(r.result);
  });
  const tx = db.transaction('chunks','readonly');
  const store = tx.objectStore('chunks');
  const all = [];
  await new Promise(res=>{
    store.openCursor().onsuccess = evt=>{
      const cur = evt.target.result;
      if (!cur) return res();
      all.push({ key:cur.key, ...cur.value });
      cur.continue();
    };
  });

  // 각 세션별로 전송
  const bySession = all.reduce((acc,r)=>{
    (acc[r.sessionId]||(acc[r.sessionId]=[])).push(r);
    return acc;
  }, {});

  for (const sessionId in bySession) {
    const chunks = bySession[sessionId];
    let uploaded=0, total=0;
    chunks.forEach(c=>total+=c.blob.size);
    for (const { key, offset, blob } of chunks) {
      const form = new FormData();
      form.append('session_id', sessionId);
      form.append('offset', offset);
      form.append('chunk', blob);
      await fetch('/upload/chunk',{ method:'POST', credentials:'same-origin', body:form });
      // 삭제
      const dt = db.transaction('chunks','readwrite');
      dt.objectStore('chunks').delete(key);
      await dt.complete;
      uploaded+=blob.size;
      const pct = Math.round(uploaded/total*100);
      // 진행률 페이지로 메시지
      self.clients.matchAll().then(clients=>{
        clients.forEach(c=>c.postMessage({ type:'SYNC_PROGRESS', progress:pct }));
      });
    }
  }
}
