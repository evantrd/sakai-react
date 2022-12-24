
    // for (var i = 0; i < multiselectValues.length; ++i) {
    //     multiselectValues[i]['Id'] = null;
      
    // }

//   const multiselectValues2 =   suscriptions.reduce((acum, item)=> ({...acum
//   ,[item.id]: item           
//         })
       
//         ,{} );


// onst Dashboard = ({model}) => 

const ArrayReduceElement = (posts,parameter) => {

  const newPost =  posts.reduce((acum, post)=> {
    return Array.from( new Set([...acum,...post[`${parameter}`]]))
},[] );
  
 console.log('reduce',newPost);
        
};




export default ArrayReduceElement;