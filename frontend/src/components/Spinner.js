import React from 'react';

export default function Spinner() {
  return (
    <div style={style.flexRow}>
      <div className="progress" style={{ width: '450px' }}>
        <div className="indeterminate"></div>
      </div>
    </div>
  );
}

const style = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
