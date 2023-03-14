var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function l(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode&&t.parentNode.removeChild(t)}function i(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function d(){return u(" ")}function f(t,e,n,l){return t.addEventListener(e,n,l),()=>t.removeEventListener(e,n,l)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function p(t,e){t.value=null==e?"":e}let v;function g(t){v=t}const b=[],$=[],_=[],D=[],y=Promise.resolve();let x=!1;function z(t){_.push(t)}const C=new Set;let M=0;function w(){if(0!==M)return;const t=v;do{try{for(;M<b.length;){const t=b[M];M++,g(t),T(t.$$)}}catch(t){throw b.length=0,M=0,t}for(g(null),b.length=0,M=0;$.length;)$.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];C.has(e)||(C.add(e),e())}_.length=0}while(b.length);for(;D.length;)D.pop()();x=!1,C.clear(),g(t)}function T(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}const k=new Set;function E(t,e){-1===t.$$.dirty[0]&&(b.push(t),x||(x=!0,y.then(w)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function L(r,a,s,i,u,d,f,m=[-1]){const h=v;g(r);const p=r.$$={fragment:null,ctx:[],props:d,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(h?h.$$.context:[])),callbacks:n(),dirty:m,skip_bound:!1,root:a.target||h.$$.root};f&&f(p.root);let b=!1;if(p.ctx=s?s(r,a.props||{},(t,e,...n)=>{const l=n.length?n[0]:e;return p.ctx&&u(p.ctx[t],p.ctx[t]=l)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](l),b&&E(r,t)),e}):[],p.update(),b=!0,l(p.before_update),p.fragment=!!i&&i(p.ctx),a.target){if(a.hydrate){const t=(D=a.target,Array.from(D.childNodes));p.fragment&&p.fragment.l(t),t.forEach(c)}else p.fragment&&p.fragment.c();a.intro&&(($=r.$$.fragment)&&$.i&&(k.delete($),$.i(_))),function(t,n,r,a){const{fragment:s,after_update:c}=t.$$;s&&s.m(n,r),a||z(()=>{const n=t.$$.on_mount.map(e).filter(o);t.$$.on_destroy?t.$$.on_destroy.push(...n):l(n),t.$$.on_mount=[]}),c.forEach(z)}(r,a.target,a.anchor,a.customElement),w()}var $,_,D;g(h)}class H{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(e,n){if(!o(n))return t;const l=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return l.push(n),()=>{const t=l.indexOf(n);-1!==t&&l.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function I(t,e,n){const l=t.slice();return l[6]=e[n],l}function N(t){let e;return{c(){(e=i("p")).textContent="We cannot validate the Credential at this time. Please contact\n          apostille@utc.edu for assistance. When you do, please provide the\n          student name and CeDiD",m(e,"class","svelte-11mutzh")},m(t,n){s(t,e,n)},d(t){t&&c(e)}}}function j(t){let e,n=t[1],l=[];for(let e=0;e<n.length;e+=1)l[e]=O(I(t,n,e));return{c(){for(let t=0;t<l.length;t+=1)l[t].c();e=u("")},m(t,n){for(let e=0;e<l.length;e+=1)l[e].m(t,n);s(t,e,n)},p(t,o){if(6&o){let r;for(n=t[1],r=0;r<n.length;r+=1){const a=I(t,n,r);l[r]?l[r].p(a,o):(l[r]=O(a),l[r].c(),l[r].m(e.parentNode,e))}for(;r<l.length;r+=1)l[r].d(1);l.length=n.length}},d(t){!function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(l,t),t&&c(e)}}}function A(e){let n;return{c(){(n=i("p")).textContent="Make sure to enter a valid ID for example 222G-MI3O-ZZZZ",m(n,"class","svelte-11mutzh")},m(t,e){s(t,n,e)},p:t,d(t){t&&c(n)}}}function O(t){let e,n,l,o,r,d,f,p,v,g,b,$,_,D,y,x,z,C,M,w,T=t[6].CeDiplomaID+"",k=t[6].Name+"",E=t[6].ConferralDate+"",L=t[6].Degree1+"";return{c(){e=i("tbody"),n=i("tr"),(l=i("td")).innerHTML="<b></b>This is a valid credential<b></b>  ",(o=i("td")).textContent=`${t[2]}`,r=i("tr"),(d=i("td")).innerHTML="<b>CeDiD:</b>",f=i("td"),p=u(T),v=i("tr"),(g=i("td")).innerHTML="<b>Name:</b>",b=i("td"),$=u(k),_=i("tr"),(D=i("td")).innerHTML="<b>Conferral Date: </b>",y=i("td"),x=u(E),z=i("tr"),(C=i("td")).innerHTML="<b>Credential:</b>",M=i("td"),w=u(L),m(l,"class","svelte-11mutzh"),m(o,"class","svelte-11mutzh"),m(n,"class","svelte-11mutzh"),m(d,"class","svelte-11mutzh"),m(f,"class","svelte-11mutzh"),m(r,"class","svelte-11mutzh"),m(g,"class","svelte-11mutzh"),m(b,"class","svelte-11mutzh"),m(v,"class","svelte-11mutzh"),m(D,"class","svelte-11mutzh"),m(y,"class","svelte-11mutzh"),m(_,"class","svelte-11mutzh"),m(C,"class","svelte-11mutzh"),m(M,"class","svelte-11mutzh"),m(z,"class","svelte-11mutzh")},m(t,c){s(t,e,c),a(e,n),a(n,l),a(n,o),a(e,r),a(r,d),a(r,f),a(f,p),a(e,v),a(v,g),a(v,b),a(b,$),a(e,_),a(_,D),a(_,y),a(y,x),a(e,z),a(z,C),a(z,M),a(M,w)},p(t,e){2&e&&T!==(T=t[6].CeDiplomaID+"")&&h(p,T),2&e&&k!==(k=t[6].Name+"")&&h($,k),2&e&&E!==(E=t[6].ConferralDate+"")&&h(x,E),2&e&&L!==(L=t[6].Degree1+"")&&h(w,L)},d(t){t&&c(e)}}}function Z(e){let n,r,u,h,v,g,b,$,_,D,y,x,z,C,M,w,T,k=e[1].length>0&&""===e[1][0].CeDiplomaID&&N();function E(t,e){return" "===t[0]||""===t[0]?A:t[1].length>0&&""!==t[1][0].CeDiplomaID?j:void 0}let L=E(e),H=L&&L(e);return{c(){n=i("form"),(r=i("div")).innerHTML='<h2 class="credentialvalidationtitle">Credential Validation</h2>',u=d(),h=i("div"),v=i("div"),(g=i("label")).textContent="CeDiD*",b=d(),$=i("input"),_=d(),(D=i("button")).textContent="Validate",y=d(),x=i("div"),k&&k.c(),z=d(),H&&H.c(),C=d(),(M=i("p")).innerHTML='Powered by <a href="https://secure.cecredentialtrust.com/">CeCredentialTrust</a>',m(r,"class","credentialvalidation_form_title svelte-11mutzh"),m(g,"for","ceDiD"),m(g,"class","ceDiDlabel svelte-11mutzh"),m($,"type","text"),m($,"id","utccredential"),m(D,"class","button btn--lightblue button--sm button cevalidatebutton svelte-11mutzh"),m(D,"type","submit"),m(v,"class","ceflexform max-w-xs svelte-11mutzh"),m(x,"class","credential_validation_result_message cepl-32 svelte-11mutzh"),m(h,"class","credentialvalidation_form ceflex credential_validation_result_message svelte-11mutzh"),m(M,"class","credentialvalidation_form_footer svelte-11mutzh"),m(n,"class","credentialvalidationform col-end-2 svelte-11mutzh")},m(t,l){var c;s(t,n,l),a(n,r),a(n,u),a(n,h),a(h,v),a(v,g),a(v,b),a(v,$),p($,e[0]),a(v,_),a(v,D),a(h,y),a(h,x),k&&k.m(x,null),a(x,z),H&&H.m(x,null),a(n,C),a(n,M),w||(T=[f($,"input",e[4]),f(n,"submit",(c=function(){o(e[3](e[0]))&&e[3](e[0]).apply(this,arguments)},function(t){return t.preventDefault(),c.call(this,t)}))],w=!0)},p(t,[n]){e=t,1&n&&$.value!==e[0]&&p($,e[0]),e[1].length>0&&""===e[1][0].CeDiplomaID?k||((k=N()).c(),k.m(x,z)):k&&(k.d(1),k=null),L===(L=E(e))&&H?H.p(e,n):(H&&H.d(1),(H=L&&L(e))&&(H.c(),H.m(x,null)))},i:t,o:t,d(t){t&&c(n),k&&k.d(),H&&H.d(),w=!1,l(T)}}}function P(t,e,n){let l=" ",o=[],r=new Date,a=r.getFullYear()+"-"+(r.getMonth()+1)+"-"+r.getDate()+" "+r.getHours()+":"+r.getMinutes()+":"+r.getSeconds();return[l,o,a,function(t){" "!=t&&""!=t&&(console.log(t),fetch("https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/"+t).then(t=>t.json()).then(t=>n(1,o=t)),n(1,o=array))},function(){l=this.value,n(0,l)}]}return new class extends H{constructor(t){super(),L(this,t,P,Z,r,{})}}({target:document.getElementById("utccredentialapi")})}();
//# sourceMappingURL=bundle.[hash].js.map
