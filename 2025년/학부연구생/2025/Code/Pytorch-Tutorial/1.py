import torch

# PyTorch 버전 확인
print(torch.__version__)

# GPU 사용 가능 여부 확인
print(torch.cuda.is_available())

# GPU 이름 확인 (만약 GPU가 있다면)
if torch.cuda.is_available():
    print(torch.cuda.get_device_name(0))
