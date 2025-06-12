// src/components/AmplifyPanel.js
import React, { useState } from 'react';
import axios from 'axios';
import AmplifyMachine from './AmplifyMachine';
import './AmplifyPanel.css';

function AmplifyPanel() {
  const [level, setLevel] = useState(0);
  const [itemType, setItemType] = useState('무기');
  const [useProtection, setUseProtection] = useState(true);
  const [useHarmony, setUseHarmony] = useState(true);
  const [useConflict, setUseConflict] = useState(true);
  const [harmonyPrice, setHarmonyPrice] = useState('');
  const [conflictPrice, setConflictPrice] = useState('');
  const [protectionPrice, setProtectionPrice] = useState('');
  const [result, setResult] = useState('');
  const [cost, setCost] = useState(0);
  const [destroyed, setDestroyed] = useState(false);

  const handleAmplify = async (type) => {
    try {
      const res = await axios.post('http://localhost:8000/amplify', {
        amplify_type: type,
        item_type: itemType,
        current_level: level,
        use_protection: useProtection,
        use_harmony: useHarmony,
        use_conflict: useConflict,
        harmony_price: harmonyPrice === '' ? 0 : Number(harmonyPrice),
        conflict_price: conflictPrice === '' ? 0 : Number(conflictPrice),
        protection_price: protectionPrice === '' ? 0 : Number(protectionPrice),
      });

      const data = res.data;
      setLevel(data.next_level);
      setResult(data.message);
      setCost((prev) => prev + data.cost);
      setDestroyed(data.destroyed);

      if (data.destroyed) {
        setLevel(0);
      }
    } catch (err) {
      console.error('증폭 실패:', err);
      setResult('⚠ 서버 오류');
    }
  };

  const handleReset = () => {
    setLevel(0);
    setCost(0);
    setResult('');
    setDestroyed(false);
  };

  // 증폭 정보 계산용 (샘플)
  const normalInfo = {
    harmonyCount: 3,
    gold: 258720,
    rate: 48,
  };

  const safeInfo = {
    harmonyCount: 10,
    gold: 1050000,
    rate: 98,
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '30px' }}>
      <AmplifyMachine
        level={level}
        itemType={itemType}
        normalInfo={normalInfo}
        safeInfo={safeInfo}
      />

      <div style={{ marginTop: '20px' }}>
        {/* 시작 수치 설정 */}
        <div style={{ marginBottom: '10px' }}>
          <label>시작 증폭 수치: </label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            disabled={destroyed}
            style={{ width: '60px', marginLeft: '8px' }}
          />
        </div>

        {/* 장비 종류 선택 */}
        <div style={{ marginBottom: '10px' }}>
          <label>장비 종류: </label>
          <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
            <option value="무기">무기</option>
            <option value="방어구/악세">방어구/악세</option>
          </select>
        </div>

        {/* 옵션 체크 */}
        <label>
          <input
            type="checkbox"
            checked={useProtection}
            onChange={() => setUseProtection(!useProtection)}
          />
          증폭 보호권 사용
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={useHarmony}
            onChange={() => setUseHarmony(!useHarmony)}
          />
          조화의 결정체 구매
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={useConflict}
            onChange={() => setUseConflict(!useConflict)}
          />
          모순의 결정체 구매
        </label>

        {/* 가격 입력 */}
        <div style={{ marginTop: '10px' }}>
          <label>조화의 결정체 가격: </label>
          <input
            type="number"
            value={harmonyPrice}
            onChange={(e) => setHarmonyPrice(e.target.value)}
            placeholder="예: 2700"
          />
          <br />
          <label>모순의 결정체 가격: </label>
          <input
            type="number"
            value={conflictPrice}
            onChange={(e) => setConflictPrice(e.target.value)}
            placeholder="예: 55000"
          />
          <br />
          <label>증폭 보호권 가격: </label>
          <input
            type="number"
            value={protectionPrice}
            onChange={(e) => setProtectionPrice(e.target.value)}
            placeholder="예: 11100000"
          />
        </div>

        {/* 증폭 버튼 */}
        <div style={{ marginTop: '15px' }}>
          <button onClick={() => handleAmplify('normal')} disabled={destroyed}>
            🔥 일반 증폭
          </button>
          <button onClick={() => handleAmplify('safe')} disabled={destroyed} style={{ marginLeft: '10px' }}>
            🛡️ 안전 증폭
          </button>
          <button onClick={handleReset} style={{ marginLeft: '10px' }}>
            🔄 초기화
          </button>
        </div>

        {/* 결과 및 비용 */}
        <div style={{ marginTop: '15px', fontWeight: 'bold' }}>
          누적 골드 소모: {cost.toLocaleString()} G
        </div>
        <div style={{ marginTop: '5px', color: 'skyblue' }}>{result}</div>
      </div>
    </div>
  );
}

export default AmplifyPanel;
