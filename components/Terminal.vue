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
                        "Clue 1: Secrets lie in configuration files; start with some essentials.\nQuestion: Describe cloud computing in one sentence.",
                    },
                    "access.sh": {
                      type: "file",
                      content:
                        "#!/bin/bash\necho 'Clue 2: Logs are the shadows of activity. Seek in places where activity is recorded.'\nQuestion: List three well-known cloud providers and a service they offer.",
                    },
                  },
                },
                guest: {
                  type: "directory",
                  contents: {
                    "archive.log": {
                      type: "file",
                      content:
                        "Clue 3: Hidden knowledge is often archived. Trace the path of privileges.\nQuestion: Explain the key distinction between public and private cloud models.",
                    },
                    "README.md": {
                      type: "file",
                      content:
                        "Clue 4: Documentation hints are often hidden in plain sight. Look beyond conventional folders.\nQuestion: Define SaaS and explain one advantage it has over traditional software.",
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
                  content:
                    "Clue 5: Systems depend on connections and configurations to function.\nQuestion: Identify two primary benefits of using cloud resources over local resources.",
                },
                "security.rules": {
                  type: "file",
                  content:
                    "Clue 6: Simple rules can lead you down the right path. Trace back to the common folders used by guests.\nQuestion: Describe the difference between IaaS and PaaS with examples.",
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
                      content:
                        "Clue 7: Logs reveal much, but the journey continues in temporary spaces.\nQuestion: What does it mean for a cloud service to be scalable? Give an example.",
                    },
                    "errors.log": {
                      type: "file",
                      content:
                        "Clue 8: Sometimes errors point toward hidden truths in hidden directories.\nQuestion: Describe what cloud storage is and mention two key benefits.",
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
                  content:
                    "Clue 9: Temporary places often hold fleeting secrets. Think about where users might leave notes.\nQuestion: Explain how cloud computing enhances team collaboration and productivity.",
                },
              },
            },
            root: {
              type: "directory",
              contents: {
                ".vault": {
                  type: "directory",
                  contents: {
                    "final_hint.bash": {
                      type: "file",
                      content:
                        "#!/bin/bash\necho 'Clue 10: You’ve reached the end. Your journey through the cloud has been successful!'\nTask: Create a 3 minute video explaining the benefit of cloud computing followed by your experience in CloudHunt",
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
      fontSize: 20,
    });
    this.term.open(this.$refs.terminal);
    this.handleUserInput();
  },
  methods: {
    handleUserInput() {
      this.term.write("\x1b[1;32mWelcome to CloudHunt Competition!\x1b[0m\r\n");
      this.term.write(
        "\x1b[1;34mExplore the server for clues and answer the questions given.\x1b[0m\r\n"
      );
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
