import React from 'react'

const styles = {
  normal: {
    backgroundColor: '#eee',
    color: '#000'
  },
  inverse: {
    backgroundColor: '#666',
    color: '#fff'
  }
}

export default (props) => (
  <div style={{
    ...styles[props.inverse? 'inverse' : 'normal'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '45px',
    fontWeight: '800'
  }}>
    {props.children}
  </div>
)
