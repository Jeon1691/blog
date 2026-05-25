const code = `(function(){try{
var s=localStorage.getItem('theme');
var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
var dark = s==='dark' || (s!=='light' && d);
document.documentElement.classList.toggle('dark', dark);
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
