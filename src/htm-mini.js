class N{constructor(t){this.t=t;this.p=null;this.c=[]}}
const WS=/\s/;
export default function mk(h, Frag){
  return function(strs,...vals){
    const root=new N(null);const stack=[root];let cur=root,mode='text',buf='',node=null,an='',q='',qv='',selfc=false;
    const flush=()=>{buf=buf.replace(/^\s*\n\s*|\s*\n\s*$/g,'');if(buf)cur.c.push(buf);buf=''};
    const open=t=>{node=new N(t);an='';selfc=false};
    const finish=()=>{cur.c.push(node);if(!selfc){stack.push(node);cur=node}mode='text';node=null;buf=''};
    const setP=(k,v)=>{(node.p||(node.p={}))[k]=v};
    for(let i=0;i<strs.length;i++){
      const s=strs[i];
      for(let j=0;j<s.length;j++){
        const ch=s[j];
        switch(mode){
          case 'text': if(ch==='<'){flush();mode='tagstart'}else buf+=ch;break;
          case 'tagstart': if(ch==='/'){mode='close'}else if(!WS.test(ch)){mode='tagname';buf=ch}break;
          case 'tagname':
            if(WS.test(ch)){open(buf);buf='';mode='attrs'}
            else if(ch==='>'){open(buf);buf='';finish()}
            else if(ch==='/'){open(buf);buf='';selfc=true;mode='attrs'}
            else buf+=ch;break;
          case 'close': if(ch==='>'){stack.pop();cur=stack[stack.length-1];mode='text';buf=''}break;
          case 'attrs':
            if(WS.test(ch)){}else if(ch==='>'){finish()}else if(ch==='/'){selfc=true}
            else if(ch==='='){mode='attrval'}else{an=ch;mode='attrname'}break;
          case 'attrname':
            if(ch==='='){mode='attrval'}
            else if(WS.test(ch)||ch==='>'||ch==='/'){setP(an,true);an='';mode='attrs';if(ch==='>')finish();if(ch==='/')selfc=true}
            else an+=ch;break;
          case 'attrval':
            if(ch==='"'||ch==="'"){q=ch;qv='';mode='quoted'}else if(WS.test(ch)){}else{qv=ch;mode='unq'}break;
          case 'quoted': if(ch===q){setP(an,qv);an='';mode='attrs'}else qv+=ch;break;
          case 'unq':
            if(WS.test(ch)||ch==='>'){setP(an,qv);an='';mode='attrs';if(ch==='>')finish()}else qv+=ch;break;
        }
      }
      if(i<vals.length){
        const v=vals[i];
        switch(mode){
          case 'text': flush();cur.c.push(v);break;
          case 'tagstart': open(v);mode='attrs';break;
          case 'attrval': setP(an,v);an='';mode='attrs';break;
          case 'quoted': qv+=v;break;
          default: break;
        }
      }
    }
    flush();
    const MAP={class:'className',for:'htmlFor',inputmode:'inputMode'};const fix=p=>{if(!p)return null;const o={};for(const k in p){o[MAP[k]||k]=p[k]}return o};
    const build=n=>n instanceof N?h(n.t,fix(n.p),...n.c.map(build)):n;
    return root.c.length===1?build(root.c[0]):h(Frag,null,...root.c.map(build));
  };
}
