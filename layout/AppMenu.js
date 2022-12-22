import getConfig from 'next/config';
import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import axios from 'axios';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [posts, setPost] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:3000/api/menu')
            .then((res) => {
                setPost(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },[]);

var models = [];

for (var i = 0; i < posts.length; i++) {
 const itemsMenu = posts[i];

var tabNow 
var newItemsMenu = {};

  if (tabNow !== itemsMenu.tab) {
      tabNow = itemsMenu.tab;
      newItemsMenu.label = tabNow;
      newItemsMenu.items = posts.filter(itemsMenu => itemsMenu.tab === tabNow);
      models.push(newItemsMenu);
  }
}


return (
        <MenuProvider>
            <ul className="layout-menu">
                {models.map((items, i) => {
                    return !items.seperator ? <AppMenuitem item={items} root={true} index={i} key={items.label} /> : <li className="menu-separator"></li>;
                })}

             </ul>
        </MenuProvider>
    );
};

export default AppMenu;
