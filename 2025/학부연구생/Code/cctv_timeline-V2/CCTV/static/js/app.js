document.getElementById('uploadForm').addEventListener('submit', uploadVideo);

function uploadVideo(event) {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('videoFile');
    formData.append('file', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        const videoFileName = fileInput.files[0].name;

        fetch('/extract_frames', {
            method: 'POST',
            body: new URLSearchParams({ 'video_file': videoFileName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.frames) {
                setVideoSource(`/static/uploads/${videoFileName}`);
                displayFramesInTimeline(data.frames, data.frame_times);
                displayDetectionResults(data.csv, data.json);
            } else {
                alert('프레임 추출에 실패했습니다.');
            }
        });
    });
}

function setVideoSource(filePath) {
    const videoSource = document.getElementById("videoSource");
    videoSource.src = filePath;
    document.getElementById("videoPlayer").load();
}

// 프레임을 타임라인에 추가
function displayFramesInTimeline(frames, frameTimes) {
    const framesWrapper = document.getElementById("framesWrapper");
    framesWrapper.innerHTML = ""; 

    frames.forEach((frame, index) => {
        const frameElement = document.createElement("div");
        frameElement.classList.add("timeline-frame");

        const img = document.createElement("img");
        img.src = `/static/frames/${frame}`;
        img.alt = `Frame at ${frameTimes[index]}s`;

        frameElement.addEventListener("click", () => {
            const video = document.getElementById("videoPlayer");
            video.currentTime = frameTimes[index];
        });

        frameElement.appendChild(img);
        framesWrapper.appendChild(frameElement);
    });
}

// 비디오 재생 시 진행선 이동
document.getElementById("videoPlayer").addEventListener("timeupdate", function() {
    const progress = document.getElementById("timelineProgress");
    const video = document.getElementById("videoPlayer");
    progress.style.left = `${(video.currentTime / video.duration) * 100}%`;
});

function displayDetectedTimes(detectedTimes) {
    const detectedTimesList = document.getElementById("detectedTimesList");
    detectedTimesList.innerHTML = ""; // 기존 내용 초기화

    if (!detectedTimes || detectedTimes.length === 0) {
        detectedTimesList.innerHTML = "<p>탐지된 동물이 없습니다.</p>";
        return;
    }

    detectedTimes.forEach(time => {
        const timeItem = document.createElement("li");
        timeItem.innerText = formatTime(time);

        // 클릭하면 해당 시간대로 이동
        timeItem.addEventListener("click", () => {
            const video = document.getElementById("videoPlayer");
            video.currentTime = time;
        });

        detectedTimesList.appendChild(timeItem);
    });
}

// 초를 "시:분:초" 형식으로 변환하는 함수
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` 
                 : `${m}:${s.toString().padStart(2, '0')}`;
}


// 기존의 displayDetectionResults 함수에서 추가 호출
function displayDetectionResults(csvPath, jsonPath, detectedTimes) {
    const detectionResultsDiv = document.getElementById('detectionResults');
    detectionResultsDiv.innerHTML = `
        <p><strong>탐지 결과:</strong></p>
        <a href="${csvPath}" download>📄 CSV 파일 다운로드</a><br>
        <a href="${jsonPath}" download>📄 JSON 파일 다운로드</a>
    `;

    // 🐾 탐지된 시각 표시 추가
    displayDetectedTimes(detectedTimes);
}




