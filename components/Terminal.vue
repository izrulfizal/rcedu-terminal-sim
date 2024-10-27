<template>
  <div ref="terminal" class="terminal-container"></div>
</template>

<script>
import { Terminal } from "@xterm/xterm";
// import pkg from "@xterm/xterm";
// const { Terminal } = pkg;
import "@xterm/xterm/css/xterm.css";

export default {
  data() {
    return {
      currentInput: "",
      currentPath: ["root"], // Start in the root directory
      fileSystem: {
        root: {
          type: "directory",
          contents: {
            home: {
              type: "directory",
              contents: {
                user: {
                  type: "directory",
                  contents: {
                    "file1.txt": {
                      type: "file",
                      content: "This is file1 content.",
                    },
                    "file2.txt": {
                      type: "file",
                      content: "This is file2 content.",
                    },
                  },
                },
              },
            },
            etc: { type: "directory", contents: {} },
            var: { type: "directory", contents: {} },
          },
        },
      },
    };
  },
  mounted() {
    this.term = new Terminal({
      rows: 20,
      cols: 80,
      cursorBlink: true,
    });
    this.term.open(this.$refs.terminal);
    this.handleUserInput();
  },
  methods: {
    handleUserInput() {
      this.term.write("Welcome to RCEdu CloudHunt Simulator!\r\n");
      this.term.write("Enter 'help' to view list of commands.\r\n");
      this.term.write("$ ");

      this.term.onKey((e) => {
        const char = e.key;

        if (char === "\r") {
          this.executeCommand();
        } else if (char === "\u007f") {
          if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.term.write("\b \b");
          }
        } else {
          this.currentInput += char;
          this.term.write(char);
        }
      });
    },
    executeCommand() {
      const command = this.currentInput.trim();
      this.currentInput = "";

      if (command === "ls") {
        this.term.write("\r\n" + this.ls() + "\r\n");
      } else if (command.startsWith("cd ")) {
        const output = this.cd(command);
        this.term.write("\r\n" + output + "\r\n");
      } else if (command === "pwd") {
        this.term.write(`\r\n/${this.currentPath.join("/")}\r\n`);
      } else if (command === "clear") {
        this.term.clear();
        this.term.write("$ ");
        return;
      } else if (command === "help") {
        this.term.write(
          "\r\nWelcome to the RCEdu Cloud Simulator Help Page!\r\n" +
            "Available commands:\r\n" +
            "----------------------------------------\r\n" +
            "ls     - List files and directories\r\n" +
            "cd     - Change directory\r\n" +
            "pwd    - Show current directory\r\n" +
            "clear  - Clear the terminal screen\r\n" +
            "echo   - Print text\r\n" +
            "exit   - Exit the terminal\r\n" +
            "help   - Show this help message\r\n" +
            "----------------------------------------\r\n"
        );
      } else {
        this.term.write(`\r\nCommand not found: ${command}\r\n`);
      }

      this.term.write("$ ");
    },

    cd(command) {
      console.log("cd command");

      const args = command.split(" ");
      if (args[1] == "..") {
        this.currentPath.pop();
        if (this.currentPath.slice(-1)[0] == undefined){
          var output = "You are already in root"
        }else{
          var output = "You are in " + this.currentPath.slice(-1)[0] 
        }
        
      } else if (args[1]) {
        if (this.directoryExists(this.fileSystem, this.currentPath, args[1])) {
          this.currentPath.push(args[1]);
          this.currentPath.pop();
          var output = "Changed directory to " + args[1];
        } else {
          this.currentPath.pop();
          var output = "No such directory";
        }
      } else {
        var output = "No directory specified";
      }
      console.log(this.currentPath);
      return output;
    },

    ls() {
      console.log("ls command");
    },

    directoryExists(fileSystem, path, last) {
      console.log("Check directory");
      let current = fileSystem;
      path.push(last);
      for (const dir of path) {
        console.log(current);
        console.log(dir);
        if (current[dir] && current[dir].type == "directory" && current[dir].contents) {
          current = current[dir].contents;
        } else {
          return false;
        }
      }

      return true;
    },
  },
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
