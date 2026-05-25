const code = `(function(){try{
var s=localStorage.getItem('theme');
var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
var dark = s==='dark' || (s!=='light' && d);
if(dark) document.documentElement.setAttribute('data-theme','dark');
else document.documentElement.removeAttribute('data-theme');
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
