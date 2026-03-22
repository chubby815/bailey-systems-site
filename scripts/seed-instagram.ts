import { kv } from '../lib/kv'

async function main() {
  await kv.set('instagram:lilianajs27@gmail.com', {
    accountId:       '17841478629437494',
    accountName:     'poshagent88',
    username:        'poshagent88',
    pageAccessToken: 'EAANiKIN2i70BRAmYHsM8wdwjVOGDtUdMr9A1iajUnxCfbeZBwv8GzCEFmP5ADPHj4DZAxAexC8WawJioKkReS3vXHNxNlRc9pglr6x913Sj9uwHll9B9aIKBzvWqRbCVPTQWCefjgub5K3AP79rZBbsZAwC6U4h6xnUNZBBb1Dt4FslEcOIvuSy3f4YYKLLGzctNuVuxBB0UbVyurJJ41',
    pageId:          '61587990853842',
    connectedAt:     new Date().toISOString(),
  })
  console.log('Done! instagram:lilianajs27@gmail.com saved to Redis.')
}

main().catch(console.error)
