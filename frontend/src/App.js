import React from 'react';
import AmplifyMachine from './components/AmplifyMachine';

function App() {
  const normalInfo = {
    harmonyCount: 9,
    gold: 739200,
    rate: 60,
  };

  const safeInfo = {
    harmonyCount: 230,
    gold: 3656400,
    rate: 50,
  };

  return (
    <div>
      <AmplifyMachine
        level={8}
        itemType="무기"
        normalInfo={normalInfo}
        safeInfo={safeInfo}
      />
    </div>
  );
}

export default App;
