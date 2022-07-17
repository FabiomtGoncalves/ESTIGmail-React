import React from 'react';
import '../../App.css';
import info from './imgs/info.png';
import {useHistory} from "react-router-dom";
import gmail from "./imgs/gmail.png";
import $ from 'jquery';

let email = "";
let countSent = 0;
let countDraft = 0;

window.onbeforeunload = function () { return 'A sua sessão irá expirar, deseja continuar?' };

function EnviarEmail() {

    const history = useHistory();

    function goBack(){
        history.goBack();
    }

    try{
        window.gapi.client.getToken()
    } catch (err){
        return (
            <div className="center">
                <h1>Nenhuma sessão iniciada.</h1>
                <div className="align-mid">
                    <h2 className="text">Volte à página inicial e inicie sessão com a sua conta <img className="gmailSize" src={gmail} alt="Imagem do Gmail"/>.</h2>
                </div>
                <input type="submit" onClick={goBack} value="Voltar à página inicial" />
            </div>
        )
        //history.goBack();
    }

    let response;
    try {
        response = window.gapi.client.gmail.users.getProfile({
            'userId': 'me',
        });


    } catch (err) {
        console.log(response);
    }

    email = history.location.state.email;


    function showSentEmails() {
        const request = window.gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'labelIds': 'SENT',
        });

        request.execute(function(response) {
            $.each(response.messages, function() {
                const messageRequest = window.gapi.client.gmail.users.messages.get({
                    'userId': 'me',
                    'id': this.id
                });

                messageRequest.execute(appendMessageRowSent);
            });
        });
    }

    function showDrafts() {
        const request = window.gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'labelIds': 'DRAFT',
        });

        request.execute(function(response) {
            $.each(response.messages, function() {
                const messageRequest = window.gapi.client.gmail.users.messages.get({
                    'userId': 'me',
                    'id': this.id
                });

                messageRequest.execute(appendMessageRowDraft);
            });
        });
    }

    function appendMessageRowSent(message) {

        console.log(message.payload)

        //array[countSent] = getBody(message.payload);
        //console.log(array)

        countSent++;

        document.getElementById("counterSent").innerHTML = "Total: " + countSent;

        $('#table-sent').append(
            '<tr>\
            <td id="sent-message-' + message.id + '" >' + getHeader(message.payload.headers, 'Subject')+'</td>\
          <td>'+getHeader(message.payload.headers, 'Date')+'</td>\
          </tr>'
        );


        $('#sent-message-' + message.id).click(function(){
            $('.popup').show();
            document.getElementById("contentEmailTo").innerHTML = getHeader(message.payload.headers, 'To');
            document.getElementById("content").innerHTML = getBody(message.payload);
        });

        $('.popup').click(function(){
            $('.popup').hide();
        });
        $('.popupCloseButton').click(function(){
            $('.popup').hide();
        });

    }

    function appendMessageRowDraft(message) {

        console.log(message.payload)

        countDraft++;
        document.getElementById("counterDraft").innerHTML = "Total: " + countDraft;

        $('#table-draft').append(
            '<tr>\
            <td id="draft-' + message.id + '" >' + getHeader(message.payload.headers, 'Subject') + '</td>\
          <td>'+getHeader(message.payload.headers, 'Date')+'</td>\
          </tr>'
        );

        $('#draft-' + message.id).click(function(){
            document.getElementById("emailTo").value = getHeader(message.payload.headers, 'To');
            document.getElementById("subject").value = getHeader(message.payload.headers, 'Subject');
            document.getElementById("message").value = getBody(message.payload);
        });

    }


    function getHeader(headers, index) {
        let header = '';

        $.each(headers, function(){
            if(this.name === index){
                header = this.value;
            }

        });
        return header;
    }

    function getBody(message) {
        let encodedBody;
        if(typeof message.parts === 'undefined')
        {
            encodedBody = message.body.data;
        }
        else
        {
            encodedBody = getHTMLPart(message.parts);
        }
        encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        return decodeURIComponent(escape(window.atob(encodedBody)));
    }

    function getHTMLPart(arr) {
        for(let x = 0; x <= arr.length; x++)
        {
            if(typeof arr[x].parts === 'undefined')
            {
                if(arr[x].mimeType === 'text/html')
                {
                    return arr[x].body.data;
                }
            }
            else
            {
                return getHTMLPart(arr[x].parts);
            }
        }
        return '';
    }

    function send(e) {

        e.preventDefault();
        const form = e.target;
        const emailTo = form.elements["emailTo"].value;
        const subject = form.elements["subject"].value;
        const messageContext = form.elements["message"].value;

        const message =
            "From: " + email + "\r\n" +
            "To: " + emailTo + "\r\n" +
            "Subject: " + subject + "\r\n\r\n" + messageContext;

        const encodedMessage = btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        window.gapi.client.gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: encodedMessage
            }
        }).then(function () {
            console.log('Mensagem enviada.');
            //document.getElementById("table-sent").remove();
            //showSentEmails();
            window.alert("Email enviado com sucesso!");
            clear();
        }, function (error) {
            console.log(error);
            window.alert("Erro ao enviar email.");
        });
    }

    function draft() {

        let emailTo = document.getElementById("emailTo").value;
        let subject = document.getElementById("subject").value;
        let messageContext = document.getElementById("message").value;

        const message =
            "From: " + email + "\r\n" +
            "To: " + emailTo + "\r\n" +
            "Subject: " + subject + "\r\n\r\n" + messageContext;

        const encodedMessage = btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        window.gapi.client.gmail.users.drafts.create({
            userId: 'me',
            message: {
                raw: encodedMessage
            }

        }).then(function () {
            console.log('Rascunho Guardado.');
            window.alert("Rascunho guardado com sucesso!");
            clear();

        }, function (error) {
            console.log(error);
            window.alert("Erro ao guardar rascunho.");
        });
    }

    function clear(){
        document.getElementById("emailTo").value = "";
        document.getElementById("subject").value = "";
        document.getElementById("message").value = "";
    }

    window.onload = showSentEmails();
    window.onload = showDrafts();

    return (

        <div className="row">
            <div className="column">
                <div className="center">
                    <h2 className="messageTitle">Emails Enviados</h2>
                    <h4 id="counterSent">Counter</h4>
                    <div className="align-mid">
                        <img src={info} className="infoSize" alt="info"/>
                        Clique no assunto para visualizar mais informações.
                    </div>
                    <table className="emails">
                        <thead>
                        <tr>
                            <th>Assunto</th>
                            <th>Data</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="table-wrapper">
                        <div className="table-scroll">
                            <table id="table-sent" className="emails">
                                <thead>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="column">
                <div className="center">
                    <br/>
                    <form id='form' onSubmit={send}>
                        <label htmlFor="de">De: <b>{email}</b> </label><br/><br/>
                        <label htmlFor="emailTo">Para: </label><br/>
                        <input type='email' id='emailTo' name="emailTo" placeholder="email@gmail.com"/><br/><br/>
                        <label htmlFor="subject">Assunto:</label><br/>
                        <input type="text" id='subject' name='subject'/><br/><br/>
                        <label htmlFor="message">Mensagem: </label><br/>
                        <textarea id='message' name="message"/><br/>
                        <input type="file" id="file" name="file" multiple/><br/>
                        <input type="submit" value="Enviar Email" />
                    </form>
                    <div className="popup">
                        <span className="centerpopup"/>
                        <div className="center">
                            <div className="popupCloseButton">x</div>
                            <div className="table-scroll">
                                <h1 className="messageTitle">Para:</h1>
                                <p className="message" id="contentEmailTo"/>
                                <h1 className="messageTitle">Mensagem:</h1>
                                <p className="message" id="content"/>
                            </div>
                        </div>
                    </div>
                    <input type="submit" onClick={draft} value="Guardar como Rascunho" />
                    <br/>

                </div>


            </div>
            <div className="column">
                <div className="center">
                    <h2 className="messageTitle">Rascunhos</h2>
                    <h4 id="counterDraft">Counter</h4>
                    <div className="align-mid">
                        <img src={info} className="infoSize" alt="info"/>
                        Clique no assunto para utilizar determinado rascunho.
                    </div>
                    <table className="emails">
                        <thead>
                        <tr>
                            <th>Assunto</th>
                            <th>Data</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="table-wrapper">
                        <div className="table-scroll">
                            <table id="table-draft" className="emails">
                                <thead>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default EnviarEmail;