(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const h of document.querySelectorAll('link[rel="modulepreload"]'))s(h);new MutationObserver(h=>{for(const b of h)if(b.type==="childList")for(const E of b.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&s(E)}).observe(document,{childList:!0,subtree:!0});function u(h){const b={};return h.integrity&&(b.integrity=h.integrity),h.referrerPolicy&&(b.referrerPolicy=h.referrerPolicy),h.crossOrigin==="use-credentials"?b.credentials="include":h.crossOrigin==="anonymous"?b.credentials="omit":b.credentials="same-origin",b}function s(h){if(h.ep)return;h.ep=!0;const b=u(h);fetch(h.href,b)}})();function Zs(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var xs={exports:{}},In={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kd;function Xm(){if(Kd)return In;Kd=1;var r=Symbol.for("react.transitional.element"),d=Symbol.for("react.fragment");function u(s,h,b){var E=null;if(b!==void 0&&(E=""+b),h.key!==void 0&&(E=""+h.key),"key"in h){b={};for(var R in h)R!=="key"&&(b[R]=h[R])}else b=h;return h=b.ref,{$$typeof:r,type:s,key:E,ref:h!==void 0?h:null,props:b}}return In.Fragment=d,In.jsx=u,In.jsxs=u,In}var Vd;function Qm(){return Vd||(Vd=1,xs.exports=Xm()),xs.exports}var f=Qm(),Ns={exports:{}},te={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $d;function Zm(){if($d)return te;$d=1;var r=Symbol.for("react.transitional.element"),d=Symbol.for("react.portal"),u=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),h=Symbol.for("react.profiler"),b=Symbol.for("react.consumer"),E=Symbol.for("react.context"),R=Symbol.for("react.forward_ref"),v=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),U=Symbol.for("react.activity"),z=Symbol.iterator;function F(y){return y===null||typeof y!="object"?null:(y=z&&y[z]||y["@@iterator"],typeof y=="function"?y:null)}var k={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},$=Object.assign,G={};function V(y,M,j){this.props=y,this.context=M,this.refs=G,this.updater=j||k}V.prototype.isReactComponent={},V.prototype.setState=function(y,M){if(typeof y!="object"&&typeof y!="function"&&y!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,y,M,"setState")},V.prototype.forceUpdate=function(y){this.updater.enqueueForceUpdate(this,y,"forceUpdate")};function K(){}K.prototype=V.prototype;function W(y,M,j){this.props=y,this.context=M,this.refs=G,this.updater=j||k}var fe=W.prototype=new K;fe.constructor=W,$(fe,V.prototype),fe.isPureReactComponent=!0;var Q=Array.isArray;function ee(){}var P={H:null,A:null,T:null,S:null},Le=Object.prototype.hasOwnProperty;function Xe(y,M,j){var Y=j.ref;return{$$typeof:r,type:y,key:M,ref:Y!==void 0?Y:null,props:j}}function Be(y,M){return Xe(y.type,M,y.props)}function Ye(y){return typeof y=="object"&&y!==null&&y.$$typeof===r}function Se(y){var M={"=":"=0",":":"=2"};return"$"+y.replace(/[=:]/g,function(j){return M[j]})}var St=/\/+/g;function at(y,M){return typeof y=="object"&&y!==null&&y.key!=null?Se(""+y.key):M.toString(36)}function be(y){switch(y.status){case"fulfilled":return y.value;case"rejected":throw y.reason;default:switch(typeof y.status=="string"?y.then(ee,ee):(y.status="pending",y.then(function(M){y.status==="pending"&&(y.status="fulfilled",y.value=M)},function(M){y.status==="pending"&&(y.status="rejected",y.reason=M)})),y.status){case"fulfilled":return y.value;case"rejected":throw y.reason}}throw y}function N(y,M,j,Y,ae){var ie=typeof y;(ie==="undefined"||ie==="boolean")&&(y=null);var he=!1;if(y===null)he=!0;else switch(ie){case"bigint":case"string":case"number":he=!0;break;case"object":switch(y.$$typeof){case r:case d:he=!0;break;case _:return he=y._init,N(he(y._payload),M,j,Y,ae)}}if(he)return ae=ae(y),he=Y===""?"."+at(y,0):Y,Q(ae)?(j="",he!=null&&(j=he.replace(St,"$&/")+"/"),N(ae,M,j,"",function(oa){return oa})):ae!=null&&(Ye(ae)&&(ae=Be(ae,j+(ae.key==null||y&&y.key===ae.key?"":(""+ae.key).replace(St,"$&/")+"/")+he)),M.push(ae)),1;he=0;var Qe=Y===""?".":Y+":";if(Q(y))for(var De=0;De<y.length;De++)Y=y[De],ie=Qe+at(Y,De),he+=N(Y,M,j,ie,ae);else if(De=F(y),typeof De=="function")for(y=De.call(y),De=0;!(Y=y.next()).done;)Y=Y.value,ie=Qe+at(Y,De++),he+=N(Y,M,j,ie,ae);else if(ie==="object"){if(typeof y.then=="function")return N(be(y),M,j,Y,ae);throw M=String(y),Error("Objects are not valid as a React child (found: "+(M==="[object Object]"?"object with keys {"+Object.keys(y).join(", ")+"}":M)+"). If you meant to render a collection of children, use an array instead.")}return he}function H(y,M,j){if(y==null)return y;var Y=[],ae=0;return N(y,Y,"","",function(ie){return M.call(j,ie,ae++)}),Y}function X(y){if(y._status===-1){var M=y._result;M=M(),M.then(function(j){(y._status===0||y._status===-1)&&(y._status=1,y._result=j)},function(j){(y._status===0||y._status===-1)&&(y._status=2,y._result=j)}),y._status===-1&&(y._status=0,y._result=M)}if(y._status===1)return y._result.default;throw y._result}var pe=typeof reportError=="function"?reportError:function(y){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var M=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof y=="object"&&y!==null&&typeof y.message=="string"?String(y.message):String(y),error:y});if(!window.dispatchEvent(M))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",y);return}console.error(y)},de={map:H,forEach:function(y,M,j){H(y,function(){M.apply(this,arguments)},j)},count:function(y){var M=0;return H(y,function(){M++}),M},toArray:function(y){return H(y,function(M){return M})||[]},only:function(y){if(!Ye(y))throw Error("React.Children.only expected to receive a single React element child.");return y}};return te.Activity=U,te.Children=de,te.Component=V,te.Fragment=u,te.Profiler=h,te.PureComponent=W,te.StrictMode=s,te.Suspense=v,te.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=P,te.__COMPILER_RUNTIME={__proto__:null,c:function(y){return P.H.useMemoCache(y)}},te.cache=function(y){return function(){return y.apply(null,arguments)}},te.cacheSignal=function(){return null},te.cloneElement=function(y,M,j){if(y==null)throw Error("The argument must be a React element, but you passed "+y+".");var Y=$({},y.props),ae=y.key;if(M!=null)for(ie in M.key!==void 0&&(ae=""+M.key),M)!Le.call(M,ie)||ie==="key"||ie==="__self"||ie==="__source"||ie==="ref"&&M.ref===void 0||(Y[ie]=M[ie]);var ie=arguments.length-2;if(ie===1)Y.children=j;else if(1<ie){for(var he=Array(ie),Qe=0;Qe<ie;Qe++)he[Qe]=arguments[Qe+2];Y.children=he}return Xe(y.type,ae,Y)},te.createContext=function(y){return y={$$typeof:E,_currentValue:y,_currentValue2:y,_threadCount:0,Provider:null,Consumer:null},y.Provider=y,y.Consumer={$$typeof:b,_context:y},y},te.createElement=function(y,M,j){var Y,ae={},ie=null;if(M!=null)for(Y in M.key!==void 0&&(ie=""+M.key),M)Le.call(M,Y)&&Y!=="key"&&Y!=="__self"&&Y!=="__source"&&(ae[Y]=M[Y]);var he=arguments.length-2;if(he===1)ae.children=j;else if(1<he){for(var Qe=Array(he),De=0;De<he;De++)Qe[De]=arguments[De+2];ae.children=Qe}if(y&&y.defaultProps)for(Y in he=y.defaultProps,he)ae[Y]===void 0&&(ae[Y]=he[Y]);return Xe(y,ie,ae)},te.createRef=function(){return{current:null}},te.forwardRef=function(y){return{$$typeof:R,render:y}},te.isValidElement=Ye,te.lazy=function(y){return{$$typeof:_,_payload:{_status:-1,_result:y},_init:X}},te.memo=function(y,M){return{$$typeof:g,type:y,compare:M===void 0?null:M}},te.startTransition=function(y){var M=P.T,j={};P.T=j;try{var Y=y(),ae=P.S;ae!==null&&ae(j,Y),typeof Y=="object"&&Y!==null&&typeof Y.then=="function"&&Y.then(ee,pe)}catch(ie){pe(ie)}finally{M!==null&&j.types!==null&&(M.types=j.types),P.T=M}},te.unstable_useCacheRefresh=function(){return P.H.useCacheRefresh()},te.use=function(y){return P.H.use(y)},te.useActionState=function(y,M,j){return P.H.useActionState(y,M,j)},te.useCallback=function(y,M){return P.H.useCallback(y,M)},te.useContext=function(y){return P.H.useContext(y)},te.useDebugValue=function(){},te.useDeferredValue=function(y,M){return P.H.useDeferredValue(y,M)},te.useEffect=function(y,M){return P.H.useEffect(y,M)},te.useEffectEvent=function(y){return P.H.useEffectEvent(y)},te.useId=function(){return P.H.useId()},te.useImperativeHandle=function(y,M,j){return P.H.useImperativeHandle(y,M,j)},te.useInsertionEffect=function(y,M){return P.H.useInsertionEffect(y,M)},te.useLayoutEffect=function(y,M){return P.H.useLayoutEffect(y,M)},te.useMemo=function(y,M){return P.H.useMemo(y,M)},te.useOptimistic=function(y,M){return P.H.useOptimistic(y,M)},te.useReducer=function(y,M,j){return P.H.useReducer(y,M,j)},te.useRef=function(y){return P.H.useRef(y)},te.useState=function(y){return P.H.useState(y)},te.useSyncExternalStore=function(y,M,j){return P.H.useSyncExternalStore(y,M,j)},te.useTransition=function(){return P.H.useTransition()},te.version="19.2.4",te}var Jd;function Ks(){return Jd||(Jd=1,Ns.exports=Zm()),Ns.exports}var q=Ks();const Th=Zs(q);var Cs={exports:{}},kn={},Ds={exports:{}},Ls={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wd;function Km(){return Wd||(Wd=1,(function(r){function d(N,H){var X=N.length;N.push(H);e:for(;0<X;){var pe=X-1>>>1,de=N[pe];if(0<h(de,H))N[pe]=H,N[X]=de,X=pe;else break e}}function u(N){return N.length===0?null:N[0]}function s(N){if(N.length===0)return null;var H=N[0],X=N.pop();if(X!==H){N[0]=X;e:for(var pe=0,de=N.length,y=de>>>1;pe<y;){var M=2*(pe+1)-1,j=N[M],Y=M+1,ae=N[Y];if(0>h(j,X))Y<de&&0>h(ae,j)?(N[pe]=ae,N[Y]=X,pe=Y):(N[pe]=j,N[M]=X,pe=M);else if(Y<de&&0>h(ae,X))N[pe]=ae,N[Y]=X,pe=Y;else break e}}return H}function h(N,H){var X=N.sortIndex-H.sortIndex;return X!==0?X:N.id-H.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var b=performance;r.unstable_now=function(){return b.now()}}else{var E=Date,R=E.now();r.unstable_now=function(){return E.now()-R}}var v=[],g=[],_=1,U=null,z=3,F=!1,k=!1,$=!1,G=!1,V=typeof setTimeout=="function"?setTimeout:null,K=typeof clearTimeout=="function"?clearTimeout:null,W=typeof setImmediate<"u"?setImmediate:null;function fe(N){for(var H=u(g);H!==null;){if(H.callback===null)s(g);else if(H.startTime<=N)s(g),H.sortIndex=H.expirationTime,d(v,H);else break;H=u(g)}}function Q(N){if($=!1,fe(N),!k)if(u(v)!==null)k=!0,ee||(ee=!0,Se());else{var H=u(g);H!==null&&be(Q,H.startTime-N)}}var ee=!1,P=-1,Le=5,Xe=-1;function Be(){return G?!0:!(r.unstable_now()-Xe<Le)}function Ye(){if(G=!1,ee){var N=r.unstable_now();Xe=N;var H=!0;try{e:{k=!1,$&&($=!1,K(P),P=-1),F=!0;var X=z;try{t:{for(fe(N),U=u(v);U!==null&&!(U.expirationTime>N&&Be());){var pe=U.callback;if(typeof pe=="function"){U.callback=null,z=U.priorityLevel;var de=pe(U.expirationTime<=N);if(N=r.unstable_now(),typeof de=="function"){U.callback=de,fe(N),H=!0;break t}U===u(v)&&s(v),fe(N)}else s(v);U=u(v)}if(U!==null)H=!0;else{var y=u(g);y!==null&&be(Q,y.startTime-N),H=!1}}break e}finally{U=null,z=X,F=!1}H=void 0}}finally{H?Se():ee=!1}}}var Se;if(typeof W=="function")Se=function(){W(Ye)};else if(typeof MessageChannel<"u"){var St=new MessageChannel,at=St.port2;St.port1.onmessage=Ye,Se=function(){at.postMessage(null)}}else Se=function(){V(Ye,0)};function be(N,H){P=V(function(){N(r.unstable_now())},H)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(N){N.callback=null},r.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Le=0<N?Math.floor(1e3/N):5},r.unstable_getCurrentPriorityLevel=function(){return z},r.unstable_next=function(N){switch(z){case 1:case 2:case 3:var H=3;break;default:H=z}var X=z;z=H;try{return N()}finally{z=X}},r.unstable_requestPaint=function(){G=!0},r.unstable_runWithPriority=function(N,H){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var X=z;z=N;try{return H()}finally{z=X}},r.unstable_scheduleCallback=function(N,H,X){var pe=r.unstable_now();switch(typeof X=="object"&&X!==null?(X=X.delay,X=typeof X=="number"&&0<X?pe+X:pe):X=pe,N){case 1:var de=-1;break;case 2:de=250;break;case 5:de=1073741823;break;case 4:de=1e4;break;default:de=5e3}return de=X+de,N={id:_++,callback:H,priorityLevel:N,startTime:X,expirationTime:de,sortIndex:-1},X>pe?(N.sortIndex=X,d(g,N),u(v)===null&&N===u(g)&&($?(K(P),P=-1):$=!0,be(Q,X-pe))):(N.sortIndex=de,d(v,N),k||F||(k=!0,ee||(ee=!0,Se()))),N},r.unstable_shouldYield=Be,r.unstable_wrapCallback=function(N){var H=z;return function(){var X=z;z=H;try{return N.apply(this,arguments)}finally{z=X}}}})(Ls)),Ls}var Pd;function Vm(){return Pd||(Pd=1,Ds.exports=Km()),Ds.exports}var Ms={exports:{}},tt={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eh;function $m(){if(eh)return tt;eh=1;var r=Ks();function d(v){var g="https://react.dev/errors/"+v;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var _=2;_<arguments.length;_++)g+="&args[]="+encodeURIComponent(arguments[_])}return"Minified React error #"+v+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function u(){}var s={d:{f:u,r:function(){throw Error(d(522))},D:u,C:u,L:u,m:u,X:u,S:u,M:u},p:0,findDOMNode:null},h=Symbol.for("react.portal");function b(v,g,_){var U=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:h,key:U==null?null:""+U,children:v,containerInfo:g,implementation:_}}var E=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function R(v,g){if(v==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return tt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,tt.createPortal=function(v,g){var _=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(d(299));return b(v,g,null,_)},tt.flushSync=function(v){var g=E.T,_=s.p;try{if(E.T=null,s.p=2,v)return v()}finally{E.T=g,s.p=_,s.d.f()}},tt.preconnect=function(v,g){typeof v=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,s.d.C(v,g))},tt.prefetchDNS=function(v){typeof v=="string"&&s.d.D(v)},tt.preinit=function(v,g){if(typeof v=="string"&&g&&typeof g.as=="string"){var _=g.as,U=R(_,g.crossOrigin),z=typeof g.integrity=="string"?g.integrity:void 0,F=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;_==="style"?s.d.S(v,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:U,integrity:z,fetchPriority:F}):_==="script"&&s.d.X(v,{crossOrigin:U,integrity:z,fetchPriority:F,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},tt.preinitModule=function(v,g){if(typeof v=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var _=R(g.as,g.crossOrigin);s.d.M(v,{crossOrigin:_,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0})}}else g==null&&s.d.M(v)},tt.preload=function(v,g){if(typeof v=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var _=g.as,U=R(_,g.crossOrigin);s.d.L(v,_,{crossOrigin:U,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},tt.preloadModule=function(v,g){if(typeof v=="string")if(g){var _=R(g.as,g.crossOrigin);s.d.m(v,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:_,integrity:typeof g.integrity=="string"?g.integrity:void 0})}else s.d.m(v)},tt.requestFormReset=function(v){s.d.r(v)},tt.unstable_batchedUpdates=function(v,g){return v(g)},tt.useFormState=function(v,g,_){return E.H.useFormState(v,g,_)},tt.useFormStatus=function(){return E.H.useHostTransitionStatus()},tt.version="19.2.4",tt}var th;function Jm(){if(th)return Ms.exports;th=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(d){console.error(d)}}return r(),Ms.exports=$m(),Ms.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ah;function Wm(){if(ah)return kn;ah=1;var r=Vm(),d=Ks(),u=Jm();function s(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function h(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function b(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function E(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function R(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function v(e){if(b(e)!==e)throw Error(s(188))}function g(e){var t=e.alternate;if(!t){if(t=b(e),t===null)throw Error(s(188));return t!==e?null:e}for(var a=e,l=t;;){var n=a.return;if(n===null)break;var i=n.alternate;if(i===null){if(l=n.return,l!==null){a=l;continue}break}if(n.child===i.child){for(i=n.child;i;){if(i===a)return v(n),e;if(i===l)return v(n),t;i=i.sibling}throw Error(s(188))}if(a.return!==l.return)a=n,l=i;else{for(var c=!1,o=n.child;o;){if(o===a){c=!0,a=n,l=i;break}if(o===l){c=!0,l=n,a=i;break}o=o.sibling}if(!c){for(o=i.child;o;){if(o===a){c=!0,a=i,l=n;break}if(o===l){c=!0,l=i,a=n;break}o=o.sibling}if(!c)throw Error(s(189))}}if(a.alternate!==l)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?e:t}function _(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=_(e),t!==null)return t;e=e.sibling}return null}var U=Object.assign,z=Symbol.for("react.element"),F=Symbol.for("react.transitional.element"),k=Symbol.for("react.portal"),$=Symbol.for("react.fragment"),G=Symbol.for("react.strict_mode"),V=Symbol.for("react.profiler"),K=Symbol.for("react.consumer"),W=Symbol.for("react.context"),fe=Symbol.for("react.forward_ref"),Q=Symbol.for("react.suspense"),ee=Symbol.for("react.suspense_list"),P=Symbol.for("react.memo"),Le=Symbol.for("react.lazy"),Xe=Symbol.for("react.activity"),Be=Symbol.for("react.memo_cache_sentinel"),Ye=Symbol.iterator;function Se(e){return e===null||typeof e!="object"?null:(e=Ye&&e[Ye]||e["@@iterator"],typeof e=="function"?e:null)}var St=Symbol.for("react.client.reference");function at(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===St?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case $:return"Fragment";case V:return"Profiler";case G:return"StrictMode";case Q:return"Suspense";case ee:return"SuspenseList";case Xe:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case k:return"Portal";case W:return e.displayName||"Context";case K:return(e._context.displayName||"Context")+".Consumer";case fe:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case P:return t=e.displayName||null,t!==null?t:at(e.type)||"Memo";case Le:t=e._payload,e=e._init;try{return at(e(t))}catch{}}return null}var be=Array.isArray,N=d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,H=u.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,X={pending:!1,data:null,method:null,action:null},pe=[],de=-1;function y(e){return{current:e}}function M(e){0>de||(e.current=pe[de],pe[de]=null,de--)}function j(e,t){de++,pe[de]=e.current,e.current=t}var Y=y(null),ae=y(null),ie=y(null),he=y(null);function Qe(e,t){switch(j(ie,t),j(ae,e),j(Y,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?yd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=yd(t),e=bd(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}M(Y),j(Y,e)}function De(){M(Y),M(ae),M(ie)}function oa(e){e.memoizedState!==null&&j(he,e);var t=Y.current,a=bd(t,e.type);t!==a&&(j(ae,e),j(Y,a))}function tl(e){ae.current===e&&(M(Y),M(ae)),he.current===e&&(M(he),jn._currentValue=X)}var jt,Zl;function Ut(e){if(jt===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);jt=t&&t[1]||"",Zl=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+jt+e+Zl}var al=!1;function qt(e,t){if(!e||al)return"";al=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var L=function(){throw Error()};if(Object.defineProperty(L.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(L,[])}catch(x){var O=x}Reflect.construct(e,[],L)}else{try{L.call()}catch(x){O=x}e.call(L.prototype)}}else{try{throw Error()}catch(x){O=x}(L=e())&&typeof L.catch=="function"&&L.catch(function(){})}}catch(x){if(x&&O&&typeof x.stack=="string")return[x.stack,O.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var n=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");n&&n.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var i=l.DetermineComponentFrameRoot(),c=i[0],o=i[1];if(c&&o){var m=c.split(`
`),A=o.split(`
`);for(n=l=0;l<m.length&&!m[l].includes("DetermineComponentFrameRoot");)l++;for(;n<A.length&&!A[n].includes("DetermineComponentFrameRoot");)n++;if(l===m.length||n===A.length)for(l=m.length-1,n=A.length-1;1<=l&&0<=n&&m[l]!==A[n];)n--;for(;1<=l&&0<=n;l--,n--)if(m[l]!==A[n]){if(l!==1||n!==1)do if(l--,n--,0>n||m[l]!==A[n]){var C=`
`+m[l].replace(" at new "," at ");return e.displayName&&C.includes("<anonymous>")&&(C=C.replace("<anonymous>",e.displayName)),C}while(1<=l&&0<=n);break}}}finally{al=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?Ut(a):""}function ll(e,t){switch(e.tag){case 26:case 27:case 5:return Ut(e.type);case 16:return Ut("Lazy");case 13:return e.child!==t&&t!==null?Ut("Suspense Fallback"):Ut("Suspense");case 19:return Ut("SuspenseList");case 0:case 15:return qt(e.type,!1);case 11:return qt(e.type.render,!1);case 1:return qt(e.type,!0);case 31:return Ut("Activity");default:return""}}function _t(e){try{var t="",a=null;do t+=ll(e,a),a=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Ft=Object.prototype.hasOwnProperty,nl=r.unstable_scheduleCallback,il=r.unstable_cancelCallback,Qn=r.unstable_shouldYield,ul=r.unstable_requestPaint,lt=r.unstable_now,w=r.unstable_getCurrentPriorityLevel,we=r.unstable_ImmediatePriority,Bt=r.unstable_UserBlockingPriority,Zn=r.unstable_NormalPriority,xh=r.unstable_LowPriority,Vs=r.unstable_IdlePriority,Nh=r.log,Ch=r.unstable_setDisableYieldValue,Kl=null,dt=null;function ra(e){if(typeof Nh=="function"&&Ch(e),dt&&typeof dt.setStrictMode=="function")try{dt.setStrictMode(Kl,e)}catch{}}var ht=Math.clz32?Math.clz32:Mh,Dh=Math.log,Lh=Math.LN2;function Mh(e){return e>>>=0,e===0?32:31-(Dh(e)/Lh|0)|0}var Kn=256,Vn=262144,$n=4194304;function Ha(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Jn(e,t,a){var l=e.pendingLanes;if(l===0)return 0;var n=0,i=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var o=l&134217727;return o!==0?(l=o&~i,l!==0?n=Ha(l):(c&=o,c!==0?n=Ha(c):a||(a=o&~e,a!==0&&(n=Ha(a))))):(o=l&~i,o!==0?n=Ha(o):c!==0?n=Ha(c):a||(a=l&~e,a!==0&&(n=Ha(a)))),n===0?0:t!==0&&t!==n&&(t&i)===0&&(i=n&-n,a=t&-t,i>=a||i===32&&(a&4194048)!==0)?t:n}function Vl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Uh(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function $s(){var e=$n;return $n<<=1,($n&62914560)===0&&($n=4194304),e}function mu(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function $l(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function _h(e,t,a,l,n,i){var c=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var o=e.entanglements,m=e.expirationTimes,A=e.hiddenUpdates;for(a=c&~a;0<a;){var C=31-ht(a),L=1<<C;o[C]=0,m[C]=-1;var O=A[C];if(O!==null)for(A[C]=null,C=0;C<O.length;C++){var x=O[C];x!==null&&(x.lane&=-536870913)}a&=~L}l!==0&&Js(e,l,0),i!==0&&n===0&&e.tag!==0&&(e.suspendedLanes|=i&~(c&~t))}function Js(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-ht(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|a&261930}function Ws(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var l=31-ht(a),n=1<<l;n&t|e[l]&t&&(e[l]|=t),a&=~n}}function Ps(e,t){var a=t&-t;return a=(a&42)!==0?1:gu(a),(a&(e.suspendedLanes|t))!==0?0:a}function gu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function pu(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function eo(){var e=H.p;return e!==0?e:(e=window.event,e===void 0?32:Id(e.type))}function to(e,t){var a=H.p;try{return H.p=e,t()}finally{H.p=a}}var fa=Math.random().toString(36).slice(2),$e="__reactFiber$"+fa,it="__reactProps$"+fa,cl="__reactContainer$"+fa,yu="__reactEvents$"+fa,wh="__reactListeners$"+fa,zh="__reactHandles$"+fa,ao="__reactResources$"+fa,Jl="__reactMarker$"+fa;function bu(e){delete e[$e],delete e[it],delete e[yu],delete e[wh],delete e[zh]}function sl(e){var t=e[$e];if(t)return t;for(var a=e.parentNode;a;){if(t=a[cl]||a[$e]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=Od(e);e!==null;){if(a=e[$e])return a;e=Od(e)}return t}e=a,a=e.parentNode}return null}function ol(e){if(e=e[$e]||e[cl]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Wl(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(s(33))}function rl(e){var t=e[ao];return t||(t=e[ao]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Ze(e){e[Jl]=!0}var lo=new Set,no={};function ja(e,t){fl(e,t),fl(e+"Capture",t)}function fl(e,t){for(no[e]=t,e=0;e<t.length;e++)lo.add(t[e])}var Hh=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),io={},uo={};function jh(e){return Ft.call(uo,e)?!0:Ft.call(io,e)?!1:Hh.test(e)?uo[e]=!0:(io[e]=!0,!1)}function Wn(e,t,a){if(jh(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function Pn(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function Xt(e,t,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+l)}}function Tt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function co(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Bh(e,t,a){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var n=l.get,i=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return n.call(this)},set:function(c){a=""+c,i.call(this,c)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(c){a=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function vu(e){if(!e._valueTracker){var t=co(e)?"checked":"value";e._valueTracker=Bh(e,t,""+e[t])}}function so(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),l="";return e&&(l=co(e)?e.checked?"true":"false":e.value),e=l,e!==a?(t.setValue(e),!0):!1}function ei(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Yh=/[\n"\\]/g;function At(e){return e.replace(Yh,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Eu(e,t,a,l,n,i,c,o){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Tt(t)):e.value!==""+Tt(t)&&(e.value=""+Tt(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?Su(e,c,Tt(t)):a!=null?Su(e,c,Tt(a)):l!=null&&e.removeAttribute("value"),n==null&&i!=null&&(e.defaultChecked=!!i),n!=null&&(e.checked=n&&typeof n!="function"&&typeof n!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.name=""+Tt(o):e.removeAttribute("name")}function oo(e,t,a,l,n,i,c,o){if(i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"&&(e.type=i),t!=null||a!=null){if(!(i!=="submit"&&i!=="reset"||t!=null)){vu(e);return}a=a!=null?""+Tt(a):"",t=t!=null?""+Tt(t):a,o||t===e.value||(e.value=t),e.defaultValue=t}l=l??n,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=o?e.checked:!!l,e.defaultChecked=!!l,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),vu(e)}function Su(e,t,a){t==="number"&&ei(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function dl(e,t,a,l){if(e=e.options,t){t={};for(var n=0;n<a.length;n++)t["$"+a[n]]=!0;for(a=0;a<e.length;a++)n=t.hasOwnProperty("$"+e[a].value),e[a].selected!==n&&(e[a].selected=n),n&&l&&(e[a].defaultSelected=!0)}else{for(a=""+Tt(a),t=null,n=0;n<e.length;n++){if(e[n].value===a){e[n].selected=!0,l&&(e[n].defaultSelected=!0);return}t!==null||e[n].disabled||(t=e[n])}t!==null&&(t.selected=!0)}}function ro(e,t,a){if(t!=null&&(t=""+Tt(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+Tt(a):""}function fo(e,t,a,l){if(t==null){if(l!=null){if(a!=null)throw Error(s(92));if(be(l)){if(1<l.length)throw Error(s(93));l=l[0]}a=l}a==null&&(a=""),t=a}a=Tt(t),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l),vu(e)}function hl(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var Gh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function ho(e,t,a){var l=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,a):typeof a!="number"||a===0||Gh.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function mo(e,t,a){if(t!=null&&typeof t!="object")throw Error(s(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var n in t)l=t[n],t.hasOwnProperty(n)&&a[n]!==l&&ho(e,n,l)}else for(var i in t)t.hasOwnProperty(i)&&ho(e,i,t[i])}function Tu(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ih=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),kh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ti(e){return kh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Qt(){}var Au=null;function Ru(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ml=null,gl=null;function go(e){var t=ol(e);if(t&&(e=t.stateNode)){var a=e[it]||null;e:switch(e=t.stateNode,t.type){case"input":if(Eu(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+At(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var l=a[t];if(l!==e&&l.form===e.form){var n=l[it]||null;if(!n)throw Error(s(90));Eu(l,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name)}}for(t=0;t<a.length;t++)l=a[t],l.form===e.form&&so(l)}break e;case"textarea":ro(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&dl(e,!!a.multiple,t,!1)}}}var Ou=!1;function po(e,t,a){if(Ou)return e(t,a);Ou=!0;try{var l=e(t);return l}finally{if(Ou=!1,(ml!==null||gl!==null)&&(ki(),ml&&(t=ml,e=gl,gl=ml=null,go(t),e)))for(t=0;t<e.length;t++)go(e[t])}}function Pl(e,t){var a=e.stateNode;if(a===null)return null;var l=a[it]||null;if(l===null)return null;a=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(s(231,t,typeof a));return a}var Zt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),xu=!1;if(Zt)try{var en={};Object.defineProperty(en,"passive",{get:function(){xu=!0}}),window.addEventListener("test",en,en),window.removeEventListener("test",en,en)}catch{xu=!1}var da=null,Nu=null,ai=null;function yo(){if(ai)return ai;var e,t=Nu,a=t.length,l,n="value"in da?da.value:da.textContent,i=n.length;for(e=0;e<a&&t[e]===n[e];e++);var c=a-e;for(l=1;l<=c&&t[a-l]===n[i-l];l++);return ai=n.slice(e,1<l?1-l:void 0)}function li(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ni(){return!0}function bo(){return!1}function ut(e){function t(a,l,n,i,c){this._reactName=a,this._targetInst=n,this.type=l,this.nativeEvent=i,this.target=c,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(a=e[o],this[o]=a?a(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?ni:bo,this.isPropagationStopped=bo,this}return U(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=ni)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=ni)},persist:function(){},isPersistent:ni}),t}var Ba={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ii=ut(Ba),tn=U({},Ba,{view:0,detail:0}),qh=ut(tn),Cu,Du,an,ui=U({},tn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Mu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==an&&(an&&e.type==="mousemove"?(Cu=e.screenX-an.screenX,Du=e.screenY-an.screenY):Du=Cu=0,an=e),Cu)},movementY:function(e){return"movementY"in e?e.movementY:Du}}),vo=ut(ui),Fh=U({},ui,{dataTransfer:0}),Xh=ut(Fh),Qh=U({},tn,{relatedTarget:0}),Lu=ut(Qh),Zh=U({},Ba,{animationName:0,elapsedTime:0,pseudoElement:0}),Kh=ut(Zh),Vh=U({},Ba,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),$h=ut(Vh),Jh=U({},Ba,{data:0}),Eo=ut(Jh),Wh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ph={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},e0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function t0(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=e0[e])?!!t[e]:!1}function Mu(){return t0}var a0=U({},tn,{key:function(e){if(e.key){var t=Wh[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=li(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ph[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Mu,charCode:function(e){return e.type==="keypress"?li(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?li(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),l0=ut(a0),n0=U({},ui,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),So=ut(n0),i0=U({},tn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Mu}),u0=ut(i0),c0=U({},Ba,{propertyName:0,elapsedTime:0,pseudoElement:0}),s0=ut(c0),o0=U({},ui,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),r0=ut(o0),f0=U({},Ba,{newState:0,oldState:0}),d0=ut(f0),h0=[9,13,27,32],Uu=Zt&&"CompositionEvent"in window,ln=null;Zt&&"documentMode"in document&&(ln=document.documentMode);var m0=Zt&&"TextEvent"in window&&!ln,To=Zt&&(!Uu||ln&&8<ln&&11>=ln),Ao=" ",Ro=!1;function Oo(e,t){switch(e){case"keyup":return h0.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function xo(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var pl=!1;function g0(e,t){switch(e){case"compositionend":return xo(t);case"keypress":return t.which!==32?null:(Ro=!0,Ao);case"textInput":return e=t.data,e===Ao&&Ro?null:e;default:return null}}function p0(e,t){if(pl)return e==="compositionend"||!Uu&&Oo(e,t)?(e=yo(),ai=Nu=da=null,pl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return To&&t.locale!=="ko"?null:t.data;default:return null}}var y0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function No(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!y0[e.type]:t==="textarea"}function Co(e,t,a,l){ml?gl?gl.push(l):gl=[l]:ml=l,t=Vi(t,"onChange"),0<t.length&&(a=new ii("onChange","change",null,a,l),e.push({event:a,listeners:t}))}var nn=null,un=null;function b0(e){fd(e,0)}function ci(e){var t=Wl(e);if(so(t))return e}function Do(e,t){if(e==="change")return t}var Lo=!1;if(Zt){var _u;if(Zt){var wu="oninput"in document;if(!wu){var Mo=document.createElement("div");Mo.setAttribute("oninput","return;"),wu=typeof Mo.oninput=="function"}_u=wu}else _u=!1;Lo=_u&&(!document.documentMode||9<document.documentMode)}function Uo(){nn&&(nn.detachEvent("onpropertychange",_o),un=nn=null)}function _o(e){if(e.propertyName==="value"&&ci(un)){var t=[];Co(t,un,e,Ru(e)),po(b0,t)}}function v0(e,t,a){e==="focusin"?(Uo(),nn=t,un=a,nn.attachEvent("onpropertychange",_o)):e==="focusout"&&Uo()}function E0(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ci(un)}function S0(e,t){if(e==="click")return ci(t)}function T0(e,t){if(e==="input"||e==="change")return ci(t)}function A0(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var mt=typeof Object.is=="function"?Object.is:A0;function cn(e,t){if(mt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),l=Object.keys(t);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var n=a[l];if(!Ft.call(t,n)||!mt(e[n],t[n]))return!1}return!0}function wo(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function zo(e,t){var a=wo(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=t&&l>=t)return{node:a,offset:t-e};e=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=wo(a)}}function Ho(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ho(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function jo(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ei(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=ei(e.document)}return t}function zu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var R0=Zt&&"documentMode"in document&&11>=document.documentMode,yl=null,Hu=null,sn=null,ju=!1;function Bo(e,t,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;ju||yl==null||yl!==ei(l)||(l=yl,"selectionStart"in l&&zu(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),sn&&cn(sn,l)||(sn=l,l=Vi(Hu,"onSelect"),0<l.length&&(t=new ii("onSelect","select",null,t,a),e.push({event:t,listeners:l}),t.target=yl)))}function Ya(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var bl={animationend:Ya("Animation","AnimationEnd"),animationiteration:Ya("Animation","AnimationIteration"),animationstart:Ya("Animation","AnimationStart"),transitionrun:Ya("Transition","TransitionRun"),transitionstart:Ya("Transition","TransitionStart"),transitioncancel:Ya("Transition","TransitionCancel"),transitionend:Ya("Transition","TransitionEnd")},Bu={},Yo={};Zt&&(Yo=document.createElement("div").style,"AnimationEvent"in window||(delete bl.animationend.animation,delete bl.animationiteration.animation,delete bl.animationstart.animation),"TransitionEvent"in window||delete bl.transitionend.transition);function Ga(e){if(Bu[e])return Bu[e];if(!bl[e])return e;var t=bl[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in Yo)return Bu[e]=t[a];return e}var Go=Ga("animationend"),Io=Ga("animationiteration"),ko=Ga("animationstart"),O0=Ga("transitionrun"),x0=Ga("transitionstart"),N0=Ga("transitioncancel"),qo=Ga("transitionend"),Fo=new Map,Yu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Yu.push("scrollEnd");function wt(e,t){Fo.set(e,t),ja(t,[e])}var si=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Rt=[],vl=0,Gu=0;function oi(){for(var e=vl,t=Gu=vl=0;t<e;){var a=Rt[t];Rt[t++]=null;var l=Rt[t];Rt[t++]=null;var n=Rt[t];Rt[t++]=null;var i=Rt[t];if(Rt[t++]=null,l!==null&&n!==null){var c=l.pending;c===null?n.next=n:(n.next=c.next,c.next=n),l.pending=n}i!==0&&Xo(a,n,i)}}function ri(e,t,a,l){Rt[vl++]=e,Rt[vl++]=t,Rt[vl++]=a,Rt[vl++]=l,Gu|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Iu(e,t,a,l){return ri(e,t,a,l),fi(e)}function Ia(e,t){return ri(e,null,null,t),fi(e)}function Xo(e,t,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var n=!1,i=e.return;i!==null;)i.childLanes|=a,l=i.alternate,l!==null&&(l.childLanes|=a),i.tag===22&&(e=i.stateNode,e===null||e._visibility&1||(n=!0)),e=i,i=i.return;return e.tag===3?(i=e.stateNode,n&&t!==null&&(n=31-ht(a),e=i.hiddenUpdates,l=e[n],l===null?e[n]=[t]:l.push(t),t.lane=a|536870912),i):null}function fi(e){if(50<Ln)throw Ln=0,$c=null,Error(s(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var El={};function C0(e,t,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function gt(e,t,a,l){return new C0(e,t,a,l)}function ku(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Kt(e,t){var a=e.alternate;return a===null?(a=gt(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Qo(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function di(e,t,a,l,n,i){var c=0;if(l=e,typeof e=="function")ku(e)&&(c=1);else if(typeof e=="string")c=_m(e,a,Y.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case Xe:return e=gt(31,a,t,n),e.elementType=Xe,e.lanes=i,e;case $:return ka(a.children,n,i,t);case G:c=8,n|=24;break;case V:return e=gt(12,a,t,n|2),e.elementType=V,e.lanes=i,e;case Q:return e=gt(13,a,t,n),e.elementType=Q,e.lanes=i,e;case ee:return e=gt(19,a,t,n),e.elementType=ee,e.lanes=i,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case W:c=10;break e;case K:c=9;break e;case fe:c=11;break e;case P:c=14;break e;case Le:c=16,l=null;break e}c=29,a=Error(s(130,e===null?"null":typeof e,"")),l=null}return t=gt(c,a,t,n),t.elementType=e,t.type=l,t.lanes=i,t}function ka(e,t,a,l){return e=gt(7,e,l,t),e.lanes=a,e}function qu(e,t,a){return e=gt(6,e,null,t),e.lanes=a,e}function Zo(e){var t=gt(18,null,null,0);return t.stateNode=e,t}function Fu(e,t,a){return t=gt(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ko=new WeakMap;function Ot(e,t){if(typeof e=="object"&&e!==null){var a=Ko.get(e);return a!==void 0?a:(t={value:e,source:t,stack:_t(t)},Ko.set(e,t),t)}return{value:e,source:t,stack:_t(t)}}var Sl=[],Tl=0,hi=null,on=0,xt=[],Nt=0,ha=null,Yt=1,Gt="";function Vt(e,t){Sl[Tl++]=on,Sl[Tl++]=hi,hi=e,on=t}function Vo(e,t,a){xt[Nt++]=Yt,xt[Nt++]=Gt,xt[Nt++]=ha,ha=e;var l=Yt;e=Gt;var n=32-ht(l)-1;l&=~(1<<n),a+=1;var i=32-ht(t)+n;if(30<i){var c=n-n%5;i=(l&(1<<c)-1).toString(32),l>>=c,n-=c,Yt=1<<32-ht(t)+n|a<<n|l,Gt=i+e}else Yt=1<<i|a<<n|l,Gt=e}function Xu(e){e.return!==null&&(Vt(e,1),Vo(e,1,0))}function Qu(e){for(;e===hi;)hi=Sl[--Tl],Sl[Tl]=null,on=Sl[--Tl],Sl[Tl]=null;for(;e===ha;)ha=xt[--Nt],xt[Nt]=null,Gt=xt[--Nt],xt[Nt]=null,Yt=xt[--Nt],xt[Nt]=null}function $o(e,t){xt[Nt++]=Yt,xt[Nt++]=Gt,xt[Nt++]=ha,Yt=t.id,Gt=t.overflow,ha=e}var Je=null,xe=null,re=!1,ma=null,Ct=!1,Zu=Error(s(519));function ga(e){var t=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw rn(Ot(t,e)),Zu}function Jo(e){var t=e.stateNode,a=e.type,l=e.memoizedProps;switch(t[$e]=e,t[it]=l,a){case"dialog":ce("cancel",t),ce("close",t);break;case"iframe":case"object":case"embed":ce("load",t);break;case"video":case"audio":for(a=0;a<Un.length;a++)ce(Un[a],t);break;case"source":ce("error",t);break;case"img":case"image":case"link":ce("error",t),ce("load",t);break;case"details":ce("toggle",t);break;case"input":ce("invalid",t),oo(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":ce("invalid",t);break;case"textarea":ce("invalid",t),fo(t,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||l.suppressHydrationWarning===!0||gd(t.textContent,a)?(l.popover!=null&&(ce("beforetoggle",t),ce("toggle",t)),l.onScroll!=null&&ce("scroll",t),l.onScrollEnd!=null&&ce("scrollend",t),l.onClick!=null&&(t.onclick=Qt),t=!0):t=!1,t||ga(e,!0)}function Wo(e){for(Je=e.return;Je;)switch(Je.tag){case 5:case 31:case 13:Ct=!1;return;case 27:case 3:Ct=!0;return;default:Je=Je.return}}function Al(e){if(e!==Je)return!1;if(!re)return Wo(e),re=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||fs(e.type,e.memoizedProps)),a=!a),a&&xe&&ga(e),Wo(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));xe=Rd(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));xe=Rd(e)}else t===27?(t=xe,Da(e.type)?(e=ps,ps=null,xe=e):xe=t):xe=Je?Lt(e.stateNode.nextSibling):null;return!0}function qa(){xe=Je=null,re=!1}function Ku(){var e=ma;return e!==null&&(rt===null?rt=e:rt.push.apply(rt,e),ma=null),e}function rn(e){ma===null?ma=[e]:ma.push(e)}var Vu=y(null),Fa=null,$t=null;function pa(e,t,a){j(Vu,t._currentValue),t._currentValue=a}function Jt(e){e._currentValue=Vu.current,M(Vu)}function $u(e,t,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===a)break;e=e.return}}function Ju(e,t,a,l){var n=e.child;for(n!==null&&(n.return=e);n!==null;){var i=n.dependencies;if(i!==null){var c=n.child;i=i.firstContext;e:for(;i!==null;){var o=i;i=n;for(var m=0;m<t.length;m++)if(o.context===t[m]){i.lanes|=a,o=i.alternate,o!==null&&(o.lanes|=a),$u(i.return,a,e),l||(c=null);break e}i=o.next}}else if(n.tag===18){if(c=n.return,c===null)throw Error(s(341));c.lanes|=a,i=c.alternate,i!==null&&(i.lanes|=a),$u(c,a,e),c=null}else c=n.child;if(c!==null)c.return=n;else for(c=n;c!==null;){if(c===e){c=null;break}if(n=c.sibling,n!==null){n.return=c.return,c=n;break}c=c.return}n=c}}function Rl(e,t,a,l){e=null;for(var n=t,i=!1;n!==null;){if(!i){if((n.flags&524288)!==0)i=!0;else if((n.flags&262144)!==0)break}if(n.tag===10){var c=n.alternate;if(c===null)throw Error(s(387));if(c=c.memoizedProps,c!==null){var o=n.type;mt(n.pendingProps.value,c.value)||(e!==null?e.push(o):e=[o])}}else if(n===he.current){if(c=n.alternate,c===null)throw Error(s(387));c.memoizedState.memoizedState!==n.memoizedState.memoizedState&&(e!==null?e.push(jn):e=[jn])}n=n.return}e!==null&&Ju(t,e,a,l),t.flags|=262144}function mi(e){for(e=e.firstContext;e!==null;){if(!mt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Xa(e){Fa=e,$t=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function We(e){return Po(Fa,e)}function gi(e,t){return Fa===null&&Xa(e),Po(e,t)}function Po(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},$t===null){if(e===null)throw Error(s(308));$t=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else $t=$t.next=t;return a}var D0=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},L0=r.unstable_scheduleCallback,M0=r.unstable_NormalPriority,Ge={$$typeof:W,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Wu(){return{controller:new D0,data:new Map,refCount:0}}function fn(e){e.refCount--,e.refCount===0&&L0(M0,function(){e.controller.abort()})}var dn=null,Pu=0,Ol=0,xl=null;function U0(e,t){if(dn===null){var a=dn=[];Pu=0,Ol=as(),xl={status:"pending",value:void 0,then:function(l){a.push(l)}}}return Pu++,t.then(er,er),t}function er(){if(--Pu===0&&dn!==null){xl!==null&&(xl.status="fulfilled");var e=dn;dn=null,Ol=0,xl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function _0(e,t){var a=[],l={status:"pending",value:null,reason:null,then:function(n){a.push(n)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var n=0;n<a.length;n++)(0,a[n])(t)},function(n){for(l.status="rejected",l.reason=n,n=0;n<a.length;n++)(0,a[n])(void 0)}),l}var tr=N.S;N.S=function(e,t){Yf=lt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&U0(e,t),tr!==null&&tr(e,t)};var Qa=y(null);function ec(){var e=Qa.current;return e!==null?e:Oe.pooledCache}function pi(e,t){t===null?j(Qa,Qa.current):j(Qa,t.pool)}function ar(){var e=ec();return e===null?null:{parent:Ge._currentValue,pool:e}}var Nl=Error(s(460)),tc=Error(s(474)),yi=Error(s(542)),bi={then:function(){}};function lr(e){return e=e.status,e==="fulfilled"||e==="rejected"}function nr(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(Qt,Qt),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,ur(e),e;default:if(typeof t.status=="string")t.then(Qt,Qt);else{if(e=Oe,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var n=t;n.status="fulfilled",n.value=l}},function(l){if(t.status==="pending"){var n=t;n.status="rejected",n.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,ur(e),e}throw Ka=t,Nl}}function Za(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Ka=a,Nl):a}}var Ka=null;function ir(){if(Ka===null)throw Error(s(459));var e=Ka;return Ka=null,e}function ur(e){if(e===Nl||e===yi)throw Error(s(483))}var Cl=null,hn=0;function vi(e){var t=hn;return hn+=1,Cl===null&&(Cl=[]),nr(Cl,e,t)}function mn(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Ei(e,t){throw t.$$typeof===z?Error(s(525)):(e=Object.prototype.toString.call(t),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function cr(e){function t(S,p){if(e){var T=S.deletions;T===null?(S.deletions=[p],S.flags|=16):T.push(p)}}function a(S,p){if(!e)return null;for(;p!==null;)t(S,p),p=p.sibling;return null}function l(S){for(var p=new Map;S!==null;)S.key!==null?p.set(S.key,S):p.set(S.index,S),S=S.sibling;return p}function n(S,p){return S=Kt(S,p),S.index=0,S.sibling=null,S}function i(S,p,T){return S.index=T,e?(T=S.alternate,T!==null?(T=T.index,T<p?(S.flags|=67108866,p):T):(S.flags|=67108866,p)):(S.flags|=1048576,p)}function c(S){return e&&S.alternate===null&&(S.flags|=67108866),S}function o(S,p,T,D){return p===null||p.tag!==6?(p=qu(T,S.mode,D),p.return=S,p):(p=n(p,T),p.return=S,p)}function m(S,p,T,D){var Z=T.type;return Z===$?C(S,p,T.props.children,D,T.key):p!==null&&(p.elementType===Z||typeof Z=="object"&&Z!==null&&Z.$$typeof===Le&&Za(Z)===p.type)?(p=n(p,T.props),mn(p,T),p.return=S,p):(p=di(T.type,T.key,T.props,null,S.mode,D),mn(p,T),p.return=S,p)}function A(S,p,T,D){return p===null||p.tag!==4||p.stateNode.containerInfo!==T.containerInfo||p.stateNode.implementation!==T.implementation?(p=Fu(T,S.mode,D),p.return=S,p):(p=n(p,T.children||[]),p.return=S,p)}function C(S,p,T,D,Z){return p===null||p.tag!==7?(p=ka(T,S.mode,D,Z),p.return=S,p):(p=n(p,T),p.return=S,p)}function L(S,p,T){if(typeof p=="string"&&p!==""||typeof p=="number"||typeof p=="bigint")return p=qu(""+p,S.mode,T),p.return=S,p;if(typeof p=="object"&&p!==null){switch(p.$$typeof){case F:return T=di(p.type,p.key,p.props,null,S.mode,T),mn(T,p),T.return=S,T;case k:return p=Fu(p,S.mode,T),p.return=S,p;case Le:return p=Za(p),L(S,p,T)}if(be(p)||Se(p))return p=ka(p,S.mode,T,null),p.return=S,p;if(typeof p.then=="function")return L(S,vi(p),T);if(p.$$typeof===W)return L(S,gi(S,p),T);Ei(S,p)}return null}function O(S,p,T,D){var Z=p!==null?p.key:null;if(typeof T=="string"&&T!==""||typeof T=="number"||typeof T=="bigint")return Z!==null?null:o(S,p,""+T,D);if(typeof T=="object"&&T!==null){switch(T.$$typeof){case F:return T.key===Z?m(S,p,T,D):null;case k:return T.key===Z?A(S,p,T,D):null;case Le:return T=Za(T),O(S,p,T,D)}if(be(T)||Se(T))return Z!==null?null:C(S,p,T,D,null);if(typeof T.then=="function")return O(S,p,vi(T),D);if(T.$$typeof===W)return O(S,p,gi(S,T),D);Ei(S,T)}return null}function x(S,p,T,D,Z){if(typeof D=="string"&&D!==""||typeof D=="number"||typeof D=="bigint")return S=S.get(T)||null,o(p,S,""+D,Z);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case F:return S=S.get(D.key===null?T:D.key)||null,m(p,S,D,Z);case k:return S=S.get(D.key===null?T:D.key)||null,A(p,S,D,Z);case Le:return D=Za(D),x(S,p,T,D,Z)}if(be(D)||Se(D))return S=S.get(T)||null,C(p,S,D,Z,null);if(typeof D.then=="function")return x(S,p,T,vi(D),Z);if(D.$$typeof===W)return x(S,p,T,gi(p,D),Z);Ei(p,D)}return null}function B(S,p,T,D){for(var Z=null,me=null,I=p,ne=p=0,oe=null;I!==null&&ne<T.length;ne++){I.index>ne?(oe=I,I=null):oe=I.sibling;var ge=O(S,I,T[ne],D);if(ge===null){I===null&&(I=oe);break}e&&I&&ge.alternate===null&&t(S,I),p=i(ge,p,ne),me===null?Z=ge:me.sibling=ge,me=ge,I=oe}if(ne===T.length)return a(S,I),re&&Vt(S,ne),Z;if(I===null){for(;ne<T.length;ne++)I=L(S,T[ne],D),I!==null&&(p=i(I,p,ne),me===null?Z=I:me.sibling=I,me=I);return re&&Vt(S,ne),Z}for(I=l(I);ne<T.length;ne++)oe=x(I,S,ne,T[ne],D),oe!==null&&(e&&oe.alternate!==null&&I.delete(oe.key===null?ne:oe.key),p=i(oe,p,ne),me===null?Z=oe:me.sibling=oe,me=oe);return e&&I.forEach(function(wa){return t(S,wa)}),re&&Vt(S,ne),Z}function J(S,p,T,D){if(T==null)throw Error(s(151));for(var Z=null,me=null,I=p,ne=p=0,oe=null,ge=T.next();I!==null&&!ge.done;ne++,ge=T.next()){I.index>ne?(oe=I,I=null):oe=I.sibling;var wa=O(S,I,ge.value,D);if(wa===null){I===null&&(I=oe);break}e&&I&&wa.alternate===null&&t(S,I),p=i(wa,p,ne),me===null?Z=wa:me.sibling=wa,me=wa,I=oe}if(ge.done)return a(S,I),re&&Vt(S,ne),Z;if(I===null){for(;!ge.done;ne++,ge=T.next())ge=L(S,ge.value,D),ge!==null&&(p=i(ge,p,ne),me===null?Z=ge:me.sibling=ge,me=ge);return re&&Vt(S,ne),Z}for(I=l(I);!ge.done;ne++,ge=T.next())ge=x(I,S,ne,ge.value,D),ge!==null&&(e&&ge.alternate!==null&&I.delete(ge.key===null?ne:ge.key),p=i(ge,p,ne),me===null?Z=ge:me.sibling=ge,me=ge);return e&&I.forEach(function(Fm){return t(S,Fm)}),re&&Vt(S,ne),Z}function Re(S,p,T,D){if(typeof T=="object"&&T!==null&&T.type===$&&T.key===null&&(T=T.props.children),typeof T=="object"&&T!==null){switch(T.$$typeof){case F:e:{for(var Z=T.key;p!==null;){if(p.key===Z){if(Z=T.type,Z===$){if(p.tag===7){a(S,p.sibling),D=n(p,T.props.children),D.return=S,S=D;break e}}else if(p.elementType===Z||typeof Z=="object"&&Z!==null&&Z.$$typeof===Le&&Za(Z)===p.type){a(S,p.sibling),D=n(p,T.props),mn(D,T),D.return=S,S=D;break e}a(S,p);break}else t(S,p);p=p.sibling}T.type===$?(D=ka(T.props.children,S.mode,D,T.key),D.return=S,S=D):(D=di(T.type,T.key,T.props,null,S.mode,D),mn(D,T),D.return=S,S=D)}return c(S);case k:e:{for(Z=T.key;p!==null;){if(p.key===Z)if(p.tag===4&&p.stateNode.containerInfo===T.containerInfo&&p.stateNode.implementation===T.implementation){a(S,p.sibling),D=n(p,T.children||[]),D.return=S,S=D;break e}else{a(S,p);break}else t(S,p);p=p.sibling}D=Fu(T,S.mode,D),D.return=S,S=D}return c(S);case Le:return T=Za(T),Re(S,p,T,D)}if(be(T))return B(S,p,T,D);if(Se(T)){if(Z=Se(T),typeof Z!="function")throw Error(s(150));return T=Z.call(T),J(S,p,T,D)}if(typeof T.then=="function")return Re(S,p,vi(T),D);if(T.$$typeof===W)return Re(S,p,gi(S,T),D);Ei(S,T)}return typeof T=="string"&&T!==""||typeof T=="number"||typeof T=="bigint"?(T=""+T,p!==null&&p.tag===6?(a(S,p.sibling),D=n(p,T),D.return=S,S=D):(a(S,p),D=qu(T,S.mode,D),D.return=S,S=D),c(S)):a(S,p)}return function(S,p,T,D){try{hn=0;var Z=Re(S,p,T,D);return Cl=null,Z}catch(I){if(I===Nl||I===yi)throw I;var me=gt(29,I,null,S.mode);return me.lanes=D,me.return=S,me}finally{}}}var Va=cr(!0),sr=cr(!1),ya=!1;function ac(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function lc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ba(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function va(e,t,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(ye&2)!==0){var n=l.pending;return n===null?t.next=t:(t.next=n.next,n.next=t),l.pending=t,t=fi(e),Xo(e,null,a),t}return ri(e,l,t,a),fi(e)}function gn(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Ws(e,a)}}function nc(e,t){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var n=null,i=null;if(a=a.firstBaseUpdate,a!==null){do{var c={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};i===null?n=i=c:i=i.next=c,a=a.next}while(a!==null);i===null?n=i=t:i=i.next=t}else n=i=t;a={baseState:l.baseState,firstBaseUpdate:n,lastBaseUpdate:i,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var ic=!1;function pn(){if(ic){var e=xl;if(e!==null)throw e}}function yn(e,t,a,l){ic=!1;var n=e.updateQueue;ya=!1;var i=n.firstBaseUpdate,c=n.lastBaseUpdate,o=n.shared.pending;if(o!==null){n.shared.pending=null;var m=o,A=m.next;m.next=null,c===null?i=A:c.next=A,c=m;var C=e.alternate;C!==null&&(C=C.updateQueue,o=C.lastBaseUpdate,o!==c&&(o===null?C.firstBaseUpdate=A:o.next=A,C.lastBaseUpdate=m))}if(i!==null){var L=n.baseState;c=0,C=A=m=null,o=i;do{var O=o.lane&-536870913,x=O!==o.lane;if(x?(se&O)===O:(l&O)===O){O!==0&&O===Ol&&(ic=!0),C!==null&&(C=C.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});e:{var B=e,J=o;O=t;var Re=a;switch(J.tag){case 1:if(B=J.payload,typeof B=="function"){L=B.call(Re,L,O);break e}L=B;break e;case 3:B.flags=B.flags&-65537|128;case 0:if(B=J.payload,O=typeof B=="function"?B.call(Re,L,O):B,O==null)break e;L=U({},L,O);break e;case 2:ya=!0}}O=o.callback,O!==null&&(e.flags|=64,x&&(e.flags|=8192),x=n.callbacks,x===null?n.callbacks=[O]:x.push(O))}else x={lane:O,tag:o.tag,payload:o.payload,callback:o.callback,next:null},C===null?(A=C=x,m=L):C=C.next=x,c|=O;if(o=o.next,o===null){if(o=n.shared.pending,o===null)break;x=o,o=x.next,x.next=null,n.lastBaseUpdate=x,n.shared.pending=null}}while(!0);C===null&&(m=L),n.baseState=m,n.firstBaseUpdate=A,n.lastBaseUpdate=C,i===null&&(n.shared.lanes=0),Ra|=c,e.lanes=c,e.memoizedState=L}}function or(e,t){if(typeof e!="function")throw Error(s(191,e));e.call(t)}function rr(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)or(a[e],t)}var Dl=y(null),Si=y(0);function fr(e,t){e=ua,j(Si,e),j(Dl,t),ua=e|t.baseLanes}function uc(){j(Si,ua),j(Dl,Dl.current)}function cc(){ua=Si.current,M(Dl),M(Si)}var pt=y(null),Dt=null;function Ea(e){var t=e.alternate;j(ze,ze.current&1),j(pt,e),Dt===null&&(t===null||Dl.current!==null||t.memoizedState!==null)&&(Dt=e)}function sc(e){j(ze,ze.current),j(pt,e),Dt===null&&(Dt=e)}function dr(e){e.tag===22?(j(ze,ze.current),j(pt,e),Dt===null&&(Dt=e)):Sa()}function Sa(){j(ze,ze.current),j(pt,pt.current)}function yt(e){M(pt),Dt===e&&(Dt=null),M(ze)}var ze=y(0);function Ti(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||ms(a)||gs(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Wt=0,le=null,Te=null,Ie=null,Ai=!1,Ll=!1,$a=!1,Ri=0,bn=0,Ml=null,w0=0;function Me(){throw Error(s(321))}function oc(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!mt(e[a],t[a]))return!1;return!0}function rc(e,t,a,l,n,i){return Wt=i,le=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?Vr:Oc,$a=!1,i=a(l,n),$a=!1,Ll&&(i=mr(t,a,l,n)),hr(e),i}function hr(e){N.H=Sn;var t=Te!==null&&Te.next!==null;if(Wt=0,Ie=Te=le=null,Ai=!1,bn=0,Ml=null,t)throw Error(s(300));e===null||ke||(e=e.dependencies,e!==null&&mi(e)&&(ke=!0))}function mr(e,t,a,l){le=e;var n=0;do{if(Ll&&(Ml=null),bn=0,Ll=!1,25<=n)throw Error(s(301));if(n+=1,Ie=Te=null,e.updateQueue!=null){var i=e.updateQueue;i.lastEffect=null,i.events=null,i.stores=null,i.memoCache!=null&&(i.memoCache.index=0)}N.H=$r,i=t(a,l)}while(Ll);return i}function z0(){var e=N.H,t=e.useState()[0];return t=typeof t.then=="function"?vn(t):t,e=e.useState()[0],(Te!==null?Te.memoizedState:null)!==e&&(le.flags|=1024),t}function fc(){var e=Ri!==0;return Ri=0,e}function dc(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function hc(e){if(Ai){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ai=!1}Wt=0,Ie=Te=le=null,Ll=!1,bn=Ri=0,Ml=null}function nt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ie===null?le.memoizedState=Ie=e:Ie=Ie.next=e,Ie}function He(){if(Te===null){var e=le.alternate;e=e!==null?e.memoizedState:null}else e=Te.next;var t=Ie===null?le.memoizedState:Ie.next;if(t!==null)Ie=t,Te=e;else{if(e===null)throw le.alternate===null?Error(s(467)):Error(s(310));Te=e,e={memoizedState:Te.memoizedState,baseState:Te.baseState,baseQueue:Te.baseQueue,queue:Te.queue,next:null},Ie===null?le.memoizedState=Ie=e:Ie=Ie.next=e}return Ie}function Oi(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function vn(e){var t=bn;return bn+=1,Ml===null&&(Ml=[]),e=nr(Ml,e,t),t=le,(Ie===null?t.memoizedState:Ie.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?Vr:Oc),e}function xi(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return vn(e);if(e.$$typeof===W)return We(e)}throw Error(s(438,String(e)))}function mc(e){var t=null,a=le.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var l=le.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(n){return n.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=Oi(),le.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),l=0;l<e;l++)a[l]=Be;return t.index++,a}function Pt(e,t){return typeof t=="function"?t(e):t}function Ni(e){var t=He();return gc(t,Te,e)}function gc(e,t,a){var l=e.queue;if(l===null)throw Error(s(311));l.lastRenderedReducer=a;var n=e.baseQueue,i=l.pending;if(i!==null){if(n!==null){var c=n.next;n.next=i.next,i.next=c}t.baseQueue=n=i,l.pending=null}if(i=e.baseState,n===null)e.memoizedState=i;else{t=n.next;var o=c=null,m=null,A=t,C=!1;do{var L=A.lane&-536870913;if(L!==A.lane?(se&L)===L:(Wt&L)===L){var O=A.revertLane;if(O===0)m!==null&&(m=m.next={lane:0,revertLane:0,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null}),L===Ol&&(C=!0);else if((Wt&O)===O){A=A.next,O===Ol&&(C=!0);continue}else L={lane:0,revertLane:A.revertLane,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},m===null?(o=m=L,c=i):m=m.next=L,le.lanes|=O,Ra|=O;L=A.action,$a&&a(i,L),i=A.hasEagerState?A.eagerState:a(i,L)}else O={lane:L,revertLane:A.revertLane,gesture:A.gesture,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},m===null?(o=m=O,c=i):m=m.next=O,le.lanes|=L,Ra|=L;A=A.next}while(A!==null&&A!==t);if(m===null?c=i:m.next=o,!mt(i,e.memoizedState)&&(ke=!0,C&&(a=xl,a!==null)))throw a;e.memoizedState=i,e.baseState=c,e.baseQueue=m,l.lastRenderedState=i}return n===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function pc(e){var t=He(),a=t.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=e;var l=a.dispatch,n=a.pending,i=t.memoizedState;if(n!==null){a.pending=null;var c=n=n.next;do i=e(i,c.action),c=c.next;while(c!==n);mt(i,t.memoizedState)||(ke=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),a.lastRenderedState=i}return[i,l]}function gr(e,t,a){var l=le,n=He(),i=re;if(i){if(a===void 0)throw Error(s(407));a=a()}else a=t();var c=!mt((Te||n).memoizedState,a);if(c&&(n.memoizedState=a,ke=!0),n=n.queue,vc(br.bind(null,l,n,e),[e]),n.getSnapshot!==t||c||Ie!==null&&Ie.memoizedState.tag&1){if(l.flags|=2048,Ul(9,{destroy:void 0},yr.bind(null,l,n,a,t),null),Oe===null)throw Error(s(349));i||(Wt&127)!==0||pr(l,t,a)}return a}function pr(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=le.updateQueue,t===null?(t=Oi(),le.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function yr(e,t,a,l){t.value=a,t.getSnapshot=l,vr(t)&&Er(e)}function br(e,t,a){return a(function(){vr(t)&&Er(e)})}function vr(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!mt(e,a)}catch{return!0}}function Er(e){var t=Ia(e,2);t!==null&&ft(t,e,2)}function yc(e){var t=nt();if(typeof e=="function"){var a=e;if(e=a(),$a){ra(!0);try{a()}finally{ra(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Pt,lastRenderedState:e},t}function Sr(e,t,a,l){return e.baseState=a,gc(e,Te,typeof l=="function"?l:Pt)}function H0(e,t,a,l,n){if(Li(e))throw Error(s(485));if(e=t.action,e!==null){var i={payload:n,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){i.listeners.push(c)}};N.T!==null?a(!0):i.isTransition=!1,l(i),a=t.pending,a===null?(i.next=t.pending=i,Tr(t,i)):(i.next=a.next,t.pending=a.next=i)}}function Tr(e,t){var a=t.action,l=t.payload,n=e.state;if(t.isTransition){var i=N.T,c={};N.T=c;try{var o=a(n,l),m=N.S;m!==null&&m(c,o),Ar(e,t,o)}catch(A){bc(e,t,A)}finally{i!==null&&c.types!==null&&(i.types=c.types),N.T=i}}else try{i=a(n,l),Ar(e,t,i)}catch(A){bc(e,t,A)}}function Ar(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){Rr(e,t,l)},function(l){return bc(e,t,l)}):Rr(e,t,a)}function Rr(e,t,a){t.status="fulfilled",t.value=a,Or(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,Tr(e,a)))}function bc(e,t,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=a,Or(t),t=t.next;while(t!==l)}e.action=null}function Or(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function xr(e,t){return t}function Nr(e,t){if(re){var a=Oe.formState;if(a!==null){e:{var l=le;if(re){if(xe){t:{for(var n=xe,i=Ct;n.nodeType!==8;){if(!i){n=null;break t}if(n=Lt(n.nextSibling),n===null){n=null;break t}}i=n.data,n=i==="F!"||i==="F"?n:null}if(n){xe=Lt(n.nextSibling),l=n.data==="F!";break e}}ga(l)}l=!1}l&&(t=a[0])}}return a=nt(),a.memoizedState=a.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:xr,lastRenderedState:t},a.queue=l,a=Qr.bind(null,le,l),l.dispatch=a,l=yc(!1),i=Rc.bind(null,le,!1,l.queue),l=nt(),n={state:t,dispatch:null,action:e,pending:null},l.queue=n,a=H0.bind(null,le,n,i,a),n.dispatch=a,l.memoizedState=e,[t,a,!1]}function Cr(e){var t=He();return Dr(t,Te,e)}function Dr(e,t,a){if(t=gc(e,t,xr)[0],e=Ni(Pt)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=vn(t)}catch(c){throw c===Nl?yi:c}else l=t;t=He();var n=t.queue,i=n.dispatch;return a!==t.memoizedState&&(le.flags|=2048,Ul(9,{destroy:void 0},j0.bind(null,n,a),null)),[l,i,e]}function j0(e,t){e.action=t}function Lr(e){var t=He(),a=Te;if(a!==null)return Dr(t,a,e);He(),t=t.memoizedState,a=He();var l=a.queue.dispatch;return a.memoizedState=e,[t,l,!1]}function Ul(e,t,a,l){return e={tag:e,create:a,deps:l,inst:t,next:null},t=le.updateQueue,t===null&&(t=Oi(),le.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,t.lastEffect=e),e}function Mr(){return He().memoizedState}function Ci(e,t,a,l){var n=nt();le.flags|=e,n.memoizedState=Ul(1|t,{destroy:void 0},a,l===void 0?null:l)}function Di(e,t,a,l){var n=He();l=l===void 0?null:l;var i=n.memoizedState.inst;Te!==null&&l!==null&&oc(l,Te.memoizedState.deps)?n.memoizedState=Ul(t,i,a,l):(le.flags|=e,n.memoizedState=Ul(1|t,i,a,l))}function Ur(e,t){Ci(8390656,8,e,t)}function vc(e,t){Di(2048,8,e,t)}function B0(e){le.flags|=4;var t=le.updateQueue;if(t===null)t=Oi(),le.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function _r(e){var t=He().memoizedState;return B0({ref:t,nextImpl:e}),function(){if((ye&2)!==0)throw Error(s(440));return t.impl.apply(void 0,arguments)}}function wr(e,t){return Di(4,2,e,t)}function zr(e,t){return Di(4,4,e,t)}function Hr(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function jr(e,t,a){a=a!=null?a.concat([e]):null,Di(4,4,Hr.bind(null,t,e),a)}function Ec(){}function Br(e,t){var a=He();t=t===void 0?null:t;var l=a.memoizedState;return t!==null&&oc(t,l[1])?l[0]:(a.memoizedState=[e,t],e)}function Yr(e,t){var a=He();t=t===void 0?null:t;var l=a.memoizedState;if(t!==null&&oc(t,l[1]))return l[0];if(l=e(),$a){ra(!0);try{e()}finally{ra(!1)}}return a.memoizedState=[l,t],l}function Sc(e,t,a){return a===void 0||(Wt&1073741824)!==0&&(se&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=If(),le.lanes|=e,Ra|=e,a)}function Gr(e,t,a,l){return mt(a,t)?a:Dl.current!==null?(e=Sc(e,a,l),mt(e,t)||(ke=!0),e):(Wt&42)===0||(Wt&1073741824)!==0&&(se&261930)===0?(ke=!0,e.memoizedState=a):(e=If(),le.lanes|=e,Ra|=e,t)}function Ir(e,t,a,l,n){var i=H.p;H.p=i!==0&&8>i?i:8;var c=N.T,o={};N.T=o,Rc(e,!1,t,a);try{var m=n(),A=N.S;if(A!==null&&A(o,m),m!==null&&typeof m=="object"&&typeof m.then=="function"){var C=_0(m,l);En(e,t,C,Et(e))}else En(e,t,l,Et(e))}catch(L){En(e,t,{then:function(){},status:"rejected",reason:L},Et())}finally{H.p=i,c!==null&&o.types!==null&&(c.types=o.types),N.T=c}}function Y0(){}function Tc(e,t,a,l){if(e.tag!==5)throw Error(s(476));var n=kr(e).queue;Ir(e,n,t,X,a===null?Y0:function(){return qr(e),a(l)})}function kr(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:X,baseState:X,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Pt,lastRenderedState:X},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Pt,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function qr(e){var t=kr(e);t.next===null&&(t=e.alternate.memoizedState),En(e,t.next.queue,{},Et())}function Ac(){return We(jn)}function Fr(){return He().memoizedState}function Xr(){return He().memoizedState}function G0(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=Et();e=ba(a);var l=va(t,e,a);l!==null&&(ft(l,t,a),gn(l,t,a)),t={cache:Wu()},e.payload=t;return}t=t.return}}function I0(e,t,a){var l=Et();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Li(e)?Zr(t,a):(a=Iu(e,t,a,l),a!==null&&(ft(a,e,l),Kr(a,t,l)))}function Qr(e,t,a){var l=Et();En(e,t,a,l)}function En(e,t,a,l){var n={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Li(e))Zr(t,n);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var c=t.lastRenderedState,o=i(c,a);if(n.hasEagerState=!0,n.eagerState=o,mt(o,c))return ri(e,t,n,0),Oe===null&&oi(),!1}catch{}finally{}if(a=Iu(e,t,n,l),a!==null)return ft(a,e,l),Kr(a,t,l),!0}return!1}function Rc(e,t,a,l){if(l={lane:2,revertLane:as(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Li(e)){if(t)throw Error(s(479))}else t=Iu(e,a,l,2),t!==null&&ft(t,e,2)}function Li(e){var t=e.alternate;return e===le||t!==null&&t===le}function Zr(e,t){Ll=Ai=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function Kr(e,t,a){if((a&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Ws(e,a)}}var Sn={readContext:We,use:xi,useCallback:Me,useContext:Me,useEffect:Me,useImperativeHandle:Me,useLayoutEffect:Me,useInsertionEffect:Me,useMemo:Me,useReducer:Me,useRef:Me,useState:Me,useDebugValue:Me,useDeferredValue:Me,useTransition:Me,useSyncExternalStore:Me,useId:Me,useHostTransitionStatus:Me,useFormState:Me,useActionState:Me,useOptimistic:Me,useMemoCache:Me,useCacheRefresh:Me};Sn.useEffectEvent=Me;var Vr={readContext:We,use:xi,useCallback:function(e,t){return nt().memoizedState=[e,t===void 0?null:t],e},useContext:We,useEffect:Ur,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,Ci(4194308,4,Hr.bind(null,t,e),a)},useLayoutEffect:function(e,t){return Ci(4194308,4,e,t)},useInsertionEffect:function(e,t){Ci(4,2,e,t)},useMemo:function(e,t){var a=nt();t=t===void 0?null:t;var l=e();if($a){ra(!0);try{e()}finally{ra(!1)}}return a.memoizedState=[l,t],l},useReducer:function(e,t,a){var l=nt();if(a!==void 0){var n=a(t);if($a){ra(!0);try{a(t)}finally{ra(!1)}}}else n=t;return l.memoizedState=l.baseState=n,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},l.queue=e,e=e.dispatch=I0.bind(null,le,e),[l.memoizedState,e]},useRef:function(e){var t=nt();return e={current:e},t.memoizedState=e},useState:function(e){e=yc(e);var t=e.queue,a=Qr.bind(null,le,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:Ec,useDeferredValue:function(e,t){var a=nt();return Sc(a,e,t)},useTransition:function(){var e=yc(!1);return e=Ir.bind(null,le,e.queue,!0,!1),nt().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var l=le,n=nt();if(re){if(a===void 0)throw Error(s(407));a=a()}else{if(a=t(),Oe===null)throw Error(s(349));(se&127)!==0||pr(l,t,a)}n.memoizedState=a;var i={value:a,getSnapshot:t};return n.queue=i,Ur(br.bind(null,l,i,e),[e]),l.flags|=2048,Ul(9,{destroy:void 0},yr.bind(null,l,i,a,t),null),a},useId:function(){var e=nt(),t=Oe.identifierPrefix;if(re){var a=Gt,l=Yt;a=(l&~(1<<32-ht(l)-1)).toString(32)+a,t="_"+t+"R_"+a,a=Ri++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=w0++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Ac,useFormState:Nr,useActionState:Nr,useOptimistic:function(e){var t=nt();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=Rc.bind(null,le,!0,a),a.dispatch=t,[e,t]},useMemoCache:mc,useCacheRefresh:function(){return nt().memoizedState=G0.bind(null,le)},useEffectEvent:function(e){var t=nt(),a={impl:e};return t.memoizedState=a,function(){if((ye&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},Oc={readContext:We,use:xi,useCallback:Br,useContext:We,useEffect:vc,useImperativeHandle:jr,useInsertionEffect:wr,useLayoutEffect:zr,useMemo:Yr,useReducer:Ni,useRef:Mr,useState:function(){return Ni(Pt)},useDebugValue:Ec,useDeferredValue:function(e,t){var a=He();return Gr(a,Te.memoizedState,e,t)},useTransition:function(){var e=Ni(Pt)[0],t=He().memoizedState;return[typeof e=="boolean"?e:vn(e),t]},useSyncExternalStore:gr,useId:Fr,useHostTransitionStatus:Ac,useFormState:Cr,useActionState:Cr,useOptimistic:function(e,t){var a=He();return Sr(a,Te,e,t)},useMemoCache:mc,useCacheRefresh:Xr};Oc.useEffectEvent=_r;var $r={readContext:We,use:xi,useCallback:Br,useContext:We,useEffect:vc,useImperativeHandle:jr,useInsertionEffect:wr,useLayoutEffect:zr,useMemo:Yr,useReducer:pc,useRef:Mr,useState:function(){return pc(Pt)},useDebugValue:Ec,useDeferredValue:function(e,t){var a=He();return Te===null?Sc(a,e,t):Gr(a,Te.memoizedState,e,t)},useTransition:function(){var e=pc(Pt)[0],t=He().memoizedState;return[typeof e=="boolean"?e:vn(e),t]},useSyncExternalStore:gr,useId:Fr,useHostTransitionStatus:Ac,useFormState:Lr,useActionState:Lr,useOptimistic:function(e,t){var a=He();return Te!==null?Sr(a,Te,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:mc,useCacheRefresh:Xr};$r.useEffectEvent=_r;function xc(e,t,a,l){t=e.memoizedState,a=a(l,t),a=a==null?t:U({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Nc={enqueueSetState:function(e,t,a){e=e._reactInternals;var l=Et(),n=ba(l);n.payload=t,a!=null&&(n.callback=a),t=va(e,n,l),t!==null&&(ft(t,e,l),gn(t,e,l))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var l=Et(),n=ba(l);n.tag=1,n.payload=t,a!=null&&(n.callback=a),t=va(e,n,l),t!==null&&(ft(t,e,l),gn(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=Et(),l=ba(a);l.tag=2,t!=null&&(l.callback=t),t=va(e,l,a),t!==null&&(ft(t,e,a),gn(t,e,a))}};function Jr(e,t,a,l,n,i,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,i,c):t.prototype&&t.prototype.isPureReactComponent?!cn(a,l)||!cn(n,i):!0}function Wr(e,t,a,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,l),t.state!==e&&Nc.enqueueReplaceState(t,t.state,null)}function Ja(e,t){var a=t;if("ref"in t){a={};for(var l in t)l!=="ref"&&(a[l]=t[l])}if(e=e.defaultProps){a===t&&(a=U({},a));for(var n in e)a[n]===void 0&&(a[n]=e[n])}return a}function Pr(e){si(e)}function ef(e){console.error(e)}function tf(e){si(e)}function Mi(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function af(e,t,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(n){setTimeout(function(){throw n})}}function Cc(e,t,a){return a=ba(a),a.tag=3,a.payload={element:null},a.callback=function(){Mi(e,t)},a}function lf(e){return e=ba(e),e.tag=3,e}function nf(e,t,a,l){var n=a.type.getDerivedStateFromError;if(typeof n=="function"){var i=l.value;e.payload=function(){return n(i)},e.callback=function(){af(t,a,l)}}var c=a.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){af(t,a,l),typeof n!="function"&&(Oa===null?Oa=new Set([this]):Oa.add(this));var o=l.stack;this.componentDidCatch(l.value,{componentStack:o!==null?o:""})})}function k0(e,t,a,l,n){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=a.alternate,t!==null&&Rl(t,a,n,!0),a=pt.current,a!==null){switch(a.tag){case 31:case 13:return Dt===null?qi():a.alternate===null&&Ue===0&&(Ue=3),a.flags&=-257,a.flags|=65536,a.lanes=n,l===bi?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([l]):t.add(l),Pc(e,l,n)),!1;case 22:return a.flags|=65536,l===bi?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([l]):a.add(l)),Pc(e,l,n)),!1}throw Error(s(435,a.tag))}return Pc(e,l,n),qi(),!1}if(re)return t=pt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=n,l!==Zu&&(e=Error(s(422),{cause:l}),rn(Ot(e,a)))):(l!==Zu&&(t=Error(s(423),{cause:l}),rn(Ot(t,a))),e=e.current.alternate,e.flags|=65536,n&=-n,e.lanes|=n,l=Ot(l,a),n=Cc(e.stateNode,l,n),nc(e,n),Ue!==4&&(Ue=2)),!1;var i=Error(s(520),{cause:l});if(i=Ot(i,a),Dn===null?Dn=[i]:Dn.push(i),Ue!==4&&(Ue=2),t===null)return!0;l=Ot(l,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=n&-n,a.lanes|=e,e=Cc(a.stateNode,l,e),nc(a,e),!1;case 1:if(t=a.type,i=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||i!==null&&typeof i.componentDidCatch=="function"&&(Oa===null||!Oa.has(i))))return a.flags|=65536,n&=-n,a.lanes|=n,n=lf(n),nf(n,e,a,l),nc(a,n),!1}a=a.return}while(a!==null);return!1}var Dc=Error(s(461)),ke=!1;function Pe(e,t,a,l){t.child=e===null?sr(t,null,a,l):Va(t,e.child,a,l)}function uf(e,t,a,l,n){a=a.render;var i=t.ref;if("ref"in l){var c={};for(var o in l)o!=="ref"&&(c[o]=l[o])}else c=l;return Xa(t),l=rc(e,t,a,c,i,n),o=fc(),e!==null&&!ke?(dc(e,t,n),ea(e,t,n)):(re&&o&&Xu(t),t.flags|=1,Pe(e,t,l,n),t.child)}function cf(e,t,a,l,n){if(e===null){var i=a.type;return typeof i=="function"&&!ku(i)&&i.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=i,sf(e,t,i,l,n)):(e=di(a.type,null,l,t,t.mode,n),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!jc(e,n)){var c=i.memoizedProps;if(a=a.compare,a=a!==null?a:cn,a(c,l)&&e.ref===t.ref)return ea(e,t,n)}return t.flags|=1,e=Kt(i,l),e.ref=t.ref,e.return=t,t.child=e}function sf(e,t,a,l,n){if(e!==null){var i=e.memoizedProps;if(cn(i,l)&&e.ref===t.ref)if(ke=!1,t.pendingProps=l=i,jc(e,n))(e.flags&131072)!==0&&(ke=!0);else return t.lanes=e.lanes,ea(e,t,n)}return Lc(e,t,a,l,n)}function of(e,t,a,l){var n=l.children,i=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(i=i!==null?i.baseLanes|a:a,e!==null){for(l=t.child=e.child,n=0;l!==null;)n=n|l.lanes|l.childLanes,l=l.sibling;l=n&~i}else l=0,t.child=null;return rf(e,t,i,a,l)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&pi(t,i!==null?i.cachePool:null),i!==null?fr(t,i):uc(),dr(t);else return l=t.lanes=536870912,rf(e,t,i!==null?i.baseLanes|a:a,a,l)}else i!==null?(pi(t,i.cachePool),fr(t,i),Sa(),t.memoizedState=null):(e!==null&&pi(t,null),uc(),Sa());return Pe(e,t,n,a),t.child}function Tn(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function rf(e,t,a,l,n){var i=ec();return i=i===null?null:{parent:Ge._currentValue,pool:i},t.memoizedState={baseLanes:a,cachePool:i},e!==null&&pi(t,null),uc(),dr(t),e!==null&&Rl(e,t,l,!0),t.childLanes=n,null}function Ui(e,t){return t=wi({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function ff(e,t,a){return Va(t,e.child,null,a),e=Ui(t,t.pendingProps),e.flags|=2,yt(t),t.memoizedState=null,e}function q0(e,t,a){var l=t.pendingProps,n=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(re){if(l.mode==="hidden")return e=Ui(t,l),t.lanes=536870912,Tn(null,e);if(sc(t),(e=xe)?(e=Ad(e,Ct),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ha!==null?{id:Yt,overflow:Gt}:null,retryLane:536870912,hydrationErrors:null},a=Zo(e),a.return=t,t.child=a,Je=t,xe=null)):e=null,e===null)throw ga(t);return t.lanes=536870912,null}return Ui(t,l)}var i=e.memoizedState;if(i!==null){var c=i.dehydrated;if(sc(t),n)if(t.flags&256)t.flags&=-257,t=ff(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(s(558));else if(ke||Rl(e,t,a,!1),n=(a&e.childLanes)!==0,ke||n){if(l=Oe,l!==null&&(c=Ps(l,a),c!==0&&c!==i.retryLane))throw i.retryLane=c,Ia(e,c),ft(l,e,c),Dc;qi(),t=ff(e,t,a)}else e=i.treeContext,xe=Lt(c.nextSibling),Je=t,re=!0,ma=null,Ct=!1,e!==null&&$o(t,e),t=Ui(t,l),t.flags|=4096;return t}return e=Kt(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function _i(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function Lc(e,t,a,l,n){return Xa(t),a=rc(e,t,a,l,void 0,n),l=fc(),e!==null&&!ke?(dc(e,t,n),ea(e,t,n)):(re&&l&&Xu(t),t.flags|=1,Pe(e,t,a,n),t.child)}function df(e,t,a,l,n,i){return Xa(t),t.updateQueue=null,a=mr(t,l,a,n),hr(e),l=fc(),e!==null&&!ke?(dc(e,t,i),ea(e,t,i)):(re&&l&&Xu(t),t.flags|=1,Pe(e,t,a,i),t.child)}function hf(e,t,a,l,n){if(Xa(t),t.stateNode===null){var i=El,c=a.contextType;typeof c=="object"&&c!==null&&(i=We(c)),i=new a(l,i),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Nc,t.stateNode=i,i._reactInternals=t,i=t.stateNode,i.props=l,i.state=t.memoizedState,i.refs={},ac(t),c=a.contextType,i.context=typeof c=="object"&&c!==null?We(c):El,i.state=t.memoizedState,c=a.getDerivedStateFromProps,typeof c=="function"&&(xc(t,a,c,l),i.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(c=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),c!==i.state&&Nc.enqueueReplaceState(i,i.state,null),yn(t,l,i,n),pn(),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){i=t.stateNode;var o=t.memoizedProps,m=Ja(a,o);i.props=m;var A=i.context,C=a.contextType;c=El,typeof C=="object"&&C!==null&&(c=We(C));var L=a.getDerivedStateFromProps;C=typeof L=="function"||typeof i.getSnapshotBeforeUpdate=="function",o=t.pendingProps!==o,C||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(o||A!==c)&&Wr(t,i,l,c),ya=!1;var O=t.memoizedState;i.state=O,yn(t,l,i,n),pn(),A=t.memoizedState,o||O!==A||ya?(typeof L=="function"&&(xc(t,a,L,l),A=t.memoizedState),(m=ya||Jr(t,a,m,l,O,A,c))?(C||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=A),i.props=l,i.state=A,i.context=c,l=m):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{i=t.stateNode,lc(e,t),c=t.memoizedProps,C=Ja(a,c),i.props=C,L=t.pendingProps,O=i.context,A=a.contextType,m=El,typeof A=="object"&&A!==null&&(m=We(A)),o=a.getDerivedStateFromProps,(A=typeof o=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==L||O!==m)&&Wr(t,i,l,m),ya=!1,O=t.memoizedState,i.state=O,yn(t,l,i,n),pn();var x=t.memoizedState;c!==L||O!==x||ya||e!==null&&e.dependencies!==null&&mi(e.dependencies)?(typeof o=="function"&&(xc(t,a,o,l),x=t.memoizedState),(C=ya||Jr(t,a,C,l,O,x,m)||e!==null&&e.dependencies!==null&&mi(e.dependencies))?(A||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(l,x,m),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(l,x,m)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=x),i.props=l,i.state=x,i.context=m,l=C):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=1024),l=!1)}return i=l,_i(e,t),l=(t.flags&128)!==0,i||l?(i=t.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:i.render(),t.flags|=1,e!==null&&l?(t.child=Va(t,e.child,null,n),t.child=Va(t,null,a,n)):Pe(e,t,a,n),t.memoizedState=i.state,e=t.child):e=ea(e,t,n),e}function mf(e,t,a,l){return qa(),t.flags|=256,Pe(e,t,a,l),t.child}var Mc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Uc(e){return{baseLanes:e,cachePool:ar()}}function _c(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=vt),e}function gf(e,t,a){var l=t.pendingProps,n=!1,i=(t.flags&128)!==0,c;if((c=i)||(c=e!==null&&e.memoizedState===null?!1:(ze.current&2)!==0),c&&(n=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(re){if(n?Ea(t):Sa(),(e=xe)?(e=Ad(e,Ct),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ha!==null?{id:Yt,overflow:Gt}:null,retryLane:536870912,hydrationErrors:null},a=Zo(e),a.return=t,t.child=a,Je=t,xe=null)):e=null,e===null)throw ga(t);return gs(e)?t.lanes=32:t.lanes=536870912,null}var o=l.children;return l=l.fallback,n?(Sa(),n=t.mode,o=wi({mode:"hidden",children:o},n),l=ka(l,n,a,null),o.return=t,l.return=t,o.sibling=l,t.child=o,l=t.child,l.memoizedState=Uc(a),l.childLanes=_c(e,c,a),t.memoizedState=Mc,Tn(null,l)):(Ea(t),wc(t,o))}var m=e.memoizedState;if(m!==null&&(o=m.dehydrated,o!==null)){if(i)t.flags&256?(Ea(t),t.flags&=-257,t=zc(e,t,a)):t.memoizedState!==null?(Sa(),t.child=e.child,t.flags|=128,t=null):(Sa(),o=l.fallback,n=t.mode,l=wi({mode:"visible",children:l.children},n),o=ka(o,n,a,null),o.flags|=2,l.return=t,o.return=t,l.sibling=o,t.child=l,Va(t,e.child,null,a),l=t.child,l.memoizedState=Uc(a),l.childLanes=_c(e,c,a),t.memoizedState=Mc,t=Tn(null,l));else if(Ea(t),gs(o)){if(c=o.nextSibling&&o.nextSibling.dataset,c)var A=c.dgst;c=A,l=Error(s(419)),l.stack="",l.digest=c,rn({value:l,source:null,stack:null}),t=zc(e,t,a)}else if(ke||Rl(e,t,a,!1),c=(a&e.childLanes)!==0,ke||c){if(c=Oe,c!==null&&(l=Ps(c,a),l!==0&&l!==m.retryLane))throw m.retryLane=l,Ia(e,l),ft(c,e,l),Dc;ms(o)||qi(),t=zc(e,t,a)}else ms(o)?(t.flags|=192,t.child=e.child,t=null):(e=m.treeContext,xe=Lt(o.nextSibling),Je=t,re=!0,ma=null,Ct=!1,e!==null&&$o(t,e),t=wc(t,l.children),t.flags|=4096);return t}return n?(Sa(),o=l.fallback,n=t.mode,m=e.child,A=m.sibling,l=Kt(m,{mode:"hidden",children:l.children}),l.subtreeFlags=m.subtreeFlags&65011712,A!==null?o=Kt(A,o):(o=ka(o,n,a,null),o.flags|=2),o.return=t,l.return=t,l.sibling=o,t.child=l,Tn(null,l),l=t.child,o=e.child.memoizedState,o===null?o=Uc(a):(n=o.cachePool,n!==null?(m=Ge._currentValue,n=n.parent!==m?{parent:m,pool:m}:n):n=ar(),o={baseLanes:o.baseLanes|a,cachePool:n}),l.memoizedState=o,l.childLanes=_c(e,c,a),t.memoizedState=Mc,Tn(e.child,l)):(Ea(t),a=e.child,e=a.sibling,a=Kt(a,{mode:"visible",children:l.children}),a.return=t,a.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=a,t.memoizedState=null,a)}function wc(e,t){return t=wi({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function wi(e,t){return e=gt(22,e,null,t),e.lanes=0,e}function zc(e,t,a){return Va(t,e.child,null,a),e=wc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function pf(e,t,a){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),$u(e.return,t,a)}function Hc(e,t,a,l,n,i){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:n,treeForkCount:i}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=l,c.tail=a,c.tailMode=n,c.treeForkCount=i)}function yf(e,t,a){var l=t.pendingProps,n=l.revealOrder,i=l.tail;l=l.children;var c=ze.current,o=(c&2)!==0;if(o?(c=c&1|2,t.flags|=128):c&=1,j(ze,c),Pe(e,t,l,a),l=re?on:0,!o&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&pf(e,a,t);else if(e.tag===19)pf(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(n){case"forwards":for(a=t.child,n=null;a!==null;)e=a.alternate,e!==null&&Ti(e)===null&&(n=a),a=a.sibling;a=n,a===null?(n=t.child,t.child=null):(n=a.sibling,a.sibling=null),Hc(t,!1,n,a,i,l);break;case"backwards":case"unstable_legacy-backwards":for(a=null,n=t.child,t.child=null;n!==null;){if(e=n.alternate,e!==null&&Ti(e)===null){t.child=n;break}e=n.sibling,n.sibling=a,a=n,n=e}Hc(t,!0,a,null,i,l);break;case"together":Hc(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function ea(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),Ra|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(Rl(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(s(153));if(t.child!==null){for(e=t.child,a=Kt(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=Kt(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function jc(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&mi(e)))}function F0(e,t,a){switch(t.tag){case 3:Qe(t,t.stateNode.containerInfo),pa(t,Ge,e.memoizedState.cache),qa();break;case 27:case 5:oa(t);break;case 4:Qe(t,t.stateNode.containerInfo);break;case 10:pa(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,sc(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(Ea(t),t.flags|=128,null):(a&t.child.childLanes)!==0?gf(e,t,a):(Ea(t),e=ea(e,t,a),e!==null?e.sibling:null);Ea(t);break;case 19:var n=(e.flags&128)!==0;if(l=(a&t.childLanes)!==0,l||(Rl(e,t,a,!1),l=(a&t.childLanes)!==0),n){if(l)return yf(e,t,a);t.flags|=128}if(n=t.memoizedState,n!==null&&(n.rendering=null,n.tail=null,n.lastEffect=null),j(ze,ze.current),l)break;return null;case 22:return t.lanes=0,of(e,t,a,t.pendingProps);case 24:pa(t,Ge,e.memoizedState.cache)}return ea(e,t,a)}function bf(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)ke=!0;else{if(!jc(e,a)&&(t.flags&128)===0)return ke=!1,F0(e,t,a);ke=(e.flags&131072)!==0}else ke=!1,re&&(t.flags&1048576)!==0&&Vo(t,on,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=Za(t.elementType),t.type=e,typeof e=="function")ku(e)?(l=Ja(e,l),t.tag=1,t=hf(null,t,e,l,a)):(t.tag=0,t=Lc(null,t,e,l,a));else{if(e!=null){var n=e.$$typeof;if(n===fe){t.tag=11,t=uf(null,t,e,l,a);break e}else if(n===P){t.tag=14,t=cf(null,t,e,l,a);break e}}throw t=at(e)||e,Error(s(306,t,""))}}return t;case 0:return Lc(e,t,t.type,t.pendingProps,a);case 1:return l=t.type,n=Ja(l,t.pendingProps),hf(e,t,l,n,a);case 3:e:{if(Qe(t,t.stateNode.containerInfo),e===null)throw Error(s(387));l=t.pendingProps;var i=t.memoizedState;n=i.element,lc(e,t),yn(t,l,null,a);var c=t.memoizedState;if(l=c.cache,pa(t,Ge,l),l!==i.cache&&Ju(t,[Ge],a,!0),pn(),l=c.element,i.isDehydrated)if(i={element:l,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){t=mf(e,t,l,a);break e}else if(l!==n){n=Ot(Error(s(424)),t),rn(n),t=mf(e,t,l,a);break e}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(xe=Lt(e.firstChild),Je=t,re=!0,ma=null,Ct=!0,a=sr(t,null,l,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(qa(),l===n){t=ea(e,t,a);break e}Pe(e,t,l,a)}t=t.child}return t;case 26:return _i(e,t),e===null?(a=Dd(t.type,null,t.pendingProps,null))?t.memoizedState=a:re||(a=t.type,e=t.pendingProps,l=$i(ie.current).createElement(a),l[$e]=t,l[it]=e,et(l,a,e),Ze(l),t.stateNode=l):t.memoizedState=Dd(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return oa(t),e===null&&re&&(l=t.stateNode=xd(t.type,t.pendingProps,ie.current),Je=t,Ct=!0,n=xe,Da(t.type)?(ps=n,xe=Lt(l.firstChild)):xe=n),Pe(e,t,t.pendingProps.children,a),_i(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&re&&((n=l=xe)&&(l=Em(l,t.type,t.pendingProps,Ct),l!==null?(t.stateNode=l,Je=t,xe=Lt(l.firstChild),Ct=!1,n=!0):n=!1),n||ga(t)),oa(t),n=t.type,i=t.pendingProps,c=e!==null?e.memoizedProps:null,l=i.children,fs(n,i)?l=null:c!==null&&fs(n,c)&&(t.flags|=32),t.memoizedState!==null&&(n=rc(e,t,z0,null,null,a),jn._currentValue=n),_i(e,t),Pe(e,t,l,a),t.child;case 6:return e===null&&re&&((e=a=xe)&&(a=Sm(a,t.pendingProps,Ct),a!==null?(t.stateNode=a,Je=t,xe=null,e=!0):e=!1),e||ga(t)),null;case 13:return gf(e,t,a);case 4:return Qe(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=Va(t,null,l,a):Pe(e,t,l,a),t.child;case 11:return uf(e,t,t.type,t.pendingProps,a);case 7:return Pe(e,t,t.pendingProps,a),t.child;case 8:return Pe(e,t,t.pendingProps.children,a),t.child;case 12:return Pe(e,t,t.pendingProps.children,a),t.child;case 10:return l=t.pendingProps,pa(t,t.type,l.value),Pe(e,t,l.children,a),t.child;case 9:return n=t.type._context,l=t.pendingProps.children,Xa(t),n=We(n),l=l(n),t.flags|=1,Pe(e,t,l,a),t.child;case 14:return cf(e,t,t.type,t.pendingProps,a);case 15:return sf(e,t,t.type,t.pendingProps,a);case 19:return yf(e,t,a);case 31:return q0(e,t,a);case 22:return of(e,t,a,t.pendingProps);case 24:return Xa(t),l=We(Ge),e===null?(n=ec(),n===null&&(n=Oe,i=Wu(),n.pooledCache=i,i.refCount++,i!==null&&(n.pooledCacheLanes|=a),n=i),t.memoizedState={parent:l,cache:n},ac(t),pa(t,Ge,n)):((e.lanes&a)!==0&&(lc(e,t),yn(t,null,null,a),pn()),n=e.memoizedState,i=t.memoizedState,n.parent!==l?(n={parent:l,cache:l},t.memoizedState=n,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=n),pa(t,Ge,l)):(l=i.cache,pa(t,Ge,l),l!==n.cache&&Ju(t,[Ge],a,!0))),Pe(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(s(156,t.tag))}function ta(e){e.flags|=4}function Bc(e,t,a,l,n){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(n&335544128)===n)if(e.stateNode.complete)e.flags|=8192;else if(Xf())e.flags|=8192;else throw Ka=bi,tc}else e.flags&=-16777217}function vf(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!wd(t))if(Xf())e.flags|=8192;else throw Ka=bi,tc}function zi(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?$s():536870912,e.lanes|=t,Hl|=t)}function An(e,t){if(!re)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Ne(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(t)for(var n=e.child;n!==null;)a|=n.lanes|n.childLanes,l|=n.subtreeFlags&65011712,l|=n.flags&65011712,n.return=e,n=n.sibling;else for(n=e.child;n!==null;)a|=n.lanes|n.childLanes,l|=n.subtreeFlags,l|=n.flags,n.return=e,n=n.sibling;return e.subtreeFlags|=l,e.childLanes=a,t}function X0(e,t,a){var l=t.pendingProps;switch(Qu(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ne(t),null;case 1:return Ne(t),null;case 3:return a=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),Jt(Ge),De(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Al(t)?ta(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ku())),Ne(t),null;case 26:var n=t.type,i=t.memoizedState;return e===null?(ta(t),i!==null?(Ne(t),vf(t,i)):(Ne(t),Bc(t,n,null,l,a))):i?i!==e.memoizedState?(ta(t),Ne(t),vf(t,i)):(Ne(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&ta(t),Ne(t),Bc(t,n,e,l,a)),null;case 27:if(tl(t),a=ie.current,n=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&ta(t);else{if(!l){if(t.stateNode===null)throw Error(s(166));return Ne(t),null}e=Y.current,Al(t)?Jo(t):(e=xd(n,l,a),t.stateNode=e,ta(t))}return Ne(t),null;case 5:if(tl(t),n=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&ta(t);else{if(!l){if(t.stateNode===null)throw Error(s(166));return Ne(t),null}if(i=Y.current,Al(t))Jo(t);else{var c=$i(ie.current);switch(i){case 1:i=c.createElementNS("http://www.w3.org/2000/svg",n);break;case 2:i=c.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;default:switch(n){case"svg":i=c.createElementNS("http://www.w3.org/2000/svg",n);break;case"math":i=c.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;case"script":i=c.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild);break;case"select":i=typeof l.is=="string"?c.createElement("select",{is:l.is}):c.createElement("select"),l.multiple?i.multiple=!0:l.size&&(i.size=l.size);break;default:i=typeof l.is=="string"?c.createElement(n,{is:l.is}):c.createElement(n)}}i[$e]=t,i[it]=l;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)i.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=i;e:switch(et(i,n,l),n){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&ta(t)}}return Ne(t),Bc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&ta(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(s(166));if(e=ie.current,Al(t)){if(e=t.stateNode,a=t.memoizedProps,l=null,n=Je,n!==null)switch(n.tag){case 27:case 5:l=n.memoizedProps}e[$e]=t,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||gd(e.nodeValue,a)),e||ga(t,!0)}else e=$i(e).createTextNode(l),e[$e]=t,t.stateNode=e}return Ne(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(l=Al(t),a!==null){if(e===null){if(!l)throw Error(s(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(557));e[$e]=t}else qa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ne(t),e=!1}else a=Ku(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(yt(t),t):(yt(t),null);if((t.flags&128)!==0)throw Error(s(558))}return Ne(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(n=Al(t),l!==null&&l.dehydrated!==null){if(e===null){if(!n)throw Error(s(318));if(n=t.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(s(317));n[$e]=t}else qa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ne(t),n=!1}else n=Ku(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),n=!0;if(!n)return t.flags&256?(yt(t),t):(yt(t),null)}return yt(t),(t.flags&128)!==0?(t.lanes=a,t):(a=l!==null,e=e!==null&&e.memoizedState!==null,a&&(l=t.child,n=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(n=l.alternate.memoizedState.cachePool.pool),i=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(i=l.memoizedState.cachePool.pool),i!==n&&(l.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),zi(t,t.updateQueue),Ne(t),null);case 4:return De(),e===null&&us(t.stateNode.containerInfo),Ne(t),null;case 10:return Jt(t.type),Ne(t),null;case 19:if(M(ze),l=t.memoizedState,l===null)return Ne(t),null;if(n=(t.flags&128)!==0,i=l.rendering,i===null)if(n)An(l,!1);else{if(Ue!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=Ti(e),i!==null){for(t.flags|=128,An(l,!1),e=i.updateQueue,t.updateQueue=e,zi(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)Qo(a,e),a=a.sibling;return j(ze,ze.current&1|2),re&&Vt(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&lt()>Gi&&(t.flags|=128,n=!0,An(l,!1),t.lanes=4194304)}else{if(!n)if(e=Ti(i),e!==null){if(t.flags|=128,n=!0,e=e.updateQueue,t.updateQueue=e,zi(t,e),An(l,!0),l.tail===null&&l.tailMode==="hidden"&&!i.alternate&&!re)return Ne(t),null}else 2*lt()-l.renderingStartTime>Gi&&a!==536870912&&(t.flags|=128,n=!0,An(l,!1),t.lanes=4194304);l.isBackwards?(i.sibling=t.child,t.child=i):(e=l.last,e!==null?e.sibling=i:t.child=i,l.last=i)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=lt(),e.sibling=null,a=ze.current,j(ze,n?a&1|2:a&1),re&&Vt(t,l.treeForkCount),e):(Ne(t),null);case 22:case 23:return yt(t),cc(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(a&536870912)!==0&&(t.flags&128)===0&&(Ne(t),t.subtreeFlags&6&&(t.flags|=8192)):Ne(t),a=t.updateQueue,a!==null&&zi(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==a&&(t.flags|=2048),e!==null&&M(Qa),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),Jt(Ge),Ne(t),null;case 25:return null;case 30:return null}throw Error(s(156,t.tag))}function Q0(e,t){switch(Qu(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Jt(Ge),De(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return tl(t),null;case 31:if(t.memoizedState!==null){if(yt(t),t.alternate===null)throw Error(s(340));qa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(yt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(s(340));qa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return M(ze),null;case 4:return De(),null;case 10:return Jt(t.type),null;case 22:case 23:return yt(t),cc(),e!==null&&M(Qa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Jt(Ge),null;case 25:return null;default:return null}}function Ef(e,t){switch(Qu(t),t.tag){case 3:Jt(Ge),De();break;case 26:case 27:case 5:tl(t);break;case 4:De();break;case 31:t.memoizedState!==null&&yt(t);break;case 13:yt(t);break;case 19:M(ze);break;case 10:Jt(t.type);break;case 22:case 23:yt(t),cc(),e!==null&&M(Qa);break;case 24:Jt(Ge)}}function Rn(e,t){try{var a=t.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var n=l.next;a=n;do{if((a.tag&e)===e){l=void 0;var i=a.create,c=a.inst;l=i(),c.destroy=l}a=a.next}while(a!==n)}}catch(o){Ee(t,t.return,o)}}function Ta(e,t,a){try{var l=t.updateQueue,n=l!==null?l.lastEffect:null;if(n!==null){var i=n.next;l=i;do{if((l.tag&e)===e){var c=l.inst,o=c.destroy;if(o!==void 0){c.destroy=void 0,n=t;var m=a,A=o;try{A()}catch(C){Ee(n,m,C)}}}l=l.next}while(l!==i)}}catch(C){Ee(t,t.return,C)}}function Sf(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{rr(t,a)}catch(l){Ee(e,e.return,l)}}}function Tf(e,t,a){a.props=Ja(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){Ee(e,t,l)}}function On(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(n){Ee(e,t,n)}}function It(e,t){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(n){Ee(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(n){Ee(e,t,n)}else a.current=null}function Af(e){var t=e.type,a=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(n){Ee(e,e.return,n)}}function Yc(e,t,a){try{var l=e.stateNode;mm(l,e.type,a,t),l[it]=t}catch(n){Ee(e,e.return,n)}}function Rf(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Da(e.type)||e.tag===4}function Gc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Rf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Da(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ic(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=Qt));else if(l!==4&&(l===27&&Da(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(Ic(e,t,a),e=e.sibling;e!==null;)Ic(e,t,a),e=e.sibling}function Hi(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(l!==4&&(l===27&&Da(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Hi(e,t,a),e=e.sibling;e!==null;)Hi(e,t,a),e=e.sibling}function Of(e){var t=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,n=t.attributes;n.length;)t.removeAttributeNode(n[0]);et(t,l,a),t[$e]=e,t[it]=a}catch(i){Ee(e,e.return,i)}}var aa=!1,qe=!1,kc=!1,xf=typeof WeakSet=="function"?WeakSet:Set,Ke=null;function Z0(e,t){if(e=e.containerInfo,os=lu,e=jo(e),zu(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var n=l.anchorOffset,i=l.focusNode;l=l.focusOffset;try{a.nodeType,i.nodeType}catch{a=null;break e}var c=0,o=-1,m=-1,A=0,C=0,L=e,O=null;t:for(;;){for(var x;L!==a||n!==0&&L.nodeType!==3||(o=c+n),L!==i||l!==0&&L.nodeType!==3||(m=c+l),L.nodeType===3&&(c+=L.nodeValue.length),(x=L.firstChild)!==null;)O=L,L=x;for(;;){if(L===e)break t;if(O===a&&++A===n&&(o=c),O===i&&++C===l&&(m=c),(x=L.nextSibling)!==null)break;L=O,O=L.parentNode}L=x}a=o===-1||m===-1?null:{start:o,end:m}}else a=null}a=a||{start:0,end:0}}else a=null;for(rs={focusedElem:e,selectionRange:a},lu=!1,Ke=t;Ke!==null;)if(t=Ke,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Ke=e;else for(;Ke!==null;){switch(t=Ke,i=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)n=e[a],n.ref.impl=n.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&i!==null){e=void 0,a=t,n=i.memoizedProps,i=i.memoizedState,l=a.stateNode;try{var B=Ja(a.type,n);e=l.getSnapshotBeforeUpdate(B,i),l.__reactInternalSnapshotBeforeUpdate=e}catch(J){Ee(a,a.return,J)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)hs(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":hs(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(s(163))}if(e=t.sibling,e!==null){e.return=t.return,Ke=e;break}Ke=t.return}}function Nf(e,t,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:na(e,a),l&4&&Rn(5,a);break;case 1:if(na(e,a),l&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(c){Ee(a,a.return,c)}else{var n=Ja(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(n,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){Ee(a,a.return,c)}}l&64&&Sf(a),l&512&&On(a,a.return);break;case 3:if(na(e,a),l&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{rr(e,t)}catch(c){Ee(a,a.return,c)}}break;case 27:t===null&&l&4&&Of(a);case 26:case 5:na(e,a),t===null&&l&4&&Af(a),l&512&&On(a,a.return);break;case 12:na(e,a);break;case 31:na(e,a),l&4&&Lf(e,a);break;case 13:na(e,a),l&4&&Mf(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=am.bind(null,a),Tm(e,a))));break;case 22:if(l=a.memoizedState!==null||aa,!l){t=t!==null&&t.memoizedState!==null||qe,n=aa;var i=qe;aa=l,(qe=t)&&!i?ia(e,a,(a.subtreeFlags&8772)!==0):na(e,a),aa=n,qe=i}break;case 30:break;default:na(e,a)}}function Cf(e){var t=e.alternate;t!==null&&(e.alternate=null,Cf(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&bu(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ce=null,ct=!1;function la(e,t,a){for(a=a.child;a!==null;)Df(e,t,a),a=a.sibling}function Df(e,t,a){if(dt&&typeof dt.onCommitFiberUnmount=="function")try{dt.onCommitFiberUnmount(Kl,a)}catch{}switch(a.tag){case 26:qe||It(a,t),la(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:qe||It(a,t);var l=Ce,n=ct;Da(a.type)&&(Ce=a.stateNode,ct=!1),la(e,t,a),wn(a.stateNode),Ce=l,ct=n;break;case 5:qe||It(a,t);case 6:if(l=Ce,n=ct,Ce=null,la(e,t,a),Ce=l,ct=n,Ce!==null)if(ct)try{(Ce.nodeType===9?Ce.body:Ce.nodeName==="HTML"?Ce.ownerDocument.body:Ce).removeChild(a.stateNode)}catch(i){Ee(a,t,i)}else try{Ce.removeChild(a.stateNode)}catch(i){Ee(a,t,i)}break;case 18:Ce!==null&&(ct?(e=Ce,Sd(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Fl(e)):Sd(Ce,a.stateNode));break;case 4:l=Ce,n=ct,Ce=a.stateNode.containerInfo,ct=!0,la(e,t,a),Ce=l,ct=n;break;case 0:case 11:case 14:case 15:Ta(2,a,t),qe||Ta(4,a,t),la(e,t,a);break;case 1:qe||(It(a,t),l=a.stateNode,typeof l.componentWillUnmount=="function"&&Tf(a,t,l)),la(e,t,a);break;case 21:la(e,t,a);break;case 22:qe=(l=qe)||a.memoizedState!==null,la(e,t,a),qe=l;break;default:la(e,t,a)}}function Lf(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Fl(e)}catch(a){Ee(t,t.return,a)}}}function Mf(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Fl(e)}catch(a){Ee(t,t.return,a)}}function K0(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new xf),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new xf),t;default:throw Error(s(435,e.tag))}}function ji(e,t){var a=K0(e);t.forEach(function(l){if(!a.has(l)){a.add(l);var n=lm.bind(null,e,l);l.then(n,n)}})}function st(e,t){var a=t.deletions;if(a!==null)for(var l=0;l<a.length;l++){var n=a[l],i=e,c=t,o=c;e:for(;o!==null;){switch(o.tag){case 27:if(Da(o.type)){Ce=o.stateNode,ct=!1;break e}break;case 5:Ce=o.stateNode,ct=!1;break e;case 3:case 4:Ce=o.stateNode.containerInfo,ct=!0;break e}o=o.return}if(Ce===null)throw Error(s(160));Df(i,c,n),Ce=null,ct=!1,i=n.alternate,i!==null&&(i.return=null),n.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Uf(t,e),t=t.sibling}var zt=null;function Uf(e,t){var a=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:st(t,e),ot(e),l&4&&(Ta(3,e,e.return),Rn(3,e),Ta(5,e,e.return));break;case 1:st(t,e),ot(e),l&512&&(qe||a===null||It(a,a.return)),l&64&&aa&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var n=zt;if(st(t,e),ot(e),l&512&&(qe||a===null||It(a,a.return)),l&4){var i=a!==null?a.memoizedState:null;if(l=e.memoizedState,a===null)if(l===null)if(e.stateNode===null){e:{l=e.type,a=e.memoizedProps,n=n.ownerDocument||n;t:switch(l){case"title":i=n.getElementsByTagName("title")[0],(!i||i[Jl]||i[$e]||i.namespaceURI==="http://www.w3.org/2000/svg"||i.hasAttribute("itemprop"))&&(i=n.createElement(l),n.head.insertBefore(i,n.querySelector("head > title"))),et(i,l,a),i[$e]=e,Ze(i),l=i;break e;case"link":var c=Ud("link","href",n).get(l+(a.href||""));if(c){for(var o=0;o<c.length;o++)if(i=c[o],i.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&i.getAttribute("rel")===(a.rel==null?null:a.rel)&&i.getAttribute("title")===(a.title==null?null:a.title)&&i.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){c.splice(o,1);break t}}i=n.createElement(l),et(i,l,a),n.head.appendChild(i);break;case"meta":if(c=Ud("meta","content",n).get(l+(a.content||""))){for(o=0;o<c.length;o++)if(i=c[o],i.getAttribute("content")===(a.content==null?null:""+a.content)&&i.getAttribute("name")===(a.name==null?null:a.name)&&i.getAttribute("property")===(a.property==null?null:a.property)&&i.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&i.getAttribute("charset")===(a.charSet==null?null:a.charSet)){c.splice(o,1);break t}}i=n.createElement(l),et(i,l,a),n.head.appendChild(i);break;default:throw Error(s(468,l))}i[$e]=e,Ze(i),l=i}e.stateNode=l}else _d(n,e.type,e.stateNode);else e.stateNode=Md(n,l,e.memoizedProps);else i!==l?(i===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):i.count--,l===null?_d(n,e.type,e.stateNode):Md(n,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Yc(e,e.memoizedProps,a.memoizedProps)}break;case 27:st(t,e),ot(e),l&512&&(qe||a===null||It(a,a.return)),a!==null&&l&4&&Yc(e,e.memoizedProps,a.memoizedProps);break;case 5:if(st(t,e),ot(e),l&512&&(qe||a===null||It(a,a.return)),e.flags&32){n=e.stateNode;try{hl(n,"")}catch(B){Ee(e,e.return,B)}}l&4&&e.stateNode!=null&&(n=e.memoizedProps,Yc(e,n,a!==null?a.memoizedProps:n)),l&1024&&(kc=!0);break;case 6:if(st(t,e),ot(e),l&4){if(e.stateNode===null)throw Error(s(162));l=e.memoizedProps,a=e.stateNode;try{a.nodeValue=l}catch(B){Ee(e,e.return,B)}}break;case 3:if(Pi=null,n=zt,zt=Ji(t.containerInfo),st(t,e),zt=n,ot(e),l&4&&a!==null&&a.memoizedState.isDehydrated)try{Fl(t.containerInfo)}catch(B){Ee(e,e.return,B)}kc&&(kc=!1,_f(e));break;case 4:l=zt,zt=Ji(e.stateNode.containerInfo),st(t,e),ot(e),zt=l;break;case 12:st(t,e),ot(e);break;case 31:st(t,e),ot(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,ji(e,l)));break;case 13:st(t,e),ot(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Yi=lt()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,ji(e,l)));break;case 22:n=e.memoizedState!==null;var m=a!==null&&a.memoizedState!==null,A=aa,C=qe;if(aa=A||n,qe=C||m,st(t,e),qe=C,aa=A,ot(e),l&8192)e:for(t=e.stateNode,t._visibility=n?t._visibility&-2:t._visibility|1,n&&(a===null||m||aa||qe||Wa(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){m=a=t;try{if(i=m.stateNode,n)c=i.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none";else{o=m.stateNode;var L=m.memoizedProps.style,O=L!=null&&L.hasOwnProperty("display")?L.display:null;o.style.display=O==null||typeof O=="boolean"?"":(""+O).trim()}}catch(B){Ee(m,m.return,B)}}}else if(t.tag===6){if(a===null){m=t;try{m.stateNode.nodeValue=n?"":m.memoizedProps}catch(B){Ee(m,m.return,B)}}}else if(t.tag===18){if(a===null){m=t;try{var x=m.stateNode;n?Td(x,!0):Td(m.stateNode,!1)}catch(B){Ee(m,m.return,B)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,ji(e,a))));break;case 19:st(t,e),ot(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,ji(e,l)));break;case 30:break;case 21:break;default:st(t,e),ot(e)}}function ot(e){var t=e.flags;if(t&2){try{for(var a,l=e.return;l!==null;){if(Rf(l)){a=l;break}l=l.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var n=a.stateNode,i=Gc(e);Hi(e,i,n);break;case 5:var c=a.stateNode;a.flags&32&&(hl(c,""),a.flags&=-33);var o=Gc(e);Hi(e,o,c);break;case 3:case 4:var m=a.stateNode.containerInfo,A=Gc(e);Ic(e,A,m);break;default:throw Error(s(161))}}catch(C){Ee(e,e.return,C)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function _f(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;_f(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function na(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Nf(e,t.alternate,t),t=t.sibling}function Wa(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Ta(4,t,t.return),Wa(t);break;case 1:It(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Tf(t,t.return,a),Wa(t);break;case 27:wn(t.stateNode);case 26:case 5:It(t,t.return),Wa(t);break;case 22:t.memoizedState===null&&Wa(t);break;case 30:Wa(t);break;default:Wa(t)}e=e.sibling}}function ia(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,n=e,i=t,c=i.flags;switch(i.tag){case 0:case 11:case 15:ia(n,i,a),Rn(4,i);break;case 1:if(ia(n,i,a),l=i,n=l.stateNode,typeof n.componentDidMount=="function")try{n.componentDidMount()}catch(A){Ee(l,l.return,A)}if(l=i,n=l.updateQueue,n!==null){var o=l.stateNode;try{var m=n.shared.hiddenCallbacks;if(m!==null)for(n.shared.hiddenCallbacks=null,n=0;n<m.length;n++)or(m[n],o)}catch(A){Ee(l,l.return,A)}}a&&c&64&&Sf(i),On(i,i.return);break;case 27:Of(i);case 26:case 5:ia(n,i,a),a&&l===null&&c&4&&Af(i),On(i,i.return);break;case 12:ia(n,i,a);break;case 31:ia(n,i,a),a&&c&4&&Lf(n,i);break;case 13:ia(n,i,a),a&&c&4&&Mf(n,i);break;case 22:i.memoizedState===null&&ia(n,i,a),On(i,i.return);break;case 30:break;default:ia(n,i,a)}t=t.sibling}}function qc(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&fn(a))}function Fc(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&fn(e))}function Ht(e,t,a,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)wf(e,t,a,l),t=t.sibling}function wf(e,t,a,l){var n=t.flags;switch(t.tag){case 0:case 11:case 15:Ht(e,t,a,l),n&2048&&Rn(9,t);break;case 1:Ht(e,t,a,l);break;case 3:Ht(e,t,a,l),n&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&fn(e)));break;case 12:if(n&2048){Ht(e,t,a,l),e=t.stateNode;try{var i=t.memoizedProps,c=i.id,o=i.onPostCommit;typeof o=="function"&&o(c,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(m){Ee(t,t.return,m)}}else Ht(e,t,a,l);break;case 31:Ht(e,t,a,l);break;case 13:Ht(e,t,a,l);break;case 23:break;case 22:i=t.stateNode,c=t.alternate,t.memoizedState!==null?i._visibility&2?Ht(e,t,a,l):xn(e,t):i._visibility&2?Ht(e,t,a,l):(i._visibility|=2,_l(e,t,a,l,(t.subtreeFlags&10256)!==0||!1)),n&2048&&qc(c,t);break;case 24:Ht(e,t,a,l),n&2048&&Fc(t.alternate,t);break;default:Ht(e,t,a,l)}}function _l(e,t,a,l,n){for(n=n&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var i=e,c=t,o=a,m=l,A=c.flags;switch(c.tag){case 0:case 11:case 15:_l(i,c,o,m,n),Rn(8,c);break;case 23:break;case 22:var C=c.stateNode;c.memoizedState!==null?C._visibility&2?_l(i,c,o,m,n):xn(i,c):(C._visibility|=2,_l(i,c,o,m,n)),n&&A&2048&&qc(c.alternate,c);break;case 24:_l(i,c,o,m,n),n&&A&2048&&Fc(c.alternate,c);break;default:_l(i,c,o,m,n)}t=t.sibling}}function xn(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,l=t,n=l.flags;switch(l.tag){case 22:xn(a,l),n&2048&&qc(l.alternate,l);break;case 24:xn(a,l),n&2048&&Fc(l.alternate,l);break;default:xn(a,l)}t=t.sibling}}var Nn=8192;function wl(e,t,a){if(e.subtreeFlags&Nn)for(e=e.child;e!==null;)zf(e,t,a),e=e.sibling}function zf(e,t,a){switch(e.tag){case 26:wl(e,t,a),e.flags&Nn&&e.memoizedState!==null&&wm(a,zt,e.memoizedState,e.memoizedProps);break;case 5:wl(e,t,a);break;case 3:case 4:var l=zt;zt=Ji(e.stateNode.containerInfo),wl(e,t,a),zt=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=Nn,Nn=16777216,wl(e,t,a),Nn=l):wl(e,t,a));break;default:wl(e,t,a)}}function Hf(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Cn(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Ke=l,Bf(l,e)}Hf(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)jf(e),e=e.sibling}function jf(e){switch(e.tag){case 0:case 11:case 15:Cn(e),e.flags&2048&&Ta(9,e,e.return);break;case 3:Cn(e);break;case 12:Cn(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Bi(e)):Cn(e);break;default:Cn(e)}}function Bi(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Ke=l,Bf(l,e)}Hf(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Ta(8,t,t.return),Bi(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,Bi(t));break;default:Bi(t)}e=e.sibling}}function Bf(e,t){for(;Ke!==null;){var a=Ke;switch(a.tag){case 0:case 11:case 15:Ta(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:fn(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,Ke=l;else e:for(a=e;Ke!==null;){l=Ke;var n=l.sibling,i=l.return;if(Cf(l),l===a){Ke=null;break e}if(n!==null){n.return=i,Ke=n;break e}Ke=i}}}var V0={getCacheForType:function(e){var t=We(Ge),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return We(Ge).controller.signal}},$0=typeof WeakMap=="function"?WeakMap:Map,ye=0,Oe=null,ue=null,se=0,ve=0,bt=null,Aa=!1,zl=!1,Xc=!1,ua=0,Ue=0,Ra=0,Pa=0,Qc=0,vt=0,Hl=0,Dn=null,rt=null,Zc=!1,Yi=0,Yf=0,Gi=1/0,Ii=null,Oa=null,Fe=0,xa=null,jl=null,ca=0,Kc=0,Vc=null,Gf=null,Ln=0,$c=null;function Et(){return(ye&2)!==0&&se!==0?se&-se:N.T!==null?as():eo()}function If(){if(vt===0)if((se&536870912)===0||re){var e=Vn;Vn<<=1,(Vn&3932160)===0&&(Vn=262144),vt=e}else vt=536870912;return e=pt.current,e!==null&&(e.flags|=32),vt}function ft(e,t,a){(e===Oe&&(ve===2||ve===9)||e.cancelPendingCommit!==null)&&(Bl(e,0),Na(e,se,vt,!1)),$l(e,a),((ye&2)===0||e!==Oe)&&(e===Oe&&((ye&2)===0&&(Pa|=a),Ue===4&&Na(e,se,vt,!1)),kt(e))}function kf(e,t,a){if((ye&6)!==0)throw Error(s(327));var l=!a&&(t&127)===0&&(t&e.expiredLanes)===0||Vl(e,t),n=l?P0(e,t):Wc(e,t,!0),i=l;do{if(n===0){zl&&!l&&Na(e,t,0,!1);break}else{if(a=e.current.alternate,i&&!J0(a)){n=Wc(e,t,!1),i=!1;continue}if(n===2){if(i=t,e.errorRecoveryDisabledLanes&i)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var o=e;n=Dn;var m=o.current.memoizedState.isDehydrated;if(m&&(Bl(o,c).flags|=256),c=Wc(o,c,!1),c!==2){if(Xc&&!m){o.errorRecoveryDisabledLanes|=i,Pa|=i,n=4;break e}i=rt,rt=n,i!==null&&(rt===null?rt=i:rt.push.apply(rt,i))}n=c}if(i=!1,n!==2)continue}}if(n===1){Bl(e,0),Na(e,t,0,!0);break}e:{switch(l=e,i=n,i){case 0:case 1:throw Error(s(345));case 4:if((t&4194048)!==t)break;case 6:Na(l,t,vt,!Aa);break e;case 2:rt=null;break;case 3:case 5:break;default:throw Error(s(329))}if((t&62914560)===t&&(n=Yi+300-lt(),10<n)){if(Na(l,t,vt,!Aa),Jn(l,0,!0)!==0)break e;ca=t,l.timeoutHandle=vd(qf.bind(null,l,a,rt,Ii,Zc,t,vt,Pa,Hl,Aa,i,"Throttled",-0,0),n);break e}qf(l,a,rt,Ii,Zc,t,vt,Pa,Hl,Aa,i,null,-0,0)}}break}while(!0);kt(e)}function qf(e,t,a,l,n,i,c,o,m,A,C,L,O,x){if(e.timeoutHandle=-1,L=t.subtreeFlags,L&8192||(L&16785408)===16785408){L={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Qt},zf(t,i,L);var B=(i&62914560)===i?Yi-lt():(i&4194048)===i?Yf-lt():0;if(B=zm(L,B),B!==null){ca=i,e.cancelPendingCommit=B(Jf.bind(null,e,t,i,a,l,n,c,o,m,C,L,null,O,x)),Na(e,i,c,!A);return}}Jf(e,t,i,a,l,n,c,o,m)}function J0(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var n=a[l],i=n.getSnapshot;n=n.value;try{if(!mt(i(),n))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Na(e,t,a,l){t&=~Qc,t&=~Pa,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var n=t;0<n;){var i=31-ht(n),c=1<<i;l[i]=-1,n&=~c}a!==0&&Js(e,a,t)}function ki(){return(ye&6)===0?(Mn(0),!1):!0}function Jc(){if(ue!==null){if(ve===0)var e=ue.return;else e=ue,$t=Fa=null,hc(e),Cl=null,hn=0,e=ue;for(;e!==null;)Ef(e.alternate,e),e=e.return;ue=null}}function Bl(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,ym(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ca=0,Jc(),Oe=e,ue=a=Kt(e.current,null),se=t,ve=0,bt=null,Aa=!1,zl=Vl(e,t),Xc=!1,Hl=vt=Qc=Pa=Ra=Ue=0,rt=Dn=null,Zc=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var n=31-ht(l),i=1<<n;t|=e[n],l&=~i}return ua=t,oi(),a}function Ff(e,t){le=null,N.H=Sn,t===Nl||t===yi?(t=ir(),ve=3):t===tc?(t=ir(),ve=4):ve=t===Dc?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,bt=t,ue===null&&(Ue=1,Mi(e,Ot(t,e.current)))}function Xf(){var e=pt.current;return e===null?!0:(se&4194048)===se?Dt===null:(se&62914560)===se||(se&536870912)!==0?e===Dt:!1}function Qf(){var e=N.H;return N.H=Sn,e===null?Sn:e}function Zf(){var e=N.A;return N.A=V0,e}function qi(){Ue=4,Aa||(se&4194048)!==se&&pt.current!==null||(zl=!0),(Ra&134217727)===0&&(Pa&134217727)===0||Oe===null||Na(Oe,se,vt,!1)}function Wc(e,t,a){var l=ye;ye|=2;var n=Qf(),i=Zf();(Oe!==e||se!==t)&&(Ii=null,Bl(e,t)),t=!1;var c=Ue;e:do try{if(ve!==0&&ue!==null){var o=ue,m=bt;switch(ve){case 8:Jc(),c=6;break e;case 3:case 2:case 9:case 6:pt.current===null&&(t=!0);var A=ve;if(ve=0,bt=null,Yl(e,o,m,A),a&&zl){c=0;break e}break;default:A=ve,ve=0,bt=null,Yl(e,o,m,A)}}W0(),c=Ue;break}catch(C){Ff(e,C)}while(!0);return t&&e.shellSuspendCounter++,$t=Fa=null,ye=l,N.H=n,N.A=i,ue===null&&(Oe=null,se=0,oi()),c}function W0(){for(;ue!==null;)Kf(ue)}function P0(e,t){var a=ye;ye|=2;var l=Qf(),n=Zf();Oe!==e||se!==t?(Ii=null,Gi=lt()+500,Bl(e,t)):zl=Vl(e,t);e:do try{if(ve!==0&&ue!==null){t=ue;var i=bt;t:switch(ve){case 1:ve=0,bt=null,Yl(e,t,i,1);break;case 2:case 9:if(lr(i)){ve=0,bt=null,Vf(t);break}t=function(){ve!==2&&ve!==9||Oe!==e||(ve=7),kt(e)},i.then(t,t);break e;case 3:ve=7;break e;case 4:ve=5;break e;case 7:lr(i)?(ve=0,bt=null,Vf(t)):(ve=0,bt=null,Yl(e,t,i,7));break;case 5:var c=null;switch(ue.tag){case 26:c=ue.memoizedState;case 5:case 27:var o=ue;if(c?wd(c):o.stateNode.complete){ve=0,bt=null;var m=o.sibling;if(m!==null)ue=m;else{var A=o.return;A!==null?(ue=A,Fi(A)):ue=null}break t}}ve=0,bt=null,Yl(e,t,i,5);break;case 6:ve=0,bt=null,Yl(e,t,i,6);break;case 8:Jc(),Ue=6;break e;default:throw Error(s(462))}}em();break}catch(C){Ff(e,C)}while(!0);return $t=Fa=null,N.H=l,N.A=n,ye=a,ue!==null?0:(Oe=null,se=0,oi(),Ue)}function em(){for(;ue!==null&&!Qn();)Kf(ue)}function Kf(e){var t=bf(e.alternate,e,ua);e.memoizedProps=e.pendingProps,t===null?Fi(e):ue=t}function Vf(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=df(a,t,t.pendingProps,t.type,void 0,se);break;case 11:t=df(a,t,t.pendingProps,t.type.render,t.ref,se);break;case 5:hc(t);default:Ef(a,t),t=ue=Qo(t,ua),t=bf(a,t,ua)}e.memoizedProps=e.pendingProps,t===null?Fi(e):ue=t}function Yl(e,t,a,l){$t=Fa=null,hc(t),Cl=null,hn=0;var n=t.return;try{if(k0(e,n,t,a,se)){Ue=1,Mi(e,Ot(a,e.current)),ue=null;return}}catch(i){if(n!==null)throw ue=n,i;Ue=1,Mi(e,Ot(a,e.current)),ue=null;return}t.flags&32768?(re||l===1?e=!0:zl||(se&536870912)!==0?e=!1:(Aa=e=!0,(l===2||l===9||l===3||l===6)&&(l=pt.current,l!==null&&l.tag===13&&(l.flags|=16384))),$f(t,e)):Fi(t)}function Fi(e){var t=e;do{if((t.flags&32768)!==0){$f(t,Aa);return}e=t.return;var a=X0(t.alternate,t,ua);if(a!==null){ue=a;return}if(t=t.sibling,t!==null){ue=t;return}ue=t=e}while(t!==null);Ue===0&&(Ue=5)}function $f(e,t){do{var a=Q0(e.alternate,e);if(a!==null){a.flags&=32767,ue=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){ue=e;return}ue=e=a}while(e!==null);Ue=6,ue=null}function Jf(e,t,a,l,n,i,c,o,m){e.cancelPendingCommit=null;do Xi();while(Fe!==0);if((ye&6)!==0)throw Error(s(327));if(t!==null){if(t===e.current)throw Error(s(177));if(i=t.lanes|t.childLanes,i|=Gu,_h(e,a,i,c,o,m),e===Oe&&(ue=Oe=null,se=0),jl=t,xa=e,ca=a,Kc=i,Vc=n,Gf=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,nm(Zn,function(){return ad(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=N.T,N.T=null,n=H.p,H.p=2,c=ye,ye|=4;try{Z0(e,t,a)}finally{ye=c,H.p=n,N.T=l}}Fe=1,Wf(),Pf(),ed()}}function Wf(){if(Fe===1){Fe=0;var e=xa,t=jl,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=N.T,N.T=null;var l=H.p;H.p=2;var n=ye;ye|=4;try{Uf(t,e);var i=rs,c=jo(e.containerInfo),o=i.focusedElem,m=i.selectionRange;if(c!==o&&o&&o.ownerDocument&&Ho(o.ownerDocument.documentElement,o)){if(m!==null&&zu(o)){var A=m.start,C=m.end;if(C===void 0&&(C=A),"selectionStart"in o)o.selectionStart=A,o.selectionEnd=Math.min(C,o.value.length);else{var L=o.ownerDocument||document,O=L&&L.defaultView||window;if(O.getSelection){var x=O.getSelection(),B=o.textContent.length,J=Math.min(m.start,B),Re=m.end===void 0?J:Math.min(m.end,B);!x.extend&&J>Re&&(c=Re,Re=J,J=c);var S=zo(o,J),p=zo(o,Re);if(S&&p&&(x.rangeCount!==1||x.anchorNode!==S.node||x.anchorOffset!==S.offset||x.focusNode!==p.node||x.focusOffset!==p.offset)){var T=L.createRange();T.setStart(S.node,S.offset),x.removeAllRanges(),J>Re?(x.addRange(T),x.extend(p.node,p.offset)):(T.setEnd(p.node,p.offset),x.addRange(T))}}}}for(L=[],x=o;x=x.parentNode;)x.nodeType===1&&L.push({element:x,left:x.scrollLeft,top:x.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<L.length;o++){var D=L[o];D.element.scrollLeft=D.left,D.element.scrollTop=D.top}}lu=!!os,rs=os=null}finally{ye=n,H.p=l,N.T=a}}e.current=t,Fe=2}}function Pf(){if(Fe===2){Fe=0;var e=xa,t=jl,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=N.T,N.T=null;var l=H.p;H.p=2;var n=ye;ye|=4;try{Nf(e,t.alternate,t)}finally{ye=n,H.p=l,N.T=a}}Fe=3}}function ed(){if(Fe===4||Fe===3){Fe=0,ul();var e=xa,t=jl,a=ca,l=Gf;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Fe=5:(Fe=0,jl=xa=null,td(e,e.pendingLanes));var n=e.pendingLanes;if(n===0&&(Oa=null),pu(a),t=t.stateNode,dt&&typeof dt.onCommitFiberRoot=="function")try{dt.onCommitFiberRoot(Kl,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=N.T,n=H.p,H.p=2,N.T=null;try{for(var i=e.onRecoverableError,c=0;c<l.length;c++){var o=l[c];i(o.value,{componentStack:o.stack})}}finally{N.T=t,H.p=n}}(ca&3)!==0&&Xi(),kt(e),n=e.pendingLanes,(a&261930)!==0&&(n&42)!==0?e===$c?Ln++:(Ln=0,$c=e):Ln=0,Mn(0)}}function td(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,fn(t)))}function Xi(){return Wf(),Pf(),ed(),ad()}function ad(){if(Fe!==5)return!1;var e=xa,t=Kc;Kc=0;var a=pu(ca),l=N.T,n=H.p;try{H.p=32>a?32:a,N.T=null,a=Vc,Vc=null;var i=xa,c=ca;if(Fe=0,jl=xa=null,ca=0,(ye&6)!==0)throw Error(s(331));var o=ye;if(ye|=4,jf(i.current),wf(i,i.current,c,a),ye=o,Mn(0,!1),dt&&typeof dt.onPostCommitFiberRoot=="function")try{dt.onPostCommitFiberRoot(Kl,i)}catch{}return!0}finally{H.p=n,N.T=l,td(e,t)}}function ld(e,t,a){t=Ot(a,t),t=Cc(e.stateNode,t,2),e=va(e,t,2),e!==null&&($l(e,2),kt(e))}function Ee(e,t,a){if(e.tag===3)ld(e,e,a);else for(;t!==null;){if(t.tag===3){ld(t,e,a);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Oa===null||!Oa.has(l))){e=Ot(a,e),a=lf(2),l=va(t,a,2),l!==null&&(nf(a,l,t,e),$l(l,2),kt(l));break}}t=t.return}}function Pc(e,t,a){var l=e.pingCache;if(l===null){l=e.pingCache=new $0;var n=new Set;l.set(t,n)}else n=l.get(t),n===void 0&&(n=new Set,l.set(t,n));n.has(a)||(Xc=!0,n.add(a),e=tm.bind(null,e,t,a),t.then(e,e))}function tm(e,t,a){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Oe===e&&(se&a)===a&&(Ue===4||Ue===3&&(se&62914560)===se&&300>lt()-Yi?(ye&2)===0&&Bl(e,0):Qc|=a,Hl===se&&(Hl=0)),kt(e)}function nd(e,t){t===0&&(t=$s()),e=Ia(e,t),e!==null&&($l(e,t),kt(e))}function am(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),nd(e,a)}function lm(e,t){var a=0;switch(e.tag){case 31:case 13:var l=e.stateNode,n=e.memoizedState;n!==null&&(a=n.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(s(314))}l!==null&&l.delete(t),nd(e,a)}function nm(e,t){return nl(e,t)}var Qi=null,Gl=null,es=!1,Zi=!1,ts=!1,Ca=0;function kt(e){e!==Gl&&e.next===null&&(Gl===null?Qi=Gl=e:Gl=Gl.next=e),Zi=!0,es||(es=!0,um())}function Mn(e,t){if(!ts&&Zi){ts=!0;do for(var a=!1,l=Qi;l!==null;){if(e!==0){var n=l.pendingLanes;if(n===0)var i=0;else{var c=l.suspendedLanes,o=l.pingedLanes;i=(1<<31-ht(42|e)+1)-1,i&=n&~(c&~o),i=i&201326741?i&201326741|1:i?i|2:0}i!==0&&(a=!0,sd(l,i))}else i=se,i=Jn(l,l===Oe?i:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(i&3)===0||Vl(l,i)||(a=!0,sd(l,i));l=l.next}while(a);ts=!1}}function im(){id()}function id(){Zi=es=!1;var e=0;Ca!==0&&pm()&&(e=Ca);for(var t=lt(),a=null,l=Qi;l!==null;){var n=l.next,i=ud(l,t);i===0?(l.next=null,a===null?Qi=n:a.next=n,n===null&&(Gl=a)):(a=l,(e!==0||(i&3)!==0)&&(Zi=!0)),l=n}Fe!==0&&Fe!==5||Mn(e),Ca!==0&&(Ca=0)}function ud(e,t){for(var a=e.suspendedLanes,l=e.pingedLanes,n=e.expirationTimes,i=e.pendingLanes&-62914561;0<i;){var c=31-ht(i),o=1<<c,m=n[c];m===-1?((o&a)===0||(o&l)!==0)&&(n[c]=Uh(o,t)):m<=t&&(e.expiredLanes|=o),i&=~o}if(t=Oe,a=se,a=Jn(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===t&&(ve===2||ve===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&il(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Vl(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(l!==null&&il(l),pu(a)){case 2:case 8:a=Bt;break;case 32:a=Zn;break;case 268435456:a=Vs;break;default:a=Zn}return l=cd.bind(null,e),a=nl(a,l),e.callbackPriority=t,e.callbackNode=a,t}return l!==null&&l!==null&&il(l),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(Fe!==0&&Fe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Xi()&&e.callbackNode!==a)return null;var l=se;return l=Jn(e,e===Oe?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(kf(e,l,t),ud(e,lt()),e.callbackNode!=null&&e.callbackNode===a?cd.bind(null,e):null)}function sd(e,t){if(Xi())return null;kf(e,t,!0)}function um(){bm(function(){(ye&6)!==0?nl(we,im):id()})}function as(){if(Ca===0){var e=Ol;e===0&&(e=Kn,Kn<<=1,(Kn&261888)===0&&(Kn=256)),Ca=e}return Ca}function od(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:ti(""+e)}function rd(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function cm(e,t,a,l,n){if(t==="submit"&&a&&a.stateNode===n){var i=od((n[it]||null).action),c=l.submitter;c&&(t=(t=c[it]||null)?od(t.formAction):c.getAttribute("formAction"),t!==null&&(i=t,c=null));var o=new ii("action","action",null,l,n);e.push({event:o,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Ca!==0){var m=c?rd(n,c):new FormData(n);Tc(a,{pending:!0,data:m,method:n.method,action:i},null,m)}}else typeof i=="function"&&(o.preventDefault(),m=c?rd(n,c):new FormData(n),Tc(a,{pending:!0,data:m,method:n.method,action:i},i,m))},currentTarget:n}]})}}for(var ls=0;ls<Yu.length;ls++){var ns=Yu[ls],sm=ns.toLowerCase(),om=ns[0].toUpperCase()+ns.slice(1);wt(sm,"on"+om)}wt(Go,"onAnimationEnd"),wt(Io,"onAnimationIteration"),wt(ko,"onAnimationStart"),wt("dblclick","onDoubleClick"),wt("focusin","onFocus"),wt("focusout","onBlur"),wt(O0,"onTransitionRun"),wt(x0,"onTransitionStart"),wt(N0,"onTransitionCancel"),wt(qo,"onTransitionEnd"),fl("onMouseEnter",["mouseout","mouseover"]),fl("onMouseLeave",["mouseout","mouseover"]),fl("onPointerEnter",["pointerout","pointerover"]),fl("onPointerLeave",["pointerout","pointerover"]),ja("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),ja("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),ja("onBeforeInput",["compositionend","keypress","textInput","paste"]),ja("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),ja("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),ja("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Un="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),rm=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Un));function fd(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],n=l.event;l=l.listeners;e:{var i=void 0;if(t)for(var c=l.length-1;0<=c;c--){var o=l[c],m=o.instance,A=o.currentTarget;if(o=o.listener,m!==i&&n.isPropagationStopped())break e;i=o,n.currentTarget=A;try{i(n)}catch(C){si(C)}n.currentTarget=null,i=m}else for(c=0;c<l.length;c++){if(o=l[c],m=o.instance,A=o.currentTarget,o=o.listener,m!==i&&n.isPropagationStopped())break e;i=o,n.currentTarget=A;try{i(n)}catch(C){si(C)}n.currentTarget=null,i=m}}}}function ce(e,t){var a=t[yu];a===void 0&&(a=t[yu]=new Set);var l=e+"__bubble";a.has(l)||(dd(t,e,2,!1),a.add(l))}function is(e,t,a){var l=0;t&&(l|=4),dd(a,e,l,t)}var Ki="_reactListening"+Math.random().toString(36).slice(2);function us(e){if(!e[Ki]){e[Ki]=!0,lo.forEach(function(a){a!=="selectionchange"&&(rm.has(a)||is(a,!1,e),is(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ki]||(t[Ki]=!0,is("selectionchange",!1,t))}}function dd(e,t,a,l){switch(Id(t)){case 2:var n=Bm;break;case 8:n=Ym;break;default:n=Ss}a=n.bind(null,t,a,e),n=void 0,!xu||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(n=!0),l?n!==void 0?e.addEventListener(t,a,{capture:!0,passive:n}):e.addEventListener(t,a,!0):n!==void 0?e.addEventListener(t,a,{passive:n}):e.addEventListener(t,a,!1)}function cs(e,t,a,l,n){var i=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var c=l.tag;if(c===3||c===4){var o=l.stateNode.containerInfo;if(o===n)break;if(c===4)for(c=l.return;c!==null;){var m=c.tag;if((m===3||m===4)&&c.stateNode.containerInfo===n)return;c=c.return}for(;o!==null;){if(c=sl(o),c===null)return;if(m=c.tag,m===5||m===6||m===26||m===27){l=i=c;continue e}o=o.parentNode}}l=l.return}po(function(){var A=i,C=Ru(a),L=[];e:{var O=Fo.get(e);if(O!==void 0){var x=ii,B=e;switch(e){case"keypress":if(li(a)===0)break e;case"keydown":case"keyup":x=l0;break;case"focusin":B="focus",x=Lu;break;case"focusout":B="blur",x=Lu;break;case"beforeblur":case"afterblur":x=Lu;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":x=vo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":x=Xh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":x=u0;break;case Go:case Io:case ko:x=Kh;break;case qo:x=s0;break;case"scroll":case"scrollend":x=qh;break;case"wheel":x=r0;break;case"copy":case"cut":case"paste":x=$h;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":x=So;break;case"toggle":case"beforetoggle":x=d0}var J=(t&4)!==0,Re=!J&&(e==="scroll"||e==="scrollend"),S=J?O!==null?O+"Capture":null:O;J=[];for(var p=A,T;p!==null;){var D=p;if(T=D.stateNode,D=D.tag,D!==5&&D!==26&&D!==27||T===null||S===null||(D=Pl(p,S),D!=null&&J.push(_n(p,D,T))),Re)break;p=p.return}0<J.length&&(O=new x(O,B,null,a,C),L.push({event:O,listeners:J}))}}if((t&7)===0){e:{if(O=e==="mouseover"||e==="pointerover",x=e==="mouseout"||e==="pointerout",O&&a!==Au&&(B=a.relatedTarget||a.fromElement)&&(sl(B)||B[cl]))break e;if((x||O)&&(O=C.window===C?C:(O=C.ownerDocument)?O.defaultView||O.parentWindow:window,x?(B=a.relatedTarget||a.toElement,x=A,B=B?sl(B):null,B!==null&&(Re=b(B),J=B.tag,B!==Re||J!==5&&J!==27&&J!==6)&&(B=null)):(x=null,B=A),x!==B)){if(J=vo,D="onMouseLeave",S="onMouseEnter",p="mouse",(e==="pointerout"||e==="pointerover")&&(J=So,D="onPointerLeave",S="onPointerEnter",p="pointer"),Re=x==null?O:Wl(x),T=B==null?O:Wl(B),O=new J(D,p+"leave",x,a,C),O.target=Re,O.relatedTarget=T,D=null,sl(C)===A&&(J=new J(S,p+"enter",B,a,C),J.target=T,J.relatedTarget=Re,D=J),Re=D,x&&B)t:{for(J=fm,S=x,p=B,T=0,D=S;D;D=J(D))T++;D=0;for(var Z=p;Z;Z=J(Z))D++;for(;0<T-D;)S=J(S),T--;for(;0<D-T;)p=J(p),D--;for(;T--;){if(S===p||p!==null&&S===p.alternate){J=S;break t}S=J(S),p=J(p)}J=null}else J=null;x!==null&&hd(L,O,x,J,!1),B!==null&&Re!==null&&hd(L,Re,B,J,!0)}}e:{if(O=A?Wl(A):window,x=O.nodeName&&O.nodeName.toLowerCase(),x==="select"||x==="input"&&O.type==="file")var me=Do;else if(No(O))if(Lo)me=T0;else{me=E0;var I=v0}else x=O.nodeName,!x||x.toLowerCase()!=="input"||O.type!=="checkbox"&&O.type!=="radio"?A&&Tu(A.elementType)&&(me=Do):me=S0;if(me&&(me=me(e,A))){Co(L,me,a,C);break e}I&&I(e,O,A),e==="focusout"&&A&&O.type==="number"&&A.memoizedProps.value!=null&&Su(O,"number",O.value)}switch(I=A?Wl(A):window,e){case"focusin":(No(I)||I.contentEditable==="true")&&(yl=I,Hu=A,sn=null);break;case"focusout":sn=Hu=yl=null;break;case"mousedown":ju=!0;break;case"contextmenu":case"mouseup":case"dragend":ju=!1,Bo(L,a,C);break;case"selectionchange":if(R0)break;case"keydown":case"keyup":Bo(L,a,C)}var ne;if(Uu)e:{switch(e){case"compositionstart":var oe="onCompositionStart";break e;case"compositionend":oe="onCompositionEnd";break e;case"compositionupdate":oe="onCompositionUpdate";break e}oe=void 0}else pl?Oo(e,a)&&(oe="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(oe="onCompositionStart");oe&&(To&&a.locale!=="ko"&&(pl||oe!=="onCompositionStart"?oe==="onCompositionEnd"&&pl&&(ne=yo()):(da=C,Nu="value"in da?da.value:da.textContent,pl=!0)),I=Vi(A,oe),0<I.length&&(oe=new Eo(oe,e,null,a,C),L.push({event:oe,listeners:I}),ne?oe.data=ne:(ne=xo(a),ne!==null&&(oe.data=ne)))),(ne=m0?g0(e,a):p0(e,a))&&(oe=Vi(A,"onBeforeInput"),0<oe.length&&(I=new Eo("onBeforeInput","beforeinput",null,a,C),L.push({event:I,listeners:oe}),I.data=ne)),cm(L,e,A,a,C)}fd(L,t)})}function _n(e,t,a){return{instance:e,listener:t,currentTarget:a}}function Vi(e,t){for(var a=t+"Capture",l=[];e!==null;){var n=e,i=n.stateNode;if(n=n.tag,n!==5&&n!==26&&n!==27||i===null||(n=Pl(e,a),n!=null&&l.unshift(_n(e,n,i)),n=Pl(e,t),n!=null&&l.push(_n(e,n,i))),e.tag===3)return l;e=e.return}return[]}function fm(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function hd(e,t,a,l,n){for(var i=t._reactName,c=[];a!==null&&a!==l;){var o=a,m=o.alternate,A=o.stateNode;if(o=o.tag,m!==null&&m===l)break;o!==5&&o!==26&&o!==27||A===null||(m=A,n?(A=Pl(a,i),A!=null&&c.unshift(_n(a,A,m))):n||(A=Pl(a,i),A!=null&&c.push(_n(a,A,m)))),a=a.return}c.length!==0&&e.push({event:t,listeners:c})}var dm=/\r\n?/g,hm=/\u0000|\uFFFD/g;function md(e){return(typeof e=="string"?e:""+e).replace(dm,`
`).replace(hm,"")}function gd(e,t){return t=md(t),md(e)===t}function Ae(e,t,a,l,n,i){switch(a){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||hl(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&hl(e,""+l);break;case"className":Pn(e,"class",l);break;case"tabIndex":Pn(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Pn(e,a,l);break;case"style":mo(e,l,i);break;case"data":if(t!=="object"){Pn(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=ti(""+l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof i=="function"&&(a==="formAction"?(t!=="input"&&Ae(e,t,"name",n.name,n,null),Ae(e,t,"formEncType",n.formEncType,n,null),Ae(e,t,"formMethod",n.formMethod,n,null),Ae(e,t,"formTarget",n.formTarget,n,null)):(Ae(e,t,"encType",n.encType,n,null),Ae(e,t,"method",n.method,n,null),Ae(e,t,"target",n.target,n,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=ti(""+l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=Qt);break;case"onScroll":l!=null&&ce("scroll",e);break;case"onScrollEnd":l!=null&&ce("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(s(61));if(a=l.__html,a!=null){if(n.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=ti(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""+l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":ce("beforetoggle",e),ce("toggle",e),Wn(e,"popover",l);break;case"xlinkActuate":Xt(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Xt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Xt(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Xt(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Xt(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Xt(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Xt(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Xt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Xt(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Wn(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Ih.get(a)||a,Wn(e,a,l))}}function ss(e,t,a,l,n,i){switch(a){case"style":mo(e,l,i);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(s(61));if(a=l.__html,a!=null){if(n.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"children":typeof l=="string"?hl(e,l):(typeof l=="number"||typeof l=="bigint")&&hl(e,""+l);break;case"onScroll":l!=null&&ce("scroll",e);break;case"onScrollEnd":l!=null&&ce("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Qt);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!no.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(n=a.endsWith("Capture"),t=a.slice(2,n?a.length-7:void 0),i=e[it]||null,i=i!=null?i[a]:null,typeof i=="function"&&e.removeEventListener(t,i,n),typeof l=="function")){typeof i!="function"&&i!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,l,n);break e}a in e?e[a]=l:l===!0?e.setAttribute(a,""):Wn(e,a,l)}}}function et(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":ce("error",e),ce("load",e);var l=!1,n=!1,i;for(i in a)if(a.hasOwnProperty(i)){var c=a[i];if(c!=null)switch(i){case"src":l=!0;break;case"srcSet":n=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,t));default:Ae(e,t,i,c,a,null)}}n&&Ae(e,t,"srcSet",a.srcSet,a,null),l&&Ae(e,t,"src",a.src,a,null);return;case"input":ce("invalid",e);var o=i=c=n=null,m=null,A=null;for(l in a)if(a.hasOwnProperty(l)){var C=a[l];if(C!=null)switch(l){case"name":n=C;break;case"type":c=C;break;case"checked":m=C;break;case"defaultChecked":A=C;break;case"value":i=C;break;case"defaultValue":o=C;break;case"children":case"dangerouslySetInnerHTML":if(C!=null)throw Error(s(137,t));break;default:Ae(e,t,l,C,a,null)}}oo(e,i,o,m,A,c,n,!1);return;case"select":ce("invalid",e),l=c=i=null;for(n in a)if(a.hasOwnProperty(n)&&(o=a[n],o!=null))switch(n){case"value":i=o;break;case"defaultValue":c=o;break;case"multiple":l=o;default:Ae(e,t,n,o,a,null)}t=i,a=c,e.multiple=!!l,t!=null?dl(e,!!l,t,!1):a!=null&&dl(e,!!l,a,!0);return;case"textarea":ce("invalid",e),i=n=l=null;for(c in a)if(a.hasOwnProperty(c)&&(o=a[c],o!=null))switch(c){case"value":l=o;break;case"defaultValue":n=o;break;case"children":i=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(s(91));break;default:Ae(e,t,c,o,a,null)}fo(e,l,n,i);return;case"option":for(m in a)if(a.hasOwnProperty(m)&&(l=a[m],l!=null))switch(m){case"selected":e.selected=l&&typeof l!="function"&&typeof l!="symbol";break;default:Ae(e,t,m,l,a,null)}return;case"dialog":ce("beforetoggle",e),ce("toggle",e),ce("cancel",e),ce("close",e);break;case"iframe":case"object":ce("load",e);break;case"video":case"audio":for(l=0;l<Un.length;l++)ce(Un[l],e);break;case"image":ce("error",e),ce("load",e);break;case"details":ce("toggle",e);break;case"embed":case"source":case"link":ce("error",e),ce("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(A in a)if(a.hasOwnProperty(A)&&(l=a[A],l!=null))switch(A){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,t));default:Ae(e,t,A,l,a,null)}return;default:if(Tu(t)){for(C in a)a.hasOwnProperty(C)&&(l=a[C],l!==void 0&&ss(e,t,C,l,a,void 0));return}}for(o in a)a.hasOwnProperty(o)&&(l=a[o],l!=null&&Ae(e,t,o,l,a,null))}function mm(e,t,a,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var n=null,i=null,c=null,o=null,m=null,A=null,C=null;for(x in a){var L=a[x];if(a.hasOwnProperty(x)&&L!=null)switch(x){case"checked":break;case"value":break;case"defaultValue":m=L;default:l.hasOwnProperty(x)||Ae(e,t,x,null,l,L)}}for(var O in l){var x=l[O];if(L=a[O],l.hasOwnProperty(O)&&(x!=null||L!=null))switch(O){case"type":i=x;break;case"name":n=x;break;case"checked":A=x;break;case"defaultChecked":C=x;break;case"value":c=x;break;case"defaultValue":o=x;break;case"children":case"dangerouslySetInnerHTML":if(x!=null)throw Error(s(137,t));break;default:x!==L&&Ae(e,t,O,x,l,L)}}Eu(e,c,o,m,A,C,i,n);return;case"select":x=c=o=O=null;for(i in a)if(m=a[i],a.hasOwnProperty(i)&&m!=null)switch(i){case"value":break;case"multiple":x=m;default:l.hasOwnProperty(i)||Ae(e,t,i,null,l,m)}for(n in l)if(i=l[n],m=a[n],l.hasOwnProperty(n)&&(i!=null||m!=null))switch(n){case"value":O=i;break;case"defaultValue":o=i;break;case"multiple":c=i;default:i!==m&&Ae(e,t,n,i,l,m)}t=o,a=c,l=x,O!=null?dl(e,!!a,O,!1):!!l!=!!a&&(t!=null?dl(e,!!a,t,!0):dl(e,!!a,a?[]:"",!1));return;case"textarea":x=O=null;for(o in a)if(n=a[o],a.hasOwnProperty(o)&&n!=null&&!l.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:Ae(e,t,o,null,l,n)}for(c in l)if(n=l[c],i=a[c],l.hasOwnProperty(c)&&(n!=null||i!=null))switch(c){case"value":O=n;break;case"defaultValue":x=n;break;case"children":break;case"dangerouslySetInnerHTML":if(n!=null)throw Error(s(91));break;default:n!==i&&Ae(e,t,c,n,l,i)}ro(e,O,x);return;case"option":for(var B in a)if(O=a[B],a.hasOwnProperty(B)&&O!=null&&!l.hasOwnProperty(B))switch(B){case"selected":e.selected=!1;break;default:Ae(e,t,B,null,l,O)}for(m in l)if(O=l[m],x=a[m],l.hasOwnProperty(m)&&O!==x&&(O!=null||x!=null))switch(m){case"selected":e.selected=O&&typeof O!="function"&&typeof O!="symbol";break;default:Ae(e,t,m,O,l,x)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var J in a)O=a[J],a.hasOwnProperty(J)&&O!=null&&!l.hasOwnProperty(J)&&Ae(e,t,J,null,l,O);for(A in l)if(O=l[A],x=a[A],l.hasOwnProperty(A)&&O!==x&&(O!=null||x!=null))switch(A){case"children":case"dangerouslySetInnerHTML":if(O!=null)throw Error(s(137,t));break;default:Ae(e,t,A,O,l,x)}return;default:if(Tu(t)){for(var Re in a)O=a[Re],a.hasOwnProperty(Re)&&O!==void 0&&!l.hasOwnProperty(Re)&&ss(e,t,Re,void 0,l,O);for(C in l)O=l[C],x=a[C],!l.hasOwnProperty(C)||O===x||O===void 0&&x===void 0||ss(e,t,C,O,l,x);return}}for(var S in a)O=a[S],a.hasOwnProperty(S)&&O!=null&&!l.hasOwnProperty(S)&&Ae(e,t,S,null,l,O);for(L in l)O=l[L],x=a[L],!l.hasOwnProperty(L)||O===x||O==null&&x==null||Ae(e,t,L,O,l,x)}function pd(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function gm(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var n=a[l],i=n.transferSize,c=n.initiatorType,o=n.duration;if(i&&o&&pd(c)){for(c=0,o=n.responseEnd,l+=1;l<a.length;l++){var m=a[l],A=m.startTime;if(A>o)break;var C=m.transferSize,L=m.initiatorType;C&&pd(L)&&(m=m.responseEnd,c+=C*(m<o?1:(o-A)/(m-A)))}if(--l,t+=8*(i+c)/(n.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var os=null,rs=null;function $i(e){return e.nodeType===9?e:e.ownerDocument}function yd(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function bd(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function fs(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ds=null;function pm(){var e=window.event;return e&&e.type==="popstate"?e===ds?!1:(ds=e,!0):(ds=null,!1)}var vd=typeof setTimeout=="function"?setTimeout:void 0,ym=typeof clearTimeout=="function"?clearTimeout:void 0,Ed=typeof Promise=="function"?Promise:void 0,bm=typeof queueMicrotask=="function"?queueMicrotask:typeof Ed<"u"?function(e){return Ed.resolve(null).then(e).catch(vm)}:vd;function vm(e){setTimeout(function(){throw e})}function Da(e){return e==="head"}function Sd(e,t){var a=t,l=0;do{var n=a.nextSibling;if(e.removeChild(a),n&&n.nodeType===8)if(a=n.data,a==="/$"||a==="/&"){if(l===0){e.removeChild(n),Fl(t);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")wn(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,wn(a);for(var i=a.firstChild;i;){var c=i.nextSibling,o=i.nodeName;i[Jl]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&i.rel.toLowerCase()==="stylesheet"||a.removeChild(i),i=c}}else a==="body"&&wn(e.ownerDocument.body);a=n}while(a);Fl(t)}function Td(e,t){var a=e;e=0;do{var l=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=l}while(a)}function hs(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":hs(a),bu(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function Em(e,t,a,l){for(;e.nodeType===1;){var n=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Jl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(i=e.getAttribute("rel"),i==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(i!==n.rel||e.getAttribute("href")!==(n.href==null||n.href===""?null:n.href)||e.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin)||e.getAttribute("title")!==(n.title==null?null:n.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(i=e.getAttribute("src"),(i!==(n.src==null?null:n.src)||e.getAttribute("type")!==(n.type==null?null:n.type)||e.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin))&&i&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var i=n.name==null?null:""+n.name;if(n.type==="hidden"&&e.getAttribute("name")===i)return e}else return e;if(e=Lt(e.nextSibling),e===null)break}return null}function Sm(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Lt(e.nextSibling),e===null))return null;return e}function Ad(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Lt(e.nextSibling),e===null))return null;return e}function ms(e){return e.data==="$?"||e.data==="$~"}function gs(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Tm(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var l=function(){t(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Lt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var ps=null;function Rd(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return Lt(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function Od(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function xd(e,t,a){switch(t=$i(a),e){case"html":if(e=t.documentElement,!e)throw Error(s(452));return e;case"head":if(e=t.head,!e)throw Error(s(453));return e;case"body":if(e=t.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function wn(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);bu(e)}var Mt=new Map,Nd=new Set;function Ji(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var sa=H.d;H.d={f:Am,r:Rm,D:Om,C:xm,L:Nm,m:Cm,X:Lm,S:Dm,M:Mm};function Am(){var e=sa.f(),t=ki();return e||t}function Rm(e){var t=ol(e);t!==null&&t.tag===5&&t.type==="form"?qr(t):sa.r(e)}var Il=typeof document>"u"?null:document;function Cd(e,t,a){var l=Il;if(l&&typeof t=="string"&&t){var n=At(t);n='link[rel="'+e+'"][href="'+n+'"]',typeof a=="string"&&(n+='[crossorigin="'+a+'"]'),Nd.has(n)||(Nd.add(n),e={rel:e,crossOrigin:a,href:t},l.querySelector(n)===null&&(t=l.createElement("link"),et(t,"link",e),Ze(t),l.head.appendChild(t)))}}function Om(e){sa.D(e),Cd("dns-prefetch",e,null)}function xm(e,t){sa.C(e,t),Cd("preconnect",e,t)}function Nm(e,t,a){sa.L(e,t,a);var l=Il;if(l&&e&&t){var n='link[rel="preload"][as="'+At(t)+'"]';t==="image"&&a&&a.imageSrcSet?(n+='[imagesrcset="'+At(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(n+='[imagesizes="'+At(a.imageSizes)+'"]')):n+='[href="'+At(e)+'"]';var i=n;switch(t){case"style":i=kl(e);break;case"script":i=ql(e)}Mt.has(i)||(e=U({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),Mt.set(i,e),l.querySelector(n)!==null||t==="style"&&l.querySelector(zn(i))||t==="script"&&l.querySelector(Hn(i))||(t=l.createElement("link"),et(t,"link",e),Ze(t),l.head.appendChild(t)))}}function Cm(e,t){sa.m(e,t);var a=Il;if(a&&e){var l=t&&typeof t.as=="string"?t.as:"script",n='link[rel="modulepreload"][as="'+At(l)+'"][href="'+At(e)+'"]',i=n;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":i=ql(e)}if(!Mt.has(i)&&(e=U({rel:"modulepreload",href:e},t),Mt.set(i,e),a.querySelector(n)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Hn(i)))return}l=a.createElement("link"),et(l,"link",e),Ze(l),a.head.appendChild(l)}}}function Dm(e,t,a){sa.S(e,t,a);var l=Il;if(l&&e){var n=rl(l).hoistableStyles,i=kl(e);t=t||"default";var c=n.get(i);if(!c){var o={loading:0,preload:null};if(c=l.querySelector(zn(i)))o.loading=5;else{e=U({rel:"stylesheet",href:e,"data-precedence":t},a),(a=Mt.get(i))&&ys(e,a);var m=c=l.createElement("link");Ze(m),et(m,"link",e),m._p=new Promise(function(A,C){m.onload=A,m.onerror=C}),m.addEventListener("load",function(){o.loading|=1}),m.addEventListener("error",function(){o.loading|=2}),o.loading|=4,Wi(c,t,l)}c={type:"stylesheet",instance:c,count:1,state:o},n.set(i,c)}}}function Lm(e,t){sa.X(e,t);var a=Il;if(a&&e){var l=rl(a).hoistableScripts,n=ql(e),i=l.get(n);i||(i=a.querySelector(Hn(n)),i||(e=U({src:e,async:!0},t),(t=Mt.get(n))&&bs(e,t),i=a.createElement("script"),Ze(i),et(i,"link",e),a.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function Mm(e,t){sa.M(e,t);var a=Il;if(a&&e){var l=rl(a).hoistableScripts,n=ql(e),i=l.get(n);i||(i=a.querySelector(Hn(n)),i||(e=U({src:e,async:!0,type:"module"},t),(t=Mt.get(n))&&bs(e,t),i=a.createElement("script"),Ze(i),et(i,"link",e),a.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function Dd(e,t,a,l){var n=(n=ie.current)?Ji(n):null;if(!n)throw Error(s(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=kl(a.href),a=rl(n).hoistableStyles,l=a.get(t),l||(l={type:"style",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=kl(a.href);var i=rl(n).hoistableStyles,c=i.get(e);if(c||(n=n.ownerDocument||n,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},i.set(e,c),(i=n.querySelector(zn(e)))&&!i._p&&(c.instance=i,c.state.loading=5),Mt.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Mt.set(e,a),i||Um(n,e,a,c.state))),t&&l===null)throw Error(s(528,""));return c}if(t&&l!==null)throw Error(s(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=ql(a),a=rl(n).hoistableScripts,l=a.get(t),l||(l={type:"script",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,e))}}function kl(e){return'href="'+At(e)+'"'}function zn(e){return'link[rel="stylesheet"]['+e+"]"}function Ld(e){return U({},e,{"data-precedence":e.precedence,precedence:null})}function Um(e,t,a,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),et(t,"link",a),Ze(t),e.head.appendChild(t))}function ql(e){return'[src="'+At(e)+'"]'}function Hn(e){return"script[async]"+e}function Md(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+At(a.href)+'"]');if(l)return t.instance=l,Ze(l),l;var n=U({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Ze(l),et(l,"style",n),Wi(l,a.precedence,e),t.instance=l;case"stylesheet":n=kl(a.href);var i=e.querySelector(zn(n));if(i)return t.state.loading|=4,t.instance=i,Ze(i),i;l=Ld(a),(n=Mt.get(n))&&ys(l,n),i=(e.ownerDocument||e).createElement("link"),Ze(i);var c=i;return c._p=new Promise(function(o,m){c.onload=o,c.onerror=m}),et(i,"link",l),t.state.loading|=4,Wi(i,a.precedence,e),t.instance=i;case"script":return i=ql(a.src),(n=e.querySelector(Hn(i)))?(t.instance=n,Ze(n),n):(l=a,(n=Mt.get(i))&&(l=U({},a),bs(l,n)),e=e.ownerDocument||e,n=e.createElement("script"),Ze(n),et(n,"link",l),e.head.appendChild(n),t.instance=n);case"void":return null;default:throw Error(s(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Wi(l,a.precedence,e));return t.instance}function Wi(e,t,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),n=l.length?l[l.length-1]:null,i=n,c=0;c<l.length;c++){var o=l[c];if(o.dataset.precedence===t)i=o;else if(i!==n)break}i?i.parentNode.insertBefore(e,i.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function ys(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function bs(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Pi=null;function Ud(e,t,a){if(Pi===null){var l=new Map,n=Pi=new Map;n.set(a,l)}else n=Pi,l=n.get(a),l||(l=new Map,n.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),n=0;n<a.length;n++){var i=a[n];if(!(i[Jl]||i[$e]||e==="link"&&i.getAttribute("rel")==="stylesheet")&&i.namespaceURI!=="http://www.w3.org/2000/svg"){var c=i.getAttribute(t)||"";c=e+c;var o=l.get(c);o?o.push(i):l.set(c,[i])}}return l}function _d(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function _m(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function wd(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function wm(e,t,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var n=kl(l.href),i=t.querySelector(zn(n));if(i){t=i._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=eu.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=i,Ze(i);return}i=t.ownerDocument||t,l=Ld(l),(n=Mt.get(n))&&ys(l,n),i=i.createElement("link"),Ze(i);var c=i;c._p=new Promise(function(o,m){c.onload=o,c.onerror=m}),et(i,"link",l),a.instance=i}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=eu.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var vs=0;function zm(e,t){return e.stylesheets&&e.count===0&&au(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var l=setTimeout(function(){if(e.stylesheets&&au(e,e.stylesheets),e.unsuspend){var i=e.unsuspend;e.unsuspend=null,i()}},6e4+t);0<e.imgBytes&&vs===0&&(vs=62500*gm());var n=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&au(e,e.stylesheets),e.unsuspend)){var i=e.unsuspend;e.unsuspend=null,i()}},(e.imgBytes>vs?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(n)}}:null}function eu(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)au(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var tu=null;function au(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,tu=new Map,t.forEach(Hm,e),tu=null,eu.call(e))}function Hm(e,t){if(!(t.state.loading&4)){var a=tu.get(e);if(a)var l=a.get(null);else{a=new Map,tu.set(e,a);for(var n=e.querySelectorAll("link[data-precedence],style[data-precedence]"),i=0;i<n.length;i++){var c=n[i];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(a.set(c.dataset.precedence,c),l=c)}l&&a.set(null,l)}n=t.instance,c=n.getAttribute("data-precedence"),i=a.get(c)||l,i===l&&a.set(null,n),a.set(c,n),this.count++,l=eu.bind(this),n.addEventListener("load",l),n.addEventListener("error",l),i?i.parentNode.insertBefore(n,i.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(n,e.firstChild)),t.state.loading|=4}}var jn={$$typeof:W,Provider:null,Consumer:null,_currentValue:X,_currentValue2:X,_threadCount:0};function jm(e,t,a,l,n,i,c,o,m){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=mu(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=mu(0),this.hiddenUpdates=mu(null),this.identifierPrefix=l,this.onUncaughtError=n,this.onCaughtError=i,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=m,this.incompleteTransitions=new Map}function zd(e,t,a,l,n,i,c,o,m,A,C,L){return e=new jm(e,t,a,c,m,A,C,L,o),t=1,i===!0&&(t|=24),i=gt(3,null,null,t),e.current=i,i.stateNode=e,t=Wu(),t.refCount++,e.pooledCache=t,t.refCount++,i.memoizedState={element:l,isDehydrated:a,cache:t},ac(i),e}function Hd(e){return e?(e=El,e):El}function jd(e,t,a,l,n,i){n=Hd(n),l.context===null?l.context=n:l.pendingContext=n,l=ba(t),l.payload={element:a},i=i===void 0?null:i,i!==null&&(l.callback=i),a=va(e,l,t),a!==null&&(ft(a,e,t),gn(a,e,t))}function Bd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function Es(e,t){Bd(e,t),(e=e.alternate)&&Bd(e,t)}function Yd(e){if(e.tag===13||e.tag===31){var t=Ia(e,67108864);t!==null&&ft(t,e,67108864),Es(e,67108864)}}function Gd(e){if(e.tag===13||e.tag===31){var t=Et();t=gu(t);var a=Ia(e,t);a!==null&&ft(a,e,t),Es(e,t)}}var lu=!0;function Bm(e,t,a,l){var n=N.T;N.T=null;var i=H.p;try{H.p=2,Ss(e,t,a,l)}finally{H.p=i,N.T=n}}function Ym(e,t,a,l){var n=N.T;N.T=null;var i=H.p;try{H.p=8,Ss(e,t,a,l)}finally{H.p=i,N.T=n}}function Ss(e,t,a,l){if(lu){var n=Ts(l);if(n===null)cs(e,t,l,nu,a),kd(e,l);else if(Im(n,e,t,a,l))l.stopPropagation();else if(kd(e,l),t&4&&-1<Gm.indexOf(e)){for(;n!==null;){var i=ol(n);if(i!==null)switch(i.tag){case 3:if(i=i.stateNode,i.current.memoizedState.isDehydrated){var c=Ha(i.pendingLanes);if(c!==0){var o=i;for(o.pendingLanes|=2,o.entangledLanes|=2;c;){var m=1<<31-ht(c);o.entanglements[1]|=m,c&=~m}kt(i),(ye&6)===0&&(Gi=lt()+500,Mn(0))}}break;case 31:case 13:o=Ia(i,2),o!==null&&ft(o,i,2),ki(),Es(i,2)}if(i=Ts(l),i===null&&cs(e,t,l,nu,a),i===n)break;n=i}n!==null&&l.stopPropagation()}else cs(e,t,l,null,a)}}function Ts(e){return e=Ru(e),As(e)}var nu=null;function As(e){if(nu=null,e=sl(e),e!==null){var t=b(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=E(t),e!==null)return e;e=null}else if(a===31){if(e=R(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return nu=e,null}function Id(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(w()){case we:return 2;case Bt:return 8;case Zn:case xh:return 32;case Vs:return 268435456;default:return 32}default:return 32}}var Rs=!1,La=null,Ma=null,Ua=null,Bn=new Map,Yn=new Map,_a=[],Gm="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function kd(e,t){switch(e){case"focusin":case"focusout":La=null;break;case"dragenter":case"dragleave":Ma=null;break;case"mouseover":case"mouseout":Ua=null;break;case"pointerover":case"pointerout":Bn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Yn.delete(t.pointerId)}}function Gn(e,t,a,l,n,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:a,eventSystemFlags:l,nativeEvent:i,targetContainers:[n]},t!==null&&(t=ol(t),t!==null&&Yd(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,n!==null&&t.indexOf(n)===-1&&t.push(n),e)}function Im(e,t,a,l,n){switch(t){case"focusin":return La=Gn(La,e,t,a,l,n),!0;case"dragenter":return Ma=Gn(Ma,e,t,a,l,n),!0;case"mouseover":return Ua=Gn(Ua,e,t,a,l,n),!0;case"pointerover":var i=n.pointerId;return Bn.set(i,Gn(Bn.get(i)||null,e,t,a,l,n)),!0;case"gotpointercapture":return i=n.pointerId,Yn.set(i,Gn(Yn.get(i)||null,e,t,a,l,n)),!0}return!1}function qd(e){var t=sl(e.target);if(t!==null){var a=b(t);if(a!==null){if(t=a.tag,t===13){if(t=E(a),t!==null){e.blockedOn=t,to(e.priority,function(){Gd(a)});return}}else if(t===31){if(t=R(a),t!==null){e.blockedOn=t,to(e.priority,function(){Gd(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function iu(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=Ts(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);Au=l,a.target.dispatchEvent(l),Au=null}else return t=ol(a),t!==null&&Yd(t),e.blockedOn=a,!1;t.shift()}return!0}function Fd(e,t,a){iu(e)&&a.delete(t)}function km(){Rs=!1,La!==null&&iu(La)&&(La=null),Ma!==null&&iu(Ma)&&(Ma=null),Ua!==null&&iu(Ua)&&(Ua=null),Bn.forEach(Fd),Yn.forEach(Fd)}function uu(e,t){e.blockedOn===t&&(e.blockedOn=null,Rs||(Rs=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,km)))}var cu=null;function Xd(e){cu!==e&&(cu=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){cu===e&&(cu=null);for(var t=0;t<e.length;t+=3){var a=e[t],l=e[t+1],n=e[t+2];if(typeof l!="function"){if(As(l||a)===null)continue;break}var i=ol(a);i!==null&&(e.splice(t,3),t-=3,Tc(i,{pending:!0,data:n,method:a.method,action:l},l,n))}}))}function Fl(e){function t(m){return uu(m,e)}La!==null&&uu(La,e),Ma!==null&&uu(Ma,e),Ua!==null&&uu(Ua,e),Bn.forEach(t),Yn.forEach(t);for(var a=0;a<_a.length;a++){var l=_a[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<_a.length&&(a=_a[0],a.blockedOn===null);)qd(a),a.blockedOn===null&&_a.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var n=a[l],i=a[l+1],c=n[it]||null;if(typeof i=="function")c||Xd(a);else if(c){var o=null;if(i&&i.hasAttribute("formAction")){if(n=i,c=i[it]||null)o=c.formAction;else if(As(n)!==null)continue}else o=c.action;typeof o=="function"?a[l+1]=o:(a.splice(l,3),l-=3),Xd(a)}}}function Qd(){function e(i){i.canIntercept&&i.info==="react-transition"&&i.intercept({handler:function(){return new Promise(function(c){return n=c})},focusReset:"manual",scroll:"manual"})}function t(){n!==null&&(n(),n=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var i=navigation.currentEntry;i&&i.url!=null&&navigation.navigate(i.url,{state:i.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,n=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),n!==null&&(n(),n=null)}}}function Os(e){this._internalRoot=e}su.prototype.render=Os.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(s(409));var a=t.current,l=Et();jd(a,l,e,t,null,null)},su.prototype.unmount=Os.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;jd(e.current,2,null,e,null,null),ki(),t[cl]=null}};function su(e){this._internalRoot=e}su.prototype.unstable_scheduleHydration=function(e){if(e){var t=eo();e={blockedOn:null,target:e,priority:t};for(var a=0;a<_a.length&&t!==0&&t<_a[a].priority;a++);_a.splice(a,0,e),a===0&&qd(e)}};var Zd=d.version;if(Zd!=="19.2.4")throw Error(s(527,Zd,"19.2.4"));H.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=g(t),e=e!==null?_(e):null,e=e===null?null:e.stateNode,e};var qm={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ou=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ou.isDisabled&&ou.supportsFiber)try{Kl=ou.inject(qm),dt=ou}catch{}}return kn.createRoot=function(e,t){if(!h(e))throw Error(s(299));var a=!1,l="",n=Pr,i=ef,c=tf;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(n=t.onUncaughtError),t.onCaughtError!==void 0&&(i=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=zd(e,1,!1,null,null,a,l,null,n,i,c,Qd),e[cl]=t.current,us(e),new Os(t)},kn.hydrateRoot=function(e,t,a){if(!h(e))throw Error(s(299));var l=!1,n="",i=Pr,c=ef,o=tf,m=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(n=a.identifierPrefix),a.onUncaughtError!==void 0&&(i=a.onUncaughtError),a.onCaughtError!==void 0&&(c=a.onCaughtError),a.onRecoverableError!==void 0&&(o=a.onRecoverableError),a.formState!==void 0&&(m=a.formState)),t=zd(e,1,!0,t,a??null,l,n,m,i,c,o,Qd),t.context=Hd(null),a=t.current,l=Et(),l=gu(l),n=ba(l),n.callback=null,va(a,n,l),a=l,t.current.lanes=a,$l(t,a),kt(t),e[cl]=t.current,us(e),new su(t)},kn.version="19.2.4",kn}var lh;function Pm(){if(lh)return Cs.exports;lh=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(d){console.error(d)}}return r(),Cs.exports=Wm(),Cs.exports}var eg=Pm();const tg=Zs(eg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ag=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),lg=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(d,u,s)=>s?s.toUpperCase():u.toLowerCase()),nh=r=>{const d=lg(r);return d.charAt(0).toUpperCase()+d.slice(1)},Ah=(...r)=>r.filter((d,u,s)=>!!d&&d.trim()!==""&&s.indexOf(d)===u).join(" ").trim(),ng=r=>{for(const d in r)if(d.startsWith("aria-")||d==="role"||d==="title")return!0};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ig={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=q.forwardRef(({color:r="currentColor",size:d=24,strokeWidth:u=2,absoluteStrokeWidth:s,className:h="",children:b,iconNode:E,...R},v)=>q.createElement("svg",{ref:v,...ig,width:d,height:d,stroke:r,strokeWidth:s?Number(u)*24/Number(d):u,className:Ah("lucide",h),...!b&&!ng(R)&&{"aria-hidden":"true"},...R},[...E.map(([g,_])=>q.createElement(g,_)),...Array.isArray(b)?b:[b]]));/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=(r,d)=>{const u=q.forwardRef(({className:s,...h},b)=>q.createElement(ug,{ref:b,iconNode:d,className:Ah(`lucide-${ag(nh(r))}`,`lucide-${r}`,s),...h}));return u.displayName=nh(r),u};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],ih=_e("camera",cg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sg=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],og=_e("check",sg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rg=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],fg=_e("download",rg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dg=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],hg=_e("external-link",dg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=[["line",{x1:"22",x2:"2",y1:"6",y2:"6",key:"15w7dq"}],["line",{x1:"22",x2:"2",y1:"18",y2:"18",key:"1ip48p"}],["line",{x1:"6",x2:"6",y1:"2",y2:"22",key:"a2lnyx"}],["line",{x1:"18",x2:"18",y1:"2",y2:"22",key:"8vb6jd"}]],gg=_e("frame",mg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],uh=_e("image",pg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]],bg=_e("key",yg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Eg=_e("loader-circle",vg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sg=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]],Tg=_e("palette",Sg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ag=[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]],Gs=_e("scissors",Ag);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rg=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Og=_e("shield-check",Rg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=[["path",{d:"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",key:"1wgbhj"}]],Ng=_e("shirt",xg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cg=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],za=_e("sparkles",Cg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dg=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],Lg=_e("star",Dg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mg=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],Ug=_e("trending-up",Mg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _g=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],wg=_e("upload",_g);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zg=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],ch=_e("user",zg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hg=[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]],sh=_e("wand-sparkles",Hg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jg=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Is=_e("x",jg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bg=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],oh=_e("zap",Bg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yg=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]],rh=_e("zoom-in",Yg);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gg=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]],Ig=_e("zoom-out",Gg),kg=({onKeySelected:r})=>{const[d,u]=q.useState(!0),s=async()=>{{console.log("✅ 检测到API密钥配置"),r(),u(!1);return}};q.useEffect(()=>{s()},[]);const h=async()=>{const b=window.aistudio;b&&b.openSelectKey?(await b.openSelectKey(),r()):alert("未检测到 AI Studio 环境。请确保您在正确的环境中运行此应用。")};return d?null:f.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",children:f.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden",children:[f.jsxs("div",{className:"bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center",children:[f.jsx("div",{className:"bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md",children:f.jsx(bg,{className:"w-8 h-8 text-white"})}),f.jsx("h2",{className:"text-2xl font-bold",children:"需要 API 访问权限"}),f.jsx("p",{className:"text-purple-100 mt-2 text-sm",children:"要使用 Gemini 3 Pro 生成高质量 2K 图像，需要付费项目的 API 密钥。"})]}),f.jsxs("div",{className:"p-8 space-y-6",children:[f.jsxs("div",{className:"space-y-4",children:[f.jsxs("button",{onClick:h,className:"w-full group relative flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg",children:[f.jsx("span",{children:"连接 Google Cloud 项目"}),f.jsx(Og,{className:"w-5 h-5 text-green-400"})]}),f.jsxs("a",{href:"https://ai.google.dev/gemini-api/docs/billing",target:"_blank",rel:"noopener noreferrer",className:"flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-purple-600 transition-colors",children:[f.jsx("span",{children:"了解账单和使用情况"}),f.jsx(hg,{className:"w-3 h-3"})]})]}),f.jsxs("div",{className:"text-xs text-center text-gray-400 px-4 leading-relaxed",children:["您的密钥仅在此会话中安全使用。我们专门使用",f.jsx("span",{className:"font-mono text-gray-600 bg-gray-100 px-1 rounded mx-1",children:"gemini-3-pro-image-preview"}),"模型来获得专业效果。"]})]})]})})};var ks=function(r,d){return ks=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(u,s){u.__proto__=s}||function(u,s){for(var h in s)Object.prototype.hasOwnProperty.call(s,h)&&(u[h]=s[h])},ks(r,d)};function qg(r,d){if(typeof d!="function"&&d!==null)throw new TypeError("Class extends value "+String(d)+" is not a constructor or null");ks(r,d);function u(){this.constructor=r}r.prototype=d===null?Object.create(d):(u.prototype=d.prototype,new u)}var Ve=function(){return Ve=Object.assign||function(d){for(var u,s=1,h=arguments.length;s<h;s++){u=arguments[s];for(var b in u)Object.prototype.hasOwnProperty.call(u,b)&&(d[b]=u[b])}return d},Ve.apply(this,arguments)};var Us,fh;function Fg(){if(fh)return Us;fh=1;var r=!1,d,u,s,h,b,E,R,v,g,_,U,z,F,k,$;function G(){if(!r){r=!0;var K=navigator.userAgent,W=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(K),fe=/(Mac OS X)|(Windows)|(Linux)/.exec(K);if(z=/\b(iPhone|iP[ao]d)/.exec(K),F=/\b(iP[ao]d)/.exec(K),_=/Android/i.exec(K),k=/FBAN\/\w+;/i.exec(K),$=/Mobile/i.exec(K),U=!!/Win64/.exec(K),W){d=W[1]?parseFloat(W[1]):W[5]?parseFloat(W[5]):NaN,d&&document&&document.documentMode&&(d=document.documentMode);var Q=/(?:Trident\/(\d+.\d+))/.exec(K);E=Q?parseFloat(Q[1])+4:d,u=W[2]?parseFloat(W[2]):NaN,s=W[3]?parseFloat(W[3]):NaN,h=W[4]?parseFloat(W[4]):NaN,h?(W=/(?:Chrome\/(\d+\.\d+))/.exec(K),b=W&&W[1]?parseFloat(W[1]):NaN):b=NaN}else d=u=s=b=h=NaN;if(fe){if(fe[1]){var ee=/(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(K);R=ee?parseFloat(ee[1].replace("_",".")):!0}else R=!1;v=!!fe[2],g=!!fe[3]}else R=v=g=!1}}var V={ie:function(){return G()||d},ieCompatibilityMode:function(){return G()||E>d},ie64:function(){return V.ie()&&U},firefox:function(){return G()||u},opera:function(){return G()||s},webkit:function(){return G()||h},safari:function(){return V.webkit()},chrome:function(){return G()||b},windows:function(){return G()||v},osx:function(){return G()||R},linux:function(){return G()||g},iphone:function(){return G()||z},mobile:function(){return G()||z||F||_||$},nativeApp:function(){return G()||k},android:function(){return G()||_},ipad:function(){return G()||F}};return Us=V,Us}var _s,dh;function Xg(){if(dh)return _s;dh=1;var r=!!(typeof window<"u"&&window.document&&window.document.createElement),d={canUseDOM:r,canUseWorkers:typeof Worker<"u",canUseEventListeners:r&&!!(window.addEventListener||window.attachEvent),canUseViewport:r&&!!window.screen,isInWorker:!r};return _s=d,_s}var ws,hh;function Qg(){if(hh)return ws;hh=1;var r=Xg(),d;r.canUseDOM&&(d=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0);/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */function u(s,h){if(!r.canUseDOM||h&&!("addEventListener"in document))return!1;var b="on"+s,E=b in document;if(!E){var R=document.createElement("div");R.setAttribute(b,"return;"),E=typeof R[b]=="function"}return!E&&d&&s==="wheel"&&(E=document.implementation.hasFeature("Events.wheel","3.0")),E}return ws=u,ws}var zs,mh;function Zg(){if(mh)return zs;mh=1;var r=Fg(),d=Qg(),u=10,s=40,h=800;function b(E){var R=0,v=0,g=0,_=0;return"detail"in E&&(v=E.detail),"wheelDelta"in E&&(v=-E.wheelDelta/120),"wheelDeltaY"in E&&(v=-E.wheelDeltaY/120),"wheelDeltaX"in E&&(R=-E.wheelDeltaX/120),"axis"in E&&E.axis===E.HORIZONTAL_AXIS&&(R=v,v=0),g=R*u,_=v*u,"deltaY"in E&&(_=E.deltaY),"deltaX"in E&&(g=E.deltaX),(g||_)&&E.deltaMode&&(E.deltaMode==1?(g*=s,_*=s):(g*=h,_*=h)),g&&!R&&(R=g<1?-1:1),_&&!v&&(v=_<1?-1:1),{spinX:R,spinY:v,pixelX:g,pixelY:_}}return b.getEventType=function(){return r.firefox()?"DOMMouseScroll":d("wheel")?"wheel":"mousewheel"},zs=b,zs}var Hs,gh;function Kg(){return gh||(gh=1,Hs=Zg()),Hs}var Vg=Kg();const $g=Zs(Vg);function Jg(r,d,u,s,h,b){b===void 0&&(b=0);var E=Ql(r,d,b),R=E.width,v=E.height,g=Math.min(R,u),_=Math.min(v,s);return g>_*h?{width:_*h,height:_}:{width:g,height:g/h}}function Wg(r){return r.width>r.height?r.width/r.naturalWidth:r.height/r.naturalHeight}function qn(r,d,u,s,h){h===void 0&&(h=0);var b=Ql(d.width,d.height,h),E=b.width,R=b.height;return{x:ph(r.x,E,u.width,s),y:ph(r.y,R,u.height,s)}}function ph(r,d,u,s){var h=d*s/2-u/2;return hu(r,-h,h)}function yh(r,d){return Math.sqrt(Math.pow(r.y-d.y,2)+Math.pow(r.x-d.x,2))}function bh(r,d){return Math.atan2(d.y-r.y,d.x-r.x)*180/Math.PI}function Pg(r,d,u,s,h,b,E){b===void 0&&(b=0),E===void 0&&(E=!0);var R=E?ep:tp,v=Ql(d.width,d.height,b),g=Ql(d.naturalWidth,d.naturalHeight,b),_={x:R(100,((v.width-u.width/h)/2-r.x/h)/v.width*100),y:R(100,((v.height-u.height/h)/2-r.y/h)/v.height*100),width:R(100,u.width/v.width*100/h),height:R(100,u.height/v.height*100/h)},U=Math.round(R(g.width,_.width*g.width/100)),z=Math.round(R(g.height,_.height*g.height/100)),F=g.width>=g.height*s,k=F?{width:Math.round(z*s),height:z}:{width:U,height:Math.round(U/s)},$=Ve(Ve({},k),{x:Math.round(R(g.width-k.width,_.x*g.width/100)),y:Math.round(R(g.height-k.height,_.y*g.height/100))});return{croppedAreaPercentages:_,croppedAreaPixels:$}}function ep(r,d){return Math.min(r,Math.max(0,d))}function tp(r,d){return d}function ap(r,d,u,s,h,b){var E=Ql(d.width,d.height,u),R=hu(s.width/E.width*(100/r.width),h,b),v={x:R*E.width/2-s.width/2-E.width*R*(r.x/100),y:R*E.height/2-s.height/2-E.height*R*(r.y/100)};return{crop:v,zoom:R}}function lp(r,d,u){var s=Wg(d);return u.height>u.width?u.height/(r.height*s):u.width/(r.width*s)}function np(r,d,u,s,h,b){u===void 0&&(u=0);var E=Ql(d.naturalWidth,d.naturalHeight,u),R=hu(lp(r,d,s),h,b),v=s.height>s.width?s.height/r.height:s.width/r.width,g={x:((E.width-r.width)/2-r.x)*v,y:((E.height-r.height)/2-r.y)*v};return{crop:g,zoom:R}}function vh(r,d){return{x:(d.x+r.x)/2,y:(d.y+r.y)/2}}function ip(r){return r*Math.PI/180}function Ql(r,d,u){var s=ip(u);return{width:Math.abs(Math.cos(s)*r)+Math.abs(Math.sin(s)*d),height:Math.abs(Math.sin(s)*r)+Math.abs(Math.cos(s)*d)}}function hu(r,d,u){return Math.min(Math.max(r,d),u)}function ru(){for(var r=[],d=0;d<arguments.length;d++)r[d]=arguments[d];return r.filter(function(u){return typeof u=="string"&&u.length>0}).join(" ").trim()}var up=`.reactEasyCrop_Container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  cursor: move;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reactEasyCrop_Image,
.reactEasyCrop_Video {
  will-change: transform; /* this improves performances and prevent painting issues on iOS Chrome */
}

.reactEasyCrop_Contain {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.reactEasyCrop_Cover_Horizontal {
  width: 100%;
  height: auto;
}
.reactEasyCrop_Cover_Vertical {
  width: auto;
  height: 100%;
}

.reactEasyCrop_CropArea {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  box-shadow: 0 0 0 9999em;
  color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.reactEasyCrop_CropAreaRound {
  border-radius: 50%;
}

.reactEasyCrop_CropAreaGrid::before {
  content: ' ';
  box-sizing: border-box;
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.5);
  top: 0;
  bottom: 0;
  left: 33.33%;
  right: 33.33%;
  border-top: 0;
  border-bottom: 0;
}

.reactEasyCrop_CropAreaGrid::after {
  content: ' ';
  box-sizing: border-box;
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.5);
  top: 33.33%;
  bottom: 33.33%;
  left: 0;
  right: 0;
  border-left: 0;
  border-right: 0;
}
`,cp=1,sp=3,op=1,rp=(function(r){qg(d,r);function d(){var u=r!==null&&r.apply(this,arguments)||this;return u.cropperRef=q.createRef(),u.imageRef=q.createRef(),u.videoRef=q.createRef(),u.containerPosition={x:0,y:0},u.containerRef=null,u.styleRef=null,u.containerRect=null,u.mediaSize={width:0,height:0,naturalWidth:0,naturalHeight:0},u.dragStartPosition={x:0,y:0},u.dragStartCrop={x:0,y:0},u.gestureZoomStart=0,u.gestureRotationStart=0,u.isTouching=!1,u.lastPinchDistance=0,u.lastPinchRotation=0,u.rafDragTimeout=null,u.rafPinchTimeout=null,u.wheelTimer=null,u.currentDoc=typeof document<"u"?document:null,u.currentWindow=typeof window<"u"?window:null,u.resizeObserver=null,u.previousCropSize=null,u.isInitialized=!1,u.state={cropSize:null,hasWheelJustStarted:!1,mediaObjectFit:void 0},u.initResizeObserver=function(){if(!(typeof window.ResizeObserver>"u"||!u.containerRef)){var s=!0;u.resizeObserver=new window.ResizeObserver(function(h){if(s){s=!1;return}u.computeSizes()}),u.resizeObserver.observe(u.containerRef)}},u.preventZoomSafari=function(s){return s.preventDefault()},u.cleanEvents=function(){u.currentDoc&&(u.currentDoc.removeEventListener("mousemove",u.onMouseMove),u.currentDoc.removeEventListener("mouseup",u.onDragStopped),u.currentDoc.removeEventListener("touchmove",u.onTouchMove),u.currentDoc.removeEventListener("touchend",u.onDragStopped),u.currentDoc.removeEventListener("gesturechange",u.onGestureChange),u.currentDoc.removeEventListener("gestureend",u.onGestureEnd),u.currentDoc.removeEventListener("scroll",u.onScroll))},u.clearScrollEvent=function(){u.containerRef&&u.containerRef.removeEventListener("wheel",u.onWheel),u.wheelTimer&&clearTimeout(u.wheelTimer)},u.onMediaLoad=function(){var s=u.computeSizes();s&&(u.previousCropSize=s,u.emitCropData(),u.setInitialCrop(s),u.isInitialized=!0),u.props.onMediaLoaded&&u.props.onMediaLoaded(u.mediaSize)},u.setInitialCrop=function(s){if(u.props.initialCroppedAreaPercentages){var h=ap(u.props.initialCroppedAreaPercentages,u.mediaSize,u.props.rotation,s,u.props.minZoom,u.props.maxZoom),b=h.crop,E=h.zoom;u.props.onCropChange(b),u.props.onZoomChange&&u.props.onZoomChange(E)}else if(u.props.initialCroppedAreaPixels){var R=np(u.props.initialCroppedAreaPixels,u.mediaSize,u.props.rotation,s,u.props.minZoom,u.props.maxZoom),b=R.crop,E=R.zoom;u.props.onCropChange(b),u.props.onZoomChange&&u.props.onZoomChange(E)}},u.computeSizes=function(){var s,h,b,E,R,v,g=u.imageRef.current||u.videoRef.current;if(g&&u.containerRef){u.containerRect=u.containerRef.getBoundingClientRect(),u.saveContainerPosition();var _=u.containerRect.width/u.containerRect.height,U=((s=u.imageRef.current)===null||s===void 0?void 0:s.naturalWidth)||((h=u.videoRef.current)===null||h===void 0?void 0:h.videoWidth)||0,z=((b=u.imageRef.current)===null||b===void 0?void 0:b.naturalHeight)||((E=u.videoRef.current)===null||E===void 0?void 0:E.videoHeight)||0,F=g.offsetWidth<U||g.offsetHeight<z,k=U/z,$=void 0;if(F)switch(u.state.mediaObjectFit){default:case"contain":$=_>k?{width:u.containerRect.height*k,height:u.containerRect.height}:{width:u.containerRect.width,height:u.containerRect.width/k};break;case"horizontal-cover":$={width:u.containerRect.width,height:u.containerRect.width/k};break;case"vertical-cover":$={width:u.containerRect.height*k,height:u.containerRect.height};break}else $={width:g.offsetWidth,height:g.offsetHeight};u.mediaSize=Ve(Ve({},$),{naturalWidth:U,naturalHeight:z}),u.props.setMediaSize&&u.props.setMediaSize(u.mediaSize);var G=u.props.cropSize?u.props.cropSize:Jg(u.mediaSize.width,u.mediaSize.height,u.containerRect.width,u.containerRect.height,u.props.aspect,u.props.rotation);return(((R=u.state.cropSize)===null||R===void 0?void 0:R.height)!==G.height||((v=u.state.cropSize)===null||v===void 0?void 0:v.width)!==G.width)&&u.props.onCropSizeChange&&u.props.onCropSizeChange(G),u.setState({cropSize:G},u.recomputeCropPosition),u.props.setCropSize&&u.props.setCropSize(G),G}},u.saveContainerPosition=function(){if(u.containerRef){var s=u.containerRef.getBoundingClientRect();u.containerPosition={x:s.left,y:s.top}}},u.onMouseDown=function(s){u.currentDoc&&(s.preventDefault(),u.currentDoc.addEventListener("mousemove",u.onMouseMove),u.currentDoc.addEventListener("mouseup",u.onDragStopped),u.saveContainerPosition(),u.onDragStart(d.getMousePoint(s)))},u.onMouseMove=function(s){return u.onDrag(d.getMousePoint(s))},u.onScroll=function(s){u.currentDoc&&(s.preventDefault(),u.saveContainerPosition())},u.onTouchStart=function(s){u.currentDoc&&(u.isTouching=!0,!(u.props.onTouchRequest&&!u.props.onTouchRequest(s))&&(u.currentDoc.addEventListener("touchmove",u.onTouchMove,{passive:!1}),u.currentDoc.addEventListener("touchend",u.onDragStopped),u.saveContainerPosition(),s.touches.length===2?u.onPinchStart(s):s.touches.length===1&&u.onDragStart(d.getTouchPoint(s.touches[0]))))},u.onTouchMove=function(s){s.preventDefault(),s.touches.length===2?u.onPinchMove(s):s.touches.length===1&&u.onDrag(d.getTouchPoint(s.touches[0]))},u.onGestureStart=function(s){u.currentDoc&&(s.preventDefault(),u.currentDoc.addEventListener("gesturechange",u.onGestureChange),u.currentDoc.addEventListener("gestureend",u.onGestureEnd),u.gestureZoomStart=u.props.zoom,u.gestureRotationStart=u.props.rotation)},u.onGestureChange=function(s){if(s.preventDefault(),!u.isTouching){var h=d.getMousePoint(s),b=u.gestureZoomStart-1+s.scale;if(u.setNewZoom(b,h,{shouldUpdatePosition:!0}),u.props.onRotationChange){var E=u.gestureRotationStart+s.rotation;u.props.onRotationChange(E)}}},u.onGestureEnd=function(s){u.cleanEvents()},u.onDragStart=function(s){var h,b,E=s.x,R=s.y;u.dragStartPosition={x:E,y:R},u.dragStartCrop=Ve({},u.props.crop),(b=(h=u.props).onInteractionStart)===null||b===void 0||b.call(h)},u.onDrag=function(s){var h=s.x,b=s.y;u.currentWindow&&(u.rafDragTimeout&&u.currentWindow.cancelAnimationFrame(u.rafDragTimeout),u.rafDragTimeout=u.currentWindow.requestAnimationFrame(function(){if(u.state.cropSize&&!(h===void 0||b===void 0)){var E=h-u.dragStartPosition.x,R=b-u.dragStartPosition.y,v={x:u.dragStartCrop.x+E,y:u.dragStartCrop.y+R},g=u.props.restrictPosition?qn(v,u.mediaSize,u.state.cropSize,u.props.zoom,u.props.rotation):v;u.props.onCropChange(g)}}))},u.onDragStopped=function(){var s,h;u.isTouching=!1,u.cleanEvents(),u.emitCropData(),(h=(s=u.props).onInteractionEnd)===null||h===void 0||h.call(s)},u.onWheel=function(s){if(u.currentWindow&&!(u.props.onWheelRequest&&!u.props.onWheelRequest(s))){s.preventDefault();var h=d.getMousePoint(s),b=$g(s).pixelY,E=u.props.zoom-b*u.props.zoomSpeed/200;u.setNewZoom(E,h,{shouldUpdatePosition:!0}),u.state.hasWheelJustStarted||u.setState({hasWheelJustStarted:!0},function(){var R,v;return(v=(R=u.props).onInteractionStart)===null||v===void 0?void 0:v.call(R)}),u.wheelTimer&&clearTimeout(u.wheelTimer),u.wheelTimer=u.currentWindow.setTimeout(function(){return u.setState({hasWheelJustStarted:!1},function(){var R,v;return(v=(R=u.props).onInteractionEnd)===null||v===void 0?void 0:v.call(R)})},250)}},u.getPointOnContainer=function(s,h){var b=s.x,E=s.y;if(!u.containerRect)throw new Error("The Cropper is not mounted");return{x:u.containerRect.width/2-(b-h.x),y:u.containerRect.height/2-(E-h.y)}},u.getPointOnMedia=function(s){var h=s.x,b=s.y,E=u.props,R=E.crop,v=E.zoom;return{x:(h+R.x)/v,y:(b+R.y)/v}},u.setNewZoom=function(s,h,b){var E=b===void 0?{}:b,R=E.shouldUpdatePosition,v=R===void 0?!0:R;if(!(!u.state.cropSize||!u.props.onZoomChange)){var g=hu(s,u.props.minZoom,u.props.maxZoom);if(v){var _=u.getPointOnContainer(h,u.containerPosition),U=u.getPointOnMedia(_),z={x:U.x*g-_.x,y:U.y*g-_.y},F=u.props.restrictPosition?qn(z,u.mediaSize,u.state.cropSize,g,u.props.rotation):z;u.props.onCropChange(F)}u.props.onZoomChange(g)}},u.getCropData=function(){if(!u.state.cropSize)return null;var s=u.props.restrictPosition?qn(u.props.crop,u.mediaSize,u.state.cropSize,u.props.zoom,u.props.rotation):u.props.crop;return Pg(s,u.mediaSize,u.state.cropSize,u.getAspect(),u.props.zoom,u.props.rotation,u.props.restrictPosition)},u.emitCropData=function(){var s=u.getCropData();if(s){var h=s.croppedAreaPercentages,b=s.croppedAreaPixels;u.props.onCropComplete&&u.props.onCropComplete(h,b),u.props.onCropAreaChange&&u.props.onCropAreaChange(h,b)}},u.emitCropAreaChange=function(){var s=u.getCropData();if(s){var h=s.croppedAreaPercentages,b=s.croppedAreaPixels;u.props.onCropAreaChange&&u.props.onCropAreaChange(h,b)}},u.recomputeCropPosition=function(){var s,h;if(u.state.cropSize){var b=u.props.crop;if(u.isInitialized&&(!((s=u.previousCropSize)===null||s===void 0)&&s.width)&&(!((h=u.previousCropSize)===null||h===void 0)&&h.height)){var E=Math.abs(u.previousCropSize.width-u.state.cropSize.width)>1e-6||Math.abs(u.previousCropSize.height-u.state.cropSize.height)>1e-6;if(E){var R=u.state.cropSize.width/u.previousCropSize.width,v=u.state.cropSize.height/u.previousCropSize.height;b={x:u.props.crop.x*R,y:u.props.crop.y*v}}}var g=u.props.restrictPosition?qn(b,u.mediaSize,u.state.cropSize,u.props.zoom,u.props.rotation):b;u.previousCropSize=u.state.cropSize,u.props.onCropChange(g),u.emitCropData()}},u.onKeyDown=function(s){var h,b,E=u.props,R=E.crop,v=E.onCropChange,g=E.keyboardStep,_=E.zoom,U=E.rotation,z=g;if(u.state.cropSize){s.shiftKey&&(z*=.2);var F=Ve({},R);switch(s.key){case"ArrowUp":F.y-=z,s.preventDefault();break;case"ArrowDown":F.y+=z,s.preventDefault();break;case"ArrowLeft":F.x-=z,s.preventDefault();break;case"ArrowRight":F.x+=z,s.preventDefault();break;default:return}u.props.restrictPosition&&(F=qn(F,u.mediaSize,u.state.cropSize,_,U)),s.repeat||(b=(h=u.props).onInteractionStart)===null||b===void 0||b.call(h),v(F)}},u.onKeyUp=function(s){var h,b;switch(s.key){case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":s.preventDefault();break;default:return}u.emitCropData(),(b=(h=u.props).onInteractionEnd)===null||b===void 0||b.call(h)},u}return d.prototype.componentDidMount=function(){!this.currentDoc||!this.currentWindow||(this.containerRef&&(this.containerRef.ownerDocument&&(this.currentDoc=this.containerRef.ownerDocument),this.currentDoc.defaultView&&(this.currentWindow=this.currentDoc.defaultView),this.initResizeObserver(),typeof window.ResizeObserver>"u"&&this.currentWindow.addEventListener("resize",this.computeSizes),this.props.zoomWithScroll&&this.containerRef.addEventListener("wheel",this.onWheel,{passive:!1}),this.containerRef.addEventListener("gesturestart",this.onGestureStart)),this.currentDoc.addEventListener("scroll",this.onScroll),this.props.disableAutomaticStylesInjection||(this.styleRef=this.currentDoc.createElement("style"),this.styleRef.setAttribute("type","text/css"),this.props.nonce&&this.styleRef.setAttribute("nonce",this.props.nonce),this.styleRef.innerHTML=up,this.currentDoc.head.appendChild(this.styleRef)),this.imageRef.current&&this.imageRef.current.complete&&this.onMediaLoad(),this.props.setImageRef&&this.props.setImageRef(this.imageRef),this.props.setVideoRef&&this.props.setVideoRef(this.videoRef),this.props.setCropperRef&&this.props.setCropperRef(this.cropperRef))},d.prototype.componentWillUnmount=function(){var u,s;!this.currentDoc||!this.currentWindow||(typeof window.ResizeObserver>"u"&&this.currentWindow.removeEventListener("resize",this.computeSizes),(u=this.resizeObserver)===null||u===void 0||u.disconnect(),this.containerRef&&this.containerRef.removeEventListener("gesturestart",this.preventZoomSafari),this.styleRef&&((s=this.styleRef.parentNode)===null||s===void 0||s.removeChild(this.styleRef)),this.cleanEvents(),this.props.zoomWithScroll&&this.clearScrollEvent())},d.prototype.componentDidUpdate=function(u){var s,h,b,E,R,v,g,_,U;u.rotation!==this.props.rotation?(this.computeSizes(),this.recomputeCropPosition()):u.aspect!==this.props.aspect?this.computeSizes():u.objectFit!==this.props.objectFit?this.computeSizes():u.zoom!==this.props.zoom?this.recomputeCropPosition():((s=u.cropSize)===null||s===void 0?void 0:s.height)!==((h=this.props.cropSize)===null||h===void 0?void 0:h.height)||((b=u.cropSize)===null||b===void 0?void 0:b.width)!==((E=this.props.cropSize)===null||E===void 0?void 0:E.width)?this.computeSizes():(((R=u.crop)===null||R===void 0?void 0:R.x)!==((v=this.props.crop)===null||v===void 0?void 0:v.x)||((g=u.crop)===null||g===void 0?void 0:g.y)!==((_=this.props.crop)===null||_===void 0?void 0:_.y))&&this.emitCropAreaChange(),u.zoomWithScroll!==this.props.zoomWithScroll&&this.containerRef&&(this.props.zoomWithScroll?this.containerRef.addEventListener("wheel",this.onWheel,{passive:!1}):this.clearScrollEvent()),u.video!==this.props.video&&((U=this.videoRef.current)===null||U===void 0||U.load());var z=this.getObjectFit();z!==this.state.mediaObjectFit&&this.setState({mediaObjectFit:z},this.computeSizes)},d.prototype.getAspect=function(){var u=this.props,s=u.cropSize,h=u.aspect;return s?s.width/s.height:h},d.prototype.getObjectFit=function(){var u,s,h,b;if(this.props.objectFit==="cover"){var E=this.imageRef.current||this.videoRef.current;if(E&&this.containerRef){this.containerRect=this.containerRef.getBoundingClientRect();var R=this.containerRect.width/this.containerRect.height,v=((u=this.imageRef.current)===null||u===void 0?void 0:u.naturalWidth)||((s=this.videoRef.current)===null||s===void 0?void 0:s.videoWidth)||0,g=((h=this.imageRef.current)===null||h===void 0?void 0:h.naturalHeight)||((b=this.videoRef.current)===null||b===void 0?void 0:b.videoHeight)||0,_=v/g;return _<R?"horizontal-cover":"vertical-cover"}return"horizontal-cover"}return this.props.objectFit},d.prototype.onPinchStart=function(u){var s=d.getTouchPoint(u.touches[0]),h=d.getTouchPoint(u.touches[1]);this.lastPinchDistance=yh(s,h),this.lastPinchRotation=bh(s,h),this.onDragStart(vh(s,h))},d.prototype.onPinchMove=function(u){var s=this;if(!(!this.currentDoc||!this.currentWindow)){var h=d.getTouchPoint(u.touches[0]),b=d.getTouchPoint(u.touches[1]),E=vh(h,b);this.onDrag(E),this.rafPinchTimeout&&this.currentWindow.cancelAnimationFrame(this.rafPinchTimeout),this.rafPinchTimeout=this.currentWindow.requestAnimationFrame(function(){var R=yh(h,b),v=s.props.zoom*(R/s.lastPinchDistance);s.setNewZoom(v,E,{shouldUpdatePosition:!1}),s.lastPinchDistance=R;var g=bh(h,b),_=s.props.rotation+(g-s.lastPinchRotation);s.props.onRotationChange&&s.props.onRotationChange(_),s.lastPinchRotation=g})}},d.prototype.render=function(){var u=this,s,h=this.props,b=h.image,E=h.video,R=h.mediaProps,v=h.cropperProps,g=h.transform,_=h.crop,U=_.x,z=_.y,F=h.rotation,k=h.zoom,$=h.cropShape,G=h.showGrid,V=h.roundCropAreaPixels,K=h.style,W=K.containerStyle,fe=K.cropAreaStyle,Q=K.mediaStyle,ee=h.classes,P=ee.containerClassName,Le=ee.cropAreaClassName,Xe=ee.mediaClassName,Be=(s=this.state.mediaObjectFit)!==null&&s!==void 0?s:this.getObjectFit();return q.createElement("div",{onMouseDown:this.onMouseDown,onTouchStart:this.onTouchStart,ref:function(Se){return u.containerRef=Se},"data-testid":"container",style:W,className:ru("reactEasyCrop_Container",P)},b?q.createElement("img",Ve({alt:"",className:ru("reactEasyCrop_Image",Be==="contain"&&"reactEasyCrop_Contain",Be==="horizontal-cover"&&"reactEasyCrop_Cover_Horizontal",Be==="vertical-cover"&&"reactEasyCrop_Cover_Vertical",Xe)},R,{src:b,ref:this.imageRef,style:Ve(Ve({},Q),{transform:g||"translate(".concat(U,"px, ").concat(z,"px) rotate(").concat(F,"deg) scale(").concat(k,")")}),onLoad:this.onMediaLoad})):E&&q.createElement("video",Ve({autoPlay:!0,playsInline:!0,loop:!0,muted:!0,className:ru("reactEasyCrop_Video",Be==="contain"&&"reactEasyCrop_Contain",Be==="horizontal-cover"&&"reactEasyCrop_Cover_Horizontal",Be==="vertical-cover"&&"reactEasyCrop_Cover_Vertical",Xe)},R,{ref:this.videoRef,onLoadedMetadata:this.onMediaLoad,style:Ve(Ve({},Q),{transform:g||"translate(".concat(U,"px, ").concat(z,"px) rotate(").concat(F,"deg) scale(").concat(k,")")}),controls:!1}),(Array.isArray(E)?E:[{src:E}]).map(function(Ye){return q.createElement("source",Ve({key:Ye.src},Ye))})),this.state.cropSize&&q.createElement("div",Ve({ref:this.cropperRef,style:Ve(Ve({},fe),{width:V?Math.round(this.state.cropSize.width):this.state.cropSize.width,height:V?Math.round(this.state.cropSize.height):this.state.cropSize.height}),tabIndex:0,onKeyDown:this.onKeyDown,onKeyUp:this.onKeyUp,"data-testid":"cropper",className:ru("reactEasyCrop_CropArea",$==="round"&&"reactEasyCrop_CropAreaRound",G&&"reactEasyCrop_CropAreaGrid",Le)},v)))},d.defaultProps={zoom:1,rotation:0,aspect:4/3,maxZoom:sp,minZoom:cp,cropShape:"rect",objectFit:"contain",showGrid:!0,style:{},classes:{},mediaProps:{},cropperProps:{},zoomSpeed:1,restrictPosition:!0,zoomWithScroll:!0,keyboardStep:op},d.getMousePoint=function(u){return{x:Number(u.clientX),y:Number(u.clientY)}},d.getTouchPoint=function(u){return{x:Number(u.clientX),y:Number(u.clientY)}},d})(q.Component);const fp=r=>new Promise((d,u)=>{const s=new Image;s.addEventListener("load",()=>d(s)),s.addEventListener("error",h=>u(h)),s.src=r}),dp=async(r,d,u)=>{const s=await fp(r),h=document.createElement("canvas"),b=h.getContext("2d");if(!b)throw new Error("Failed to get canvas context");return h.width=d.width,h.height=d.height,b.drawImage(s,d.x,d.y,d.width,d.height,0,0,d.width,d.height),new Promise((E,R)=>{h.toBlob(v=>{if(!v){R(new Error("Canvas is empty"));return}const g=new File([v],u,{type:"image/png"});E(g)},"image/png",.95)})},hp=({image:r,onCropComplete:d,onCancel:u})=>{const[s,h]=q.useState(""),[b,E]=q.useState({x:0,y:0}),[R,v]=q.useState(1),[g,_]=q.useState(null),[U,z]=q.useState(!1);Th.useEffect(()=>{const V=new FileReader;V.addEventListener("load",()=>{h(V.result)}),V.readAsDataURL(r)},[r]);const F=q.useCallback(V=>{E(V)},[]),k=q.useCallback(V=>{v(V)},[]),$=q.useCallback((V,K)=>{_(K)},[]),G=async()=>{if(g){z(!0);try{const V=r.name.replace(/\.[^/.]+$/,""),K=await dp(s,g,`${V}_cropped_${Date.now()}.png`);d(K)}catch(V){console.error("裁剪失败:",V),alert("裁剪失败，请重试")}finally{z(!1)}}};return f.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",children:f.jsxs("div",{className:"relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col",children:[f.jsxs("div",{className:"flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700",children:[f.jsxs("h2",{className:"text-lg font-bold text-white flex items-center gap-2",children:[f.jsx(rh,{className:"w-5 h-5"}),"裁剪图片"]}),f.jsx("button",{onClick:u,className:"p-2 hover:bg-gray-700 rounded-lg transition-colors",children:f.jsx(Is,{className:"w-5 h-5 text-gray-400"})})]}),f.jsx("div",{className:"relative flex-1 bg-black",children:s&&f.jsx(rp,{image:s,crop:b,zoom:R,aspect:3/4,onCropChange:F,onZoomChange:k,onCropComplete:$,restrictPosition:!0,style:{containerStyle:{width:"100%",height:"100%"},cropAreaStyle:{border:"2px solid rgba(168, 85, 247, 0.8)"}}})}),f.jsxs("div",{className:"px-6 py-4 bg-gray-800 border-t border-gray-700",children:[f.jsx("div",{className:"mb-4",children:f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx(Ig,{className:"w-4 h-4 text-gray-400"}),f.jsx("input",{type:"range",min:1,max:3,step:.1,value:R,onChange:V=>v(parseFloat(V.target.value)),className:"flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"}),f.jsx(rh,{className:"w-4 h-4 text-gray-400"}),f.jsxs("span",{className:"text-sm text-gray-400 min-w-[4rem] text-center",children:[Math.round(R*100),"%"]})]})}),f.jsx("p",{className:"text-xs text-gray-400 mb-4 text-center",children:"拖动图片调整位置，滑动滚轮或使用滑块缩放，拖动边角调整裁剪区域"}),f.jsxs("div",{className:"flex gap-3",children:[f.jsx("button",{onClick:u,className:"flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors",children:"取消"}),f.jsx("button",{onClick:G,disabled:U,className:"flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",children:U?f.jsxs(f.Fragment,{children:[f.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"}),f.jsx("span",{children:"处理中..."})]}):f.jsxs(f.Fragment,{children:[f.jsx(og,{className:"w-4 h-4"}),f.jsx("span",{children:"确认裁剪"})]})})]})]})]})})},Xl=({currentImage:r,onImageChange:d,label:u="产品图片",multiple:s=!1,currentImages:h=[],onImagesChange:b,showCropButtons:E=!1})=>{const R=q.useRef(null),[v,g]=q.useState(!1),[_,U]=q.useState(!1),z=Q=>{if(Q.target.files&&Q.target.files.length>0){if(s&&b){const ee=Array.from(Q.target.files);b([...h,...ee])}else if(d){const ee=Q.target.files[0];d(ee)}}},F=Q=>{Q.preventDefault(),g(!0)},k=Q=>{Q.preventDefault(),g(!1)},$=Q=>{if(Q.preventDefault(),g(!1),Q.dataTransfer.files&&Q.dataTransfer.files.length>0){if(s&&b){const ee=Array.from(Q.dataTransfer.files).filter(P=>P.type.startsWith("image/"));ee.length>0&&b([...h,...ee])}else if(d){const ee=Q.dataTransfer.files[0];ee.type.startsWith("image/")?d(ee):alert("请拖放图片文件（JPG、PNG、WebP）。")}}},G=Q=>{if(s&&b)if(typeof Q=="number"){const ee=[...h];ee.splice(Q,1),b(ee)}else b([]);else d&&d(null);R.current&&(R.current.value="")},V=()=>{r&&U(!0)},K=Q=>{d&&d(Q),U(!1)},W=()=>{U(!1)},fe=s?!0:!r;return f.jsxs("div",{className:"w-full",children:[f.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:u}),fe&&f.jsxs("div",{onClick:()=>{var Q;return(Q=R.current)==null?void 0:Q.click()},onDragOver:F,onDragLeave:k,onDrop:$,className:`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${s&&h.length>0?"h-32 mb-4":"h-64"} bg-white
            ${v?"border-purple-500 bg-purple-50 scale-[1.02] shadow-lg":"border-gray-300 hover:border-purple-500 hover:bg-purple-50"}`,children:[f.jsx("div",{className:`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 ${v?"scale-110 bg-purple-200":"bg-purple-100 group-hover:scale-110"}`,children:f.jsx(wg,{className:`w-6 h-6 ${v?"text-purple-700":"text-purple-600"}`})}),f.jsx("h3",{className:"text-base font-semibold text-gray-900",children:v?"释放图片到此处":s?"批量上传图片":`上传${u.includes("产品")?"您的产品":""}图片`}),f.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"点击浏览或拖放文件到此处"})]}),s&&h.length>0&&f.jsx("div",{className:"grid grid-cols-3 gap-2 mt-2",children:h.map((Q,ee)=>f.jsxs("div",{className:"relative rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-square group",children:[f.jsx("img",{src:URL.createObjectURL(Q),alt:`Preview ${ee}`,className:"h-full w-full object-cover"}),f.jsx("button",{onClick:P=>{P.stopPropagation(),G(ee)},className:"absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100",children:f.jsx(Is,{className:"w-4 h-4"})})]},ee))}),!s&&r&&f.jsx(f.Fragment,{children:f.jsxs("div",{className:"relative rounded-2xl overflow-hidden shadow-md border border-gray-200 group h-64 bg-white flex items-center justify-center bg-gray-50",children:[f.jsx("img",{src:URL.createObjectURL(r),alt:"预览",className:"h-full w-full object-contain"}),f.jsxs("div",{className:"absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all",children:[E&&f.jsx("button",{onClick:Q=>{Q.stopPropagation(),V()},className:"bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full backdrop-blur-sm transition-all",title:"裁剪图片",children:f.jsx(Gs,{className:"w-5 h-5"})}),f.jsx("button",{onClick:Q=>{Q.stopPropagation(),G()},className:"bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all",children:f.jsx(Is,{className:"w-5 h-5"})})]}),f.jsx("div",{className:"absolute bottom-2 left-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md",children:r.name})]})}),f.jsx("input",{type:"file",ref:R,onChange:z,multiple:s,accept:"image/png, image/jpeg, image/jpg, image/webp",className:"hidden"}),_&&r&&f.jsx(hp,{image:r,onCropComplete:K,onCancel:W})]})},js=r=>new Promise((d,u)=>{const s=new FileReader;s.readAsDataURL(r),s.onload=()=>{typeof s.result=="string"?d(s.result):u(new Error("Failed to convert file to base64"))},s.onerror=h=>u(h)}),mp=r=>new Promise(d=>setTimeout(d,r)),qs=(r,d)=>{const u=r+Math.random()*(d-r);return mp(u)},gp=async(r,d=2e4)=>new Promise((u,s)=>{const h=new Image;h.crossOrigin="anonymous";const b=setTimeout(()=>{h.src="",s(new Error(`图片加载超时（${d}ms）`))},d);h.onload=()=>{clearTimeout(b),console.log(`✅ 图片加载成功: ${h.width}x${h.height}px`),u(r)},h.onerror=()=>{clearTimeout(b),s(new Error("图片加载失败"))},h.src=r});class pp{constructor(){this.keys=[],this.currentIndex=0,this.keyUsageCount=new Map;const d="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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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";if(this.keys=d.split(",").map(u=>u.trim()).filter(u=>u.length>0),this.keys.length===0)throw new Error("未配置API密钥，请在.env文件中设置VITE_API_KEY或VITE_API_KEYS");console.log(`🔑 已加载 ${this.keys.length} 个API密钥`)}getNextKey(){const d=this.keys[this.currentIndex],u=this.keyUsageCount.get(d)||0;return this.keyUsageCount.set(d,u+1),this.currentIndex=(this.currentIndex+1)%this.keys.length,console.log(`🔑 使用密钥 #${this.currentIndex===0?this.keys.length:this.currentIndex}（已使用 ${u+1} 次）`),d}getAllKeys(){return[...this.keys]}getKeyCount(){return this.keys.length}}const yp=new pp,Eh={FULL_BODY:`
🚨🚨🚨 【构图类型：完整全身构图 - 严格留白版】 🚨🚨🚨

【画面裁剪范围 - 必须100%遵守】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 画面顶部边界 ┃ 头顶上方必须留出充足空间
┃ 画面底部边界 ┃ 脚底下方必须留出充足空间
┃ 必须显示部位 ┃ 头、颈、肩、臂、手、躯干、腰、臀、腿、膝、脚
┃ 禁止裁掉部位 ┃ 任何身体部位都不允许被裁掉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨🚨🚨 【留白强制要求 - 超级严格】 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 头顶上方留白 ┃ 至少15-20%画面高度（绝对不能顶到边缘）
┃ 脚底下方留白 ┃ 至少15-20%画面高度（绝对不能顶到边缘）
┃ 人物实际占比 ┃ 60-70%画面高度（适当缩小模特）
┃ 左右两侧留白 ┃ 各留出8-12%画面宽度
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【禁止的构图错误】
❌ 绝对禁止：头顶紧贴画面顶部边缘（顶天）
❌ 绝对禁止：脚底紧贴画面底部边缘（立地）
❌ 绝对禁止：人物过大，填满整个画面
❌ 绝对禁止：头部或脚部被画面边缘裁切

【正确构图标准】
✅ 人物应该在画面中居中，四周都有呼吸空间
✅ 头顶上方能看到明显的背景空间
✅ 脚底下方能看到明显的地面空间
✅ 人物尺寸适中，不会显得局促
✅ 整体构图看起来舒适、有张力

【人物缩放指南】
• 将人物整体缩小到合适比例
• 从远景视角拍摄，保持完整身形
• 确保画面四周都有足够的留白空间
• 人物在画面中显得从容、不拥挤

【服装款式锁定】
⚠️ 抹胸不能变吊带！长裙不能变短裙！开叉位置不能变！

【构图检查清单】
✓ 头顶到画面顶部距离 ≥ 15%画面高度
✓ 脚底到画面底部距离 ≥ 15%画面高度
✓ 人物高度占比 ≤ 70%画面总高度
✓ 左右两侧有对称留白
✓ 整体看起来不局促、有空间感`,UPPER_BODY:`
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🚨🚨🚨 【构图类型：上半身构图 - 腰部以下全部裁掉，绝不是全身！】 🚨🚨🚨
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔
⛔⛔⛔ 上半身构图 - 画面中绝对不允许出现腿部和脚部！⛔⛔⛔
⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔

🔴🔴🔴 【极度重要：这是"上半身"，不是"全身"！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 只拍上半身！画面必须在腰部/臀部位置截断！⚠️⚠️⚠️
⚠️⚠️⚠️ 绝对不能出现腿部、膝盖、脚部！⚠️⚠️⚠️
⚠️⚠️⚠️ 画面底部不能延伸到大腿或更下方！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴🔴🔴 【生成前必须五重确认！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第一次确认：当前是"上半身"构图，不是全身
第二次确认：画面顶部从头顶开始（包含头部）
第三次确认：画面底部在腰部结束（不能有腿）
第四次确认：如果画面中出现膝盖或脚，那就完全错了
第五次确认：上半身 = 头+肩+躯干+腰，没有腿和脚
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【上半身 vs 全身的核心区别】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 上半身（当前要求）：头→肩→躯干→腰部（停止！没有腿和脚！）
❌ 全身（不是这个）：头→肩→躯干→腰→臀→腿→膝→脚

关键:上半身=在腰部就结束了！看不到腿和脚！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【画面裁剪范围 - 必须100%遵守】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 画面顶部边界 ┃ 头顶上方（包含完整头发和头顶）
┃ 画面底部边界 ┃ 腰部/臀部位置（在此位置裁断！必须停止！）✅✅✅
┃ 必须显示部位 ┃ 头、颈、肩、臂、手、上半身躯干
┃ 禁止出现部位 ┃ ❌ 膝盖 ❌ 腿部 ❌ 脚部 ❌ 大腿 ❌ 小腿 ❌ 任何下半身
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【核心检查规则 - 生成前必须确认（任何一项违反立即失败）】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴🔴🔴 如果画面中出现膝盖 → 严重失败！（说明拍成全身了！）
🔴🔴🔴 如果画面中出现大腿 → 严重失败！（画面延伸过长！）
🔴🔴🔴 如果画面中出现腿部 → 严重失败！（这不是上半身！）
🔴🔴🔴 如果画面中出现脚部 → 严重失败！（完全错误！）
🔴🔴🔴 如果画面中出现小腿 → 严重失败！（超出上半身范围！）
🔴 如果画面底部超过腰部/臀部 → 构图失败！
🔴 如果能看到完整身体轮廓 → 构图失败！（这是全身图！）
🔴 如果能看到完整的长裙和腿 → 构图失败！（这是全身图！）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 正确示例：只显示头部、肩部、手臂、上半身躯干，在腰部/臀部位置截断，完全看不到腿和脚
❌ 错误示例：显示了大腿、膝盖或脚部（说明拍成全身图了！）
❌ 错误示例：能看到完整的裙子和腿部（这是全身图，不是上半身！）
❌ 错误示例：画面延伸到膝盖或更下方（超出上半身范围！）

【特别强调】
⚠️ 画面必须在腰部/臀部位置就停止，不能再往下延伸
⚠️ 即使裙子很长，也只能看到裙子的上半部分
⚠️ 绝对不允许看到裙摆、腿部、膝盖、脚部
⚠️ 这是上半身肖像构图，不是全身人物图

💡 记忆技巧：
• "上半身"三个字 = 只拍上半部分，在腰部就截断
• 如果能看到膝盖或脚 = 拍错了，那是全身图

⚠️⚠️⚠️ 这是上半身构图，绝对不允许出现下半身！⚠️⚠️⚠️
⚠️⚠️⚠️ 画面必须在腰部/臀部就结束，不能看到腿！⚠️⚠️⚠️

🔴🔴🔴 【最终确认问题 - 生成前必须回答】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q1: 当前构图是什么？→ 必须回答"上半身"
Q2: 画面中能出现腿和脚吗？→ 必须回答"不能"
Q3: 画面底部应该在哪里？→ 必须回答"腰部/臀部"
Q4: 如果看到膝盖或脚，对吗？→ 必须回答"错！这是全身图！"
Q5: 上半身包含腿部吗？→ 必须回答"不包含！"

✅✅✅ 只有上述问题全部回答正确，才能开始生成！✅✅✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
⚠️⚠️⚠️ 记住：上半身 = 没有腿！画面在腰部就结束！⚠️⚠️⚠️
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴`,HEADLESS_FULL:`
🚨🚨🚨 【构图类型：无头全身 - 从肩部到脚底的完整身体，头部裁掉】 🚨🚨🚨

🔴🔴🔴 【关键区别：这是无头"全身"，不是无头"上半身"！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 必须显示完整的身体：从肩部一直到脚底！⚠️⚠️⚠️
⚠️⚠️⚠️ 不是只拍上半身，而是拍摄除头部外的全身！⚠️⚠️⚠️
⚠️⚠️⚠️ 腿部、膝盖、双脚都必须完整出现在画面中！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【与"无头上半身"的核心区别】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
无头全身（当前构图） vs 无头上半身：
✅ 无头全身：从肩部→腰部→臀部→大腿→膝盖→小腿→脚底（完整下半身）
❌ 无头上半身：从肩部→腰部（在腰部就截断，没有腿和脚）

关键点：无头全身 = 有腿有脚！无头上半身 = 无腿无脚！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️⚠️⚠️ 【极度重要：无论任何拍摄角度都不能显示头部！】 ⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 正面拍摄：画面从肩部开始，不显示头部
• 侧面拍摄：画面从肩部开始，不显示头部轮廓
• 背面拍摄：画面从肩部/后颈开始，不显示后脑勺
• 3/4角度：画面从肩部开始，不显示头部任何部分
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【画面裁剪范围 - 必须100%遵守】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 画面顶部边界 ┃ 肩部/锁骨位置（从这里开始显示，头部已裁掉）
┃ 画面底部边界 ┃ 脚底下方（包含完整双脚和地面）✅✅✅
┃ 必须显示部位 ┃ 肩、臂、手、躯干、腰、臀、腿✅、膝✅、脚✅
┃ 禁止出现部位 ┃ ❌ 头部 ❌ 脸部 ❌ 颈部 ❌ 下巴 ❌ 后脑勺 ❌ 头发
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【核心检查规则 - 绝对不允许违反】
🔴🔴🔴 如果画面中出现头部任何部分 → 立即失败！
🔴🔴🔴 如果画面中出现脸部 → 立即失败！
🔴🔴🔴 如果画面中出现颈部 → 立即失败！
🔴🔴🔴 如果画面中出现后脑勺 → 立即失败！
🔴🔴🔴 如果画面中出现头发 → 立即失败！
🔴 如果画面顶部不是从肩部开始 → 构图失败！
🔴🔴🔴 如果画面中没有完整显示双脚 → 构图失败！（这是全身图！）
🔴🔴🔴 如果画面中没有显示腿部 → 构图失败！（这是全身图！）

✅ 正确示例：画面从肩部/锁骨开始，到脚底结束，完全看不到头部，但能看到完整的身体、腿和脚
❌ 错误示例：显示了头部、脸部、颈部、后脑勺或头发的任何部分
❌ 错误示例：脚部被裁掉或不完整（这必须是全身图！）
❌ 错误示例：腿部被裁掉（这必须是全身图！）
❌ 错误示例：画面在腰部就结束了（那是无头上半身，不是无头全身！）
❌ 错误示例：头部被模糊而不是裁掉（必须是画面外，不是模糊）

【特别强调 - 所有角度通用】
⚠️ "裁掉头部" 是指：画面从肩部开始，头部完全不在画面范围内
⚠️ 不是把头部模糊/打码，而是直接从肩部开始构图
⚠️ 画面顶部边缘应该正好在肩部/锁骨位置
⚠️ 无论正面、侧面、背面、任何角度，都不允许出现头部

【全身要求 - 这是与无头上半身的关键区别】
🔴🔴🔴 这是"全身"构图，必须包含腿部和双脚！🔴🔴🔴
⚠️ 双脚必须完整显示在画面内
⚠️ 腿部（大腿和小腿）必须完整显示
⚠️ 膝盖必须在画面中可见
⚠️ 脚底下方需要留白10-15%
⚠️ 不允许裁掉脚部或让脚部超出画面
⚠️ 不允许在腰部就结束画面（那是无头上半身，不是这个！）

【再次强调区别】
✅ 无头全身 = 肩膀 + 躯干 + 腰 + 臀 + 腿 + 脚（完整下半身）
❌ 无头上半身 = 肩膀 + 躯干 + 腰（到此为止，没有腿和脚）

💡 记忆技巧：
• "全身"二字的意思 = 必须有腿有脚的完整身体
• 只是裁掉了头部，其他都要有！`,HEADLESS_UPPER:`
🚨🚨🚨 【构图类型：无头上半身 - 从肩部到腰部，头部和腿部都裁掉】 🚨🚨🚨

🔴🔴🔴 【关键区别：这是无头"上半身"，不是无头"全身"！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 只拍摄上半身：从肩部到腰部/臀部就结束！⚠️⚠️⚠️
⚠️⚠️⚠️ 不要拍摄腿部、膝盖、脚部！画面在腰部就截断！⚠️⚠️⚠️
⚠️⚠️⚠️ 这是双重裁剪：上面裁掉头，下面裁掉腿！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【与"无头全身"的核心区别】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
无头上半身（当前构图） vs 无头全身：
✅ 无头上半身：从肩部→躯干→腰部（到此为止！没有腿和脚）
❌ 无头全身：从肩部→腰部→臀部→大腿→膝盖→小腿→脚底

关键点：无头上半身 = 无头无腿！无头全身 = 无头但有腿有脚！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【画面裁剪范围 - 必须100%遵守】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 画面顶部边界 ┃ 肩部/锁骨位置（从这里开始，头部已裁掉）
┃ 画面底部边界 ┃ 腰部/臀部位置（在此处裁断！腿部已裁掉！）✅✅✅
┃ 必须显示部位 ┃ 肩、臂、手、上半身躯干、腰部
┃ 禁止出现部位 ┃ ❌ 头部 ❌ 颈部（上方） + ❌ 膝盖 ❌ 腿 ❌ 脚（下方）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【双向裁剪检查规则】
🔴 上方：如果出现头部/颈部 → 构图失败！
🔴🔴🔴 下方：如果出现大腿/膝盖/小腿/脚 → 构图失败！（关键检查点！）
🔴 如果画面顶部不是从肩部开始 → 构图失败！
🔴🔴🔴 如果画面底部超过腰部/臀部 → 构图失败！（必须在腰部截断！）
🔴🔴🔴 如果画面中看到腿部或脚部 → 严重失败！（这是上半身构图！）

✅ 正确示例：画面从肩部开始到腰部/臀部结束，只显示躯干和手臂，完全看不到腿和脚
❌ 错误示例：显示了头部、颈部、膝盖、腿或脚
❌ 错误示例：画面底部到达大腿或更低位置（腿部出现了！）
❌ 错误示例：能看到膝盖或脚部（这说明拍成了全身图！）

【特别强调】
⚠️ 这是"双重裁剪"构图：上方裁掉头部，下方裁掉腿部
⚠️ 画面只显示从肩部/锁骨到腰部/臀部的身体部分
⚠️ 绝对不允许显示膝盖或任何下半身部位
⚠️ 画面必须在腰部/臀部位置就结束，不能继续往下

【再次强调区别】
✅ 无头上半身 = 肩膀 + 躯干 + 腰（到此为止！）
❌ 无头全身 = 肩膀 + 躯干 + 腰 + 臀 + 腿 + 脚

💡 记忆技巧：
• "上半身"三个字的意思 = 只要上半部分，没有腿和脚
• 双重裁剪：上面砍头，下面砍腿！

🚨🚨🚨 【超强补充约束：必须是“无头上半身”，不是“偶尔有头”】 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 这类构图的核心是：画面顶部直接从肩部/锁骨开始。
⚠️ 头部、脸部、下巴、嘴巴、鼻子、眼睛、额头、头发、后脑勺、耳朵，一律不允许出现。
⚠️ 不是“头部尽量少一点”，而是“头部必须完全不在画面里”。

【绝对禁止的常见错误】
❌ 错误1：生成完整人物后，只裁掉一部分头，残留嘴巴/下巴/头发
❌ 错误2：头部还在画面里，只是被模糊、遮挡、虚化
❌ 错误3：多张生成时，有1-2张偷偷变成有头半身图
❌ 错误4：上方裁切不够狠，露出脖子上段、下巴底部或发丝

【强制执行标准】
✅ 顶部边界必须落在肩部/锁骨附近，像相机一开始就没拍头部
✅ 每一张都必须是无头上半身，不能出现“这一批里混进1-2张有头图”
✅ 下方仍然在腰部/臀部结束，不能出现腿部

【批量生成特别规则】
🔴 如果一次生成多张，无头约束必须对每一张独立生效
🔴 不允许因为姿势变化、角度变化、批量生成而放松无头约束
🔴 正面、侧面、3/4角度、背面，全部都必须无头
🔴 只要任意一张出现头部任何部分，该张就判定失败

【最终判定】
✓ 画面最上方是否从肩部开始？→ 必须YES
✓ 画面里是否完全没有头部任何部分？→ 必须YES
✓ 批量生成时是否每一张都无头？→ 必须YES
只要有一项不是YES，就必须重新生成。`,HEADLESS_LOWER:`
🚨🚨🚨 【构图类型：无头下半身 - 从腰部到脚底，上半身裁掉】 🚨🚨🚨

【画面裁剪范围 - 必须100%遵守】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 画面顶部边界 ┃ 腰部/臀部位置（从这里开始，上半身已裁掉）
┃ 画面底部边界 ┃ 脚底下方（包含完整双脚和地面）
┃ 必须显示部位 ┃ 腰、臀、腿、膝、脚
┃ 禁止出现部位 ┃ ❌ 头部 ❌ 颈部 ❌ 肩部 ❌ 胸部 ❌ 手臂
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【核心检查规则】
🔴 如果画面中出现头部/脸部 → 构图失败！
🔴 如果画面中出现肩部/胸部 → 构图失败！
🔴 如果画面中出现手臂 → 构图失败！
🔴 如果画面顶部不是从腰部/臀部开始 → 构图失败！
🔴 如果画面中没有完整显示双脚 → 构图失败！

✅ 正确示例：画面从腰部/臀部开始，到脚底结束，只显示下半身
❌ 错误示例：显示了肩部、胸部、手臂或上半身任何部分
❌ 错误示例：脚部被裁掉或不完整

【特别强调】
⚠️ 画面只显示下半身：从腰部/臀部到脚底
⚠️ 任何上半身部位（肩、胸、臂）都不允许出现
⚠️ 双脚必须完整显示，脚底下方需要留白`,CLOSEUP:`
🚨🚨🚨 【构图类型：局部细节特写 - 绝对不是全身图或半身图！】 🚨🚨🚨

🔴🔴🔴 【核心理念：这是"特写"，不是"远景"！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 特写 = 局部特写 = 只拍摄服装的一个关键部位！⚠️⚠️⚠️
⚠️⚠️⚠️ 不是拍摄完整人物！不是拍摄全身或半身！⚠️⚠️⚠️
⚠️⚠️⚠️ 画面中应该充满细节，近距离拍摄局部！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📷 拍摄理念：
采用局部细节特写构图，聚焦服装的一个关键部位，突出材质质感、做工与设计亮点。

【拍摄方式 - 必须100%遵守】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 拍摄对象 ┃ 选择服装的一个关键部位进行特写（只拍一个部位！）
┃ 拍摄距离 ┃ 近距离拍摄，局部特写，镜头靠近拍摄对象
┃ 画面占比 ┃ 被摄主体（该部位）占画面70-90%
┃ 拍摄范围 ┃ 只包含该部位及其周边很小的区域
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【拍摄对象 - 选择其中一个关键部位进行特写】
✅ 领口设计特写（V领、抹胸、圆领等的局部）
✅ 袖口细节特写（袖型、袖口装饰的局部）
✅ 腰部设计特写（腰带、收腰、腰线的局部）
✅ 面料纹理特写（编织纹路、材质质感的局部）
✅ 印花图案特写（图案细节、色彩的局部）
✅ 褶皱工艺特写（褶皱处理、立体感的局部）
✅ 装饰细节特写（珠片、亮片、刺绣、扣子等的局部）
✅ 裙摆细节特写（裙摆开叉、下摆处理的局部）

【核心特写要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 近距离高清拍摄，局部特写
✅ 画面充满细节，高清锐利
✅ 突出材质质感、做工与设计亮点
✅ 被摄部位占据画面大部分空间（70-90%）
✅ 背景简洁虚化或极简处理
✅ 光线突出质感和立体感
✅ 能清晰看到纹理、编织、工艺细节
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【画面构成标准】
• 被摄主体（服装局部）占画面70-90%
• 聚焦单一关键部位，不拍摄多个部位
• 清楚展示纹理、材质、工艺细节
• 背景虚化或极简处理，不喧宾夺主
• 细节清晰到可以看到面料编织纹路

【正确的特写示例】
✅ 近距离拍摄领口：领口占画面大部分，能清楚看到领口线条和剪裁
✅ 近距离拍摄面料：面料纹理占画面大部分，能清楚看到编织细节
✅ 近距离拍摄装饰：珠片/刺绣占画面大部分，能清楚看到工艺细节
✅ 近距离拍摄袖口：袖口占画面大部分，能清楚看到袖型和装饰
✅ 近距离拍摄腰部：腰带/收腰占画面大部分，能清楚看到设计细节

【严格禁止的错误拍摄】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 绝对禁止：拍摄完整人物（从头到脚）
❌ 绝对禁止：拍摄全身图（看到完整身体）
❌ 绝对禁止：拍摄半身图（看到上半身或下半身）
❌ 绝对禁止：拍摄3/4身（看到大部分身体）
❌ 绝对禁止：远景拍摄（人物很小，环境很多）
❌ 绝对禁止：中景拍摄（能看到身体大部分）
❌ 绝对禁止：背景复杂抢镜（背景占比过大）
❌ 绝对禁止：拍摄部位占比过小（小于70%）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【核心检查标准】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 如果能看到完整人物身体 → 严重失败！（这是远景，不是特写！）
🔴 如果能看到从肩膀到腰部 → 严重失败！（这是半身，不是特写！）
🔴 如果能看到完整上半身或下半身 → 严重失败！（不是特写！）
🔴 如果拍摄对象占画面小于70% → 失败！（不够"特写"！）
🔴 如果背景占比过大 → 失败！（主体不突出！）
🔴 如果看不清细节纹理 → 失败！（不够近！）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 正确标准：只能看到服装的一个局部（领口、袖口、腰部、面料等），该部位占据画面大部分空间，细节清晰可见
❌ 错误标准：能看到完整人物、全身、半身、或拍摄距离过远

【再次强调】
🎯 特写 = 局部 = 近距离 = 细节充满画面
🎯 不是完整人物图！不是全身图！不是远景图！
🎯 画面中应该充满你要拍的那个部位的细节！

💡 记忆技巧：
• "特写"二字 = 特别近距离地写实拍摄某个局部
• 想象你用放大镜看服装的某个部位
• 画面里应该只有这个部位和周边很小的区域`},je=[{name:"CONFIDENT_STANDING",description:"自信站立姿势（手：自然下垂 | 腿：左腿前伸）",instruction:"Professional e-commerce model standing pose. 【ARMS/HANDS】: Arms relaxed at sides with fingers naturally spread, hands hanging loosely beside thighs. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body slightly angled 15° to camera, LEFT leg stepped slightly forward (about 20cm ahead), weight on RIGHT back leg, RIGHT knee slightly locked, LEFT knee gently relaxed. Feet pointing slightly outward at 15° angle. Creates a natural S-curve. Chin slightly up, shoulders back, chest open. Like a Zara/H&M catalog model - confident, elegant, effortless."},{name:"HAND_ON_HIP_POWER",description:"叉腰力量感姿势（手：右手叉腰 | 腿：右腿承重偏右站）",instruction:"Fashion power pose. 【ARMS/HANDS】: RIGHT hand firmly on hip (elbow pointing outward to create triangle shape), LEFT hand hanging relaxed or holding a small clutch. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body turned 25° from camera, weight shifted predominantly to RIGHT leg (RIGHT leg straight and locked), LEFT leg relaxed with knee slightly bent and LEFT foot placed slightly forward and to the side. Hips pushed to the RIGHT side creating asymmetric stance. Creates strong confident silhouette that emphasizes waistline."},{name:"EDITORIAL_LEAN",description:"时尚编辑风姿势（手：左手触锁骨 | 腿：交叉站立）",instruction:"Editorial fashion pose. 【ARMS/HANDS】: LEFT hand gracefully touching collarbone or adjusting necklace, RIGHT hand relaxed at side with fingers loosely spread. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body leaning very slightly backward, LEFT leg CROSSED in front of RIGHT leg at ankle level, weight mainly on RIGHT leg, creating an elegant X-shaped leg line. Shoulders slightly asymmetric (LEFT shoulder higher). Creates a magazine-worthy look that sells luxury."},{name:"HAIR_TOUCH_ELEGANCE",description:"撩发优雅姿势（手：右手撩发 | 腿：右腿微曲前伸）",instruction:"Elegant hair-touch pose. 【ARMS/HANDS】: RIGHT hand gracefully sweeping hair behind ear or touching hair at temple level, fingers spread naturally. LEFT hand on LEFT hip. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body in 3/4 angle facing LEFT, RIGHT leg stepped forward about 25cm with knee slightly bent and relaxed, LEFT leg straight bearing most weight. RIGHT foot pointing slightly outward. Creates a slight S-curve with dynamic feminine energy. The garment should look dynamic with movement."},{name:"CROSSED_ARMS_CHIC",description:"交叉臂知性姿势（手：双臂交叉 | 腿：左腿前交叉）",instruction:"Chic crossed arms pose. 【ARMS/HANDS】: Arms loosely crossed at waist level (NOT tightly hugging chest), fingers visible on both sides, creating a relaxed sophisticated look. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body slightly turned to RIGHT, LEFT leg crossed in front of RIGHT leg with LEFT foot placed to the RIGHT side, weight on RIGHT leg, creating a casual but stylish stance. The crossed legs create a slimming effect. Must still clearly show the garment details."},{name:"DYNAMIC_STRIDE",description:"动感步伐姿势（手：左手前摆右手后摆 | 腿：大步行走右腿前迈）",instruction:"Dynamic walking/stride pose. 【ARMS/HANDS】: LEFT arm swinging forward naturally (hand at waist height), RIGHT arm swinging backward. Both hands relaxed with fingers naturally curved as in walking motion. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Mid-stride position with RIGHT leg clearly stepped forward (at least 40cm ahead), LEFT leg behind pushing off, both knees slightly bent in walking motion. RIGHT heel about to touch ground, LEFT toes pushing off. Creates strong sense of movement and energy. Skirt/dress should show natural movement flow."},{name:"CASUAL_POCKET",description:"随性口袋姿势（手：双手插口袋 | 腿：双腿微开宽于肩）",instruction:"Casual pocket pose. 【ARMS/HANDS】: Both thumbs hooked in pockets (or belt loops), fingers visible outside, elbows slightly bent outward. If no pockets exist, both hands resting on hips with thumbs behind. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Legs spread slightly WIDER than shoulder width (about 10cm wider each side), both feet turned slightly outward at 20° angles, weight distributed evenly but hips shifted slightly to LEFT. Creates a cool, confident, relaxed asymmetric stance."},{name:"WAIST_ACCENT",description:"腰线强调姿势（手：右手扶腰左手自然 | 腿：左腿侧踏重心偏右）",instruction:"Waist-accentuating pose. 【ARMS/HANDS】: RIGHT hand placed gently at the natural waistline, fingers pointing downward drawing attention to the waist design. LEFT arm hanging relaxed creating a pleasing line with slight bend at elbow. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body in slight twist to RIGHT, LEFT leg stepped to the LEFT side about 20cm (lateral step), weight predominantly on RIGHT leg which is straight. LEFT knee very slightly bent. This lateral leg position emphasizes the hourglass shape and waist design."},{name:"GRACEFUL_HANDS",description:"优雅手势姿势（手：双手交握胸前 | 腿：并拢微微内扣）",instruction:"Graceful hands pose. 【ARMS/HANDS】: Both hands creating elegant shapes at chest level - LEFT hand gently holding RIGHT wrist in front of body, or both hands lightly clasped. Fingers long and naturally spread. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Both legs close together and nearly parallel, feet slightly pigeon-toed (toes pointing slightly inward), knees gently touching, weight evenly distributed. This creates a refined, feminine stance that conveys luxury and elegance. Perfect for elegant dresses and formal wear."},{name:"STREET_STYLE_WALK",description:"街拍风行走姿势（手：左手提包右手自然摆 | 腿：左腿大步前迈）",instruction:"Street style walking pose. 【ARMS/HANDS】: LEFT hand holding bag at hip level or swinging forward, RIGHT arm swinging naturally backward. Hands relaxed with natural finger positioning. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Natural mid-walk pose with LEFT leg clearly stepped forward (at least 35cm ahead), RIGHT leg behind in push-off position, LEFT knee slightly bent, RIGHT knee bent more. LEFT foot flat on ground, RIGHT heel lifted. Creates authentic paparazzi-captured street style photography feel with genuine movement."},{name:"S_CURVE_GLAMOUR",description:"S曲线魅力姿势（手：左手叉腰右手自然 | 腿：右腿前伸膝盖微曲）",instruction:"Glamorous S-curve pose. 【ARMS/HANDS】: LEFT hand firmly on LEFT hip creating triangle shape, RIGHT arm creating a flowing line hanging at side with slight bend at elbow, fingers relaxed. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body creating pronounced S-shape. Weight predominantly on LEFT back leg (straight and locked), RIGHT leg extended slightly forward and to the RIGHT side with knee gently bent and relaxed. RIGHT foot pointing outward at 30°. Hips pushed LEFT and back, chest forward. This maximizes body curves and garment silhouette. Like a high-end brand campaign."},{name:"OVER_SHOULDER_GLANCE",description:"回眸一笑姿势（手：右手触发际左手叉腰 | 腿：左腿后撤一步）",instruction:"Over-the-shoulder glance pose. 【ARMS/HANDS】: RIGHT hand touching hair near temple or behind ear, LEFT hand resting on LEFT hip. 【LEGS - MUST BE DIFFERENT FROM ORIGINAL】: Body turned 70° away from camera, LEFT leg stepped BACKWARD about 30cm behind RIGHT leg, weight on RIGHT front leg (straight), LEFT back leg slightly bent with LEFT heel slightly lifted. Head turned back over RIGHT shoulder to look at lens. Creates depth and mystery while showing both front and back details of the garment."}],bp=[{name:"FRONT",description:"正面拍摄 (Front view)",instruction:"相机正对人物，完全正面拍摄，人物面向镜头"},{name:"FRONT",description:"正面拍摄 (Front view)",instruction:"相机正对人物，完全正面拍摄，人物面向镜头"},{name:"SIDE_LEFT",description:"左侧面拍摄 (Left side view)",instruction:"从人物左侧拍摄，展示完整的侧面轮廓，人物面向画面右侧"},{name:"SIDE_RIGHT",description:"右侧面拍摄 (Right side view)",instruction:"从人物右侧拍摄，展示完整的侧面轮廓，人物面向画面左侧"},{name:"THREE_QUARTER_LEFT",description:"左侧3/4角度 (Left 3/4 view)",instruction:"从人物左前方45度角拍摄，展示立体感和层次"},{name:"THREE_QUARTER_RIGHT",description:"右侧3/4角度 (Right 3/4 view)",instruction:"从人物右前方45度角拍摄，展示立体感和层次"},{name:"BACK",description:"背面拍摄 (Back view)",instruction:"从人物背后拍摄，展示背部和服装背面细节"}],du=r=>{const d=[...r];for(let u=d.length-1;u>0;u--){const s=Math.floor(Math.random()*(u+1));[d[u],d[s]]=[d[s],d[u]]}return d},vp=r=>{const d=r.filter(b=>!b.name.includes("BACK")),u=r.filter(b=>b.name.includes("BACK")),s=du(d),h=du(u);return[...s,...h]};let fu=[],Fs=[],Xs="";const Ep=()=>{Xs=`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,du(je),fu=vp(bp),Fs=du(Ap),console.log(`🔀 新会话 ${Xs}：已随机打乱姿势/角度/特写排列（优先正面角度）`)},Sp=r=>{const d=r.toLowerCase();return d.includes("裤")||d.includes("pants")||d.includes("trouser")||d.includes("jeans")||d.includes("牛仔裤")?{type:"PANTS",recommendedCompositions:["FULL_BODY","HEADLESS_FULL"],focusAreas:["腰部设计","裤型轮廓","腿部线条","版型展示"],description:"裤装商品 - 建议使用全身构图重点展示腿部和裤型"}:d.includes("裙")||d.includes("skirt")||d.includes("dress")?{type:"SKIRT",recommendedCompositions:["FULL_BODY","HEADLESS_FULL"],focusAreas:["裙摆飘逸感","腰部设计","裙子长度","开叉细节"],description:"裙装商品 - 建议使用全身构图展示裙摆和整体垂坠感"}:d.includes("上衣")||d.includes("衬衫")||d.includes("T恤")||d.includes("shirt")||d.includes("top")||d.includes("blouse")?{type:"TOP",recommendedCompositions:["UPPER_BODY","HEADLESS_UPPER","FULL_BODY"],focusAreas:["领口设计","袖型细节","上身版型","面料质感"],description:"上衣商品 - 建议使用上半身或全身构图展示上身设计"}:d.includes("连衣裙")||d.includes("长裙")?{type:"DRESS",recommendedCompositions:["FULL_BODY"],focusAreas:["整体轮廓","腰线设计","裙摆飘逸","版型展示"],description:"连衣裙商品 - 必须使用全身构图展示完整效果"}:d.includes("套装")||d.includes("suit")||d.includes("outfit")?{type:"FULL_OUTFIT",recommendedCompositions:["FULL_BODY"],focusAreas:["整体搭配","上下身协调","颜色搭配","风格统一"],description:"套装商品 - 必须使用全身构图展示完整搭配"}:{type:"UNKNOWN",recommendedCompositions:["FULL_BODY","UPPER_BODY"],focusAreas:["整体款式","面料质感","设计细节"],description:"商品类型未识别 - 建议使用全身构图"}},Tp=r=>{switch(r){case"PANTS":return[je[0],je[1],je[9],je[10],je[11],je[6]];case"SKIRT":case"DRESS":return[je[0],je[10],je[9],je[7],je[11],je[3]];case"TOP":return[je[1],je[4],je[3],je[5],je[0],je[8]];default:return je}},Ap=[{name:"NECKLINE_DRAMATIC",description:"领口特写 - Vogue杂志风格",instruction:`
【拍摄部位】领口设计特写（V领、抹胸、圆领、方领、一字肩等）

【构图技巧】
📷 拍摄角度：45度俯拍角度，从斜上方向下拍摄
📐 画面占比：领口部位占画面70-80%，突出领口线条
🎨 黄金分割：领口位置放在画面黄金分割点

【光线设置】
💡 主光源：戏剧性侧光（光源来自侧面60度角）
✨ 光线效果：强烈的明暗对比，突出领口立体感和剪裁线条
🌟 边缘光：边缘有rim light勾勒领口轮廓

【风格特征】
🎯 Vogue杂志大片风格
🎯 高对比度、戏剧性光影
🎯 强调领口的建筑感和设计感
🎯 侧光投射产生的阴影增强立体感

【必须展示】领口线条清晰、剪裁工艺精湛、锁骨区域优雅`},{name:"SHOULDER_ELEGANT",description:"肩部特写 - 流畅肩线",instruction:`
【拍摄部位】肩部线条特写（肩线、肩带、露肩设计、肩部装饰）

【构图技巧】
📷 拍摄角度：侧面视角（90度纯侧面或75度侧偏角）
📐 画面占比：肩部占画面65-75%，展示肩线轮廓
🎨 构图重点：突出肩部到颈部的流畅曲线

【光线设置】
💡 主光源：柔和侧光（光源来自侧面45度角）
✨ 光线效果：柔和渐变，展示肩线的流畅度和优雅弧度
🌟 补光：轻微补光保持阴影部分细节

【风格特征】
🎯 优雅、柔和、女性化
🎯 强调肩部线条的流畅性
🎯 展示肩部皮肤和服装的交界处
🎯 侧面光线突出肩部立体感

【必须展示】肩线流畅优美、皮肤细腻、服装贴合完美
【特别检查】如果原图是无袖设计（抹胸、吊带、挂脖），只拍肩部线条和肩带细节，绝对不能添加袖子！`},{name:"WAIST_GOLDEN",description:"腰部特写 - 黄金分割构图",instruction:`
【拍摄部位】腰部设计特写（腰带、收腰、腰线、腰部装饰）

【构图技巧】
📷 拍摄角度：微倾斜正面角度（机身倾斜10-15度，增加动感）
📐 黄金分割：腰线放置在画面黄金分割点（上下1:1.618比例）
🎨 画面占比：腰部区域占画面70-80%

【光线设置】
💡 主光源：环绕光（多个柔光源从前方和两侧包围拍摄对象）
✨ 光线效果：360度均匀照明，消除硬阴影，突出腰部曲线
🌟 高光强化：腰部最细处有轻微高光，突出收腰效果

【风格特征】
🎯 时尚动感、活力十足
🎯 微倾斜构图增加视觉张力
🎯 环绕光突出腰部立体曲线
🎯 强调沙漏型身材和腰线设计

【必须展示】腰部曲线优美、收腰设计清晰、腰带/装饰精致`},{name:"FABRIC_MACRO",description:"面料微距 - 纤维级细节",instruction:`
【拍摄部位】面料微观纹理（编织纹路、织物肌理、纤维结构）

【构图技巧】
📷 拍摄角度：极致微距拍摄（等效100mm微距镜头效果）
📐 放大倍率：面料纹理放大至能看到单根纤维
🎨 画面占比：面料纹理充满整个画面（95%以上）

【光线设置】
💡 主光源：侧逆光（光源来自侧后方120度角）
✨ 光线效果：强烈的侧逆光勾勒每根纤维边缘，产生透射效果
🌟 质感强化：纤维边缘有金色轮廓光，纹理立体感极强

【风格特征】
🎯 科技感、专业级微距摄影
🎯 纤维级超清晰细节
🎯 侧逆光创造强烈质感
🎯 展示面料的工艺和品质

【必须展示】编织纹路清晰可数、纤维结构可见、材质肌理真实、光泽效果明显`},{name:"PATTERN_ASYMMETRIC",description:"印花图案 - 不对称构图",instruction:`
【拍摄部位】印花图案特写（花卉图案、几何图案、品牌Logo、印花细节）

【构图技巧】
📷 拍摄角度：正面拍摄或微侧10度
📐 不对称构图：图案主体偏离中心，放置在画面1/3或2/3位置
🎨 画面占比：印花图案占画面60-75%，留有呼吸空间

【光线设置】
💡 主光源：柔和正面光（柔光箱均匀照明）
✨ 光线效果：均匀柔和，色彩还原最佳，无强烈阴影
🌟 色彩真实：准确还原印花的每一个颜色，饱和度自然

【风格特征】
🎯 色彩还原优先、清新自然
🎯 不对称构图增加视觉趣味
🎯 强调印花设计的艺术感
🎯 平面化展示，色彩鲜明

【必须展示】印花图案完整清晰、色彩还原准确、边缘锐利、设计精美`},{name:"DECORATION_SPARKLE",description:"装饰闪耀 - 珠宝级拍摄",instruction:`
【拍摄部位】装饰元素特写（珠片、亮片、钻石、金属扣、刺绣、水晶）

【构图技巧】
📷 拍摄角度：对角线构图（装饰从左上延伸到右下，或右上到左下）
📐 动态张力：利用对角线创造视觉动感
🎨 画面占比：装饰元素占画面70-85%

【光线设置】
💡 主光源：点光源（聚光灯般的集中强光）
✨ 光线效果：创造星芒效果、璀璨闪耀
🌟 高光爆发：每个珠片、亮片都有清晰的高光和星芒
💫 反射：金属装饰有镜面反射，钻石有七彩折射

【风格特征】
🎯 珠宝级拍摄标准
🎯 极致华丽、璀璨夺目
🎯 星芒效果和强烈反光
🎯 奢华、高级、闪耀

【必须展示】装饰璀璨闪耀、星芒效果明显、反光强烈、细节精致、奢华感十足`},{name:"SKIRT_FLOWING",description:"裙摆飘逸 - 梦幻仙气",instruction:`
【拍摄部位】裙摆飘逸特写（裙摆动态、飘逸感、裙子下摆）

【构图技巧】
📷 拍摄角度：低角度仰拍（相机位置低于裙摆，向上拍摄）
📐 仰拍优势：突出裙摆的飘逸感和轻盈感
🎨 画面占比：飘动的裙摆占画面75-90%

【光线设置】
💡 主光源：逆光（光源在裙摆后方）
✨ 光线效果：光线穿透薄纱，创造梦幻透光效果
🌟 边缘发光：裙摆边缘有金色/银色轮廓光
💫 半透明：如果是薄纱面料，展示透光的仙气感

【风格特征】
🎯 梦幻、仙气、飘逸
🎯 逆光创造柔和光晕
🎯 强调裙摆的轻盈和飘动感
🎯 浪漫、唯美、ethereal风格

【必须展示】裙摆飘逸动感、透光梦幻、边缘发光、轻盈灵动、仙气十足`},{name:"BACK_DESIGN",description:"背部设计 - 后方细节",instruction:`
【拍摄部位】背部设计特写（拉链、蝴蝶结、背部镂空、交叉绑带、后背装饰）

【构图技巧】
📷 拍摄角度：正后方拍摄，相机平行于背部
📐 画面占比：背部设计占画面70-80%
🎨 对称构图：背部设计居中展示

【光线设置】
💡 主光源：柔和顶光（从斜上方照射）
✨ 光线效果：突出背部立体感、拉链光泽、蝴蝶结层次
🌟 轮廓光：边缘有轻微轮廓光，突出背部曲线

【风格特征】
🎯 精致、细节导向
🎯 展示背面隐藏的设计巧思
🎯 拉链、扣子等五金件有金属光泽
🎯 蝴蝶结等装饰有立体层次

【必须展示】背部设计完整清晰、拉链/扣子精致、装饰细节立体、工艺考究`},{name:"DRAPE_SILHOUETTE",description:"垂坠轮廓 - 侧面剪影",instruction:`
【拍摄部位】面料垂坠轮廓（裙子/连衣裙的侧面垂坠线条、面料重量感）

【构图技巧】
📷 拍摄角度：纯侧面拍摄（90度侧面）
📐 画面占比：服装侧面轮廓占画面60-70%
🎨 剪影效果：半剪影处理，强调轮廓线条

【光线设置】
💡 主光源：侧逆光或完全逆光
✨ 光线效果：创造半剪影效果，轮廓清晰、内部细节若隐若现
🌟 边缘高光：服装边缘有明亮的轮廓光
💫 氛围感：神秘、高级、艺术感

【风格特征】
🎯 艺术化、剪影风格
🎯 强调面料的垂坠感和重量感
🎯 展示服装的优雅轮廓
🎯 半透明的朦胧美感

【必须展示】轮廓线条流畅、垂坠感明显、面料重量感真实、侧面曲线优美、艺术感强`},{name:"STITCHING_CRAFT",description:"缝线工艺 - 工匠精神",instruction:`
【拍摄部位】缝线工艺特写（走线细节、压线、车线、手工缝制痕迹、接缝处理）

【构图技巧】
📷 拍摄角度：极近距离+低角度侧拍（15-20度低角度）
📐 放大倍率：缝线占画面主体，能看到每一针
🎨 画面占比：缝线区域占画面80-90%

【光线设置】
💡 主光源：低角度侧光（光源贴近拍摄对象，从侧面照射）
✨ 光线效果：强烈的掠射光，凸显缝线的立体感和凹凸起伏
🌟 阴影强化：缝线产生的微小阴影清晰可见
💫 质感：突出手工缝制的精致和工艺细节

【风格特征】
🎯 工匠精神、职人品质
🎯 极致细节、精工细作
🎯 展示制作的用心和品质
🎯 专业、考究、高端

【必须展示】每一针缝线清晰、走线整齐、工艺精湛、立体感强、品质感突出`},{name:"COLLAR_DETAIL",description:"衣领细节 - 立体层次",instruction:`
【拍摄部位】衣领特写（翻领、立领、荷叶边领、衬衫领）

【构图技巧】
📷 拍摄角度：正面偏侧30度角
📐 画面占比：衣领占画面65-75%
🎨 层次展示：突出衣领的立体层次和折叠结构

【光线设置】
💡 主光源：45度侧顶光
✨ 光线效果：明暗层次分明，突出衣领的每一层褶皱
🌟 立体塑形：光影对比展示衣领的三维结构

【风格特征】
🎯 精致、立体、层次丰富
🎯 展示衣领的设计感和挺括度
🎯 强调衣领的建筑感

【必须展示】衣领挺括、层次清晰、立体感强、剪裁精良`},{name:"SLEEVE_CUFF",description:"袖口特写 - 精致收口",instruction:`
【拍摄部位】袖口设计特写（袖口装饰、纽扣、蕾丝边、袖口收紧）

【构图技巧】
📷 拍摄角度：近距离侧拍或正拍
📐 画面占比：袖口占画面70-80%
🎨 手部配合：手腕和手部姿态优雅，展示袖口佩戴效果

【光线设置】
💡 主光源：柔和侧光45度角
✨ 光线效果：突出袖口细节和装饰
🌟 高光：纽扣、金属扣有明显反光

【风格特征】
🎯 精致、优雅、细节导向
🎯 展示袖口的设计感
🎯 手部姿态配合展示佩戴效果

【必须展示】袖口设计精美、装饰清晰、手腕优雅、细节考究
【特别检查】先检查原图是否有袖子！如果是无袖设计，不拍摄此部位！`},{name:"BUTTON_DETAIL",description:"纽扣细节 - 金属质感",instruction:`
【拍摄部位】纽扣特写（纽扣、金属扣、品牌Logo扣、装饰扣）

【构图技巧】
📷 拍摄角度：微距正面拍摄
📐 画面占比：纽扣组占画面75-85%
🎨 排列展示：突出纽扣的排列和细节

【光线设置】
💡 主光源：点光源（集中照射）
✨ 光线效果：金属纽扣有强烈镜面反射
🌟 星芒：纽扣高光处产生星芒效果

【风格特征】
🎯 精致、高级、细节控
🎯 金属质感强烈
🎯 品牌Logo清晰

【必须展示】纽扣精致、金属光泽、刻字清晰、排列整齐`},{name:"POCKET_DESIGN",description:"口袋细节 - 功能美学",instruction:`
【拍摄部位】口袋设计特写（口袋形状、口袋装饰、口袋开口）

【构图技巧】
📷 拍摄角度：侧前方45度角
📐 画面占比：口袋占画面65-75%
🎨 功能展示：可展示手插入口袋的动作

【光线设置】
💡 主光源：柔和侧光
✨ 光线效果：突出口袋的立体感和深度
🌟 阴影：口袋开口有自然阴影，增加真实感

【风格特征】
🎯 实用与美学结合
🎯 展示剪裁和做工
🎯 功能性设计的细节

【必须展示】口袋设计合理、做工精致、立体感强、实用美观`},{name:"LACE_TEXTURE",description:"蕾丝质感 - 镂空艺术",instruction:`
【拍摄部位】蕾丝材质特写（镂空花纹、蕾丝编织、透视效果）

【构图技巧】
📷 拍摄角度：极近距离正面或侧面
📐 画面占比：蕾丝纹理占画面85-95%
🎨 透视展示：突出蕾丝的镂空透视效果

【光线设置】
💡 主光源：背面补光+正面柔光
✨ 光线效果：透光效果，每个镂空孔洞清晰可见
🌟 立体感：蕾丝纹理有明显的立体层次

【风格特征】
🎯 精致、复杂、艺术感
🎯 镂空透视的朦胧美
🎯 展示蕾丝工艺的复杂性

【必须展示】镂空花纹清晰、编织精密、透视效果美观、工艺复杂`},{name:"SILK_GLOSS",description:"丝绸光泽 - 流光溢彩",instruction:`
【拍摄部位】丝绸面料光泽（缎面反光、丝绸褶皱、流动光泽）

【构图技巧】
📷 拍摄角度：侧面或侧前45度角
📐 画面占比：丝绸光泽区域占画面70-85%
🎨 光泽强调：捕捉面料上流动的高光带

【光线设置】
💡 主光源：侧光60度角
✨ 光线效果：创造流动的光泽带、波纹状高光
🌟 丝绸特征：柔和的镜面反射、渐变高光

【风格特征】
🎯 奢华、光泽强烈
🎯 流动感、液体般的光泽
🎯 展示面料的高级感

【必须展示】光泽流动、反光明显、丝绸质感、高级奢华`},{name:"KNIT_STRUCTURE",description:"针织结构 - 编织肌理",instruction:`
【拍摄部位】针织面料结构（针织纹路、麻花编织、罗纹组织）

【构图技巧】
📷 拍摄角度：微距正面或侧面
📐 画面占比：针织纹理占画面80-90%
🎨 纹理展示：清晰展示编织的重复图案

【光线设置】
💡 主光源：45度侧光
✨ 光线效果：突出针织的立体纹路和凹凸感
🌟 质感：每一针都有阴影和高光

【风格特征】
🎯 温暖、手工感、质朴
🎯 展示编织的规律性和工艺
🎯 突出针织的立体感

【必须展示】针织纹路清晰、编织规律、立体感强、手工质感`},{name:"PLEATS_FOLD",description:"褶皱工艺 - 立体褶饰",instruction:`
【拍摄部位】褶皱工艺特写（百褶裙褶、抽褶设计、风琴褶、压褶）

【构图技巧】
📷 拍摄角度：侧面拍摄突出立体感
📐 画面占比：褶皱区域占画面75-85%
🎨 韵律展示：展示褶皱的重复韵律和节奏

【光线设置】
💡 主光源：侧光（强调褶皱的明暗交替）
✨ 光线效果：每一道褶皱有明显的明暗对比
🌟 立体感：褶皱的凸起和凹陷清晰可见

【风格特征】
🎯 规律、韵律、建筑感
🎯 展示褶皱的精密和均匀
🎯 立体层次丰富

【必须展示】褶皱整齐、间距均匀、立体感强、工艺精湛、韵律美感`},{name:"CHEST_AREA",description:"胸部区域 - 版型剪裁",instruction:`
【拍摄部位】胸部区域特写（胸线剪裁、省道、版型贴合度）

【构图技巧】
📷 拍摄角度：正面或侧前30度
📐 画面占比：胸部到腰部区域占画面70-80%
🎨 版型展示：突出服装对身材的修饰效果

【光线设置】
💡 主光源：柔和正面光配合侧光
✨ 光线效果：展示身材曲线和服装贴合度
🌟 立体感：胸线有自然光影塑形

【风格特征】
🎯 展示版型剪裁
🎯 突出身材修饰效果
🎯 强调服装合体性

【必须展示】版型贴合、剪裁精准、曲线优美、修身效果好`},{name:"HIP_CURVE",description:"臀部曲线 - 身材展示",instruction:`
【拍摄部位】臀部曲线特写（臀部线条、臀围剪裁、裙摆开叉起点）

【构图技巧】
📷 拍摄角度：侧后方45度角
📐 画面占比：臀部区域占画面65-75%
🎨 曲线强调：突出臀部曲线和S型身材

【光线设置】
💡 主光源：侧光配合顶光
✨ 光线效果：打亮臀部线条，展示曲线美
🌟 塑形：光影塑造立体臀型

【风格特征】
🎯 性感、曲线美
🎯 展示身材优势
🎯 突出修身效果

【必须展示】臀部曲线优美、剪裁合体、线条流畅、性感适度`},{name:"SLIT_DETAIL",description:"开叉细节 - 若隐若现",instruction:`
【拍摄部位】裙摆开叉特写（开叉高度、边缘处理、腿部若隐若现）

【构图技巧】
📷 拍摄角度：侧面拍摄（展示开叉效果）
📐 画面占比：开叉区域占画面70-80%
🎨 视觉引导：开叉线条引导视线向上

【光线设置】
💡 主光源：侧光或侧逆光
✨ 光线效果：开叉处有光影对比，若隐若现的性感
🌟 边缘光：开叉边缘有轻微高光

【风格特征】
🎯 性感、诱惑、优雅
🎯 若隐若现的美感
🎯 展示开叉设计

【必须展示】开叉高度适中、边缘整齐、腿部线条优美、若隐若现的性感`},{name:"NECKLINE_BONES",description:"锁骨区域 - 优雅性感",instruction:`
【拍摄部位】锁骨和颈部区域（锁骨线条、天鹅颈、颈部饰品）

【构图技巧】
📷 拍摄角度：正面微俯拍
📐 画面占比：锁骨区域占画面60-70%
🎨 线条美：突出锁骨的优美线条

【光线设置】
💡 主光源：顶光配合侧光
✨ 光线效果：锁骨凹陷处有阴影，突出骨骼线条
🌟 肌肤光泽：肌肤有健康光泽

【风格特征】
🎯 优雅、性感、骨感美
🎯 展示颈部和锁骨的线条
🎯 适合展示挂脖、抹胸等露肩设计

【必须展示】锁骨线条清晰、颈部修长、肌肤细腻、优雅性感`},{name:"HAND_GESTURE",description:"手部姿态 - 优雅细节",instruction:`
【拍摄部位】手部姿态特写（手型、手指、手势、戒指/手镯）

【构图技巧】
📷 拍摄角度：近距离多角度（根据手势选择最佳角度）
📐 画面占比：手部占画面70-80%
🎨 姿态美：展示手部的优雅姿态

【光线设置】
💡 主光源：柔和侧光
✨ 光线效果：突出手指的纤细和骨节
🌟 饰品反光：戒指、手镯有强烈反光

【风格特征】
🎯 优雅、精致、女性化
🎯 展示手部的美感
🎯 饰品点缀

【必须展示】手指纤细、姿态优雅、肌肤细腻、饰品精致`},{name:"BELT_WAIST",description:"腰带细节 - 收腰强化",instruction:`
【拍摄部位】腰带特写（腰带扣、腰带材质、收腰效果、腰带装饰）

【构图技巧】
📷 拍摄角度：正面或侧前30度
📐 画面占比：腰带区域占画面70-80%
🎨 收腰展示：突出腰带对身材的修饰效果

【光线设置】
💡 主光源：正面光配合侧光
✨ 光线效果：腰带扣有金属光泽，腰部曲线清晰
🌟 细腰强调：光影突出细腰效果

【风格特征】
🎯 强调收腰效果
🎯 展示腰带的装饰性和功能性
🎯 突出沙漏型身材

【必须展示】腰带精致、扣件清晰、收腰效果明显、身材曲线优美`},{name:"FABRIC_FLOW",description:"面料流动 - 动态飘逸",instruction:`
【拍摄部位】面料飘动特写（裙摆飞扬、丝巾飘动、面料动态）

【构图技巧】
📷 拍摄角度：捕捉动态瞬间
📐 画面占比：飘动的面料占画面80-90%
🎨 动感冻结：高速快门冻结飘动瞬间

【光线设置】
💡 主光源：侧逆光或逆光
✨ 光线效果：光线穿透薄纱，创造透光效果
🌟 边缘光：飘动面料边缘发光

【风格特征】
🎯 动感、自然、飘逸
🎯 捕捉运动瞬间
🎯 展示面料的轻盈和流动性

【必须展示】面料飘逸、动感自然、透光梦幻、轻盈灵动`},{name:"WALK_STRIDE",description:"行走步态 - 裙摆摆动",instruction:`
【拍摄部位】行走时的裙摆摆动（行走姿态、裙摆摆动、腿部动作）

【构图技巧】
📷 拍摄角度：侧面或侧前方拍摄
📐 画面占比：臀部到脚踝占画面75-85%
🎨 动态捕捉：展示行走时裙摆的自然摆动

【光线设置】
💡 主光源：侧光或正面光
✨ 光线效果：展示裙摆摆动的立体感
🌟 动感：面料有运动的光影变化

【风格特征】
🎯 自然、街拍感、动态
🎯 展示服装的动态美
🎯 真实的穿着效果

【必须展示】步态自然、裙摆摆动、动感十足、穿着效果真实`},{name:"SPIN_TWIRL",description:"旋转瞬间 - 裙摆飞扬",instruction:`
【拍摄部位】旋转时的裙摆飞扬（转圈动作、裙摆离心力张开）

【构图技巧】
📷 拍摄角度：正面或侧面
📐 画面占比：飞扬的裙摆占画面80-90%
🎨 圆周展示：裙摆呈圆形或伞形张开

【光线设置】
💡 主光源：环绕光或顶光
✨ 光线效果：裙摆每一层都清晰可见
🌟 动态光影：旋转产生的动态光影效果

【风格特征】
🎯 活泼、动感、浪漫
🎯 展示裙摆的蓬度和层次
🎯 捕捉旋转的梦幻瞬间

【必须展示】裙摆飞扬、圆形张开、层次丰富、动感强烈、梦幻浪漫`},{name:"LEG_LINE",description:"腿部线条 - 修长美腿",instruction:`
【拍摄部位】腿部线条特写（大腿到脚踝、腿部轮廓、裙摆与腿部关系）

【构图技巧】
📷 拍摄角度：侧面或侧前45度
📐 画面占比：腿部占画面70-85%
🎨 拉长效果：低角度拍摄强调腿部修长感

【光线设置】
💡 主光源：侧顶光
✨ 光线效果：突出腿部线条和肌肤光泽
🌟 塑形：光影塑造腿部的修长感

【风格特征】
🎯 性感、修长、线条美
🎯 展示腿部优势
🎯 突出开叉或短款设计

【必须展示】腿部修长、线条流畅、肌肤光滑、比例完美`},{name:"COLLAR_SHOULDER",description:"领肩连线 - 优雅天鹅颈",instruction:`
【拍摄部位】颈部到肩部的连接线条（天鹅颈、肩颈线、锁骨到肩膀）

【构图技巧】
📷 拍摄角度：侧面或侧后45度
📐 画面占比：颈部到肩部占画面65-75%
🎨 线条美：突出颈部到肩部的流畅曲线

【光线设置】
💡 主光源：侧光配合顶光
✨ 光线效果：突出颈部修长和肩部柔美
🌟 肌肤光泽：健康自然的肌肤光泽

【风格特征】
🎯 优雅、纤细、高级
🎯 展示颈肩部的线条美
🎯 适合展示露肩、挂脖等设计

【必须展示】颈部修长、肩部柔美、线条流畅、优雅高级`},{name:"OVERALL_TEXTURE",description:"整体质感 - 半身大特写",instruction:`
【拍摄部位】半身质感特写（上半身整体、面料+肌肤+装饰的综合质感）

【构图技巧】
📷 拍摄角度：正面或侧前30度
📐 画面占比：胸部到腰部占画面75-85%
🎨 质感综合：展示服装、肌肤、装饰的整体高级感

【光线设置】
💡 主光源：柔和环绕光
✨ 光线效果：均匀照明，突出整体质感
🌟 细节丰富：每个部位都有细节和质感

【光格特征】
🎯 高级、精致、综合展示
🎯 展示服装的整体品质感
🎯 强调细节的丰富性

【必须展示】质感丰富、细节精致、整体高级、品质感强`},{name:"SIDE_PROFILE",description:"侧面轮廓 - 完美曲线",instruction:`
【拍摄部位】身体侧面轮廓（胸-腰-臀的S曲线、裙装侧面廓形）

【构图技巧】
📷 拍摄角度：纯侧面90度拍摄
📐 画面占比：腰部到大腿占画面70-80%
🎨 曲线展示：突出S型身材曲线

【光线设置】
💡 主光源：侧逆光
✨ 光线效果：创造轮廓光，勾勒完美曲线
🌟 身材强调：光影强化身材的凹凸有致

【风格特征】
🎯 性感、曲线美、侧影美学
🎯 展示身材和服装的完美契合
🎯 强调沙漏型身材

【必须展示】S型曲线明显、胸腰臀比例完美、轮廓优美、身材性感`},{name:"ACCESSORY_FOCUS",description:"配饰聚焦 - 点睛之笔",instruction:`
【拍摄部位】服装配饰特写（项链、耳环、腰链、胸针、别针）

【构图技巧】
📷 拍摄角度：特写角度根据配饰位置调整
📐 画面占比：配饰占画面60-70%，保留周围服装环境
🎨 点睛效果：配饰与服装形成呼应

【光线设置】
💡 主光源：点光源照射配饰
✨ 光线效果：配饰有强烈反光和闪耀
🌟 星芒：金属/钻石有星芒效果

【风格特征】
🎯 精致、华丽、点睛
🎯 展示搭配的完整性
🎯 配饰增强整体高级感

【必须展示】配饰精致、反光强烈、与服装搭配完美、画龙点睛`},{name:"FULL_DRAPE",description:"整体垂坠 - 面料重力美学",instruction:`
【拍摄部位】服装整体垂坠效果（从肩部到裙摆的完整垂坠线条）

【构图技巧】
📷 拍摄角度：正侧面或侧前方
📐 画面占比：服装的完整侧面轮廓占画面80-90%
🎨 垂坠线：展示面料自然下垂的优美弧线

【光线设置】
💡 主光源：侧光或侧逆光
✨ 光线效果：突出面料的重量感和垂坠感
🌟 层次感：不同层次的面料有不同的明暗

【风格特征】
🎯 优雅、自然、垂坠美
🎯 展示面料的品质和重量感
🎯 强调服装的整体廓形

【必须展示】垂坠自然、线条流畅、面料重量感真实、廓形优美`}],Rp=(r,d)=>Fs[r%Fs.length],Op=(r,d)=>d===1?fu[0]:fu[r%fu.length],xp=(r,d,u)=>{switch(r){case"UPPER_BODY":return`
🚨 HARD COMPOSITION LOCK: UPPER_BODY 🚨
This image must be cropped from TOP OF HEAD down to WAIST / UPPER HIP only.

ABSOLUTE FRAME RULE:
✅ full head must be visible
✅ shoulders / torso / arms / hands can be visible
✅ bottom edge must stop at waist or upper hip
✅ image reads as upper-body portrait / ecommerce upper-body framing

ABSOLUTELY FORBIDDEN IN THIS IMAGE:
❌ thighs
❌ hips below upper-hip framing
❌ knees
❌ calves
❌ feet
❌ full body silhouette
❌ composition extending to lower body

THIS IS NOT A FULL BODY IMAGE.
THIS IS NOT A 3/4 BODY IMAGE.

If any leg part appears, this image is wrong and must be regenerated.
If the viewer can see the full body, this image is wrong and must be regenerated.

For batch generation (${u+1}/${d}), this rule applies to THIS image with zero exception.
`;case"HEADLESS_UPPER":return`
🚨 HARD COMPOSITION LOCK: HEADLESS_UPPER 🚨
This image must be cropped from SHOULDERS/COLLARBONE down to WAIST/HIP only.

ABSOLUTE FRAME RULE:
✅ top edge starts at shoulders/collarbone
✅ bottom edge ends at waist/upper hip
✅ only torso / arms / hands visible

ABSOLUTELY FORBIDDEN IN THIS IMAGE:
❌ head
❌ face
❌ hair
❌ forehead
❌ eyes
❌ nose
❌ mouth
❌ chin
❌ ears
❌ neck above collarbone
❌ thighs
❌ knees
❌ legs
❌ feet

THIS IS NOT A PORTRAIT.
THIS IS NOT A HALF-BODY WITH HEAD.
THIS IS NOT A FULL BODY.

If any head part appears, this image is wrong and must be regenerated.
If any leg part appears, this image is wrong and must be regenerated.

For batch generation (${u+1}/${d}), this rule applies to THIS image with zero exception.
`;case"CLOSEUP":return`
🚨 HARD COMPOSITION LOCK: TRUE CLOSEUP 🚨
This image must be a REAL DETAIL CLOSEUP, not a portrait and not a half-body shot.

ABSOLUTE FRAME RULE:
✅ only one garment detail area is the visual subject
✅ the chosen detail occupies 70%-90% of the entire frame
✅ camera is very close to the subject
✅ the image reads like an ecommerce detail page closeup

ABSOLUTELY FORBIDDEN IN THIS IMAGE:
❌ full person visible
❌ half body visible
❌ 3/4 body visible
❌ head + torso together as main composition
❌ large background area
❌ multiple body regions competing equally

THIS MUST LOOK LIKE:
✅ neckline closeup
✅ fabric texture macro
✅ sleeve / cuff / embellishment detail
✅ waist detail
✅ sequin / stitch / drape detail

If the first impression is “a woman standing there”, then it is WRONG.
The first impression must be “a garment detail closeup”.
For batch generation (${u+1}/${d}), this rule applies to THIS image with zero exception.
`;case"HEADLESS_FULL":return`
🚨 HARD COMPOSITION LOCK: HEADLESS_FULL 🚨
This image must be cropped from SHOULDERS / COLLARBONE down to FEET.

ABSOLUTE FRAME RULE:
✅ full body below shoulders must be visible
✅ legs and feet must be present
✅ top edge starts at shoulders / collarbone

ABSOLUTELY FORBIDDEN IN THIS IMAGE:
❌ hair
❌ forehead
❌ eyes
❌ nose
❌ mouth
❌ chin
❌ ears
❌ any head part

If any head part appears, this image is wrong and must be regenerated.
For batch generation (${u+1}/${d}), this rule applies to THIS image with zero exception.
`;case"HEADLESS_LOWER":return`
🚨 HARD COMPOSITION LOCK: HEADLESS_LOWER 🚨
This image must be cropped from WAIST / HIP down to FEET only.

ABSOLUTE FRAME RULE:
✅ lower body only
✅ hips / legs / knees / calves / feet visible
✅ upper frame starts around waist / hip

ABSOLUTELY FORBIDDEN IN THIS IMAGE:
❌ head
❌ face
❌ hair
❌ shoulders
❌ chest
❌ full upper torso
❌ arms as main visible body region

If upper torso appears prominently, this image is wrong and must be regenerated.
For batch generation (${u+1}/${d}), this rule applies to THIS image with zero exception.
`;default:return""}},Np=async(r,d,u,s,h,b,E,R,v,g)=>{var Xe,Be,Ye,Se,St,at;console.log(`🎨 开始生成第 ${R+1}/${v} 张图片...`);const _=yp.getNextKey(),U=Op(R,v),z=E==="CLOSEUP"?Rp(R):null,F=xp(E,v,R),k=g?Tp(g.type):je,$=k[R%k.length];console.log(z?`🎯 特写部位: ${z.description}`:`📷 拍摄角度: ${U.description}`),console.log(`💃 姿势动作: ${$.description}`),g&&console.log(`🛍️ 商品类型: ${g.description}`),await qs(200,800);const G=[],V=/缎|丝| satin|silk|silky|lustrous|shiny/i.test(s)?`
🚨🚨🚨 SATIN / SILK MATERIAL LOCK — ABSOLUTE HARD CONSTRAINT 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The garment in the reference is a SMOOTH SATIN / SILK-LIKE fabric.

MANDATORY MATERIAL IDENTITY:
✅ Preserve the exact satin-like smoothness, sleek finish, flowing sheen, and liquid highlight transitions from the original.
✅ The blouse surface must look TIGHT, SMOOTH, POLISHED, and LUXURIOUS — like premium satin under studio light.
✅ Highlight bands must be broad, continuous, silky, and clean.
✅ The fabric plane over chest / waist / abdomen must read as smooth stretched satin, NOT rumpled fabric.

ABSOLUTELY FORBIDDEN:
❌ Do NOT generate orange-peel texture, grainy sheen, broken highlight patches, chalky white fabric, or frosted reflections.
❌ Do NOT create extra diagonal pull wrinkles across the torso.
❌ Do NOT create dented, collapsed, bubbly, or uneven cloth surface.
❌ Do NOT let the abdomen or under-bust area become more wrinkled than the original.
❌ Do NOT turn satin into matte fabric, cotton-like fabric, cheap polyester sheen, or metallic foil.

SURFACE TARGET:
✅ Upper torso surface should be cleaner and smoother than the current failed generations.
✅ Mid torso / abdomen must be visually flatter, silkier, and more refined.
✅ Any remaining folds must be only elegant macro drape logic from the garment construction, never random micro-wrinkles.

ULTRA-STRICT TORSO FLATNESS:
✅ The chest-to-waist panel must read as one smooth satin plane.
✅ The abdomen area must be almost perfectly flat and polished.
✅ The under-bust to waist zone must NOT show diagonal drag wrinkles.
✅ The central torso must look like professionally steamed luxury satin on-body.
✅ Prefer a cleaner, smoother torso surface even if that means reducing minor fold variation.

FINAL CHECK FOR SATIN:
✓ Does it still look like the same satin top from the original? → MUST YES
✓ Is the torso fabric smoother than previous failed outputs? → MUST YES
✓ Are highlight transitions continuous and luxurious? → MUST YES
✓ Is there any random wrinkling on chest/waist/abdomen? → MUST NO
✓ Does the torso panel look almost flat like premium steamed satin? → MUST YES
If any answer fails → REGENERATE.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:"",K=h&&h.trim().length>0,W=E.startsWith("HEADLESS_"),fe=E==="HEADLESS_UPPER",Q=E==="UPPER_BODY",ee=E==="CLOSEUP",P=!W;if(G.push({type:"text",text:`
════════════════════════════════════════════════════════════════════
🚫 MANDATORY PRE-GENERATION DIRECTIVE — READ THIS FIRST, ALWAYS 🚫
════════════════════════════════════════════════════════════════════

INPUT IMAGE = CONTENT REFERENCE ONLY.
❌ IGNORE all quality attributes of the input: blur, noise, low-res, compression artifacts, haze.
❌ DO NOT mimic the input image's blurriness, softness, or low-quality texture.
❌ NO upscaling, NO compositing, NO directly enlarging the source image.

✅ THIS IS A COMPLETE FULL REDRAW FROM SCRATCH.
✅ OUTPUT QUALITY: 8K ULTRA-HD — razor-sharp, zero noise, zero blur, zero compression artifacts.
✅ OUTPUT ASPECT RATIO: EXACTLY 268:357 — this is mandatory, no other ratio allowed.
✅ Every edge must be crisp. Every fabric thread visible. Professional commercial photography grade.
✅ Standard: Tier-1 fashion brand flagship store — top ecommerce retouch + brand-level commercial photography.

${V}

${F}

${Q?`
🚨 ULTRA STRICT CROPPING ENFORCEMENT: UPPER_BODY ONLY 🚨
This generation must stop at waist / upper hip.
Legs are forbidden.
Do not show thighs, knees, calves, or feet.
If the image looks like full body or 3/4 body, regenerate immediately.
`:""}

${ee?`
🚨 ULTRA STRICT CROPPING ENFORCEMENT: TRUE DETAIL CLOSEUP ONLY 🚨
The frame must be dominated by one garment detail area.
Do not output a standing person photo.
Do not output full body, half body, or 3/4 body.
If the result still looks like a model portrait instead of a garment detail, regenerate immediately.
`:""}

════════════════════════════════════════════════════════════════════

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🚨🚨🚨 ABSOLUTE TOP PRIORITY #0: COMPLETE IMAGE REGENERATION! 🚨🚨🚨
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

⛔⛔⛔ THIS IS THE MOST IMPORTANT RULE - READ BEFORE ANYTHING ELSE! ⛔⛔⛔

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CORE MANDATE: You must generate a COMPLETELY NEW, FULLY RE-DRAWN image!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【完全重新绘制 - 最高优先级！】
✅✅✅ 必须从零开始重新绘制一张完整的全新照片
✅✅✅ 每一个像素都是全新生成的，不是从原图复制、裁剪、拉伸、编辑的
✅✅✅ 最终生成的图片必须看起来像一张全新拍摄的专业摄影作品

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
⛔⛔⛔ ULTRA CRITICAL: FULL-BODY POSE CHANGE = HANDS + LEGS BOTH MUST CHANGE! ⛔⛔⛔
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

🚨🚨🚨🚨🚨 【换动作核心原则 - 手部和腿部必须同时改变！】 🚨🚨🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔⛔⛔ "换动作"不是只换手的位置！腿部姿势也必须同时改变！ ⛔⛔⛔
⛔⛔⛔ 如果只有手臂/手部动作变了，腿部姿势和原图一样 → 换动作失败！ ⛔⛔⛔
⛔⛔⛔ 一张成功的换动作图片 = 手部有新动作 + 腿部有新动作！ ⛔⛔⛔

【什么是"成功的换动作"？】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅✅✅ 正确的换动作：手臂位置变了 + 腿部姿势也变了 → 成功！
❌❌❌ 错误的换动作：手臂位置变了 + 腿部和原图一模一样 → 失败！去重失败！
❌❌❌ 错误的换动作：只是微调手指位置，腿和身体没有变化 → 失败！
❌❌❌ 错误的换动作：整体姿势和原图几乎一样，只是细微差异 → 失败！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【手部动作必须改变的内容（至少3项不同）】
✅ 手臂举起/放下/叉腰/交叉/撩发/扶腰/插口袋等
✅ 手指张开/合拢/握拳/自然弯曲等
✅ 手臂角度：张开/贴身/弯曲/伸直等
✅ 双手的协调动作：一手叉腰一手下垂 / 双手抱臂 / 一手撩发 等
✅ 手与身体的关系：手放在哪里（髋部/腰部/头发/身侧/胸前 等）

【腿部动作必须改变的内容（至少2项不同）- 同等重要！！！】
✅ 双腿站立方式：并拢/分开/交叉/前后站等
✅ 重心分配：平均/偏左/偏右/单腿支撑等
✅ 膝盖弯曲：双腿直立/一腿微曲/一腿前伸等
✅ 脚的位置和方向：并拢/一前一后/打开/脚尖方向等
✅ 双腿之间的间距：紧靠/自然分开/大步等
✅ 腿部线条：笔直/S型/交叉/一腿侧踏等

【具体的腿部姿势变化示例 - 每张图必须用不同的腿部姿势】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦵 腿部变化1：双腿自然并拢，重心均匀分布
🦵 腿部变化2：左腿前伸，右腿承重，重心偏右
🦵 腿部变化3：右腿略微弯曲，左腿直立支撑
🦵 腿部变化4：双腿交叉站立（一腿在前一腿在后）
🦵 腿部变化5：大步姿势，一腿明显前迈
🦵 腿部变化6：双腿微微打开，宽于肩膀
🦵 腿部变化7：一腿侧踏，创造不对称姿态
🦵 腿部变化8：单腿微微翘起脚跟
🦵 腿部变化9：左腿后撤一步，展示行走感
🦵 腿部变化10：一腿稍微外转，展示侧面线条
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【换动作成功检查清单 - 生成前必须全部确认】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 1. 手臂/手部的位置和姿势与原图明显不同吗？→ 必须YES
✓ 2. 腿部的站姿/重心/弯曲与原图明显不同吗？→ 必须YES（关键！！）
✓ 3. 整体身体姿态（角度/扭转/倾斜）与原图不同吗？→ 必须YES
✓ 4. 如果把新图和原图并排对比，一眼就能看出动作不同吗？→ 必须YES
✓ 5. 腿部的变化是否足够明显（不只是1-2厘米的微调）？→ 必须YES
✓ 6. 是否像"完全换了一个Pose重新拍了一张"？→ 必须YES

🔴🔴🔴 如果第2项或第5项是NO → 整张图片直接判定失败！🔴🔴🔴
🔴🔴🔴 腿部不变 = 换动作失败！这是硬性要求！🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

【四大致命错误 - 绝对禁止！】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴🔴🔴 致命错误0.5：改变服装款式/颜色/图案 → 立即失败！（最严重的错误！）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ 服装必须与原图100%完全一致！任何改变都是致命错误！⛔⛔⛔
❌ 绝对禁止：改变服装颜色（黑色不能变白色！红色不能变粉色！）
❌ 绝对禁止：改变服装图案（有花纹不能变纯色！红花不能变其他花！）
❌ 绝对禁止：改变服装款式（吊带不能变抹胸！长裙不能变短裙！）
❌ 绝对禁止：改变服装材质（雪纺不能变缎面！薄纱不能变棉质！）
❌ 绝对禁止：改变服装裁剪（A字裙不能变直筒！修身不能变宽松！）
❌ 绝对禁止：生成完全不同的衣服（这是"换动作"不是"换衣服"！）

🚨🚨🚨 "换动作"的定义 = 同一件衣服 + 不同姿势！🚨🚨🚨
🚨🚨🚨 如果衣服变了 → 这不是换动作，是换衣服，完全错误！🚨🚨🚨

✅ 正确做法：
• 仔细观察原图中服装的：颜色、图案、款式、长度、材质、装饰
• 在新姿势中100%精确复制相同的服装
• 每一个细节都必须与原图一致：颜色相同、图案相同、款式相同
• 如果原图是黑底红花吊带裙 → 生成图也必须是黑底红花吊带裙
• 如果原图是白色连衣裙 → 生成图也必须是白色连衣裙
• 绝对不允许"创造性地"改变服装的任何属性！

🔴🔴🔴 致命错误1：图像拉伸/变形 → 立即失败！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 绝对禁止：拉伸原图来改变比例或适应构图
❌ 绝对禁止：缩放、拉长、压扁原图的任何部分
❌ 绝对禁止：对原图进行几何变换来模拟姿势变化
❌ 绝对禁止：身体比例不自然（脖子过长、手臂过长、腿部拉伸等）
✅ 正确做法：完全重新绘制自然比例的人体，不依赖原图像素

🔴🔴🔴 致命错误2：丢失背景/白色背景 → 立即失败！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 绝对禁止：生成白色背景、空白背景、纯色背景
❌ 绝对禁止：背景缺失、背景不完整、背景部分空白
❌ 绝对禁止：只生成人物而没有背景环境
❌ 绝对禁止：抠图后贴到白色画布上
✅ 正确做法：参考原图的背景场景，完全重新绘制相同风格的完整背景
✅ 背景必须填满整个画面，不能有任何空白区域
✅ 背景的场景、色调、元素必须与原图保持一致

${P?`
🔴🔴🔴 致命错误3：丢失头部/去头 → 立即失败！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ 当前构图是"${E==="FULL_BODY"?"完整全身":"上半身"}"，必须包含完整头部！⛔⛔⛔
❌ 绝对禁止：裁掉头部或让头部超出画面
❌ 绝对禁止：模糊头部、虚化面部、遮挡头部
❌ 绝对禁止：头部被画面顶部裁切
❌ 绝对禁止：只保留身体而去掉头部
❌ 绝对禁止：用任何方式隐藏或省略头部
✅ 正确做法：生成完整的、清晰的、自然的头部和面部
✅ 头部必须完整显示在画面内，包括：头发、额头、眼睛、鼻子、嘴巴、下巴
✅ 面部表情自然、眼神有神、头发自然飘逸
✅ 头顶上方必须有足够的留白空间（不能顶天）

🚨🚨🚨 重复强调：这不是无头构图！必须有完整的头部和面部！🚨🚨🚨
🚨🚨🚨 如果生成的图片没有头部 → 这是完全错误的！立即失败！🚨🚨🚨
`:`
🔴🔴🔴 致命错误3：头部出现 → 立即失败！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ 当前是无头构图，画面中不允许出现头部！⛔⛔⛔
`}

【完整图片生成检查清单 - 生成前必须全部确认】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 1. 这是一张完全重新绘制的全新图片吗？→ 必须是YES
✓ 2. 图片有完整的背景场景吗？（不是白色/空白）→ 必须是YES
✓ 3. 背景与原图的场景风格一致吗？→ 必须是YES
${P?`✓ 4. 图片包含完整的头部和面部吗？→ 必须是YES
✓ 5. 头部清晰自然，没有被裁切或模糊吗？→ 必须是YES`:"✓ 4. 图片从肩部开始，没有头部吗？→ 必须是YES"}
✓ 6. 人体比例自然，没有拉伸变形吗？→ 必须是YES
✓ 7. 服装款式与原图完全一致吗？→ 必须是YES
✓ 8. 整张图片看起来像全新拍摄的专业照片吗？→ 必须是YES

如果任何一项是NO → 不要生成！重新调整后再生成！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡💡💡 正确理解"换动作"的含义：
• "换动作" = 保持相同的服装、背景、人物特征，只改变身体姿势
• 具体做法：参考原图的所有信息，用新的姿势重新绘制一张完整的照片
• 最终结果：一张看起来是同一个人、穿同样的衣服、在同一个场景、用不同姿势拍摄的全新照片
• 关键：每一个像素都是重新生成的，不是对原图的任何形式的编辑或变换

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

${W?`
�🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
⛔⛔⛔ CRITICAL REQUIREMENT #0: HEADLESS COMPOSITION - NO HEAD! ⛔⛔⛔
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
THIS IS HEADLESS COMPOSITION!
THE FRAME MUST START FROM SHOULDERS/COLLARBONE!
ABSOLUTELY NO HEAD, FACE, NECK, OR HAIR IN THE IMAGE!
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

BEFORE GENERATION, CONFIRM:
✓ Is this headless composition? → YES
✓ Will the frame start from shoulders? → YES  
✓ Will there be ANY head/face visible? → NO! ABSOLUTELY NO!
✓ If head appears, is it a FAILURE? → YES! COMPLETE FAILURE!

IF HEAD/FACE/NECK APPEARS IN IMAGE → IMMEDIATE TOTAL FAILURE!
DO NOT PROCEED UNTIL YOU CONFIRM: NO HEAD IN FINAL IMAGE!

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

`:""}
💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎
💎💎💎 SUPREME PRIORITY #0: E-COMMERCE PRODUCT PHOTOGRAPHY STANDARD 💎💎💎
💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎

🛍️🛍️🛍️ THIS IS A PROFESSIONAL E-COMMERCE PRODUCT PHOTO! 🛍️🛍️🛍️
The generated image MUST look like a premium online fashion store listing photo.
Reference standard: Shein, Zara, H&M, ASOS product listing photography.
The image must make customers WANT TO BUY the product immediately!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨🎨🎨 【COLOR TEMPERATURE MATCHING - #1 PRIORITY!】 🎨🎨🎨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ THE MOST COMMON FATAL ERROR IS COLOR TEMPERATURE MISMATCH! ⛔⛔⛔
⛔⛔⛔ GENERATED IMAGE MUST EXACTLY MATCH THE ORIGINAL IMAGE'S COLOR TEMPERATURE! ⛔⛔⛔

🔴🔴🔴 SPECULAR GLOSS / FABRIC FINISH MUST ALSO MATCH EXACTLY! 🔴🔴🔴
⛔ Do NOT change the garment's sheen level, gloss pattern, satin luster, highlight width, or reflective behavior.
⛔ If the original fabric is smooth luminous satin with broad soft highlights, the generated result must preserve that exact same finish.
⛔ Do NOT make the fabric duller, harsher, waxier, chalkier, more metallic, or more wrinkled than the original.

【强制色彩标准 - 精确匹配原图色温！】
✅ Color temperature: MUST EXACTLY MATCH the original/reference image!
   • If original is warm (golden hour, indoor warm light) → generated must also be warm!
   • If original is cool (daylight, studio flash) → generated must also be cool!
   • If original is neutral → generated must also be neutral!
✅ White balance: COPY EXACTLY from reference image - do NOT add any bias!
✅ White fabrics: Must appear the SAME shade as in the original image
   • If whites look warm/cream in original → keep them warm/cream (do NOT make pure white!)
   • If whites look pure white in original → keep them pure white
✅ Skin tone: Must match the original image's skin tone EXACTLY - same warmth, same hue
✅ Overall tone: Must be IDENTICAL to the original image's color grading
✅ Background: Must have the SAME color temperature as the original background
✅ Shadows: Must have the SAME shadow color tone as the original

❌ FATAL ERRORS - Color temperature mismatch:
❌ Generated image is COOLER/BLUER than original → TOTAL FAILURE!
❌ Generated image is WARMER/YELLOWER than original → TOTAL FAILURE!
❌ White clothes change shade compared to original → TOTAL FAILURE!
❌ Fabric gloss / satin sheen / reflective finish differs from original → TOTAL FAILURE!
❌ Skin tone looks different from original → TOTAL FAILURE!
❌ Background color temperature shifted → TOTAL FAILURE!
❌ Any visible color cast that doesn't exist in original → TOTAL FAILURE!

✅ CORRECT COLOR STANDARD:
✅ Side-by-side with original, the color temperature looks IDENTICAL
✅ Whites match the exact same shade as in the original
✅ Skin tone warmth is the same as original
✅ Background hue and tone match the original exactly
✅ Overall color grading is indistinguishable from the original

💡 Color matching rule: ALWAYS match the original image's color temperature!
💡 DO NOT add any blue/cyan shift! DO NOT add any warm/yellow shift!
💡 DO NOT assume the image should be cooler or warmer - just MATCH the original!
💡 The reference image IS the ground truth for color temperature!
💡 曝光必须与原图一致！不能比原图更亮或更暗！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👗👗👗 【WRINKLE-FREE PRISTINE FABRIC - #2 PRIORITY!】 👗👗👗
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ FABRIC MUST BE ABSOLUTELY WRINKLE-FREE AND PRISTINE! ⛔⛔⛔

🔴 IMPORTANT DISTINCTION:
✅ Remove only accidental micro-wrinkles, messy crumpling, random bunching, and uneven puckering
✅ Preserve the original fabric type, original drape logic, original satin surface finish, and original highlight flow
❌ Do NOT introduce new folds, new tension wrinkles, new crease directions, or a different material appearance

✅ Fabric condition: Brand new, freshly pressed, just out of luxury packaging
✅ Surface: Completely smooth, no creases, no wrinkles, no fold marks
✅ Texture: Clear fabric texture visible but NO random wrinkles
✅ Edges: Clean, sharp garment edges - no fraying, no loose threads
✅ Fit: Garment sits perfectly on the model's body, tailored look
✅ Drape: Natural elegant draping, NOT crumpled or bunched up

❌ FATAL WRINKLE ERRORS:
❌ Visible shipping/folding creases → TOTAL FAILURE!
❌ Random wrinkles on fabric surface → TOTAL FAILURE!
❌ Bunched up or crumpled fabric → TOTAL FAILURE!
❌ Fabric looks old, worn, or used → TOTAL FAILURE!
❌ New wrinkles appear that were not present in the original → TOTAL FAILURE!
❌ Original satin sheen becomes weaker/rougher/different → TOTAL FAILURE!

💡 Think of it as: brand new from a luxury boutique, freshly steamed by a stylist
�💡 面料必须像刚从高级精品店取出，经过专业造型师熨烫整理
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💃💃💃 【FASHION MODEL BODY & POSE AESTHETICS - #3 PRIORITY!】 💃💃💃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ MODEL MUST LOOK LIKE A PROFESSIONAL FASHION E-COMMERCE MODEL! ⛔⛔⛔

【完美电商模特体态标准】
✅ Body proportions: Slim, tall (1:8+ head-to-body ratio), elegant
✅ Waistline: Defined, slim waist with natural hourglass curve
✅ Legs: Long, straight, slender - at least 60% of total height
✅ Posture: Perfect upright posture, chest up, shoulders back
✅ Skin: Flawless, smooth, healthy glow (but natural, not over-retouched)
✅ Overall impression: Young, fashionable, confident, aspirational

【有购买欲望的动作标准 - Make People Want To Buy!】
✅ Pose must SHOWCASE the garment's best features:
   • If it's a dress: show the silhouette, waistline, and flow of the skirt
   • If it's a top: show the neckline, sleeve design, and fit
   • If it's pants: show the leg line and shape
✅ Pose must look CONFIDENT and ATTRACTIVE:
   • Slight body angle (not perfectly straight) for dynamic feel
   • One hand on hip or touching hair for femininity
   • Weight shifted to one leg for natural S-curve
   • Chin slightly up for confidence
✅ Pose must be NATURAL yet POLISHED:
   • Like a professional model on a photo shoot
   • Not stiff or awkward - fluid and effortless
   • Expression (if face visible): confident, slight smile or sultry look
✅ Limb positioning must be ELEGANT:
   • Fingers naturally spread, not clenched
   • Arms create pleasing lines, not stuck to body
   • Legs create length and shape

❌ POSE FATAL ERRORS:
❌ Stiff, robotic, mannequin-like pose → TOTAL FAILURE!
❌ Awkward hand/finger positions → TOTAL FAILURE!
❌ Body looks boxy or shapeless → TOTAL FAILURE!
❌ Posture is slouching or hunched → TOTAL FAILURE!
❌ Pose hides/obscures the garment → TOTAL FAILURE!

💡 Reference: Look at Shein/DONICY/Zara model poses - confident, fashionable, selling the look
💡 目标：让看到图片的人立刻想下单购买这件衣服！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨✨✨ 【FABRIC GLOSS & CLARITY - #4 PRIORITY!】 ✨✨✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ FABRIC MUST HAVE CORRECT GLOSS, TEXTURE AND ULTRA SHARPNESS! ⛔⛔⛔

🚨 THE GLOSS MUST MATCH THE ORIGINAL GARMENT, NOT A GENERIC "LUXURY FABRIC" LOOK.
🚨 Copy the exact gloss intensity, softness, spread of highlights, and satin reflection pattern from the original image.
🚨 For satin/silk garments: preserve the original smooth continuous sheen bands and do NOT replace them with patchy wrinkled reflections.
🚨 For this kind of satin top, the torso area should look EXTRA SMOOTH — broad highlight bands, minimal interruption, minimal wrinkle noise.

✅ Fabric appearance: Looks EXPENSIVE, HIGH-QUALITY, DESIRABLE
✅ Gloss: Appropriate for material type:
   • Silk/Satin → Smooth, flowing highlights, lustrous sheen
   • Cotton → Soft matte with subtle texture highlight
   • Polyester blend → Clean, even surface reflection
   • Lace → Delicate, intricate detail with gentle glow
✅ Clarity: ULTRA SHARP - can see individual thread patterns when zoomed
✅ Color: VIVID, SATURATED, TRUE-TO-LIFE (not washed out!)
✅ Lighting on fabric: Bright overhead studio-style light creating:
   • Clear highlight zones on raised areas
   • Gentle shadow in recessed areas
   • Overall bright and evenly lit

❌ FABRIC FATAL ERRORS:
❌ Fabric looks dull, matte, lifeless → TOTAL FAILURE!
❌ Fabric looks like plastic or rubber → TOTAL FAILURE!
❌ Blurry/soft fabric texture → TOTAL FAILURE!
❌ Washed out or desaturated colors → TOTAL FAILURE!
❌ Over-smoothed fabric losing all texture → TOTAL FAILURE!
❌ Satin highlight pattern no longer matches original → TOTAL FAILURE!
❌ Fabric appears more wrinkled or more crumpled than original → TOTAL FAILURE!

💡 标准：面料看起来高档、有质感、让人想触摸
💡 清晰度：放大后能看到织物纤维细节
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧵🧵🧵 【v4.0 FABRIC MICRO-STRUCTURE — 5 MANDATORY RULES】 🧵🧵🧵
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ THIS IS THE #1 REASON GENERATED IMAGES LOOK FAKE — MISSING FABRIC DETAIL! ⛔⛔⛔
Brand photos look real because you can SEE the weave. We must match that level.

🧵 RULE 1: WEAVE / KNIT MICRO-STRUCTURE (织物微观结构)
   • Every fabric MUST show its underlying weave or knit structure at pixel level
   • Jacquard (提花): clearly visible interlocking warp/weft pattern creating the design
   • Tweed (粗花呢): visible multi-colored yarn threads intertwined, each individual thread distinguishable
   • Lace (蕾丝/镂空绣): every single openwork hole must be individually rendered, thread bridges visible
   • Knit (针织): V-shaped or loop stitches clearly visible in repeated rows
   • Woven plain (平纹): criss-cross thread grid visible when zoomed
   • DO NOT simplify or blur these structures — they ARE the fabric!

🧵 RULE 2: THREAD-LEVEL DETAIL (线程级细节)
   • Individual threads/yarns must be resolvable when zoomed to 200%
   • Thread thickness, twist direction, and ply count should match the real material
   • Tweed: you must see individual colored thread strands (red, blue, white threads mixed)
   • Lace: the bobbin thread path must be traceable through the openwork
   • Embroidery (刺绣): individual stitch lines must be visible with raised thread texture
   • Satin (缎面): the long float threads creating the sheen must be individually hinted
   • NEVER render fabric as a flat color fill or smooth gradient — threads must exist!

🧵 RULE 3: SURFACE GLOSS & LIGHT INTERACTION (表面光泽与光线交互)
   • Light must interact with individual threads, not just the fabric surface
   • Silk: each thread catches light at slightly different angles → shimmering effect
   • Velvet: light absorbed in one direction, reflected in another → depth effect
   • Sequins/Beads: each individual piece must have its own specular highlight
   • Organza/Chiffon: light must pass THROUGH the fabric showing translucency
   • The micro-roughness of the weave must create realistic light scattering

🧵 RULE 4: PHYSICAL DRAPE & GRAVITY (物理垂感与重力)
   • Fabric must obey gravity and drape according to its weight and stiffness
   • Heavy fabrics (wool, tweed): structured drape with minimal folds, maintains shape
   • Light fabrics (chiffon, silk): flowing drape with many soft folds, catches air
   • Stiff fabrics (organza, taffeta): holds shape, creates architectural folds
   • The drape pattern must be physically plausible — no floating or defying gravity
   • Fold depth and frequency must match the material weight

🧵 RULE 5: MATERIAL PHYSICS BEHAVIOR (材质物理行为)
   • Each material has unique behavior that must be accurately represented:
   • Stretch fabrics: subtle tension lines visible at body curves
   • Crisp fabrics: sharp fold edges, geometric drape lines
   • Soft fabrics: rounded fold edges, organic drape curves
   • Sheer fabrics: skin/underlayer partially visible through fabric
   • Textured fabrics: surface irregularities visible (bouclé bumps, cable knit relief)
   • The fabric must BEHAVE like its real-world counterpart in every detail

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 FABRIC MICRO-STRUCTURE CHECK — BEFORE GENERATING:
✓ Can you see the weave/knit pattern? → MUST BE YES
✓ Are individual threads distinguishable at 200% zoom? → MUST BE YES
✓ Does light interact with thread-level detail? → MUST BE YES
✓ Does the fabric drape match its physical weight? → MUST BE YES
✓ Does the material behave like its real counterpart? → MUST BE YES
🔴 If ANY answer is NO → The fabric will look FAKE & CGI → FAILURE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✂️✂️✂️ 【v4.0 SILHOUETTE & PATTERN SHARPENING — 版型与轮廓强化】 ✂️✂️✂️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Core goal: The garment's CUT, SHAPE, and DESIGN must be instantly recognizable at a glance.

【边缘锐化 — 结构线必须干净锐利】
✅ Shoulder seams, neckline, waistline, hemline, side seams: apply subtle edge sharpening
✅ White piping, binding, and trim edges: render with crisp, clean boundary lines
✅ A-line skirt hem curvature: render as a precise, smooth arc — no ambiguity
✅ Strapless top edge: sharp, clean, not blending into skin
✅ Structure lines must NOT merge with background or skin — always a clear boundary

【平整还原 — 陈列级挺括感】
✅ Remove wrinkles, loose threads, stains — restore garment-on-mannequin flatness
✅ The garment should look like it's on a professional styling stand before shooting
✅ Pattern pieces should lay flat and true to their design intent
✅ Avoid distortion of the pattern/silhouette by random fabric bunching

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡💡💡 【v4.0 LIGHT & SHADOW SCULPTING — 光影塑形优化】 💡💡💡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Use soft front/side lighting (柔和顺光/侧光) exclusively
✅ Create natural light-to-shadow gradients at waist, bodice, and skirt areas
✅ Precisely sculpt the hourglass silhouette + full skirt 3D volume
✅ Eliminate messy shadows and dead-black zones — structure lines must be clean and transparent
✅ The buyer should see the garment's layer and dimension WITHOUT thinking
✅ Shadow direction must be consistent across the entire garment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨🎨🎨 【v4.0 COLOR & TEXTURE RESTRAINT — 色彩与质感克制】 🎨🎨🎨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Garment main color: do NOT artificially boost saturation — only correct white balance & unify tone
✅ Skin & background: slightly reduce saturation to weaken environmental distraction
✅ The garment must be the ABSOLUTE visual center — everything else is secondary
✅ Decorative details (white piping, mesh, bows): boost CONTRAST only, preserve original hue & saturation
✅ Cross-image consistency: same series/link images must have identical tone, brightness, color temp
✅ Do NOT over-smooth skin or over-soften focus — preserve natural fabric texture and skin grain
✅ Material must serve the silhouette, not overpower it — texture supports, not distracts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐📐📐 【v4.0 COMPOSITION & DISPLAY STANDARD — 构图与展示规范】 📐📐📐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Centered composition + front-facing slight angle (居中+正面微侧视角)
✅ Garment subject occupies 80-90% of frame height, uniform margins on all sides
✅ Model pose: natural & relaxed, arms must NOT block waist/hem/key structure areas
✅ Full garment silhouette must be completely visible — no cropping of design-critical areas
✅ The viewer must see the COMPLETE garment design at first glance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸📸📸 【OVERALL E-COMMERCE PHOTOGRAPHY CHECKLIST】 📸📸📸
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before generating, confirm ALL of these:
✓ Color: Cool/neutral, NO yellow cast, whites are pure white?
✓ Fabric: Wrinkle-free, pristine, freshly pressed look?
✓ Body: Slim, tall, perfect proportions, attractive?
✓ Pose: Confident, fashionable, shows garment beautifully?
✓ Clarity: Ultra sharp, can see fabric texture details?
✓ Gloss: Appropriate material sheen, looks expensive?
✓ Brightness: Well-lit, slightly bright, not dark or muddy?
✓ Overall: Would this image make someone want to BUY this product?

IF ANY ANSWER IS NO → FIX IT BEFORE GENERATING!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🔴🔴🔴 MANDATORY OUTPUT SPECIFICATIONS - NO EXCEPTIONS ALLOWED! 🔴🔴🔴
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫🚫🚫 【核心前提 - 输入画质与输出画质完全独立】 🚫🚫🚫
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

上传图片仅提供内容参考（人物、服装、姿态、场景）。
✅ 完全忽略原图的：清晰度、画质、模糊感、噪点、压缩痕迹
✅ 禁止模仿原图的：任何劣质视觉表现
✅ 本次任务性质：【整体全新重绘】——拒绝素材合成，拒绝直接放大处理
✅ 无论原图多模糊多低清，输出必须达到8K超高清顶级商业标准

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 【强制画质标准】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 分辨率：超高清 8K 级别
• 输出比例：严格遵守 268:357（精确比例，无需固定像素尺寸）
• 清晰度：超锐利，放大后仍无模糊
• 噪点：绝对零噪点
• 压缩痕迹：完全消除
• 边缘：清晰利落，无虚化
• 光影：干净通透，高级细腻，层次丰富
• 色彩：柔和精准，无偏色

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

${E==="UPPER_BODY"||E==="HEADLESS_UPPER"?`
⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔
ABSOLUTE REQUIREMENT #2: UPPER BODY = NO LEGS! STOP AT WAIST!
⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔

🚨🚨🚨 CURRENT COMPOSITION: ${E==="UPPER_BODY"?"UPPER BODY":"HEADLESS UPPER BODY"} 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ THIS IS "UPPER BODY" - NOT "FULL BODY"! ⚠️⚠️⚠️
⚠️⚠️⚠️ FRAME ENDS AT WAIST/HIP - NO LEGS! NO KNEES! NO FEET! ⚠️⚠️⚠️
⚠️⚠️⚠️ IF YOU SEE LEGS OR FEET → YOU FAILED! ⚠️⚠️⚠️

MANDATORY CHECKS BEFORE GENERATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: What is the composition type? → ANSWER: ${E==="UPPER_BODY"?"UPPER BODY":"HEADLESS UPPER BODY"}
Q: Can I show legs in the frame? → ANSWER: ABSOLUTELY NO!
Q: Where does the frame end? → ANSWER: AT WAIST/HIP LEVEL!
Q: What if I see knees in the result? → ANSWER: COMPLETE FAILURE!
Q: Does upper body include legs? → ANSWER: NO! LEGS ARE LOWER BODY!

✅✅✅ ONLY PROCEED IF ALL ANSWERS ARE CORRECT! ✅✅✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPPER BODY COMPOSITION BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ INCLUDE: ${E==="HEADLESS_UPPER"?"Shoulders (top frame edge)":"Head & Hair"}, Shoulders, Arms, Hands, Torso, Waist
❌ EXCLUDE: Thighs, Knees, Legs, Calves, Feet, Ankles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMMEDIATE FAILURE CONDITIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 If knees are visible → FAILED (this is full body, not upper body!)
🔴 If thighs are visible → FAILED (frame extends too low!)
🔴 If feet are visible → FAILED (completely wrong!)
🔴 If complete dress/skirt with legs → FAILED (this is full body!)
🔴 If frame bottom goes below waist → FAILED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REMEMBER: "UPPER BODY" = WAIST AND ABOVE ONLY! NO LEGS!
⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔

`:""}

${E==="CLOSEUP"?`
⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔ ABSOLUTE REQUIREMENT #2B: CLOSEUP = NO PERSON SHOT! ⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔

🚨 CURRENT COMPOSITION: CLOSEUP 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ This is a GARMENT DETAIL shot.
⚠️ Not a full-body image.
⚠️ Not an upper-body portrait.
⚠️ Not a 3/4-body fashion pose.

MANDATORY CHECKS BEFORE GENERATION:
Q: What is the composition type? → ANSWER: TRUE DETAIL CLOSEUP
Q: Can I show the full model? → ANSWER: ABSOLUTELY NO
Q: What should dominate the frame? → ANSWER: ONE garment detail area occupying 70%-90%
Q: If the result looks like a person photo, is it correct? → ANSWER: NO, COMPLETE FAILURE

FAILURE CONDITIONS:
🔴 If a full standing model is visible → FAILED
🔴 If upper body portrait is visible as main subject → FAILED
🔴 If multiple body regions compete equally → FAILED
🔴 If background occupies too much area → FAILED
🔴 If garment detail does not dominate the frame → FAILED

REMEMBER: CLOSEUP = DETAIL FIRST, PERSON LAST.
`:""}

🔴🔴🔴🔴🔴 CRITICAL REQUIREMENT - ULTRA HIGH QUALITY & SHARPNESS 🔴🔴🔴🔴🔴

MANDATORY IMAGE QUALITY STANDARDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴🔴🔴🔴🔴 ULTRA CRITICAL RESOLUTION & FORMAT - ABSOLUTE MANDATORY! 🔴🔴🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 【无论输入图片大小，输出必须符合以下标准！】 ⚠️⚠️⚠️

✅✅✅ RESOLUTION: Generate DIRECTLY at 2680x3570 pixels (EXACT SIZE! MANDATORY!)
   🔴 即使上传的产品图只有700KB、1MB或任何大小
   🔴 即使参考图分辨率很低或质量很差
   🔴 输出图片必须强制为 2680x3570 像素
   🔴 这是绝对要求，没有任何例外！
   🔴 批量生成时，每一张都必须是2680x3570像素！

✅✅✅ FORMAT: PNG format ONLY - Lossless, uncompressed, maximum quality
   🔴 必须是PNG格式（不是JPEG）
   🔴 绝对不允许JPEG压缩
   🔴 保持无损质量
   🔴 批量生成时，每一张都必须是PNG格式！

✅✅✅ FILE SIZE: MUST be 2-3MB (STRICTLY ENFORCED FOR ALL IMAGES!)
   🔴 文件大小必须在2-3MB范围内
   🔴 不允许小于2MB（说明细节不足或压缩过度）
   🔴 不允许大于3MB（说明文件过大）
   🔴 批量生成时，每一张都必须是2-3MB！

🔴🔴🔴 BATCH GENERATION SPECIAL REQUIREMENT 🔴🔴🔴
${v>1?`⚠️⚠️⚠️ 当前是批量生成${v}张图片，每一张都必须：
   • 分辨率：2680x3570像素（每张都一样！）
   • 格式：PNG无损格式（每张都一样！）
   • 文件大小：2-3MB（每张都一样！）
   • 不允许有的图符合标准，有的图不符合！
   • 所有${v}张图片的尺寸和质量必须完全一致！`:""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ULTRA SHARP: Every single detail must be crystal clear and razor sharp
✅ CRISP EDGES: All edges must be perfectly defined, NO blur, NO softness
✅ DETAILED TEXTURES: Fabric weave, textile grain MUST be clearly visible
✅ NO BLUR: Absolutely NO blurring, NO smoothing, NO softening anywhere
✅ PROFESSIONAL QUALITY: Match high-end fashion photography studio standards
✅ RICH DETAILS: Focus on generating sharp, detailed content at maximum resolution
✅ GLOSSY FABRICS: Fabric must have STRONG highlights and reflections showing premium material quality

STRICTLY FORBIDDEN - WILL CAUSE IMMEDIATE FAILURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ NEVER blur the image or any part of it
❌ NEVER smooth or soften edges or textures
❌ NEVER reduce sharpness or clarity
❌ NEVER apply any form of blur filter or gaussian blur
❌ NEVER sacrifice detail for composition
❌ NEVER generate low resolution or soft images
❌ NEVER generate images smaller than 2MB (indicates insufficient detail/quality)

QUALITY CHECK BEFORE GENERATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Can you see fabric weave texture when zoomed in? → MUST BE YES
✓ Are all edges perfectly sharp? → MUST BE YES
✓ Is there ANY blur or softness? → MUST BE NO
✓ Does it match professional studio photography? → MUST BE YES
✓ Will the file size be 2-3MB? → MUST BE YES
✓ Is the resolution at least 1650x2200 pixels? → MUST BE YES
✓ Does fabric have strong glossy highlights? → MUST BE YES

🔴🔴� IF IMAGE IS BLURRY OR SOFT IN ANY WAY → COMPLETE FAILURE 🔴🔴🔴
🔴🔴🔴 IF FILE SIZE IS LESS THAN 2MB → QUALITY INSUFFICIENT → FAILURE 🔴🔴🔴

🔴🔴🔴 CRITICAL RESOLUTION REQUIREMENTS 🔴🔴🔴
⚠️⚠️⚠️ Generate DIRECTLY at 2680x3570 pixels (EXACT SIZE!) ⚠️⚠️⚠️
⚠️⚠️⚠️ PNG format ONLY - NO JPEG compression ⚠️⚠️⚠️
⚠️⚠️⚠️ File size MUST be 2-3MB (enforced) ⚠️⚠️⚠️
⚠️⚠️⚠️ DO NOT generate smaller and upscale - causes blurriness! ⚠️⚠️⚠️
⚠️⚠️⚠️ ALL composition styles must achieve these exact specs! ⚠️⚠️⚠️

🔴🔴🔴🔴🔴 【关键约束：输入质量不影响输出质量！】 🔴🔴🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ 参考图片质量与生成图片质量完全独立！⛔⛔⛔

【核心原则 - 必须100%遵守】
✅✅✅ 即使上传的产品图/细节图很模糊 → 生成图必须高清
✅✅✅ 即使参考图分辨率低 → 生成图必须高分辨率
✅✅✅ 即使参考图质量差 → 生成图必须达到专业摄影级别
✅✅✅ 参考图仅用于提取：构图、服装款式、颜色、背景等信息
✅✅✅ 生成图的质量标准：完全独立，始终保持最高水准

【严格禁止的错误理解】
❌ 错误：参考图模糊，所以生成图也可以模糊 → 绝对错误！
❌ 错误：参考图质量差，生成图跟着降低质量 → 绝对错误！
❌ 错误：复制参考图的模糊程度到生成图 → 绝对错误！

【正确的处理方式】
✅ 从参考图中提取：服装款式、颜色、构图、背景环境
✅ 生成新图片时：以最高质量标准重新绘制，超高清、超锐利
✅ 即使参考图很模糊：生成的图片依然要清晰到可以看到面料纹理

【实际操作标准】
💡 把参考图当作"设计草图"来理解：
   • 从草图中理解要什么款式、什么颜色、什么构图
   • 但最终作品必须是高清、专业、锐利的摄影作品
   • 不要复制草图的画质，而是按照最高标准重新创作

💎 生成质量标准 - 永远保持不变：
   • 超高清分辨率（至少1650x2200像素或更大）
   • 文件大小：2-3MB（所有构图风格）
   • 所有细节清晰锐利
   • 面料纹理清晰可见
   • 专业摄影棚级别的质量
   
⚠️⚠️⚠️ 关键：输入低质量 ≠ 输出低质量！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╔═══════════════════════════════════════════════════════╗
║        换动作处理模式 - 严格执行以下规则           ║
╚═══════════════════════════════════════════════════════╝

🆔 Generation Session: ${Xs} | Image ${R+1}/${v}
⚡ Create a UNIQUE and FRESH pose variation for this session - different from any previous generation!


${v>1?`
🔴🔴🔴🔴🔴 【批量生成一致性约束 - 最高优先级】 🔴🔴🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ 当前是批量生成模式（共${v}张），所有图片必须保持一致性！⛔⛔⛔
⛔⛔⛔ 这是第 ${R+1}/${v} 张图片 ⛔⛔⛔

【必须保持100%一致的元素】
✅✅✅ 图片质量标准：所有${v}张图片的清晰度必须完全相同
✅✅✅ 文件大小：所有${v}张图片都必须达到2-3MB
✅✅✅ 色温色调：所有${v}张图片的色温、白平衡必须完全一致
✅✅✅ 光线质感：所有${v}张图片的光线方向、强度、质感必须一致
✅✅✅ 背景场景：所有${v}张图片的背景环境必须完全相同
✅✅✅ 服装款式：所有${v}张图片的服装细节必须完全一致
✅✅✅ 人物特征：所有${v}张图片的肤色、身材必须完全一致
✅✅✅ 面料质感：所有${v}张图片的面料纹理、光泽必须一致
✅✅✅ 锐度对比度：所有${v}张图片的清晰度、对比度必须一致

【绝对禁止的不一致现象】
❌ 禁止有的图清晰，有的图模糊
❌ 禁止有的图偏黄，有的图色温正常
❌ 禁止有的图细节丰富，有的图细节缺失
❌ 禁止有的图质感好，有的图质感差
❌ 禁止有的图亮度高，有的图亮度低
❌ 禁止有的图锐利，有的图柔和
❌ 禁止背景细节在不同图片中有差异
❌ 禁止服装款式在不同图片中有变化
❌ 禁止有的图2-3MB，有的图只有600KB

【批量一致性检查标准】
🔴 这是第 ${R+1}/${v} 张图片
🔴 必须与其他所有图片保持完全相同的质量标准
🔴 必须与其他所有图片保持完全相同的色温色调
🔴 必须与其他所有图片保持完全相同的清晰度
🔴 必须与其他所有图片保持完全相同的文件大小（2-3MB）
🔴 必须与其他所有图片保持完全相同的尺寸（2680x3570像素）
🔴 唯一可以变化的是：姿势和拍摄角度
🔴 除姿势外，其他所有方面必须100%一致

🔴🔴🔴 【批量生成姿势多样性要求 - 关键！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 每张图片的姿势必须不同！绝对不能重复！⚠️⚠️⚠️

【姿势多样性强制要求】
✅ 第1张：使用一种独特的姿势（例如：双手自然下垂）
✅ 第2张：使用完全不同的姿势（例如：一手叉腰，一手摸头发）
✅ 第3张：再次变化姿势（例如：双手抱臂）
✅ 每一张都必须有明显不同的姿势变化
✅ 手臂位置、身体姿态、重心分配都要有变化
✅ 不允许姿势相似或重复

❌ 严格禁止：${v}张图片的姿势看起来一样或相似
❌ 严格禁止：只有微小差异，整体姿势雷同
❌ 严格禁止：重复使用相同的手臂位置或身体姿态

💡 姿势变化示例：
• 变化一：双手自然下垂 → 一手叉腰 → 双手抱臂 → 一手撩发
• 变化二：站立姿势 → 微侧身 → S型身姿 → 半转身
• 变化三：重心平均 → 重心偏左 → 重心偏右 → 动态姿势

⚠️⚠️⚠️ 当前第${R+1}张必须有独特的姿势，与其他${v-1}张明显不同！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${fe?`
🔴🔴🔴🔴🔴 【批量无头上半身铁律 - 每一张都必须无头】 🔴🔴🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ 当前构图是 HEADLESS_UPPER，批量生成时最容易出现的问题：前几张无头，但其中1-2张偷偷生成了头部。
⛔ 这种情况绝对不允许发生。

【本批次每一张都必须满足】
✅ 顶部从肩部/锁骨开始
✅ 不出现头发、额头、眼睛、鼻子、嘴巴、下巴、耳朵、后脑勺
✅ 底部在腰部/臀部结束，不出现大腿、膝盖、脚

【逐张检查原则】
🔴 第1张必须无头
🔴 第2张必须无头
🔴 第3张必须无头
🔴 ……
🔴 第${R+1}张当前也必须无头

【批量场景下的绝对禁止】
❌ 禁止“多数无头，但有一两张有头也算通过”
❌ 禁止“角度变化时，偶尔露出头部一点点”
❌ 禁止“为了构图美观，放宽顶部裁切”

结论：批量生成时，无头上半身约束不是平均生效，而是对每一张100%生效。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}

💡 正确标准：
• 把所有${v}张图片并排放在一起
• 除了姿势不同外，其他所有方面应该看起来像来自同一次拍摄
• 质量、色温、光线、背景、服装、肤色等完全一致
• 不应该有任何"风格跳跃"或"质量不稳定"的感觉

⚠️⚠️⚠️ 批量模式必须确保所有图片的一致性！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`:""}

🚨🚨🚨🚨🚨 【最最最高优先级：完全重绘整张图片！】 🚨🚨🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ 绝对禁止抠图、局部重绘、图像编辑等操作！⛔⛔⛔

【严格执行标准 - 完全重绘】
✅✅✅ 必须从零开始重新绘制整张图片
✅✅✅ 每个像素都是重新生成的，不是从原图复制的
✅✅✅ 背景、人物、服装全部重新绘制
✅✅✅ 不允许使用抠图、蒙版、局部编辑等技术
✅✅✅ 不允许复制粘贴原图的任何部分

【绝对禁止的操作】
❌ 禁止从原图抠出人物再换背景
❌ 禁止只修改局部区域，其他区域保持不变
❌ 禁止使用图层蒙版或选区工具
❌ 禁止复制粘贴原图的任何像素
❌ 禁止使用图像编辑软件的修改工具
❌ 禁止保留原图的任何技术痕迹

✅ 正确做法：完全重新绘制，生成全新的高质量图片
❌ 错误做法：在原图基础上进行任何形式的修改或编辑

⚠️⚠️⚠️ 这是一张全新的高清重绘图片，不是编辑后的图片！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨🚨🚨🚨🚨 【超高优先级：高清晰度、高质感要求！】 🚨🚨🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔⛔⛔ 生成的图片必须达到专业摄影级别的清晰度和质感！⛔⛔⛔

【超高清晰度要求】
✅✅✅ 分辨率：至少1650x2200像素或更大，确保高分辨率
✅✅✅ 文件大小：必须达到2-3MB（所有构图风格），信息量丰富的高质量图片
✅✅✅ 锐度：所有细节必须清晰锐利，边缘明确
✅✅✅ 细节：能够放大查看面料纹理、编织细节
✅✅✅ 对比度：适当的对比度，不能过度平滑或模糊
✅✅✅ 清晰范围：从焦点到背景都要有清晰的层次

【超高质感要求 + 光泽增强】
✅✅✅ 面料纹理：编织纹路、织物肌理必须清晰可见、高度还原
✅✅✅ 材质光泽：丝绸的柔和光泽、缎面的反光效果必须真实且强烈
✅✅✅ 光泽增强：面料必须有明显的高光和反光，展现材质的高级感和豪华感
✅✅✅ 立体感：光影变化、褶皱起伏必须有明显的三维效果
✅✅✅ 细微纹理：棉麻的粗糙纹理、蕾丝的镂空细节必须精确
✅✅✅ 装饰物：珠片、亮片、刺绣必须有立体感和强烈的反光效果
✅✅✅ 真实感：面料看起来有重量感、垂坠感、真实的材质特性
✅✅✅ 光线效果：光线照射在面料上必须产生明显的高光和阴影对比

【绝对禁止的低质量表现】
❌ 禁止图片模糊、细节不清晰
❌ 禁止面料看起来像塑料、橡胶、过于平滑
❌ 禁止质感缺失，看不出材质特性
❌ 禁止过度平滑、涂抹感、失去纹理细节
❌ 禁止低分辨率、像素化、锯齿边缘
❌ 禁止光影不真实、缺乏立体感
❌ 禁止颜色失真、色彩不饱满
❌ 禁止面料光泽不足、哑光、缺乏反光
❌ 禁止高光效果不明显、材质看起来廉价

【质量检查清单】
✓ 放大查看时，面料纹理是否清晰可见？
✓ 光线照射下，材质光泽是否真实自然且强烈？
✓ 面料上是否有明显的高光和反光效果？
✓ 褶皱处是否有明暗对比和立体感？
✓ 边缘是否清晰锐利，没有模糊？
✓ 整体是否达到专业摄影作品的质量？
✓ 是否完全重绘，没有任何抠图或编辑痕迹？
✓ 图片分辨率是否足够大（至少1650x2200像素）？
✓ 文件大小是否达到2-3MB标准？

💎💎💎 目标：生成媲美专业摄影棚拍摄的高质量图片！💎💎💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${W?`
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🚨🚨🚨 【最最最最最高优先级：无头构图 - 绝对不能显示头部！】 🚨🚨🚨
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔
⛔⛔⛔ 当前是无头构图模式！画面中绝对不允许出现头部！⛔⛔⛔
⛔⛔⛔ 这是第${R+1}/${v}张图片 - 每一张都必须是无头构图！⛔⛔⛔
⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔

${E==="HEADLESS_UPPER"?`
🔴🔴🔴🔴🔴 【无头上半身特别警告 - 双重裁剪！】 🔴🔴🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 无头上半身 = 上面砍头 + 下面砍腿！⚠️⚠️⚠️
⚠️⚠️⚠️ 画面从肩部开始，到腰部结束！⚠️⚠️⚠️
⚠️⚠️⚠️ 不能有头！不能有腿！只有躯干和手臂！⚠️⚠️⚠️

🚨 额外强调：不能出现“半个头”“一缕头发”“一点下巴”“一点后脑勺”。
🚨 头部不是弱约束，而是零容忍约束。
🚨 即使一批生成多张，也不能有任何一张例外。

【当前第${R+1}张的检查清单 - 必须全部通过】
✓ 画面顶部是从肩部开始的吗？（不是从头部）→ 必须是YES
✓ 画面中完全看不到头部吗？→ 必须是YES
✓ 画面底部是在腰部结束的吗？（不是到脚）→ 必须是YES
✓ 画面中完全看不到腿和脚吗？→ 必须是YES
✓ 这张图的姿势与其他${v-1}张不同吗？→ 必须是YES

如果任何一项是NO → 这张图片生成失败！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}

【生成前必须三重确认】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第一次确认：我将要生成一张无头构图的图片
第二次确认：画面必须从肩部/锁骨开始，不能有头部
第三次确认：如果出现头部任何部分，这张图就是失败的

【极度严格的检查标准 - 任何一项出现立即失败】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 头部（任何角度、任何部分）→ 立即失败
🔴 脸部（正面、侧面、背面）→ 立即失败
🔴 眼睛、鼻子、嘴巴 → 立即失败
🔴 颈部、下巴 → 立即失败
🔴 后脑勺 → 立即失败
🔴 头发（任何一根）→ 立即失败
🔴 耳朵 → 立即失败
🔴 额头 → 立即失败
🔴 脸部轮廓 → 立即失败
🔴 任何可以识别为头部的形状 → 立即失败

【所有拍摄角度都必须遵守】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 正面拍摄：从肩部/锁骨开始，看不到脸、头、脖子
⚠️ 侧面拍摄：从肩部开始，看不到脸部侧面轮廓、后脑勺
⚠️ 背面拍摄：从肩部/后颈开始，看不到后脑勺、头发
⚠️ 3/4角度：从肩部开始，看不到脸部、头部任何角度
⚠️ 所有角度：画面顶部边界必须正好在肩部/锁骨位置

【正确做法 - 必须100%执行】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅✅✅ 画面顶部必须从肩部/锁骨位置开始
✅✅✅ 画面中完全看不到头部
✅✅✅ 画面顶部没有被裁切的头部痕迹
✅✅✅ 构图时就不包含头部区域
✅✅✅ 就像相机镜头根本就没有拍到头部区域

【错误做法 - 绝对禁止】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 错误1：先画完整人物，再裁掉头部 → 禁止！
❌ 错误2：头部模糊/虚化但还在画面中 → 禁止！
❌ 错误3：只显示一点点下巴或头发 → 禁止！
❌ 错误4：画面顶部有头部的投影或轮廓 → 禁止！
❌ 错误5：任何可以让人感知到头部存在的元素 → 禁止！

【特别警告 - 这是最容易出错的地方】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 无头构图最常见错误：还是画了头部！
⚠️⚠️⚠️ 本次是第 ${R+1}/${v} 张，必须无头！
⚠️⚠️⚠️ 任何一张有头部都是失败的！
⚠️⚠️⚠️ 生成前再次确认：画面从肩部开始！

【最终检查问题】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
在生成前，请回答这些问题：
1. 我是否记得这是无头构图？→ 必须是"是"
2. 画面是否从肩部开始？→ 必须是"是"
3. 画面中是否有任何头部？→ 必须是"否"
4. 如果有头部会立即失败吗？→ 必须是"是"

✅ 正确标准：画面从肩部/锁骨开始，完全看不到头部的任何部分
❌ 错误标准：画面中出现头部、脸部、颈部、后脑勺、头发的任何部分

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
⚠️⚠️⚠️ 这是第 ${R+1}/${v} 张图片 - 必须是无头构图！⚠️⚠️⚠️
⚠️⚠️⚠️ 所有${v}张图片都必须从肩部开始，都不能有头部！⚠️⚠️⚠️
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

${E==="HEADLESS_UPPER"||E==="HEADLESS_FULL"?`
🔴🔴🔴 【批量无头构图额外检查】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 对于批量生成的每一张图片：
   • 第1张：无头 ✓
   • 第2张：无头 ✓
   • 第3张：无头 ✓
   • 第${R+1}张（当前）：必须无头 ✓
   • 任何一张有头部都是整批失败！

💡 每次生成前默念：这是无头构图，画面从肩部开始！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}

`:""}
🚨🚨🚨 【重要：保持自然真实状态！】 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 严格禁止任何后期美化处理！⚠️⚠️⚠️

【绝对禁止的处理】
❌ NO skin smoothing / beauty filter / face retouching
❌ NO softening / blurring edges or fabric texture
❌ NO shallow depth of field / background blur / bokeh effect
❌ NO image smoothing / noise reduction / sharpness reduction
❌ NO any post-processing beautification

【必须保持的状态】
✅ Raw, unprocessed, natural photography look
✅ All details sharp and clear (fabric, skin, background plants)
✅ Deep depth of field - everything in focus
✅ Natural texture visible on fabric and skin
✅ Background plants and environment sharp and detailed

【检查标准】
如果出现以下情况 → 立即失败：
❌ 人物边缘柔化/模糊
❌ 衣物纹理变平滑
❌ 背景植物细节模糊
❌ 皮肤过度平滑（磨皮）
❌ 整体看起来像处理过的照片

✅ 正确状态：保留原始拍摄的所有细节，未经美化处理
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨🚨🚨 【最高优先级2：完全匹配原图色温！】 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 色温偏差（偏冷或偏暖）是最常见的错误！必须特别注意！⚠️⚠️⚠️

【强制要求 - 精确匹配原图色温！】
✅ 色温必须与参考图完全相同 - 不能偏冷也不能偏暖！
✅ 白色必须与原图中白色的色调完全一致
✅ 不允许添加任何方向的色温偏移（不能偏蓝，也不能偏黄！）
✅ 光线颜色必须精确匹配原图 - Match exact lighting color temperature

【检查标准 - 与原图对比】
如果生成图与原图对比看起来：
❌ 偏蓝/偏冷 → 失败！（最常见的错误！）
❌ 偏黄/偏暖 → 失败！
❌ 白色色调与原图不同 → 失败！
❌ 肤色冷暖与原图不同 → 失败！
❌ 亮度明显不同 → 失败！

✅ 应该是：与原图并排对比，色温完全一致，看不出差异
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

��� 【重要：禁止生成拼接图/对比图】 ���
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 绝对禁止：生成包含多个姿势的拼接对比图
❌ 绝对禁止：生成2x2、3x3等网格布局的多姿势展示图
❌ 绝对禁止：在一张图片中显示同一人物的多个角度/姿势
❌ 绝对禁止：生成"before/after"、"多角度展示"等拼接效果

✅ 必须生成：单人单张完整图片
✅ 必须生成：一张图片中只有一个人物、一个姿势
✅ 必须生成：独立的、完整的单张作品
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${K?`
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
🚨🚨🚨 自定义指令 - 最高优先级 🚨🚨🚨
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

✍️ ${h}

⚠️⚠️⚠️ 重要：优先执行以上自定义指令！⚠️⚠️⚠️

【执行规则】
• 自定义指令中的要求必须优先满足
• 如果自定义指令与预设规则冲突，以自定义指令为准
• 自定义指令中明确指定的特征，必须100%遵守
• 例如：如果自定义指令说"要头部"，即使选择了无头构图也要显示头部
• 例如：如果自定义指令说"无头"，即使选择了完整构图也要裁掉头部

▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
📌 预设参考（仅作为参考，不与自定义指令冲突时才执行）
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
`:`
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
📸 当前构图类型 - 必须严格遵守
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
`}${Eh[E]||Eh.FULL_BODY}

${K?"":`▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
⚠️ 构图约束 - 最高优先级
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
• 裁剪范围必须精确执行
• 禁止显示的部位不能出现
• 必须显示的部位要完整清晰

${E==="HEADLESS_UPPER"?`
🔴 HEADLESS_UPPER专项补充：
• 顶部裁切必须更狠，宁可多裁一点肩颈上方空间，也不能残留任何头部
• 批量生成时，每一张都必须重复执行相同的无头裁切规则
• 不能因为不同姿势、不同角度、不同张数而让部分图片出现头部
`:E==="UPPER_BODY"?`
🔴 UPPER_BODY专项补充：
• 必须是标准有头上半身，不要延伸到膝盖或脚部
• 头部完整保留，下方在腰部/臀部附近结束
• 不能错误生成成全身图，也不能错误生成成无头图
`:E==="CLOSEUP"?`
🔴 CLOSEUP专项补充：
• 必须是局部特写，禁止退化成半身图或全身图
• 画面主体必须是单一关键细节，不要贪多
• 特写距离必须足够近，确保局部占画面70-90%
`:E==="HEADLESS_FULL"?`
🔴 HEADLESS_FULL专项补充：
• 必须无头，但要保留完整下半身直到双脚
• 不能误生成成无头上半身，也不能露出头部
`:E==="FULL_BODY"?`
🔴 FULL_BODY专项补充：
• 必须完整保留头和脚，并有充足留白
• 不能误裁成半身图，也不能头顶脚底贴边
`:""}

`}${z?`▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
🎯 特写拍摄部位 - 严格执行（最高优先级）
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
🚨🚨🚨 当前必须拍摄的部位：${z.description} 🚨🚨🚨

【拍摄部位指令】
${z.instruction}

🔴🔴🔴 【特写模式款式检查 - 最高优先级！禁止改款！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 特写模式必须保持服装原始设计！绝对不能改款！⚠️⚠️⚠️

【特写拍摄前必须检查】
🔍 第一步：检查原图的服装款式特征
   • 原图是有袖设计还是无袖设计？
   • 原图是抹胸、吊带、挂脖还是有肩带款式？
   • 原图领口是什么类型？（V领、方领、圆领等）
   • 原图有哪些实际存在的装饰元素？

🔍 第二步：确认当前要拍摄的部位
   • 当前要拍 "${z.description}"
   • 原图是否有这个部位？
   • 如果原图没有这个部位，应该拍什么替代？

🔍 第三步：执行拍摄，严格遵守款式
   • 只拍摄原图实际存在的部位和细节
   • 不能为了拍摄而凭空添加不存在的部位
   • 特写时必须保持原图的款式特征

【典型案例：无袖服装的特写拍摄】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 案例：如果原图是无袖抹胸设计
❌ 错误：要拍"袖口特写"，所以给服装添加了袖子 → 严重失败！
✅ 正确：原图没有袖子，改为拍摄肩部线条、领口或面料纹理特写

🚨 案例：如果原图是吊带设计
❌ 错误：要拍"袖口特写"，所以把吊带变成了短袖 → 严重失败！
✅ 正确：原图只有细肩带，拍摄肩带细节、领口或其他部位

🚨 案例：如果原图没有珠片装饰
❌ 错误：要拍"装饰特写"，所以添加了珠片 → 严重失败！
✅ 正确：拍摄其他实际存在的装饰，或改拍面料纹理
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【核心原则】
💡 特写 = 放大已有细节，不是创造新部位
💡 近距离拍摄 ≠ 改变服装款式
💡 只拍存在的，不造不存在的
💡 无袖就是无袖，不能变有袖

⚠️⚠️⚠️ 特写模式绝不允许改款！无袖不能变有袖！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️⚠️⚠️ 重要提示 ⚠️⚠️⚠️
• 这是第 ${R+1}/${v} 张图片，必须拍摄 "${z.description}"
• 不同张图片会拍摄不同的服装部位，确保多样性和全面展示
• 必须严格按照指定部位拍摄，但只能拍摄原图实际存在的部位
• 如果原图没有该部位，改为拍摄其他存在的部位
• 每张特写图都聚焦不同的关键部位，避免重复
• 被摄主体（该部位）必须占画面70-90%，近距离高清拍摄
• 【关键】绝对不能为了拍摄需要而改变服装款式或添加不存在的部位

🔴🔴🔴 【特写距离与画面占比 - 再次强制确认】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ 不能只是“近一点”，必须是“非常近”的局部放大特写。
⛔ 特写图中最重要的是：单一细节足够大、足够满、足够清楚。

生成前必须确认：
✓ 当前画面是不是只聚焦一个关键部位？→ 必须YES
✓ 这个部位是否占到画面的70-90%？→ 必须YES
✓ 是否看不到完整人物或大面积身体？→ 必须YES
✓ 用户第一眼看到的是细节，而不是人物整体？→ 必须YES

如果任意答案不是YES，就必须继续拉近镜头并缩小拍摄范围，直到成为真正的局部特写。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:`▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
📷 拍摄角度 - 严格执行（最高优先级）
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
🚨🚨🚨 当前必须使用的拍摄角度：${U.description} 🚨🚨🚨

【角度执行指令】
${U.instruction}

⚠️⚠️⚠️ 重要提示 ⚠️⚠️⚠️
• 这是第 ${R+1}/${v} 张图片，必须使用 "${U.description}"
• 不同张图片会使用不同的拍摄角度，确保多样性
• 必须严格按照指定角度拍摄，不能随意改变
• 角度变化的同时，背景、服装、色温保持100%一致
`}

${g?`
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
🛍️ 商品类型智能分析 - 展示重点指引
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

🔴🔴🔴 【商品类型：${g.type==="PANTS"?"裤装":g.type==="SKIRT"||g.type==="DRESS"?"裙装":g.type==="TOP"?"上衣":"未知"}】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 根据商品类型，必须重点展示以下部位！⚠️⚠️⚠️

【展示重点区域 - 最高优先级】
${g.focusAreas.map(be=>`✅ ${be}`).join(`
`)}

${g.type==="PANTS"?`
🔴🔴🔴 【裤装展示核心要求 - 必须100%执行！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 这是裤装商品！展示重点是裤子和腿部！⚠️⚠️⚠️

【裤装展示策略】
1️⃣ 必须使用全身构图（显示完整腿部）
   • 画面必须完整显示裤子从腰部到脚踝的全部
   • 腿部是展示的核心重点，必须清晰完整
   • 双脚必须在画面内，展示裤脚细节
   • 绝对不能使用上半身构图（会裁掉裤子）

2️⃣ 选择展示腿部线条的姿势
   • 优先选择能展现腿部修长感的姿势
   • 如：自然站立、行走姿势、S型身姿、单腿微曲等
   • 避免坐姿或蹲姿等遮挡腿部的姿势
   • 重点展现裤子的版型和腿部线条

3️⃣ 突出裤装的关键特征
   • 腰部设计（腰带、裤腰线）清晰可见
   • 裤型轮廓（直筒、阔腿、紧身）明确展现
   • 裤长（九分、长裤、喇叭）完整显示
   • 裤脚细节（裤脚宽度、开叉）清楚展示

4️⃣ 拍摄角度建议
   • 正面：展示整体裤型和对称感
   • 侧面：展示裤子的立体轮廓和版型
   • 背面：展示臀部和后裤腰的设计
   • 3/4角度：展示裤子的立体感和层次

⚠️⚠️⚠️ 记住：裤装=必须看到完整的裤子和腿！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}

${g.type==="SKIRT"||g.type==="DRESS"?`
🔴🔴🔴 【裙装展示核心要求 - 必须100%执行！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 这是裙装商品！展示重点是裙子和整体效果！⚠️⚠️⚠️

【裙装展示策略】
1️⃣ 必须使用全身构图（显示完整裙摆）
   • 画面必须完整显示裙子从腰部到裙摆的全部
   • 裙摆是展示的核心重点，必须清晰完整
   • 双脚必须在画面内，展示裙子长度
   • 绝对不能使用上半身构图（会裁掉裙摆）

2️⃣ 选择展示裙摆飘逸感的姿势
   • 优先选择能展现裙子飘逸感的姿势
   • 如：自然站立、S型身姿、行走姿势、微微转身等
   • 让裙摆自然垂坠或飘动，展现面料质感
   • 避免遮挡裙摆的姿势

3️⃣ 突出裙装的关键特征
   • 裙摆飘逸感和垂坠感清晰展现
   • 腰线设计（高腰、收腰）明确可见
   • 裙子长度（短裙、长裙）完整显示
   • 开叉细节（如有）清楚展示
   • 裙摆轮廓和版型完美呈现

4️⃣ 拍摄角度建议
   • 正面：展示裙子的整体轮廓和对称感
   • 侧面：展示裙摆的飘逸感和垂坠感
   • 背面：展示后腰和裙摆的背面设计
   • 行走姿势：展示裙摆的动态美感

⚠️⚠️⚠️ 记住：裙装=必须看到完整的裙摆！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}

${g.type==="TOP"?`
🔴🔴🔴 【上衣展示核心要求 - 建议参考】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 这是上衣商品！展示重点是上身设计！⚠️⚠️⚠️

【上衣展示策略】
1️⃣ 构图灵活选择
   • 可以使用上半身构图（重点展示）
   • 也可以使用全身构图（展示搭配效果）
   • 根据上衣长度和款式选择合适构图

2️⃣ 选择展示上身的姿势
   • 优先选择能展现上衣版型的姿势
   • 如：单手叉腰、双臂交叉、撩发、单手上扬等
   • 让上衣的版型、剪裁、设计清晰可见

3️⃣ 突出上衣的关键特征
   • 领口设计（V领、圆领、方领、抹胸）清晰展示
   • 袖型细节（长袖、短袖、无袖）完整呈现
   • 上身版型（修身、宽松、oversiz）明确可见
   • 面料质感和纹理清楚展示

⚠️⚠️⚠️ 记住：上衣=重点展示上身设计和版型！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}

💡 智能推荐说明：
• 系统已根据商品描述自动识别商品类型
• 自动选择最合适展示该商品特点的姿势
• 不同张图片会使用不同的推荐姿势，确保多样性
• 当前第${R+1}张使用的姿势：${$.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}

▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
🎭 ${g?"当前姿势要求（已根据商品类型智能推荐）":`动作风格${K?"参考":"要求"}`}
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
${g?`
🚨🚨🚨 【姿势指令 - 严格执行】 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 当前姿势：${$.description}
📍 执行指令：${$.instruction}

⚠️⚠️⚠️ 这是第${R+1}/${v}张图片的专属姿势！⚠️⚠️⚠️
⚠️⚠️⚠️ 必须严格按照以上姿势指令执行！⚠️⚠️⚠️
⚠️⚠️⚠️ 确保与其他${v-1}张图片的姿势明显不同！⚠️⚠️⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${b?`
📌 补充动作风格参考：
${b}
`:""}
`:b}

▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
🔐 核心规则 - 绝对约束 🔐
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

1. 🎨 背景和色调保持100%不变
   • 场景、光线、色调、质感完全相同
   • 背景元素位置不能改变
   • 色温和白平衡必须与原图一致
   • 不能偏黄、偏暖或偏冷

1.5 👤 人物特征和肤色保持100%不变
   ⚠️⚠️⚠️ 肤色必须与原图完全一致！⚠️⚠️⚠️
   
   【必须保持的人物特征】
   ✅ 肤色色调必须与原图完全相同（不能变深、变浅、变黄、变红）
   ✅ 模特的整体外观特征必须保持一致
   ✅ 身材比例必须与原图相同
   ✅ 肌肤质感必须与原图一致（不能过度平滑或粗糙）
   
   🔴🔴🔴 【脸部五官特征必须100%保持不变 - 最高优先级！】 🔴🔴🔴
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⛔⛔⛔ 换动作只改变姿势，脸部特征绝对不能改变！⛔⛔⛔
   
   【脸部特征保持规则 - 必须100%执行】
   ✅✅✅ 眼睛形状、大小、眼距必须与原图完全相同
   ✅✅✅ 鼻子形状、高度、鼻翼宽度必须与原图完全相同
   ✅✅✅ 嘴巴形状、唇形、大小必须与原图完全相同
   ✅✅✅ 脸型轮廓必须与原图完全相同（圆脸/方脸/尖脸等）
   ✅✅✅ 五官位置关系必须与原图完全相同
   ✅✅✅ 眉毛形状、浓淡必须与原图完全相同
   ✅✅✅ 面部比例（三庭五眼）必须与原图完全相同
   ✅✅✅ 脸部任何特征性标记要保持一致
   
   💡 理解：换动作 = 同一个人换不同姿势拍照
   • 就像同一个模特拍摄多张产品图
   • 人是同一个人，只是摆了不同的姿势
   • 脸部每个细节都必须一模一样
   • 如果换个人脸 = 完全错误！
   
   【严格禁止的脸部改变】
   ❌ 禁止改变眼睛大小或形状
   ❌ 禁止改变鼻子形状或高度
   ❌ 禁止改变嘴巴或唇形
   ❌ 禁止改变脸型轮廓
   ❌ 禁止改变五官位置或比例
   ❌ 禁止换成不同的脸
   ❌ 禁止微调任何五官特征
   
   🔴🔴🔴 关键检查：将生成图的脸部与原图对比
   • 眼睛是否一模一样？→ 必须YES
   • 鼻子是否一模一样？→ 必须YES
   • 嘴巴是否一模一样？→ 必须YES
   • 脸型是否一模一样？→ 必须YES
   • 五官比例是否一模一样？→ 必须YES
   • 如果任何一项是NO → 生成失败！
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   【严格禁止的其他错误】
   ❌ 禁止改变肤色深浅
   ❌ 禁止改变肤色冷暖倾向
   ❌ 禁止让肤色偏黄、偏红或偏暗
   ❌ 禁止改变模特的外观特征
   
   💡 正确标准：
   • 肤色必须与参考图中的肤色完全一致
   • 脸部五官必须与参考图完全相同，不能有任何微调
   • 只改变姿势，不改变任何人物特征
   • 保持原图的自然肤色和质感
   • 就像同一个模特摆不同姿势拍的多张照片

2. 👗 服装款式100%不变 - 超级严格
   ⚠️⚠️⚠️ 这是最重要的约束！⚠️⚠️⚠️
   
   【绝对禁止修改】
   ❌ 不能改变领口类型（抹胸不能变吊带/V领等）
   ❌ 不能改变裙子长度（长裙不能变短裙）
   ❌ 不能改变开叉位置和高度
   ❌ 不能改变腰线位置
   ❌ 不能改变裙摆轮廓和版型
   ❌ 不能增加或减少装饰元素
   
   【必须完全一致】
   ✅ 上衣款式、领口设计必须一模一样
   ✅ 裙子长度必须到达相同位置（脚踝/地面）
   ✅ 开叉必须在相同侧边和相同高度
   ✅ 腰部款式和收腰方式必须相同
   ✅ 珠片、亮片、图案必须精确复制
   ✅ 颜色必须一致
   
   【🎨🎨🎨 色彩还原 - 严格禁止偏色！🎨🎨🎨】
   
   🚨 色彩问题是常见错误，必须特别注意！🚨
   
   ✅ 白色服装必须保持纯净的白色
   • 不能偏黄、偏暗、偏灰
   • 保持原图的明亮度和纯净度
   • 白平衡必须准确，不能有暖色调倾向
   
   ✅ 整体色温必须与原图一致
   • 如果原图是冷色调，不能变成暖色调
   • 如果原图是中性色调，不能偏黄或偏蓝
   • 光线色温必须完全匹配参考图
   
   ❌ 严格禁止的色彩错误：
   • 禁止整体偏黄（像老照片或黄昏光线）
   • 禁止整体偏暖（像添加了暖色滤镜）
   • 禁止降低饱和度或对比度
   • 禁止改变光线的色温特性
   
   💡 正确的色彩标准：
   • 白色就是白色，不是米白或象牙白
   • 肤色自然，不能偏黄或偏红
   • 背景色调与原图完全一致
   • 整体画面看起来清新明亮，不发黄

   【🌟🌟🌟 面料质感与光泽增强 - 最高优先级！🌟🌟🌟】
   
   🚨 这是最容易出错的地方，必须100%严格遵守！🚨
   🚨 注意：这里的“增强”不是改变原本材质，更不是把原图顺滑的缎面改成另一种反光逻辑！
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎨 【光泽感增强 - 核心要求】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   ✨✨✨ 必须实现的光泽效果（最高优先级）：
   
   1️⃣ 高光区域（Highlights）- 必须明显且强烈
   • 在光线直接照射的区域创建明显的亮点和反光
   • 高光应该集中在面料的凸起部分、转折处
   • 根据面料类型调整高光的大小、强度和分布
   • 高光要有渐变过渡，不能生硬
   • 强度要达到"一眼就能看出材质高级"的程度
   
   2️⃣ 镜面反射（Specular Reflections）- 材质特征
   • 丝绸/缎面：流畅的波浪状反光，柔和光泽带
   • 皮革：强烈的镜面反射，局部高亮区域
   • 金属面料：强烈的光泽和色彩反射，璀璨效果
   • 亮片/珠片：璀璨的点状高光，闪耀效果
   • 丝绒：柔和的漫反射光泽，绒面质感
   • 光面材质：清晰的环境反射，镜面效果
   
   3️⃣ 光影层次（Light and Shadow）- 立体质感
   • 明暗对比必须分明，增强立体感
   • 褶皱处的光影过渡自然且明显
   • 边缘处要有rim light（轮廓光）效果
   • 光源方向一致，符合物理规律
   • 阴影区域保持细节，不能死黑
   
   4️⃣ 材质质感（Material Properties）- 真实感
   • 面料纹理：编织纹路、织物肌理极度清晰可见
   • 表面细节：纤维质感、织物密度清晰展现
   • 光泽分布：符合面料的弯曲和褶皱走向
   • 反光强度：根据材质特性调整（缎面强、棉质弱）
   • 质感层次：面料看起来高级、奢华、专业
   • 对于当前这类缎面/光泽面料：必须严格复制原图那种顺滑、成片、连续的高光带，不得改成碎裂、高低不平、皱感更强的反光
   • 对于胸口到腰部的大面积布面：必须优先生成平整顺滑的整体面，而不是生成很多局部小折线
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔥 【熨烫效果 + 光泽强化】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   ✅ 面料平整度：
   • 像刚熨烫过一样笔挺、整洁、挺括
   • 消除不规则褶皱，面料绷直有型
   • 保持织物纹理清晰，只去除褶皱不去除细节
   • 展现面料的挺括感和结构感
   • 边缘线条清晰、笔直、有型
   
   ✅ 光泽强化处理：
   • 在平整的面料上叠加强烈的光泽效果
   • 高光区域必须明亮、清晰、有渐变
   • 反光带要流畅、自然、符合面料走向
   • 材质的豪华感和高级感必须突出
   • 让人一眼看出是高档面料
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ❌ 【严格禁止的错误处理】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   ❌ 禁止用模糊去皱：不要通过模糊或柔化来消除褶皱
   ❌ 禁止平滑纹理：不要把面料纹理处理得过于光滑
   ❌ 禁止塑料感：不要让面料看起来像塑料或橡胶
   ❌ 禁止光泽不足：不要让面料看起来哑光或廉价
   ❌ 禁止高光缺失：必须有明显的光泽和反光效果
   ❌ 禁止过度降噪：不要为了"干净"而牺牲纹理细节
   ❌ 禁止涂抹感：不要让面料有涂抹或磨皮的感觉
   ❌ 禁止暗淡无光：面料必须有生命力和光泽感
   ❌ 禁止改变原图的缎面高光形态和流向
   ❌ 禁止把原图较平整的布面生成得更皱、更鼓、更有拉扯痕迹
   ❌ 禁止胸腹区域出现多段折线式高光、皱波纹、碎裂亮斑
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💎 【正确的面料渲染标准】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   理想效果检查清单：
   ✓ 近看能看到超清晰的织物编织细节和纹理
   ✓ 面料平整挺括，像刚从高级干洗店取回
   ✓ 光线照射下有强烈的质感变化和明显反光
   ✓ 面料有明显的高光区域，璀璨夺目
   ✓ 缎面、丝绸等材质有强烈的光泽和反光效果
   ✓ 面料绷直但不失真实感，有自然的垂坠感
   ✓ 整体超清晰、超锐利，没有涂抹感或模糊
   ✓ 材质看起来真实、高级、有重量感且光泽明显
   ✓ 面料线条清晰、笔直、有结构感
   ✓ 一眼就能看出是高档、奢华的面料
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎯 【光泽感等级要求】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   目标等级：奢华高级（LUXURY LEVEL）
   
   特征标准：
   • 高光强度：8-10/10（非常明显）
   • 反光效果：清晰可见的镜面反射
   • 质感层次：丰富的光影变化
   • 整体印象：一眼看出是高端面料
   • 对比效果：比原图的光泽感提升200%
   
   💡 参考标准：
   • 高端时装秀的专业灯光下的服装效果
   • 奢侈品广告大片中的面料质感
   • 专业摄影棚使用柔光箱和反光板的效果
   • 让观众感叹"这面料看起来好高级！"
   
   🎯 最终目标：
   面料平整挺括、质感强烈、纹理清晰、线条笔直、
   光泽明显、璀璨夺目、奢华高级！

3. 💃 仅改变姿势和动作${v>1?" - 每张姿势必须不同":""}
   • 只改变：身体姿态（站/坐/侧身等）、手臂位置、腿部姿势
   • 不改变：服装的任何款式细节
   • 褶皱会随动作自然变化：姿势改变时，面料褶皱位置可以调整
   • 新增精修要求：优先使用“修补工具 / 生成式填充”的思路，去掉衣服上的小褶皱和局部不平整
   • 面料表面需要进一步修顺、修平，让服装版型更挺括、更利落、更像经过专业整烫后的陈列状态
   • ⚠️ 关键：褶皱变化时，光泽效果必须同步调整，保持强烈的质感
   • 每个新姿势的面料光泽、高光、反射都必须重新计算并强化
   • 确保无论什么姿势，面料的奢华感和光泽感始终保持最高水准

3.5 🔥🔥🔥 【电商级体态精修 - 强制执行！】 🔥🔥🔥
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚠️⚠️⚠️ 换动作同时必须进行专业体态优化！⚠️⚠️⚠️
   ⚠️⚠️⚠️ 目标：打造完美的电商展示身材！⚠️⚠️⚠️
   
   【体态精修要求 - 100%执行】
   
   1️⃣ 【腰臀优化 - 腰臀分离算法】
   🔴🔴🔴 核心原则：腰部和臀部必须分开独立处理！🔴🔴🔴
   
   💃 步骤A：先单独收腰（绝不触及臀部）
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 定位腰线：肚脐上方2-3cm处（自然腰最细处）
   • 🔥 收窄范围：仅处理腰线±5cm的区域
   • 🔥 收窄幅度：腰部宽度减少20-25%
   • 🔥 收窄方向：腰部两侧向身体中线靠拢
   • 🔥 形成效果：明显的腰部内凹曲线
   • ⚠️ 严格限制：收腰时绝对不能触及臀部区域！
   
   💃 步骤B：再单独扩臀（与腰部操作完全相反）
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥🔥🔥 定位臀线：腰线下方10-15cm处（臀部最高点）
   • 🔥🔥🔥 扩张范围：整个臀部区域（臀部最高点±12cm）
   • 🔥🔥🔥 扩张幅度：臀部宽度增加40-50%（超大幅度！）
   • 🔥🔥🔥 扩张方向：臀部两侧爆炸性向外突出扩张
   • 🔥🔥🔥 增加体积：臀部超级大幅变大、极度翘挺、超级圆润
   • 🔥🔥🔥 臀部高度：臀部最高点向上提升，更加翘挺
   • 🔥🔥🔥 臀部弧度：形成夸张的圆润外凸弧线，极其性感
   • ⚠️⚠️⚠️ 注意：臀部必须超超大幅增大，比原图大得多！
   • ⚠️⚠️⚠️ 重点：臀部爆炸性向外凸出，形成超级丰臀！
   • ⚠️⚠️⚠️ 标准：臀部至少要比原图大40-50%！
   
   💃 步骤C：腰臀曲线融合（自然过渡）
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 腰臀之间形成平滑的S型曲线过渡
   • 🔥 从腰部内凹自然过渡到臀部外凸
   • 🔥 过渡区域平滑衔接，无明显分界
   • 🔥 服装完美贴合新的身材曲线
   
   ✅ 最终效果检查：
   • 腰部是否明显收窄（向内凹）？
   • 臀部是否明显增大（向外凸）？
   • 腰臀对比是否强烈（细腰vs丰臀）？
   • 是否形成漏斗型/沙漏型S曲线？
   • 侧面看腰内凹、臀外凸是否明显？
   
   🔴 关键提醒：腰部=向内收缩，臀部=向外扩张（相反操作！）
   
   2️⃣ 【腿部优化 - 大长腿塑造】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🦵 腿部比例优化至身高的60-65%
   • 🦵 整体腿部拉长5-8厘米
   • 🦵 双腿笔直修长，无O型或X型
   • 🦵 大腿内侧适度收紧
   • 🦵 小腿肌肉线条流畅优美
   • 🦵 从臀部到脚踝形成完美直线
   
   3️⃣ 【整体身材比例优化】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 👗 上半身:下半身 = 5:8（黄金分割）
   • 👗 肩宽:腰宽:臀宽 = 1.5:1:1.3
   • 👗 头身比例：1:8或1:9（超模比例）
   • 👗 挺胸收腹，体态端正
   • 👗 肩线平直，颈部修长
   
   4️⃣ 【自然度控制 - 保持真实感】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • ⚠️ 优化幅度适中，避免过度失真
   • ⚠️ 保持人体结构的合理性
   • ⚠️ 关节位置保持正常
   • ⚠️ 背景不变形
   • ⚠️ 避免出现液化工具痕迹
   • ❌ 禁止夸张到"蚂蚁腰"等不真实效果
   
   💎 体态精修目标：
   • 细腰 + 丰臀 + 大长腿 = 完美电商身材
   • 展现服装的最佳效果
   • 符合东方审美的优雅身材
   • 自然真实但比原图更完美
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.6 🧹🧹🧹 【去皱与瑕疵修复 - 强制执行！】 🧹🧹🧹
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚠️⚠️⚠️ 服装必须看起来全新、整洁、无瑕疵！⚠️⚠️⚠️
   ⚠️⚠️⚠️ 可默认理解为使用修补工具 / 生成式填充对服装表面做精修，但不能改变服装款式与结构！⚠️⚠️⚠️
   
   【去皱要求 - 达到熨烫效果】
   
   1️⃣ 褶皱平滑处理
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 去除运输造成的褶皱和折痕
   • 🔥 去除不必要的随机褶皱
   • 🔥 去除衣服上的小褶皱、小鼓包、小起伏和局部不平整
   • 🔥 像用修补工具/生成式填充逐块修顺布面一样，修复轻微起皱、拱起、塌陷和不服帖区域
   • 🔥 如果原图本来就比生成结果更平整，那么最终结果必须至少和原图一样平整，绝对不能比原图更皱
   • 🔥 面料平整如新，像刚熨烫过
   • 🔥 保留设计褶皱（百褶裙、褶皱设计等）
   • 🔥 对胸口到腰腹这整片区域执行最高强度平整化，优先消灭所有随机褶、拉痕、鼓包和波纹
   • ⚠️ 关键：平滑但不失真，保持面料纹理
   
   2️⃣ 表面瑕疵清除
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 所有可见污渍、脏点、斑点 → 完全清除
   • 🔥 灰尘、毛絮、纤维 → 完全清除
   • 🔥 水渍、油渍痕迹 → 完全清除
   • 🔥 色斑、色差 → 统一修复
   • 🔥 线头、毛边 → 修剪整齐
   
   3️⃣ 面料状态优化
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 面料平整挺括，有型有质感
   • 🔥 版型轮廓要更挺括，胸腰臀、衣摆、裙摆、裤线等结构线更干净利落
   • 🔥 边缘线条清晰笔直
   • 🔥 接缝处整齐工整
   • 🔥 保持面料的自然垂坠感
   • 🔥 对缎面/真丝类面料：保持原图同等级别的顺滑流光感，不能把顺滑缎面做成起伏凌乱的皱面
   • ⚠️ 注意：去皱时不能用模糊，要保持纹理清晰
   
   4️⃣ 最终状态标准
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ 产品看起来全新未穿
   ✅ 无任何使用痕迹
   ✅ 干净整洁，完美无瑕
   ✅ 符合电商全新产品标准
   
   💎 去皱目标：像从工厂刚生产出来的全新产品！
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.7 🎨🎨🎨 【色彩与质感优化 - 强制执行！】 🎨🎨🎨
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚠️⚠️⚠️ 在保持色彩不变的前提下，优化质感表现！⚠️⚠️⚠️
   
   【色彩优化要求】
   
   1️⃣ 亮度优化（大幅提升）
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥🔥🔥 整体曝光必须提升20-30%
   • 🔥🔥🔥 画面非常明亮，不能暗淡
   • 🔥🔥🔥 白色衬衫必须极其明亮耀眼
   • 🔥🔥🔥 中间调大幅提亮，清爽通透
   • 🔥🔥🔥 避免欠曝，确保明亮度
   • ❌ 严禁图片变暗！
   
   2️⃣ 饱和度增强
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 色彩饱和度提升30-50%
   • 🔥 让颜色更加鲜艳夺目
   • 🔥 增强视觉冲击力
   • ⚠️ 保持色相不变（不改变颜色类型）
   
   3️⃣ 对比度与层次
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 适度增强对比度，提升立体感
   • 🔥 高光保留细节，阴影保持清晰
   • 🔥 柔和过渡，自然层次
   
   4️⃣ 清晰度与锐化
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • 🔥 中高等锐化（50-70%）
   • 🔥 边缘清晰但自然
   • 🔥 面料纹理清晰可见
   • ❌ 严禁模糊！
   
   💎 色彩优化目标：
   • 更亮 + 更鲜艳 + 更清晰 = 高端电商效果
   • 保持真实的同时提升视觉品质
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴🔴🔴 【电商精修总结 - 必须100%执行】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 体态精修：收腰40-50% + 扩臀20-25% + 腿部拉长5-8cm
✅ 去皱处理：面料平整如新，像刚熨烫过
✅ 瑕疵修复：清除所有污渍、线头、毛边
✅ 亮度优化：提升20-30%，画面明亮通透
✅ 饱和度增强：提升30-50%，色彩鲜艳夺目
✅ 清晰度优化：中高锐化，纹理清晰
✅ 质感强化：光泽明显，材质高级

💎💎💎 最终效果：电商展示级完美图片！💎💎💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ${v>1?`
   
   🔴🔴🔴 【批量生成姿势多样性 - 强制要求！】 🔴🔴🔴
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚠️⚠️⚠️ 当前生成第${R+1}/${v}张，姿势必须与其他${v-1}张明显不同！⚠️⚠️⚠️
   
   【姿势变化强制要求】
   ✅ 每张图片必须有独特的姿势
   ✅ 手臂位置必须有明显变化（例如：下垂→叉腰→抱臂→撩发）
   ✅ 身体姿态必须有变化（例如：正站→微侧→S型→半转）
   ✅ 重心分配要有变化（例如：平均→偏左→偏右→动态）
   ✅ 腿部姿势要有变化（如适用于构图）
   
   ❌ 严格禁止姿势重复或相似
   ❌ 严格禁止所有图片姿势雷同
   ❌ 严格禁止只有微小差异
   
   💡 第${R+1}张的姿势要求：
   • 必须创造一个全新的、独特的姿势
   • 与前面已生成的${R}张姿势完全不同
   • 与后面要生成的${v-R-1}张姿势也要不同
   • 确保${v}张图片姿势丰富多样
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   `:""}

4. 📐 构图比例${K?"参考":"保持一致"}
   • ${K?"如自定义指令中有构图要求，优先执行自定义指令":"人物大小、裁剪范围、留白比例必须与参考图保持一致"}
   • 人物在画面中的占比不能变化过大
   • 头顶和脚底的留白空间要保持相似比例

5. 🔍 检查清单
   在生成前必须确认：
   ✓ 抹胸款式是否保持？
   ✓ 裙子长度是否和参考图一样？
   ✓ 开叉位置是否完全相同？
   ✓ 有没有意外添加肩带或改变领口？
   ✓ 整体轮廓是否与原图完全一致？
   ✓ 面料质感是否清晰可见，没有过度平滑？
   ✓ 面料材质是否与原图完全一致，没有从缎面变成别的质感？
   ✓ 光泽强弱、反光分布、缎面高光带是否与原图一致？
   ✓ 生成结果是否绝对没有比原图更皱？
   ✓ 胸口到腰腹的大面积布面是否足够平、够顺、够整？
   ✓ 纹理细节是否保留，清晰度是否足够？
   ✓ 面料看起来是否真实，而不是像塑料或过于光滑？
   ✓ 🌟🌟🌟 面料光泽是否明显、强烈、璀璨？（最重要！）
   ✓ 🌟 高光区域是否清晰、明亮、有渐变？
   ✓ 🌟 镜面反射是否符合材质特性且强烈？
   ✓ 🌟 光影层次是否丰富、立体、专业？
   ✓ 🌟 整体是否呈现奢华高级的质感？
   ✓ 图片分辨率是否是2680x3570像素？
   ✓ 图片格式是否是PNG无损格式？
   ✓ 文件大小是否在2-3MB范围内？
   ${v>1?`✓ 批量生成时，这第${R+1}张是否与其他图片质量、尺寸完全一致？
   ✓ 这第${R+1}张的姿势是否与其他${v-1}张明显不同？
   ✓ 🌟 这第${R+1}张的面料光泽是否与其他图片保持相同的高水准？`:""}

═══════════════════════════════════════════════════════════════════
🏆 v4.0 FINAL QUALITY GATE — 10 MANDATORY CHECKPOINT INSPECTIONS 🏆
═══════════════════════════════════════════════════════════════════

Before outputting the final image, run EACH of these 10 inspections.
If ANY inspection FAILS → regenerate. Do NOT output a sub-standard image.

🔬 QC-1  TEXTURE FIDELITY: Zoom to 200% on the fabric.
         Can you see weave/knit structure? Individual threads?
         → If fabric looks like flat color or smooth gradient → FAIL & REDO

🔬 QC-2  EDGE SHARPNESS: Check shoulder seam, neckline, hemline, side seam.
         Are all structure lines razor-crisp with no blending into skin/background?
         → If any edge is soft or blurred → FAIL & REDO

🔬 QC-3  MATERIAL AUTHENTICITY: Does the fabric BEHAVE like real fabric?
         Correct drape weight, correct fold physics, correct light scatter?
         → If fabric looks like CGI, painted, or digitally rendered → FAIL & REDO

🔬 QC-4  LIGHT-SHADOW REALISM: Is lighting physically consistent?
         One light direction, gradual transitions, no floating highlights?
         → If shadows contradict light source or dead-black zones exist → FAIL & REDO

🔬 QC-5  COLOR ACCURACY: Compare garment color to original image.
         Exact same hue, saturation, value? No yellow cast? Whites are pure white?
         → If any color shift detected → FAIL & REDO

🔬 QC-6  SILHOUETTE PRESERVATION: Overlay original and generated garment outlines.
         Same neckline type, same length, same slit position, same fit?
         → If any design element changed → FAIL & REDO

🔬 QC-7  SKIN & BODY REALISM: Check fingers, hands, feet, face proportions.
         Natural anatomy? No extra/missing fingers? No distorted joints?
         → If any anatomical error → FAIL & REDO

🔬 QC-8  RESOLUTION CHECK: Is the image genuinely high-detail?
         No upscaling artifacts, no soft patches, no pixelation?
         → If any area lacks detail or shows upscale blur → FAIL & REDO

🔬 QC-9  BACKGROUND & PROPS CONSISTENCY: Same scene, same color palette?
         ⚠️ CRITICAL: Did the original image have props/decorations?
         → If original had NO props but generated image has props → IMMEDIATE FAIL & REDO!
         → If original had props, are they the same type? No new objects added?
         → If background is more complex than original → FAIL & REDO
         → The garment (product) MUST be the absolute visual hero of the image!
         → Background must be SIMPLER or EQUAL to original, NEVER more complex!

🔬 QC-10 OVERALL COMMERCIAL GRADE: Step back and evaluate holistically.
         Would a Tier-1 brand (Zara/H&M/ASOS) use this as a product listing photo?
         Does it make a customer want to click "Add to Cart" immediately?
         → If it looks amateur, AI-generated, or unpolished → FAIL & REDO

═══════════════════════════════════════════════════════════════════

🚫🚫🚫 v4.0 NEGATIVE CONSTRAINTS — 5 ABSOLUTE PROHIBITIONS 🚫🚫🚫
═══════════════════════════════════════════════════════════════════

❌ PROHIBITION 1: DO NOT simplify fabric texture!
   The model will try to "save effort" by rendering fabric as smooth color.
   This is the #1 cause of fake-looking output. FORCE thread-level detail!

❌ PROHIBITION 2: DO NOT produce CGI / 3D-render look!
   No waxy skin, no plastic-sheen fabric, no uncanny-valley lighting.
   The image must be indistinguishable from a real photograph.

❌ PROHIBITION 3: DO NOT blur or smear any pattern/print!
   Jacquard patterns, lace openwork, tweed thread mix, embroidery stitches
   must all be PIXEL-SHARP. Blurry patterns = lazy generation = FAIL.

❌ PROHIBITION 4: DO NOT apply "painted look" or "illustration style"!
   No visible brush strokes, no oil-painting texture, no watercolor bleed.
   This is a PHOTOGRAPH, not a painting or digital art piece.

❌ PROHIBITION 5: DO NOT generate mannequin/doll-like appearance!
   The model must look like a real human being. Natural skin texture,
   natural body imperfections, natural pose dynamics — NOT a plastic doll.

═══════════════════════════════════════════════════════════════════
`}),u&&(G.push({type:"text",text:"姿势参考图（仅提取姿势）："}),G.push({type:"image_url",image_url:{url:u}})),d){const be=E==="CLOSEUP";G.push({type:"text",text:`细节参考图 - ${be?"重点参考材质纹理":"仅用于纹理提取"}：

🚨🚨🚨 【重要：细节图使用说明】 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 细节图的唯一用途：提取面料纹理、图案、珠片等表面细节
✅ 仅从细节图中学习：材质质感、编织纹路、装饰图案
✅ 将提取的细节应用到：最终生成的单张完整图片上

🔴🔴🔴 【特别注意：细节图的拍摄角度】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 如果细节图是后背图 → 生成后背角度时，必须参考该图的后背细节
⚠️ 如果细节图是正面图 → 生成正面角度时，必须参考该图的正面细节
⚠️ 如果细节图是侧面图 → 生成侧面角度时，必须参考该图的侧面细节

【细节图角度匹配规则 - 关键！】
✅ 当生成图的拍摄角度与细节图的角度一致时：
   • 必须精确复制细节图中该角度的所有细节
   • 包括：面料纹理、装饰位置、设计细节、褶皱样式、后背拉链、蝴蝶结等
   • 确保生成图与细节图在同角度下完全一致
   • 后背的每个细节都要精确还原（拉链、扣子、褶皱、装饰等）

✅ 当生成图的拍摄角度与细节图不一致时：
   • 仍然要参考细节图的材质质感和装饰风格
   • 但要根据新角度调整细节的呈现方式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${be?`
🎯🎯🎯 【特写模式特别要求 - 材质参考最高优先级】 🎯🎯🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 当前是特写构图模式，必须重点参考细节图的材质纹理！⚠️⚠️⚠️

【从细节图中必须提取的元素】
✅✅✅ 面料编织纹路 - 必须高度还原
✅✅✅ 材质光泽质感 - 必须精确匹配且增强
✅✅✅ 织物肌理细节 - 必须清晰展示
✅✅✅ 表面纹理特征 - 必须完整复制
✅✅✅ 装饰工艺细节 - 必须如实呈现
✅✅✅ 光泽反光效果 - 必须强化表现

【特写拍摄时的材质要求】
• 近距离拍摄时，细节图中的面料纹理必须清晰可见
• 编织纹路、织物肌理要与细节图保持一致
• 材质的光泽、反光效果要精确匹配并强化
• 纹理密度、粗细程度要完全相同
• 高清锐利展示，不能模糊或平滑化

⚠️ 特写图片的纹理细节必须100%参考细节图！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`:""}
❌ 严格禁止：将细节图和生成结果放在同一张图中对比
❌ 严格禁止：生成包含细节图和全身图的拼接图
❌ 严格禁止：生成"局部特写+全身"的组合布局
❌ 严格禁止：任何形式的多图拼接或对比展示

⚠️⚠️⚠️ 必须生成单张独立的${be?"特写":"完整人物"}图片！⚠️⚠️⚠️
⚠️⚠️⚠️ 不要生成拼图、对比图、网格图！⚠️⚠️⚠️

【正确做法】
✓ Step 1: 从细节图中学习面料纹理和图案${be?"（特写模式：重点提取）":""}
✓ Step 2: 生成一张${be?"局部特写":"完整的单人姿势"}图
✓ Step 3: 将学习到的纹理细节应用到生成图的服装上
✓ 最终输出：一张${be?"局部特写的细节":"完整的、独立的人物"}图片（不包含细节图）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

以下是细节参考图（${be?"特写模式必须重点参考其材质纹理":"仅用于提取纹理"}，不要放入最终图片中）：`}),G.push({type:"image_url",image_url:{url:d}})}G.push({type:"text",text:`产品图片（背景和服装的参考来源）：${s}

🎨🎨🎨 【色温分析 - 严格匹配原图！】 🎨🎨🎨
⚠️⚠️⚠️ 仔细分析原图的色温特征，然后精确复制！⚠️⚠️⚠️

参考图色温匹配规则：
• 仔细观察原图的光线色温（暖光/冷光/中性光）
• 精确匹配原图的白平衡（不能偏蓝也不能偏黄！）
• 白色物体在生成图中必须与原图呈现完全相同的色调
• 肤色冷暖必须与原图完全一致
• 整体色调必须与原图并排对比看不出差异

⚠️ 必须精确匹配原图色温！不允许偏冷/偏蓝，也不允许偏暖/偏黄！
⚠️ 最常见的错误是生成图比原图偏冷/偏蓝，必须特别注意！

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴��🔴🔴
🚨🚨🚨 【背景保持100%不变 - 最高优先级！绝对不能改变背景！】 🚨🚨🚨
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

⛔⛔⛔ 背景必须与原图100%完全相同！任何改变都是错误！⛔⛔⛔

🔴🔴🔴 【核心原则：背景精确复制 - 强制执行！】 🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️⚠️⚠️ 背景场景、元素、道具必须与原图完全一致！⚠️⚠️⚠️
⚠️⚠️⚠️ 绝对不能简化、删除、添加或改变背景！⚠️⚠️⚠️

【背景保持强制要求 - 必须100%执行】
✅✅✅ 背景场景必须与原图完全相同（室内/室外/棚拍等）
✅✅✅ 背景色彩、色调必须与原图完全一致
✅✅✅ 背景道具位置、大小、数量必须与原图相同
✅✅✅ 背景光线效果必须与原图保持一致
✅✅✅ 背景元素不能增加也不能减少
✅✅✅ 背景的清晰度/虚化程度必须与原图一致

【绝对禁止的背景改变 - 任何一项都是失败！】
❌ 禁止简化背景（从复杂变简单）
❌ 禁止删除背景道具或装饰物
❌ 禁止添加原图没有的背景元素
❌ 禁止改变背景颜色或色调
❌ 禁止将场景背景替换为纯色背景
❌ 禁止改变背景的复杂程度
❌ 禁止虚化原本清晰的背景
❌ 禁止清晰化原本虚化的背景

【正确的背景处理方式】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 仔细观察原图的背景：有什么元素、什么颜色、什么风格
✅ 在生成图中100%精确复制相同的背景
✅ 背景道具：
   • 如果原图有植物 → 生成图也要有相同的植物
   • 如果原图有墙壁 → 生成图也要有相同的墙壁
   • 如果原图有窗户 → 生成图也要有相同的窗户
   • 如果原图有地板 → 生成图也要有相同的地板
✅ 背景应该看起来是同一个拍摄地点、同一个时间
✅ 只改变人物姿势，背景完全不变

【背景一致性检查清单 - 生成前必须确认】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 1. 背景场景与原图完全相同吗？→ 必须YES
✓ 2. 背景道具数量与原图一致吗？→ 必须YES
✓ 3. 背景色调与原图匹配吗？→ 必须YES
✓ 4. 有没有删除原图的背景元素？→ 必须NO
✓ 5. 有没有添加新的背景元素？→ 必须NO
✓ 6. 背景看起来是同一个场所吗？→ 必须YES

🔴🔴🔴 改变背景 = 生成失败！必须保持背景100%一致！🔴🔴🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡💡💡 【换动作的正确理解】 💡💡💡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
换动作 = 在同一个场景中，同一个模特，穿同样的衣服，换不同姿势拍照

必须保持不变的：
• 背景场景 100%不变
• 服装款式 100%不变
• 人物特征 100%不变
• 色温光线 100%不变

可以改变的：
• 只有姿势动作（手臂、腿部、身体角度）

就像在同一个摄影棚，模特换了几个不同的Pose重新拍照！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

以下是产品图（仔细观察其色温、白平衡，以及背景中是否有道具）：`}),G.push({type:"image_url",image_url:{url:r}});const Le=2;for(let be=0;be<=Le;be++)try{be>0&&(console.log(`🔄 第 ${R+1} 张重试第 ${be} 次...`),await qs(1500,3e3));const N=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${_}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"Fashion AI"},body:JSON.stringify({model:"google/gemini-3-pro-image-preview",temperature:E==="HEADLESS_UPPER"||E==="CLOSEUP"?.05:.15,top_p:E==="HEADLESS_UPPER"||E==="CLOSEUP"?.4:.7,top_k:10,max_tokens:8192,messages:[{role:"user",content:G}]})});if(!N.ok){const X=await N.text();throw new Error(`API错误 ${N.status}: ${X}`)}const H=await N.json();if((at=(St=(Se=(Ye=(Be=(Xe=H.choices)==null?void 0:Xe[0])==null?void 0:Be.message)==null?void 0:Ye.images)==null?void 0:Se[0])==null?void 0:St.image_url)!=null&&at.url){const X=H.choices[0].message.images[0].image_url.url;return await gp(X),console.log(`✅ 第 ${R+1} 张生成成功，使用AI直接生成的高分辨率图片`),X}else throw new Error("未返回图片数据")}catch(N){if(console.error(`❌ 第 ${R+1} 张尝试失败:`,N.message),be===Le)throw N}throw new Error(`第 ${R+1} 张生成失败`)},Cp=async(r,d,u,s,h,b,E,R)=>{Ep();const v=await js(r),g=E?await js(E):void 0,_=R?await js(R):void 0,U=Sp(d);console.log(`🛍️ 商品类型分析结果: ${U.description}`),console.log(`📋 展示重点: ${U.focusAreas.join(", ")}`),console.log(`💡 推荐构图: ${U.recommendedCompositions.join(", ")}`),U.recommendedCompositions.length>0&&!U.recommendedCompositions.includes(h)&&(console.warn(`⚠️ 提示：当前使用的构图"${h}"可能不是最适合该商品的构图`),console.warn(`💡 建议使用以下构图: ${U.recommendedCompositions.join(" 或 ")}`));const z=3,F=[];for(let k=0;k<b;k+=z){const $=[],G=Math.min(z,b-k);for(let K=0;K<G;K++){const W=k+K;$.push(Np(v,g,_,d,u,s,h,W,b,U))}const V=await Promise.all($);F.push(...V),k+z<b&&await qs(2e3,4e3)}return F},Dp=r=>new Promise((d,u)=>{const s=new FileReader;s.readAsDataURL(r),s.onload=()=>{typeof s.result=="string"?d(s.result):u(new Error("Failed to convert file to base64"))},s.onerror=h=>u(h)}),Lp=async(r,d=2e4)=>new Promise((u,s)=>{const h=new Image;h.crossOrigin="anonymous";const b=setTimeout(()=>{h.src="",s(new Error(`图片加载超时（${d}ms）`))},d);h.onload=()=>{clearTimeout(b),console.log(`✅ 图片加载成功: ${h.width}x${h.height}px`),u(r)},h.onerror=()=>{clearTimeout(b),s(new Error("图片加载失败"))},h.src=r});var Fn=(r=>(r.NATURAL="NATURAL",r.ENHANCED="ENHANCED",r.LUXURY="LUXURY",r))(Fn||{});const Mp=async(r,d="ENHANCED",u=!0)=>{var v,g,_,U,z,F,k,$,G;console.log("🎨 开始光泽感增强处理...");const s="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",h=await Dp(r),E={NATURAL:{intensity:"轻微增强",description:"保持自然质感，微妙提升面料光泽",highlights:"柔和的高光效果",reflections:"自然的光线反射"},ENHANCED:{intensity:"明显增强",description:"显著提升面料光泽和质感",highlights:"明显的高光区域",reflections:"清晰的光线反射和折射"},LUXURY:{intensity:"奢华级增强",description:"极致的光泽感和高级质感",highlights:"强烈的高光和反光效果",reflections:"丰富的光线反射、折射和镜面效果"}}[d],R=[{type:"text",text:`🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🌟🌟🌟 光泽感增强模式 - 面料质感专业处理 🌟🌟🌟
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

⚠️⚠️⚠️ 【核心任务：增强衣服的光泽感和高级质感】 ⚠️⚠️⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 当前增强级别：${d} - ${E.intensity}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 【光泽感增强要求 - 最高优先级】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨✨✨ 核心目标：让面料呈现出${E.description}

【必须强化的光泽效果】
✅ 高光区域：${E.highlights}
   • 在光线直接照射的区域创建明显的亮点
   • 高光应该集中在面料的凸起部分
   • 根据面料类型调整高光的大小和强度
   
✅ 反光效果：${E.reflections}
   • 面料表面应该反射环境光线
   • 缎面、丝绸等材质要有明显的镜面反射
   • 光泽分布要符合面料的弯曲和褶皱
   
✅ 材质质感增强：
   • 丝绸/缎面：柔和流畅的光泽，波浪状反光
   • 皮革：强烈的镜面反射，局部高光
   • 金属面料：强烈的光泽和色彩反射
   • 亮片/珠片：璀璨的点状高光效果
   • 丝绒：柔和的漫反射光泽
   
✅ 光影层次：
   • 明暗对比更加分明
   • 褶皱处的光影过渡自然
   • 边缘处要有适度的rim light（轮廓光）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 【面料分析和处理策略】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

步骤1：识别面料类型
• 分析原图中的面料材质（丝绸/缎面/棉质/皮革等）
• 识别现有的光泽程度和反光特征
• 确定需要增强的具体区域

步骤2：应用光泽增强
• 在保持原有构图和姿势的基础上
• 增强面料的光泽、反光和高光效果
• 根据面料类型应用不同的光泽处理方式
• 强度等级：${E.intensity}

步骤3：质量控制
• 确保光泽效果真实自然，不过度假
• 保持面料纹理细节清晰可见
• 光泽分布符合光源方向和物理规律
• 整体画面清晰、锐利、高分辨率

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ 【技术参数要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 输出格式：PNG无损格式
✅ 画质：始终以最高质量输出
✅ 清晰度：超高清，所有细节清晰可见
✅ 光泽强度：${E.intensity}
${u?"✅ 姿势保持：完全保持原图的姿势、构图和背景":"✅ 姿势调整：可以适当调整姿势以更好展示光泽效果"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 【严格禁止的操作】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 禁止过度处理导致面料看起来像塑料或假的
❌ 禁止模糊或柔化面料纹理细节
❌ 禁止改变服装的款式、颜色或设计
❌ 禁止改变原图的构图和背景
${u?"❌ 禁止改变人物的姿势和动作":""}
❌ 禁止降低图片清晰度或分辨率
❌ 禁止让光泽效果分布不合理（违背物理规律）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 【正确的处理效果】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

理想效果：
• 面料呈现出明显的光泽感和高级质感
• 光线照射区域有自然的高光和反射
• 面料纹理依然清晰可见，增添了光泽层
• 整体看起来更加高档、精致、专业
• 符合高端时尚摄影的质感标准
• 让衣服看起来像价格更高的奢侈品

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 【处理前检查清单】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

在开始处理前，请确认：
✓ 已识别面料类型和当前光泽程度
✓ 明确知道要增强哪些区域的光泽
✓ 了解应该应用何种类型的光泽效果
✓ 确定光线方向和反光的合理位置
✓ 准备生成高质量PNG图片
✓ 增强强度设置为：${E.intensity}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

现在，请对以下图片进行光泽感增强处理：`},{type:"image_url",image_url:{url:h}},{type:"text",text:`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 【处理后请提供分析报告】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

请在生成增强后的图片的同时，提供简要分析：
1. 识别到的面料类型
2. 应用的光泽增强方法
3. 主要增强的区域和效果
4. 最终呈现的质感特征

开始处理！`}];try{const V=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"Fashion AI - Gloss Enhancement"},body:JSON.stringify({model:"google/gemini-3-pro-image-preview",temperature:.4,top_p:.9,messages:[{role:"user",content:R}]})});if(!V.ok){const ee=await V.text();throw new Error(`API错误 ${V.status}: ${ee}`)}const K=await V.json(),W=((_=(g=(v=K.choices)==null?void 0:v[0])==null?void 0:g.message)==null?void 0:_.content)||"",fe=(G=($=(k=(F=(z=(U=K.choices)==null?void 0:U[0])==null?void 0:z.message)==null?void 0:F.images)==null?void 0:k[0])==null?void 0:$.image_url)==null?void 0:G.url;if(!fe)throw new Error("未返回增强后的图片");await Lp(fe);const Q=typeof W=="string"?W:"光泽感增强处理完成";return console.log("✅ 光泽感增强成功"),{enhancedImage:fe,analysis:Q}}catch(V){throw console.error("❌ 光泽感增强失败:",V.message),V}},Sh=r=>new Promise((d,u)=>{const s=new FileReader;s.readAsDataURL(r),s.onload=()=>{typeof s.result=="string"?d(s.result):u(new Error("Failed to convert file to base64"))},s.onerror=h=>u(h)}),Up=r=>new Promise(d=>setTimeout(d,r)),Qs=(r,d)=>{const u=r+Math.random()*(d-r);return Up(u)},_p=async(r,d=2e4)=>new Promise((u,s)=>{const h=new Image;h.crossOrigin="anonymous";const b=setTimeout(()=>{h.src="",s(new Error(`图片加载超时（${d}ms）`))},d);h.onload=()=>{clearTimeout(b),console.log(`✅ 图片加载成功: ${h.width}x${h.height}px`),u(r)},h.onerror=()=>{clearTimeout(b),s(new Error("图片加载失败"))},h.src=r});var Rh=(r=>(r.WHITE="WHITE",r.TRANSPARENT="TRANSPARENT",r.GRAY="GRAY",r.ORIGINAL="ORIGINAL",r))(Rh||{});class wp{constructor(){this.keys=[],this.currentIndex=0;const d="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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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,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";if(this.keys=d.split(",").map(u=>u.trim()).filter(u=>u.length>0),this.keys.length===0)throw new Error("未配置API密钥")}getNextKey(){const d=this.keys[this.currentIndex];return this.currentIndex=(this.currentIndex+1)%this.keys.length,d}}let Bs=null;const zp=()=>(Bs||(Bs=new wp),Bs),Hp=()=>`✅ 体态精修 — 🔥🔥🔥 最高优先级！必须100%执行！🔥🔥🔥

🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🚨 BODY SHAPE RETOUCH — DRAW THE MODEL WITH THESE EXACT PROPORTIONS! 🚨
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

⛔ DO NOT copy the original body shape! You MUST redraw the model's body
   with the following IDEAL proportions. The output body MUST look visibly
   different from the input — slimmer waist, bigger bust, wider hips, longer legs.

【目标身材描述 — 重新绘制时必须画成这样的身材！】

🔥 胸部（BUST）：丰满饱满的胸部
   • Draw the model with a FULL, ROUND, VOLUPTUOUS bust
   • The bust should be noticeably LARGER and FULLER than the original photo
   • Bust volume increase: +20-30% compared to original
   • The clothing fabric stretches naturally over the fuller bust
   • Clear rounded bust contour visible through the garment
   • The bust creates a strong visual volume at the chest area

🔥 腰部（WAIST）：极细的蜂腰/漏斗腰
   • Draw the model with an EXTREMELY NARROW, TINY WAIST
   • The waist must be visibly MUCH THINNER than the original photo
   • Waist width reduction: 20-25% narrower than original
   • Deep inward curve on BOTH sides of the waist (hourglass indent)
   • The waist is the NARROWEST point of the entire torso
   • Waist-to-hip ratio should be approximately 0.65-0.70 (very dramatic)
   • The clothing fabric pinches inward sharply at the waist

🔥 臀部（HIPS/BUTTOCKS）：宽大圆润的翘臀
   • Draw the model with WIDE, ROUND, PROMINENT HIPS
   • The hips should be visibly MUCH WIDER than the original photo
   • Hip width increase: +35-45% wider than original
   • Full, round buttocks that push outward and upward
   • The hip line creates a dramatic outward curve below the waist
   • The skirt/clothing flares out noticeably at the hip area
   • Side profile shows a pronounced posterior curve

🔥 腿部（LEGS）：超长修长美腿
   • Draw the model with VERY LONG, SLIM, STRAIGHT LEGS
   • Legs should appear 6-8cm LONGER than original proportions
   • Leg-to-body ratio: legs = 60-65% of total height
   • Thighs slim and toned, inner thigh gap visible
   • Calves smooth and elongated
   • Straight alignment from hip to ankle, no bowing

🔥 整体轮廓（OVERALL SILHOUETTE）：完美S型沙漏曲线
   • The body silhouette MUST form a dramatic S-curve / hourglass shape:
     FULL BUST → EXTREME NARROW WAIST → WIDE ROUND HIPS → LONG SLIM LEGS
   • Shoulder:Waist:Hip ratio = 1.4 : 1.0 : 1.5
   • Head-to-body ratio: 1:8 or 1:9 (supermodel proportions)
   • Perfect upright posture, chest lifted, abs tight

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ VISUAL COMPARISON CHECK — The output body MUST be visually different:
   ✓ Bust: obviously BIGGER and FULLER than input → YES
   ✓ Waist: obviously THINNER and NARROWER than input → YES
   ✓ Hips: obviously WIDER and ROUNDER than input → YES
   ✓ Legs: obviously LONGER and SLIMMER than input → YES
   ✓ Overall: dramatic hourglass S-curve clearly visible → YES
   ✓ If the body shape looks the same as input → COMPLETE FAILURE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT: Keep the same clothing, same pose, same background.
   ONLY the body proportions change — everything else stays identical.
   The clothing must naturally adapt to the new fuller/slimmer body shape.
   No distortion artifacts, no warping visible — must look completely natural.

`,jp=r=>{let d=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【核心指令 · 最高优先级 · 不可违反】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

上传图片仅提供内容参考（人物、服装、姿态、场景）。
严禁模仿原图任何视觉质量属性，包括但不限于：模糊、噪点、低清、压缩痕迹、灰暗、颗粒感。

本次任务性质：【整体全新重绘】
• 拒绝素材合成
• 拒绝直接放大处理
• 基于原图内容，以顶级商业标准全新创作输出

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【强制画质标准】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 分辨率等级：超高清 8K
• 输出比例：标准 3:4 竖版人像比例
• 清晰度：超锐利，放大后仍无模糊
• 噪点：绝对零噪点
• 压缩痕迹：完全消除
• 边缘：清晰利落，无虚化、无羽化模糊
• 光影：干净通透，高级细腻，层次丰富
• 色彩：柔和精准，还原度高，层次自然
• 质感：高级精致，面料纹理清晰真实
• 整体标准：一线品牌官方旗舰店顶级电商精修 + 专业商业摄影级别精致感

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【精修执行项目】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;return r.colorCorrection&&(d+=`✅ 色彩精修
• 白平衡校正，色温中性准确（5500K–6500K）
• 整体亮度提升20–30%，画面明亮通透
• 色彩饱和度适度增强，鲜艳自然
• 层次丰富，高光与暗部细节均保留
• 色彩空间：sRGB 标准

`),r.enhanceDetails&&(d+=`✅ 质感细节增强
• 面料纹理清晰可见（棉、丝、针织、牛仔等各材质呈现真实质感）
• 材质光泽自然真实（哑光/光泽/金属分别对应呈现）
• 立体感强烈，光影塑造层次分明
• 刺绣、印花、纽扣、拉链等装饰细节精致清晰

`),r.removeDefects&&(d+=`✅ 瑕疵清除 + 面料质感精修

【⛔ 服装款式保护 — 最高优先级！】
• 服装的长度必须与原图完全一致！裙长/裤长/袖长/衣长不能有任何变化！
• 服装的剪裁、版型、轮廓必须与原图完全一致！
• 领口形状、袖口样式、腰线位置、下摆位置都不能改变！
• 如果原图裙子到小腿中部，输出也必须到小腿中部，绝对不能变短或变长！

【瑕疵清除】
• 去除污渍、灰尘、毛絮、色斑等表面异物
• 去除线头、毛边等制造缺陷
• 修复明显的色差、色斑区域
• 产品呈现全新出厂状态

【🔥🔥🔥 去褶皱 — 100%完全去除！最高强度！这是本次精修最重要的任务！🔥🔥🔥】

🔴🔴🔴 WRINKLE REMOVAL — ABSOLUTE ZERO WRINKLES! 🔴🔴🔴

褶皱去除力度：100%！面料表面必须像被自然绷直拉平一样，完全看不到任何褶皱！

【必须消除的褶皱类型 — 一条都不能留！】
• 裙摆/裤腿下半部分的竖向褶皱线、斜向褶皱线 → 必须100%消除！
• 面料因重力下垂产生的扇形放射状褶皱 → 必须100%消除！
• 两腿之间面料堆积形成的V字形/倒三角形褶皱 → 必须100%消除！
• 裙子中部到下摆之间的任何折痕、皱纹、波浪纹 → 必须100%消除！
• 腰部、臀部、胸部张力区域的拉扯褶皱 → 必须100%消除！
• 面料交叠、堆积产生的阴影线条 → 必须100%消除！

【目标效果 — 面料自然绷直】
• 面料必须呈现为自然绷直、拉平的状态 — 就像面料被轻轻拉直展开一样
• The fabric surface must look PERFECTLY SMOOTH and TAUT — as if the fabric is gently stretched and pulled straight
• 裙摆应该呈现干净利落的A字形或伞形轮廓，面料表面完全光滑平整
• 面料的垂坠轮廓线（裙摆的外形弧线）保留，但面料表面不能有任何褶皱纹路
• 想象一下：把裙子铺在平面上用手抚平，或者像展示架上展示的样子 — 面料完全绷直平整
• Every square centimeter of fabric must be smooth — NO fold lines, NO crease lines, NO wrinkle shadows visible anywhere on the garment

【特别重点区域 — 裙子/裤子下半部分！】
• 🎯 裙子从腰线到下摆的整个面积，面料表面必须完全平滑！
• 🎯 特别是裙摆中下部（膝盖到裙摆底边），这个区域最容易残留褶皱，必须重点处理！
• 🎯 两腿之间的裙面区域不能有任何V字形褶皱线条！
• 🎯 面料颜色过渡要极其均匀平滑，不能有褶皱导致的明暗条纹

⛔ 最终检查：放大查看裙子/裤子的每一寸面料 — 如果还能看到任何一条褶皱线、折痕、皱纹 → 完全不合格！必须重做！
⛔ FINAL CHECK: Zoom in on EVERY part of the skirt/pants fabric — if ANY wrinkle line, crease, or fold is still visible → FAIL! REDO!

【🔥🔥🔥 面料肌理保护 — 与去皱同等重要！🔥🔥🔥】
🔴 核心原则：去皱 ≠ 磨皮！褶皱和肌理是完全不同的概念！
• 面料本身的材质肌理纹（编织纹、针织纹、麻布纹、绉纱纹、提花纹等）必须100%原样保留！
• 原图面料是什么肌理质感，输出就必须是完全相同的肌理质感！
• 绝对不能把面料表面处理成光滑/平滑/丝绸感 —— 除非原图面料本身就是光滑的
• 绝对不能改变面料的材质外观！如果原图是绉纱面料有细小颗粒肌理，输出也必须有同样的颗粒肌理
• 绝对不能把带纹理的面料磨成没有纹理的面料！

✅ 正确做法：面料表面平整无褶皱，但放大看仍然有清晰的原始材质肌理纹
✅ 类比：就像用熨斗把衣服熨平了，褶皱消失了，但布料的编织纹理还在
❌ 错误做法：把面料处理成光滑无纹理的样子（这是把肌理也磨掉了）
❌ 错误做法：改变面料的材质外观（如绉纱变丝绸、亚麻变棉布）

【面料质感精修】
• 在100%保留原始面料肌理纹的基础上，让整体更加精致均匀
• 面料表面更加干净整洁，光泽感适度提升
• 面料的光影过渡更加细腻柔和，增强立体感和高级感
• 整体效果：高端相机+专业打光+完美熨烫后重新拍摄的效果

【整体画面精修】
• 光影：柔和自然通透，高光不过曝，阴影有层次
• 肤色：细腻光滑，均匀健康有光泽
• 色调：优雅沉稳，色彩准确还原，高级感
• 参考标准：一线品牌电商主图精修水平

`),r.sharpen&&(d+=`✅ 锐化处理
• 边缘轮廓清晰锐利
• 面料纹理锐化增强
• 禁止产生光晕、噪点、颗粒感等副作用

`),r.bodyShaping&&(d+=Hp()),r.highSaturation&&(d+=`✅ 高饱和色彩强化
• 服装颜色饱和度大幅提升（80–100%）
• 颜色极其鲜艳夺目，视觉冲击力强
• 皮肤色调保持自然健康，不过度饱和
• 整体保持高级感，避免荧光失真

`),r.customPrompt&&(d+=`✅ 自定义指令
${r.customPrompt}

`),d+=`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【构图与呈现标准】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 主体居中，左右对称，视觉平衡
• 产品高度占画面75–85%，留有适当呼吸空间
• 光线柔和均匀，主光源45°，无硬阴影
• 整体氛围：明亮、通透、干净、高端
• 参考标准：Uniqlo / Zara / Massimo Dutti 官网主图级别

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【绝对禁止事项】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 禁止输出任何模糊、低清、颗粒感效果
❌ 禁止模仿原图的任何劣质视觉表现
❌ 禁止素材合成或直接放大处理
❌ 禁止输出比例偏离 3:4 竖版人像比例
❌ 禁止改变服装款式、颜色、设计
❌ 禁止改变服装长度！裙长、裤长、袖长、衣长必须与原图完全一致！
❌ 禁止改变服装的剪裁版型、领口、腰线、下摆位置
❌ 禁止产生过度失真、塑料感、涂抹感
❌ 禁止改变面料的材质肌理！原图什么肌理纹就必须保留什么肌理纹！
❌ 禁止把有肌理感的面料磨成光滑面料（去皱≠磨皮≠改面料）
❌ 禁止不同生成图片之间出现面料质感不一致的情况
❌ 禁止面料表面残留任何褶皱、折痕、皱纹！面料必须完全平整绷直！
❌ ABSOLUTELY NO wrinkles, creases, or fold lines on ANY fabric surface!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【终极标准】一线品牌官方旗舰店顶级电商精修，专业商业摄影 + 品牌级精修的高级精致感。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

现在请对以下图片进行全新重绘精修：`,d},Bp=async(r,d,u,s,h)=>{var g,_,U,z,F,k;console.log(`🎨 开始生成第 ${s+1}/${h} 张精修图片...`);const b=zp().getNextKey();s>0&&await Qs(500,1500);const R=[{type:"text",text:jp(u)},{type:"image_url",image_url:{url:r}}];d&&(R.push({type:"text",text:`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【参考图片 · 风格效果参考】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

以下为用户提供的参考图，请参考其整体色调、饱和度、服装呈现风格、光影氛围，
在保持自然真实的前提下，向参考图的视觉风格靠拢。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}),R.push({type:"image_url",image_url:{url:d}})),R.push({type:"text",text:`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${h>1?`这是第 ${s+1}/${h} 张精修图片。
【多图一致性要求 — 必须严格遵守！】
🔴 面料材质肌理必须与原图完全一致！每一张输出的面料纹理、材质质感都必须相同！
🔴 不允许某张图的面料有肌理感而另一张面料变得光滑 — 这是严重错误！
🔴 所有生成的图片必须保持：相同的面料肌理纹 + 相同的材质外观 + 相同的面料质感
✅ 允许的变体差异仅限于：光影角度微调、色调冷暖微调、整体亮度微调
❌ 绝对不允许改变：面料材质、面料肌理纹、面料质感、服装款式、服装颜色`:""}
只输出精修后的图片，不要输出任何文字说明或报告。直接生成图片！`});const v=2;for(let $=0;$<=v;$++)try{$>0&&(console.log(`🔄 第 ${s+1} 张重试第 ${$} 次...`),await Qs(1500,3e3));const G=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${b}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"Fashion AI - Ecommerce Retouch"},body:JSON.stringify({model:"google/gemini-3-pro-image-preview",temperature:h>1?.35:0,top_p:.9,top_k:10,seed:h>1?Math.floor(Math.random()*1e5):12345,messages:[{role:"user",content:R}]})});if(!G.ok){const Q=await G.text();throw new Error(`API错误 ${G.status}: ${Q}`)}const K=(g=(await G.json()).choices)==null?void 0:g[0],W=((_=K==null?void 0:K.message)==null?void 0:_.content)||"",fe=(k=(F=(z=(U=K==null?void 0:K.message)==null?void 0:U.images)==null?void 0:z[0])==null?void 0:F.image_url)==null?void 0:k.url;if(fe){await _p(fe);const Q=typeof W=="string"?W:`电商精修处理完成 (#${s+1})`;return console.log(`✅ 第 ${s+1} 张精修成功`),{image:fe,report:Q}}else throw new Error("未返回图片数据")}catch(G){if(console.error(`❌ 第 ${s+1} 张尝试失败:`,G.message),$===v)throw G}throw new Error(`第 ${s+1} 张精修生成失败`)},Yp=async(r,d={enhanceDetails:!0,colorCorrection:!0,removeDefects:!0,sharpen:!0,standardSize:!0})=>{const u=d.generateCount||1;console.log(`🎨 开始电商精修处理...生成${u}张图片`);const s=await Sh(r);let h="";d.referenceImage&&(h=await Sh(d.referenceImage));const b=3,E=[],R=[];for(let v=0;v<u;v+=b){const g=[],_=Math.min(b,u-v);for(let z=0;z<_;z++){const F=v+z;g.push(Bp(s,h,d,F,u))}const U=await Promise.all(g);for(const z of U)E.push(z.image),R.push(z.report);v+b<u&&await Qs(2e3,4e3)}if(E.length===0)throw new Error("未返回精修后的图片");return console.log(`✅ 电商精修成功，生成了${E.length}张图片`),{retouchedImages:E,reports:R}},Ys=r=>new Promise((d,u)=>{const s=new FileReader;s.readAsDataURL(r),s.onload=()=>{typeof s.result=="string"?d(s.result):u(new Error("Failed to convert file to base64"))},s.onerror=h=>u(h)}),Gp=async(r,d=2e4)=>new Promise((u,s)=>{const h=new Image;h.crossOrigin="anonymous";const b=setTimeout(()=>{h.src="",s(new Error(`图片加载超时（${d}ms）`))},d);h.onload=()=>{clearTimeout(b),console.log(`✅ 图片加载成功: ${h.width}x${h.height}px`),u(r)},h.onerror=()=>{clearTimeout(b),s(new Error("图片加载失败"))},h.src=r});var Xn=(r=>(r.SAFE="SAFE",r.BALANCED="BALANCED",r.ULTRA="ULTRA",r))(Xn||{}),el=(r=>(r.AUTO="AUTO",r.CHIFFON="CHIFFON",r.ORGANZA="ORGANZA",r.SATIN="SATIN",r.STRUCTURED_GOWN="STRUCTURED_GOWN",r))(el||{});const Ip=r=>{const d=r.level||"BALANCED",u=r.materialType||"AUTO",s={SAFE:{text:"保守增强",strength:"仅做高清修复、锐化、细节补全，最大限度保持原图人物、服装和场景不变"},BALANCED:{text:"平衡重绘",strength:"在保留原图构图和主体设计的前提下，重建高频细节，显著提升清晰度、材质与真实感"},ULTRA:{text:"强力高清重绘",strength:"以商业级高清重绘标准重建人物、服装和场景细节，显著消除AI糊感和低清感"}},h={AUTO:{label:"自动判断",rule:"你必须先分析服装结构、受光、叠层、垂坠、骨位，再判断主体面料类型，然后全图统一按该面料逻辑重绘。"},CHIFFON:{label:"高级雪纺 / 乔其纱",rule:"你必须把主体面料统一理解为高级雪纺/乔其纱：轻、透、柔、飘、带柔亮丝光；全图不得出现厚棉布感或闷白感。"},ORGANZA:{label:"欧根纱 / 挺薄纱",rule:"你必须把主体面料统一理解为欧根纱/挺薄纱：轻薄、半透明、边缘更挺、轮廓更利落；不能塌软成普通纱布。"},SATIN:{label:"丝缎 / 高级缎面",rule:"你必须把主体面料统一理解为高级丝缎/缎面：光泽细腻连续、布面顺滑、有流动高光；不能局部失真成普通平布。"},STRUCTURED_GOWN:{label:"结构礼服缎 / 高级礼服布",rule:"你必须把主体面料统一理解为结构礼服缎/高级礼服布：有骨位支撑、布面张力、厚实垂坠和高级礼服光泽；不能软塌或材质跳变。"}},b=s[d],E=h[u];return`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【高清重绘修复模式】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

本次任务目标不是简单放大，而是：
✅ 基于原图内容进行高清重绘修复
✅ 消除模糊感、低清感、AI糊感、蜡感和压缩痕迹
✅ 提升人物脸部、发丝、服装材质、边缘轮廓、背景纹理的真实细节
✅ 输出商业级超清图片

【当前修复强度】
• 模式：${b.text}
• 要求：${b.strength}

【主体面料策略】
• 当前模式：${E.label}
• 强制规则：${E.rule}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【最高优先级要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 画质要求
• 输出必须是超高清、锐利、干净、无噪点、无压缩痕迹
• 绝对不能保留原图的模糊感
• 边缘清晰利落，不能发虚
• 人脸五官必须清晰自然，不能糊、不能塑料感

2. 细节重建要求
• 发丝：清晰、真实、根根分明
• 皮肤：保留自然质感，不能过度磨皮
• 服装：面料纹理、刺绣、亮片、薄纱、反光必须清晰真实
• 背景：建筑、窗框、柱体、地面纹理必须更精致

【重要升级：必须先分析面料，再决定重绘方式】
在开始生成前，必须先判断原图服装属于哪种材质表达，并主动补足缺失的高级面料特征。

执行顺序必须是：
1. 先判断主体面料类型
2. 再判断局部差异是否来自叠层/受光/张力/结构
3. 最后统一整件衣服的材质逻辑后再生成

如果主体面料没有先被统一定义，就禁止开始重绘。

你不能被原图“看不清材质”所限制。
即使原图本身面料质感不明显，也必须根据服装外观、版型、褶皱方式、光线表现、参考图质感，推断最合理的高级材质，并按高端成衣标准重绘。

面料分析逻辑：
• 如果是轻薄、半透明、层叠、边缘轻飘的上衣 → 优先按雪纺 / 乔其纱 / 欧根纱 / 丝质薄纱去表达
• 如果是顺滑、有大面积柔和反光、布面流畅的礼服 → 优先按缎面 / 丝缎 / 高级哑光缎去表达
• 如果是立体挺括、有结构线、有胸衣骨位、版型包裹感强 → 优先按高支礼服结构面料 / 双绉 / 高级绉缎 / 礼服级弹力缎去表达
• 如果是带亮片、刺绣、珠片、透视罩层 → 分层分析：里层主体面料 + 外层装饰纱层必须分别重绘

【布料一致性原则 - 必须严格执行】
一件衣服的同一面料，在不同区域只能因为光线、拉伸、层叠、厚薄关系而产生“合理变化”，不能出现“材质变种”。

这意味着：
✅ 同一块雪纺，胸口、肩膀、袖子主体区域都应该是同一种雪纺，只是透光程度和褶皱不同
✅ 同一块缎面，胸衣、腰部、裙摆主体区域都应该是同一种缎面，只是高光分布和张力不同
✅ 层叠结构可以更厚，但不能把同一面料在某些地方画成薄纱、另一些地方画成棉布或毛呢般的厚重感

严禁出现：
❌ 同一件上衣，肩膀像轻纱，胸前却像厚棉布
❌ 同一条礼服，胸衣像高级缎面，裙身却像普通平布
❌ 同一层布料，某些区域透明、某些区域浑浊发闷，且没有结构原因

最终要求：
✅ 不只是“照着原图生成”，而是“分析服装应有的高级面料表现后，再重绘出来”
✅ 原图没表现出来的高端质感，也要主动补足

2.5 服装高清优先策略
• 服装面料细节优先级必须高于皮肤柔和感
• 裙身褶皱交界线、缎面高光边界、布料折线必须超清晰
• 白色礼服不能只是一片平滑白面，必须有清楚的布料结构、折叠层次和高光变化
• 腰部抓褶、胸口褶线、裙摆层层堆叠关系必须清晰可辨
• 衣服区域必须按“电商级面料特写标准”重建，而不是普通人物照片标准

2.6 服装质感对齐要求
• 如果提供了服装参考图，必须优先学习参考图中的服装材质表达方式
• 目标不是复制参考图的人物和姿势，而是复制其衣服的质感表现方式
• 必须对齐参考服装的：轻薄感、透明感、层叠感、边缘锐度、布料空气感、柔和但清晰的高光过渡
• 如果参考图左侧的衣服看起来更高级、更轻盈、更通透，输出也必须朝这个方向靠拢

2.7 昂贵面料感目标
• 本次输出的衣服不能只是“清晰”，而必须具有“昂贵、高级、奢侈品成衣”的面料气质
• 面料应呈现高级成衣广告中的质感：轻盈、精致、通透、挺括、富有空气感和层次感
• 白色面料不能发闷、发粉、发糯，必须有高级奶油白/珍珠白般的细腻层次
• 透明薄纱/雪纺应呈现轻薄悬浮感，而不是厚重浑浊感
• 服装整体要有品牌大片级的“贵感”，而不是普通电商白衣质感

2.8 生成式补全与均衡修整目标
• 允许适度使用生成式补全思路，对衣服表面不自然的小褶皱、局部凹凸不平、随机脏纹理进行修整
• 修整目标不是磨皮式抹平，而是让布面更高级、更均衡、更像高端成衣拍摄状态
• 可以适度补足缺失的平整布面过渡，让衣服整体更统一、更干净、更有完成度
• 可以适度统一白色衣服的颜色层次，让整体更接近奶油白 / 珍珠白 / 高级暖白，而不是东一块西一块发灰发黄

${r.fabricDetailBoost!==!1?`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【服装细节强化模式 - 已开启】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
本次高清重绘中，衣服清晰度是核心目标，必须额外强化：
✅ 面料纹理和织物结构
✅ 缎面/真丝高光层次
✅ 褶皱转折边界的锐度
✅ 胸口、腰部、裙摆的大块布面细节
✅ 白色区域的层次区分，避免发糊、发灰、发糊成一片

【电商级服装细节强制要求】
• 放大后依然能看清礼服折线、布面张力和材质光泽
• 裙摆每一层起伏都要有明确边界
• 高光和阴影过渡既自然又清晰，不能糊成奶油状
• 服装局部清晰度必须明显高于原图

【严格禁止的服装问题】
❌ 衣服大面积发糊、发软、像涂抹过
❌ 白色衣服没有层次，看起来像一整片白块
❌ 裙摆边缘不清晰、褶皱关系不明确
❌ 面料光泽不真实、廉价、塑料感
❌ 衣服清晰度低于脸部清晰度
`:""}

${r.luxuryFabricMode!==!1?`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【高级昂贵面料模式 - 已开启】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
这不是普通“白色衣服高清化”，而是要把衣服做出“高级昂贵成衣”的感觉。

必须重点实现：
✅ 高级时装面料的轻盈感
✅ 布料层层叠叠但依然清楚、透气、干净
✅ 纱质/雪纺/轻薄面料的半透明层次
✅ 珍珠白、奶油白、丝绢白那种柔和但昂贵的白色层次
✅ 边缘精致、褶皱轻盈、光影细腻、没有廉价钝感

【昂贵感视觉标准】
• 看起来像奢侈品牌时装大片中的面料，而不是普通网店布料
• 轻薄处要有透气感和通透感
• 叠层处要有丰富层次而不浑浊
• 面料要“轻、透、柔、贵”，不能“厚、闷、糊、平”
• 光线打在衣服上时，要呈现精致柔光，不是脏白或死白

【绝对禁止的廉价感】
❌ 像普通棉布一样发闷
❌ 像廉价化纤一样发涩
❌ 像糊掉的白布一样没有呼吸感
❌ 纱层堆叠后变浑浊、不通透
❌ 缺少高端品牌大片里的空气感和轻奢感

【材质主动升级规则】
• 如果白色上衣参考图表现为昂贵雪纺/轻纱质感，则必须主动做出：轻透、空气感、柔亮光泽、层叠透视
• 如果红色礼服参考图表现为高级礼服缎面/结构礼服布，则必须主动做出：布面张力、骨位立体感、深浅光泽变化、厚实垂坠感
• 即使原图输入里看不出面料，也不能生成成普通平布；必须朝参考图所代表的高端材质去升级
`:""}

${r.fabricConsistencyMode!==!1?`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【布料一致性模式 - 已开启】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
你必须把“同一件衣服内部的面料一致性”当成最高检查项之一。

【一致性理解】
• 同一主体面料必须拥有统一的纤维感、厚薄逻辑、透光逻辑、光泽逻辑和表面结构
• 不同区域允许因为受光、受力、折叠、叠层而变化，但不允许出现材质断裂
• 任何区域的视觉差异都必须有物理原因，而不能是随机生成差异

【白色雪纺/薄纱类的一致性要求】
• 肩部、胸前、袖身、下摆的主体纱料必须是统一材质
• 某些区域可以因叠层更显厚一点，但本质上仍要看得出是同一种轻纱/雪纺
• 透光感必须连续、统一、自然
• 不允许胸前突然变成浑浊厚布感，不允许肩部和袖子像两种不同面料

【红色礼服/缎面类的一致性要求】
• 胸衣、腰部、裙身主体布面必须保持统一的缎感/礼服面料感
• 结构区可以更挺，垂坠区可以更软，但仍应属于同一种高级礼服主体面料
• 光泽过渡必须统一，不能一部分像缎面，一部分像亚麻或普通平纹布

【一致性检查问题 - 生成前必须回答】
✓ 这件衣服的主体面料是否被统一理解成一种材料？
✓ 不同区域的差异是否都能用层叠/光线/张力来解释？
✓ 是否存在某一块区域突然像另一种布？如果有，必须重做。
✓ 你是否先确定了“这件衣服主面料到底是什么”？若没有，必须先确定再生成。

【绝对禁止】
❌ 同一件衣服不同部位看起来像不同面料拼接，但原设计并非如此
❌ 肩膀薄、胸口厚、袖子又发闷，且没有结构逻辑
❌ 同一块布在不同部位出现随机的纤维感变化
❌ 质感不稳定，局部高级、局部廉价
`:""}

${r.smoothFillMode!==!1?`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【生成式补全平整模式 - 已开启】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
你可以对服装做“适度生成式补全修整”，重点处理：
• 随机的小褶皱
• 不自然的局部起伏
• 局部发脏、发灰、发黄、颜色不均
• 布面不够完整、过渡不够顺的区域

【修整原则】
• 要像高端后期修衣服一样修整，不是粗暴涂抹
• 保留该有的大褶皱、层叠关系、空气感和边缘结构
• 只去掉破坏高级感的小乱褶、小鼓包、小凹陷、小面积材质噪声
• 让整体布面更完整、干净、均衡、顺滑

【颜色统一要求】
• 同一件白色衣服的颜色必须更统一
• 允许适度补色，让发灰、发黄、发脏的局部回到统一的高级暖白/奶油白体系
• 不允许出现一块偏黄、一块偏灰、一块偏死白的割裂感

【严格禁止】
❌ 禁止把雪纺修成厚塑料布
❌ 禁止把自然大褶皱全部抹掉
❌ 禁止为了平整而失去轻纱层次和通透感
❌ 禁止颜色统一后变成单调死白
`:""}

3. 保真要求
${r.preserveComposition!==!1?"• 必须尽量保持原图构图、镜头视角、主体位置和姿势不变":"• 可在保证整体风格一致的情况下适度优化构图"}
${r.preserveFace!==!1?"• 必须尽量保持原人物脸型与五官特征，不要换脸":"• 可适度优化脸部细节，但不能失真"}
• 必须保持服装款式、颜色和设计语言一致
• 不允许把原图礼服改成其他款式

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【重点修复区域】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 脸部：眼睛、睫毛、鼻梁、嘴唇边缘、轮廓清晰
• 头发：发丝层次丰富，边缘不发糊
• 服装胸口与腰部：纹理、亮片、刺绣和光泽更高级
• 裙摆：薄纱层次、透明感、光影层次更自然
• 背景：欧式建筑细节更精致，保持真实透视

${r.fabricDetailBoost!==!1?`
• 服装优先修复：胸口褶线、腰部收褶、裙摆边缘、缎面高光必须作为第一修复重点
• 白色礼服区域：重点增强布料层次、立体感、锐度和材质区分
`:""}

${r.garmentReferenceImage?`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【服装质感参考图 - 最高优先级参考】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
你将看到一张额外参考图。
这张图不是让你复制人物脸、姿势或场景，而是让你学习“衣服质感表现方式”。

你必须重点学习参考图服装的以下特征，并迁移到当前重绘结果中：
✅ 布料边缘清晰但不生硬
✅ 轻薄面料有明显空气感和通透感
✅ 层叠结构分明，每一层都清楚
✅ 褶皱不是糊成一团，而是轻盈、干净、清晰
✅ 白色衣服有丰富层次，不发灰、不发糊、不像一片白布
✅ 整体呈现高端时装大片的服装质感

并且你必须分析：
• 参考图更像哪种高端材质？（雪纺 / 乔其纱 / 欧根纱 / 丝缎 / 绉缎 / 礼服结构布 / 蕾丝罩层等）
• 这种材质的高级感来自哪里？（光泽、厚度、挺括、透视、层叠、重量感、骨位感）
• 然后把这些关键质感迁移到目标服装上

禁止错误理解：
❌ 不是复制参考图的动作
❌ 不是复制参考图的人脸
❌ 不是复制参考图的背景
✅ 只复制“衣服看起来高级、轻盈、清晰、通透”的质感表达
`:""}

${r.garmentReferenceImage&&r.luxuryFabricMode!==!1?`
【对参考图的进一步理解 - 非常重要】
你必须从参考图中学习的，不只是“更清楚”，而是以下高级面料气质：
• 轻纱般的通透空气感
• 服装边缘轻盈、悬浮、细薄
• 白色层次丰富，像奢侈品面料一样高级
• 柔和光线下依然显得有价值感和贵感
• 布料看起来像高端品牌时装，不像普通白衬衣
• 若参考是红色礼服，则必须体现礼服主体面料的骨位感、张力、缎感和厚重垂坠感
• 若参考是白色雪纺上衣，则必须体现轻纱层叠、柔和光泽、通透感和高级空气感
`:""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【按材质类型分别执行的重绘标准】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. 如果目标服装属于白色轻纱/雪纺/薄纱类：
• 必须有轻薄半透明感
• 必须有空气感与层叠感
• 每层边缘必须薄、轻、精致
• 光泽应该是柔和丝光，不是死白漫反射
• 看起来像高端雪纺罩衫，而不是普通白衬衣
• 同一主体纱料在胸前、肩部、袖身必须维持统一纱感，只允许因叠层而厚薄略有变化
• 可以适度修掉破坏高级感的小乱褶和局部不平整，但必须保留高级雪纺本该有的垂感和层次
• 颜色要统一为高级暖白/奶油白调，避免局部脏白、灰白、黄白混杂

A-补充：如果用户明确指定“高级雪纺/乔其纱”，则全图都必须服从雪纺逻辑，禁止任何区域出现厚棉布感。

A-补充：如果用户明确指定“欧根纱”，则应比雪纺更挺、更利落，但仍然必须统一为同一种欧根纱逻辑。

B. 如果目标服装属于红色礼服/缎面/结构礼服类：
• 必须有布面张力和骨位支撑感
• 必须有从亮部到暗部的高级缎面光泽过渡
• 腰臀和胸衣区域必须看起来更高级、更有结构，不是普通平布包裹
• 裙摆要有垂坠厚重感、丝滑感、礼服感
• 看起来像高级定制晚礼服，不是普通红色布料
• 同一主体礼服面料在胸衣、腰部、裙身必须保持统一材质逻辑，不允许局部失真成别的布种
• 可适度修整小褶皱和布面不平整，让礼服更完整、更高级、更像成片状态

B-补充：如果用户明确指定“高级缎面”或“结构礼服缎”，则必须严格按照对应礼服面料逻辑统一整件衣服。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【严格禁止】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 禁止输出模糊、低清、发灰、软焦结果
❌ 禁止改变服装颜色、款式、长度、领口、裙摆结构
❌ 禁止大幅改变人物脸型和五官
❌ 禁止让皮肤变成塑料感
❌ 禁止手部畸形、五官错位、建筑透视错乱
❌ 禁止把“高清修复”做成“完全换图”
❌ 禁止服装比脸更糊
❌ 禁止白色礼服区域丢失层次和折叠结构
❌ 禁止面料看起来廉价、普通、发闷
❌ 禁止衣服只有清晰度，没有高级昂贵感
❌ 禁止因为原图面料不明显，就输出普通平面材质
❌ 禁止忽略参考图所表达的高端材质类型
❌ 禁止同一件衣服内部出现面料不均衡、厚薄逻辑混乱、材质不统一
❌ 禁止小褶皱、局部鼓包、颜色不均破坏整体高级感

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【输出标准】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 商业级高清重绘
• 时尚摄影质感
• 细节丰富、清晰锐利、真实自然
• 像重新用高端相机拍摄的一张高质量成品图

${r.customPrompt?`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【用户附加要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${r.customPrompt}
`:""}

现在请对下面这张图片执行“高清重绘修复”。只输出修复后的图片。`},kp=async(r,d={})=>{var v,g,_,U,z,F;console.log("🎨 开始高清重绘修复处理...");const u="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",s=await Ys(r),h=[{type:"text",text:Ip(d)},{type:"image_url",image_url:{url:s}}];if(d.referenceImage){const k=await Ys(d.referenceImage);h.push({type:"text",text:"以下是风格参考图，可参考其清晰度、质感与高级感，但主体内容仍以原图为准："}),h.push({type:"image_url",image_url:{url:k}})}if(d.garmentReferenceImage){const k=await Ys(d.garmentReferenceImage);h.push({type:"text",text:"以下是服装质感参考图。请只学习其中衣服的材质质感、层叠关系、透明感、边缘锐度和高级感表达，不要复制人物脸、姿势和背景："}),h.push({type:"image_url",image_url:{url:k}})}const b=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"Fashion AI - HD Redraw Repair"},body:JSON.stringify({model:"google/gemini-3-pro-image-preview",temperature:.2,top_p:.8,messages:[{role:"user",content:h}]})});if(!b.ok){const k=await b.text();throw new Error(`API错误 ${b.status}: ${k}`)}const R=(F=(z=(U=(_=(g=(v=(await b.json()).choices)==null?void 0:v[0])==null?void 0:g.message)==null?void 0:_.images)==null?void 0:U[0])==null?void 0:z.image_url)==null?void 0:F.url;if(!R)throw new Error("未返回高清重绘后的图片");return await Gp(R),console.log("✅ 高清重绘修复成功"),{image:R}},qp=async(r,d)=>{try{const s=await(await fetch(r)).blob(),h=URL.createObjectURL(s),b=document.createElement("a");b.href=h,b.download=d,document.body.appendChild(b),b.click(),document.body.removeChild(b),URL.revokeObjectURL(h),console.log(`✅ 下载完成: ${d}, 大小: ${(s.size/1024/1024).toFixed(2)}MB`)}catch(u){console.error("下载失败，尝试备用方式:",u),window.open(r,"_blank")}},Fp=()=>{const[r,d]=q.useState(!1),[u,s]=q.useState("CHANGE_ACTION"),[h,b]=q.useState("CASUAL"),[E,R]=q.useState("FULL_BODY"),[v,g]=q.useState(Fn.ENHANCED),[_,U]=q.useState(Xn.BALANCED),[z,F]=q.useState(!0),[k,$]=q.useState(!0),[G,V]=q.useState(!0),[K,W]=q.useState(!0),[fe,Q]=q.useState(!0),[ee,P]=q.useState(!0),[Le,Xe]=q.useState(el.AUTO),[Be,Ye]=q.useState({removeBackground:!1,backgroundType:Rh.ORIGINAL,enhanceDetails:!0,colorCorrection:!0,removeDefects:!0,sharpen:!0,standardSize:!0,bodyShaping:!1,highSaturation:!1}),[Se,St]=q.useState(null),[at,be]=q.useState(null),[N,H]=q.useState(!1),[X,pe]=q.useState(null),[de,y]=q.useState(null),[M,j]=q.useState(null),[Y,ae]=q.useState(""),[ie,he]=q.useState(""),[Qe,De]=q.useState(""),[oa,tl]=q.useState(""),[jt,Zl]=q.useState(1),[Ut,al]=q.useState(!1),[qt,ll]=q.useState([]),[_t,Ft]=q.useState(0),[nl,il]=q.useState(null),[Qn,ul]=q.useState(""),lt=async()=>{if(Se){al(!0),il(null),ul("");try{if(u==="GLOSS_ENHANCE"){const w=await Mp(Se,v,z);ll(we=>[w.enhancedImage,...we]),ul(w.analysis),Ft(0)}else if(u==="HD_REDRAW_REPAIR"){const w=await kp(Se,{level:_,preserveComposition:z,preserveFace:k,fabricDetailBoost:G,luxuryFabricMode:K,fabricConsistencyMode:fe,smoothFillMode:ee,materialType:Le,customPrompt:Qe||void 0,referenceImage:de||void 0,garmentReferenceImage:M||void 0});ll(we=>[w.image,...we]),ul(""),Ft(0)}else if(u==="ECOMMERCE_RETOUCH"){const w={...Be,customPrompt:oa||void 0,referenceImage:de||void 0,generateCount:jt},we=await Yp(Se,w);ll(Bt=>[...we.retouchedImages,...Bt]),ul(""),Ft(0)}else{const w=`${ie||""}${E==="CLOSEUP"?`

【系统强制附加指令：特写模式】
当前选择的是“特写”构图，必须生成真正的局部特写图，不允许生成为半身图、全身图或普通人物图。画面只能聚焦服装的单一细节部位，并且该细节必须占画面70%-90%。如果生成结果看起来像人物照片而不是服装细节特写，则视为错误。`:E==="HEADLESS_UPPER"?`

【系统强制附加指令：无头上半身模式】
当前选择的是“无头上半身”构图，画面顶部必须从肩部/锁骨开始，绝对不能出现头发、额头、眼睛、鼻子、嘴巴、下巴、耳朵或任何头部部分。底部必须止于腰部/臀部附近，不允许出现腿部。批量生成时每一张都必须遵守，不能混入有头图片。`:""}`,we=await Cp(Se,Y,w,h,E,jt,at,X);ll(Bt=>[...we,...Bt]),Ft(0)}}catch(w){il(w.message||"生成失败，请重试。")}finally{al(!1)}}};return r?f.jsxs("div",{className:"flex h-screen bg-[#FDFBF9] text-gray-900 font-sans overflow-hidden",children:[f.jsxs("section",{className:"w-[400px] h-full flex flex-col border-r border-gray-100 bg-white shadow-xl",children:[f.jsxs("div",{className:"p-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white border-b",children:[f.jsx("h1",{className:"text-xl font-bold",children:u==="ECOMMERCE_RETOUCH"?"电商精修模式":u==="HD_REDRAW_REPAIR"?"高清重绘修复模式":u==="GLOSS_ENHANCE"?"光泽感增强模式":"换动作处理模式"}),f.jsx("p",{className:"text-sm opacity-90 mt-1",children:u==="ECOMMERCE_RETOUCH"?"专业级产品图精修：去背景、色彩校正、瑕疵修复":u==="HD_REDRAW_REPAIR"?"针对模糊图片进行高清重绘、细节补全与质感修复":u==="GLOSS_ENHANCE"?"AI智能分析并增强衣服的光泽感和高级质感":"仅改变姿势，背景和服装100%保持不变"})]}),f.jsxs("div",{className:"flex-1 overflow-y-auto p-5 space-y-6 pb-24",children:[f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"选择处理模式"}),f.jsxs("div",{className:"grid grid-cols-4 gap-2",children:[f.jsxs("button",{onClick:()=>s("CHANGE_ACTION"),className:`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all ${u==="CHANGE_ACTION"?"bg-rose-50 border-rose-200 text-rose-600 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(sh,{size:18}),f.jsx("span",{className:"text-xs font-medium text-center",children:"换动作"})]}),f.jsxs("button",{onClick:()=>s("GLOSS_ENHANCE"),className:`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all ${u==="GLOSS_ENHANCE"?"bg-rose-50 border-rose-200 text-rose-600 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(oh,{size:18}),f.jsx("span",{className:"text-xs font-medium text-center",children:"光泽增强"})]}),f.jsxs("button",{onClick:()=>s("ECOMMERCE_RETOUCH"),className:`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all ${u==="ECOMMERCE_RETOUCH"?"bg-rose-50 border-rose-200 text-rose-600 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(uh,{size:18}),f.jsx("span",{className:"text-xs font-medium text-center",children:"电商精修"})]}),f.jsxs("button",{onClick:()=>s("HD_REDRAW_REPAIR"),className:`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all ${u==="HD_REDRAW_REPAIR"?"bg-rose-50 border-rose-200 text-rose-600 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(za,{size:18}),f.jsx("span",{className:"text-xs font-medium text-center",children:"高清重绘"})]})]})]}),f.jsxs("div",{className:"space-y-4",children:[f.jsx(Xl,{currentImage:Se,onImageChange:St,label:"1. 产品图片（必需）",showCropButtons:!0}),f.jsxs("div",{className:"space-y-2 pl-1",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx("input",{type:"checkbox",id:"showDetailImageUpload",checked:N,onChange:w=>{H(w.target.checked),w.target.checked||be(null)},className:"w-3.5 h-3.5 text-rose-500 rounded border-gray-300"}),f.jsx("label",{htmlFor:"showDetailImageUpload",className:"text-xs text-gray-600 font-medium",children:"上传细节图参考"})]}),N&&f.jsxs("div",{className:"pl-6",children:[f.jsx(Xl,{currentImage:at,onImageChange:be,label:"细节参考图",showCropButtons:!0}),f.jsx("p",{className:"text-xs text-gray-400 mt-1",children:"用于提取面料图案、纹理等表面细节"})]})]})]}),u==="ECOMMERCE_RETOUCH"&&f.jsxs(f.Fragment,{children:[f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"2. 基础精修选项"}),f.jsx("div",{className:"space-y-2",children:[{key:"enhanceDetails",label:"增强细节",desc:"提升纹理清晰度和光泽感"},{key:"colorCorrection",label:"色彩校正",desc:"白平衡和曝光优化"},{key:"removeDefects",label:"去除瑕疵",desc:"去污渍褶皱+保留面料纹理+高端光影精修"},{key:"sharpen",label:"锐化处理",desc:"增强图片清晰度"},{key:"standardSize",label:"标准尺寸",desc:"输出6700x8925"}].map(w=>f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:w.key,checked:Be[w.key],onChange:we=>Ye(Bt=>({...Bt,[w.key]:we.target.checked})),className:"w-4 h-4 text-blue-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:w.key,className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:w.label}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:w.desc})]})]},w.key))})]}),f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"3. 高级精修选项"}),f.jsx("div",{className:"space-y-2",children:[{key:"bodyShaping",label:"体态精修 🔥",desc:"漏斗腰、大长腿、完美比例"},{key:"highSaturation",label:"高饱和模式 🌈",desc:"强化服装色彩，更吸睛"}].map(w=>f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:w.key,checked:Be[w.key],onChange:we=>Ye(Bt=>({...Bt,[w.key]:we.target.checked})),className:"w-4 h-4 text-purple-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:w.key,className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:w.label}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:w.desc})]})]},w.key))})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"4. 自定义精修指令（可选）"}),f.jsx("textarea",{value:oa,onChange:w=>tl(w.target.value),placeholder:"例如：加强金属光泽、让裙子更飘逸...",className:"w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm min-h-[70px]"})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"5. 风格参考图（可选）"}),f.jsx(Xl,{currentImage:de,onImageChange:y,label:"参考图片",showCropButtons:!1}),f.jsx("p",{className:"text-xs text-gray-400 pl-1",children:"上传希望参考的效果图，AI将学习其色调、饱和度、体态等风格"})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"6. 生成数量"}),f.jsx("div",{className:"grid grid-cols-4 gap-2",children:[1,2,3,4].map(w=>f.jsxs("button",{onClick:()=>Zl(w),className:`py-2 px-3 rounded-xl border transition-all ${jt===w?"bg-rose-50 border-rose-200 text-rose-600 shadow-sm font-bold":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[w,"张"]},w))}),f.jsx("p",{className:"text-xs text-gray-400 pl-1",children:jt>1?`✓ 生成${jt}张不同效果的精修图片，增加随机性`:"✓ 生成1张精修图片，效果更稳定"})]})]}),u==="GLOSS_ENHANCE"&&f.jsxs(f.Fragment,{children:[f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"2. 光泽增强级别"}),f.jsx("div",{className:"grid grid-cols-1 gap-2",children:[{level:Fn.NATURAL,label:"自然光泽",desc:"轻微增强，保持自然"},{level:Fn.ENHANCED,label:"明显增强",desc:"显著提升光泽和质感"},{level:Fn.LUXURY,label:"奢华高级",desc:"极致光泽，豪华感"}].map(w=>f.jsxs("button",{onClick:()=>g(w.level),className:`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all ${v===w.level?"bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200 text-amber-700 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(za,{size:16,className:"mt-0.5 flex-shrink-0"}),f.jsxs("div",{className:"text-left flex-1",children:[f.jsx("div",{className:"text-sm font-bold",children:w.label}),f.jsx("div",{className:"text-xs opacity-75 mt-0.5",children:w.desc})]})]},w.level))})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"3. 姿势设置"}),f.jsxs("div",{className:"flex items-center gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:"maintainPose",checked:z,onChange:w=>F(w.target.checked),className:"w-4 h-4 text-rose-500 rounded border-gray-300"}),f.jsx("label",{htmlFor:"maintainPose",className:"text-sm text-gray-700 font-medium",children:"保持原图姿势和构图"})]}),f.jsx("p",{className:"text-xs text-gray-400 pl-1 mt-1",children:z?"✓ 仅增强光泽，完全保持原图姿势":"✓ 可调整姿势以更好展示光泽效果"})]})]}),u==="HD_REDRAW_REPAIR"&&f.jsxs(f.Fragment,{children:[f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"2. 重绘强度"}),f.jsx("div",{className:"grid grid-cols-1 gap-2",children:[{level:Xn.SAFE,label:"保守增强",desc:"尽量保留原图，仅提升清晰度和细节"},{level:Xn.BALANCED,label:"平衡重绘",desc:"保留主体同时明显提升画质与质感"},{level:Xn.ULTRA,label:"强力重绘",desc:"商业级高清重建，修复AI糊感更明显"}].map(w=>f.jsxs("button",{onClick:()=>U(w.level),className:`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all ${_===w.level?"bg-gradient-to-r from-fuchsia-50 to-purple-50 border-purple-200 text-purple-700 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(za,{size:16,className:"mt-0.5 flex-shrink-0"}),f.jsxs("div",{className:"text-left flex-1",children:[f.jsx("div",{className:"text-sm font-bold",children:w.label}),f.jsx("div",{className:"text-xs opacity-75 mt-0.5",children:w.desc})]})]},w.level))})]}),f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"3. 保留设置"}),f.jsxs("div",{className:"space-y-2",children:[f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:"maintainComposition",checked:z,onChange:w=>F(w.target.checked),className:"w-4 h-4 text-rose-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:"maintainComposition",className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:"保持原图构图和姿势"}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:"尽量不改主体站姿、镜头视角与场景布局"})]})]}),f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:"preserveFace",checked:k,onChange:w=>$(w.target.checked),className:"w-4 h-4 text-rose-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:"preserveFace",className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:"尽量保留原人物脸部特征"}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:"适合只想提高清晰度，不想人物变化太大的场景"})]})]}),f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:"fabricDetailBoost",checked:G,onChange:w=>V(w.target.checked),className:"w-4 h-4 text-rose-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:"fabricDetailBoost",className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:"优先强化衣服材质细节"}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:"重点提升面料纹理、褶皱层次、裙摆边缘和高光锐度"})]})]}),f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:"luxuryFabricMode",checked:K,onChange:w=>W(w.target.checked),className:"w-4 h-4 text-rose-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:"luxuryFabricMode",className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:"强化高级昂贵面料感"}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:"让衣服不仅更清晰，还更轻盈、通透、有品牌大片的贵感"})]})]}),f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:"fabricConsistencyMode",checked:fe,onChange:w=>Q(w.target.checked),className:"w-4 h-4 text-rose-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:"fabricConsistencyMode",className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:"强化布料一致性"}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:"确保同一件衣服不同区域保持统一材质逻辑，避免有的地方薄、有的地方厚得不合理"})]})]}),f.jsxs("div",{className:"flex items-start gap-2 pl-1",children:[f.jsx("input",{type:"checkbox",id:"smoothFillMode",checked:ee,onChange:w=>P(w.target.checked),className:"w-4 h-4 text-rose-500 rounded border-gray-300 mt-0.5"}),f.jsxs("label",{htmlFor:"smoothFillMode",className:"flex-1 cursor-pointer",children:[f.jsx("div",{className:"text-sm text-gray-700 font-medium",children:"适度生成式补全平整"}),f.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:"修掉破坏高级感的小褶皱、不平整和颜色不均，让布面更完整更均衡"})]})]})]})]}),f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"4. 主体面料类型"}),f.jsx("div",{className:"grid grid-cols-1 gap-2",children:[{value:el.AUTO,label:"自动判断",desc:"由 AI 先分析版型、叠层和光线，再统一面料逻辑"},{value:el.CHIFFON,label:"高级雪纺 / 乔其纱",desc:"适合白色轻透上衣、轻纱层叠款"},{value:el.ORGANZA,label:"欧根纱 / 挺薄纱",desc:"适合更挺、更利落的透明薄纱效果"},{value:el.SATIN,label:"丝缎 / 高级缎面",desc:"适合顺滑反光、丝滑高光的布面"},{value:el.STRUCTURED_GOWN,label:"结构礼服缎 / 高级礼服布",desc:"适合胸衣骨位明显、礼服张力强的款式"}].map(w=>f.jsxs("button",{onClick:()=>Xe(w.value),className:`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all ${Le===w.value?"bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 text-rose-700 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(za,{size:16,className:"mt-0.5 flex-shrink-0"}),f.jsxs("div",{className:"text-left flex-1",children:[f.jsx("div",{className:"text-sm font-bold",children:w.label}),f.jsx("div",{className:"text-xs opacity-75 mt-0.5",children:w.desc})]})]},w.value))})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"5. 自定义重绘指令（可选）"}),f.jsx("textarea",{value:Qe,onChange:w=>De(w.target.value),placeholder:"例如：保持主体雪纺一致性，适度修掉小褶皱和不平整，统一白色层次，让衣服更完整、更均衡、更高级...",className:"w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm min-h-[80px]"})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"6. 高清风格参考图（可选）"}),f.jsx(Xl,{currentImage:de,onImageChange:y,label:"高清参考图",showCropButtons:!1}),f.jsx("p",{className:"text-xs text-gray-400 pl-1",children:"可上传你想接近的高清质感参考图，用于学习清晰度、材质和整体高级感"})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"7. 服装质感参考图（推荐）"}),f.jsx(Xl,{currentImage:M,onImageChange:j,label:"服装质感参考图",showCropButtons:!1}),f.jsx("p",{className:"text-xs text-gray-400 pl-1",children:"上传你理想的衣服质感参考图，只学习衣服的层次、通透感、边缘和高级感，不复制人物和背景"})]})]}),u==="CHANGE_ACTION"&&f.jsxs(f.Fragment,{children:[f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"2. 构图风格（第一优先级）"}),f.jsx("div",{className:"grid grid-cols-2 gap-2",children:[{style:"FULL_BODY",label:"完整构图",icon:ch},{style:"UPPER_BODY",label:"上半身",icon:ch},{style:"HEADLESS_FULL",label:"无头全身",icon:gg},{style:"HEADLESS_UPPER",label:"无头上半身",icon:Ng},{style:"HEADLESS_LOWER",label:"无头下半身",icon:Gs},{style:"CLOSEUP",label:"特写",icon:ih}].map(w=>f.jsxs("button",{onClick:()=>R(w.style),className:`flex items-center gap-2 px-2 py-2.5 rounded-xl border transition-all ${E===w.style?"bg-rose-50 border-rose-200 text-rose-600 shadow-sm":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(w.icon,{size:13}),f.jsx("span",{className:"text-[11px] font-medium",children:w.label})]},w.style))}),f.jsx("p",{className:"text-xs text-gray-400 pl-1",children:E==="FULL_BODY"?"✓ 从头顶到脚底，包含完整面部和全身":E==="UPPER_BODY"?"✓ 从头顶到腰部/臀部，包含完整面部和上半身":E==="HEADLESS_FULL"?"✓ 从肩部/锁骨到脚底，不包含头部":E==="HEADLESS_UPPER"?"✓ 从肩部/颈部以下到腰部/臀部，不包含头部":E==="HEADLESS_LOWER"?"✓ 从腰部/臀部到脚底，不包含头部和胸部以上":"✓ 特写构图：仅生成局部细节特写，不应出现完整人物或全身构图"})]}),f.jsxs("div",{className:"space-y-3",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"3. 动作风格选择"}),f.jsx("div",{className:"grid grid-cols-2 gap-2",children:[{style:"DRESS",label:"礼服/长裙风格",icon:za},{style:"PANTS",label:"裤装风格",icon:Gs},{style:"SEXY",label:"辣妹风格",icon:Lg},{style:"CASUAL",label:"休闲/基础款",icon:Ug},{style:"POSE_REFERENCE",label:"姿势参考上传",icon:ih},{style:"FABRIC_CLOSEUP",label:"面料细节动作参考",icon:Tg}].map(w=>f.jsxs("button",{onClick:()=>{b(w.style),w.style!=="POSE_REFERENCE"&&pe(null)},className:`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${h===w.style?"bg-gray-900 text-white border-gray-900 shadow-md":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`,children:[f.jsx(w.icon,{size:14}),f.jsx("span",{className:"text-xs font-medium",children:w.label})]},w.style))}),f.jsx("p",{className:"text-xs text-gray-400 pl-1",children:"⚠️ “动作风格”只影响姿势/展示方式，不决定裁剪构图；真正决定是否生成特写/无头上半身的是上面的“构图风格”。"}),h==="POSE_REFERENCE"&&f.jsx("div",{className:"mt-3",children:f.jsx(Xl,{currentImage:X,onImageChange:pe,label:"姿势参考图"})})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500",children:"4. 自定义指令（可选）"}),f.jsx("textarea",{value:ie,onChange:w=>he(w.target.value),placeholder:"例如：要头部、无头、特定姿势...",className:"w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm min-h-[80px]"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"block text-xs font-bold text-gray-500 mb-2",children:"5. 生成数量 (1-10)"}),f.jsx("input",{type:"number",min:"1",max:"10",value:jt,onChange:w=>Zl(Math.min(Math.max(parseInt(w.target.value)||1,1),10)),className:"w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm"})]})]})]}),f.jsxs("div",{className:"absolute bottom-0 w-[400px] p-4 bg-white border-t border-gray-100",children:[nl&&f.jsx("div",{className:"mb-3 px-3 py-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100",children:nl}),f.jsx("button",{onClick:lt,disabled:!Se||Ut,className:`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${!Se||Ut?"bg-gray-300 cursor-not-allowed":"bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"}`,children:Ut?f.jsxs(f.Fragment,{children:[f.jsx(Eg,{className:"animate-spin w-4 h-4"}),f.jsx("span",{children:u==="ECOMMERCE_RETOUCH"?"精修处理中...":u==="HD_REDRAW_REPAIR"?"高清重绘处理中...":u==="GLOSS_ENHANCE"?"增强处理中...":"生成中..."})]}):f.jsxs(f.Fragment,{children:[u==="ECOMMERCE_RETOUCH"?f.jsx(uh,{className:"w-4 h-4"}):u==="HD_REDRAW_REPAIR"?f.jsx(za,{className:"w-4 h-4"}):u==="GLOSS_ENHANCE"?f.jsx(oh,{className:"w-4 h-4"}):f.jsx(sh,{className:"w-4 h-4"}),f.jsx("span",{children:u==="ECOMMERCE_RETOUCH"?"开始电商精修":u==="HD_REDRAW_REPAIR"?"开始高清重绘修复":u==="GLOSS_ENHANCE"?"开始增强光泽":"生成换动作图片"})]})})]})]}),f.jsx("main",{className:"flex-1 h-full overflow-hidden bg-[#F0F2F5]",children:qt.length>0?f.jsxs("div",{className:"flex h-full gap-4 p-6",children:[f.jsxs("div",{className:"flex-1 flex flex-col gap-4",children:[f.jsxs("div",{className:"flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border relative",children:[f.jsx("img",{src:qt[_t],className:"w-full h-full object-contain",alt:`预览 #${_t+1}`}),f.jsxs("div",{className:"absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full",children:[f.jsxs("span",{className:"text-sm font-bold",children:["#",_t+1]}),f.jsxs("span",{className:"text-xs opacity-75 ml-2",children:["共 ",qt.length," 张"]})]}),f.jsx("div",{className:"absolute bottom-4 right-4",children:f.jsxs("button",{onClick:()=>qp(qt[_t],`${u==="ECOMMERCE_RETOUCH"?"ecommerce-retouch":u==="HD_REDRAW_REPAIR"?"hd-redraw-repair":u==="GLOSS_ENHANCE"?"gloss-enhanced":"change-action"}-${_t+1}-${Date.now()}.png`),className:"px-5 py-2.5 bg-white text-gray-900 rounded-full text-sm font-bold shadow-lg hover:bg-gray-50 flex items-center gap-2 cursor-pointer",children:[f.jsx(fg,{size:16}),"下载原图"]})})]}),u==="GLOSS_ENHANCE"&&Qn&&_t===0&&f.jsx("div",{className:"rounded-xl p-4 border bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200",children:f.jsxs("div",{className:"flex items-start gap-2",children:[f.jsx(za,{className:"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"}),f.jsxs("div",{className:"flex-1",children:[f.jsx("h4",{className:"text-sm font-bold mb-2 text-amber-900",children:"AI 分析报告"}),f.jsx("div",{className:"text-xs whitespace-pre-wrap leading-relaxed text-amber-800",children:Qn})]})]})})]}),f.jsxs("div",{className:"flex flex-col",style:{width:"520px"},children:[f.jsx("div",{className:"mb-3 px-1",children:f.jsx("h3",{className:"text-xs font-bold text-gray-500 uppercase",children:"生成结果"})}),f.jsx("div",{className:"flex-1 overflow-y-auto pr-2",children:f.jsx("div",{className:"grid grid-cols-4 gap-3",children:qt.map((w,we)=>f.jsxs("button",{onClick:()=>Ft(we),className:`relative aspect-[2/3] rounded-xl overflow-hidden shadow-md transition-all border-3 ${_t===we?"border-rose-500 scale-105 ring-2 ring-rose-200":"border-white hover:border-gray-300"}`,children:[f.jsx("img",{src:w,className:"w-full h-full object-cover",alt:`结果 ${we+1}`}),f.jsxs("div",{className:"absolute top-1.5 left-1.5 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full",children:["#",we+1]}),_t===we&&f.jsx("div",{className:"absolute inset-0 bg-rose-500/20 border-2 border-rose-500 pointer-events-none rounded-xl"})]},we))})})]})]}):f.jsx("div",{className:"h-full flex items-center justify-center p-6",children:f.jsxs("div",{className:"text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border max-w-md",children:[f.jsx("div",{className:"w-24 h-24 bg-gradient-to-tr from-rose-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6",children:f.jsx(za,{className:"w-10 h-10 text-rose-400"})}),f.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"准备创作"}),f.jsxs("p",{className:"text-gray-500 text-sm",children:["请上传产品图片，选择动作风格。",f.jsx("br",{}),"AI 将为您生成不同姿势的时尚作品。"]})]})})})]}):f.jsx(kg,{onKeySelected:()=>d(!0)})},Oh=document.getElementById("root");if(!Oh)throw new Error("Could not find root element to mount to");const Xp=tg.createRoot(Oh);Xp.render(f.jsx(Th.StrictMode,{children:f.jsx(Fp,{})}));
