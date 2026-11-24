"use strict";
(() => {
 const $=id=>document.getElementById(id), names=["Elena","Hugo","Inés"];
 const skills={Elena:["P","S"],Hugo:["P","F"],"Inés":["S","F"]};
 const base={P:3,S:4,F:2};
 let lastSchedule=[];
 const fmt=n=>Number(n).toFixed(2).replace(/\.00$/,"");
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function times(alt){return {P:alt==="B"?1.5:3,S:alt==="C"?3:4,F:2,calibration:alt==="C"?9:0};}
 function validate(){
  const alt=$("alternative").value, orders=Number($("orders").value), horizon=Number($("horizon").value);
  if(!Number.isInteger(orders)||orders<0)throw Error("Los pedidos deben ser un entero no negativo.");
  if(!Number.isFinite(horizon)||horizon<=0)throw Error("La ventana debe ser un número positivo.");
  const assignment={P:$("assignP").value,S:$("assignS").value,F:$("assignF").value};
  if(new Set(Object.values(assignment)).size!==3)throw Error("Asignación inválida: una persona no puede ocupar dos etapas.");
  for(const stage of ["P","S","F"]){const person=assignment[stage];if(!skills[person].includes(stage))throw Error(person+" no tiene habilidad acreditada para "+stage+".");}
  for(const person of names){if(!$("available"+(person==="Inés"?"Ines":person)).checked)throw Error(person+" no está disponible; el modelo de puestos fijos rechaza esta asignación.");}
  return {alt,orders,horizon,assignment};
 }
 function simulate(alt,orders,horizon,assignment){
  const t=times(alt);let pEnd=0,sEnd=t.calibration,fEnd=0;const rows=[];
  for(let i=1;i<=orders;i++){
   const pStart=pEnd,pFinish=pStart+t.P;pEnd=pFinish;
   const sStart=Math.max(pFinish,sEnd),sFinish=sStart+t.S;sEnd=sFinish;
   const fStart=Math.max(sFinish,fEnd),fFinish=fStart+t.F;fEnd=fFinish;
   rows.push({order:i,pStart,pFinish,sStart,sFinish,fStart,fFinish,onTime:fFinish<=horizon+1e-9});
  }
  return {rows,t,first:rows[0]?.fFinish??null,lead:fEnd,onTime:rows.filter(x=>x.onTime).length};
 }
 function metric(label,value){return '<div class="metric"><span>'+label+'</span><strong>'+value+'</strong></div>';}
 function run(){
  $("error").textContent="";
  try{
   const v=validate(),r=simulate(v.alt,v.orders,v.horizon,v.assignment);lastSchedule=r.rows;
   const missing=v.orders-r.onTime;
   $("status").textContent="Simulación completada · flujo P → S → F · pedidos disponibles desde t = 0.";
   $("metrics").innerHTML=metric("Primer pedido terminado",r.first===null?"—":fmt(r.first)+" min")+metric("Plazo del último pedido",fmt(r.lead)+" min")+metric("Entregas puntuales",r.onTime+" / "+v.orders)+metric("Faltantes en ventana",String(missing));
   $("stageResults").innerHTML=["P","S","F"].map(k=>'<tr><td>'+({P:"Preparación",S:"Costura",F:"Acabado"}[k])+'</td><td>'+esc(v.assignment[k])+'</td><td>'+fmt(r.t[k])+'</td><td>'+(k==="S"?"Persona y máquina": "Persona y mesa")+'</td></tr>').join("");
   $("decision").innerHTML=r.onTime===v.orders?'<span class="good">Cumple el pedido dentro de la ventana.</span>': '<span class="bad">No cumple: faltan '+missing+' pedido(s) dentro de la ventana.</span>'+(r.lead>v.horizon?' El plazo completo rebasa la disponibilidad; la continuación teórica no cuenta como entrega.':'');
   $("schedule").innerHTML=r.rows.length?r.rows.map(x=>'<tr><td>'+x.order+'</td><td>'+fmt(x.pStart)+'</td><td>'+fmt(x.pFinish)+'</td><td>'+fmt(x.sStart)+'</td><td>'+fmt(x.sFinish)+'</td><td>'+fmt(x.fStart)+'</td><td>'+fmt(x.fFinish)+'</td><td class="'+(x.onTime?"good":"bad")+'">'+(x.onTime?"Sí":"No")+'</td></tr>').join(""):'<tr><td colspan="8">No hay pedidos solicitados.</td></tr>';
   const a=simulate("A",v.orders,v.horizon,v.assignment),b=simulate("B",v.orders,v.horizon,v.assignment),c=simulate("C",v.orders,v.horizon,v.assignment);
   const cost={A:0,B:90,C:450}, results={A:a,B:b,C:c};
   $("economics").innerHTML='<table><thead><tr><th>Alternativa</th><th>Entregas</th><th>Extra vs. A</th><th>Contribución en 30 sesiones</th><th>Inversión</th><th>Saldo incremental</th></tr></thead><tbody>'+["A","B","C"].map(k=>{const extra=results[k].onTime-a.onTime,contribution=extra*7*30;return '<tr><td>'+k+'</td><td>'+results[k].onTime+'</td><td>'+extra+'</td><td>'+contribution+' u. m.</td><td>'+cost[k]+' u. m.</td><td>'+ (contribution-cost[k])+' u. m.</td></tr>';}).join("")+'</tbody></table>';
   $("csv").disabled=false;
  }catch(e){$("error").textContent=e.message;$("status").textContent="Corrige los datos antes de simular.";$("metrics").innerHTML="";lastSchedule=[];$("csv").disabled=true;}
 }
 function reset(){$("alternative").value="A";$("orders").value=16;$("horizon").value=60;$("assignP").value="Elena";$("assignS").value="Inés";$("assignF").value="Hugo";names.forEach(n=>$("available"+(n==="Inés"?"Ines":n)).checked=true);$("status").textContent="Ejecuta la simulación para ver resultados.";$("metrics").innerHTML="";$("stageResults").innerHTML='<tr><td colspan="4">Sin simular</td></tr>';$("schedule").innerHTML='<tr><td colspan="8">Sin simular</td></tr>';$("decision").textContent="";$("error").textContent="";$("csv").disabled=true;$("economics").innerHTML="";lastSchedule=[];}
 function csv(){if(!lastSchedule.length)return;const rows=[["pedido","P_inicio","P_fin","S_inicio","S_fin","F_inicio","F_fin","puntual"],...lastSchedule.map(x=>[x.order,x.pStart,x.pFinish,x.sStart,x.sFinish,x.fStart,x.fFinish,x.onTime?"si":"no"])];const data="\uFEFF"+rows.map(r=>r.join(",")).join("\r\n");const url=URL.createObjectURL(new Blob([data],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="cronograma-puntada.csv";a.click();URL.revokeObjectURL(url);}
 $("simulate").addEventListener("click",run);$("reset").addEventListener("click",reset);$("csv").addEventListener("click",csv);
 // Pruebas manuales incorporadas como aserciones del motor de calendario.
 const q=simulate("A",1,9,{P:"Elena",S:"Inés",F:"Hugo"});console.assert(q.onTime===1&&q.lead===9,"A, 1 pedido, H=9");
 const w=simulate("A",2,12,{P:"Elena",S:"Inés",F:"Hugo"});console.assert(w.onTime===2&&w.lead===13,"A, 2 pedidos, H=12");
 const z=simulate("C",2,17,{P:"Elena",S:"Inés",F:"Hugo"});console.assert(z.onTime===2&&z.lead===17,"C, 2 pedidos, H=17");
})();