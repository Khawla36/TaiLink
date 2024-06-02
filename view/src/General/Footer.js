import  {Component}  from "react";
import "./Footer.css";
import {Modal,Box} from '@mui/material';
import Contactus from "../Contactus";
import "../Contactus.css"

export default class Footer extends Component{
    constructor(props){
        super(props);
        this.state =
         {isOpen: false};
    }
    openModal = () => {
        this.setState({isOpen: true});

    }
  closeModal = () => {
        this.setState({isOpen: false});
    }

    render(){

         return(
            
        <footer>   


        <ul className="aboutcontact">
            <li><a className="us" href="./Aboutus">About Us </a></li>
            <li><button className="contactusbottun" onClick={this.openModal}>Contact Us</button></li>
        </ul>

        <p>&copy; 2024 TaiLink. All right reserved</p>
        <Modal
        open={this.state.isOpen}
        onClose={this.closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        < Box > 
        <button className="close-button" onClick={this.closeModal}>&times;</button>
        <Contactus />
        </Box>      

      </Modal>

    </footer>

        );
    }
}