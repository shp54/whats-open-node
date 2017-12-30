const { h } = require('hyperapp');

const ConditionalLink = ({ url }, children) => {
  if(url){
    return <a href={url}>{children}</a>;
  } else {
    return <span>{children}</span>;
  }
}

module.exports = ConditionalLink;
