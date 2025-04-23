<script>
    let {children} = $props();
</script>

<nav>
    <a href="/"> home </a>
    <a href= "/levels/level1"> level1</a>
</nav>
<h1> Das ist Level x</h1>
<p> Das  </p>
<input 
type ="text"
id = "name"
name = "name"
size = "200" 
minlength="40"
maxlength="100"/>

{@render children()}