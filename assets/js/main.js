
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbxZWPsiCuOumFQugWoJrG-o3MWuJf8xRHRpl9GF9iMCt4ZKyN5ynOWanOxFNjvDe-IV/exec";
const FINAL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSexq5kZ9xPARMug7HFBH627dSio7PZx19FQrWQepQhw8s--pA/viewform";
let currentSource = "مباشر";
function openLeadModal(sourceText){currentSource=sourceText||"مباشر";document.getElementById('leadSource').value=currentSource;document.getElementById('leadModal').classList.add('active');document.body.style.overflow='hidden';}
function closeLeadModal(){document.getElementById('leadModal').classList.remove('active');document.body.style.overflow='';}
function handleLeadSubmit(e){
e.preventDefault();
const name=document.getElementById('leadName').value.trim();
const phone=document.getElementById('leadPhone').value.trim();
const source=document.getElementById('leadSource').value||currentSource;
const btn=document.getElementById('leadSubmitBtn');
const btnText=btn.querySelector('.btn-text');
const btnLoader=btn.querySelector('.btn-loader');
const errorDiv=document.getElementById('leadError');
errorDiv.style.display='none';
if(name.length<2){errorDiv.textContent='الرجاء إدخال اسم صحيح';errorDiv.style.display='block';return false;}
if(!/^09[0-9]{8}$/.test(phone)){errorDiv.textContent='رقم الهاتف يجب أن يكون 10 أرقام يبدأ بـ 09';errorDiv.style.display='block';return false;}
btnText.style.display='none';btnLoader.style.display='inline';btn.disabled=true;
localStorage.setItem('lead_name',name);localStorage.setItem('lead_phone',phone);localStorage.setItem('lead_source',source);
// فتح التقييم فوراً لتفادي حظر المتصفح
const win = window.open(FINAL_FORM_URL, '_blank');
fetch(GOOGLE_SHEET_WEBHOOK,{
  method:'POST',
  mode:'no-cors',
  headers:{'Content-Type':'text/plain;charset=utf-8'},
  body:JSON.stringify({name:name,phone:phone,source:source})
}).catch(err=>console.warn('Sheet error', err))
.finally(()=>{
  setTimeout(()=>{
    btnText.style.display='inline';btnLoader.style.display='none';btn.disabled=false;
    closeLeadModal();
    document.getElementById('leadForm').reset();
  }, 500);
});
if(!win){
  errorDiv.textContent='الرجاء السماح بالنوافذ المنبثقة ليفتح التقييم';
  errorDiv.style.display='block';
  btnText.style.display='inline';btnLoader.style.display='none';btn.disabled=false;
  setTimeout(()=>{ window.location.href = FINAL_FORM_URL; }, 1000);
}
return false;
}
window.openLeadModal = openLeadModal;
window.closeLeadModal = closeLeadModal;
window.handleLeadSubmit = handleLeadSubmit;
document.addEventListener('DOMContentLoaded',function(){
document.querySelectorAll('.btn-get-started,.btn-outline-primary,.btn-primary-custom,.btn-secondary-custom').forEach(btn=>{
btn.addEventListener('click',function(e){e.preventDefault();const source=btn.getAttribute('data-source')||btn.textContent.trim()||'مباشر';openLeadModal(source);});
});
if(typeof AOS !== 'undefined') AOS.init();
});
