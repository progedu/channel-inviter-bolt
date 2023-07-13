import { App, LogLevel, GenericMessageEvent } from '@slack/bolt';
import { UsersLookupByEmailResponse } from '@slack/web-api';

const inviter = process.env.SLACK_INVETER || 'sifue';

// 招待コマンド受け取りBot
const appBot = new App({
  logLevel: LogLevel.INFO, // デバッグするときには DEBUG に変更
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

// 招待WebAPI実行側クライアント
const appWebAPI = new App({
  token: process.env.INVITER_SLACK_USER_TOKEN,
  signingSecret: process.env.INVITER_SLACK_SIGNING_SECRET,
});

// チャンネルマップインフォbotのコマンド操作の確認
appBot.message(/^!chan-in$/, async ({ message, say }) => {
  const m = message as GenericMessageEvent;
  await say(
    '■チャンネル招待/削除ボットの使い方\n' +
      '注1) チャンネルIDはチャンネルのリンクURLのパスの末尾の文字列(例: G4AK35007) \n' +
      '注2) 元々パブリックだったプライベートチャンネルはうまく招待できません。新たに作って下さい。 \n' +
      `注3) チャンネルには、Slackにて ${inviter} を招待して利用してください。 \n` +
      'チャンネル招待(複数同時取得可): `!chan-in-conv チャンネルID メールアドレス( メールアドレス メールアドレス...)`\n' +
      'チャンネルから削除(複数同時取得可): `!chan-kick-conv チャンネルID メールアドレス( メールアドレス メールアドレス...)`\n' +
      'emailからSlackでの名前とユーザーIDを取得(複数同時取得可): `!mail2s メールアドレス( メールアドレス メールアドレス...)`\n' +
      'チャンネルからチャンネルへのメンバーのコピー: `!member-cp 元チャンネルID 先チャンネルID` \n' +
      '\n' +
      '■不具合・要望・お問い合わせ\n' +
      'kdg_info@nnn.ac.jp まで\n',
  );
});

// email情報からSlackIDを取得
appBot.message(/^!mail2s(( [^ ]+){1,})$/i, async ({ message, say }) => {
  const m = message as GenericMessageEvent;
  const parsed = m.text?.match(/^!mail2s(( [^ ]+){1,})$/i);
  if (!parsed) {
    await say(`emailが指定されていません。`);
    return;
  }

  const emails = parsed[1].trim().split(' ');
  if (!emails) {
    await say(`emailが指定されていません。`);
    return;
  }
  for (let email of emails) {
    try {
      let regex = /<mailto:(.+)\|/; // 'mailto:'から'|'までの文字列を取得する
      let match = email.match(regex);
      if (match) {
        // もし <mailto:soichiro_yoshimura@nnn.ac.jp|soichiro_yoshimura@nnn.ac.jp> の形式なら中身を取得
        email = match[1];
      }

      const rookupByEmailResult = (await appWebAPI.client.users.lookupByEmail({
        email,
      })) as UsersLookupByEmailResponse;
      const user = rookupByEmailResult.user;
      say(
        `[INFO] Slackでの ${email} のSlack上の名前は ${user?.name} 、ユーザーIDは ${user?.id} 、表示名は ${user?.profile?.display_name} です。`,
      );
      // Web API Tier 3	50+ per minute なので 1.2秒待つ 参考: https://api.slack.com/methods/users.lookupByEmail
      await sleep(1200);
    } catch (err) {
      say(`[ERROR] SlackでのAPIの実行エラー email: ${email} err: ${err}`);
    }
  }
});

/**
 * 指定時間処理を停止する関数
 * @param {number} ms 待機するミリ秒数
 */
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  await appBot.start();
})();
