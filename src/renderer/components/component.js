import React from "react"
import ActionCreator from "../action/action.js"
import RecodeStore from "../store/recodestore.js"
import EventEmitter from "../dispatcher/eventemiter.js"
import Util from '../../common/util.js'
// import { Modal,Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Transition from 'react-transition-group/Transition';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from  'react-transition-group/CSSTransition';

import Icon from './icon.js';
import Sidebar from './sidebar.js';
import Navbar from './navbar.js';
import Form from './form.js';
import Calendar from './calendar.js';

let dispatcher = new EventEmitter();
let action = new ActionCreator(dispatcher);
let store = new RecodeStore(dispatcher);

class SubjectFilter extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            value:"",
            isApply:false
        }
        this._handleChange = this._handleChange.bind(this);
        this._handleApply= this._handleApply.bind(this);
    }
    _handleChange(e){
        e.preventDefault();
        this.setState({value:e.target.value});
    }
    _handleApply(e){
        e.preventDefault();
        this.props.onClick("subject",this.state.value);
    }
    render(){
         return (
            <div className="input-group">
                <input type="text" value={this.state.value} onChange={this._handleChange} className="form-control" />
                <span className="input-group-btn">
                    <button onClick={this._handleApply} className="btn btn-secondary" >Apply</button>
                </span>
            </div>

        );       
    }
}

class DateFilter extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        //[TODO] inplement filter componect for datatable
    }
}

class TagFilter extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        //[TODO] inplement filter componect for datatable
    }
}

class Modalwindow extends React.Component{
    constructor(props){
        super(props);
        this.state =  {
            isModal:false
        };
        store.on("FORMCHANGE",(err)=>{
            this.setState({isModal:true});
        });

        this._openModal = this._openModal.bind(this);
        this._closeModal = this._closeModal.bind(this);

    }
    _openModal() {
        this.setState({isModal:true});
    }
    _closeModal(){
        this.setState({isModal:false});
    }
    render(){
        return (
            <Icon type="plus" onClick={(e)=>{
                action.setForm({});
                this._openModal();  
            }}>
                <Modal show={this.state.isModal} onHide={this._closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {this.props.body} 
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            </Icon>

        );
    }
}

class Recode extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLive : true,
            isVisible :true
        };
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._handleClickEdit = this._handleClickEdit.bind(this);

    }
    _handleClickDelete(){
        this.setState({isVisible : false},()=>{ 
            setTimeout(()=>{
                // console.log("send delete",this.props.recode);
                action.deleteRecode(this.props.recode);
            },500);
            
               
        });
    }
    _handleClickEdit (){
        action.setForm(this.props.recode)
    }
    render(){
        // console.log("Recode:render start:", recode);
        
        let recode = this.props.recode;
        // let date = Util.getDate(recode.history[recode.history.length - 1]);
        // let dateString = Util.getDateString(date);
        if ( recode !== null) {
            return  (
                <CSSTransition 
                    in={this.state.isVisible}
                    onExited={()=>{
                            this.setState({isLive:false});  
                    }}
                    timeout={500}
                    classNames="fade"
                >  
                    <tr className={this.state.isVisible ?  '' : 'false'}> 
                        <th scope="row">
                            <div>
                                <button type="button" onClick={this._handleClickEdit} className="btn btn-line btn-primary btn-sm" >
                                    <Icon type="edit"/>
                                </button>
                            </div>
                        </th>
                        <td>
                            <div>
                                {recode.value}
                            </div>    
                        </td>
                        <td>
                            <div>
                                <button type="button" onClick={this._handleClickDelete} className="btn btn-line btn-primary btn-sm" >
                                    <Icon type="delete"/>
                                </button>
                            </div>
                        </td>
                    </tr>
                </CSSTransition> 
            ); 
        }else {
            return null;
        }
    }
}

class DataTable extends React.Component{
    //[TODO] render recodes twice when delete event fired.
    //first is from Recode component.
    //second is triggered by change event from store.
    //who should be responseble for store change? 
    constructor(props){
        super(props); 
        
        this.state = {
            isVisible:true,
            isRecodesUptoDate:true,
            filter:{
                type:"none",
                value:""
            }
        }

        this.style = {
            display:"block",
        }

        this._handleFilter = this._handleFilter.bind(this);

        store.on("CHANGE",(err)=>{
            this.setState({isRecodesUptoDate:true});
        });
    }
    componentWillReceiveProps(nextProps)
    {  
        this.setState({isVisible : nextProps.isVisible}); 
    }

    _handleFilter(type,value){
        this.setState({filter:{type:type,value:value}});
    }
    render(){
        // console.log("DataTable:render start");
        // let test = Object.assign([],store.recodes);
        // console.log(test);
        // object is passed as a reference. but it is not a problem
        //[TODO] test it's ok to locate in constructor or not

        let style = Object.assign({},this.style);
        this.style = style;
        if ( this.state.isVisible === true){
            this.style = {display:"block"};
        }else{
            this.style = {display:"none"};   
        }

        let recodes = store.recodes.sort((x,y)=>{
            return  x.value >= y.value ;
         }).map((x,i)=>{

            let data = x; 
            if (  this.state.filter.type ==="subject" &&  x.value.match(this.state.filter.value) === null ){
                data = null;
            }
            return (  
                <Recode recode={data} key={x._id} />
            )

        });
        
        return (

            <div className="well" style={this.style}>
            <SubjectFilter onClick={this._handleFilter}/>
            <table className="table">
                <thead>
                    <tr>
                        <th className="col-xs-1" >#</th>
                        <th className="col-xs-10" >subject</th>
                        <th className="col-xs-1" >op</th>
                    </tr>
                </thead>
                 <TransitionGroup component="tbody" >
                    {recodes}
                </TransitionGroup>
             </table> 
             </div>
        );
    }    
}


export default class Component extends React.Component {
    constructor(props) {
        super(props);  
        this.state = {
            isSbVisible:true,
            isPanelVisible:true,
            isCalendarVisible:false,
            isGraphVisible:false
        };
           
        this.sbStateChenge = this.sbStateChenge.bind(this);
        this.panelStateChange = this.panelStateChange.bind(this);
        this.calendarStateChange = this.calendarStateChange.bind(this);
        this.graphStateChange = this.graphStateChange.bind(this);
    }
    sbStateChenge(){
        this.setState((state)=>{
            return {isSbVisible:!state.isSbVisible}
        });
    }
    panelStateChange(){
        this.setState((state)=>{
            return {
                isPanelVisible:true,
                isCalendarVisible:false,
                isGraphVisible:false
            }
        });
    }
    calendarStateChange(){
        this.setState((state)=>{
            return {
                isPanelVisible:false,
                isCalendarVisible:true,
                isGraphVisible:false

            }
        });
    }
    graphStateChange(){
        this.setState((state)=>{
            return {
                isPanelVisible:false,
                isCalendarVisible:false,                
                isGraphVisible:true
            }
        });
    }
    render(){
        let navbarBody = <Modalwindow body={<Form store={store} action={action}/>} />

        return (
            <div className="container">
                <Navbar title="Lerning Recorder" body={navbarBody} onClick={this.sbStateChenge}/>
                 <div className="row"> 
                 {/* <TransitionGroup component="div"  className="row"> */}
                
                    <Sidebar   isVisible={this.state.isSbVisible} 
                               onClick1={this.panelStateChange} 
                               onClick2={this.calendarStateChange} 
                               onClick3={this.graphStateChange} 
                    />
                    <CSSTransition 
                        in={this.state.isPanelVisible}
                        timeout={500}
                        classNames="fade"
                    >
                        <DataTable isVisible={this.state.isPanelVisible} /> 
                    </CSSTransition>

                    <CSSTransition 
                        in={this.state.isCalendarVisible}
                        timeout={500}
                        classNames="fade"
                    >
                        <Calendar  isVisible={this.state.isCalendarVisible} />  
                    </CSSTransition>              
                    {/* <Graph     isVisible={this.state.isGraphVisible} />   */}
                    
                 </div> 
                {/* </TransitionGroup> */}
            </div>
        );
    }


}