import getConfig from 'next/config';
import React, { useContext, useEffect, useState } from 'react';
// import { LayoutContext } from './context/layoutcontext';
// import { MenuProvider } from './context/menucontext';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

const productClasification = (props) => {

    const [dropdownValue, setDropdownValue] = useState(props.value);
    const [dropdownValues, setDropdownValues] = useState(props.data);



    if (dropdownValue === undefined){setDropdownValue(dropdownValues[0].name)} ;

const itemTemplate = (option) => {
    return (
        <div className="flex align-items-center">
            <span style={{ width: '18px', height: '12px' }} />
            <span>{option.name}</span>
        </div>
    );
};





return (
        // <MenuProvider>
        <>
             <Dropdown  value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" optionValue="name" 
                                       
                                       // placeholder="Seleccionar Itbis"
                                       //filter
                                       display="chip"
                                        itemTemplate={itemTemplate}
                                  />
                                    </>
        // </MenuProvider>
    );
};




export default productClasification;
