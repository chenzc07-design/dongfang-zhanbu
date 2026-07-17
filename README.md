# 东方古老占卜 · Ancient Eastern Divination

中英双语八字排盘 + 定制 PDF 报告售卖网站。

## 技术栈

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **lunar-typescript** — 中国农历 / 八字排盘引擎
- **pdf-lib** — 自动生成 PDF 报告
- **Stripe** — 信用卡收款
- **Resend** — 支付后自动发邮件 + PDF 附件

---

## 🚀 快速部署 (Vercel)

### 第 1 步：注册账号

| 服务 | 用途 | 费用 |
| --- | --- | --- |
| [Vercel](https://vercel.com) | 托管网站 | 免费层够用 |
| [Stripe](https://dashboard.stripe.com/register) | 收款 | 2.9% + $0.30 每笔 |
| [Resend](https://resend.com) | 发邮件 (PDF附件) | 免费 3000封/月 |
| 域名 (Namecheap/Cloudflare) | 品牌 | ~$10/年 |

### 第 2 步：部署到 Vercel

```bash
# 安装 vercel CLI
npm i -g vercel

cd /workspace/bazi-site

# 部署 (第一次需要登录)
vercel --prod
```

或直接用 GitHub 部署：
1. 把代码 push 到 GitHub 仓库
2. 去 [vercel.com](https://vercel.com) → Add New Project → 导入仓库
3. Vercel 会自动检测 Next.js → 一键部署

### 第 3 步：配置所有环境变量

部署后在 Vercel Dashboard → Settings → Environment Variables 添加以下变量：

| 变量 | 值 | 来源 |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PRICE_FULL` | `price_xxx` | Stripe Dashboard → Products |
| `NEXT_PUBLIC_STRIPE_PRICE_PREMIUM` | `price_xxx` | Stripe Dashboard → Products |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | Stripe Dashboard → Webhooks |
| `RESEND_API_KEY` | `re_xxx` | Resend Dashboard → API Keys |
| `EMAIL_FROM` | `东方古老占卜 <reports@你的域名.com>` | 自己定义 |
| `EMAIL_SUPPORT` | `support@你的域名.com` | 自己定义 |
| `NEXT_PUBLIC_BASE_URL` | `https://你的域名.com` | 你的网站地址 |

---

## 💳 收款方案 (Stripe → 派安盈 Payoneer)

你问怎么收款——流程是这样的：

```
用户信用卡付款 ($14.99)
    ↓
Stripe 扣掉手续费 (2.9% + $0.30)
    ↓
Stripe 余额累积
    ↓
你手动或自动提现到银行账户
    ↓
你用 派安盈(Payoneer) 的美国银行账户 收美金
```

### 步骤

**1. 注册 Stripe 账号**
- 去 https://dashboard.stripe.com/register
- 选择 **香港** 或 **美国** 注册（中国内地身份证也能注册 Stripe，但限制多）
- 建议用 **香港公司** 或 **美国个人** 身份注册 Stripe，提现最方便

**2. Stripe 绑定 Payoneer**
- 登录 [Stripe Dashboard](https://dashboard.stripe.com) → Settings → Bank accounts
- 添加外部银行账户
- 填入你的 **Payoneer 美国银行账户信息**（Routing number + Account number）

**3. Payoneer 美国收款账户**
- 登录 [Payoneer](https://www.payoneer.com) → 收款 → 收款账户
- 申请 **美国银行 USD 账户**
- 你会得到：银行名称（First Century Bank / Bank of America 等）、Routing number、Account number
- 把这些填入 Stripe 的银行账户设置

**4. 提现**
- Stripe 默认 7 天后自动打款到绑定的银行账户
- 也可以手动提现（即时到账，收 1% 手续费）
- 派安盈收到钱后，你可以提现到国内银行卡（人民币）或保留美金

> ⚠️ **重要**：Stripe 对命理/玄学类商家有风控。上架后第一笔交易可能会触发人工审核。建议在产品描述和下单页加上 **"For entertainment purposes only"** 免责声明（已经在网站底部加了）。

---

## 📧 邮件流程说明

**已实现的功能**：支付成功后自动触发 → 生成 PDF → 通过 Resend 发送给用户。

### Resend 设置

1. 注册 https://resend.com
2. 验证域名 (DNS 加 TXT 记录)
3. 在 API Keys 页面生成 key
4. 把 `RESEND_API_KEY` 添加为 Vercel 的环境变量

### 邮件预览

邮件包含：
- ✅ 用户八字预览（Day Master、Lucky Element、出生日期）
- ✅ PDF 附件（完整 5 页报告）
- ✅ 品牌 Header（东方古老占卜）
- ✅ 客服联系方式

### 测试发送

本地测试需要：
1. 在 Resend 验证你的域名
2. 设置 `RESEND_API_KEY`
3. 配置 Stripe webhook（本地用 `stripe listen --forward-to localhost:3000/api/webhook`）

---

## 🏗️ 项目结构

```
src/
├── lib/
│   ├── bazi.ts        # 八字排盘引擎
│   ├── pdf.ts         # PDF 报告生成 (5页)
│   ├── email.ts       # 邮件发送 (Resend)
│   ├── stripe.ts      # Stripe 配置
│   └── types.ts       # 类型定义
└── app/
    ├── page.tsx       # 首页 (表单+结果+定价)
    ├── layout.tsx     # 布局
    ├── success/       # 支付成功页
    └── api/
        ├── calculate/         # POST: 免费排盘
        ├── create-checkout/   # POST: Stripe 跳转
        └── webhook/           # POST: 支付后自动发PDF
```

## TODO (上线前)

- [ ] 注册 Stripe、Resend、Vercel 账号
- [ ] 买域名，绑定 Vercel
- [ ] 在 Resend 验证域名
- [ ] 在 Stripe 创建两个产品（$14.99 / $34.99）
- [ ] 配置 Stripe Webhook → 指向 `你的域名/api/webhook`
- [ ] 设置所有环境变量
- [ ] 部署到 Vercel
- [ ] 自己付 $14.99 测试完整流程（排盘 → 支付 → 收邮件 → 看PDF）
- [ ] 加 Privacy Policy 页面
- [ ] 加 Google Analytics

## License

MIT
