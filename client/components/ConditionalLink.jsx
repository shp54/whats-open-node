const { h } = require('hyperapp');

const ConditionalLink = ({ url }, children) => {
  if(url){
    return <a href={url} target='_blank'>{children}</a>;
  } else {
    return <span>{children}</span>;
  }
}

module.exports = ConditionalLink;
