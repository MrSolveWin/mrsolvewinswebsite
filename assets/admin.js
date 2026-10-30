import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
const $ = id => document.getElementById(id);
const loginPanel=$("login-panel"), dashboard=$("dashboard"), loginMessage=$("login-message"), dashMessage=$("dashboard-message");
if (!SUPABASE_URL.startsWith("https://") || SUPABASE_ANON_KEY.includes("PASTE_")) {
  loginMessage.textContent="Setup needed: add your Supabase project URL and public anon/publishable key in assets/config.js.";
} else {
  const db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
  $("login-form").addEventListener("submit",async e=>{e.preventDefault();loginMessage.textContent="Signing in…";const {error}=await db.auth.signInWithPassword({email:$("email").value,password:$("password").value});loginMessage.textContent=error?error.message:"";});
  $("logout").addEventListener("click",async()=>{await db.auth.signOut();});
  $("video-form").addEventListener("submit",saveVideo);
  $("cancel-edit").addEventListener("click",resetForm);
  db.auth.onAuthStateChange((_event,session)=>{loginPanel.classList.toggle("hidden",!!session);dashboard.classList.toggle("hidden",!session);if(session)loadVideos();});
  const {data:{session}}=await db.auth.getSession();loginPanel.classList.toggle("hidden",!!session);dashboard.classList.toggle("hidden",!session);if(session)loadVideos();
  async function saveVideo(e){
    e.preventDefault();dashMessage.textContent="";
    const youtubeId=parseYoutubeId($("url").value);
    if(!youtubeId){dashMessage.textContent="Please enter a valid YouTube video URL.";return;}
    const payload={title:$("title").value.trim(),description:$("description").value.trim(),youtube_id:youtubeId,published:$("published").checked};
    const id=$("video-id").value;
    const result=id?await db.from("videos").update(payload).eq("id",id):await db.from("videos").insert(payload);
    if(result.error){dashMessage.textContent=result.error.message;return;}
    dashMessage.textContent=id?"Video updated.":"Video added.";resetForm();loadVideos();
  }
  async function loadVideos(){
    const {data,error}=await db.from("videos").select("*").order("created_at",{ascending:false});
    if(error){$("admin-list").textContent=error.message;return;}
    $("admin-list").innerHTML=data.map(v=>`<div class="admin-row"><div><strong>${escapeHtml(v.title)}</strong><small>${v.published?"Public":"Hidden"} · youtube.com/watch?v=${escapeHtml(v.youtube_id)}</small></div><div><button class="button ghost" data-edit="${v.id}">Edit</button><button class="button ghost" data-delete="${v.id}">Delete</button></div></div>`).join("")||'<p class="muted">No videos added yet.</p>';
    $("admin-list").querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>editVideo(data.find(v=>v.id===b.dataset.edit))));
    $("admin-list").querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>deleteVideo(b.dataset.delete)));
  }
  function editVideo(v){$("video-id").value=v.id;$("title").value=v.title;$("url").value=`https://www.youtube.com/watch?v=${v.youtube_id}`;$("description").value=v.description||"";$("published").checked=v.published;$("save-button").textContent="Save changes";$("cancel-edit").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});}
  async function deleteVideo(id){if(!confirm("Delete this video from your website?"))return;const {error}=await db.from("videos").delete().eq("id",id);dashMessage.textContent=error?error.message:"Video deleted.";loadVideos();}
  function resetForm(){$("video-form").reset();$("video-id").value="";$("published").checked=true;$("save-button").textContent="Add video";$("cancel-edit").classList.add("hidden");}
}
function parseYoutubeId(raw){try{const u=new URL(raw);if(u.hostname==="youtu.be")return u.pathname.slice(1).split("/")[0]||null;if(["youtube.com","www.youtube.com","m.youtube.com"].includes(u.hostname)){if(u.pathname==="/watch")return u.searchParams.get("v");const m=u.pathname.match(/^\/(shorts|embed)\/([^/?]+)/);return m?m[2]:null;}}catch{}return null;}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
