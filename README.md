# DeepSeek Conversations Converter
## Overview

This Node.js script processes DeepSeek exported conversation JSON files, converting them into a structured Markdown format and allowing users to customize which parts of the conversation to retain. The script offers interactive configuration options, allowing users to choose whether to retain user messages, DeepSeek's preprocessing steps, or DeepSeek's main responses.

## Key Features

* **Interactive Configuration**: Choose which parts of the conversation to keep during runtime.
* **Smart Message Processing**:

  * Automatically distinguish between user messages and DeepSeek replies.
  * Separate DeepSeek's preprocessing steps and main responses.
* **Markdown Formatting**: Generate readable conversation logs in Markdown.
* **Filename Cleaning**: Automatically handle special characters and length restrictions in filenames.
* **Error Handling**: A failure in one conversation does not affect the overall processing.

## Usage Instructions

### Prerequisites

* Node.js (recommended version 14 or higher)

### Quick Start

1. Rename the DeepSeek exported conversation JSON file to `conversations.json` and place it in the same directory as the script.
2. Run the following command:

   ```bash
   node conversationsToMD.js
   ```
3. Follow the prompts to choose which parts to retain:

   ```
   Please choose what to retain (input y/n):
   Retain "my" messages? (y/n) y
   Retain DeepSeek preprocessing? (y/n) n
   Retain DeepSeek main responses? (y/n) y
   ```
4. View the generated Markdown files in the `./conversationsMD/` directory.

### Sample Output

```markdown
# Conversation Title

**Me:**
User message content

---

**DeepSeek Main Response:**
DeepSeek reply content

---
```

### Configuration Options

| Option                         | Description                               | Default Value |
| ------------------------------ | ----------------------------------------- | ------------- |
| Retain "my" messages           | Whether to retain user messages           | Yes           |
| Retain DeepSeek preprocessing  | Whether to retain DeepSeek preprocessing  | Yes           |
| Retain DeepSeek main responses | Whether to retain DeepSeek main responses | Yes           |

## File Structure

```
.
├── conversationsToMD.js    # Main processing script
├── conversations.json       # DeepSeek exported conversation data
└── conversationsMD/         # Generated Markdown files directory
    ├── Conversation1.md
    ├── Conversation2.md
    └── ...
```

## Technical Details

* **Message Processing**:

  * Processes conversations in node ID order.
  * Automatically excludes the root node.
  * Smartly identifies message types (User/DeepSeek).
* **Output Format**:

  * Title: `# Conversation Title`
  * User message: `**Me:**\n[content]`
  * DeepSeek reply: `**DeepSeek Preprocessing:**` and `**DeepSeek Main Response:**`
  * Message separator: `---`

## Notes

1. Ensure the input file is a valid DeepSeek export JSON.
2. Filename cleaning rules:

   * Remove illegal characters like `<>:"/\\|?*`.
   * Merge redundant spaces.
   * Limit filename length to 100 characters.
3. If no content matching the criteria is found, the file generation will be skipped.

## Contributing

Please do not submit improvement suggestions or issue reports! Feedback does not need to be submitted via Issues!

---

# DeepSeek 对话处理器

## 概述

这个 Node.js 脚本用于处理 DeepSeek 导出的对话 JSON 文件，将其转换为结构化的 Markdown 格式，并允许用户自定义保留的内容部分。脚本提供交互式配置选项，可灵活选择保留用户消息、DeepSeek 预处理过程或 DeepSeek 正文回复。

## 主要功能

- **交互式配置**：运行时选择保留哪些对话内容
- **智能消息处理**：
  - 自动区分用户消息和 DeepSeek 回复
  - 分离 DeepSeek 的预处理和正文回复
- **Markdown 格式化**：生成清晰可读的对话记录
- **文件名清理**：自动处理特殊字符和长度限制
- **错误处理**：单个对话失败不影响整体处理

## 使用说明

### 前置要求

- Node.js (建议 v14 或更高版本)

### 快速开始

1. 将 DeepSeek 导出的对话 JSON 文件命名为`conversations.json`并放在脚本同目录
2. 运行以下命令：
   ```bash
   node conversationsToMD.js
   ```
3. 根据提示选择要保留的内容：
   ```
   请选择要保留的内容 (输入 y/n):
   保留"我"的发言? (y/n) y
   保留DeepSeek的预处理过程? (y/n) n
   保留DeepSeek的正文回复? (y/n) y
   ```
4. 查看生成的 Markdown 文件：`./conversationsMD/`目录

### 输出示例

```markdown
# 对话标题

**我：**
用户消息内容

---

**DeepSeek 正文：**
DeepSeek 回复内容

---
```

### 配置选项

| 选项                       | 描述                           | 默认值 |
| -------------------------- | ------------------------------ | ------ |
| 保留"我"的发言             | 是否保留用户消息               | 是     |
| 保留 DeepSeek 的预处理过程 | 是否保留 DeepSeek 的预处理过程 | 是     |
| 保留 DeepSeek 的正文回复   | 是否保留 DeepSeek 的正式回复   | 是     |

## 文件结构

```
.
├── conversationsToMD.js    # 主处理脚本
├── conversations.json         # DeepSeek导出的对话数据
└── conversationsMD/            # 生成的Markdown文件目录
    ├── 对话1.md
    ├── 对话2.md
    └── ...
```

## 技术细节

- **消息处理**：
  - 按节点 ID 顺序处理对话
  - 自动排除 root 节点
  - 智能识别消息类型（用户/DeepSeek）
- **输出格式**：
  - 标题：`# 对话标题`
  - 用户消息：`**我：**\n[内容]`
  - DeepSeek 回复：`**DeepSeek 预处理：**` 和 `**DeepSeek 正文：**`
  - 消息分隔：`---`

## 注意事项

1. 确保输入文件是有效的 DeepSeek 导出 JSON
2. 文件名自动清理规则：
   - 移除 `<>:"/\\|?*` 等非法字符
   - 合并多余空格
   - 限制长度在 100 字符内
3. 当对话没有任何符合条件的内容时，将跳过文件生成

## 贡献

请勿提交改进建议或问题报告！不必通过 Issues 提交您的反馈！
