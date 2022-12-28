import getConfig from 'next/config';
import React, { useContext, useEffect, useState } from 'react';
// import { LayoutContext } from './context/layoutcontext';
// import { MenuProvider } from './context/menucontext';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

const ProductSection = (queryResults) => {

    const [post, setPos] = useState([]);
    const [data, setData] = useState(queryResults);
    const [multiselectValue, setMultiselectValue] = useState(null);


console.log(data)

    useEffect(() => {
        axios
            .get('http://localhost:3000/api/productSection')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },[]);

// var models = [];
const itemTemplate = (option) => {
    return (
        <div className="flex align-items-center">
            <span style={{ width: '18px', height: '12px' }} />
            <span>{option.name}</span>
        </div>
    );
};

const onSuscriptionChange = (e) => {
    let _sucription = { ...e };
    setMultiselectValue(_sucription.value);

};

return (
        // <MenuProvider>
        <>
             <Dropdown
                                         value={multiselectValue}
                                         onChange={(e) => onSuscriptionChange(e, post)}
                                         options={data}
                                        optionLabel="name"
                                        placeholder="Seleccionar Suscripcion"
                                        filter
                                        display="chip"
                                         itemTemplate={itemTemplate}
                                    />
                                    </>
        // </MenuProvider>
    );
};




export default ProductSection;
