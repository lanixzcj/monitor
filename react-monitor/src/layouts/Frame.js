import React from 'react';
import MonNav from './Nav';


export default class Frame extends React.Component {
  render() {
    return (
      <div >

          <MonNav />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
