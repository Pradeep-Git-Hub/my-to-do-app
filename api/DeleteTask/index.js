const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || 'TodoDb';
const containerId = process.env.COSMOS_CONTAINER || 'Tasks';

let client;
let container;

function ensureClient() {
  if (!client) {
    if (!endpoint || !key) throw new Error('COSMOS_ENDPOINT and COSMOS_KEY must be set');
    client = new CosmosClient({ endpoint, key });
    container = client.database(databaseId).container(containerId);
  }
}

module.exports = async function (context, req) {
  context.log('DeleteTask function processed a request.');
  try {
    ensureClient();
    const id = context.bindingData.id;
    if (!id) {
      context.res = { status: 400, body: { error: 'id is required in route' } };
      return;
    }
    await container.item(id, id).delete().catch(() => null);
    context.res = { status: 204 };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
