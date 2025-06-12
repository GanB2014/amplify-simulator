import React, { useState } from 'react';
import axios from 'axios';
import './AmplifyMachine.css';

function AmplifyMachine() {
  const [level, setLevel] = useState(6);
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
  const [correctionCount, setCorrectionCount] = useState(0);

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
        correction_count: correctionCount,
      });

      const data = res.data;
      setLevel(data.next_level);
      setResult(data.message);
      setCost((prev) => prev + data.cost);
      setDestroyed(data.destroyed);
      if (data.destroyed) {
        setLevel(0);
      }
      if (type === 'safe' && !data.success) {
        setCorrectionCount((prev) => prev + 1);
      } else if (type === 'safe' && data.success) {
        setCorrectionCount(0);
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
    setCorrectionCount(0);
  };

  const harmonyTable = {
    weapon: {
      0: { quantity: 36, gold: 430100, success: 100, correction: '-' },
      1: { quantity: 41, gold: 490600, success: 100, correction: '-' },
      2: { quantity: 46, gold: 551100, success: 100, correction: '-' },
      3: { quantity: 51, gold: 611600, success: 100, correction: '-' },
      4: { quantity: 55, gold: 876652, success: 70, correction: '10' },
      5: { quantity: 67, gold: 1072098, success: 60, correction: '10' },
      6: { quantity: 109, gold: 1730400, success: 50, correction: '10' },
      7: { quantity: 122, gold: 1932679, success: 50, correction: '5' },
      8: { quantity: 230, gold: 3656400, success: 40, correction: '5' },
      9: { quantity: 320, gold: 5084870, success: 30, correction: '5' },
    },
    armor: {
      0: { quantity: 16, gold: 189860, success: 100, correction: '-' },
      1: { quantity: 21, gold: 250360, success: 100, correction: '-' },
      2: { quantity: 26, gold: 310860, success: 100, correction: '-' },
      3: { quantity: 31, gold: 371360, success: 100, correction: '-' },
      4: { quantity: 46, gold: 490750, success: 70, correction: '10' },
      5: { quantity: 58, gold: 615450, success: 60, correction: '10' },
      6: { quantity: 98, gold: 1043132, success: 50, correction: '10' },
      7: { quantity: 109, gold: 1157283, success: 50, correction: '5' },
      8: { quantity: 212, gold: 2246200, success: 40, correction: '5' },
      9: { quantity: 277, gold: 2937440, success: 30, correction: '5' },
    },
  };

  const normalSuccessRateTable = {
    0: 100,
    1: 100,
    2: 100,
    3: 100,
    4: 80,
    5: 70,
    6: 60,
    7: 70,
    8: 60,
    9: 50,
    10: 40,
    11: 30,
    12: 20,
    13: 20,
    14: 20,
  };

  const normalPenaltyTable = {
    0: '유지',
    1: '유지',
    2: '유지',
    3: '유지',
    4: '하락',
    5: '하락',
    6: '하락',
    7: '+4로 하락',
    8: '+5로 하락',
    9: '+6로 하락',
    10: '파괴',
    11: '파괴',
    12: '파괴',
    13: '파괴',
    14: '파괴',
  };

  const getSafeAmplifyInfo = () => {
    const typeKey = itemType === '무기' ? 'weapon' : 'armor';
    return harmonyTable[typeKey][level] || { quantity: '-', gold: 0, success: 0, correction: '-' };
  };

  const getNormalGold = () => (itemType === '무기' ? 739200 : 258720);

  const getCorrectedSuccessRate = () => {
    const base = getSafeAmplifyInfo().success;
    const correction = getSafeAmplifyInfo().correction;
    if (correction === '-') return `${base}%`;
    const bonus = parseInt(correction) * correctionCount;
    return `${base + bonus}% (보정 확률 +${bonus}%)`;
  };

  return (
    <div className="machine-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '20px' }}>
        <div className="start-level">
          <label>시작 증폭 수치:</label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            disabled={destroyed}
            style={{ width: '60px' }}
          />
        </div>

        <div className="amplify-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#73f5af' }}>
          +{level} {itemType}
        </div>

        <div className="right-controls" style={{ textAlign: 'right' }}>
          <label>장비 종류:</label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="type-select"
          >
            <option value="무기">무기</option>
            <option value="방어구/악세">방어구/악세</option>
          </select>
          <div style={{ marginTop: '6px' }}>
            <label className="below">
              <input
                type="checkbox"
                checked={useProtection}
                onChange={() => setUseProtection(!useProtection)}
              />
              증폭 보호권 사용
            </label>
          </div>
        </div>
      </div>

      <div className="frame-container">
        <img src="/assets/frame.png" alt="프레임" className="frame-img" />
        <img
          src={itemType === '무기' ? '/assets/weapon-icon.png' : '/assets/armor-icon.png'}
          alt="장비 아이콘"
          className="item-icon-centered"
        />
      </div>

      <div className="amplify-panels">
        <div className="panel normal">
          <label>
            <input
              type="checkbox"
              checked={useConflict}
              onChange={() => setUseConflict(!useConflict)}
            />
            모순의 결정체 구매
          </label>

          <h4>일반증폭</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/assets/conflict.png" alt="모순" className="material-icon" />
            <span className="material-text conflict-text">{`${level + 1} 모순의 결정체`}</span>
          </div>
          <p className="gold">{getNormalGold().toLocaleString()} 골드</p>
          <p className="success">✔ 성공 확률 {normalSuccessRateTable[level] || 0}%</p>
          <p className="fail">
            {normalPenaltyTable[level] === '파괴' && useProtection
              ? '✘ 실패 시 +0 하락 (파괴 방지)'
              : `✘ 실패 시 ${normalPenaltyTable[level]}`}
          </p>
          <button onClick={() => handleAmplify('normal')} disabled={destroyed}>⚒ 증폭</button>
        </div>

        <div className="panel safe">
          <label>
            <input
              type="checkbox"
              checked={useHarmony}
              onChange={() => setUseHarmony(!useHarmony)}
            />
            조화의 결정체 구매
          </label>

          <h4>안전증폭</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/assets/harmony.png" alt="조화" className="material-icon" />
            <span className="material-text harmony-text">{`${getSafeAmplifyInfo().quantity} 조화의 결정체`}</span>
          </div>
          <p className="gold">{getSafeAmplifyInfo().gold.toLocaleString()} 골드</p>
          <p className="success">✔ 성공 확률 {getCorrectedSuccessRate()}</p>
          <p className="fail">
            {getSafeAmplifyInfo().success < 100
              ? `✘ 실패 시 유지${getSafeAmplifyInfo().correction !== '-' ? `, 보정치 ${getSafeAmplifyInfo().correction}%p` : ''}`
              : '\u00A0'}
          </p>
          <button onClick={() => handleAmplify('safe')} disabled={destroyed}>⚒ 안전증폭</button>
        </div>
      </div>

      <div className="options" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '16px' }}>
        <div className="row">
          <label>조화의 결정체 가격:</label>
          <input
            type="number"
            value={harmonyPrice}
            onChange={(e) => setHarmonyPrice(e.target.value)}
            placeholder="예: 2700"
            style={{ width: '100px' }}
          />
        </div>
        <div className="row">
          <label>모순의 결정체 가격:</label>
          <input
            type="number"
            value={conflictPrice}
            onChange={(e) => setConflictPrice(e.target.value)}
            placeholder="예: 55000"
            style={{ width: '100px' }}
          />
        </div>
        <div className="row">
          <label>증폭 보호권 가격:</label>
          <input
            type="number"
            value={protectionPrice}
            onChange={(e) => setProtectionPrice(e.target.value)}
            placeholder="예: 11100000"
            style={{ width: '120px' }}
          />
        </div>
      </div>

      <div className="result-section">
        <p className="result">{result}</p>
        <p className="gold">누적 골드 소모: {cost.toLocaleString()} G</p>
        <button onClick={handleReset}>🔄 초기화</button>
      </div>
    </div>
  );
}

export default AmplifyMachine;
