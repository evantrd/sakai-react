import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState,createContext} from 'react';
import { ProductService } from '../demo/service/ProductService';
import { LayoutContext } from '../layout/context/layoutcontext';
import Link from 'next/link';
import axios from 'axios';
import { MenuProvider,MenuContext } from '../layout/context/menucontext';
import AppMenu from '../layout/AppMenu';
import AppMenuitem from '../layout/AppMenuitem';
//import apiMessage from '../pages/api/message/app'


export const menuItemContext = createContext();
const lineData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Juio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    datasets: [
        {
            label: 'Mensajes Enviados a Clientes',
            data: [300, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.1
        },
        {
            label: 'Mensajes Respondidos',
            data: [150, 48, 40, 19, 86, 27, 90,28, 48, 40, 19, 86,],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.1
        }
    ]
};



const Dashboard = ({model}) => {
  
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);
    const [menuItems, setMenuItems] = useState(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const getProfile= async (e)=>{ 
        e.preventDefault();
    const response =  await axios.post('/api/auth/profile')        
    console.log(response)
    };

   
    //  if  ({model}){
    //     setMenuItems({model:'hola mundo'});
    //     console.log(model)
    //  }
    // console.log(model)
    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <menuItemContext.Provider value={model}>
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Promociones</span>
                            <div className="text-900 font-medium text-xl">1,152</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">350 nuevas </span>
                    <span className="text-500">Solicitudes Clientes</span>
                </div>
            </div>

            <div className="col-16 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Clientes Afiliados</span>
                            <div className="text-900 font-medium text-xl">28,441</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">520 nuevos </span>
                    <span className="text-500">clientes </span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Mensajes</span>
                            <div className="text-900 font-medium text-xl">1,152 Mensajes</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">300 </span>
                    <span className="text-500">Respondidos</span>
                </div>
            </div>

            <div className="col-12 xl:col-4">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Suscripciones</h5>
                        <div>
 
                        </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Autorizacion Over/short</span>
  
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-orange-500 h-full" style={{ width: '50%' }} />
                                </div>
                                <span className="text-orange-500 ml-3 font-medium">%50</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Estatus Cierre Envasadoras</span>
                          
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-cyan-500 h-full" style={{ width: '16%' }} />
                                </div>
                                <span className="text-cyan-500 ml-3 font-medium">%16</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Alerta Inventarios</span>
                                
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-pink-500 h-full" style={{ width: '67%' }} />
                                </div>
                                <span className="text-pink-500 ml-3 font-medium">%67</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Notificacion Lider Planta</span>
                         
                            </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-green-500 h-full" style={{ width: '35%' }} />
                                </div>
                                <span className="text-green-500 ml-3 font-medium">%35</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Estatus Orden Cliente</span>
                                              </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-purple-500 h-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-purple-500 ml-3 font-medium">%0</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Vencimiento No. Fiscal</span>
                                </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-teal-500 h-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">%0</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Vencimiento No. Fiscal</span>
                                </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-teal-500 h-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">%0</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Vencimiento No. Fiscal</span>
                                </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-teal-500 h-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">%0</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Vencimiento No. Fiscal</span>
                                </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-teal-500 h-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">%0</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Vencimiento No. Fiscal</span>
                                </div>
                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                    <div className="bg-teal-500 h-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-teal-500 ml-3 font-medium">%0</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-8">
                <div className="card">
                    <h5>Interaccion Mensajes Clientes</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
            {/* <ul className="layout-menu">
                {model?.map((item, i) => {
                    return !item.seperator ? <AppMenuitem  item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul> */}
        </div>
        </menuItemContext.Provider>
        
        
    );
};




// export async function getStaticProps() {
//     // Call an external API endpoint to get posts.
//     // You can use any data fetching library
//     // const res = await axios.get('http://localhost:3000/api/menu')
//     const response = await axios.get('http://localhost:3000/api/menu').catch(function (error) {
//       if (error.response) {
//           // La respuesta fue hecha y el servidor respondió con un código de estado
//           // que esta fuera del rango de 2xx
//           console.log(error.response.data);
//           console.log(error.response.status);
//           console.log(error.response.headers);
//       } else if (error.request) {
//           // La petición fue hecha pero no se recibió respuesta
//           // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
//           // http.ClientRequest en node.js
//           console.log(error.request);
//       } else {
//           // Algo paso al preparar la petición que lanzo un Error
//           console.log('Error', error.message);
//       }
//       console.log(error.config);
//   });
//      const model = await response.data;
//     //   console.log(model)
    
//     // By returning { props: { posts } }, the Blog component
//     // will receive `posts` as a prop at build time
//     return {
//       props: {
//         model,
//       },
//     }
  
//   }

   
// export async function getServerSideProps() {
//     // Call an external API endpoint to get posts.
//     // You can use any data fetching library
//     // const res = await axios.get('http://localhost:3000/api/menu')
//     const response = await axios.get('http://localhost:3000/api/customer').catch(function (error) {
//       if (error.response) {
//           // La respuesta fue hecha y el servidor respondió con un código de estado
//           // que esta fuera del rango de 2xx
//           console.log(error.response.data);
//           console.log(error.response.status);
//           console.log(error.response.headers);
//       } else if (error.request) {
//           // La petición fue hecha pero no se recibió respuesta
//           // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
//           // http.ClientRequest en node.js
//           console.log(error.request);
//       } else {
//           // Algo paso al preparar la petición que lanzo un Error
//           console.log('Error', error.message);
//       }
//       console.log(error.config);
//   });
//      const model = await response.data;
//        console.log(model)
    
//     // By returning { props: { posts } }, the Blog component
//     // will receive `posts` as a prop at build time
//     return {
//       props: {
//         model,
//       },
//     }
  
//   }


export default Dashboard;
