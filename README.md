# 🚀 GitHub에서 프론트엔드 작업하기
## ✅ 작업 시작 시 (최초 1회)
```git clone {해당 리포지토리 주소}```
- 원격 저장소를 로컬로 복제
- 현재 작업 환경 확인:
  ```
  git remote -v
  git branch
  ```

## 🔄 이어서 작업할 때
### ✅ 변경사항이 없는 경우 (혼자 작업 중)
```
git add .
git commit -m "커밋 메세지"
git push
```
### ⚠️ 다른 사람이 push한 변경사항이 있을 때
1. 변경사항 임시 저장
```
git stash
```
2. 최신 코드 가져오기
```
git pull origin {브랜치명}
```
3. 숨긴 변경사항 다시 적용
```
git stash pop
```
4. 충돌 여부에 따라 처리

  - 🔴 충돌 발생 시
    - 충돌 파일이 빨간색으로 표시됨
    - 수동으로 수정하기
    - 현재 상태 확인:
      ```
      git status
      ```
  - 🟢 충돌 없음
    ```
    git add .
    git commit -m "커밋 메세지"
    git push
    ```

---

# 참고
1. git add 시 현재 파일 위치 확인
2. git commit 시 커밋메세지는 남들도 이해하기 쉽게 작성
3. git push 시 브랜치 확인하기
4. git stash 말고 다른 방법도 있음


 **위의 정보는 참고만 하고 자세한 건 검색하면서 진행** 
