import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState,useRef } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from "axios";
import { Messages } from 'primereact/messages';


const LoginPage =  () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const message = useRef();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});

    const addErrorMessage = () => {
        message.current.show({ severity: 'error', content: 'Usuario o Password Invalido' });
    };

 const handleSubmit= async (e)=>{ 
        e.preventDefault();
const response =  await axios.post('/api/auth/login',{email,password})        
.catch(function (error) {
    if (error.response) {
      // La respuesta fue hecha y el servidor respondió con un código de estado
      // que esta fuera del rango de 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
      // http.ClientRequest en node.js
      console.log(error.request);
    } else {
      // Algo paso al preparar la petición que lanzo un Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
if (response?.status===200){
    router.push('/')
}else{
    addErrorMessage();
}

// console.log(response.data);
// console.log(response.status);
// console.log(response.statusText);
// console.log(response.headers);
// console.log(response.config);
};




    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                {/* <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0"/> */}
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
       
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email/Usuario
                            </label>
                            <InputText inputid="email1" type="text" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} onChange={(e) => setEmail(e.target.value)} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contrasena
                            </label>
                            <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">
                                        Recuerdame
                                    </label>
                                </div>
                                {/* <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a> */}
                            </div>
                            <Button onClick={handleSubmit} label="Sign In" className="w-full p-3 text-xl"
                            // onClick={() => router.push('/')}
                             ></Button>
                            
                        </div>
                        <Messages ref={message} />
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
