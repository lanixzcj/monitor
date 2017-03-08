import React from 'react';
import MonNav from './Nav';
import Drawer from './Drawer'

export default class Frame extends React.Component {
    render() {
        return (
            <div >
                <Drawer {...this.props} {...this.props} >
                    <MonNav />
                    <div className="container">
                        {this.props.children}
                    </div>
                </Drawer>
            </div>
        );
    }
}
