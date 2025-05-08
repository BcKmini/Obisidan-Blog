# app.py
from flask import Flask, request, jsonify, render_template, g
import subprocess
import os
import pandas as pd
import re

app = Flask(__name__)

# 업로드 폴더 설정
UPLOAD_FOLDER = 'uploaded_codes'

# 테스트 케이스 파일 매핑
TEST_CASES_FILES = {
    'C': 'test_cases_summary.csv'
}

# 성적 엑셀 파일 매핑
COURSE_FILES = {
    '8395': 'grades_8629_re.xlsx'
}

# 전역에 로드된 테스트 케이스 저장
test_cases_data = {}

def ensure_folder_structure(course, student_id):
    """
    제출 파일 저장용 폴더 구조 보장
    """
    folder_path = os.path.join(UPLOAD_FOLDER, course, student_id)
    os.makedirs(folder_path, exist_ok=True)
    return folder_path

@app.before_request
def store_ip():
    g.client_ip = request.remote_addr

@app.route('/')
def index():
    return render_template('index.html')

# 문제 범위별 HTML 반환 라우트
@app.route('/question0106')
def question0106():
    with open('templates/question0106.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/question0712')
def question0712():
    with open('templates/question0712.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/question1317')
def question1317():
    with open('templates/question1317.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/question1822')
def question1822():
    with open('templates/question1822.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/question2328')
def question2328():
    with open('templates/question2328.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/submit', methods=['POST'])
def submit_code():
    name       = request.form['name']
    student_id = str(request.form['student_id'])
    problem    = request.form['problem']
    course     = request.form['course']
    file       = request.files['code']
    client_ip  = g.client_ip

    # 테스트 케이스 로드 확인
    test_cases = test_cases_data.get('C')
    if test_cases is None or test_cases.empty:
        return jsonify({'status':'error','message':'Test cases not loaded','score':0})

    # 이름·학번 유효성 검사
    if not (2 <= len(name.strip()) <= 20):
        return jsonify({'status':'error','message':'Invalid name length'})
    if not re.match(r'^\d{7,12}$', student_id):
        return jsonify({'status':'error','message':'Invalid student ID format'})

    # 코스별 테스트 케이스 타입 선택
    if course == '8397':
        tc_type = 'A'
    elif course == '8398':
        tc_type = 'B'
    else:
        tc_type = 'C'
    test_cases = test_cases_data.get(tc_type)
    if test_cases is None or test_cases.empty:
        return jsonify({'status':'error','message':'Test cases not loaded','score':0})

    # 문제별 케이스 필터링
    df_tc = test_cases[test_cases['problem'] == f'problem{problem}'] \
                .reset_index(drop=True)

    # 성적 엑셀 파일 확인
    excel_file = COURSE_FILES.get(course)
    if not excel_file:
        return jsonify({'status':'error','message':'Invalid course','score':0})

    # 코드 저장
    folder   = ensure_folder_structure(course, student_id)
    filename = f"{student_id}_problem{problem}_{file.filename}"
    filepath = os.path.join(folder, filename)
    file.save(filepath)

    # 컴파일/실행 명령 결정
    is_py = False
    if filename.endswith('.c'):
        compile_cmd = ['gcc', filepath, '-o', os.path.join(folder, f'problem{problem}.out')]
    elif filename.endswith('.cpp'):
        compile_cmd = ['g++', filepath, '-o', os.path.join(folder, f'problem{problem}.out')]
    elif filename.endswith('.py'):
        compile_cmd = None
        is_py = True
    else:
        return jsonify({'status':'error','message':'Unsupported file extension','score':0})

    # 컴파일
    if compile_cmd:
        res = subprocess.run(compile_cmd, capture_output=True, text=True)
        if res.returncode != 0:
            return jsonify({'status':'error','message':'Compilation Error','error':res.stderr})

    # 테스트 실행 및 채점
    total, passed = len(df_tc), 0
    results = []
    for i, row in df_tc.iterrows():
        inp      = row['input']
        exp      = row['output'] or ""
        in_path  = os.path.join(folder, 'input.txt')
        out_path = os.path.join(folder, 'output.txt')

        # 입력 기록 및 출력 파일 초기화
        with open(in_path, 'w') as f:
            f.write(inp)
        open(out_path, 'w').close()

        try:
            cmd = ['python3', filename] if is_py \
                  else [os.path.join(folder, f'problem{problem}.out')]
            # stdout을 output.txt로 리디렉트
            with open(out_path, 'w') as fout:
                subprocess.run(
                    cmd,
                    cwd=folder,
                    stdout=fout,
                    stderr=subprocess.STDOUT,
                    timeout=0.5
                )
        except subprocess.TimeoutExpired:
            return jsonify({'status':'error','message':'Execution Timeout','score':0})

        # 실행 결과 읽기
        with open(out_path) as f:
            out = f.read().strip()

        # 결과 비교
        if exp.strip() == out:
            passed += 1
            results.append(f'testcase{i+1}: Passed')
        else:
            # 변경: 실패 시 INPUT만 표시
            results.append(f"testcase{i+1}: Failed - INPUT - {inp}")

    score = (passed / total) * 100

    # 성적 엑셀 업데이트
    df = pd.read_excel(excel_file)
    df['Student ID'] = df['Student ID'].astype(str)
    col = f'Problem{problem}'
    if student_id in df['Student ID'].values:
        df.loc[df['Student ID'] == student_id, col] = score
    else:
        new = {
            'Name'       : name,
            'Student ID' : student_id,
            col          : score,
            'IP Address' : client_ip
        }
        df = pd.concat([df, pd.DataFrame([new])], ignore_index=True)
    df.to_excel(excel_file, index=False)

    return jsonify({
        'status'           : 'success',
        'message'          : 'Submission successful',
        'score'            : float(score),
        'test_case_results': results,
        'ip'               : client_ip
    })

if __name__ == '__main__':
    # 초기화: 폴더, 엑셀, 테스트 케이스 로드
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    for course, path in COURSE_FILES.items():
        if not os.path.exists(path):
            cols = ['Name', 'Student ID', 'IP Address'] + [f'Problem{i}' for i in range(1, 29)]
            pd.DataFrame(columns=cols).to_excel(path, index=False)

    for t, path in TEST_CASES_FILES.items():
        try:
            test_cases_data[t] = pd.read_csv(path, dtype=str)
        except FileNotFoundError:
            print(f"Test case file not found: {path}")

    app.run(
        host='0.0.0.0',
        port=8929,
        debug=True,
        use_reloader=True
    )
