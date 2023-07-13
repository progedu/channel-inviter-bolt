# チャンネル招待ボット Bolt版

招待コマンド受け取りBot部分と招待API実行部分で異なるクライアントを利用して動作する招待システム。np

## 使い方

Node.js v18.13.0 で動作確認。

```
npm install
npm run build
env SLACK_BOT_TOKEN=xxxxx SLACK_APP_TOKEN=xxxxx INVITER_SLACK_USER_TOKEN=xxxxx INVITER_SLACK_SIGNING_SECRET=xxxxx node dist/index.js
```

## コマンド

チャンネル招待(複数同時取得可): `chan-in-conv>` チャンネルID メールアドレス( メールアドレス メールアドレス...)
チャンネルから削除(複数同時取得可): `chan-kick-conv>` チャンネルID メールアドレス( メールアドレス メールアドレス...)
email から N 高 Slack での名前とユーザー ID を取得: `mail2s>` メールアドレス
チャンネルからチャンネルへのメンバーのコピー: `member-cp>` 元チャンネルID 先チャンネルID
プライベートは teacher_sifue 招待後実行のこと。

# アプリケーションの作成方法

# 招待コマンド受け取りBot側アプリケーション設定

`SLACK_BOT_TOKEN` と `SLACK_APP_TOKEN` を利用。

## Bot Token Scope の設定 (OAuth & Permissions)

- chat:write
- channels:read
- groups:read
- im:read
- mpim:read

## Event Subscription の設定 (Event Subscriptions)

- message.channels
- message.groups
- message.im
- message.mpim

# 招待API実行側

`INVITER_SLACK_USER_TOKEN` と `INVITER_SLACK_SIGNING_SECRET` を利用。

## User Token Scope の設定 (OAuth & Permissions)

- channels:write
- groups:write
- im:write
- mpim:write
- channels:read
- groups:read
- im:read
- mpim:read
- users:read
- users:read.email
