import React from 'react';
import '../../App.css';
import {useHistory} from "react-router-dom";

function EnviarRascunho() {

    const history = useHistory();

    const goToEmail = () =>{
        let path = '/EnviarEmail';
        history.push(path);
    }

    let response;

    try {
        response.window.gapi.client.gmail.users.getProfile({
            'userId': 'me',
        });

    } catch (err) {
        return(
            <div>
                <button id='enviar2' onClick={goToEmail}>Back</button>
                <h1>Login não efetuada.</h1>
            </div>
        )
    }

    return(
        <div>
            <button id='enviar' onClick={goToEmail}>Back</button>
        <h1>EnviarRascunho</h1>
        </div>
    )
}

export default EnviarRascunho;