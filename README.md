# logforce-node
nodejs기반의 로그 모듈

## 목표
이 프로젝트는 마이크로서비스 구조에서 원인을 빠르게 파악하고 손쉬운 모니터링이 가능한 로그를 남길 수 있는 라이브러리 개발을 목표로 하고 있습니다.

위 목표를 만족하기 위해 다음과 같은 요구사항이 만족되어야 합니다.
1. N대의 서버로그를 1대의 서버로그처럼 볼 수 있어야 한다.
2. 요청-응답 사이의 모든 로그를 시간 순서대로 볼 수 있어야 한다.
3. 에러 발생시 정확한 stack trace를 볼 수 있어야 하며, 요청부터 에러 발생까지의 모든 로그를 볼 수 있어야 한다.
4. 특별한 상황에서만 발생하는 로그를 손쉽게 추적할 수 있어야 한다.
5. 에러 발생시 다양한 방법으로 알림을 줄 수 있어야 한다.

위 요구사항을 만족하기 위해 다음과 같은 기능들이 필요 합니다.
1. 로그 publish를 위한 다양한 adapter 기능.
2. 비동기 처리 등의 상황에도 논리적 흐름을 유지할 수 있는 기능
3. 에러 발생시 notification을 위한 다양한 adapter 기능.
4. 태그 기능

이 프로젝트의 로그를 손쉽게 모니터링하고 검색할 수 있는 서비스가 필요 합니다.

## 설치
```npm install logforce-node```

## 사용법
### 기본 사용법
```
const Logforce = require('../index.js');
let logforce = new Logforce();
logger.json('log', { test: '일반적인 로그' });
logger.json('log', { test: '색깔이 들어간 로그' }, { color: 'yellow' });
logger.json('error', { test: '에러' }, { color: 'red' });
logger.publish();
```
결과
```
[log][ns:test][ts:2019-01-09 07:41:29.2929] {"test":"일반적인 로그"}
[log][ns:test][ts:2019-01-09 07:41:29.2929] {"test":"색깔이 들어간 로그"}
[error][ns:test][ts:2019-01-09 07:41:29.2929] {"test":"에러"}
```

### 타임스탬프 옵션
기본적으로 기록되는 타임스탬프는 UTC기준입니다. 타임존을 변경하기 위해서는 옵션을 추가 해야 합니다.
```
const Logforce = require('../index.js');
let logforce = new Logforce({ timestamp: { format: 'hh:mm:ss', timezone: 'asia/seoul' }});
logger.json('log', { test: '일반적인 로그' });
logger.json('log', { test: '색깔이 들어간 로그' }, { color: 'yellow' });
logger.json('error', { test: '에러' }, { color: 'red' });
logger.publish();
```
결과
```
[log][ns:test][ts:04:43:30] {"test":"일반적인 로그"}
[log][ns:test][ts:04:43:30] {"test":"색깔이 들어간 로그"}
[error][ns:test][ts:04:43:30] {"test":"에러"}
```


## 라이센스
[MIT License](LICENSE).