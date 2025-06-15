// static/js/app.js

let currentVideoFile = '';

/** HH:MM:SS → 초 변환 */
function hms2sec(hms) {
  const [h, m, s] = hms.split(':').map(Number);
  return h*3600 + m*60 + s;
}

/** .sec/.avi → .mp4 매핑 */
function getPlayableFilename(fn) {
  const ext = fn.split('.').pop().toLowerCase();
  return (ext === 'sec' || ext === 'avi')
    ? fn.replace(/\.(sec|avi)$/i, '.mp4')
    : fn;
}

window.addEventListener('DOMContentLoaded', () => {
  // 이어 업로드 재개 체크
  const pending = JSON.parse(localStorage.getItem('pendingUpload') || 'null');
  if (pending) {
    const pct = Math.round(pending.uploadedSize / pending.totalSize * 100);
    alert(`업로드가 ${pct}% 진행된 파일이 있습니다.\n동일한 파일 선택 시 이어서 업로드를 진행합니다.`);
    document.getElementById('videoFile')
      .addEventListener('change', e => {
        const f = e.target.files[0];
        if (f && f.name === pending.filename && f.size === pending.totalSize) {
          resumeUpload(f, pending.sessionId, pending.uploadedSize);
        } else {
          localStorage.removeItem('pendingUpload');
        }
      }, { once: true });
  }

  loadServerVideos();

  document.getElementById('detectBtn')
    .addEventListener('click', e => {
      e.preventDefault();
      if (!document.getElementById('videoFile').files[0]) {
        return alert('파일을 선택하세요');
      }
      handleUploadAndDetect();
    });

  document.getElementById('uploadOnlyBtn')
    .addEventListener('click', e => {
      e.preventDefault();
      uploadOnly();
    });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

/** 서버 영상 목록 로드 */
async function loadServerVideos() {
  const res = await fetch('/api/videos', { credentials: 'same-origin' });
  const videos = await res.json();
  const tbody = document.getElementById('serverVideos');
  tbody.innerHTML = '';
  videos.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="ps-3">${v.filename}</td>`;
    tr.addEventListener('click', () => selectServerVideo(v.filename));
    tbody.appendChild(tr);
  });
}

/** 서버 영상 선택 후 검출 */
function selectServerVideo(fn) {
  currentVideoFile = fn;
  document.getElementById('startTime').value = '00:00:00';
  extractAndDetect(fn);
}

/** 업로드만 */
async function uploadOnly() {
  const file = document.getElementById('videoFile').files[0];
  if (!file) return alert('파일을 선택하세요');
  try {
    const init = await fetch('/upload/init', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, total_size: file.size })
    });
    const { session_id, uploaded_size } = await init.json();
    localStorage.setItem('pendingUpload', JSON.stringify({
      sessionId: session_id,
      filename: file.name,
      totalSize: file.size,
      uploadedSize: uploaded_size
    }));
    await uploadChunks(file, session_id, uploaded_size);
    localStorage.removeItem('pendingUpload');
    alert('업로드만 완료되었습니다.');
    loadServerVideos();
  } catch (e) {
    console.error(e);
    alert('업로드 중 오류가 발생했습니다.');
  }
}

/** 업로드 후 검출 */
async function handleUploadAndDetect() {
  const file = document.getElementById('videoFile').files[0];
  const init = await fetch('/upload/init', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, total_size: file.size })
  });
  const { session_id, uploaded_size } = await init.json();
  localStorage.setItem('pendingUpload', JSON.stringify({
    sessionId: session_id,
    filename: file.name,
    totalSize: file.size,
    uploadedSize: uploaded_size
  }));
  await uploadChunks(file, session_id, uploaded_size);
  localStorage.removeItem('pendingUpload');
  extractAndDetect(file.name);
}

/** 이어 업로드 재개 */
async function resumeUpload(file, sid, offset) {
  updateProgressBar(Math.round(offset / file.size * 100));
  await uploadChunks(file, sid, offset);
  localStorage.removeItem('pendingUpload');
  extractAndDetect(file.name);
}

/** 청크 단위 업로드 */
async function uploadChunks(file, sid, offset) {
  const chunkSize = 1024 * 1024;
  let uploaded = offset;
  while (uploaded < file.size) {
    const end = Math.min(uploaded + chunkSize, file.size);
    const chunk = file.slice(uploaded, end);
    const form = new FormData();
    form.append('session_id', sid);
    form.append('offset', uploaded);
    form.append('chunk', chunk);
    const res = await fetch('/upload/chunk', {
      method: 'POST',
      credentials: 'same-origin',
      body: form
    });
    const data = await res.json();
    uploaded = data.uploaded_size;
    updateProgressBar(data.progress);
    const p = JSON.parse(localStorage.getItem('pendingUpload') || '{}');
    if (p.sessionId === sid) {
      p.uploadedSize = uploaded;
      localStorage.setItem('pendingUpload', JSON.stringify(p));
    }
  }
}

/** 프로그레스바 업데이트 */
function updateProgressBar(pct) {
  document.getElementById('uploadProgress').style.width = `${pct}%`;
}

/** 검출 API 호출 및 결과 렌더링 */
async function extractAndDetect(fn) {
  document.getElementById('detectionSection').classList.add('d-none');
  const st = document.getElementById('startTime').value || '00:00:00';
  const res = await fetch('/extract_frames', {
    method: 'POST',
    credentials: 'same-origin',
    body: new URLSearchParams({ video_file: fn, start_time: st })
  });
  const data = await res.json();
  const player = document.getElementById('videoPlayer');
  currentVideoFile = fn;
  player.src = `/static/uploads/${encodeURIComponent(getPlayableFilename(fn))}`;
  player.load();
  player.addEventListener('loadedmetadata', () => {
    player.currentTime = hms2sec(st);
    displayFramesInTimeline(data.frames, data.frame_times, data.detected_times);
    displayDetectionResults(data.csv, data.json);      // 수정: segments 파라미터 제거
    buildTimelines(data.detected_times, player.duration);
  }, { once: true });
}

/** 타임라인에 추출된 프레임 표시 */
function displayFramesInTimeline(frames, times, detected = []) {
  const wrap = document.getElementById('framesWrapper') || document.querySelector('.frames-wrapper');
  if (!wrap) return;
  wrap.innerHTML = '';
  const det = new Set(detected.map(t => Math.floor(t)));
  const base = currentVideoFile.replace(/\.(sec|avi|mp4)$/i, '');
  frames.forEach((f, i) => {
    const d = document.createElement('div');
    d.className = 'timeline-frame' + (det.has(Math.floor(times[i])) ? ' detected-frame' : '');
    const img = document.createElement('img');
    img.src = `/static/frames/${encodeURIComponent(base)}/${encodeURIComponent(f)}`;
    d.appendChild(img);
    d.onclick = () => document.getElementById('videoPlayer').currentTime = times[i];
    wrap.appendChild(d);
  });
}

/** CSV/JSON 다운로드 버튼 세팅 */
function displayDetectionResults(csvPath, jsonPath) {
  const sec = document.getElementById('detectionSection');
  sec.classList.remove('d-none');
  document.getElementById('csvDownloadBtn').href  = csvPath;
  document.getElementById('jsonDownloadBtn').href = jsonPath;
  // 수정: clipDownloads 영역 제거
}

/** 타임라인에 검출 구간(빨강) 표시 및 클릭 시 다운로드 */
function buildTimelines(detected, duration) {
  const tl = document.getElementById('timelines');
  const wrapper = document.getElementById('timelineWrapper');
  tl.innerHTML = '';
  // 중복 제거된 초 단위 정렬
  const secs = Array.from(new Set(detected.map(t => Math.floor(t)))).sort((a, b) => a - b);
  if (!secs.length) return;

  // 연속 구간 계산
  let start = secs[0], prev = secs[0], segs = [];
  secs.slice(1).forEach(s => {
    if (s - prev <= 6) prev = s;
    else { segs.push([start, prev + 1]); start = prev = s; }
  });
  segs.push([start, prev + 1]);

  segs.forEach(([s, e]) => {
    const bar = document.createElement('div');
    bar.className = 'segment-detected';
    bar.style.left  = `${(s / duration * 100)}%`;
    bar.style.width = `${((e - s) / duration * 100)}%`;

    bar.addEventListener('click', () => {
      const player = document.getElementById('videoPlayer');
      // 1) 비디오 이동 및 재생
      player.currentTime = s;
      player.play();

      // 2) 기존 마커 제거
      wrapper.querySelectorAll('.click-marker').forEach(el => el.remove());

      // 3) 새 마커 생성 (wrapper에 append)
      const marker = document.createElement('div');
      Object.assign(marker.style, {
        position:      'absolute',
        top:           '0',
        left:          `${(s / duration * 100)}%`,
        width:         '2px',
        height:        '100%',
        background:    '#ffffff',
        pointerEvents: 'none',
        zIndex:        '10'
      });
      marker.classList.add('click-marker');
      wrapper.appendChild(marker);

      // 4) 다운로드 트리거
      const url = `/download_clip?video_file=${encodeURIComponent(getPlayableFilename(currentVideoFile))}`
                + `&start=${s.toFixed(2)}&end=${e.toFixed(2)}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentVideoFile.replace(/\.(sec|avi|mp4)$/i,'')}_${s.toFixed(2)}-${e.toFixed(2)}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    tl.appendChild(bar);
  });
}



/** 현재 재생 위치 표시 */
document.getElementById('videoPlayer').addEventListener('timeupdate', () => {
  const p = document.getElementById('videoPlayer');
  if (!p.duration) return;
  document.getElementById('timelineProgress').style.left =
    `${(p.currentTime / p.duration * 100)}%`;
});

/** 초 → HH:MM:SS 포맷 */
function secondsToHMS(sec) {
  const h = Math.floor(sec / 3600),
        m = Math.floor((sec % 3600) / 60),
        s = Math.floor(sec % 60);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
