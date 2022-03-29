import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// elementPlus自动引入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  // 要用到的插件数组
  plugins: [
    vue(),
    // 配置elementPlus自动引入插件
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 开发或生产环境服务的公共基础路径,可以是/foo/、https://foo.com/、空字符串或./(用于开发环境) 几种类型，这个选项也可以通过命令行参数指定（例：vite build --base=/my/public/path/）
  base: "./",
  // 静态资源服务的文件夹, 默认"public"
  publicDir: 'public'
});
