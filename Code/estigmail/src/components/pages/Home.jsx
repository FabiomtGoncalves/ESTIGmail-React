import React from 'react';
import '../../App.css';
import email from './imgs/email.png';
import logo from "./imgs/estigmail_logo.png";
import gmail from "./imgs/gmail.png";
import {useHistory} from "react-router-dom";


function Home() {


    let history = useHistory();

    /*function onSignIn(googleUser) {
        const profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }

    const onSuccess = (res) => {
        const profile = res.getBasicProfile();
        console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
        //onSignIn(res);

        history.push({
            pathname: '/EnviarEmail',
            state:{
                image: profile.getImageUrl(),
                email: profile.getEmail(),
                nome: profile.getName(),
                userID: profile.getId()
            }
        });
    }

    const onFailure = (res) => {
      console.log("LOGIN FAILED! res: ", res)
    }*/


    const CLIENT_ID = '';
    const API_KEY = '';

    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

    const SCOPES = 'https://mail.google.com/ https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile';

    let tokenClient;
    let gapiInited = false;
    let gisInited = false;

    window.gapi.load('client', intializeGapiClient);

    try {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined later
        });
        gisInited = true;
    } catch (err) {
        window.location.reload();
    }


    async function intializeGapiClient() {
        await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
    }


    function handleAuthClick() {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }

            //console.log("Token", resp);

            let response;
            try {
                response = await window.gapi.client.gmail.users.getProfile({
                    'userId': 'me',
                });
                console.log("Obj", response);
                console.log("Email", response.result.emailAddress);
                let email = response.result.emailAddress;

                history.push({
                    pathname: '/EnviarEmail',
                    state: {
                        email: email
                    }
                });

            } catch (err) {
                console.log(response);
            }


        };

        token();

    }

    function token(){
        if (window.gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            tokenClient.requestAccessToken({prompt: ''});
        }
    }


    return (
        <div>
            <img src={logo} alt="ESTIGmail" className="center-logo"/>
            <br/>

            <div className="grid-container" id="grid">

                <div className="grid-item">
                    <div className="align-mid">
                        <img src={email} className="size" alt="Imagem de Email"/>
                            <button type="button" className="btnEmail" onClick={handleAuthClick} >twam20481@gmail.com</button>
                    </div>
                </div>

                <div className="grid-item">
                    <div className="align-mid">
                        <img src={email} className="size" alt="Imagem de Email"/>
                            <button type="button" className="btnEmail" onClick={handleAuthClick} >twam20481@gmail.com</button>
                    </div>
                </div>

                <div className="grid-item">
                        <button className="btn" type="button" onClick={handleAuthClick}>+</button>
                    <div className="align-mid">
                        <div className="text">Iniciar sessão com outra conta <a href="https://www.gmail.com" target="_blank"><img className="gmailSize" src={gmail} alt="Imagem de Perfil"/></a>.</div>
                    </div>
                </div>
            </div>

        </div>
    );
}


export default Home;
