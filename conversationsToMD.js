const fs = require("fs");
const path = require("path");
const readline = require("readline");

// 配置参数
const INPUT_FILE = "./conversations.json";
const OUTPUT_DIR = "./conversationsMD";

// 配置选项
const config = {
  keepUserMessages: true,
  keepDeepSeekPreprocessing: true,
  keepDeepSeekContent: true,
};

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 交互式配置函数
async function configureOptions() {
  console.log("请选择要保留的内容 (输入 y/n):");

  config.keepUserMessages =
    (await askQuestion('保留"我"的发言? (y/n) ')) === "y";
  config.keepDeepSeekPreprocessing =
    (await askQuestion("保留DeepSeek的预处理内容? (y/n) ")) === "y";
  config.keepDeepSeekContent =
    (await askQuestion("保留DeepSeek的正文内容? (y/n) ")) === "y";

  console.log("\n配置完成:");
  console.log(`  [${config.keepUserMessages ? "✓" : "✗"}] 保留用户消息`);
  console.log(
    `  [${config.keepDeepSeekPreprocessing ? "✓" : "✗"}] 保留DeepSeek预处理`
  );
  console.log(
    `  [${config.keepDeepSeekContent ? "✓" : "✗"}] 保留DeepSeek正文\n`
  );
}

// 辅助函数：询问问题并获取答案
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

// 主处理函数
async function processConversations() {
  try {
    // 创建输出目录
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 读取并解析JSON文件
    console.log(`📂 读取文件: ${path.resolve(INPUT_FILE)}`);
    const rawData = fs.readFileSync(INPUT_FILE, "utf-8");
    const conversations = JSON.parse(rawData);

    if (!Array.isArray(conversations)) {
      throw new Error("输入文件应包含对话数组");
    }

    console.log(`🔄 开始处理 ${conversations.length} 个对话...`);

    // 处理每个对话
    conversations.forEach((conversation) => {
      try {
        // 1. 准备文件名
        const title = conversation.title || "未命名对话";
        const safeTitle = sanitizeFilename(title);
        const fileName = `${safeTitle}.md`;
        const filePath = path.join(OUTPUT_DIR, fileName);

        // 2. 处理消息映射 - 新逻辑
        let mdContent = `# ${title}\n\n`;
        let hasContent = false;

        // 获取所有消息节点（排除root节点）
        const messageNodes = Object.entries(conversation.mapping)
          .filter(([id]) => id !== "root") // 排除root节点
          .map(([id, node]) => ({ id, ...node }))
          .sort((a, b) => parseInt(a.id) - parseInt(b.id)); // 按id排序

        // 处理每个消息节点
        messageNodes.forEach((node) => {
          const message = node.message;
          if (!message) return; // 跳过空消息

          // 3. 根据配置还原和加工消息
          if (message.reasoning_content === null) {
            // 用户消息处理
            if (config.keepUserMessages) {
              mdContent += `**我：**\n${message.content}\n\n---\n\n`;
              hasContent = true;
            }
          } else {
            // DeepSeek消息处理 - 根据配置动态构建
            let deepSeekContent = "";

            if (config.keepDeepSeekPreprocessing) {
              deepSeekContent += `**DeepSeek 预处理：**\n${message.reasoning_content}\n\n`;
            }

            if (config.keepDeepSeekContent) {
              deepSeekContent += `**DeepSeek 正文：**\n${message.content}\n\n`;
            }

            if (deepSeekContent) {
              mdContent += deepSeekContent + "---\n\n";
              hasContent = true;
            }
          }
        });

        // 4. 写入Markdown文件
        if (hasContent) {
          fs.writeFileSync(filePath, mdContent, "utf-8");
          console.log(`✓ 已保存: ${fileName} (${messageNodes.length} 个节点)`);
        } else {
          console.log(`⚠️ 跳过: ${fileName} (无符合条件的内容)`);
        }
      } catch (error) {
        console.error(
          `✗ 对话处理失败: ${conversation.title || "未命名对话"} - ${
            error.message
          }`
        );
      }
    });

    console.log("\n✅ 处理完成!");
    console.log(`  成功处理: ${conversations.length} 个对话`);
    console.log(`  输出目录: ${path.resolve(OUTPUT_DIR)}`);
  } catch (error) {
    console.error("❌ 错误:", error.message);
  } finally {
    rl.close();
  }
}

// 辅助函数：清理文件名中的非法字符
function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, "") // 移除非法字符
    .replace(/\s+/g, " ") // 合并多余空格
    .trim() // 去除首尾空格
    .substring(0, 100); // 限制长度
}

// 启动处理流程
(async () => {
  await configureOptions();
  processConversations();
})();
