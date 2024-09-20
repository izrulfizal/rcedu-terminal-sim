<template>
  <div ref="terminal" class="terminal-container"></div>
</template>

<script>
// import { Terminal } from '@xterm/xterm';
import pkg from '@xterm/xterm';
const { Terminal } = pkg;
import '@xterm/xterm/css/xterm.css'; 

export default {
  data() {
    return {
      currentInput: '', // Store the user's input
    };
  },
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
          // When Enter is pressed, process the input
          this.executeCommand();
        } else if (char === '\u007f') {
          // Handle backspace (char code for backspace is 127)
          if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.term.write('\b \b'); // Move cursor back, clear character
          }
        } else {
          this.currentInput += char; // Add char to the current input
          this.term.write(char); // Show the character on the terminal
        }
      });
    },
    executeCommand() {
      const command = this.currentInput.trim(); // Trim spaces from input

      // Clear current input
      this.currentInput = '';

      // Check the command
      if (command === 'ls') {
        this.term.write('\r\nRunning "ls"...\r\n');
        this.term.write('file1.txt  file2.txt  directory1/\r\n');
      } else if (command.startsWith('cd ')) {
        const dir = command.slice(3);
        this.term.write(`\r\nChanging directory to ${dir}\r\n`);
      } else if (command === 'pwd') {
        this.term.write('\r\n/home/user\r\n');
      } else if (command === 'clear') {
        // Clear the terminal and directly write the new prompt
        this.term.clear(); 
        setTimeout(() => {
          this.term.write('$ ');
        }, 0); // Ensure new prompt is written after clearing the screen
        return; // Exit here to avoid writing the prompt twice
      } else {
        this.term.write(`\r\nCommand not found: ${command}\r\n`);
      }

      // After executing, prompt again
      this.term.write('$ ');
    }
  }
};
</script>

<style scoped>
.terminal-container {
  width: 100vw;
  height: 100vh; /* Full height of the left container */
  background: black;
  color: white;
}
</style>
