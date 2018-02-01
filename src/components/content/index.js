import React, {Component} from 'react'
import {Segment} from 'semantic-ui-react'

class Content extends Component{
    render(){
        return(
            <Segment className="anywhere-content">
                {this.props.children}

                <style>
                    {`
                    .anywhere-content{
                        max-width: 962px;
                    }
                    `}
                </style>
            </Segment>
        )
    }
}

export default Content