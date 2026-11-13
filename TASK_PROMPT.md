线上上周被路径穿越坑了一回（解压上传包直接写到仓库外面去了），我这边扔了个半成品沙箱，你帮我补完，别用 Docker。

你要做的：
1) 浏览器打开 index.html（npm start 或 python3 -m http.server 8791 --directory .）后，左边是日志/结果，右边是控制；起来成功的话 #status 得是 ready。
2) 把 src/pathGuard.js 弄稳：resolveSafe(root, entryPath) 必须拒绝 ..、绝对路径、盘符前缀这类穿越；canonicalize 后仍要落在 root 里面，否则抛错。
3) 实现 src/zipSandbox.js：extractListing(entries, root) 对假 zip 条目做安全落盘路径规划，返回 {ok:[], blocked:[{path,reason}]}；遇到穿越条目不能静默放过。
4) src/engine.js 的 SandboxEngine：吃 fixtures/manifest.json，跑一遍 extract 模拟，#stats 里给 extracted/blocked 计数。
5) src/ui/controls.js：Load / Dry-run / Export JSON；错误写到 #status。
6) 别改弱 tests/*.test.js，原生 ESM。文件别一次糊一大坨，分几次短命令写，写完就 npm test，挂了再修，直到全绿。
