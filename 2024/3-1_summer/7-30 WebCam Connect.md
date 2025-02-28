<p>오늘은 훈련했던 모델을 이용해서 나의 노트북 캠에 연결해 직접 훈련이 잘된 모습과 잘 인식하나를 확인하고 싶었다.. 생각보다 문제였던게 무엇이냐면</p>
<pre><code class="language-py">if __name__ == &quot;__main__&quot;:
    model_path = &quot;path/to/your/trained/model.pt&quot;
    area_size = 18.24  # 이태원 사고 현장 면적 (m^2)
    camera_index = 0  # 노트북 웹캠 사용

    crowd_guard = CrowdGuardAlert(model_path, area_size)
    crowd_guard.monitor_crowd(camera_index)</code></pre>
<p>코렙 서버에서는 cv2가 지원이 되지 않아 내장으로 있는 캠이 인식을 못하는 상황이 발생했다... 죽고싶다.. 모델훈련했던 pt파일을 노트북 로컬에서 한버 돌려봐야겠다.. 제일 문제는 내가 원래 계획했던 카메라or캠orCCTV가 인식을 하고 위험감지를 핸드폰에 메시지로 보내는 코드를 작성하려고 했다. 이것을 찾아 보니 <a href="https://firebase.google.com/?hl=ko">Firebase</a>라는 좋은 소스가 있었다. </p>
<hr />
<h2 id="firebase란">Firebase란?</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/32b4f985-084a-49c0-a924-a72455856954/image.png" /></p>
<h3 id="파이어베이스는-구글google이-소유하고-있는-모바일-애플리케이션-개발-플랫폼-이다">‘파이어베이스’는 구글(Google)이 소유하고 있는 모바일 애플리케이션 개발 플랫폼&quot; 이다.</h3>
<p>파이어베이스는 “앱을 개발하고, 개선하고, 키워갈 수 있는” 도구 모음(toolset)이며, 이러한 도구가 없다면 개발자들은 일반적으로 서비스의 상당 부분을 직접 만들어내야 한다. </p>
<p>그런데 개발자들은 앱의 사용자 경험(UX)에 집중을 해야 하기 때문에, 그런 세세한 부분들까지 전부 만드는 걸 좋아하지 않는다. 그런 부분들로는 분석, 인증, 데이터베이스, 구성 설정, 파일 저장, 푸시(push) 메시지 등, 열거하자면 끝이 없다. 파이어베이스로 만든 이러한 서비스들이 클라우드에 호스팅 되면, 개발자의 입장에서는 거의 아무런 노력을 들이지 않고도 앱의 규모를 확장할 수 있다.</p>
<hr />
<p>구글링을 하면 많은 자료들을 찾을 수 있었는데 Ios, Android를 지원해줘서 Android Studio를 깔아 서로 연결시켜 &quot;자바&quot;를 사용해 실시간으로 객체인식 후 지정한 면적당 인구대비가 많다면 위험신호를 보내는 코드를 만들었지만... 연결이 쉽지않았다.. 처음쓰는 툴이기도 하고 여러 코드들이 에러가 나면서 연결이 되지않아 조금 더 쉽게 접근해보자 해서 Web-Push라는 패키지를 설치해 따로 코드를 작성하고자 한다.</p>
<hr />
<hr />
<p><a href="https://github.com/BcKmini/OPENSWCompetition/tree/Code/Github_Reference">깃허브 참고</a>
이코드를 수정해서 만져 html부터 css, js 손을 봐서  내 입맛대로 바꾸려고한다. 사이트는 내 깃허브-&gt;
mini.github.io를 이용해서 운영 해보려고한다.</p>
<pre><code class="language-py">import cv2
import numpy as np
from ultralytics import YOLO
import time
import csv
from datetime import datetime

import math

class CrowdGuardAlert:
    def __init__(self, model_path, area_size):
        self.model = YOLO(model_path)
        self.area_size = area_size

    def calculate_average_distance(self, density):
        # 밀도를 기반으로 평균 거리 계산 (단순화된 모델)
        return math.sqrt(1 / density)

    def generate_alert(self, density):
        avg_distance = self.calculate_average_distance(density)

        if avg_distance &lt; 0.3:
            return &quot;극도의 위험! 즉시 대피하세요! 압사 위험이 매우 높습니다.&quot;, 4
        elif avg_distance &lt; 0.5:
            return &quot;심각한 위험! 군중 밀집도가 매우 높습니다. 즉시 주의하세요!&quot;, 3
        elif avg_distance &lt; 0.7:
            return &quot;주의! 군중이 밀집되고 있습니다. 이동에 주의하세요.&quot;, 2
        elif avg_distance &lt; 1.0:
            return &quot;경계! 군중이 모이고 있습니다. 상황을 주시하세요.&quot;, 1
        else:
            return &quot;안전: 현재 군중 밀도가 안전한 수준입니다.&quot;, 0

    def send_emergency_message(self, message):
        # 이동통신사 API 연동 예시 (실제 구현 필요)
        print(f&quot;긴급 재난 문자: {message}&quot;)
        # API 호출 예시:
        # response = requests.post('https://emergency-api.example.com/send',
        #                          json={'message': message, 'level': 'urgent'})
        # if response.status_code == 200:
        #     print(&quot;긴급 메시지 전송 성공&quot;)
        # else:
        #     print(&quot;긴급 메시지 전송 실패&quot;)

    def log_data(self, people_count, density, alert):
        with open(self.log_file, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([datetime.now(), people_count, density, alert])

    def monitor_crowd(self, camera_index=0):
        cap = cv2.VideoCapture(camera_index)

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            people_count, density = self.analyze_frame(frame)
            alert = self.generate_alert(density)

            if alert:
                self.send_emergency_message(alert)

            # 데이터 로깅
            self.log_data(people_count, density, alert)

            # 화면에 정보 표시
            cv2.putText(frame, f&quot;People: {people_count}&quot;, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f&quot;Density: {density:.2f}/m^2&quot;, (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            cv2.imshow(&quot;CrowdGuard Alert&quot;, frame)

            if cv2.waitKey(1) &amp; 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()</code></pre>
<hr />
<hr />
<p>캠...오늘 설정까지 마쳐보자...
서버 설정..제대로 내 토큰 잘 ..남겨놓고..파이팅</p>