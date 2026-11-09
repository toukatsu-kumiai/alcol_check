// アルコールチェック: 宛先欄へ直接渡すための修正版
// 公開中 app.js を上書きせずに、メール操作だけを変更する。
(function(){
 'use strict';
 function openMail(){
  const email=String(document.getElementById('email').value||'').trim();
  const status=document.getElementById('status');
  if(!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)){
   status.textContent='組合のメールアドレスを確認してください。';return false;
  }
  const month=document.getElementById('month').value;
  const no=document.getElementById('number').value;
  const name=document.getElementById('name').value;
  const subject=`${month} アルコールチェック表 No.${no}`;
  const message=`組合事務局 御中\n\n${month}のアルコールチェック表を提出します。\n組合番号：${no}\n事業者名：${name}\n\n※保存したPDFを添付して送信してください。`;
  // 宛先の @ をエンコードせず、mailto の受信者欄に配置。
  const a=document.createElement('a');
  a.href='mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);
  a.style.display='none';document.body.appendChild(a);a.click();a.remove();
  return true;
 }
 const shareManual=document.getElementById('shareFileManualTo');
 shareManual.onclick=async()=>{
  if(!valid(true))return;
  const f=pdf();
  const status=document.getElementById('status');
  if(navigator.canShare&&navigator.canShare({files:[f]})){
   try{
    await navigator.share({files:[f],title:`${document.getElementById('month').value} アルコールチェック表`,text:`組合番号：${document.getElementById('number').value}　事業者名：${document.getElementById('name').value}`});
    status.textContent='PDFを共有しました。メールの宛先欄は手動で入力してください。';
   }catch(e){if(e.name!=='AbortError')status.textContent='共有に失敗しました。PDFを保存してメールに添付してください。';}
  }else{download(f);status.textContent='PDFを保存しました。宛先入りメールを開いて手動で添付してください。';}
 };
 const mail=document.getElementById('mail');
 const share=document.getElementById('share');
 mail.onclick=()=>{if(valid(true))openMail()};
 share.onclick=()=>{
  if(!valid(true))return;
  const file=pdf();download(file);
  document.getElementById('status').textContent='PDFを保存しました。メールの宛先は自動入力されます。保存したPDFをメールに添付してください。';
  // 端末によっては連続ダウンロードと mailto 起動が競合するため、確認を挟む。
  if(confirm('PDFを保存しました。\n\n続けて宛先入りメールを開きます。PDFは自動添付できないため、保存したPDFを添付して送信してください。'))openMail();
 };
})();
