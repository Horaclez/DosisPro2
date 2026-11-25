const acorn=require('/opt/npm-tools/node_modules/acorn');const fs=require('fs');const path=require('path');
const SH={'../util.js':['n','ok','f','loc','fmt','hhmm','uid','load','save'],'../react.js':['useState','useEffect','html'],'../metrics.js':['K','M','judge'],
'../data.js':['limit','D','FAMS','MD','HAM','IDM','NB','BP','UN','PD','RD','CP','GR','SAL','UU','UL','toDrug'],
'../ui.js':['BTN','INP','Icon','Card','Banner','Tog','SEL','Fld','Al','Au','Res','Chk','Panel'],'./calc.js':['Calc'],'./custom.js':['Libre']};
for(const file of fs.readdirSync('src/screens')){
 const p=path.join('src/screens',file);let src=fs.readFileSync(p,'utf8').replace(/^import [^\n]*\n/gm,'');
 const toks=[];const ast=acorn.parse(src,{ecmaVersion:2022,sourceType:'module',onToken:toks});
 const used=new Set(toks.filter(t=>t.type.label==='name').map(t=>t.value));
 const declared=new Set();ast.body.forEach(s=>{const d=s.declaration||s;if(d.type==='FunctionDeclaration')declared.add(d.id.name);if(d.type==='VariableDeclaration')d.declarations.forEach(x=>declared.add(x.id.name))});
 let imp='';for(const [mod,names] of Object.entries(SH)){if(mod==='./'+file)continue;const need=names.filter(x=>used.has(x)&&!declared.has(x));if(need.length)imp+=`import { ${need.join(', ')} } from '${mod}';\n`}
 fs.writeFileSync(p,imp+'\n'+src);console.log(file,'->',imp.split('\n').filter(Boolean).length,'imports');
}
