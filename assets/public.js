import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
document.getElementById("year").textContent = new Date().getFullYear();
const grid = document.getElementById("video-grid");
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_ANON_KEY.includes("PASTE_");
if (!configured) {
  grid.innerHTML = '<div class="empty-state">The video gallery is being set up. Subscribe on <a class="text-link" href="https://youtube.com/@mr.solvewin" target="_blank" rel="noopener">YouTube ↗</a> in the meantime.</div>';
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from("videos").select("id,title,description,youtube_id,created_at").eq("published", true).order("created_at", {ascending:false});
  if (error || !data?.length) grid.innerHTML = '<div class="empty-state">New videos will appear here soon. <a class="text-link" href="https://youtube.com/@mr.solvewin">Visit the channel ↗</a></div>';
  else grid.innerHTML = data.map(v => `<article class="video-card"><a class="thumb" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.youtube_id)}" target="_blank" rel="noopener"><img loading="lazy" src="https://i.ytimg.com/vi/${encodeURIComponent(v.youtube_id)}/hqdefault.jpg" alt=""></a><div class="video-info"><h3>${escapeHtml(v.title)}</h3><p>${escapeHtml(v.description || "")}</p><a class="watch" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.youtube_id)}" target="_blank" rel="noopener">WATCH VIDEO ↗</a></div></article>`).join("");
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
