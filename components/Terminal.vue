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
                      content:
                        "Clue 1: Look deeper into the /etc directory.\nQuestion: What is cloud computing?",
                    },
                    "secret.sh": {
                      type: "file",
                      content:
                        "#!/bin/bash\necho 'Clue 2: Check the logs in /var/log'\nQuestion: Name two examples of cloud computing services.",
                    },
                  },
                },
                guest: {
                  type: "directory",
                  contents: {
                    "hidden.txt": {
                      type: "file",
                      content:
                        "Clue 3: Hidden treasure can be found in /root/.vault\nQuestion: What is the difference between Public and Private Cloud?",
                    },
                    "README.md": {
                      type: "file",
                      content:
                        "Clue 4: Documentation is key; try exploring /home/user/documents.\nQuestion: Define SaaS and give one example.",
                    },
                  },
                },
              },
            },
            etc: {
              type: "directory",
              contents: {
                "config.ini": {
                  type: "file",
                  content:
                    "Clue 5: Configuration holds secrets, but logs reveal them in /var/log.\nQuestion: What are the main benefits of cloud computing?",
                },
                "clue2.conf": {
                  type: "file",
                  content:
                    "Clue 6: Sometimes, clues are in plain sight - look inside /home/user/clues.\nQuestion: What is IaaS and how is it different from PaaS?",
                },
              },
            },
            var: {
              type: "directory",
              contents: {
                log: {
                  type: "directory",
                  contents: {
                    "system.log": {
                      type: "file",
                      content:
                        "Clue 7: System logs can be overwhelming, but the next hint is in /tmp.\nQuestion: Explain the concept of scalability in cloud computing.",
                    },
                    "error.log": {
                      type: "file",
                      content:
                        "Clue 8: Errors often lead to solutions. Check /home/user/.hidden_clues.\nQuestion: What is cloud storage, and name one provider.",
                    },
                  },
                },
              },
            },
            tmp: {
              type: "directory",
              contents: {
                "note.txt": {
                  type: "file",
                  content:
                    "Clue 9: Temporary files disappear quickly; better look in /home/user/docs.\nQuestion: How does cloud computing enhance collaboration?",
                },
              },
            },
            root: {
              type: "directory",
              contents: {
                ".vault": {
                  type: "directory",
                  contents: {
                    "final_clue.bash": {
                      type: "file",
                      content:
                        "#!/bin/bash\necho 'Clue 10: Congratulations! You’ve found the final clue!'\nQuestion: What are hybrid clouds and their advantages?",
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  },
  mounted() {
    this.term = new Terminal({
      rows: 80,
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
        this.term.write("$ ");
        return;
      } else if (command.startsWith("cat ")) {
        const output = this.cat(command);
        this.term.write(`\r\n${output}\r\n`);
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
