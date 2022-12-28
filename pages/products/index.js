import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { MultiSelect } from 'primereact/multiselect';
import { ToggleButton } from 'primereact/togglebutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { InputNumber } from 'primereact/inputnumber';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import ProductClasification from '../../components/inventory/ProductClasification.jsx'
import ProductSection from '../../components/inventory/ProductSection.jsx'
import ProductTray from '../../components/inventory/ProductTray.jsx'
import ProductWarranty from '../../components/inventory/ProductWarranty.jsx';
import CountryIva from '../../components/common/CountryIva.jsx';

const SignupSchema = Yup.object().shape({
    FirstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    LastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    Email: Yup.string().email('Invalid email').required('Required')
});

const Crud = ({ querySuscriptions }) => {
    let emptyPost = {
        Id: null,
        Active: true,
        FirstName: '',
        LastName: '',
        IdentificationType: 1,
        NoIdentification: 0,
        GenderTypeId: null,
        MaritalStatusId: null,
        BornDate: null,
        Email: '',
        Phone1: '',
        Phone2: null
    };

    let emptySuscription = []

    const [posts, setPosts] = useState(null);
    const [postDialog, setPostDialog] = useState(false);
    const [deletePostDialog, setDeletePostDialog] = useState(false);
    const [deletePostsDialog, setDeletePostsDialog] = useState(false);
    const [post, setPost] = useState(emptyPost);
    const [toggleValue, setToggleValue] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [suscriptions, setSuscriptions] = useState(querySuscriptions);
    const toast = useRef(null);
    const dt = useRef(null);
    const op = useRef(null);
    const op2 = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useEffect(() => {
        axios
            .get('http://localhost:3000/api/member')
            .then((res) => {
                setPosts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);



    let multiselectValues = suscriptions.filter((suscriptions) => suscriptions.id === -1);

    const formatCurrency = (value) => {
        return value?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setPost(emptyPost);
        setMultiselectValue(emptySuscription);
        setSubmitted(false);
        setPostDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPostDialog(false);
    };

    const hideDeletePostDialog = () => {
        setDeletePostDialog(false);
    };

    const hideDeletePostsDialog = () => {
        setDeletePostsDialog(false);
    };

    const toggle = (event) => {
        op.current.toggle(event);
    };


    const savePost = async ()  => {
        setSubmitted(true);

        if (post.FirstName.trim() && post.Phone1.trim()) {
            let _posts = [...posts];
            let _post = { ...post };
            let _multiselectValue = multiselectValue ;
            let _suscriptions = suscriptions ;
            let _suscription = [] ;
            let responseId = 0 ;
            if (post.Id) {
                const index = findIndexById(post.Id);
                   let _post = { ...post };
                _posts[index] = _post;
                 responseId = _post.Id
                axios
                    .put('http://localhost:3000/api/member', _post)
                    .then(function  (response) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Actualizado con exito!', life: 3000 });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

          
          } else {
                _post.Id = createId();             
                _posts.push(_post);
                await  axios.post('http://localhost:3000/api/member', _post)
                    .then(function (response) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Producto Creado con Exito', life: 3000 });
                        responseId =   response.data.Id;
                        _post.Id = responseId,
                        _post[`${'Id'}`] = responseId;
                      
                       
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
          
        // console.log(responseId ,'ID ************** TOTAL',(_suscriptions.filter(e => e.id == responseId)).length )

        // _suscriptions.filter(e => e.id == responseId)

           
             
     
        _suscriptions.splice(_suscriptions.findIndex(e => e.id == responseId),(_suscriptions.filter(e => e.id == responseId)).length,);

            for (var i = 0; i < _multiselectValue.length; ++i) {
              
                   _multiselectValue[i].isSelected = responseId;
                   _suscriptions.splice(1,0,{name:_multiselectValue[i].name,id:responseId,code:_multiselectValue[i].code})
              
            }

           
            // console.log('********** _suscriptions',_suscriptions);
            // console.log('********** suscriptions',_suscriptions);
            // console.log('********** suscription',_suscription);
            // console.log('********** _multiselectValue',_multiselectValue);
          

            axios.delete('http://localhost:3000/api/suscription', {data:{Id: responseId}}).then(function (response) {
                console.log(response.data);  
                
            })
            .catch(function (error) {
                console.log(error);
            });

            axios.post('http://localhost:3000/api/suscription', _multiselectValue)
            .then(function (response) {
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Creado con Exito', life: 3000 });
            })
            .catch(function (error) {
                console.log(error);
            });

            setPosts(_posts);
            setSuscriptions(_suscriptions);
            setPostDialog(false);
            setPost(emptyPost);
            setMultiselectValue(emptySuscription);
        }
    };

    const editPost = (post) => {
   
        let _multiselectValues = suscriptions.filter((suscriptions) => suscriptions.id == post.Id);
        let _suscriptions = suscriptions.filter((suscriptions) => suscriptions.id == -1);


        if (_multiselectValues.length == 0) {
            _suscriptions = [];
        }

        for (var i = 0; i < _multiselectValues.length; ++i) {
            let codeNow = _multiselectValues[i]['code'];
            
            for (var x = 0; x < _suscriptions.length; ++x) {
                if (_suscriptions[x] !== undefined && _suscriptions[x]['code'] == codeNow) {
                    _suscriptions[x].isSelected = post.Id;
                }
            }
        }

        _multiselectValues = suscriptions.filter((_suscriptions) => _suscriptions.isSelected == post.Id );

    //   console.log(JSON.stringify(multiselectValues))
        //   console.log(suscriptions)
          setMultiselectValue(_multiselectValues);

        setPost({ ...post });
        setPostDialog(true);
    };

    const confirmDeletePost = (post) => {
        setPost(post);
        setDeletePostDialog(true);
    };

    const deletePost = () => {
 
        axios.delete('http://localhost:3000/api/member', {data :{Id:post.Id}})
                    .then(function (response) {
                        console.log(response);
                        let _posts = posts.filter((val) => val.Id !== post.Id);
            setPosts(_posts);
            setDeletePostDialog(false);
            setPost(emptyPost);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Miembreo Eliminado', life: 3000 });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

        axios.delete('http://localhost:3000/api/suscription', {data:{Id: post.Id}}).then(function (response) {
            console.log(response);

            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Suscripcion Eliminada', life: 3000 });
        })
        .catch(function (error) {
            console.log(error);
        });

    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].Id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePostsDialog(true);
    };

    const deleteSelectedPosts = () => {
        let _posts = posts.filter((val) => !selectedPosts.includes(val));
        setPosts(_posts);
        setDeletePoatsDialog(false);
        setSelectedPosts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Posts Deleted', life: 3000 });
    };

    const onSuscriptionChange = (e) => {
        let _sucription = { ...e };
        setMultiselectValue(_sucription.value);
   
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _post = { ...post };
        _post[`${name}`] = val;

        setPost(_post);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedPosts || !selectedPosts.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _post = { ...post };
        _post[`${name}`] = val;

        setPost(_post);
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.FirstName + ' ' + rowData.LastName}
            </>
        );
    };

    function formatPhoneNumber(phoneNumberString) {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '' + match[1] + '-' + match[2] + '-' + match[3];
        }
        return null;
    }

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const phon2BodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tel. 2</span>
                {formatPhoneNumber(rowData.Phone2)}
            </>
        );
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const statusBodyTemplate = (rowData) => {
        var estatus = 'activo';
        if (rowData.Active === false) {
            estatus = 'inactivo';
        } else {
        }
        return (
            <>
                <span className="p-column-title">Estatus</span>
                <span className={`post-badge status-${estatus.toLowerCase()}`}>{estatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPost(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmDeletePost(rowData)} />
                <Button icon="pi pi-images"  className="p-button-rounded p-button-info "   onClick={toggle}  />
                                <OverlayPanel ref={op} appendTo={typeof window !== 'undefined' ? document.body : null} showCloseIcon>
                                    <img src={`${contextPath}/demo/images/nature/nature9.jpg`} alt="nature1" />
                                </OverlayPanel>

            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Productos y Servicios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const postDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button form="member" type="submit" label="grabar" icon="pi pi-check" className="p-button-text" onClick={savePost} />
        </>
    );
    const deletePostDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePostDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePost} />
        </>
    );
    const deletePostsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePostsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPosts} />
        </>
    );

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span style={{ width: '18px', height: '12px' }} />
                <span>{option.name}</span>
            </div>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <Formik
                        initialValues={{
                            FirstName: '',
                            LastName: '',
                            Email: ''
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => {
                            // same shape as initial values
                            console.log(values);
                        }}
                    >
                        {({ errors, touched, validateField }) => (
                            <Form id="product">
                                                     </Form>
                        )}
                    </Formik>
                                <DataTable
                                    ref={dt}
                                    value={posts}
                                    selection={selectedPosts}
                                    onSelectionChange={(e) => setSelectedPosts(e.value)}
                                    dataKey="Id"
                                    paginator
                                    rows={50}
                                    rowsPerPageOptions={[50,100, 300]}
                                    className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
                                    globalFilter={globalFilter}
                                    emptyMessage="Productos no encontrados."
                                    header={header}
                                    responsiveLayout="scroll"
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '2rem' }}></Column>
                                    <Column field="code" header="Codigo" body={phon2BodyTemplate} headerStyle={{ minWidth: '9rem' }} sortable></Column>
                                    <Column field="Description" header="Descripcion" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                    <Column field="Cost" header="Costo" body={priceBodyTemplate} sortable></Column>
                                    <Column field="Price" header="Precio" body={priceBodyTemplate} sortable headerStyle={{ minWidth: '9rem' }}></Column>
                                    <Column field="Iva" header="Itbis" body={priceBodyTemplate} sortable headerStyle={{ minWidth: '9rem' }}></Column>
                                    <Column field="TotalPrice" header="Neto" body={priceBodyTemplate} sortable headerStyle={{ minWidth: '9rem' }}></Column>
                                    <Column field="Suscriptions" header="Clasificacion"  body={statusBodyTemplate} headerStyle={{ minWidth: '9rem' }} sortable></Column>
                                    <Column field="classificationId" header="Sub Clasificacion"  headerStyle={{ minWidth: '9rem' }} hidden={true} ></Column>
                                    <Column field="Existence" header="Existencia" hidden={false} sortable></Column>
                                    <Column field="Active" header="Estatus" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '5rem' }} hidden={false}></Column>                                    
                                    <Column field="SubclassificationId" header="Sub Clasificacion" headerStyle={{ minWidth: '9rem' }} hidden={true} ></Column>
                                    <Column field="BarCode" header="Codigo Barra" headerStyle={{ minWidth: '9rem' }} hidden={true} ></Column>
                                    <Column field="Section" header="Tramo" headerStyle={{ minWidth: '9rem' }} hidden={true} ></Column>
                                    <Column field="Tray" header="Bandeja" headerStyle={{ minWidth: '9rem' }} hidden={true} ></Column>                                    
                                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} align="centered" ></Column>
                                </DataTable>

                                <Dialog form="member" visible={postDialog} style={{ width: '750px' }} header="Detalle Productos" modal className="p-fluid" footer={postDialogFooter} onHide={hideDialog}>
                                    {/* {post.image && <img src={`${contextPath}/demo/images/post/${post.image}`} alt={post.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                                   
                                    <div className="formgrid grid">
                                    <div className="field col">                                       

                                        <div className="field col">
                                        <label htmlFor="LastName">Codigo</label>
                                        <InputText InputText id="FirstName" value={post.FirstName} onChange={(e) => onInputChange(e, 'FirstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !post.FirstName })}/>
                                        {submitted && !post.FirstName && <small className="p-invalid">Descripcion del  producto requerida.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="LastName">Descripcion</label>
                                        <InputText InputText id="FirstName" value={post.FirstName} onChange={(e) => onInputChange(e, 'FirstName')} required  className={classNames({ 'p-invalid': submitted && !post.FirstName })} />
                                        {submitted && !post.FirstName && <small className="p-invalid">Descripcion del  producto requerida.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="LastName">Clasificacion</label>
                                    <ProductClasification
                                    />
                                        </div>
                                    </div>                                    
    
                                    {<img src={`${contextPath}/demo/images/product/gaming-set.jpg`} alt={post.image} width="300" className="mt-1 mx-auto mb-5 block shadow-2" />}
                                    </div>
                                    <div className="formgrid grid">
                                    <div className="field col">
                                <label htmlFor="cost">Costo</label>
                                <InputNumber id="Cost" value={post.Cost} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>

                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <InputNumber id="Price" value={post.Price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="itbis">Itbis</label>
                                <CountryIva/>
                            </div>
                            <div className="field col">
                                <label htmlFor="total">Total</label>
                                <InputNumber id="Total" value={post.Total} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            
                                    </div>

               
                           <Fieldset legend="Avanzado" toggleable>
                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="NoIdentification">Seccion</label>

                                            <ProductSection   />
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="NoIdentification">Bandeja</label>
                                            {/* <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" /> */}
                                            <ProductTray
                                    />
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="BornDate">Codigo Barra</label>

                                            <Calendar id="BornDate" mask="99/99/9999" slotChar="mm/dd/yyyy" value={post.BornDate} onChange={(e) => onInputChange(e, 'BornDate')} rows={3} cols={20} />
                                        </div>
                                    </div>
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="NoIdentification">Garantia</label>

                                            <ProductWarranty
                                    />
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="NoIdentification">Existencia Almacen</label>

                                            <ToggleButton id="Active" htmlFor="Active" checked={post.Active} onChange={(e) => onInputChange(e, 'Active')} onLabel="Cliente Activo" offLabel="Cliente Inactivo" />
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="BornDate">Estatus</label>                        
                                        <ToggleButton id="Active" htmlFor="Active" checked={post.Active} onChange={(e) => onInputChange(e, 'Active')} onLabel="Cliente Activo" offLabel="Cliente Inactivo" />
                      
                                        </div>
                                    </div>
                                   

                    </Fieldset>

                                   
                                  
                                </Dialog>

                                <Dialog visible={deletePostDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePostDialogFooter} onHide={hideDeletePostDialog}>
                                    <div className="flex align-items-center justify-content-center">
                                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                        {post && (
                                            <span>
                                                ¿Estás segura de que quieres eliminar?<b>{post.FirsName}</b>?
                                            </span>
                                        )}
                                    </div>
                                </Dialog>

                                <Dialog visible={deletePostsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePostsDialogFooter} onHide={hideDeletePostsDialog}>
                                    <div className="flex align-items-center justify-content-center">
                                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                        {post && <span>¿Estás segura de que quieres eliminar los Productos seleccionados?</span>}
                                    </div>
                                </Dialog>
   
                </div>
            </div>
        </div>
    );
};

export async function getStaticProps() {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    const response = await axios.get('http://localhost:3000/api/suscription').catch(function (error) {
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
    const querySuscriptions = await response.data;
    //    console.log(suscriptions)

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            querySuscriptions
        }
    };
}

export default Crud;
