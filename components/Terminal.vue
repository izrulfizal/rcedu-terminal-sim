<template>
    <div ref="terminal" class="terminal-container"></div>
  </template>
  
  <script>
  // import { Terminal } from '@xterm/xterm';
  import pkg from '@xterm/xterm';
  const { Terminal } = pkg;
  import '@xterm/xterm/css/xterm.css'; 
  
  export default {
    mounted() {
      this.term = new Terminal({
        rows: 20,
        cols: 80,   
        cursorBlink: true
      });
      this.term.open(this.$refs.terminal);
      this.handleUserInput();
    },
    methods: {
      handleUserInput() {
        this.term.write("Welcome to RCEdu Cloud Simulator!\r\n");
        this.term.write("$ ");
        
        this.term.onKey(e => {
          const char = e.key;
  
          if (char === '\r') {
            this.executeCommand();
          } else {
            this.term.write(char); 
          }
        });
      },
      executeCommand() {
        this.term.write('\r\nYou entered a command!\r\n$ ');
      }
    }
  }
  </script>
  
  <style scoped>
  .terminal-container {
    width: 100vw;
    height: 100vh;
    background: black;
    color: white;
  }
  </style>
  