import React from 'react';
import logo from './pages/imgs/estigmail_logo.png';

function Navbar() {

    //const history = useHistory();

    /*const goToEmail = () =>{
        let path = '/EnviarEmail';
        history.push(path);
    }

    const goToRascunhos = () =>{
        //let path = '/EnviarRascunho';
        //history.push(path);
    }*/

    /*let response;

    try {
        response.window.gapi.client.gmail.users.getProfile({
            'userId': 'me',
        });

    } catch (err) {
        return <h1>Login não efetuada.</h1>
    }*/

    function handleSignoutClick() {
        const token = window.gapi.client.getToken();
        if (token !== null) {
            window.google.accounts.oauth2.revoke(token.access_token);
            window.gapi.client.setToken('');
        }
    }

    return (
      <div>
          <div className="align-mid">
              <div className="right">
                  <a href="/" onClick={handleSignoutClick}>Terminar Sessão</a></div>
          </div>
          <img src={logo} alt="ESTIGmail" className="center-logo"/>
          <br/>
          <div className="topnav">
              <a>Consultar Emails</a>
              <a className="active">Enviar Email / Rascunho</a>
          </div>
      </div>
  );
}

export default Navbar;
