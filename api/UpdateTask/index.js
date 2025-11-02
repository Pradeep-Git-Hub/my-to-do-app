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
  context.log('UpdateTask function processed a request.');
  try {
    ensureClient();
    const id = context.bindingData.id;
    if (!id) {
      context.res = { status: 400, body: { error: 'id is required in route' } };
      return;
    }
    const { resource: existing } = await container.item(id, id).read().catch(() => ({ resource: null }));
    if (!existing) {
      context.res = { status: 404, body: { error: 'item not found' } };
      return;
    }
    const body = req.body || {};
    const updated = Object.assign({}, existing, {
      title: body.title !== undefined ? body.title : existing.title,
      completed: body.completed !== undefined ? !!body.completed : existing.completed,
      updatedAt: new Date().toISOString()
    });
    const { resource } = await container.item(id, id).replace(updated);
    context.res = { status: 200, body: resource };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
