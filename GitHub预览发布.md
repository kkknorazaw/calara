# GitHub 预览发布（最终版）

## 你现在已经具备

- GitHub Pages 自动发布工作流：`.github/workflows/github-pages.yml`
- 子路径适配脚本：`tools/prepare-gh-pages.ps1`

这意味着：
- 普通仓库（例如 `my-site`）会自动适配到 `/my-site` 预览路径
- 用户主页仓库（例如 `xxx.github.io`）会按根路径发布

## 一次性上传命令

在当前目录执行（把 `<你的仓库地址>` 改成你的 GitHub 仓库）：

```powershell
git init
git branch -M main
git add .
git commit -m "final: static site ready for GitHub preview"
git remote add origin <你的仓库地址>
git push -u origin main
```

## 启用预览

1. 打开仓库 `Settings`
2. 打开 `Pages`
3. `Build and deployment` 选择 `GitHub Actions`
4. 等待 Actions 跑完
5. 访问生成的 Pages 链接

## 备注

- 首次发布通常需要 1-3 分钟。
- 之后每次 push 到 `main` 都会自动更新预览。
