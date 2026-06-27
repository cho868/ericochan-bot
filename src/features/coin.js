// =============================================================
//  コイントス（！コイントス or botにメンションで「コイントス」）
// =============================================================
const { lotteryByWeight } = require('../util');

function handle(message, client) {
  const triggered =
    message.content.match(/^！コイントス/) ||
    (message.mentions.has(client.user) && message.content.match(/コイントス/));
  if (!triggered) return;

  const ret = lotteryByWeight(['表', '裏'], [1, 1]);
  client.channels.cache.get(message.channel.id).send(ret);
}

module.exports = { handle };
