<script>
  export let color = 'black';

  let canvas;
  let ctx;
  let drawing = false;

  function startDraw(e) {
    drawing = true;
    draw(e);
  }

  function endDraw() {
    drawing = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  $: if (canvas) {
    ctx = canvas.getContext('2d');
  }
</script>

<canvas
  bind:this={canvas}
  width="300"
  height="200"
  on:mousedown={startDraw}
  on:mouseup={endDraw}
  on:mouseleave={endDraw}
  on:mousemove={draw}
  style="border: 1px solid black;"
></canvas>
