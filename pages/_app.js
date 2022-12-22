import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

export default function MyApp({ Component, pageProps }) {


    if (Component.pageProps) {
        return (
            <LayoutProvider>
                {Component.getLayout(<Component {...pageProps} />)}
            </LayoutProvider>
        )
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}


export async function getStaticProps() {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    // const res = await axios.get('http://localhost:3000/api/menu')
    const response = await axios.get('http://localhost:3000/api/menu').catch(function (error) {
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
     const model = await response.data;
    //   console.log(model)
    
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        model,
      },
    }
  
  }