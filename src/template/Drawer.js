const template = (name = 'Index') => {
  return `
    import { Drawer } from 'antd';
    
    const ${name}Drawer = () => {
      return (<Drawer>drawer</Drawer>)
    };
    
    export default ${name}Drawer;
  `;
};

export default template;