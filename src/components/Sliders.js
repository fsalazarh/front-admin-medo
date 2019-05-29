import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Modal,Container, ButtonGroup, Button, Row, Col, Card } from 'react-bootstrap';
import SideBar from './SideBar';
import axios from 'axios';
import Image from './Image';
import UpdateParams from './UpdateParams';
import CreateParams from './CreateParams';
import SweetAlert from "react-bootstrap-sweetalert";

class Sliders extends Component{


	componentDidMount(){

		// check if user logged in
        //"http://me-do.cl/backend/api/images/

        var slidersRequest  =   axios.get('http://localhost:3001/api/slider_images');
        
        //then all request save results in state
         Promise.all([slidersRequest]).then((results) => {
            console.log(results);
            this.setState({collections:results[0]['data'].reverse(),load:false });
          })
          .catch(error => {
              console.log(error);
            return Promise.reject(error);
        });

	}

	constructor(props){
		super(props);
		this.state = {
            sliders:[],
            load: true,
            show:false,
            show2:false,
            handleClose:false,
            forms:{"text_en":"Texto EN","text_es":"Texto ES","text_it":"Texto IT"},
            params:{},
            target:0,
            showDelete:false,showError:false,showConfirm:false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleShow2 = this.handleShow2.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClose2 = this.handleClose2.bind(this);
        this.handleParams = this.handleParams.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        this.delete = this.delete.bind(this);
        this.hideAlert= this.hideAlert.bind(this);
    }

    handleClose(){this.setState({ show: false });}
    handleShow(){this.setState({ show: true });}
    handleClose2(){this.setState({ show2: false });}
    handleShow2() {this.setState({ show2: true });}
    
    handleParams(){
        var t = this.state.target;
        this.setState({params:this.state.collections[t]});
        this.handleShow()
    }
    saveChanges(){
        this.handleClose();
    }
    delete(){
        console.log("deleting!");

        /*
        var id = this.state.collectionsImages[this.state.target].id;
        axios.delete('http://localhost:3001/api/collections/'+ id.toString(), { data: {} }
        ).then(res => {
            console.log("result ",res);
            this.setState({showConfirm:true});
            window.location.reload(); 
        }) .catch(error => {
            console.log(error);
            this.setState({showError:true});
          return Promise.reject(error);
      });;
      
      // Delete folder
      */
       
    }

    hideAlert(){
        this.setState({showDelete:false,showError:false,showConfirm:false});
    }

    render(){
		
		if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{


            var listSliders = this.state.collections.map((element,i) => {

                var params = element;
                //var urlserver = "http://localhost:8080";
                var urlserver = "https://me-do.cl/";

                return( 
                        <Col xs={12} md={6} lg={6}>
                            <Row>
                                <Col  xs={8} md={8} lg={8}>
                                    <Card>
                                        
                                        <Card.Header>{element.slug} </Card.Header>
                                        <Card.Body>
                                            <Image size={"400"} getUrl={urlserver   + element.image} uploadUrl={element.image }   />
                                        </Card.Body>
                                    </Card>
                                    <br/>
                                </Col  >
                            
                                <Col xs={4} md={4} lg={4}>
                                    <br/>   <br/>   
                                    <ButtonGroup vertical>
                                        <Button variant="outline-primary" 
                                                onClick={() => { 
                                                    this.setState({target:i},function() {this.handleParams()}  ) ; 
                                                }}
                                        
                                        > <i class="fas fa-edit"></i> Editar </Button>
                                        <Button variant="outline-danger"> <i class="fas fa-trash"></i>   Eliminar </Button>
                                    </ButtonGroup>
                                    <br/>   
                                    
                                </Col>
                            </Row>
                        </Col>
                )
            });

            return(	
                <div className="wrapper">
                    <SideBar/>
                    <Container> 

                        <br/>
                        <Row >
                            <Col  xs={8} md={8} lg={8}> 
                                <Breadcrumb>
                                <Breadcrumb.Item active> Inicio </Breadcrumb.Item>
                                </Breadcrumb>
                            </Col> 
                            <Col  xs={4} md={4} lg={4}>  
                                <Button  onClick={this.handleShow2} variant="outline-success" size="lg"> <i class="fas fa-plus-circle "></i> Crear Slider</Button>
                            </Col> 
                        </Row>
                        <Row>
                            {listSliders}
                        </Row>

                    </Container> 

                    {/* Modal edit collection  */}
                    <Modal  size="lg" show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title> Editar Collección </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <UpdateParams url="slider_images"  params={this.state.params} forms={this.state.forms} />
                        </Modal.Body>
                       
                    </Modal>

                    {/* Modal create collection  */}
                    <Modal  size="lg" show={this.state.show2} onHide={this.handleClose2}>
                        <Modal.Header closeButton>
                            <Modal.Title> Crear Collección </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CreateParams url="slider_images" targetImage={{"name":"id","paramsName":"image","url":"/media/images/collections/","folder":true}} check={["text_en","text_es","text_it"]} name="Slider" forms={this.state.forms} />
                        </Modal.Body>
                       
                    </Modal>

                     {/* Sweet alert confirm delete:  */}
                     <SweetAlert 
                        warning
                        showCancel
                        confirmBtnText="Si, borralo!"
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title="Estas seguro?"
                        onConfirm={this.delete}
                        onCancel={this.hideAlert}
                        show={this.state.showDelete}
                    >
                        Una vez borrado no podras recuperar el slider.
                    </SweetAlert>

                    {/* Sweet alert success changes  */}
                    <SweetAlert 
                        show={this.state.showConfirm} 
                        success 
                        title="Cambios guardados correctamente!" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>
                    {/* Sweet alert Error  */}
                    <SweetAlert 
                        show={this.state.showError } 
                        danger 
                        title="A ocurrido un error :(" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>

                </div>
            ); 
        }

		



	}

}


export default Sliders;