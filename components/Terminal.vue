<template>
  <div ref="terminal" class="terminal-container"></div>
</template>

<script>
// import { Terminal } from "@xterm/xterm";
import pkg from "@xterm/xterm";
const { Terminal } = pkg;
import "@xterm/xterm/css/xterm.css";
// const { Terminal } = await import("@xterm/xterm");
// import "@xterm/xterm/css/xterm.css";

export default {
  data() {
    return {
      currentInput: "",
      currentPath: ["root"],
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
                content:
                  "Question 1: List 3 demanding trends in Computer Science.",
              },
              "access.sh": {
                type: "file",
                content: "No clue here.",
              },
            },
          },
          guest: {
            type: "directory",
            contents: {
              "archive.log": {
                type: "file",
                content:
                  "No clue here",
              },
              "README.md": {
                type: "file",
                content: "No clue here.",
              },
            },
          },
        },
      },
      etc: {
        type: "directory",
        contents: {
          "netconfig.conf": {
            type: "file",
            content: "No clue here.",
          },
          "security.rules": {
            type: "file",
            content:
              "Question 2: What are the difference between Computer Science (CS) and Information Technology (IT)",
          },
        },
      },
      var: {
        type: "directory",
        contents: {
          log: {
            type: "directory",
            contents: {
              "access.log": {
                type: "file",
                content: "No clue here.",
              },
              "errors.log": {
                type: "file",
                content: "No clue here.",
              },
            },
          },
        },
      },
      tmp: {
        type: "directory",
        contents: {
          "session.tmp": {
            type: "file",
            content: "Question 3: How do you think AI could impact future jobs? Do you think it will create more jobs, eliminate jobs, or a mix of both?",
          },
        },
      },
    },
  },
}

    };
  },
  mounted() {
    this.term = new Terminal({
      rows: 80,
      cols: 28,
      cursorBlink: true,
      fontSize: 18,
    });
    this.term.open(this.$refs.terminal);
    this.handleUserInput();
  },
  methods: {
    handleUserInput() {
      this.term.write("\x1b[33mGreetings SMK Dato Mohd Said Students!\x1b[0m\r\n");
      this.term.write("\x1b[1;32m\nWelcome to Mini CloudHunt Competition!\x1b[0m\r\n");
      this.term.write(
        "\x1b[1;34m\nExplore the server for clues and answer the questions given.\x1b[0m\r\n"
      );
      this.term.write("\nThink about where a user might keep their initial information.\r\n");
      this.term.write("\nHint: Sometimes the most basic paths lead to the most intriguing discoveries.\r\n");
      this.term.write("\nEnter 'help' to view list of commands.\r\n\n");
      let dirPath = "$ " + this.currentPath.slice(-1)[0] + " ~ ";
      this.term.write(dirPath);

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

        this.term.write("\r\n" + "Screen cleared" + "\r\n");
        let dirPath = "$ " + this.currentPath.slice(-1)[0] + " ~ ";
        this.term.write(dirPath);
        return;
      } else if (command.startsWith("cat ")) {
        const output = this.cat(command);
        this.term.write(`\r\n${output}\r\n`);
      } else if (command === "help") {
        this.term.write(
          "\r\nWelcome to the RCEdu Cloud Simulator Help Page!\r\n" +
            "Available commands:\r\n" +
            "----------------------------\r\n" +
            "ls     - List contents\r\n" +
            "cd     - Open folder\r\n" +
            "cd ..  - Go back folder\r\n" +
            "cat    - View file contents\r\n" +
            "pwd    - Show current folder\r\n" +
            "clear  - Clear screen\r\n" +
            "help   - Show help message\r\n" +
            "----------------------------\r\n"
        );
      } else {
        this.term.write(`\r\nCommand not found: ${command}\r\n`);
      }
      if (this.currentPath.slice(-1)[0] == undefined) {
        let dirPath = "$ " + "root" + " ~ ";
        this.term.write(dirPath);
      } else {
        let dirPath = "$ " + this.currentPath.slice(-1)[0] + " ~ ";
        this.term.write(dirPath);
      }
    },

    cd(command) {
      const args = command.split(" ");
      if (args[1] == "..") {
        if (this.currentPath.slice(-1)[0] == "root") {
          var output = "You are already in root";
        } else {
          this.currentPath.pop();
          var output = "You are in " + this.currentPath.slice(-1)[0];
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
      return output;
    },

    cat(command) {
      const args = command.split(" ");
      if (args.length < 2) {
        return "Error: No file specified.";
      }

      const fileName = args[1];
      let current = this.fileSystem.root;

      for (const dir of this.currentPath.slice(1)) {
        if (
          current.contents[dir] &&
          current.contents[dir].type === "directory"
        ) {
          current = current.contents[dir];
        } else {
          return "Error: Invalid directory path.";
        }
      }

      const file = current.contents[fileName];
      if (file && file.type === "file") {
        return file.content;
      } else {
        return `cat: ${fileName}: No such file or directory`;
      }
    },

    ls() {
      let current = this.fileSystem;

      for (const dir of this.currentPath) {
        if (current[dir] && current[dir].type === "directory") {
          current = current[dir].contents;
        } else {
          return "Not a directory";
        }
      }
      if (current) {
        return Object.keys(current).join(" ");
      } else {
        return "Not a directory";
      }
    },

    directoryExists(fileSystem, path, last) {
      let current = fileSystem;
      path.push(last);
      for (const dir of path) {
        if (
          current[dir] &&
          current[dir].type == "directory" &&
          current[dir].contents
        ) {
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
