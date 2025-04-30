<script>
    let {children} = $props();
</script>
{@html '<script src="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js"></script>'}

<nav>
    <a href="/"> home </a>
    <a href= "/levels/level1"> level1</a>
</nav>
{@render children()}
<h1> Das ist Level x</h1>
<p> Das  </p>
<input 
type ="text"
id = "name"
name = "name"
size = "200" 
minlength="40"
maxlength="100"
width = "100"
height="100"/>

