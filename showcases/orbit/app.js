'use strict';
const transactions = [
  {name:'Olivia Rhye',email:'olivia@example.com',initials:'OR',order:'ORB-1048',date:'Oct 30, 2026',status:'Completed',amount:189.00,item:'Studio essentials kit',color:'#eee6dc'},
  {name:'Phoenix Baker',email:'phoenix@example.com',initials:'PB',order:'ORB-1047',date:'Oct 30, 2026',status:'Completed',amount:124.50,item:'Everyday collection',color:'#e4e8f3'},
  {name:'Lana Steiner',email:'lana@example.com',initials:'LS',order:'ORB-1046',date:'Oct 29, 2026',status:'Pending',amount:249.00,item:'Workspace bundle',color:'#ebe7f3'},
  {name:'Demi Wilkinson',email:'demi@example.com',initials:'DW',order:'ORB-1045',date:'Oct 29, 2026',status:'Completed',amount:86.00,item:'Notebook collection',color:'#e5ece5'},
  {name:'Drew Cano',email:'drew@example.com',initials:'DC',order:'ORB-1044',date:'Oct 28, 2026',status:'Refunded',amount:154.00,item:'Desk accessories set',color:'#f0e7e2'},
  {name:'Natali Craig',email:'natali@example.com',initials:'NC',order:'ORB-1043',date:'Oct 28, 2026',status:'Completed',amount:312.00,item:'Complete studio set',color:'#e6eaf0'}
];
const periods = {
  week:{date:'Oct 24 – Oct 30, 2026',revenue:'$12,486',cents:'.00',orders:'326',average:'$38',averageCents:'.30',conversion:'3.48',changes:['12.4%','9.2%','2.9%','0.2%'],labels:['Oct 24','Oct 25','Oct 26','Oct 27','Oct 28','Oct 29','Oct 30'],points:[165,138,146,90,106,57,29],caption:'A good week, getting better.'},
  month:{date:'Oct 1 – Oct 30, 2026',revenue:'$48,295',cents:'.00',orders:'1,248',average:'$38',averageCents:'.70',conversion:'3.62',changes:['18.6%','12.8%','5.2%','0.4%'],labels:['Oct 1','Oct 5','Oct 10','Oct 15','Oct 20','Oct 25','Oct 30'],points:[175,166,178,138,145,126,143,100,109,87,105,63,79,45,53,26,39,16],caption:'A good month, getting better.'},
  quarter:{date:'Aug 2 – Oct 30, 2026',revenue:'$136,842',cents:'.00',orders:'3,628',average:'$37',averageCents:'.72',conversion:'3.41',changes:['24.1%','19.3%','4.0%','0.6%'],labels:['Aug 2','Aug 17','Sep 1','Sep 16','Oct 1','Oct 16','Oct 30'],points:[182,168,176,156,162,140,148,117,132,108,110,90,98,67,72,48,54,25],caption:'A good quarter, getting better.'}
};
let activePeriod = 'month';
const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
function filteredRows(){
  const query = document.querySelector('#search').value.toLowerCase().trim();
  const status = document.querySelector('#status-filter').value;
  return transactions.filter(row => (status === 'all' || row.status === status) && `${row.name} ${row.email} ${row.order}`.toLowerCase().includes(query));
}
function renderTable(){
  const rows = filteredRows();
  document.querySelector('#transaction-rows').innerHTML = rows.length ? rows.map(row => `<tr><td><div class="customer"><span class="customer-avatar" style="background:${row.color}">${row.initials}</span><div>${row.name}<small>${row.email}</small></div></div></td><td>#${row.order}</td><td>${row.date}</td><td><span class="status ${row.status.toLowerCase()}">${row.status}</span></td><td class="amount">${money(row.amount)}</td><td><button class="detail-button" data-order="${row.order}" aria-label="View order ${row.order}">${window.portfolioIcons.arrow("up-right")}</button></td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center;padding:35px">No matching transactions. Try another search or status.</td></tr>';
  document.querySelector('#result-count').textContent = rows.length;
  document.querySelector('#table-summary').textContent = `Showing ${rows.length} of 6 recent sample transactions`;
}
function changePeriod(key){
  activePeriod = key;
  const data = periods[key];
  document.querySelector('#date-label').textContent = data.date;
  document.querySelector('#revenue').innerHTML = `${data.revenue}<span>${data.cents}</span>`;
  document.querySelector('#orders').textContent = data.orders;
  document.querySelector('#average').innerHTML = `${data.average}<span>${data.averageCents}</span>`;
  document.querySelector('#conversion').innerHTML = `${data.conversion}<span>%</span>`;
  document.querySelector('#channel-total').textContent = data.orders;
  document.querySelectorAll('.metric .change').forEach((el,index) => el.innerHTML = window.portfolioIcons.text(`→ ${data.changes[index]}`));
  document.querySelector('.chart-note strong').textContent = `${data.changes[0]} higher`;
  document.querySelector('.revenue-panel .panel-heading p').textContent = data.caption;
  document.querySelector('#chart-x').innerHTML = data.labels.map(label => `<span>${label}</span>`).join('');
  const coords = data.points.map((y,index) => `${(index*800/(data.points.length-1)).toFixed(1)} ${y}`);
  const path = `M${coords.join('L')}`;
  document.querySelector('#current-line').setAttribute('d',path);
  document.querySelector('#area-fill').setAttribute('d',`${path}L800 200L0 200Z`);
  const previous = data.points.map((y,index) => `${(index*800/(data.points.length-1)).toFixed(1)} ${Math.min(190,y+24+(index%3)*8)}`);
  document.querySelector('#previous-line').setAttribute('d',`M${previous.join('L')}`);
  document.querySelector('#revenue-chart').setAttribute('aria-label',`Illustrative revenue for ${data.date}, increasing ${data.changes[0]} over the previous period.`);
  document.querySelectorAll('[data-period]').forEach(button => {const selected=button.dataset.period===key;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
}
document.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click',() => changePeriod(button.dataset.period)));
document.querySelector('#search').addEventListener('input',renderTable);
document.querySelector('#status-filter').addEventListener('change',renderTable);
const dialog = document.querySelector('#detail-dialog');
dialog.setAttribute('aria-labelledby','detail-title');
document.querySelector('#transaction-rows').addEventListener('click',event => {
  const button = event.target.closest('[data-order]');
  if(!button)return;
  const row = transactions.find(item => item.order === button.dataset.order);
  document.querySelector('#detail-title').textContent = `#${row.order}`;
  const entries=[['Customer',row.name],['Email',row.email],['Product',row.item],['Date',row.date],['Status',row.status],['Amount',money(row.amount)]];
  document.querySelector('#detail-content').innerHTML=entries.map(([label,value])=>`<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`).join('');
  dialog.showModal();
});
dialog.addEventListener('click',event => {if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
document.querySelector('#export').addEventListener('click',() => {
  const data=periods[activePeriod];
  const rows=[['ORBIT - illustrative demo report'],['Period',data.date],['Revenue',data.revenue+data.cents],['Orders',data.orders],['Average order',data.average+data.averageCents],['Conversion',data.conversion+'%'],[],['Recent sample transactions (current filters)'],['Order','Customer','Email','Date','Status','Amount USD'],...filteredRows().map(row=>[row.order,row.name,row.email,row.date,row.status,row.amount.toFixed(2)])];
  const csv=rows.map(row=>row.map(value=>'"'+(window.showcaseLanguage?.translate(String(value)) ?? String(value)).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));
  const link=document.createElement('a');link.href=url;link.download=`orbit-demo-${activePeriod}.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  const toast=document.querySelector('#toast');toast.textContent='Sample report exported. Your next big picture, in a spreadsheet.';toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),4000);
});
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('nav a').forEach(item=>item.classList.remove('active'));link.classList.add('active');}));
changePeriod('month');
renderTable();
