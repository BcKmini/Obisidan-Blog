Flask 안에서 .avi형식이 지원되지 않은 문제와 용량 문제 해결 + 연결 대기시간
```python
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024 * 1024
```

```bash
gunicorn -b 0.0.0.0:2299 app:app --timeout 50000 
```

```HTML
<!-- 오른쪽 패널: CSV 결과 표 표시용 -->
<div class="right-panel">
<h2>검출 결과</h2>
<div id="detectionTable"></div>

</div><!-- .right-panel 끝 -->
```


---
![[스크린샷 2025-03-27 12.32.01.png]]
![[스크린샷 2025-03-27 12.31.53.png]]

