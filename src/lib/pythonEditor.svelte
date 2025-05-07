<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { EditorState } from "@codemirror/state";
    import {
      EditorView,
      keymap,
      highlightSpecialChars,
      drawSelection,
      highlightActiveLine
    } from "@codemirror/view";
    import { defaultKeymap, indentWithTab } from "@codemirror/commands";
    import { python } from "@codemirror/lang-python";
  
    let editorDiv;
    const dispatch = createEventDispatcher();
  
    onMount(() => {
      const state = EditorState.create({
        doc: "",
        extensions: [
          keymap.of([
            indentWithTab,
            ...defaultKeymap
          ]),
          python(),
          EditorView.editable.of(true),
          highlightSpecialChars(),
          drawSelection(),
          highlightActiveLine(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              dispatch("input", update.state.doc.toString());
            }
          })
        ]
      });
  
      new EditorView({
        state,
        parent: editorDiv
      });
    });
  </script>
  
  <style>
    .editor {
      height: 200px;
      width: 100%;
      border: 1px solid #ccc;
      background: white;
      font-family: monospace;
    }
  
    .cm-editor {
      height: 100%;
    }
  
    .cm-scroller {
      overflow: auto;
    }
  </style>
  
  <div class="editor" bind:this={editorDiv}></div>
  