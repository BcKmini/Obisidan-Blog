document.getElementById('uploadForm').addEventListener('submit', uploadVideo);

function uploadVideo(event) {
    event.preventDefault(); // 폼 제출 막기

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

        // 업로드된 영상에서 프레임 추출
        fetch('/extract_frames', {
            method: 'POST',
            body: new URLSearchParams({
                'video_file': videoFileName
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.frames) {
                // 타임라인에 프레임 썸네일 표시
                displayFramesInTimeline(data.frames);

                // 비디오 소스 설정
                setVideoSource(`/static/uploads/${videoFileName}`);
            } else {
                alert('프레임 추출에 실패했습니다.');
            }
        });
    });
}

// 비디오 소스 설정
function setVideoSource(filePath) {
    const videoSource = document.getElementById("videoSource");
    videoSource.src = filePath;
    document.getElementById("videoPlayer").load();
}

// 타임라인에 프레임 썸네일 표시
function displayFramesInTimeline(frames) {
    const framesWrapper = document.getElementById('framesWrapper');
    framesWrapper.innerHTML = '';

    frames.forEach(framePath => {
        // 실제 경로: /static/frames/<videoName>/frame_XXX.jpg
        const imgSrc = `/static/frames/${framePath}`;
        
        const img = document.createElement('img');
        img.classList.add('timeline-frame');
        img.src = imgSrc;
        img.alt = framePath;

        // data-frameindex 추출 (예: frame_30.jpg → index=30)
        const frameIndex = framePath.split('_')[1].split('.')[0];
        img.dataset.frameindex = frameIndex;

        // 클릭 시 해당 프레임 시간으로 이동
        img.addEventListener('click', () => {
            const videoPlayer = document.getElementById("videoPlayer");
            // FPS가 30이라 가정
            videoPlayer.currentTime = parseInt(frameIndex, 10) / 30;
        });

        framesWrapper.appendChild(img);
    });
}

// 비디오 재생 위치에 따라 스크러버 위치 업데이트
const videoPlayer = document.getElementById("videoPlayer");
const timelineProgress = document.getElementById("timelineProgress");
const timelineContainer = document.getElementById("timelineContainer");

videoPlayer.addEventListener('timeupdate', () => {
    const duration = videoPlayer.duration;
    if (!duration || duration === Infinity) return;

    const currentTime = videoPlayer.currentTime;
    const percent = (currentTime / duration) * 100;
    timelineProgress.style.left = percent + '%';
});

// 타임라인 전체 클릭 시, 해당 위치로 비디오 재생 시간 이동(옵션)
timelineContainer.addEventListener('click', (e) => {
    // framesWrapper 영역만 클릭했을 때만 동작하게 하려면 조건 추가 가능
    const rect = timelineContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;

    const newTime = videoPlayer.duration * clickPercent;
    videoPlayer.currentTime = newTime;
});
