<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
  import { EditorState } from "@codemirror/state";
  import {
    EditorView,
    keymap,
    highlightSpecialChars,
    drawSelection,
    highlightActiveLine,
    highlightActiveLineGutter,
    lineNumbers
  } from "@codemirror/view";
  import { defaultKeymap, indentWithTab } from "@codemirror/commands";
  import { python, pythonLanguage } from "@codemirror/lang-python";


  let editorDiv;
  const dispatch = createEventDispatcher();

  onMount(() => {
    const state = EditorState.create({
      doc: "",
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        drawSelection(),
        highlightActiveLine(),
        keymap.of([indentWithTab, ...defaultKeymap]),
        python(),
        syntaxHighlighting(defaultHighlightStyle),
        EditorView.editable.of(true),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            dispatch("input", update.state.doc.toString());
          }
        })      ]
    });

    new EditorView({
      state,
      parent: editorDiv
    });
  });
</script>

<div class="editor" bind:this={editorDiv}></div>
