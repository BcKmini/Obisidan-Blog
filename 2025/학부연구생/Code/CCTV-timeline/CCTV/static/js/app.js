function setVideoSource(filePath) {
    const videoSource = document.getElementById("videoSource");
    videoSource.src = filePath;  // 비디오 경로 설정
    document.getElementById("videoPlayer").load();  // 비디오 새로 로드
}

function uploadVideo(event) {
    event.preventDefault();  // 폼 제출 기본 동작 방지

    const formData = new FormData();
    const fileInput = document.getElementById('videoFile');
    formData.append('file', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);  // 업로드 결과 콘솔에 출력
        const videoFileName = fileInput.files[0].name;

        // 업로드된 영상에서 프레임 추출 요청
        fetch('/extract_frames', {
            method: 'POST',
            body: new URLSearchParams({
                'video_file': videoFileName
            })
        })
        .then(response => response.json())  // 서버에서 프레임 파일 목록 받기
        .then(data => {
            if (data.frames) {
                displayFrames(data.frames);  // 받은 프레임들을 타임라인에 표시
                setVideoSource(`/static/uploads/${videoFileName}`);  // 비디오 소스 설정
            } else {
                alert('프레임 추출에 실패했습니다.');
            }
        });
    });
}


function displayFrames(frames) {
    const timeline = document.getElementById('videoTimeline');
    timeline.innerHTML = "";

    frames.forEach(frame => {
        const img = document.createElement('img');
        // 프레임 파일이 .jpg라면, 그대로 frame 변수를 사용
        img.src = `/static/frames/${frame}`;  
        img.alt = frame;
        img.style.width = '100px';
        img.style.height = 'auto';
        img.style.marginRight = '5px';
        img.style.cursor = 'pointer';

        img.addEventListener('click', () => {
            const frameIndex = frame.split('_')[1].split('.')[0];
            const videoPlayer = document.getElementById("videoPlayer");
            videoPlayer.currentTime = frameIndex / 30;
        });

        timeline.appendChild(img);
    });
}





document.getElementById('uploadForm').addEventListener('submit', uploadVideo);
