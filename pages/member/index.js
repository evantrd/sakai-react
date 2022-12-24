import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
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

const SignupSchema = Yup.object().shape({
    FirstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    LastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    Email: Yup.string().email('Invalid email').required('Required')
});

const Crud = ({ suscriptions }) => {
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

    let emptySuscription = { name: '', id: -1, code: '' };

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
    const [suscriptionSelectValue, setSuscriptionSelectValue] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
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

    
    const openNew = () => {
        setPost(emptyPost);
        setSubmitted(false);
        setPostDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPostDialog(false);save
    };

    const hideDeletePostDialog = () => {
        setDeletePostDialog(false);
    };

    const hideDeletePostsDialog = () => {
        setDeletePostsDialog(false);
    };

    const savePost = () => {
        setSubmitted(true);

        if (post.FirstName.trim() && post.Phone1.trim()) {
            let _posts = [...posts];
            let _post = { ...post };
            let _multiselectValue = multiselectValue ;
            if (post.Id) {
                const index = findIndexById(post.Id);
                //       if ( _post.NoIdentification.length = 9){
                //         _post.IdentificationType = 1
                //    } _post.IdentificationType = 2
                let _post = { ...post };
                _posts[index] = _post;

                axios
                    .put('http://localhost:3000/api/member', _post)
                    .then(function (response) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Actualizado con exito!', life: 3000 });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

          
                    for (var i = 0; i < _multiselectValue.length; ++i) {
                       
                        _multiselectValue[i].isSelected = _post.Id;                          
                    }
                        
                    
                            axios
                    .post('http://localhost:3000/api/suscription', _multiselectValue)
                    .then(function (response) {
                        console.log(response);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Creado con Exito', life: 3000 });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

          } else {
                _post.Id = createId();

                _posts.push(_post);
                axios
                    .post('http://localhost:3000/api/member', _post)
                    .then(function (response) {
                        console.log(response);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Creado con Exito', life: 3000 });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                    

            
            }

            setPosts(_posts);
            setPostDialog(false);
            setPost(emptyPost);
        }
    };

    const editPost = (post) => {
        let _multiselectValues = suscriptions.filter((suscriptions) => suscriptions.id == post.Id);
        let _suscriptions = suscriptions.filter((suscriptions) => suscriptions.id == -1);

        if (_multiselectValues.length === 0) {
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

        _suscriptions = _suscriptions.filter((_suscriptions) => _suscriptions.isSelected == post.Id);
         console.log(JSON.stringify(multiselectValues))
         setMultiselectValue(_suscriptions);

        setPost({ ...post });
        setPostDialog(true);
    };

    const confirmDeletePost = (post) => {
        setPost(post);
        setDeletePostDialog(true);
    };

    const deletePost = () => {
        let _posts = posts.filter((val) => val.Id !== post.Id);
        setPosts(_posts);
        setDeletePostDialog(false);
        setPost(emptyPost);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Post Deleted', life: 3000 });
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
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.Email}
            </>
        );
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

    const phone1BodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tel. 1</span>
                {formatPhoneNumber(rowData.Phone1)}
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePost(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar Miembros</h5>
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
                            <Form id="member">
                                <DataTable
                                    ref={dt}
                                    value={posts}
                                    selection={selectedPosts}
                                    onSelectionChange={(e) => setSelectedPosts(e.value)}
                                    dataKey="Id"
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
                                    globalFilter={globalFilter}
                                    emptyMessage="Miembros no encontrados."
                                    header={header}
                                    responsiveLayout="scroll"
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '2rem' }}></Column>
                                    <Column field="FirstName" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                    <Column field="Phone1" header="Telefono 1" body={phone1BodyTemplate} headerStyle={{ minWidth: '9rem' }}></Column>
                                    <Column field="Phone2" header="Telefono 2" body={phon2BodyTemplate} headerStyle={{ minWidth: '9rem' }}></Column>
                                    <Column field="Email" header="Email" body={emailBodyTemplate} sortable headerStyle={{ minWidth: '9rem' }}></Column>
                                    <Column field="Active" header="Estatus" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '5rem' }} hidden={true}></Column>
                                    <Column field="Suscriptions" header="Suscripciones" headerStyle={{ minWidth: '9rem' }}></Column>
                                    <Column field="NoIdentification" header="NoIdentification" hidden={true}></Column>
                                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '9rem' }} align="right"></Column>
                                </DataTable>

                                <Dialog form="member" visible={postDialog} style={{ width: '450px' }} header="Detalle Miembros" modal className="p-fluid" footer={postDialogFooter} onHide={hideDialog}>
                                    {post.image && <img src={`${contextPath}/demo/images/post/${post.image}`} alt={post.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}

                                    <div className="field">
                                        <label htmlFor="FirstName">Nombre</label>
                                        <InputText id="FirstName" value={post.FirstName} onChange={(e) => onInputChange(e, 'FirstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !post.FirstName })} />
                                        {submitted && !post.FirstName && <small className="p-invalid">Nombre requerido.</small>}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="LastName">Apellido</label>
                                        <InputText id="LastName" value={post.LastName} onChange={(e) => onInputChange(e, 'LastName')} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="Email">Email</label>
                                        <InputText form="member" id="Email" value={post.Email} onChange={(e) => onInputChange(e, 'Email')} rows={3} cols={20} required type="email" />
                                        {submitted && errors.Email && touched.Email ? <div>{errors.Email}</div> : null}
                                    </div>
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="Phone1">Telefono 1</label>
                                            <InputMask
                                                id="Phone1"
                                                mask="999-999-9999"
                                                placeholder="000-000-0000"
                                                value={post.Phone1}
                                                onChange={(e) => onInputChange(e, 'Phone1')}
                                                rows={3}
                                                cols={20}
                                                required
                                                className={classNames({ 'p-invalid': submitted && !post.Phone1 })}
                                            />
                                            {submitted && !post.Phone1 && <small className="p-invalid">*</small>}
                                        </div>

                                        <div className="field col">
                                            <label htmlFor="Phone2">Telefono 2</label>
                                            <InputMask id="Phone2" mask="999-999-9999" placeholder="000-000-0000" value={post.Phone2} onChange={(e) => onInputChange(e, 'Phone2')} rows={3} cols={20} />
                                        </div>
                                    </div>

                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="NoIdentification">Doc. Identidad</label>
                                            <InputText id="NoIdentification" value={post.NoIdentification} onChange={(e) => onInputChange(e, 'NoIdentification')} rows={3} cols={20} />
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="BornDate">Aniversario</label>

                                            <Calendar id="BornDate" mask="99/99/9999" slotChar="mm/dd/yyyy" value={post.BornDate} onChange={(e) => onInputChange(e, 'BornDate')} rows={3} cols={20} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <ToggleButton id="Active" htmlFor="Active" checked={post.Active} onChange={(e) => onInputChange(e, 'Active')} onLabel="Cliente Activo" offLabel="Cliente Inactivo" />
                                    </div>

                                    <MultiSelect
                                        value={multiselectValue}
                                        onChange={(e) => onSuscriptionChange(e, post)}
                                        options={multiselectValues}
                                        optionLabel="name"
                                        placeholder="Seleccionar Suscripcion"
                                        filter
                                        display="chip"
                                        itemTemplate={itemTemplate}
                                    />
                                </Dialog>

                                <Dialog visible={deletePostDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePostDialogFooter} onHide={hideDeletePostDialog}>
                                    <div className="flex align-items-center justify-content-center">
                                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                        {post && (
                                            <span>
                                                Are you sure you want to delete <b>{post.FirsName}</b>?
                                            </span>
                                        )}
                                    </div>
                                </Dialog>

                                <Dialog visible={deletePostsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePostsDialogFooter} onHide={hideDeletePostsDialog}>
                                    <div className="flex align-items-center justify-content-center">
                                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                        {post && <span>Are you sure you want to delete the selected posts?</span>}
                                    </div>
                                </Dialog>
                            </Form>
                        )}
                    </Formik>
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
    const suscriptions = await response.data;
    //    console.log(suscriptions)

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            suscriptions
        }
    };
}

export default Crud;
