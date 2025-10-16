import{m as c}from"./maplibre-D6KsYbmY.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();class ${constructor(e,t={}){this.map=null,this.markers=[],this.init(e,t)}init(e,t){const o={center:[0,20],zoom:1.5,pitch:0,bearing:0,projection:"globe",antialias:!0};this.map=new c.Map({container:e,style:{version:8,sources:{osm:{type:"raster",tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}},layers:[{id:"osm-tiles",type:"raster",source:"osm",minzoom:0,maxzoom:19}]},...o,...t}),this.map.addControl(new c.NavigationControl({visualizePitch:!0}),"top-left"),this.map.addControl(new c.ScaleControl({maxWidth:100,unit:"metric"})),this.map.on("load",()=>{console.log("Map loaded successfully")})}flyTo(e,t=2e3){this.map.flyTo({...e,duration:t,essential:!0,easing:o=>o*(2-o)})}async loadGeoJSON(e){try{const t=await fetch(e);if(!t.ok)throw new Error(`Failed to load GeoJSON: ${t.statusText}`);const o=await t.json();return console.log(`Loaded ${o.features.length} features from GeoJSON`),o}catch(t){throw console.error("Error loading GeoJSON:",t),t}}addMarker(e,t,o={}){const r=new c.Marker({element:t,anchor:"center"}).setLngLat(e).addTo(this.map);return r.properties=o,this.markers.push(r),r}clearMarkers(){this.markers.forEach(e=>e.remove()),this.markers=[]}filterMarkers(e){this.markers.forEach(t=>{const o=e(t.properties);t.getElement().style.display=o?"block":"none"})}highlightMarkers(e){this.markers.forEach(t=>{const o=e(t.properties),r=t.getElement();o?(r.classList.add("highlighted"),r.style.opacity="1",r.style.transform="scale(1.2)"):(r.classList.remove("highlighted"),r.style.opacity="0.4",r.style.transform="scale(1)")})}resetMarkers(){this.markers.forEach(e=>{const t=e.getElement();t.classList.remove("highlighted"),t.style.opacity="1",t.style.transform="scale(1)",t.style.display="block"})}getCameraPosition(){return{center:this.map.getCenter().toArray(),zoom:this.map.getZoom(),pitch:this.map.getPitch(),bearing:this.map.getBearing()}}getMap(){return this.map}}const h={"Humanities and social sciences":"#F4A460","Natural sciences":"#2ECC71","Formal sciences":"#00CED1","Professions and applied sciences":"#9B59B6","no diploma":"#95A5A6",null:"#95A5A6"};function y(l){return!l||l==="no diploma"?[h["no diploma"]]:l.split(",").map(t=>t.trim()).map(t=>h[t]||h[null])}const M={"Silent Generation":4,"Baby Boomers":3,"Generation X":2,Millennials:1,"Generation Y - Millennials":1,"Generation Y":1};function P(l){return M[l]||1}function b(l){return l==="Female"?180:0}class w{static generate(e){const{"Academic field":t,Generation:o,Gender:r,iconUrl:s}=e,a=P(o),i=y(t),n=b(r);return this.createMarkerElement(a,i,n,s,e)}static createMarkerElement(e,t,o,r,s){const a=document.createElement("div");a.className="marker-container",a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label",`${s["Head of state"]}, ${s.Title}`);const i=this.createSVG(e,t,o,r);return a.innerHTML=i,a}static createSVG(e,t,o,r){const i=this.getPetalPath(e,60),n=t.length>1?this.createGradientDef(t):"",d=t.length>1?"url(#petal-gradient)":t[0];return`
      <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${n}
          <clipPath id="clip-${Math.random().toString(36).substr(2,9)}">
            <path d="${i}" />
          </clipPath>
        </defs>

        <!-- Portrait image -->
        <image
          href="/scrolly/assets/portraits/${r}"
          width="60"
          height="60"
          clip-path="url(#clip-${Math.random().toString(36).substr(2,9)})"
          preserveAspectRatio="xMidYMid slice"
        />

        <!-- Petal border -->
        <g transform="rotate(${o} 30 30)">
          <path
            d="${i}"
            fill="${d}"
            fill-opacity="0.3"
            stroke="${t[0]}"
            stroke-width="2"
          />
        </g>
      </svg>
    `}static getPetalPath(e,t){const o=t/2,r=t/2-2;switch(e){case 1:return this.circlePath(o,r);case 2:return this.twoPetalPath(o,r);case 3:return this.threePetalPath(o,r);case 4:return this.fourPetalPath(o,r);default:return this.circlePath(o,r)}}static circlePath(e,t){return`M ${e-t},${e}
            a ${t},${t} 0 1,0 ${t*2},0
            a ${t},${t} 0 1,0 ${-t*2},0`}static twoPetalPath(e,t){const o=t*.7,r=t*.35;return`
      M ${e},${e-t}
      Q ${e+o},${e-r} ${e},${e}
      Q ${e-o},${e-r} ${e},${e-t}
      M ${e},${e}
      Q ${e+o},${e+r} ${e},${e+t}
      Q ${e-o},${e+r} ${e},${e}
      Z
    `}static threePetalPath(e,t){const o=[],r=t*.6;for(let s=0;s<3;s++){const a=(s*120-90)*Math.PI/180,i=e+Math.cos(a)*r,n=e+Math.sin(a)*r;o.push(`
        M ${e},${e}
        Q ${i+Math.cos(a+Math.PI/2)*r},${n+Math.sin(a+Math.PI/2)*r}
          ${i},${n}
        Q ${i+Math.cos(a-Math.PI/2)*r},${n+Math.sin(a-Math.PI/2)*r}
          ${e},${e}
      `)}return o.join(" ")+" Z"}static fourPetalPath(e,t){const o=[],r=t*.55;for(let s=0;s<4;s++){const a=s*90*Math.PI/180,i=e+Math.cos(a)*r,n=e+Math.sin(a)*r;o.push(`
        M ${e},${e}
        Q ${i+Math.cos(a+Math.PI/2)*r*.8},${n+Math.sin(a+Math.PI/2)*r*.8}
          ${i},${n}
        Q ${i+Math.cos(a-Math.PI/2)*r*.8},${n+Math.sin(a-Math.PI/2)*r*.8}
          ${e},${e}
      `)}return o.join(" ")+" Z"}static createGradientDef(e){return`
      <linearGradient id="petal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        ${e.map((o,r)=>`<stop offset="${r/(e.length-1)*100}%" stop-color="${o}" />`).join(`
`)}
      </linearGradient>
    `}}class m{constructor(){this.mapController=null,this.leaders=null,this.init()}async init(){try{console.log("Initializing Atlas of Leadership..."),this.mapController=new $("map",{center:[0,20],zoom:1.5,pitch:0,bearing:0}),await this.loadData(),this.renderMarkers(),this.setupUI(),console.log("Atlas of Leadership initialized successfully")}catch(e){console.error("Failed to initialize application:",e),this.showError("Failed to load application. Please refresh the page.")}}async loadData(){try{const e="/scrolly/";this.leaders=await this.mapController.loadGeoJSON(`${e}leaders.geojson`),console.log(`Loaded ${this.leaders.features.length} leaders`)}catch(e){throw console.error("Error loading leader data:",e),new Error("Failed to load leader data")}}renderMarkers(){if(!this.leaders||!this.leaders.features){console.error("No leader data available");return}console.log("Rendering markers...");let e=0,t=0;this.leaders.features.forEach(o=>{try{const{geometry:r,properties:s}=o;if(!r||!r.coordinates){console.warn("Missing coordinates for:",s.Title),t++;return}const a=w.generate(s);a.addEventListener("click",()=>{this.showLeaderDetail(s)}),a.addEventListener("keypress",i=>{(i.key==="Enter"||i.key===" ")&&this.showLeaderDetail(s)}),this.mapController.addMarker(r.coordinates,a,s),e++}catch(r){console.error("Error rendering marker for:",properties.Title,r),t++}}),console.log(`Rendered ${e} markers (${t} errors)`)}setupUI(){var r;const e=document.getElementById("legend-toggle"),t=document.getElementById("legend-panel");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("collapsed")});const o=document.getElementById("detail-modal");o&&((r=o.querySelector(".modal-backdrop"))==null||r.addEventListener("click",()=>{this.hideModal()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&o.classList.contains("visible")&&this.hideModal()}))}showLeaderDetail(e){const t=document.getElementById("detail-modal"),o=t.querySelector(".modal-content");if(!t||!o)return;const{Title:r,"Head of state":s,"Academic field":a,Profession:i,University:n,Gender:d,"Birth year ":p,Generation:g,iconUrl:u,Region:f}=e;o.innerHTML=`
      <button class="close-btn" aria-label="Close">&times;</button>
      <div class="modal-header" style="text-align: center; margin-bottom: 2rem;">
        <img
          src="/scrolly/assets/portraits/${u}"
          alt="${s}"
          style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"
        />
        <h2 style="margin: 0.5rem 0; font-size: 1.8rem;">${s}</h2>
        <h3 style="margin: 0.5rem 0; color: #666; font-weight: 400;">${r}</h3>
      </div>
      <div class="modal-body" style="line-height: 1.8;">
        <p><strong>Region:</strong> ${f}</p>
        <p><strong>Generation:</strong> ${g} ${p?`(Born ${p})`:""}</p>
        <p><strong>Gender:</strong> ${d}</p>
        <p><strong>Academic Field:</strong> ${a||"No diploma"}</p>
        ${i?`<p><strong>Profession:</strong> ${i}</p>`:""}
        ${n?`<p><strong>University:</strong> ${n}</p>`:""}
      </div>
    `,o.querySelector(".close-btn").addEventListener("click",()=>{this.hideModal()}),t.classList.add("visible")}hideModal(){const e=document.getElementById("detail-modal");e&&e.classList.remove("visible")}showError(e){const t=document.getElementById("narrative-container");t&&(t.innerHTML=`
        <div class="error-message" style="
          background: rgba(244, 67, 54, 0.95);
          color: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 600px;
          margin: 2rem;
          text-align: center;
        ">
          <h2>Error</h2>
          <p>${e}</p>
        </div>
      `)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>new m):new m;
