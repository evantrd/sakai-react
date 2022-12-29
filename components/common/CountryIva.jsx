import getConfig from 'next/config';
import React, { useContext, useEffect, useState } from 'react';
// import { LayoutContext } from './context/layoutcontext';
// import { MenuProvider } from './context/menucontext';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

const CountryIva = (props) => {


    const [dropdownValue, setDropdownValue] = useState(props.value||'0.18');
    const [dropdownValues, setDropdownValues] = useState(props.data);



     

    //   useEffect  ( async()   =>  {
    //     await  axios
    //         .get('http://localhost:3000/api/countryIva')
    //         .then((res) => {
    //             setDropdownValues(res.data);
    //             if (props.value === undefined){setDropdownValue(res.data[0].name)} ;
              
                
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // },[]);


const itemTemplate = (option) => {
    return (
        <div className="flex align-items-center">
            <span style={{ width: '18px', height: '12px' }} />
            <span>{option.value}</span>
        </div>
    );
};



return (
        // <MenuProvider>
        <>
             <Dropdown  value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name"
             optionValue="value"
                                       
                                         // placeholder="Seleccionar Itbis"
                                         //filter
                                         display="chip"
                                          itemTemplate={itemTemplate}
                                    />
                                    </>
        // </MenuProvider>
    );
};




export default CountryIva;
