import React from "react"
import Icon from './icon.js';

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);        

        this.state ={isVisible:this.props.isVisible};

        this.styles = {
            sidebar:{
                position: "absolute",
                width: "120px",
                height: "100%",
                zIndex: "1000", 
                top: "50px",
                left: "0px",
                backgroundColor: "rgb(97, 97, 97)",
                overflowX: "hidden",
                transition: "0.2s",
                display: "block",
            },
            item:{
                backgroundColor: "rgb(97, 97, 97)",
                border:"none",
                color:"#FFF"              
            },
            icon:{
                paddingRight:"0.5em"
            }

        }

    }
    componentWillReceiveProps(nextProps)
    {  
        this.setState ({isVisible : nextProps.isVisible}); 
    }

    render(){
    
        let sidebarStyle = Object.assign({},this.styles.sidebar);
        this.styles.sidebar = sidebarStyle;
        if ( this.state.isVisible === true){
            this.styles.sidebar.left = "0px";
        }else{
            this.styles.sidebar.left = "-" + this.styles.sidebar.width;
        }

        return (
            <div style={this.styles.sidebar}> 
                <ul className="list-group">
                     <li className="list-group-item" style={this.styles.item}> 
                        <span style={this.styles.icon}>
                            <Icon type="panel" onClick={this.props.onClick1}/>
                        </span>
                        Panel    
                    </li>
                     <li className="list-group-item" style={this.styles.item}>                     
                        <span style={this.styles.icon} >
                            <Icon type="calendar" onClick={this.props.onClick2} />      
                        </span>
                        Calendar
                    </li>
                     <li className="list-group-item" style={this.styles.item}>                     
                        <span style={this.styles.icon} >
                            <Icon type="graph" onClick={this.props.onClick3} />      
                        </span>
                        Graph
                    </li>
                </ul>
            </div>
        );
    }
}