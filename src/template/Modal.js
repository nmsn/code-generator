const template = (name = 'Index') => {
  return `
    import { Modal } from 'antd';
    
    const ${name}Modal = () => {
      return (<Modal>modal</Modal>)
    };
    
    export default ${name}Modal;
  `;
};

export default template;