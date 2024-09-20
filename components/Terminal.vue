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
      currentInput: '', 
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
      this.term.write("Welcome to RCEdu CloudHunt Simulator!\r\n");
      this.term.write("Enter 'help' to view list of command.\r\n");
      this.term.write("$ ");
      
      this.term.onKey(e => {
        const char = e.key;

        if (char === '\r') {
          this.executeCommand();
        } else if (char === '\u007f') {
  
          if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.term.write('\b \b'); 
          }
        } else {
          this.currentInput += char; 
          this.term.write(char); 
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
    this.term.clear(); 
    setTimeout(() => {
      this.term.write('$ ');
    }, 0);
    return;
  } else if (command === 'help') {
    // Write the help message line by line to avoid unwanted spaces or indents
    this.term.write('\r\nWelcome to the RCEdu Cloud Simulator Help Page!\r\n');
    this.term.write('Available commands:\r\n');
    this.term.write('----------------------------------------\r\n');
    this.term.write('ls     - List files and directories\r\n');
    this.term.write('cd     - Change directory\r\n');
    this.term.write('pwd    - Show current directory\r\n');
    this.term.write('clear  - Clear the terminal screen\r\n');
    this.term.write('echo   - Print text\r\n');
    this.term.write('exit   - Exit the terminal\r\n');
    this.term.write('help   - Show this help message\r\n');
    this.term.write('----------------------------------------\r\n');
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
  height: 100vh; 
  background: black;
  color: white;
}
</style>
